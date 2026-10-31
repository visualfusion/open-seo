import { useMemo, type FormEvent } from "react";
import { useStore } from "@tanstack/react-form";
import { useLocale } from "@/client/lib/i18n";
import { getFieldError } from "@/client/lib/forms";
import type { DomainOverviewControlsForm } from "@/client/features/domain/DomainOverviewPage";
import { toSortMode } from "@/client/features/domain/utils";
import type { DomainSortMode } from "@/client/features/domain/types";
import { LABS_LOCATION_OPTIONS } from "@/client/features/keywords/locations";
import { LocationSelect } from "@/client/components/LocationSelect";
import { ResearchScopeSelect } from "@/client/components/ResearchScopeSelect";
import { SearchCard, SearchInput } from "@/client/components/SearchCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/client/components/ui/select";
import type { ResearchScope } from "@/shared/researchScope";

type Props = {
  controlsForm: DomainOverviewControlsForm;
  isLoading: boolean;
  onSubmit: (event: FormEvent) => void;
  onDomainChange: (domain: string) => void;
  onScopeChange: (scope: ResearchScope) => void;
  onSortChange: (sort: DomainSortMode) => void;
  onLocationChange: (locationCode: number) => void;
};

export function DomainSearchCard({
  controlsForm,
  isLoading,
  onSubmit,
  onDomainChange,
  onScopeChange,
  onSortChange,
  onLocationChange,
}: Props) {
  const { t } = useLocale();
  const domainError = useStore(controlsForm.store, (state) =>
    getFieldError(state.fieldMeta.domain?.errors ?? []),
  );

  const sortItems = useMemo<{ value: DomainSortMode; label: string }[]>(
    () => [
      { value: "rank", label: t("domain.sort.rank") },
      { value: "traffic", label: t("domain.sort.traffic") },
      { value: "volume", label: t("domain.sort.volume") },
      { value: "score", label: t("domain.sort.score") },
      { value: "cpc", label: t("domain.sort.cpc") },
    ],
    [t],
  );

  return (
    <SearchCard
      onSubmit={onSubmit}
      pending={isLoading}
      error={domainError}
      errorId="domain-input-error"
    >
      <controlsForm.Field name="domain">
        {(field) => (
          <SearchInput
            placeholder={t("domain.input_placeholder")}
            aria-label={t("domain.input_aria_label")}
            value={field.state.value}
            onChange={(event) => {
              field.handleChange(event.target.value);
              onDomainChange(event.target.value);
            }}
            aria-invalid={domainError ? true : undefined}
            aria-describedby={domainError ? "domain-input-error" : undefined}
          />
        )}
      </controlsForm.Field>

      <controlsForm.Field name="scope">
        {(field) => (
          <ResearchScopeSelect
            value={field.state.value}
            className="w-full lg:w-40"
            onChange={(scope) => {
              field.handleChange(scope);
              onScopeChange(scope);
            }}
          />
        )}
      </controlsForm.Field>

      <controlsForm.Field name="locationCode">
        {(field) => (
          <LocationSelect
            value={field.state.value}
            options={LABS_LOCATION_OPTIONS}
            className="w-full lg:w-44 lg:shrink-0"
            onChange={(code) => {
              field.handleChange(code);
              onLocationChange(code);
            }}
          />
        )}
      </controlsForm.Field>

      <controlsForm.Field name="sort">
        {(field) => (
          <Select
            items={sortItems}
            value={field.state.value}
            onValueChange={(value) => {
              const next = toSortMode(value ?? "") ?? "traffic";
              field.handleChange(next);
              onSortChange(next);
            }}
          >
            <SelectTrigger
              aria-label={t("domain.sort_aria_label")}
              className="w-full shrink-0 lg:w-36"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {sortItems.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </controlsForm.Field>
    </SearchCard>
  );
}
