import { useLocale } from "@/client/lib/i18n";
import { SkeletonTableRows } from "@/client/components/SkeletonPresets";
import { CardShell } from "@/client/components/CardShell";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Area, AreaChart, XAxis, YAxis } from "recharts";
import { moreDetailsClass } from "@/client/features/dashboard/cardParts";
import { MetricsTable, percentChange } from "@/client/components/MetricsTable";
import { Ga4ConnectCard } from "@/client/features/dashboard/Ga4ConnectCard";
import {
  formatCount,
  formatCtr,
} from "@/client/features/search-performance/SearchPerformanceColumns";
import { getGa4DashboardReport } from "@/serverFunctions/ga4";
import { Skeleton } from "@/client/components/ui/skeleton";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/client/components/ui/chart";

function formatTrendDay(date: string): string {
  // Construct in local time: Date.parse("2026-08-01") is UTC midnight, which
  // toLocaleDateString would render as the previous day west of Greenwich.
  const [year, month, day] = date.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

function statValue(
  value: number | null,
  format: (value: number) => string,
): string {
  return value === null ? "—" : format(value);
}

export function Ga4Card({
  projectId,
  connected,
}: {
  projectId: string;
  connected: boolean;
}) {
  const { t } = useLocale();
  const reportQuery = useQuery({
    queryKey: ["dashboardGa4Report", projectId],
    queryFn: () => getGa4DashboardReport({ data: { projectId } }),
    enabled: connected,
  });
  const report = reportQuery.data;

  // Not connected (or a dead grant discovered by the report call): the
  // connection card sells and runs the whole flow itself.
  if (!connected || (report && !report.connected)) {
    return <Ga4ConnectCard projectId={projectId} connected={connected} />;
  }

  // The empty state covers null sessions (no report row) and 0: a zero-session
  // period would otherwise render an all-zero flatline chart in an empty box.
  return (
    <CardShell
      title={t("dashboard.details.organic_traffic")}
      action={
        <Link
          to="/p/$projectId/settings"
          params={{ projectId }}
          hash="google-analytics"
          className={moreDetailsClass}
        >
          {t("dashboard.details.manage")}
        </Link>
      }
    >
      <p className="mb-4 text-sm text-muted-foreground">
        {t("dashboard.details.google_analytics_last_28_days")}
      </p>
      {reportQuery.isError ? (
        <p className="text-sm text-muted-foreground">
          {t("dashboard.details.couldn_t_load_google_again_shortly")}
        </p>
      ) : !report ? (
        <div className="space-y-3" aria-busy>
          <SkeletonTableRows rows={5} columns={3} />
          <Skeleton className="h-24" />
        </div>
      ) : !report.totals.sessions ? (
        <p className="text-sm text-muted-foreground">
          {t("dashboard.details.no_organic_search_traffic_28_days")}
        </p>
      ) : (
        <div className="space-y-4">
          <MetricsTable
            showChange
            rows={[
              {
                label: t("dashboard.details.sessions"),
                value: statValue(report.totals.sessions, formatCount),
                change: percentChange(
                  report.totals.sessions,
                  report.prevTotals.sessions,
                ),
              },
              {
                label: t("dashboard.details.active_users"),
                value: statValue(report.totals.activeUsers, formatCount),
                change: percentChange(
                  report.totals.activeUsers,
                  report.prevTotals.activeUsers,
                ),
              },
              {
                label: t("integrations.dashboard_ext.ga4_card.engagement_rate"),
                value: statValue(report.totals.engagementRate, formatCtr),
                change: null,
              },
              {
                label: t("integrations.dashboard_ext.ga4_card.key_events"),
                value: statValue(report.totals.keyEvents, formatCount),
                change: percentChange(
                  report.totals.keyEvents,
                  report.prevTotals.keyEvents,
                ),
              },
            ].map((metric) => ({
              label: metric.label,
              value: metric.value,
              change:
                metric.change === null ? undefined : (
                  <span
                    className={
                      metric.change > 0
                        ? "text-success"
                        : metric.change < 0
                          ? "text-destructive"
                          : "text-muted-foreground"
                    }
                  >
                    {metric.change > 0 ? "+" : ""}
                    {metric.change}%
                  </span>
                ),
            }))}
          />
          <ChartContainer
            config={{
              sessions: {
                label: t("dashboard.details.sessions"),
                color: "var(--color-primary)",
              },
            }}
            className="h-24"
          >
            <AreaChart
              data={report.trend}
              margin={{ top: 4, right: 0, bottom: 0, left: 0 }}
            >
              <XAxis dataKey="date" hide />
              <YAxis hide domain={[0, "auto"]} />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    labelFormatter={(label: unknown) =>
                      typeof label === "string" ? formatTrendDay(label) : ""
                    }
                    valueFormatter={(value) => formatCount(Number(value))}
                  />
                }
              />
              <Area
                type="monotone"
                dataKey="sessions"
                stroke="var(--color-sessions)"
                strokeWidth={2}
                fill="var(--color-sessions)"
                fillOpacity={0.08}
              />
            </AreaChart>
          </ChartContainer>
        </div>
      )}
    </CardShell>
  );
}
