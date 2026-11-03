import { useId, useMemo, useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { FormDialog } from "@/client/components/FormDialog";
import { Button } from "@/client/components/ui/button";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
} from "@/client/components/ui/field";
import { Switch } from "@/client/components/ui/switch";
import {
  RESULT_LIMITS,
  type KeywordMode,
} from "@/client/features/keywords/keywordResearchTypes";
import { isLabsLocationCode } from "@/client/features/keywords/locations";
import { useLocale } from "@/client/lib/i18n";
import type { KeywordResearchControllerState } from "./types";

type Props = {
  controller: KeywordResearchControllerState;
};

/** The search settings most people leave at their defaults. */
export function KeywordSearchOptions({ controller }: Props) {
  const { t } = useLocale();
  const {
    controlsForm,
    preferredGroupKeywords: groupKeywords,
    setPreferredGroupKeywords: setGroupKeywords,
  } = controller;
  const [open, setOpen] = useState(false);

  const resultItems = useMemo(
    () =>
      RESULT_LIMITS.map((limit) => ({
        value: limit,
        label: t("keywords.options.results_item", { count: limit }),
      })),
    [t],
  );

  const modeItems: { value: KeywordMode; label: string }[] = useMemo(
    () => [
      { value: "auto", label: t("keywords.options.sources.auto") },
      {
        value: "suggestions",
        label: t("keywords.options.sources.suggestions"),
      },
      { value: "ideas", label: t("keywords.options.sources.ideas") },
      { value: "related", label: t("keywords.options.sources.related") },
    ],
    [t],
  );

  const googleAdsOnlyNote = t("keywords.options.google_ads_only_note");

  return (
    <controlsForm.Subscribe selector={(state) => state.values}>
      {(values) => {
        // Google-Ads-only countries ignore source, clickstream, and grouping.
        const labs = isLabsLocationCode(values.locationCode);
        const local = Boolean(values.locationName);

        return (
          <>
            <Button
              variant="outline"
              className="w-full font-normal lg:w-auto lg:shrink-0"
              aria-haspopup="dialog"
              onClick={() => setOpen(true)}
            >
              <SlidersHorizontal data-icon="inline-start" />
              {t("keywords.search_bar.options_button")}
            </Button>

            {open ? (
              <FormDialog
                title={t("keywords.options.title")}
                onClose={() => setOpen(false)}
                actions={
                  <Button onClick={() => setOpen(false)}>
                    {t("keywords.options.done")}
                  </Button>
                }
              >
                <controlsForm.AppField name="resultLimit">
                  {(field) => (
                    <field.SelectField
                      label={t("keywords.options.results_label")}
                      items={resultItems}
                    />
                  )}
                </controlsForm.AppField>

                <controlsForm.AppField name="mode">
                  {(field) => (
                    <field.SelectField
                      label={t("keywords.options.source_label")}
                      description={labs ? undefined : googleAdsOnlyNote}
                      items={modeItems}
                      disabled={!labs}
                    />
                  )}
                </controlsForm.AppField>

                <controlsForm.Field name="clickstream">
                  {(field) => (
                    <ToggleRow
                      label={t("keywords.options.clickstream_label")}
                      help={
                        !labs
                          ? googleAdsOnlyNote
                          : local
                            ? t("keywords.options.clickstream_local_help")
                            : t("keywords.options.clickstream_help")
                      }
                      // The saved choice returns when the option applies again.
                      checked={labs && !local && field.state.value}
                      disabled={!labs || local}
                      onChange={(checked) => field.handleChange(checked)}
                    />
                  )}
                </controlsForm.Field>

                <ToggleRow
                  label={t("keywords.options.group_keywords_label")}
                  help={labs ? undefined : googleAdsOnlyNote}
                  checked={labs && groupKeywords}
                  disabled={!labs}
                  onChange={setGroupKeywords}
                />
              </FormDialog>
            ) : null}
          </>
        );
      }}
    </controlsForm.Subscribe>
  );
}

function ToggleRow({
  label,
  help,
  checked,
  disabled,
  onChange,
}: {
  label: string;
  help?: string;
  checked: boolean;
  disabled: boolean;
  onChange: (checked: boolean) => void;
}) {
  const id = useId();

  return (
    <Field orientation="horizontal" data-disabled={disabled}>
      <FieldContent>
        <FieldLabel htmlFor={id}>{label}</FieldLabel>
        {help ? (
          <FieldDescription id={`${id}-description`}>{help}</FieldDescription>
        ) : null}
      </FieldContent>
      <Switch
        id={id}
        aria-describedby={help ? `${id}-description` : undefined}
        checked={checked}
        disabled={disabled}
        onCheckedChange={onChange}
      />
    </Field>
  );
}
