import type { ReactNode } from "react";
import type { KeywordResearchRow } from "@/types/keywords";
import { Card, CardContent } from "@/client/components/ui/card";
import { ScoreBadge } from "@/client/components/table/ScoreBadge";
import { useLocale } from "@/client/lib/i18n";
import { formatNumber, lastTwelveMonths, MONTH_SHORT_LABELS } from "../utils";
import { AreaTrendChart } from "./DisplayPrimitives";
import { IntentBadge } from "./IntentBadge";
export { SerpAnalysisCard } from "./SerpAnalysisCard";

export type { SortDir, SortField } from "./DisplayPrimitives";

function formatTrendRange(
  trend: KeywordResearchRow["trend"],
  locale = "en",
  t?: (key: string) => string,
): string {
  const last12 = lastTwelveMonths(trend);
  if (last12.length === 0)
    return t
      ? t("keywords.overview.last_12_available_months")
      : "Last 12 available months";

  const [startLabel, endLabel] = [last12[0], last12[last12.length - 1]].map(
    (m) => {
      const monthName =
        locale === "de"
          ? new Date(m.year, m.month - 1, 1).toLocaleDateString("de-DE", {
              month: "short",
            })
          : (MONTH_SHORT_LABELS[m.month - 1] ?? `M${m.month}`);
      return `${monthName} ${m.year}`;
    },
  );
  return startLabel === endLabel ? startLabel : `${startLabel} - ${endLabel}`;
}

function Stat({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="space-y-1">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="flex h-6 items-center text-lg font-semibold tabular-nums">
        {children}
      </dd>
    </div>
  );
}

/** The metrics and search trend of the keyword selected in the table. */
export function KeywordOverviewCard({
  keyword,
}: {
  keyword: KeywordResearchRow;
}) {
  const { t, locale } = useLocale();
  return (
    <Card size="sm" className="shrink-0">
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2">
          <h2 className="min-w-0 truncate font-semibold capitalize">
            {keyword.keyword}
          </h2>
          <IntentBadge intent={keyword.intent} />
        </div>
        <dl className="flex flex-wrap justify-between gap-x-4 gap-y-2">
          <Stat label={t("keywords.overview.volume")}>
            {formatNumber(keyword.searchVolume)}
          </Stat>
          <Stat label={t("keywords.overview.difficulty")}>
            <ScoreBadge value={keyword.keywordDifficulty} />
          </Stat>
          <Stat label={t("keywords.overview.cpc")}>
            {keyword.cpc == null ? "-" : `$${keyword.cpc.toFixed(2)}`}
          </Stat>
          <Stat label={t("keywords.overview.competition")}>
            {keyword.competition == null ? "-" : keyword.competition.toFixed(2)}
          </Stat>
        </dl>
        {keyword.trend.length > 0 ? (
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">
              {t("keywords.overview.search_trends", {
                range: formatTrendRange(keyword.trend, locale, t),
              })}
            </p>
            <AreaTrendChart trend={keyword.trend} className="h-[120px]" />
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
