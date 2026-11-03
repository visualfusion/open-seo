import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/client/components/ui/alert";
import { InsufficientCreditsError } from "@/client/features/billing/InsufficientCreditsError";
import { getStandardErrorMessage } from "@/client/lib/error-messages";
import { useLocale } from "@/client/lib/i18n";
import type { useRankRunPolling } from "./useRankRunPolling";

/** Warnings about the latest rank check: stale, failed, or incomplete. */
export function RankRunAlerts({
  run,
}: {
  run: ReturnType<typeof useRankRunPolling>;
}) {
  const { t } = useLocale();
  if (!run) return null;

  if (run.maybeStale) {
    return (
      <Alert variant="warning">
        <AlertTriangle />
        <AlertDescription className="text-foreground">
          {t("ranks.alerts.run_stale")}
        </AlertDescription>
      </Alert>
    );
  }

  if (run.status === "failed" && run.errorMessage === "INSUFFICIENT_CREDITS") {
    return (
      <InsufficientCreditsError
        title={t("ranks.alerts.run_insufficient_credits")}
      />
    );
  }

  if (run.status === "failed") {
    return (
      <Alert variant="destructive">
        <AlertTriangle />
        <AlertDescription className="text-foreground">
          <p>
            <span className="font-medium">
              {t("ranks.alerts.run_failed_bold")}
            </span>{" "}
            {run.errorMessage &&
              getStandardErrorMessage(new Error(run.errorMessage))}
          </p>
        </AlertDescription>
      </Alert>
    );
  }

  // A completed run only has an error message when some checks have no
  // result. Most are misses that retries couldn't confirm, not provider
  // errors, so the copy doesn't blame the provider.
  if (run.status === "completed" && run.errorMessage) {
    return (
      <Alert variant="warning">
        <AlertTriangle />
        <AlertDescription className="text-foreground">
          <p>
            <span className="font-medium">
              {t("ranks.alerts.run_incomplete_bold")}
            </span>{" "}
            {t("ranks.alerts.run_incomplete_desc")}
          </p>
        </AlertDescription>
      </Alert>
    );
  }

  return null;
}
