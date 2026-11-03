import { CalendarClock, Pause } from "lucide-react";
import { useLocale } from "@/client/lib/i18n";
import { Button } from "@/client/components/ui/button";
import type { AiTracker } from "@/shared/ai-visibility";
import { scheduleLabel } from "@/shared/rank-tracking";
import { aiDate } from "./shared";

/** The schedule section of Tracking settings. Changes go through a cost review. */
export function TrackingScheduleSummary({
  tracker,
  canSchedule,
  pausePending,
  onSchedule,
  onPause,
}: {
  tracker: AiTracker;
  canSchedule: boolean;
  pausePending: boolean;
  onSchedule: () => void;
  onPause: () => void;
}) {
  const { t } = useLocale();
  return (
    <section className="space-y-3">
      <h3 className="text-sm font-semibold">
        {t("ai_visibility.schedule_title")}
      </h3>
      {tracker.enabled ? (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border p-3">
          <p className="text-sm">
            {scheduleLabel(tracker.scheduleInterval)}
            <span className="text-muted-foreground">
              {" "}
              ·{" "}
              {t("ai_visibility.next_run", {
                date: aiDate(tracker.nextCheckAt),
              })}
            </span>
          </p>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={pausePending}
              onClick={onPause}
            >
              <Pause />
              {t("ai_visibility.pause")}
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={!canSchedule}
              onClick={onSchedule}
            >
              <CalendarClock />
              {t("ai_visibility.change_schedule")}
            </Button>
          </div>
        </div>
      ) : (
        <Button
          type="button"
          size="sm"
          disabled={!canSchedule}
          onClick={onSchedule}
        >
          <CalendarClock />
          {t("ai_visibility.schedule_tracking")}
        </Button>
      )}
    </section>
  );
}
