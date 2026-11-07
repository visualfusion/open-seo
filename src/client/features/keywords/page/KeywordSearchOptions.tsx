import { useId, useMemo } from "react";
import { SlidersHorizontal } from "lucide-react";
import { Badge } from "@/client/components/ui/badge";
import { Button } from "@/client/components/ui/button";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
} from "@/client/components/ui/field";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/client/components/ui/popover";
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
        // Labs endpoints aren't available everywhere.
        const labs = isLabsLocationCode(values.locationCode);
        const local = Boolean(values.locationName);

        // Options that don't apply to this search don't count.
        const changedCount = [
          values.resultLimit !== RESULT_LIMITS[0],
          labs && values.mode !== "auto",
          labs && !local && values.clickstream,
          labs && groupKeywords,
        ].filter(Boolean).length;

        return (
          <Popover>
            <PopoverTrigger
              render={<Button variant="outline" className="font-normal" />}
            >
              <SlidersHorizontal data-icon="inline-start" />
              {t("keywords.search_bar.options_button")}
              {changedCount > 0 ? (
                <Badge variant="secondary" size="sm">
                  {changedCount}
                </Badge>
              ) : null}
            </PopoverTrigger>
            <PopoverContent align="start" className="w-80 gap-4 p-4">
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
            </PopoverContent>
          </Popover>
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
