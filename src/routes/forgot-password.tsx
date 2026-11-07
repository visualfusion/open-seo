import { Link, createFileRoute } from "@tanstack/react-router";
import { useAppForm } from "@/client/components/form/useAppForm";
import { Alert, AlertDescription } from "@/client/components/ui/alert";
import { Button } from "@/client/components/ui/button";
import {
  AuthPageCard,
  AuthPageShell,
  authRedirectSearchSchema,
} from "@/client/features/auth/AuthPage";
import { getFormError } from "@/client/lib/forms";
import { getTranslation, useLocale } from "@/client/lib/i18n";
import { authClient } from "@/lib/auth-client";
import { isHostedClientAuthMode, usesBetterAuthClient } from "@/lib/auth-mode";
import { getSignInSearch, normalizeAuthRedirect } from "@/lib/auth-redirect";
import { z } from "zod";
import { pageHead } from "@/client/lib/pageHead";

const forgotPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .email({ error: () => getTranslation("auth.common.email_invalid") }),
});

export const Route = createFileRoute("/forgot-password")({
  head: () => pageHead("Forgot password"),
  validateSearch: authRedirectSearchSchema,
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const { t } = useLocale();
  const search = Route.useSearch();
  const redirectTo = normalizeAuthRedirect(search.redirect);
  const isHostedMode = isHostedClientAuthMode();
  // Self-hosted accounts have no email transport; the operator resets
  // passwords with the admin command.
  const isOperatorReset = !isHostedMode && usesBetterAuthClient();

  const form = useAppForm({
    defaultValues: {
      email: "",
    },
    validators: {
      onSubmit: forgotPasswordSchema,
    },
    onSubmit: async ({ formApi, value }) => {
      try {
        const redirectUrl = new URL("/reset-password", window.location.origin);
        if (redirectTo !== "/")
          redirectUrl.searchParams.set("redirect", redirectTo);
        const result = await authClient.requestPasswordReset({
          email: value.email.trim(),
          redirectTo: redirectUrl.toString(),
        });

        if (result.error) {
          formApi.setErrorMap({
            onSubmit: {
              form: result.error.message || t("auth.forgot_password.failed"),
              fields: {},
            },
          });
          return;
        }
      } catch {
        formApi.setErrorMap({
          onSubmit: {
            form: t("auth.forgot_password.failed_retry"),
            fields: {},
          },
        });
      }
    },
  });

  return (
    <AuthPageShell>
      <form.Subscribe
        selector={(state) => ({
          isSuccess: state.isSubmitSuccessful && !state.errorMap.onSubmit,
          submittedEmail: state.values.email,
          submitError: state.errorMap.onSubmit,
          isSubmitting: state.isSubmitting,
        })}
      >
        {({ isSuccess, submittedEmail, submitError, isSubmitting }) => {
          const errorMessage = getFormError(submitError);

          return (
            <AuthPageCard
              title={
                isSuccess
                  ? t("auth.forgot_password.check_email_title")
                  : t("auth.forgot_password.title")
              }
              helperText={
                isSuccess
                  ? undefined
                  : isHostedMode
                    ? t("auth.forgot_password.helper_hosted")
                    : isOperatorReset
                      ? t("auth.forgot_password.helper_operator")
                      : t("auth.forgot_password.helper_unavailable")
              }
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
              {isSuccess ? (
                <Alert variant="success">
                  <AlertDescription>
                    {t("auth.forgot_password.sent_desc", {
                      email: submittedEmail,
                    })}
                  </AlertDescription>
                </Alert>
              ) : (
                <form.AppForm>
                  <form.Form className="space-y-4">
                    <form.AppField name="email">
                      {(field) => (
                        <field.TextField
                          label={t("auth.common.email_label")}
                          type="email"
                          placeholder={t("auth.common.email_placeholder")}
                          autoComplete="email"
                          disabled={!isHostedMode}
                          required
                        />
                      )}
                    </form.AppField>

                    {errorMessage ? (
                      <Alert variant="destructive">
                        <AlertDescription>{errorMessage}</AlertDescription>
                      </Alert>
                    ) : null}
                    <Button
                      type="submit"
                      variant="secondary"
                      className="w-full"
                      pending={isSubmitting}
                      disabled={!isHostedMode}
                    >
                      {isSubmitting
                        ? t("auth.forgot_password.submitting")
                        : t("auth.forgot_password.submit")}
                    </Button>
                  </form.Form>
                </form.AppForm>
              )}
            </AuthPageCard>
          );
        }}
      </form.Subscribe>
    </AuthPageShell>
  );
}
