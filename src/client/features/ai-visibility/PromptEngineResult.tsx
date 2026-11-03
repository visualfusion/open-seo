import { aiNoAnswerLabel } from "./shared";
import { useLocale } from "@/client/lib/i18n";
import {
  AI_ENGINE_LABELS,
  type AiEngine,
  type AiObservationRow,
} from "@/shared/ai-visibility";
import { EngineLabel } from "./EngineLabel";

export function EngineResult({
  engine,
  row,
}: {
  engine: AiEngine;
  row: AiObservationRow | undefined;
}) {
  const { t } = useLocale();
  const own = row?.brands.find((brand) => brand.own);
  const result = !row
    ? t("ai_visibility.details.no_result_available")
    : row.status === "failed"
      ? t("ai_visibility.details.failed")
      : row.status === "pending"
        ? t("ai_visibility.details.running")
        : row.answerStatus === "no_answer"
          ? aiNoAnswerLabel(engine)
          : row.answerStatus !== "answered"
            ? t("ai_visibility.details.answer_unavailable")
            : own?.mentioned
              ? t("ui.ai_visibility_ext.answer_view.mentioned")
              : t("ui.ai_visibility_ext.answer_view.not_mentioned");
  return (
    <span
      title={`${AI_ENGINE_LABELS[engine]}: ${result}`}
      className={`inline-flex h-6 items-center text-xs ${own?.mentioned && row?.answerStatus === "answered" ? "text-success" : row?.status === "failed" ? "text-destructive" : "text-muted-foreground"}`}
    >
      <EngineLabel engine={engine} />
    </span>
  );
}
