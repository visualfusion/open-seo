import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { Alert, AlertDescription } from "@/client/components/ui/alert";
import { Button } from "@/client/components/ui/button";
import { AuthPageCard, AuthPageShell } from "@/client/features/auth/AuthPage";
import { clearLastProjectId } from "@/client/lib/active-project";
import { useLocale } from "@/client/lib/i18n";
import { pageHead } from "@/client/lib/pageHead";
import { authClient } from "@/lib/auth-client";
import { isHostedClientAuthMode } from "@/lib/auth-mode";
import { getStripeProjectsLoginAccount } from "@/serverFunctions/stripe-projects";

const loginResultSchema = z.object({ path: z.string() });

/**
 * Where `stripe projects open openseo` lands. Signing in takes a click on a
 * page that names the account, so a link someone else sent can't quietly sign
 * the visitor in to that person's account.
 */
export const Route = createFileRoute("/stripe-projects/login")({
  head: () => pageHead("Sign in"),
  beforeLoad: () => {
    if (!isHostedClientAuthMode()) throw notFound();
  },
  validateSearch: z.object({ token: z.string().optional() }),
  loaderDeps: ({ search }) => ({ token: search.token }),
  loader: ({ deps }) =>
    deps.token
      ? getStripeProjectsLoginAccount({ data: { token: deps.token } })
      : null,
  component: StripeProjectsLoginPage,
});

function StripeProjectsLoginPage() {
  const { t } = useLocale();
  const account = Route.useLoaderData();
  const { token } = Route.useSearch();
  const [pending, setPending] = useState(false);
  const [failed, setFailed] = useState(false);

  async function signIn() {
    setPending(true);
    const result = await authClient.$fetch("/stripe-projects/login", {
      method: "POST",
      body: { token },
    });
    const login = loginResultSchema.safeParse(result.data);
    if (!login.success) {
      setFailed(true);
      setPending(false);
      return;
    }
    // Full navigation: cached queries and the remembered project may belong
    // to another account that was signed in here.
    clearLastProjectId();
    window.location.assign(login.data.path);
  }

  if (!account || failed) {
    return (
      <AuthPageShell>
        <AuthPageCard
          title={t("auth.stripe_projects.login.expired_title")}
          helperText={t("auth.stripe_projects.login.expired_helper")}
        >
          <Alert>
            <AlertDescription>
              {t("auth.stripe_projects.login.expired_alert_prefix")}
              <code>stripe projects open openseo</code>
              {t("auth.stripe_projects.login.expired_alert_suffix")}
            </AlertDescription>
          </Alert>
          <Button
            nativeButton={false}
            render={<Link to="/sign-in" />}
            variant="secondary"
            className="w-full"
          >
            {t("auth.stripe_projects.login.sign_in_another")}
          </Button>
        </AuthPageCard>
      </AuthPageShell>
    );
  }

  return (
    <AuthPageShell>
      <AuthPageCard
        title={t("auth.stripe_projects.login.title")}
        helperText={t("auth.stripe_projects.login.helper", {
          email: account.email,
        })}
      >
        <Button className="w-full" disabled={pending} onClick={signIn}>
          {t("auth.stripe_projects.login.continue_as", {
            email: account.email,
          })}
        </Button>
        <p className="text-center text-sm text-muted-foreground">
          {t("auth.stripe_projects.login.not_your_account")}
        </p>
      </AuthPageCard>
    </AuthPageShell>
  );
}
