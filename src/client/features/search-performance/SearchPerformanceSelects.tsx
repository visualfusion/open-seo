import { useMemo } from "react";
import {
  GSC_DEVICES,
  SEARCH_PERFORMANCE_RANGES,
  SEARCH_PERFORMANCE_TYPES,
  type SearchPerformanceType,
  type SearchPerformanceDateRange,
  type SearchPerformanceDevice,
  type SearchPerformanceSearch,
} from "@/types/schemas/search-performance";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/client/components/ui/select";
import { useLocale } from "@/client/lib/i18n";

// Sentinel for "no filter" in the selects; never written to the URL.
const ALL = "ALL";

function isDateRange(value: string): value is SearchPerformanceDateRange {
  return SEARCH_PERFORMANCE_RANGES.some((option) => option === value);
}

function isSearchType(value: string): value is SearchPerformanceType {
  return SEARCH_PERFORMANCE_TYPES.some((option) => option === value);
}

function isDevice(value: string): value is SearchPerformanceDevice {
  return GSC_DEVICES.some((option) => option === value);
}

/** Search type, device, country, and date range selects of the table toolbar. */
export function SearchPerformanceSelects({
  search,
  countries,
  onSearchChange,
}: {
  search: SearchPerformanceSearch;
  countries: { key: string }[];
  onSearchChange: (update: Partial<SearchPerformanceSearch>) => void;
}) {
  const { t } = useLocale();
  const device = search.device ?? ALL;
  const country = search.country ?? ALL;
  const range = search.range ?? "last_28_days";

  const typeOptions = useMemo(
    () => [
      { value: "web" as const, label: t("search_performance.types.web") },
      {
        value: "discover" as const,
        label: t("search_performance.types.discover"),
      },
      {
        value: "googleNews" as const,
        label: t("search_performance.types.googleNews"),
      },
    ],
    [t],
  );

  const deviceOptions = useMemo(
    () => [
      {
        value: "DESKTOP" as const,
        label: t("search_performance.devices.desktop"),
      },
      {
        value: "MOBILE" as const,
        label: t("search_performance.devices.mobile"),
      },
      {
        value: "TABLET" as const,
        label: t("search_performance.devices.tablet"),
      },
    ],
    [t],
  );

  const deviceItems = useMemo(
    () => [
      { value: ALL, label: t("search_performance.devices.all") },
      ...deviceOptions,
    ],
    [deviceOptions, t],
  );

  const countryItems = useMemo(
    () => [
      { value: ALL, label: t("search_performance.countries.all") },
      ...(country !== ALL && !countries.some((row) => row.key === country)
        ? [{ value: country, label: country.toUpperCase() }]
        : []),
      ...countries.map((row) => ({
        value: row.key,
        label: row.key.toUpperCase(),
      })),
    ],
    [countries, country, t],
  );

  return (
    <div className="ml-auto flex flex-wrap items-center justify-end gap-2">
      <Select
        items={typeOptions}
        value={search.type ?? "web"}
        onValueChange={(value) => {
          if (value == null || !isSearchType(value)) return;
          // Discover and Google News have no queries: drop the query filter
          // and the query tabs along with the switch.
          onSearchChange({
            type: value === "web" ? undefined : value,
            tab: undefined,
            page: undefined,
            queryText: undefined,
            queryMatch: undefined,
          });
        }}
      >
        <SelectTrigger
          size="sm"
          className="w-36"
          aria-label={t("search_performance.aria.search_type")}
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {typeOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        items={deviceItems}
        value={device}
        onValueChange={(value) => {
          if (value == null) return;
          onSearchChange({
            page: undefined,
            device: isDevice(value) ? value : undefined,
          });
        }}
      >
        <SelectTrigger
          size="sm"
          className="w-36"
          aria-label={t("search_performance.aria.device_filter")}
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {deviceItems.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        items={countryItems}
        value={country}
        onValueChange={(value) => {
          if (value == null) return;
          onSearchChange({
            page: undefined,
            country: value === ALL ? undefined : value,
          });
        }}
      >
        <SelectTrigger
          size="sm"
          className="w-40"
          aria-label={t("search_performance.aria.country_filter")}
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {countryItems.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <DateRangeSelect
        value={range}
        onChange={(value) => onSearchChange({ page: undefined, range: value })}
        triggerClassName="w-36"
      />
    </div>
  );
}

export function DateRangeSelect({
  value,
  onChange,
  triggerClassName,
}: {
  value: SearchPerformanceDateRange;
  onChange: (value: SearchPerformanceDateRange) => void;
  triggerClassName?: string;
}) {
  const { t } = useLocale();

  const rangeOptions = useMemo(
    () => [
      {
        value: "last_7_days" as const,
        label: t("search_performance.ranges.last_7_days"),
      },
      {
        value: "last_28_days" as const,
        label: t("search_performance.ranges.last_28_days"),
      },
      {
        value: "last_3_months" as const,
        label: t("search_performance.ranges.last_3_months"),
      },
    ],
    [t],
  );

  return (
    <Select
      items={rangeOptions}
      value={value}
      onValueChange={(next) => {
        if (next != null && isDateRange(next)) onChange(next);
      }}
    >
      <SelectTrigger
        size="sm"
        className={triggerClassName}
        aria-label={t("search_performance.aria.date_range")}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {rangeOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
