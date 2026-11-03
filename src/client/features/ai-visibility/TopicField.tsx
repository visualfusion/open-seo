import { useLocale } from "@/client/lib/i18n";
import { useId, useState } from "react";
import { Field, FieldLabel } from "@/client/components/ui/field";
import { Input } from "@/client/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/client/components/ui/select";

/** Picks a saved topic or names a new one. */
export function TopicField({
  topics,
  value,
  onChange,
}: {
  topics: string[];
  value: string;
  onChange: (topic: string) => void;
}) {
  const { t } = useLocale();
  const topicId = useId();
  // Kept separately so typing a saved topic's name doesn't hide the input.
  const [creating, setCreating] = useState(!topics.includes(value));
  const items = [
    ...topics.map((name) => ({ value: name, label: name })),
    { value: "", label: t("ui.ai_visibility_ext.tracker_editor.new_topic") },
  ];
  return (
    <>
      {topics.length > 0 && (
        <Field>
          <FieldLabel>
            {t("ui.ai_visibility_ext.tracker_editor.topic_label")}
          </FieldLabel>
          <Select
            items={items}
            value={creating ? "" : value}
            onValueChange={(name) => {
              setCreating(!name);
              onChange(name ?? "");
            }}
          >
            <SelectTrigger
              className="w-full"
              aria-label={t("ui.ai_visibility_ext.tracker_editor.topic_label")}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {items.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      )}
      {creating && (
        <Field>
          <FieldLabel htmlFor={topicId}>
            {t("ui.ai_visibility_ext.rename_topic.label")}
          </FieldLabel>
          <Input
            id={topicId}
            required
            maxLength={100}
            placeholder={t("ai_visibility.details.e_g_seo_tools")}
            value={value}
            onChange={(event) => onChange(event.target.value)}
          />
        </Field>
      )}
    </>
  );
}
