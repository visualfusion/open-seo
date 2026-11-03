import { useEffect, useState } from "react";
import { useForm, useStore } from "@tanstack/react-form";
import { useLocale } from "@/client/lib/i18n";
import {
  createFormValidationErrors,
  getFieldError,
  shouldValidateFieldOnChange,
} from "@/client/lib/forms";
import { ResearchScopeSelect } from "@/client/components/ResearchScopeSelect";
import { SearchCard, SearchInput } from "@/client/components/SearchCard";
import {
  defaultScopeForInput,
  parseResearchTarget,
} from "@/shared/researchScope";
import type { BacklinksSearchState } from "./backlinksPageTypes";

type SearchDraft = Pick<BacklinksSearchState, "target" | "scope">;

function getBacklinksValidationErrors(
  value: SearchDraft,
  shouldValidateUntouchedField: boolean,
  errorMessage: string,
  validateFormat = false,
) {
  if (!value.target.trim()) {
    if (!shouldValidateUntouchedField) {
      return null;
    }

    return createFormValidationErrors({
      fields: {
        target: errorMessage,
      },
    });
  }

  if (validateFormat) {
    const parsed = parseResearchTarget(value.target, value.scope);
    if (!parsed.ok) {
      return createFormValidationErrors({
        fields: { target: parsed.message },
      });
    }
  }

  return null;
}

export function BacklinksSearchCard({
  initialValues,
  onSubmit,
}: {
  initialValues: SearchDraft;
  onSubmit: (values: SearchDraft) => void;
}) {
  const { t } = useLocale();
  const [userSelectedScope, setUserSelectedScope] = useState(false);
  const form = useForm({
    defaultValues: initialValues,
    validators: {
      onChange: ({ formApi, value }) =>
        getBacklinksValidationErrors(
          value,
          shouldValidateFieldOnChange(formApi, "target"),
          t("backlinks.target_validation_error"),
        ),
      onSubmit: ({ value }) =>
        getBacklinksValidationErrors(
          value,
          true,
          t("backlinks.target_validation_error"),
          true,
        ),
    },
    onSubmit: ({ value }) => {
      onSubmit({ ...value, target: value.target.trim() });
    },
  });

  useEffect(() => {
    form.reset(initialValues);
    setUserSelectedScope(false);
  }, [form, initialValues]);

  const targetError = useStore(form.store, (state) =>
    getFieldError(state.fieldMeta.target?.errors ?? []),
  );

  return (
    <SearchCard
      onSubmit={(event) => {
        event.preventDefault();
        void form.handleSubmit();
      }}
      error={targetError}
      errorId="backlinks-target-error"
    >
      <form.Field name="target">
        {(field) => (
          <SearchInput
            placeholder={t("backlinks.input_placeholder")}
            aria-label={t("backlinks.input_aria_label")}
            value={field.state.value}
            onChange={(event) => {
              const nextTarget = event.target.value;
              field.handleChange(nextTarget);
              if (!userSelectedScope) {
                form.setFieldValue("scope", defaultScopeForInput(nextTarget));
              }
            }}
            aria-invalid={targetError ? true : undefined}
            aria-describedby={
              targetError ? "backlinks-target-error" : undefined
            }
          />
        )}
      </form.Field>

      <form.Field name="scope">
        {(field) => (
          <ResearchScopeSelect
            value={field.state.value}
            onChange={(scope) => {
              setUserSelectedScope(true);
              field.handleChange(scope);
            }}
          />
        )}
      </form.Field>
    </SearchCard>
  );
}
