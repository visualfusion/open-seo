import { Link, createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/client/components/ui/button";
import { Spinner } from "@/client/components/ui/spinner";
import {
  AuthPageCard,
  AuthPageShell,
  authRedirectSearchSchema,
} from "@/client/features/auth/AuthPage";
import { getTranslation, useLocale } from "@/client/lib/i18n";
import { captureClientEvent } from "@/client/lib/posthog";
import { authClient, useSession } from "@/lib/auth-client";
import {
  isEmailVerificationBypassed,
  isHostedClientAuthMode,
} from "@/lib/auth-mode";
import { getSignInSearch, normalizeAuthRedirect } from "@/lib/auth-redirect";
import { z } from "zod";
import { pageHead } from "@/client/lib/pageHead";

const verificationIssueSchema = z
  .enum(["invalid_token", "token_expired", "user_not_found", "unknown"])
  .catch("unknown");

const verifyEmailSearchSchema = authRedirectSearchSchema.extend({
  error: z.string().optional(),
  email: z.string().optional(),
});

export const Route = createFileRoute("/verify-email")({
  head: () => pageHead("Verify email"),
  validateSearch: verifyEmailSearchSchema,
  component: VerifyEmailPage,
});

function getVerificationErrorMessage(error: string | undefined) {
  switch ((error ?? "").toLowerCase()) {
    case "invalid_token":
      return getTranslation("auth.verify_email.invalid_token");
    case "token_expired":
      return getTranslation("auth.verify_email.token_expired");
    case "user_not_found":
      return getTranslation("auth.verify_email.user_not_found");
    default:
      return error ? getTranslation("auth.verify_email.unknown_error") : null;
  }
}

function getVerifyEmailPageCopy({
  isHostedMode,
  errorMessage,
  isPending,
  isRedirecting,
  email,
}: {
  isHostedMode: boolean;
  errorMessage: string | null;
  isPending: boolean;
  isRedirecting: boolean;
  email: string | undefined;
}) {
  if (!isHostedMode) {
    return {
      title: getTranslation("auth.verify_email.title"),
      helperText: getTranslation("auth.verify_email.unavailable_helper"),
    };
  }

  if (errorMessage) {
    return {
      title: getTranslation("auth.verify_email.failed_title"),
      helperText: undefined,
    };
  }

  if (isRedirecting) {
    return {
      title: getTranslation("auth.verify_email.confirmed_title"),
      helperText: getTranslation("auth.verify_email.confirmed_helper"),
    };
  }

  if (isPending) {
    return {
      title: getTranslation("auth.verify_email.title"),
      helperText: getTranslation("auth.verify_email.checking_helper"),
    };
  }

  return {
    title: getTranslation("auth.verify_email.verify_your_email"),
    helperText: email
      ? getTranslation("auth.verify_email.sent_to_email", undefined, { email })
      : getTranslation("auth.verify_email.check_inbox"),
  };
}

function VerifyEmailPage() {
  const { t } = useLocale();
  const search = Route.useSearch();
  const redirectTo = normalizeAuthRedirect(search.redirect);
  const isHostedMode = isHostedClientAuthMode();
  const { data: session, isPending } = useSession();
  const bypassEmailVerification = isEmailVerificationBypassed();
  const errorMessage = getVerificationErrorMessage(search.error);
  const verificationIssueType = search.error
    ? verificationIssueSchema.parse(search.error)
    : null;
  const email = search.email ?? session?.user?.email;
  const isVerified = !!session?.user?.emailVerified;
  const [isResending, setIsResending] = useState(false);
  // Verified (or bypass) users are sent on to the app by the effect below; until
  // that lands we show the redirecting state instead of the resend prompt.
  const isRedirecting =
    isVerified || (bypassEmailVerification && Boolean(session?.user?.id));
  const pageCopy = getVerifyEmailPageCopy({
    isHostedMode,
    errorMessage,
    isPending,
    isRedirecting,
    email,
  });

  useEffect(() => {
    if (
      isPending ||
      (!isVerified && !(bypassEmailVerification && session?.user?.id))
    ) {
      return;
    }

    if (isVerified) {
      captureClientEvent("auth:verification_success", {
        redirect_to: redirectTo,
      });
    }

    // Full page reload instead of client-side navigation: the auth→app
    // transition needs a clean server-side load so that all server function
    // handlers are freshly registered (client-side nav during Vite HMR can
    // hit the server before updated handlers are ready, causing
    // "action is not a function" errors).
    window.location.replace(redirectTo);
  }, [
    bypassEmailVerification,
    isPending,
    isVerified,
    redirectTo,
    session?.user?.id,
  ]);

  useEffect(() => {
    if (!verificationIssueType) {
      return;
    }

    captureClientEvent("auth:verification_issue", {
      issue_type: verificationIssueType,
    });
  }, [verificationIssueType]);

  async function handleResend() {
    if (!email) return;
    setIsResending(true);
    try {
      const callbackURL = new URL("/verify-email", window.location.origin);
      if (redirectTo !== "/")
        callbackURL.searchParams.set("redirect", redirectTo);
      const result = await authClient.sendVerificationEmail({
        email,
        callbackURL: callbackURL.toString(),
      });
      if (result.error) {
        toast.error(
          result.error.message || t("auth.verify_email.resend_failed"),
        );
        return;
      }
      captureClientEvent("auth:verification_resend");
      toast.success(t("auth.verify_email.resent_toast"));
    } catch {
      toast.error(t("auth.verify_email.resend_failed_retry"));
    } finally {
      setIsResending(false);
    }
  }

  return (
    <AuthPageShell>
      <AuthPageCard
        title={pageCopy.title}
        helperText={pageCopy.helperText}
        footer={
          <p className="text-sm">
            <Link
              to="/sign-in"
              search={getSignInSearch(redirectTo)}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {t("auth.common.back_to_sign_in")}
            </Link>
          </p>
        }
      >
        {!isHostedMode ? null : errorMessage ? (
          <p className="text-sm text-destructive">{errorMessage}</p>
        ) : isPending || isRedirecting ? (
          <div className="flex justify-center py-4">
            <Spinner />
          </div>
        ) : email ? (
          <Button
            type="button"
            variant="secondary"
            className="w-full"
            pending={isResending}
            onClick={() => void handleResend()}
          >
            {isResending
              ? t("auth.verify_email.resending")
              : t("auth.verify_email.resend")}
          </Button>
        ) : null}
      </AuthPageCard>
    </AuthPageShell>
  );
}
