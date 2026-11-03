import { getTranslation, useLocale } from "@/client/lib/i18n";
import { useEffect, type ReactNode } from "react";
import { ShieldAlert } from "lucide-react";
import {
  getErrorCode,
  getStandardErrorMessage,
} from "@/client/lib/error-messages";
import { Alert, AlertDescription } from "@/client/components/ui/alert";
import { Button } from "@/client/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/client/components/ui/card";
import { getClientAuthMode, usesBetterAuthClient } from "@/lib/auth-mode";
import { getSignInHref, getSignInHrefForLocation } from "@/lib/auth-redirect";

const CLOUDFLARE_SETUP_GUIDE_URL =
  "https://github.com/every-app/open-seo/blob/main/docs/SELF_HOSTING_CLOUDFLARE.md#2-configure-authentication-and-secrets";

type CardProps = {
  message: string;
  onRetry: () => void;
};

/**
 * The card for an auth failure, else `fallback`. The route error boundary and
 * the landing redirect both render errors through this, so each auth error
 * code shows the same card everywhere.
 */
export function AuthErrorCard({
  error,
  onRetry,
  fallback,
}: {
  error: unknown;
  onRetry: () => void;
  fallback: ReactNode;
}) {
  const errorCode = getErrorCode(error);
  if (errorCode !== "AUTH_CONFIG_MISSING" && errorCode !== "UNAUTHENTICATED") {
    return fallback;
  }

  const message = getStandardErrorMessage(
    error,
    getTranslation("ui.details.something_wrong"),
  );
  return (
    <div className="flex h-full min-w-0 flex-1 items-center justify-center p-4">
      {errorCode === "AUTH_CONFIG_MISSING" ? (
        <AuthConfigErrorCard message={message} onRetry={onRetry} />
      ) : (
        <UnauthenticatedErrorCard message={message} onRetry={onRetry} />
      )}
    </div>
  );
}

function AuthConfigErrorCard({ message, onRetry }: CardProps) {
  const { t } = useLocale();
  // The hint names the settings of the mode the server actually runs; the
  // alert above already carries the server's exact message.
  const clientAuthMode = getClientAuthMode();

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShieldAlert className="size-5 text-destructive" />
          {t("auth.details.authentication_setup_required")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert variant="destructive">
          <AlertDescription>{message}</AlertDescription>
        </Alert>

        {clientAuthMode === "hosted" ? (
          <p className="text-muted-foreground">
            {t("auth.details.hosted_mode_requires")}{" "}
            <code className="mx-1">BETTER_AUTH_SECRET</code>
            {t("auth.details.32_characters")}{" "}
            <code className="mx-1">BETTER_AUTH_URL</code>
            {t("auth.details.and_google_oauth_credentials_on_the_deployment")}
          </p>
        ) : null}
        {clientAuthMode === "everyapp" ? (
          <p className="text-muted-foreground">
            {t("auth.details.openseo_runs_behind_an_signs_people")}{" "}
            <code className="mx-1">pnpm everyapp install</code>{" "}
            {t("auth.details.so_it_gets_the_and_open")}
          </p>
        ) : null}
        {clientAuthMode === "cloudflare_access" ? (
          <p className="text-muted-foreground">
            {t("auth.details.cloudflare_access_mode_requires")}
            <code className="mx-1">TEAM_DOMAIN</code>{" "}
            {t("auth.details.a_full_https_url_and")}
            <code className="mx-1">POLICY_AUD</code>{" "}
            {t("auth.details.set_on_the_deployment_protecting_this")}
          </p>
        ) : null}
      </CardContent>
      <CardFooter className="justify-end gap-2">
        <Button variant="ghost" onClick={onRetry}>
          {t("auth.details.try_again")}
        </Button>
        <Button
          nativeButton={false}
          render={
            <a
              href={CLOUDFLARE_SETUP_GUIDE_URL}
              target="_blank"
              rel="noreferrer"
            />
          }
        >
          {t("auth.details.open_setup_guide")}
        </Button>
      </CardFooter>
    </Card>
  );
}

function UnauthenticatedErrorCard({ message, onRetry }: CardProps) {
  const { t } = useLocale();
  // A sign-in page exists wherever Better Auth accounts do.
  const hasSignIn = usesBetterAuthClient();
  const signInHref =
    typeof window === "undefined"
      ? getSignInHref("/")
      : getSignInHrefForLocation(window.location);

  useEffect(() => {
    if (typeof window === "undefined" || !hasSignIn) {
      return;
    }

    window.location.replace(signInHref);
  }, [hasSignIn, signInHref]);

  if (hasSignIn) {
    return null;
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>{t("auth.details.authentication_required")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-muted-foreground">
        <p>{message}</p>
        <p>{t("auth.details.this_deployment_uses_external_session_then")}</p>
      </CardContent>
      <CardFooter className="justify-end">
        <Button onClick={onRetry}>{t("auth.details.try_again")}</Button>
      </CardFooter>
    </Card>
  );
}
