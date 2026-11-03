import { getCurrentLocale, useLocale } from "@/client/lib/i18n";
import { Bar, BarChart } from "recharts";
import type { BillingUsage } from "@/server/billing/usage";
import { QueryState } from "@/client/components/QueryState";
import {
  ChartGrid,
  ChartXAxis,
  ChartYAxis,
} from "@/client/components/ChartAxes";
import { Skeleton } from "@/client/components/ui/skeleton";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/client/components/ui/chart";
import { BillingUsageSection } from "@/client/features/billing/BillingUsageSection";
import { useBillingUsage } from "@/client/features/billing/useBillingUsage";

export function BillingUsageChart() {
  const { t } = useLocale();
  const usageQuery = useBillingUsage();

  return (
    <BillingUsageSection title={t("billing.details.usage")}>
      <QueryState
        query={usageQuery}
        errorFallback={t("billing.details.failed_to_load_usage")}
        loading={<Skeleton className="h-40 w-full" />}
      >
        {(usage) => <UsageChart days={usage.days} />}
      </QueryState>
    </BillingUsageSection>
  );
}

function UsageChart({ days }: { days: BillingUsage["days"] }) {
  const { t } = useLocale();
  const totalSpend = days.reduce((sum, day) => sum + day.usd, 0);

  return (
    <div className="space-y-3">
      <div className="text-2xl font-semibold tabular-nums">
        ${totalSpend.toFixed(2)}
      </div>

      <div className="h-32 w-full min-w-0">
        {totalSpend === 0 ? (
          <div className="flex h-full items-center justify-center">
            <span className="text-sm text-muted-foreground">
              {t("billing.details.no_usage_recorded_yet")}
            </span>
          </div>
        ) : (
          <ChartContainer
            config={{
              usd: {
                label: t("billing.details.usage"),
                color: "#7c3aed",
              },
            }}
            className="h-full"
          >
            <BarChart
              data={days}
              margin={{ top: 4, right: 0, bottom: 0, left: 0 }}
            >
              <ChartGrid />
              <ChartXAxis
                dataKey="date"
                tickFormatter={formatShortDate}
                minTickGap={40}
              />
              <ChartYAxis tickFormatter={formatUsdAxis} />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    labelFormatter={(label: unknown) =>
                      typeof label === "number" ? formatShortDate(label) : ""
                    }
                    valueFormatter={(value) => `$${Number(value).toFixed(2)}`}
                  />
                }
              />
              <Bar
                dataKey="usd"
                fill="var(--color-usd)"
                radius={[2, 2, 0, 0]}
                maxBarSize={12}
              />
            </BarChart>
          </ChartContainer>
        )}
      </div>
    </div>
  );
}

function formatShortDate(timestamp: number) {
  return new Date(timestamp).toLocaleDateString(getCurrentLocale(), {
    month: "short",
    day: "numeric",
  });
}

function formatUsdAxis(value: number) {
  return `$${value % 1 === 0 ? value : value.toFixed(2)}`;
}
