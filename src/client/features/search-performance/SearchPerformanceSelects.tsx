import { useMemo } from "react";
import {
  GSC_DEVICES,
  SEARCH_PERFORMANCE_RANGES,
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

function isDevice(value: string): value is SearchPerformanceDevice {
  return GSC_DEVICES.some((option) => option === value);
}

/** Device, country, and date range selects of the table toolbar. */
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

  const rangeOptions = useMemo(() => {
    const labels: Record<SearchPerformanceDateRange, string> = {
      last_7_days: t("search_performance.ranges.last_7_days"),
      last_28_days: t("search_performance.ranges.last_28_days"),
      last_3_months: t("search_performance.ranges.last_3_months"),
    };
    return SEARCH_PERFORMANCE_RANGES.map((value) => ({
      value,
      label: labels[value],
    }));
  }, [t]);

  const deviceItems = useMemo(() => {
    const labels: Record<SearchPerformanceDevice, string> = {
      DESKTOP: t("search_performance.devices.desktop"),
      MOBILE: t("search_performance.devices.mobile"),
      TABLET: t("search_performance.devices.tablet"),
    };
    return [
      { value: ALL, label: t("search_performance.devices.all") },
      ...GSC_DEVICES.map((value) => ({
        value,
        label: labels[value],
      })),
    ];
  }, [t]);

  const device = search.device ?? ALL;
  const country = search.country ?? ALL;
  const range = search.range ?? "last_28_days";
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
          className="w-36"
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
      <Select
        items={rangeOptions}
        value={range}
        onValueChange={(value) => {
          if (value != null && isDateRange(value)) {
            onSearchChange({
              page: undefined,
              range: value,
            });
          }
        }}
      >
        <SelectTrigger
          size="sm"
          className="w-36"
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
    </div>
  );
}
