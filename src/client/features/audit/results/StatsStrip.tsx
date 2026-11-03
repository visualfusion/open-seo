import { type ReactNode, useMemo } from "react";
import { MetricsTable } from "@/client/components/MetricsTable";
import {
  SCORE_TEXT_CLASS,
  scoreTone,
  SeverityBadge,
} from "@/client/features/audit/shared";
import { resolveIssueSeverity } from "@/client/features/audit/results/IssuesView";
import type { AuditResultsData } from "@/client/features/audit/results/types";
import { useLocale } from "@/client/lib/i18n";

interface StatItem {
  label: string;
  value: string;
  valueClass?: string;
  sub?: ReactNode;
}

export function StatsStrip({
  pagesCrawled,
  issues,
  totalLighthouse,
  averageResponseMs,
  lighthouseSummary,
}: {
  pagesCrawled: number;
  issues: AuditResultsData["issues"];
  totalLighthouse: number;
  averageResponseMs: number;
  lighthouseSummary: {
    failed: number;
    avgPerformance: number | null;
    avgSeo: number | null;
    avgAccessibility: number | null;
  };
}) {
  const { t } = useLocale();
  const severityCounts = useMemo(() => {
    const counts = { critical: 0, warning: 0, info: 0 };
    for (const issue of issues) {
      counts[resolveIssueSeverity(issue)] += 1;
    }
    return counts;
  }, [issues]);

  const items: StatItem[] = [
    { label: t("audit.stats.pages_crawled"), value: String(pagesCrawled) },
    {
      label: t("audit.stats.issues_found"),
      value: String(issues.length),
      valueClass: issues.length === 0 ? "text-success" : "",
      sub: issues.length > 0 && (
        <span className="flex flex-wrap items-center gap-1">
          {(["critical", "warning", "info"] as const).map((severity) =>
            severityCounts[severity] > 0 ? (
              <SeverityBadge
                key={severity}
                severity={severity}
                title={severity}
              >
                {severity === "critical"
                  ? t("audit.critical")
                  : severity === "warning"
                    ? t("audit.warning")
                    : t("audit.info")}{" "}
                {severityCounts[severity]}
              </SeverityBadge>
            ) : null,
          )}
        </span>
      ),
    },
    {
      label: t("audit.stats.avg_response_time"),
      value: `${averageResponseMs}ms`,
    },
  ];

  if (totalLighthouse > 0) {
    items.push(
      {
        label: t("audit.stats.lighthouse_tests"),
        value: String(totalLighthouse),
      },
      {
        label: t("audit.stats.lighthouse_performance"),
        value:
          lighthouseSummary.avgPerformance == null
            ? "-"
            : String(lighthouseSummary.avgPerformance),
        valueClass: scoreClass(lighthouseSummary.avgPerformance),
      },
      {
        label: t("audit.stats.lighthouse_seo"),
        value:
          lighthouseSummary.avgSeo == null
            ? "-"
            : String(lighthouseSummary.avgSeo),
        valueClass: scoreClass(lighthouseSummary.avgSeo),
      },
      {
        label: t("audit.stats.lighthouse_accessibility"),
        value:
          lighthouseSummary.avgAccessibility == null
            ? "-"
            : String(lighthouseSummary.avgAccessibility),
        valueClass: scoreClass(lighthouseSummary.avgAccessibility),
      },
      {
        label: t("audit.stats.lighthouse_failures"),
        value: String(lighthouseSummary.failed),
        valueClass:
          lighthouseSummary.failed > 0 ? "text-destructive" : "text-success",
      },
    );
  }

  return (
    <div className="w-full max-w-xl rounded-lg border border-border bg-card p-3">
      <MetricsTable
        rows={items.map((item) => ({
          label: (
            <div className="flex flex-wrap items-center gap-2">
              {item.label}
              {item.sub || null}
            </div>
          ),
          value: <span className={item.valueClass}>{item.value}</span>,
        }))}
      />
    </div>
  );
}

function scoreClass(score: number | null) {
  const tone = scoreTone(score);
  return tone ? SCORE_TEXT_CLASS[tone] : "";
}
