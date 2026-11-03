import { useLocale } from "@/client/lib/i18n";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { QueryError } from "@/client/components/QueryState";
import { StatusScreen } from "@/client/components/StatusScreen";
import {
  billingAccountQueryOptions,
  prefetchBillingAccount,
} from "@/client/features/billing/billingAccountQuery";
import {
  openUpgradeCheckout,
  prefetchUpgradeCheckout,
} from "@/client/features/billing/checkout";
import { AnnualPlanDialog } from "@/client/features/billing/AnnualPlanDialog";
import { PlanPageAccountMenu } from "@/client/features/billing/PlanPageAccountMenu";
import {
  PlanGuarantee,
  PlanOfferCard,
} from "@/client/features/billing/PlanOfferCard";
import { monthlyCreditsFeature } from "@/client/features/billing/plan-offers";
import {
  TIERS,
  isTier,
  type Tier,
} from "@/client/features/billing/subscribe-tiers";
import { captureClientEvent } from "@/client/lib/posthog";
import { useSession } from "@/lib/auth-client";
import { getStandardErrorMessage } from "@/client/lib/error-messages";
import { getSubscribeRouteState } from "@/client/features/billing/route-state";
import { normalizeAuthRedirect } from "@/lib/auth-redirect";
import { useCanManageBilling } from "@/client/features/team/organizationQueries";
import { SUPPORT_EMAIL } from "@/client/lib/support";
import { Button } from "@/client/components/ui/button";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/client/components/ui/toggle-group";

// How long the post-checkout "finalizing" screen polls Autumn before giving
// up and letting the user through anyway, and how often it polls.
const FINALIZING_TIMEOUT_MS = 30_000;
const FINALIZING_POLL_MS = 1000;

export const Route = createFileRoute("/_authenticated/subscribe")({
  // The loader fills the module-scoped query client, so keep it out of server
  // requests: one worker isolate must not cache another account's billing.
  ssr: false,
  validateSearch: (
    search: Record<string, unknown>,
  ): {
    upgrade?: true;
    redirect?: string;
    checkout?: "success";
    plan?: Tier;
    billing?: "yearly";
  } => ({
    upgrade:
      search.upgrade === true || search.upgrade === "true" ? true : undefined,
    redirect:
      typeof search.redirect === "string"
        ? normalizeAuthRedirect(search.redirect)
        : undefined,
    checkout: search.checkout === "success" ? "success" : undefined,
    plan: isTier(search.plan) ? search.plan : undefined,
    billing: search.billing === "yearly" ? "yearly" : undefined,
  }),
  loaderDeps: ({ search: { upgrade, checkout, plan } }) => ({
    upgrade,
    checkout,
    plan,
  }),
  // Start the billing read alongside the session check, not after it. Upgrade
  // links outside Billing land here with ?upgrade=true, and hovering one
  // preloads this route, so the checkout link starts before the click.
  loader: ({ deps }) => {
    prefetchBillingAccount();
    if (deps.upgrade && deps.checkout !== "success") {
      prefetchUpgradeCheckout(TIERS[deps.plan ?? "base"].offer.planId);
    }
  },
  component: SubscribePage,
});

