import { getTranslation } from "@/client/lib/i18n";
import { ACCOUNT_DELETION_SCHEDULED_ERROR } from "@/shared/account-deletion";
/**
 * Plain-language copy for Google OAuth failures, shared by the connect-surface
 * inline alert (GoogleLinkErrorAlert) and the /auth-error fallback page.
 * `code` is the `error` query param on the redirect: Google's own error code
 * (access_denied), or one set by googleOAuth.ts / Better Auth.
 *
 * `providerLabel` ("Search Console" / "Google Analytics") is set when the
 * failure came from a connect flow; without it the copy reads as a Google
 * sign-in failure.
 */
export function googleAuthErrorCopy(
  code: string,
  providerLabel?: string,
): { title: string; description: string } {
  const what = providerLabel
    ? getTranslation("integrations.details.value_connection", undefined, {
        v1: providerLabel,
      })
    : getTranslation("auth.details.google_sign_in");

  switch (code) {
    case ACCOUNT_DELETION_SCHEDULED_ERROR:
      return {
        title: getTranslation("auth.details.account_being_deleted"),
        description: getTranslation("auth.details.account_being_deleted_desc"),
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
        description: getTranslation(
          "auth.details.google_s_permission_screen_try_again",
        ),
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
          "auth.details.something_went_wrong_while_try_again",
        ),
      };
  }
}
