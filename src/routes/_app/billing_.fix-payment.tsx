import { useLocale } from "@/client/lib/i18n";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { isHostedClientAuthMode } from "@/lib/auth-mode";
import { useQuery } from "@tanstack/react-query";
import {
  organizationContextQueryOptions,
  useCanManageBilling,
} from "@/client/features/team/organizationQueries";
import { getStandardErrorMessage } from "@/client/lib/error-messages";
import { captureClientError, captureClientEvent } from "@/client/lib/posthog";
import {
  billingAccountQueryOptions,
  prefetchBillingAccount,
} from "@/client/features/billing/billingAccountQuery";
import { createBillingPortalSession } from "@/serverFunctions/billing";
import { BILLING_ROUTE } from "@/shared/billing";
import { QueryError } from "@/client/components/QueryState";
import { SkeletonPage } from "@/client/components/SkeletonPresets";
import { Spinner } from "@/client/components/Spinner";
import { Button } from "@/client/components/ui/button";
import { pageHead } from "@/client/lib/pageHead";

const SUPPORT_EMAIL = "support@openseo.so";

// How long the post-portal "checking" screen polls Autumn before telling the
// user the retry is still pending, and how often it polls.
const CHECKING_TIMEOUT_MS = 30_000;
const CHECKING_POLL_MS = 1000;

// Linked from the payment-failed email. Deliberately narrower than /billing:
// one problem, one fix. The Stripe portal both saves the new card as the
// default and lets the customer pay the open invoice, so it is the only action.
export const Route = createFileRoute("/_app/billing_/fix-payment")({
  head: () => pageHead("Billing"),
  // The loader fills the module-scoped query client, so keep it out of server
  // requests: one worker isolate must not cache another account's billing.
  ssr: false,
  validateSearch: (search: Record<string, unknown>): { returned?: true } => ({
    returned:
      search.returned === true || search.returned === "true" ? true : undefined,
  }),
  beforeLoad: () => {
    if (!isHostedClientAuthMode()) {
      throw notFound();
    }
  },
  // Most visits are full loads from the payment-failed email: start the
  // billing read alongside the session check, not after it.
  loader: () => prefetchBillingAccount(),
  component: FixPaymentPage,
});

