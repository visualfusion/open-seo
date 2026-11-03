import { useQuery } from "@tanstack/react-query";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { PageLoading } from "@/client/components/Spinner";
import { useAppForm } from "@/client/components/form/useAppForm";
import { Button } from "@/client/components/ui/button";
import {
  AuthPageCard,
  AuthMethodChooser,
  TermsAgreementNotice,
  authInputClassName,
  authSubmitClassName,
  authRedirectSearchSchema,
  useAuthPageState,
} from "@/client/features/auth/AuthPage";
import {
  TURNSTILE_SITE_KEY,
  TurnstileWidget,
  useTurnstileCaptcha,
} from "@/client/features/auth/TurnstileWidget";
import { passwordSchema } from "@/client/features/auth/passwordSchema";
import { signUpStatusQueryOptions } from "@/client/features/auth/signUpStatus";
import { useGoogleAuth } from "@/client/features/auth/useGoogleAuth";
import { getFormError } from "@/client/lib/forms";
import { getTranslation, useLocale } from "@/client/lib/i18n";
import { captureClientEvent } from "@/client/lib/posthog";
import { authClient } from "@/lib/auth-client";
import {
  getSignInSearch,
  getVerifyEmailSearch,
  toAuthCallbackURL,
} from "@/lib/auth-redirect";
import { z } from "zod";

const UTM_PARAMS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
] as const;