function SubscribePage() {
  const { t } = useLocale();
  const navigate = useNavigate();
  const {
    upgrade: isUpgradeFlow,
    redirect,
    checkout,
    plan: requestedPlan,
    billing,
  } = Route.useSearch();
  const highlightedPlan = requestedPlan ?? "base";
  const { data: session } = useSession();
  // The plan whose checkout is opening, so only its button spins.
  const [attachingPlan, setAttachingPlan] = useState<Tier | null>(null);
  // The pricing page's Yearly switch carries over with ?billing=yearly.
  const [yearly, setYearly] = useState(billing === "yearly");
  // The yearly dialog keeps its last plan so its text doesn't blank out while
  // it animates closed.
  const [annualPlan, setAnnualPlan] = useState<Tier>("base");
  const [annualDialogOpen, setAnnualDialogOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [finalizingTimedOut, setFinalizingTimedOut] = useState(false);
  const checkoutCompleted = checkout === "success";

  const accountQuery = useQuery({
    ...billingAccountQueryOptions(),
    // Autumn can lag Stripe by a few seconds after checkout; poll until the
    // subscription shows up so the just-paid user isn't shown the paywall
    // again. An interval never cancels a read in flight, unlike refetch().
    refetchInterval: (query) =>
      checkoutCompleted &&
      !finalizingTimedOut &&
      query.state.data?.planStatus !== "paid"
        ? FINALIZING_POLL_MS
        : false,
  });
  const account = accountQuery.data;
  const paidPlanId = account?.paidPlanId ?? null;
  const paidPlanName = account?.paidPlanName ?? null;

  // Checkout is owner-only; other members hitting the paywall are pointed at
  // their organization owner instead of a Subscribe button that would 403.
  const canManageBilling = useCanManageBilling();

  const subscribeRouteState = getSubscribeRouteState({
    isCustomerLoading: accountQuery.isPending,
    isCustomerError: accountQuery.isError,
    hasCustomerData: account !== undefined,
    hasManagedAccess: account?.hasManagedAccess ?? false,
    planStatus: account?.planStatus ?? "free",
    isUpgradeFlow: isUpgradeFlow === true,
    checkoutCompleted,
    finalizingTimedOut,
  });

  // Armed once on landing with checkout=success (not on the finalizing state,
  // which a refetch with no cached data can leave for "loading" and re-enter)
  // so the deadline is a hard bound from arrival.
  useEffect(() => {
    if (!checkoutCompleted || finalizingTimedOut) return;
    const timeout = setTimeout(
      () => setFinalizingTimedOut(true),
      FINALIZING_TIMEOUT_MS,
    );
    return () => clearTimeout(timeout);
  }, [checkoutCompleted, finalizingTimedOut]);

  useEffect(() => {
    if (subscribeRouteState === "redirectToApp") {
      if (checkoutCompleted) {
        captureClientEvent("billing:checkout_success");
      } else if (requestedPlan && paidPlanId) {
        // A paying customer followed a pricing-page plan link. Switching
        // plans goes through support for now; say so instead of a silent
        // redirect.
        const wanted = TIERS[requestedPlan].offer;
        toast.info(
          paidPlanId === wanted.planId
            ? t("billing.details.you_re_already_on_the_value", {
                v1: wanted.name,
              })
            : t("billing.details.you_re_on_the_value", {
                v1: paidPlanName ?? "",
              }),
          {
            id: "subscribe-plan-switch",
            description:
              paidPlanId === wanted.planId
                ? undefined
                : t("billing.details.to_switch_to_the_value_email_value", {
                    v1: wanted.name,
                    v2: SUPPORT_EMAIL,
                  }),
            duration: 10_000,
          },
        );
      }
      void navigate({ href: redirect ?? "/", replace: true });
    }
  }, [
    checkoutCompleted,
    navigate,
    paidPlanId,
    paidPlanName,
    redirect,
    requestedPlan,
    subscribeRouteState,
    t,
  ]);

  useEffect(() => {
    if (subscribeRouteState === "showPaywall" && !isUpgradeFlow) {
      captureClientEvent("billing:paywall_viewed");
    }
  }, [isUpgradeFlow, subscribeRouteState]);

  if (
    subscribeRouteState === "loading" ||
    subscribeRouteState === "redirectToApp"
  ) {
    return <StatusScreen pending />;
  }

  if (subscribeRouteState === "finalizing") {
    return (
      <StatusScreen
        logo
        size="sm"
        title={t("ui.details.finalizing_your_subscription")}
        pending
        description={t("ui.details.this_usually_takes_a_few_seconds")}
        footer={
          <>
            {t("ui.details.taking_longer")}{" "}
            <a
              className="underline underline-offset-2 hover:text-foreground"
              href={`mailto:${SUPPORT_EMAIL}`}
            >
              {t("sam.support.email_title")} {SUPPORT_EMAIL}
            </a>
            .
          </>
        }
      />
    );
  }

  if (subscribeRouteState === "error") {
    return (
      <StatusScreen logo title={t("ui.details.billing_unavailable")} size="sm">
        <QueryError
          cause={accountQuery.error}
          fallback={t("ui.details.we_couldn_t_verify_now_please")}
          onRetry={() => void accountQuery.refetch()}
          isRetrying={accountQuery.isFetching}
        />
      </StatusScreen>
    );
  }

  async function handleSubscribe(tier: Tier) {
    setError(null);
    setAttachingPlan(tier);

    try {
      await openUpgradeCheckout(TIERS[tier].offer.planId);
    } catch (err) {
      setError(
        getStandardErrorMessage(
          err,
          "We couldn't start the checkout. Please try again.",
        ),
      );
      setAttachingPlan(null);
    }
  }

  function openAnnualDialog(tier: Tier) {
    setAnnualPlan(tier);
    setAnnualDialogOpen(true);
    captureClientEvent("billing:annual_plan_interest", {
      planId: TIERS[tier].offer.planId,
    });
  }

  const firstName = session?.user?.name?.split(" ")[0] || "";
  const annual = TIERS[annualPlan];

  return (
    <div className="w-full max-w-5xl space-y-6">
      <PlanPageAccountMenu email={session?.user?.email} />

      <div className="mx-auto max-w-sm space-y-3 text-center">
        <img
          src="/transparent-logo.png"
          alt="OpenSEO"
          className="mx-auto size-10 rounded-lg"
        />
        <h1 className="text-xl font-semibold">
          {isUpgradeFlow
            ? t("billing.details.upgrade_your_plan")
            : firstName
              ? t("billing.details.welcome_to_openseo_value", { v1: firstName })
              : t("ui.details.welcome_to_openseo")}
        </h1>
        <p className="text-sm text-muted-foreground">
          {t("ui.details.seo_on_your_terms_in_one")}
        </p>
      </div>

      <ToggleGroup
        variant="outline"
        spacing={0}
        value={[yearly ? "yearly" : "monthly"]}
        onValueChange={(next) => {
          // A press on the active item empties the group. Keep one item on.
          if (next[0]) setYearly(next[0] === "yearly");
        }}
        className="mx-auto"
        aria-label={t("ui.details.billing_period")}
      >
        <ToggleGroupItem
          value="monthly"
          className="px-4 aria-pressed:bg-primary/15 aria-pressed:text-primary"
        >
          {t("ui.details.monthly")}
        </ToggleGroupItem>
        <ToggleGroupItem
          value="yearly"
          className="px-4 aria-pressed:bg-primary/15 aria-pressed:text-primary"
        >
          {t("ui.details.yearly_2_months_free")}
        </ToggleGroupItem>
      </ToggleGroup>

      <div className="grid gap-4 md:grid-cols-3">
        {Object.keys(TIERS)
          .filter(isTier)
          .map((tier) => {
            const { offer, annualPriceUsd, description, features } =
              TIERS[tier];
            return (
              <PlanOfferCard
                key={tier}
                offer={offer}
                description={t(description)}
                priceLabel={
                  yearly
                    ? t("billing.details.annual_price", {
                        price: annualPriceUsd.toLocaleString(),
                      })
                    : undefined
                }
                features={[
                  ...features.map((feature) => t(feature)),
                  monthlyCreditsFeature(offer),
                ]}
                highlighted={tier === highlightedPlan}
              >
                {canManageBilling ? (
                  <Button
                    className="w-full"
                    variant={tier === highlightedPlan ? "default" : "secondary"}
                    pending={attachingPlan === tier}
                    // One checkout at a time: a second one would replace the first.
                    disabled={attachingPlan !== null}
                    onClick={() =>
                      yearly
                        ? openAnnualDialog(tier)
                        : void handleSubscribe(tier)
                    }
                  >
                    {attachingPlan === tier
                      ? t("ui.details.redirecting")
                      : t("ui.details.subscribe")}
                  </Button>
                ) : null}
              </PlanOfferCard>
            );
          })}
      </div>

      <div className="mx-auto max-w-sm space-y-3">
        {error ? (
          <p role="alert" className="text-center text-sm text-destructive">
            {error}
          </p>
        ) : null}
        {canManageBilling ? null : (
          <p className="text-center text-sm text-muted-foreground">
            {t("ui.details.only_the_organization_owner_to_upgrade")}
          </p>
        )}
        <PlanGuarantee />
        <p className="text-center text-xs">
          <a
            className="text-muted-foreground underline decoration-muted-foreground/40 decoration-dotted underline-offset-4 transition-colors hover:text-foreground"
            href="https://openseo.so/pricing"
            target="_blank"
            rel="noreferrer"
            onClick={() =>
              captureClientEvent("billing:pricing_estimator_click")
            }
          >
            {t("ui.details.how_far_do_usage_credits_go")}{" "}
            <span aria-hidden="true">&#8599;</span>
          </a>
        </p>
      </div>

      <div className="mx-auto max-w-sm text-center space-y-2">
        <p className="text-sm text-muted-foreground">
          {t("ui.details.questions_email")}{" "}
          <a
            className="underline underline-offset-2 hover:text-foreground"
            href={`mailto:${SUPPORT_EMAIL}`}
          >
            {SUPPORT_EMAIL}
          </a>
          .
        </p>
        {isUpgradeFlow ? (
          <Button
            type="button"
            variant="ghost"
            onClick={() => void navigate({ to: "/", replace: true })}
          >
            <ArrowRight className="size-3.5 rotate-180" />
            {t("ui.details.back_to_app")}
          </Button>
        ) : null}
      </div>

      <AnnualPlanDialog
        open={annualDialogOpen}
        onOpenChange={setAnnualDialogOpen}
        planName={annual.offer.name}
        annualPriceUsd={annual.annualPriceUsd}
        onSubscribeMonthly={() => void handleSubscribe(annualPlan)}
      />
    </div>
  );
}
