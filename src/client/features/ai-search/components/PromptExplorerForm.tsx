import type { FormEvent } from "react";
import { cn } from "cn";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/client/components/ui/tooltip";
import { sortBy } from "remeda";
import { Button } from "@/client/components/ui/button";
import { Card, CardContent } from "@/client/components/ui/card";
import { Checkbox } from "@/client/components/ui/checkbox";
import {
  Field,
  FieldDescription,
  FieldLabel,
  FieldTitle,
} from "@/client/components/ui/field";
import { Input } from "@/client/components/ui/input";
import { Label } from "@/client/components/ui/label";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/client/components/ui/combobox";
import {
  WEB_SEARCH_COUNTRY_CODES,
  supportsWebSearchCountry,
} from "@/shared/prompt-search-countries";
import { Textarea } from "@/client/components/ui/textarea";
import {
  formatCountryLabel,
  formatModelLabel,
} from "@/shared/prompt-explorer-labels";
import {
  PROMPT_EXPLORER_MAX_PROMPT_LENGTH,
  PROMPT_EXPLORER_MODELS,
  type PromptExplorerModel,
  type WebSearchCountrySelection,
} from "@/types/schemas/ai-search";
import { useLocale } from "@/client/lib/i18n";

type FormValues = {
  prompt: string;
  highlightBrand: string;
  models: PromptExplorerModel[];
  webSearch: boolean;
  webSearchCountryCode: WebSearchCountrySelection;
};

type Props = {
  form: FormValues;
  onPromptChange: (value: string) => void;
  onHighlightBrandChange: (value: string) => void;
  onModelsChange: (value: PromptExplorerModel[]) => void;
  onWebSearchChange: (value: boolean) => void;
  onCountryChange: (value: WebSearchCountrySelection) => void;
  onSubmit: (event: FormEvent) => void;
  validationError: string | null;
};

const SORTED_COUNTRY_ITEMS = sortBy(
  WEB_SEARCH_COUNTRY_CODES.map((code) => ({
    value: code as WebSearchCountrySelection,
    label: formatCountryLabel(code),
  })),
  (item) => item.label,
);

