import { aiObservationStatusLabel } from "./shared";
import type { ReactNode } from "react";
import { useLocale } from "@/client/lib/i18n";
import {
  AI_ENGINE_LABELS,
  type AiObservationRow,
  type AiPrompt,
} from "@/shared/ai-visibility";
import { getStandardErrorMessage } from "@/client/lib/error-messages";
import { AnswerContent } from "./AnswerContent";

export function PromptAnswers({
  projectId,
  prompt,
  observation,
  controls,
}: {
  projectId: string;
  prompt: AiPrompt | undefined;
  observation: AiObservationRow;
  /** Chooses which answer is shown. */
  controls: ReactNode;
}) {
  const { t } = useLocale();
  return (
    <section
      className="overflow-hidden rounded-lg border bg-card border-border"
      aria-label={t("ai_visibility.details.selected_execution_answer")}
    >
      <div className="flex flex-wrap items-center gap-3 border-b px-5 py-3 border-border">
        <h2 className="mr-auto text-sm font-semibold">
          {t("ai_visibility.answer_section_title")}
        </h2>
        {controls}
      </div>
      {prompt && observation.prompt !== prompt.text && (
        <p
          className="border-b px-5 py-3 text-xs text-muted-foreground border-border"
          data-ph-mask
        >
          {t("ai_visibility.collected_prompt_label", {
            text: observation.prompt,
          })}
        </p>
      )}
      {observation.status === "completed" ? (
        <AnswerContent
          key={observation.id}
          projectId={projectId}
          observationId={observation.id}
        />
      ) : (
        <div className="space-y-2 p-6">
          <p className="text-sm font-medium">
            {AI_ENGINE_LABELS[observation.engine]} ·{" "}
            {aiObservationStatusLabel(observation.status)}
          </p>
          <p className="text-sm text-muted-foreground">
            {observation.error
              ? getStandardErrorMessage(new Error(observation.error))
              : t("ai_visibility.answer_not_available")}
          </p>
          <p className="text-xs text-muted-foreground">
            {t("ai_visibility.answer_excluded_notice")}
          </p>
        </div>
      )}
    </section>
  );
}
