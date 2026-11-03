import { useLocale } from "@/client/lib/i18n";
import { Progress } from "@/client/components/ui/progress";
import { Spinner } from "@/client/components/ui/spinner";
import type { AiRun, AiTrackerState } from "@/shared/ai-visibility";
import { aiDate } from "./shared";

/** Progress while a run collects; otherwise when results last updated. */
export function RunStatusLine({
  run,
  tracker,
}: {
  run: AiRun | null;
  tracker: AiTrackerState["tracker"];
}) {
  const { t } = useLocale();
  const pending = run?.status === "running" || run?.status === "queued";
  if (run && pending) {
    return (
      <div className="space-y-1.5">
        <p className="flex items-center gap-2 text-xs text-muted-foreground">
          <Spinner className="size-3.5" />
          {t("ai_visibility.details.collecting")} {run.completed + run.failed}{" "}
          {t("ai_visibility.details.of")} {run.expected}{" "}
          {t("ai_visibility.details.answers_2")}
        </p>
        <Progress value={run.completed + run.failed} max={run.expected || 1} />
      </div>
    );
  }
  if (!run && !tracker?.enabled) return null;
  return (
    <p className="text-xs text-muted-foreground">
      {[
        run &&
          t("ai_visibility.details.updated_value", {
            v1: aiDate(run.completedAt ?? run.createdAt),
          }),
        tracker?.enabled &&
          t("ai_visibility.details.next_run_value", {
            v1: aiDate(tracker.nextCheckAt),
          }),
      ]
        .filter(Boolean)
        .join(" · ")}
    </p>
  );
}