export function PromptExplorerForm({
  form,
  onPromptChange,
  onHighlightBrandChange,
  onModelsChange,
  onWebSearchChange,
  onCountryChange,
  onSubmit,
  validationError,
}: Props) {
  const { t } = useLocale();
  const allCountryItems: Array<{
    value: WebSearchCountrySelection;
    label: string;
  }> = [
    {
      value: "default",
      label: t("brand_lookup.prompt_explorer.no_country_pref"),
    },
    ...SORTED_COUNTRY_ITEMS,
  ];
  const toggleModel = (model: PromptExplorerModel) => {
    if (form.models.includes(model)) {
      onModelsChange(form.models.filter((m) => m !== model));
    } else {
      onModelsChange([...form.models, model]);
    }
  };

  const countryItems = allCountryItems.filter(
    (item) =>
      item.value === "default" ||
      item.value === form.webSearchCountryCode ||
      form.models.some((model) => supportsWebSearchCountry(model, item.value)),
  );
  const unsupportedModels =
    form.webSearch && form.webSearchCountryCode !== "default"
      ? form.models.filter(
          (model) =>
            !supportsWebSearchCountry(model, form.webSearchCountryCode),
        )
      : [];
  const supportedModels = form.models.filter(
    (model) => !unsupportedModels.includes(model),
  );

  const promptCharCount = form.prompt.length;
  const promptOverLimit = promptCharCount > PROMPT_EXPLORER_MAX_PROMPT_LENGTH;

  return (
    <Card>
      <CardContent>
        <form onSubmit={onSubmit} noValidate className="space-y-5">
          <Field>
            <FieldLabel htmlFor="prompt-explorer-prompt">
              {t("brand_lookup.prompt_explorer.prompt_label")}
            </FieldLabel>
            <Textarea
              id="prompt-explorer-prompt"
              className="resize-none"
              rows={3}
              value={form.prompt}
              maxLength={PROMPT_EXPLORER_MAX_PROMPT_LENGTH + 50}
              onChange={(event) => onPromptChange(event.target.value)}
              aria-invalid={promptOverLimit ? true : undefined}
              autoFocus
            />
            <FieldDescription className="flex items-center justify-between">
              <span>{t("brand_lookup.prompt_explorer.prompt_desc")}</span>
              <span
                className={cn(
                  "tabular-nums",
                  promptOverLimit && "font-medium text-destructive",
                )}
              >
                {promptCharCount}/{PROMPT_EXPLORER_MAX_PROMPT_LENGTH}
              </span>
            </FieldDescription>
          </Field>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="prompt-explorer-brand">
                {t("brand_lookup.prompt_explorer.highlight_label")}
              </FieldLabel>
              <Input
                id="prompt-explorer-brand"
                value={form.highlightBrand}
                onChange={(event) => onHighlightBrandChange(event.target.value)}
                autoComplete="off"
                spellCheck={false}
              />
              <FieldDescription>
                {t("brand_lookup.prompt_explorer.highlight_desc")}
              </FieldDescription>
            </Field>

            <Field>
              <FieldTitle>
                {t("brand_lookup.prompt_explorer.models_label")}
              </FieldTitle>
              <div className="flex flex-wrap items-start gap-x-5 gap-y-2 pt-1.5">
                {PROMPT_EXPLORER_MODELS.map((model) => (
                  <Label key={model} className="font-normal">
                    <Checkbox
                      checked={form.models.includes(model)}
                      onCheckedChange={() => toggleModel(model)}
                    />
                    <span>
                      {formatModelLabel(model)}
                      {unsupportedModels.includes(model) &&
                      form.webSearchCountryCode !== "default" ? (
                        <span className="block text-xs text-muted-foreground">
                          {t(
                            "brand_lookup.prompt_explorer.skipped_for_country",
                            {
                              country: formatCountryLabel(
                                form.webSearchCountryCode,
                              ),
                            },
                          )}
                        </span>
                      ) : null}
                    </span>
                  </Label>
                ))}
              </div>
            </Field>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
            <div className="flex flex-wrap items-center gap-3">
              <Label className="font-normal">
                <Checkbox
                  checked={form.webSearch}
                  onCheckedChange={onWebSearchChange}
                />
                {t("brand_lookup.prompt_explorer.allow_web_search")}
              </Label>
              <Combobox
                items={countryItems}
                value={
                  allCountryItems.find(
                    (item) => item.value === form.webSearchCountryCode,
                  ) ?? null
                }
                itemToStringLabel={(item) => item.label}
                autoHighlight
                onValueChange={(item) => {
                  if (item) onCountryChange(item.value);
                }}
                disabled={!form.webSearch}
              >
                <ComboboxInput
                  aria-label={t(
                    "brand_lookup.prompt_explorer.web_search_country_aria",
                  )}
                  placeholder={t(
                    "brand_lookup.prompt_explorer.search_countries_placeholder",
                  )}
                  className="w-full sm:w-80"
                />
                <ComboboxContent>
                  <ComboboxEmpty>
                    {t("brand_lookup.prompt_explorer.no_countries_match")}
                  </ComboboxEmpty>
                  <ComboboxList>
                    {(item: (typeof allCountryItems)[number]) => (
                      <ComboboxItem key={item.value} value={item}>
                        {item.label}
                      </ComboboxItem>
                    )}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
              <Tooltip>
                <TooltipTrigger
                  render={
                    <button
                      type="button"
                      aria-label={t(
                        "brand_lookup.prompt_explorer.about_country_aria",
                      )}
                      className="text-muted-foreground"
                    />
                  }
                >
                  <Info className="size-4" />
                </TooltipTrigger>
                <TooltipContent>
                  {t("brand_lookup.prompt_explorer.about_country_tip")}
                </TooltipContent>
              </Tooltip>
            </div>
            <Button
              type="submit"
              className="px-6"
              disabled={supportedModels.length === 0}
            >
              {supportedModels.length === 1
                ? t("brand_lookup.prompt_explorer.run_one_model")
                : t("brand_lookup.prompt_explorer.run_many_models", {
                    count: supportedModels.length,
                  })}
            </Button>
          </div>

          {validationError ? (
            <p role="alert" className="text-sm text-destructive">
              {validationError}
            </p>
          ) : null}
        </form>
      </CardContent>
    </Card>
  );
}
