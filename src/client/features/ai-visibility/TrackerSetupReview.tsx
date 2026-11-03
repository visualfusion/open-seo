import { useLocale } from "@/client/lib/i18n";
import { Loader2 } from "lucide-react";
import { Button } from "@/client/components/ui/button";
import { DialogFooter } from "@/client/components/ui/dialog";
import { aiMarketLabel, type AiCostEstimate } from "@/shared/ai-visibility";
import { EngineLabel } from "./EngineLabel";
import type { AiTrackerPatch } from "@/types/schemas/ai-visibility";
import { AiQueryError, aiMoney } from "./shared";

export type TrackerSetupReviewData = {
  patch: AiTrackerPatch;
  estimate: AiCostEstimate;
};

export function TrackerSetupReview({
  review,
  enabled,
  creating,
  pending,
  error,
  canSchedule,
  scheduling,
  onBack,
  onSave,
  onSaveAndSchedule,
}: {
  review: TrackerSetupReviewData;
  enabled: boolean;
  /** No tracker yet; saving creates one on the weekly schedule. */
  creating: boolean;
  pending: boolean;
  error: unknown;
  canSchedule: boolean;
  scheduling: boolean;
  onBack: () => void;
  onSave: () => void;
  onSaveAndSchedule: () => void;
}) {
  const { t } = useLocale();
  const paused = !enabled && !creating;
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        {t("ai_visibility.details.review_your_changes_before_saving")}{" "}
        {enabled
          ? t(
              "ai_visibility.details.these_settings_apply_to_your_enabled_schedule",
            )
          : creating
            ? t("ai_visibility.details.tracking_runs_weekly_the_week_from")
            : t("ai_visibility.details.track_weekly_to_collect_week_a")}
      </p>
      <dl className="grid grid-cols-2 gap-4 rounded-lg border p-4 text-sm border-border">
        {review.patch.engines && (
          <div>
            <dt className="text-muted-foreground">
              {t("ai_visibility.col_engines")}
            </dt>
            <dd className="mt-1 flex flex-wrap gap-x-3 gap-y-1">
              {review.patch.engines?.map((engine) => (
                <EngineLabel key={engine} engine={engine} />
              ))}
            </dd>
          </div>
        )}
        {review.patch.prompts !== undefined && (
          <div>
            <dt className="text-muted-foreground">
              {t("ai_visibility.details.new_prompts")}
            </dt>
            <dd className="mt-1">{review.patch.prompts?.length ?? 0}</dd>
          </div>
        )}
        {review.patch.prompts?.[0]?.topic && (
          <div>
            <dt className="text-muted-foreground">
              {t("ui.ai_visibility_ext.tracker_editor.topic_label")}
            </dt>
            <dd className="mt-1">{review.patch.prompts[0].topic}</dd>
          </div>
        )}
        {review.patch.locationCode && review.patch.languageCode && (
          <div>
            <dt className="text-muted-foreground">
              {t("ai_visibility.details.market")}
            </dt>
            <dd className="mt-1">
              {aiMarketLabel({
                locationCode: review.patch.locationCode,
                languageCode: review.patch.languageCode,
              })}
            </dd>
          </div>
        )}
      </dl>
      {!!review.patch.prompts?.length && (
        <div
          className="max-h-56 space-y-2 overflow-y-auto rounded-lg border p-4 border-border"
          data-ph-mask
        >
          <h3 className="text-sm font-semibold">
            {t("ai_visibility.details.prompts_to_add")}
          </h3>
          {review.patch.prompts.map((prompt) => (
            <p
              key={prompt.text}
              className="whitespace-pre-wrap text-[0.8125rem] leading-relaxed"
            >
              {prompt.text}
            </p>
          ))}
        </div>
      )}
      <div className="space-y-1 rounded-lg bg-muted/60 p-4 text-sm">
        <p>
          {t("ai_visibility.details.each_run_collects")}{" "}
          <strong>{review.estimate.observations}</strong>{" "}
          {t(
            review.estimate.observations === 1
              ? "ai_visibility.details.answer_word"
              : "ai_visibility.details.answers_word",
          )}{" "}
          {t("ai_visibility.details.for")}{" "}
          <strong>{aiMoney(review.estimate.costUsd)}</strong>
        </p>
        <p>
          <strong>{aiMoney(review.estimate.monthlyCostUsd)}</strong>{" "}
          {t("ai_visibility.details.estimated_per_month_if_it_runs")}{" "}
          {t("ranks.schedule." + review.estimate.scheduleInterval)}.
        </p>
      </div>
      {!!error && <AiQueryError error={error} />}
      <DialogFooter>
        <Button
          type="button"
          variant="ghost"
          disabled={pending}
          onClick={onBack}
        >
          {t("ai_visibility.details.back_to_editing")}
        </Button>
        <Button
          type="button"
          variant={paused ? "secondary" : "default"}
          disabled={pending}
          onClick={onSave}
        >
          {pending && !scheduling && (
            <Loader2 className="size-4 animate-spin" />
          )}
          {enabled
            ? t("ai_visibility.details.save_reviewed_changes")
            : creating
              ? t("ai_visibility.details.save_and_track_weekly")
              : t("ai_visibility.details.save_as_paused")}
        </Button>
        {paused && (
          <Button
            type="button"
            disabled={
              pending || !canSchedule || review.estimate.observations === 0
            }
            onClick={onSaveAndSchedule}
          >
            {pending && scheduling && (
              <Loader2 className="size-4 animate-spin" />
            )}
            {t("ai_visibility.details.save_and_track_weekly")}
          </Button>
        )}
      </DialogFooter>
    </div>
  );
}
