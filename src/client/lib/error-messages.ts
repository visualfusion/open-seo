import { getTranslation } from "@/client/lib/i18n";
import { FREE_MAX_AUDIT_PAGES } from "@/shared/audit-limits";
import { isErrorCode, type ErrorCode } from "@/shared/error-codes";
import {
  isEveryAppClientAuthMode,
  isHostedClientAuthMode,
} from "@/lib/auth-mode";

/**
 * Copy for an error we did not expect. Hosted users cannot read our logs, so
 * they get support; a self-hoster runs the server and can.
 */
export function getUnexpectedErrorMessage(): string {
  return getTranslation(
    isHostedClientAuthMode()
      ? "ui.details.error_unexpected_hosted"
      : "ui.details.error_unexpected_selfhost",
  );
}

const STANDARD_MESSAGE_KEYS: Record<
  Exclude<ErrorCode, "INTERNAL_ERROR">,
  string
> = {
  UNAUTHENTICATED: "ui.details.error_unauthenticated",
  AUTH_CONFIG_MISSING: "ui.details.error_auth_config_missing",
  PAYMENT_REQUIRED: "ui.details.error_payment_required",
  INSUFFICIENT_CREDITS: "ui.details.error_insufficient_credits",
  PAYMENT_METHOD_REQUIRED: "ui.details.error_payment_method_required",
  PAYMENT_ACTION_REQUIRED: "ui.details.error_payment_action_required",
  AUDIT_RENDERING_UNAVAILABLE: "ui.details.error_audit_rendering_unavailable",
  FORBIDDEN: "ui.details.error_forbidden",
  NOT_FOUND: "ui.details.error_not_found",
  AUDIT_CAPACITY_REACHED: "ui.details.error_audit_capacity_reached",
  AUDIT_PAGE_LIMIT_EXCEEDED: "ui.details.error_audit_page_limit_exceeded",
  AUDIT_ALREADY_RUNNING: "ui.details.error_audit_already_running",
  VALIDATION_ERROR: "ui.details.error_validation_error",
  UNKNOWN_LOCATION: "ui.details.error_unknown_location",
  CRAWL_TARGET_BLOCKED: "ui.details.error_crawl_target_blocked",
  BACKLINKS_BILLING_ISSUE: "ui.details.error_backlinks_billing_issue",
  AI_SEARCH_BILLING_ISSUE: "ui.details.error_ai_search_billing_issue",
  AI_VISIBILITY_ERROR: "ui.details.error_ai_visibility_error",
  DATAFORSEO_AUTH_FAILED: "ui.details.error_dataforseo_auth_failed",
  RATE_LIMITED: "ui.details.error_rate_limited",
  UPSTREAM_UNAVAILABLE: "ui.details.error_upstream_unavailable",
  CONFLICT: "ui.details.error_conflict",
};

function standardMessage(code: ErrorCode): string {
  if (code === "INTERNAL_ERROR") return getUnexpectedErrorMessage();
  if (isEveryAppClientAuthMode()) {
    if (code === "AUTH_CONFIG_MISSING")
      return getTranslation("ui.details.error_gateway_auth");
    if (code === "DATAFORSEO_AUTH_FAILED")
      return getTranslation("ui.details.error_gateway_dataforseo");
    if (code === "AUDIT_RENDERING_UNAVAILABLE")
      return getTranslation("ui.details.error_gateway_rendering");
  }
  return getTranslation(STANDARD_MESSAGE_KEYS[code], undefined, {
    count: FREE_MAX_AUDIT_PAGES,
  });
}

export function getStandardErrorMessage(
  error: unknown,
  fallback: string = getUnexpectedErrorMessage(),
): string {
  if (!(error instanceof Error)) return fallback;
  if (isErrorCode(error.message)) return standardMessage(error.message);
  if (error.message) return error.message;
  return fallback;
}

export function getErrorCode(error: unknown): ErrorCode | null {
  if (!(error instanceof Error)) return null;
  return isErrorCode(error.message) ? error.message : null;
}
