import { useLocale } from "@/client/lib/i18n";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/client/components/ui/select";

enum DateRange {
  Custom = "custom",
  Last7Days = "last_7_days",
  Last28Days = "last_28_days",
  Last3Months = "last_3_months",
  Last6Months = "last_6_months",
  Last12Months = "last_12_months",
  Last16Months = "last_16_months",
}

const LABELS: Record<DateRange, string> = {
  [DateRange.Custom]: "widgets.details.date_range_custom",
  [DateRange.Last7Days]: "widgets.details.date_range_last7days",
  [DateRange.Last28Days]: "widgets.details.date_range_last28days",
  [DateRange.Last3Months]: "widgets.details.date_range_last3months",
  [DateRange.Last6Months]: "widgets.details.date_range_last6months",
  [DateRange.Last12Months]: "widgets.details.date_range_last12months",
  [DateRange.Last16Months]: "widgets.details.date_range_last16months",
};

export function SearchConsoleDateRange({
  input,
  disabled,
  onChange,
}: {
  input: Record<string, unknown>;
  disabled: boolean;
  onChange: (value: string) => void;
}) {
  const { t } = useLocale();
  const labels = Object.fromEntries(
    Object.entries(LABELS).map(([value, key]) => [value, t(key)]),
  );
  return (
    <Select
      items={labels}
      value={
        input.startDate && input.endDate
          ? DateRange.Custom
          : typeof input.dateRange === "string"
            ? input.dateRange
            : DateRange.Last28Days
      }
      disabled={disabled}
      onValueChange={(value) => {
        if (value != null) onChange(value);
      }}
    >
      <SelectTrigger
        aria-label={t("search_performance.aria.date_range")}
        className="w-44 bg-card pr-3"
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {Object.values(DateRange).map((value) => (
          <SelectItem
            key={value}
            value={value}
            disabled={value === DateRange.Custom}
          >
            {labels[value]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
