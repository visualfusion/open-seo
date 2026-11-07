import { AlertTriangle, Clock } from "lucide-react";
import { Alert, AlertDescription } from "@/client/components/ui/alert";
import { InsufficientCreditsError } from "@/client/features/billing/InsufficientCreditsError";
import { useLocale } from "@/client/lib/i18n";
import { isOutOfCreditsRunError } from "@/shared/rank-tracking";
import type { useRankRunPolling } from "./useRankRunPolling";

function ReadWhatChangedLink() {
  const { t } = useLocale();
  return (
    <a
      href="https://openseo.so/blogs/state-of-rank-tracking-november-2026"
      target="_blank"
      rel="noopener noreferrer"
      className="font-medium underline underline-offset-4"
    >
      {t("ranks.alerts.changes_link")}
    </a>
  );
}

/** The latest rank check's state: running, stale, failed, or incomplete. */
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

  if (run.status === "pending" || run.status === "running") {
    return (
      <Alert variant="info">
        <Clock />
        <AlertDescription className="text-foreground">
          <p>
            <span className="font-medium">
              {t("ranks.alerts.run_takes_hour_bold")}
            </span>{" "}
            {t("ranks.alerts.run_takes_hour_desc")} <ReadWhatChangedLink />
          </p>
        </AlertDescription>
      </Alert>
    );
  }

  if (run.status === "failed" && isOutOfCreditsRunError(run.errorMessage)) {
    return (
      <InsufficientCreditsError
        title={t("ranks.alerts.run_insufficient_credits")}
      />
    );
  }

  if (run.status === "failed") {
    return (
      <Alert variant="warning">
        <AlertTriangle />
        <AlertDescription className="text-foreground">
          <p>
            <span className="font-medium">
              {t("ranks.alerts.run_couldnt_finish_bold")}
            </span>{" "}
            {t("ranks.alerts.run_couldnt_finish_desc")} <ReadWhatChangedLink />
          </p>
        </AlertDescription>
      </Alert>
    );
  }

  // A completed run only has an error message when some checks have no result.
  if (run.status === "completed" && run.errorMessage) {
    return (
      <Alert variant="warning">
        <AlertTriangle />
        <AlertDescription className="text-foreground">
          <p>
            <span className="font-medium">
              {t("ranks.alerts.run_incomplete_bold")}
            </span>{" "}
            {t("ranks.alerts.run_incomplete_desc")} <ReadWhatChangedLink />
          </p>
        </AlertDescription>
      </Alert>
    );
  }

  return null;
}