function FixPaymentPage() {
  const { t } = useLocale();
  const { returned } = Route.useSearch();
  const [isOpeningPortal, setIsOpeningPortal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checkingTimedOut, setCheckingTimedOut] = useState(false);
  const viewCaptured = useRef(false);

  const accountQuery = useQuery({
    ...billingAccountQueryOptions(),
    // Stripe retries the invoice with the new card and Autumn relays the
    // result a few seconds later; poll until the subscription is no longer
    // past due. An interval never cancels a read in flight, unlike refetch().
    refetchInterval: (query) =>
      returned && !checkingTimedOut && query.state.data?.isPastDue
        ? CHECKING_POLL_MS
        : false,
  });
  const account = accountQuery.data;

  const canManageBilling = useCanManageBilling();
  // The hook above reports true while the role loads (a UI choice); the
  // telemetry waits for the real role.
  const roleResolved =
    useQuery(organizationContextQueryOptions()).data !== undefined;

  const isLoaded = account !== undefined;
  const isPastDue = account?.isPastDue ?? false;
  const isChecking = Boolean(returned) && isPastDue && !checkingTimedOut;

  useEffect(() => {
    if (!isChecking) return;
    const timeout = setTimeout(() => {
      setCheckingTimedOut(true);
      // The user did the right thing and we could not confirm it worked.
      // Rare enough that every occurrence is worth a look.
      captureClientError(
        new Error("Subscription still past due after billing portal return"),
        { context: "fix_payment_check_timeout" },
      );
    }, CHECKING_TIMEOUT_MS);
    return () => clearTimeout(timeout);
  }, [isChecking]);

  // Funnel: viewed -> portal_opened -> returned -> payment_fixed. Each fires
  // once per page load; `returned` is a full navigation back from Stripe.
  useEffect(() => {
    if (!isLoaded || !roleResolved || viewCaptured.current) return;
    viewCaptured.current = true;
    captureClientEvent(
      returned ? "billing:fix_payment_returned" : "billing:fix_payment_viewed",
      { past_due: isPastDue, can_manage_billing: canManageBilling },
    );
  }, [isLoaded, roleResolved, returned, isPastDue, canManageBilling]);

  useEffect(() => {
    if (returned && isLoaded && !isPastDue) {
      captureClientEvent("billing:payment_fixed");
    }
  }, [returned, isLoaded, isPastDue]);

  async function openPortal() {
    setError(null);
    setIsOpeningPortal(true);
    captureClientEvent("billing:fix_payment_portal_opened");
    try {
      window.location.assign(
        await createBillingPortalSession({
          data: { returnTo: "/billing/fix-payment?returned=true" },
        }),
      );
    } catch (err) {
      captureClientError(err, { context: "fix_payment_open_portal" });
      setError(
        getStandardErrorMessage(
          err,
          "We couldn't open the billing portal. Please try again.",
        ),
      );
      setIsOpeningPortal(false);
    }
  }

  if (accountQuery.isPending) {
    return <SkeletonPage />;
  }

  // A failed refetch keeps the loaded page; only a failed first read stops.
  if (!isLoaded) {
    return (
      <Page title={t("billing.details.billing_unavailable")}>
        <QueryError
          cause={accountQuery.error}
          fallback={t("billing.details.we_couldn_t_load_now_please")}
          onRetry={() => void accountQuery.refetch()}
          isRetrying={accountQuery.isFetching}
        />
      </Page>
    );
  }

  if (isChecking) {
    return (
      <Page title={t("billing.details.checking_your_payment")}>
        <Spinner />
        <p className="text-sm text-muted-foreground">
          {t("billing.details.stripe_is_retrying_the_card_this")}
        </p>
      </Page>
    );
  }

  if (!isPastDue) {
    return (
      <Page
        title={
          returned
            ? t("billing.details.you_re_all_set")
            : t("billing.details.your_billing_is_up_to_date")
        }
      >
        <p className="text-sm text-muted-foreground">
          {returned
            ? t("billing.details.the_payment_went_through_active_again")
            : t(
                "billing.details.there_s_nothing_outstanding_on_your_account",
              )}{" "}
          <Link
            to={BILLING_ROUTE}
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            {t("billing.details.back_to_billing")}
          </Link>
        </p>
      </Page>
    );
  }

  if (!canManageBilling) {
    return (
      <Page title={t("billing.details.fix_your_payment")}>
        <p className="text-sm text-muted-foreground">
          {t("billing.details.a_payment_for_this_through_only")}
        </p>
      </Page>
    );
  }

  return (
    <Page
      title={
        returned
          ? t("billing.details.still_showing_as_unpaid")
          : t("billing.details.fix_your_payment")
      }
    >
      <p className="text-sm text-muted-foreground">
        {returned
          ? t("billing.details.your_subscription_is_still_can_take")
          : t("billing.details.your_last_payment_didn_usually_means")}
      </p>

      <div className="rounded-lg border border-border bg-card p-4">
        <p className="text-sm font-semibold">
          {t("billing.details.update_your_payment_method")}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          {t("billing.details.add_a_working_card_it_becomes")}
        </p>
        <Button
          size="sm"
          className="mt-3"
          pending={isOpeningPortal}
          onClick={() => void openPortal()}
        >
          {isOpeningPortal
            ? t("billing.details.opening_stripe")
            : t("billing.details.open_billing_portal")}
        </Button>
      </div>

      {error ? (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      ) : null}
    </Page>
  );
}

function Page({ title, children }: { title: string; children: ReactNode }) {
  const { t } = useLocale();
  return (
    <div className="mx-auto box-content max-w-7xl space-y-5 px-4 py-4 pb-24 md:px-6 md:py-6 md:pb-8">
      <div>
        <p className="text-sm font-medium text-muted-foreground">
          {t("billing.details.billing")}
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight">{title}</h1>
      </div>
      {children}
      <p className="text-xs text-muted-foreground">
        {t("billing.details.something_look_wrong_email")} {SUPPORT_EMAIL}.
      </p>
    </div>
  );
}
