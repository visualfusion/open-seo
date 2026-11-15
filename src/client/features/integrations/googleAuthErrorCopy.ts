import { getTranslation } from "@/client/lib/i18n";
import { ACCOUNT_DELETION_SCHEDULED_ERROR } from "@/shared/account-deletion";
import { CHATGPT_EMAIL_NOT_VERIFIED_CODE } from "@/shared/chatgpt-sign-in";

/**
 * Plain-language copy for OAuth failures, shared by the connect-surface
 * inline alert (GoogleLinkErrorAlert) and the /auth-error fallback page.
 * `code` is the `error` query param on the redirect: the provider's own error
 * code (access_denied), or one set by googleOAuth.ts / Better Auth.
 *
 * `providerLabel` ("Search Console" / "Google Analytics") is set when the
 * failure came from a connect flow; without it the copy reads as a sign-in
 * failure. The error page can't tell a Google sign-in from a ChatGPT one, so
 * that copy names neither.
 */
export function googleAuthErrorCopy(
  code: string,
  providerLabel?: string,
): { title: string; description: string } {
  const what = providerLabel
    ? getTranslation("integrations.details.value_connection", undefined, {
        v1: providerLabel,
      })
    : getTranslation("auth.details.sign_in");
  const provider = providerLabel
    ? "Google"
    : getTranslation("auth.details.the_sign_in_provider");

  switch (code) {
    case ACCOUNT_DELETION_SCHEDULED_ERROR:
      return {
        title: getTranslation("auth.details.account_being_deleted"),
        description: getTranslation("auth.details.account_being_deleted_desc"),
      };
    // Sign-in with Google or ChatGPT reached an existing account it may not
    // be attached to: the provider hasn't verified the email, or the account
    // never confirmed its own.
    case "account_not_linked":
      return {
        title: getTranslation("auth.details.account_already_exists"),
        description: getTranslation("auth.details.account_already_exists_desc"),
      };
    case CHATGPT_EMAIL_NOT_VERIFIED_CODE:
      return {
        title: getTranslation("auth.details.verify_email_chatgpt_first"),
        description: getTranslation(
          "auth.details.verify_email_chatgpt_first_desc",
        ),
      };
    case "state_mismatch":
      return {
        title: getTranslation(
          "integrations.details.value_didn_t_finish",
          undefined,
          { v1: what },
        ),
        description: getTranslation("auth.details.the_attempt_expired_or_in_a"),
      };
    case "access_denied":
      return {
        title: getTranslation(
          "integrations.details.value_was_canceled",
          undefined,
          { v1: what },
        ),
        description: getTranslation("auth.details.permission_screen_was_closed"),
      };
    case "scope_not_granted":
      return {
        title: getTranslation(
          "integrations.details.value_is_missing_a_permission",
          undefined,
          { v1: what },
        ),
        description: getTranslation(
          "integrations.details.openseo_didn_t_get_data_because",
          undefined,
          { v1: providerLabel ?? "Google" },
        ),
      };
    case "connection_save_failed":
      return {
        title: getTranslation(
          "integrations.details.value_didn_t_finish",
          undefined,
          { v1: what },
        ),
        description: getTranslation("auth.details.we_couldn_t_save_again_if"),
      };
    default:
      return {
        title: getTranslation(
          "integrations.details.value_didn_t_finish",
          undefined,
          { v1: what },
        ),
        description: getTranslation(
          "auth.details.something_went_wrong_talking_provider",
          undefined,
          { v1: provider },
        ),
      };
  }
}