const signUpSchema = z
  .object({
    email: z
      .string()
      .trim()
      .email({ error: () => getTranslation("auth.common.email_invalid") }),
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((value) => value.password === value.confirmPassword, {
    error: () => getTranslation("auth.sign_up.passwords_mismatch"),
    path: ["confirmPassword"],
  });

export const Route = createFileRoute("/_auth/sign-up")({
  validateSearch: authRedirectSearchSchema.extend({
    domain: z.string().optional().catch(undefined),
    utm_source: z.string().optional().catch(undefined),
    utm_medium: z.string().optional().catch(undefined),
    utm_campaign: z.string().optional().catch(undefined),
    utm_content: z.string().optional().catch(undefined),
  }),
  component: SignUpPage,
});

function SignUpPage() {
  const { t } = useLocale();
  const search = Route.useSearch();
  const navigate = useNavigate();
  const { redirectTo, isHostedMode, isBetterAuthMode } = useAuthPageState(
    search.redirect,
  );
  const onboardingSearch = new URLSearchParams();
  if (search.domain) onboardingSearch.set("domain", search.domain);
  for (const name of UTM_PARAMS) {
    const value = search[name];
    if (value) onboardingSearch.set(name, value);
  }
  const postSignupRedirect =
    redirectTo !== "/"
      ? redirectTo
      : onboardingSearch.size > 0
        ? `/onboarding?${onboardingSearch.toString()}`
        : "/onboarding";
  const [showEmailForm, setShowEmailForm] = useState(false);
  const google = useGoogleAuth({ redirectTo, postSignupRedirect });
  // The standalone Docker edition: no Google, no email verification, and the
  // server accepts a sign-up only for the first account or an invited address
  // (src/server/standalone/sign-up.ts).
  const standalone = isBetterAuthMode && !isHostedMode;
  const invited = redirectTo.startsWith("/accept-invitation/");
  const signUpStatus = useQuery({
    ...signUpStatusQueryOptions(),
    enabled: standalone,
  });
  const firstAccount = signUpStatus.data?.firstAccount === true;
  const emailFormVisible = showEmailForm || standalone;

  // Turnstile is active only in hosted mode with a configured site key.
  const isTurnstileEnabled = isHostedMode && Boolean(TURNSTILE_SITE_KEY);
  const captcha = useTurnstileCaptcha();

  const form = useAppForm({
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
    validators: {
      onSubmit: signUpSchema,
    },
    onSubmit: async ({ formApi, value }) => {
      const captchaToken = captcha.tokenRef.current;
      try {
        const email = value.email.trim();
        captureClientEvent("auth:sign_up_submit", {
          redirect_to: redirectTo,
        });
        const verificationCallbackURL = new URL(
          "/verify-email",
          window.location.origin,
        );
        const verificationSearch = getVerifyEmailSearch(
          undefined,
          postSignupRedirect,
        );
        if (verificationSearch.redirect) {
          verificationCallbackURL.searchParams.set(
            "redirect",
            verificationSearch.redirect,
          );
        }
        const result = await authClient.signUp.email({
          name: email.split("@")[0] || "OpenSEO User",
          email,
          password: value.password,
          callbackURL: verificationCallbackURL.toString(),
          ...(isTurnstileEnabled && captchaToken
            ? {
                fetchOptions: {
                  headers: { "x-captcha-response": captchaToken },
                },
              }
            : {}),
        });

        if (result.error) {
          if (isTurnstileEnabled) captcha.reset();
          formApi.setErrorMap({
            onSubmit: {
              form: result.error.message || t("auth.sign_up.failed"),
              fields: {},
            },
          });
          return;
        }

        captureClientEvent("auth:sign_up_success", {
          redirect_to: redirectTo,
        });
        if (standalone) {
          const signedIn = await authClient.signIn.email({
            email,
            password: value.password,
            callbackURL: toAuthCallbackURL(redirectTo),
          });
          if (signedIn.error) {
            formApi.setErrorMap({
              onSubmit: {
                form:
                  signedIn.error.message || t("auth.sign_up.created_sign_in"),
                fields: {},
              },
            });
          }
          return;
        }
        void navigate({
          to: "/verify-email",
          search: getVerifyEmailSearch(email, postSignupRedirect),
          replace: true,
        });
      } catch {
        if (isTurnstileEnabled) captcha.reset();
        formApi.setErrorMap({
          onSubmit: {
            form: t("auth.sign_up.failed_retry"),
            fields: {},
          },
        });
      }
    },
  });

  if (standalone && !firstAccount && !invited) {
    if (signUpStatus.isPending) return <PageLoading />;
    return (
      <AuthPageCard
        title={t("auth.sign_up.closed_title")}
        helperText={t("auth.sign_up.closed_helper")}
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
        {null}
      </AuthPageCard>
    );
  }

  return (
    <AuthPageCard
      title={
        firstAccount ? t("auth.sign_up.admin_title") : t("auth.sign_up.title")
      }
      helperText={
        firstAccount
          ? t("auth.sign_up.admin_helper")
          : invited
            ? t("auth.sign_up.invited_helper")
            : undefined
      }
      footer={
        standalone ? (
          firstAccount ? null : (
            <p className="text-sm text-foreground/50">
              {t("auth.sign_up.has_account")}{" "}
              <Link
                to="/sign-in"
                search={getSignInSearch(redirectTo)}
                className="text-foreground underline underline-offset-2 hover:text-foreground/80 transition-colors"
              >
                {t("auth.sign_up.sign_in_link")}
              </Link>
            </p>
          )
        ) : isHostedMode ? (
          showEmailForm ? (
            <button
              type="button"
              className="text-sm text-foreground underline underline-offset-2 hover:text-foreground/80 transition-colors"
              onClick={() => {
                setShowEmailForm(false);
                google.clearError();
              }}
            >
              {t("auth.sign_up.back_to_signup")}
            </button>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-foreground/50">
                {t("auth.sign_up.has_account")}{" "}
                <Link
                  to="/sign-in"
                  search={getSignInSearch(redirectTo)}
                  className="text-foreground underline underline-offset-2 hover:text-foreground/80 transition-colors"
                >
                  {t("auth.sign_up.sign_in_link")}
                </Link>
              </p>
            </div>
          )
        ) : null
      }
    >
      {!emailFormVisible ? (
        <>
          <AuthMethodChooser
            googleLabel={t("auth.common.continue_google")}
            disabled={!isHostedMode}
            isBusy={google.isStarting}
            onContinueWithGoogle={() => {
              void google.start();
            }}
            onContinueWithEmail={() => {
              setShowEmailForm(true);
              google.clearError();
            }}
          />
          {isHostedMode ? (
            <TermsAgreementNotice action={t("auth.common.by_continuing")} />
          ) : null}
          {google.error ? (
            <p className="text-sm text-destructive">{google.error}</p>
          ) : null}
        </>
      ) : (
        <form.AppForm>
          <form.Form className="space-y-4">
            <form.AppField name="email">
              {(field) => (
                <field.TextField
                  label={t("auth.common.email_label")}
                  hideLabel
                  className={authInputClassName}
                  type="email"
                  placeholder={t("auth.common.email_placeholder")}
                  autoComplete="email"
                  required
                />
              )}
            </form.AppField>
            <form.AppField name="password">
              {(field) => (
                <field.TextField
                  label={t("auth.common.password_label")}
                  hideLabel
                  className={authInputClassName}
                  type="password"
                  placeholder={t("auth.common.password_placeholder")}
                  autoComplete="new-password"
                  required
                />
              )}
            </form.AppField>
            <form.AppField name="confirmPassword">
              {(field) => (
                <field.TextField
                  label={t("auth.sign_up.confirm_password_label")}
                  hideLabel
                  className={authInputClassName}
                  type="password"
                  placeholder={t("auth.sign_up.confirm_password_placeholder")}
                  autoComplete="new-password"
                  required
                />
              )}
            </form.AppField>

            {isTurnstileEnabled ? (
              <TurnstileWidget
                onToken={captcha.onToken}
                resetNonce={captcha.resetNonce}
              />
            ) : null}

            <form.Subscribe
              selector={(state) => ({
                submitError: state.errorMap.onSubmit,
                isSubmitting: state.isSubmitting,
              })}
            >
              {({ submitError, isSubmitting }) => {
                const errorMessage = getFormError(submitError);
                return (
                  <>
                    {errorMessage ? (
                      <p className="text-sm text-destructive">{errorMessage}</p>
                    ) : null}
                    <Button
                      type="submit"
                      variant="secondary"
                      className={authSubmitClassName}
                      pending={isSubmitting}
                      disabled={isTurnstileEnabled && !captcha.hasToken}
                    >
                      {isSubmitting
                        ? t("auth.sign_up.submitting")
                        : t("auth.sign_up.submit")}
                    </Button>
                    {isHostedMode ? (
                      <TermsAgreementNotice
                        action={t("auth.common.by_creating_account")}
                      />
                    ) : null}
                  </>
                );
              }}
            </form.Subscribe>
          </form.Form>
        </form.AppForm>
      )}
    </AuthPageCard>
  );
}
