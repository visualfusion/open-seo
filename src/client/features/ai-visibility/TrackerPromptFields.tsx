import { useLocale } from "@/client/lib/i18n";
import { useId } from "react";
import { useMutation } from "@tanstack/react-query";
import Papa from "papaparse";
import { Plus, Loader2, Sparkles } from "lucide-react";
import { generateAiVisibilityPrompts } from "@/serverFunctions/ai-visibility";
import { AiQueryError } from "./shared";
import { toast } from "sonner";
import { Button } from "@/client/components/ui/button";
import { Field, FieldLabel } from "@/client/components/ui/field";
import { Input } from "@/client/components/ui/input";
import type { AiTrackerState } from "@/shared/ai-visibility";
import {
  MAX_PROMPTS_PER_ADDITION,
  type TrackerDraft,
} from "./TrackerTrackingFields";
import { TopicField } from "./TopicField";

export function TrackerPromptFields({
  projectId,
  state,
  value,
  onChange,
  onGeneratingChange,
}: {
  projectId: string;
  state: AiTrackerState;
  value: TrackerDraft;
  onChange: (value: TrackerDraft) => void;
  onGeneratingChange: (pending: boolean) => void;
}) {
  const { t } = useLocale();
  const promptsId = useId();
  const group = value.topic;
  const topicPrompts = state.prompts.filter(
    (prompt) => !prompt.archived && prompt.topic === group.name,
  );
  const generate = useMutation({
    mutationFn: () =>
      generateAiVisibilityPrompts({
        data: {
          projectId,
          topic: group.name.trim() || undefined,
          excludePrompts: group.prompts,
          locationCode: value.locationCode,
          languageCode: value.languageCode,
        },
      }),
    onMutate: () => onGeneratingChange(true),
    onSettled: () => onGeneratingChange(false),
    onSuccess: (suggestions) => {
      const entered = group.prompts.filter((text) => text.trim());
      const accepted = suggestions.prompts.slice(
        0,
        MAX_PROMPTS_PER_ADDITION - entered.length,
      );
      onChange({
        ...value,
        topic: { name: suggestions.topic, prompts: [...entered, ...accepted] },
      });
    },
  });
  const update = (change: Partial<typeof group>) =>
    onChange({ ...value, topic: { ...group, ...change } });
  const insertPrompts = (index: number, prompts: string[]) => {
    const after = group.prompts.slice(index + 1).filter((text) => text.trim());
    const accepted = prompts.slice(
      0,
      MAX_PROMPTS_PER_ADDITION - index - after.length,
    );
    const next = [...group.prompts.slice(0, index), ...accepted, ...after];
    while (next.length < 3) next.push("");
    update({ prompts: next });
    if (accepted.length < prompts.length)
      toast.info(
        t("ai_visibility.details.added_value_prompts", {
          v1: accepted.length,
        }),
      );
  };
  return (
    <section className="space-y-4">
      <TopicField
        topics={state.topics}
        value={group.name}
        onChange={(name) => update({ name })}
      />
      {topicPrompts.length > 0 &&
        topicPrompts.every((prompt) => prompt.paused) && (
          <p className="text-xs text-muted-foreground">
            {t("ai_visibility.details.every_prompt_in_this_you_add")}
          </p>
        )}
      <Field aria-label={t("ai_visibility.details.prompts_to_track")}>
        <div className="flex items-center justify-between gap-3">
          <FieldLabel htmlFor={`${promptsId}-0`}>
            {t("ai_visibility.details.prompts_to_track")}
          </FieldLabel>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={
              generate.isPending ||
              group.prompts.filter((text) => text.trim()).length >=
                MAX_PROMPTS_PER_ADDITION
            }
            onClick={() => generate.mutate()}
          >
            {generate.isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Sparkles className="size-4" />
            )}
            {generate.isPending
              ? t("ai_visibility.details.generating")
              : t("ai_visibility.details.generate")}
          </Button>
        </div>
        <div className="space-y-2">
          {group.prompts.map((text, index) => (
            <Input
              key={index}
              id={`${promptsId}-${index}`}
              aria-label={t("ai_visibility.details.prompt_value", {
                v1: index + 1,
              })}
              placeholder={t("ai_visibility.details.prompt_value", {
                v1: index + 1,
              })}
              value={text}
              onChange={(event) =>
                update({
                  prompts: group.prompts.map((prompt, position) =>
                    position === index ? event.target.value : prompt,
                  ),
                })
              }
              onPaste={(event) => {
                const pasted = event.clipboardData.getData("text/plain");
                if (!/[\r\n\t]/.test(pasted)) return;
                event.preventDefault();
                const cells = pasted.includes("\t")
                  ? Papa.parse<string[]>(pasted, {
                      delimiter: "\t",
                      skipEmptyLines: true,
                    }).data.flat()
                  : pasted.split(/\r\n|\n|\r/);
                const prompts = cells
                  .map((prompt) => prompt.trim())
                  .filter(Boolean);
                if (prompts.length) insertPrompts(index, prompts);
              }}
              data-ph-mask
            />
          ))}
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="self-end w-auto!"
          disabled={group.prompts.length >= MAX_PROMPTS_PER_ADDITION}
          onClick={() => update({ prompts: [...group.prompts, ""] })}
        >
          <Plus /> {t("ui.ai_visibility_ext.tracker_editor.add_prompt")}
        </Button>
      </Field>
      {generate.isError && <AiQueryError error={generate.error} />}
    </section>
  );
}
