import { useEffect } from "react";
import { useAppForm } from "@/client/components/form/useAppForm";
import {
  createFormValidationErrors,
  shouldValidateFieldOnChange,
} from "@/client/lib/forms";
import { useLocale } from "@/client/lib/i18n";
import {
  MAX_KEYWORDS_PER_SUBMIT,
  type KeywordMode,
  type ResultLimit,
} from "@/client/features/keywords/keywordResearchTypes";
import { parseKeywordInput } from "@/client/features/keywords/state/keywordControllerActions";

type UseKeywordControlsFormInput = {
  keywordInput: string;
  locationCode: number;
  locationName: string | undefined;
  resultLimit: ResultLimit;
  keywordMode: KeywordMode;
  clickstream: boolean;
};

export type KeywordControlsValues = {
  keyword: string;
  locationCode: number;
  locationName: string | undefined;
  resultLimit: ResultLimit;
  mode: KeywordMode;
  clickstream: boolean;
};

function getKeywordSearchValidationErrors(
  value: KeywordControlsValues,
  shouldValidateUntouchedField: boolean,
  validateEmptyKeyword: boolean,
  t: (key: string, params?: Record<string, string | number>) => string,
) {
  const keywords = parseKeywordInput(value.keyword);

  if (keywords.length === 0) {
    if (!validateEmptyKeyword) return null;
    return createFormValidationErrors({
      fields: {
        keyword: t("keywords.search_bar.validation_required"),
      },
    });
  }

  if (!shouldValidateUntouchedField) return null;

  if (keywords.length > MAX_KEYWORDS_PER_SUBMIT) {
    return createFormValidationErrors({
      fields: {
        keyword: t("keywords.search_bar.validation_max", {
          max: MAX_KEYWORDS_PER_SUBMIT,
        }),
      },
    });
  }

  return null;
}

export function useKeywordControlsForm(
  input: UseKeywordControlsFormInput,
  onSubmit: (value: KeywordControlsValues) => void,
) {
  const { t } = useLocale();

  const form = useAppForm({
    defaultValues: {
      keyword: input.keywordInput,
      locationCode: input.locationCode,
      locationName: input.locationName,
      resultLimit: input.resultLimit,
      mode: input.keywordMode,
      clickstream: input.clickstream,
    },
    validators: {
      onChange: ({ formApi, value }) =>
        getKeywordSearchValidationErrors(
          value,
          shouldValidateFieldOnChange(formApi, "keyword"),
          false,
          t,
        ),
      onSubmit: ({ value }) =>
        getKeywordSearchValidationErrors(value, true, true, t),
    },
    onSubmit: ({ value }) => {
      onSubmit(value);
    },
  });

  useEffect(() => {
    form.reset({
      keyword: input.keywordInput,
      locationCode: input.locationCode,
      locationName: input.locationName,
      resultLimit: input.resultLimit,
      mode: input.keywordMode,
      clickstream: input.clickstream,
    });
  }, [
    form,
    input.keywordInput,
    input.keywordMode,
    input.locationCode,
    input.locationName,
    input.resultLimit,
    input.clickstream,
  ]);

  return form;
}
