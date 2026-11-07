import { useMemo } from "react";
import { Search } from "lucide-react";
import { CountryFlag } from "@/client/components/CountryFlag";
import { Button } from "@/client/components/ui/button";
import { countryLabel } from "@/client/features/keywords/locations";
import { useLocale, type Locale } from "@/client/lib/i18n";
import {
  Combobox,
  ComboboxCollection,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
  ComboboxTrigger,
} from "@/client/components/ui/combobox";
import { InputGroupAddon } from "@/client/components/ui/input-group";
import { LOCATION_OPTIONS } from "@/shared/keyword-locations";

type LocationOption = (typeof LOCATION_OPTIONS)[number];
type LocationGroup = { value: string; items: LocationOption[] };

type Props = {
  value: number;
  onChange: (locationCode: number) => void;
  /** Defaults to the full country list. Pass a subset (e.g. Labs-only). */
  options?: readonly LocationOption[];
  /** Width utilities for the field. Defaults to full width. */
  className?: string;
};

// The ten countries with the most projects.
const POPULAR_LOCATION_CODES = new Set([
  2036, 2076, 2124, 2250, 2276, 2356, 2528, 2724, 2826, 2840,
]);

function matches(option: LocationOption, query: string): boolean {
  const needle = query.trim().toLowerCase();
  if (!needle) return true;
  return (
    option.label.toLowerCase().includes(needle) ||
    option.shortLabel.toLowerCase().includes(needle)
  );
}

/** Searchable country picker: type to filter the country list. */
export function LocationSelect({
  value,
  onChange,
  options = LOCATION_OPTIONS,
  className = "w-full",
}: Props) {
  const { t, locale } = useLocale();
  const localizedOptions = options.map((option) => ({
    ...option,
    label: countryLabel(option.code, locale) ?? option.label,
  }));
  const selected =
    localizedOptions.find((option) => option.code === value) ?? null;

  return (
    <Combobox
      items={localizedOptions}
      value={selected}
      itemToStringLabel={(option) => option.label}
      autoHighlight
      filter={matches}
      onValueChange={(option) => {
        if (option) onChange(option.code);
      }}
    >
      <ComboboxInput
        className={className}
        placeholder={t("ui.details.select_country")}
        aria-label={t("ui.location_select.country")}
      />
      <ComboboxContent>
        <ComboboxEmpty>{t("ui.details.no_countries_match")}</ComboboxEmpty>
        <ComboboxList>
          {(option: LocationOption) => (
            <ComboboxItem key={option.code} value={option}>
              {option.label}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}

function groupLocationOptions(
  selected: LocationOption | null,
  popularLabel: string,
  allCountriesLabel: string,
  locale: Locale,
) {
  const rest = LOCATION_OPTIONS.filter(
    (option) => option.code !== selected?.code,
  ).map((option) => ({
    ...option,
    label: countryLabel(option.code, locale) ?? option.label,
  }));
  const groups: LocationGroup[] = [
    // The selected country needs no heading: it sits first with its check.
    { value: "", items: selected ? [selected] : [] },
    {
      value: popularLabel,
      items: rest.filter((option) => POPULAR_LOCATION_CODES.has(option.code)),
    },
    {
      value: allCountriesLabel,
      items: rest.filter((option) => !POPULAR_LOCATION_CODES.has(option.code)),
    },
  ];
  return groups.filter((group) => group.items.length > 0);
}

/** `LocationSelect` as a compact button, with its search inside the list. */
export function LocationChipSelect({
  value,
  onChange,
}: Pick<Props, "value" | "onChange">) {
  const { t, locale } = useLocale();
  const selected = useMemo(() => {
    const raw = LOCATION_OPTIONS.find((option) => option.code === value);
    if (!raw) return null;
    return {
      ...raw,
      label: countryLabel(raw.code, locale) ?? raw.label,
    };
  }, [value, locale]);

  const groups = useMemo(
    () =>
      groupLocationOptions(
        selected,
        t("ui.details.popular_countries"),
        t("ui.details.all_countries"),
        locale,
      ),
    [selected, t, locale],
  );
  const label = selected?.label ?? t("ui.details.select_country");

  return (
    <Combobox
      items={groups}
      value={selected}
      itemToStringLabel={(option: LocationOption) => option.label}
      autoHighlight
      filter={matches}
      onValueChange={(option: LocationOption | null) => {
        if (option) onChange(option.code);
      }}
    >
      <ComboboxTrigger
        aria-label={`${t("ui.location_select.country")}: ${label}`}
        render={<Button variant="outline" className="font-normal" />}
      >
        <CountryFlag locationCode={value} />
        {label}
      </ComboboxTrigger>
      <ComboboxContent className="w-64">
        <ComboboxInput
          showTrigger={false}
          placeholder={t("common.search")}
          aria-label={t("ui.details.search_countries")}
        >
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
        </ComboboxInput>
        <ComboboxEmpty>{t("ui.details.no_countries_match")}</ComboboxEmpty>
        <ComboboxList>
          {(group: LocationGroup) => (
            <ComboboxGroup key={group.value} items={group.items}>
              {group.value ? (
                <ComboboxLabel>{group.value}</ComboboxLabel>
              ) : null}
              <ComboboxCollection>
                {(option: LocationOption) => (
                  <ComboboxItem key={option.code} value={option}>
                    <CountryFlag locationCode={option.code} />
                    {option.label}
                  </ComboboxItem>
                )}
              </ComboboxCollection>
            </ComboboxGroup>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
