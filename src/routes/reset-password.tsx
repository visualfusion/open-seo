import { Link, createFileRoute } from "@tanstack/react-router";
import { useAppForm } from "@/client/components/form/useAppForm";
import { Alert, AlertDescription } from "@/client/components/ui/alert";
import { Button } from "@/client/components/ui/button";
import {
  AuthPageCard,
  AuthPageShell,
  authRedirectSearchSchema,
} from "@/client/features/auth/AuthPage";
import { passwordSchema } from "@/client/features/auth/passwordSchema";
import { getFormError } from "@/client/lib/forms";
import { getTranslation, useLocale } from "@/client/lib/i18n";
import { authClient } from "@/lib/auth-client";
import { isHostedClientAuthMode } from "@/lib/auth-mode";
import { getSignInSearch, normalizeAuthRedirect } from "@/lib/auth-redirect";
import { z } from "zod";
import { pageHead } from "@/client/lib/pageHead";

const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((value) => value.password === value.confirmPassword, {
    error: () => getTranslation("auth.sign_up.passwords_mismatch"),
    path: ["confirmPassword"],
  });

const resetPasswordSearchSchema = authRedirectSearchSchema.extend({
  error: z.string().optional(),
  token: z.string().optional(),
});

export const Route = createFileRoute("/reset-password")({
  head: () => pageHead("Reset password"),
  validateSearch: resetPasswordSearchSchema,
  component: ResetPasswordPage,
});

function getResetPasswordErrorMessage(error: string | undefined) {
  switch ((error ?? "").toLowerCase()) {
    case "invalid_token":
      return getTranslation("auth.reset_password.invalid_token");
    case "token_expired":
      return getTranslation("auth.reset_password.token_expired");
    default:
      return error ? getTranslation("auth.reset_password.generic_error") : null;
  }
}

function getResetPasswordPageCopy({
  isHostedMode,
  isComplete,
  routeError,
  hasToken,
}: {
  isHostedMode: boolean;
  isComplete: boolean;
  routeError: string | null;
  hasToken: boolean;
}) {
  if (!isHostedMode) {
    return {
      title: getTranslation("auth.reset_password.title"),
      helperText: getTranslation("auth.reset_password.unavailable_helper"),
    };
  }

  if (isComplete) {
    return {
      title: getTranslation("auth.reset_password.updated_title"),
      helperText: getTranslation("auth.reset_password.updated_helper"),
    };
  }

  if (routeError || !hasToken) {
    return {
      title: getTranslation("auth.reset_password.expired_title"),
      helperText:
        routeError || getTranslation("auth.reset_password.invalid_token"),
    };
  }

  return {
    title: getTranslation("auth.reset_password.title"),
    helperText: getTranslation("auth.reset_password.choose_helper"),
  };
}

function ResetPasswordPage() {
  const { t } = useLocale();
  const search = Route.useSearch();
  const redirectTo = normalizeAuthRedirect(search.redirect);
  const isHostedMode = isHostedClientAuthMode();
  const routeError = getResetPasswordErrorMessage(search.error);
  const token = search.token;
  const form = useAppForm({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    validators: {
      onSubmit: resetPasswordSchema,
    },
    // The form only renders when the URL carries a token.
    onSubmit: async ({ formApi, value }) => {
      try {
        const result = await authClient.resetPassword({
          newPassword: value.password,
          token,
        });

        if (result.error) {
          formApi.setErrorMap({
            onSubmit: {
              form:
                result.error.code === "INVALID_TOKEN" || !result.error.message
                  ? t("auth.reset_password.invalid_token")
                  : result.error.message,
              fields: {},
            },
          });
          return;
        }
      } catch {
        formApi.setErrorMap({
          onSubmit: {
            form: t("auth.reset_password.failed_retry"),
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
          isComplete: state.isSubmitSuccessful && !state.errorMap.onSubmit,
          submitError: state.errorMap.onSubmit,
          isSubmitting: state.isSubmitting,
        })}
      >
        {({ isComplete, submitError, isSubmitting }) => {
          const errorMessage = getFormError(submitError);
          const pageCopy = getResetPasswordPageCopy({
            isHostedMode,
            isComplete,
            routeError,
            hasToken: !!token,
          });

          return (
            <AuthPageCard
              title={pageCopy.title}
              helperText={pageCopy.helperText}
              footer={
                isComplete ? undefined : (
                  <p className="text-sm">
                    <Link
                      to="/sign-in"
                      search={getSignInSearch(redirectTo)}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {t("auth.sign_in.title")}
                    </Link>
                  </p>
                )
              }
            >
              {!isHostedMode ? null : isComplete ? (
                <Button
                  nativeButton={false}
                  variant="secondary"
                  className="w-full"
                  render={
                    <Link to="/sign-in" search={getSignInSearch(redirectTo)} />
                  }
                >
                  {t("auth.reset_password.continue_sign_in")}
                </Button>
              ) : routeError || !token ? (
                <Button
                  nativeButton={false}
                  variant="secondary"
                  className="w-full"
                  render={
                    <Link
                      to="/forgot-password"
                      search={getSignInSearch(redirectTo)}
                    />
                  }
                >
                  {t("auth.reset_password.request_new")}
                </Button>
              ) : (
                <form.AppForm>
                  <form.Form className="space-y-4">
                    <form.AppField name="password">
                      {(field) => (
                        <field.TextField
                          label={t("auth.reset_password.new_password_label")}
                          type="password"
                          placeholder={t(
                            "auth.reset_password.new_password_placeholder",
                          )}
                          autoComplete="new-password"
                          required
                        />
                      )}
                    </form.AppField>
                    <form.AppField name="confirmPassword">
                      {(field) => (
                        <field.TextField
                          label={t(
                            "auth.reset_password.confirm_password_label",
                          )}
                          type="password"
                          placeholder={t(
                            "auth.reset_password.confirm_password_placeholder",
                          )}
                          autoComplete="new-password"
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
                    >
                      {isSubmitting
                        ? t("auth.reset_password.submitting")
                        : t("auth.reset_password.submit")}
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
