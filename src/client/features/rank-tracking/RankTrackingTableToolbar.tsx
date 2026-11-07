import { useEffect, useState } from "react";
import { CalendarDays, SlidersHorizontal, Table } from "lucide-react";
import { clamp } from "remeda";
import { SegmentedToggle } from "@/client/components/SegmentedToggle";
import { ExportMenu } from "@/client/components/ExportMenu";
import { Badge } from "@/client/components/ui/badge";
import { Button } from "@/client/components/ui/button";
import { Progress } from "@/client/components/ui/progress";
import { Spinner } from "@/client/components/ui/spinner";
import { useLocale } from "@/client/lib/i18n";
import { parseDbTimestamp } from "@/client/lib/db-timestamp";
import { MoreMenu } from "./ToolbarMenus";

const USUAL_CHECK_MS = 60 * 60_000;

/**
 * An estimate, not a measure: the bar follows the time since the check started
 * against how long one usually takes, and stops short of full for slower ones.
 */
function RankCheckProgress({ startedAt }: { startedAt: string }) {
  const { t } = useLocale();
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(timer);
  }, []);
  const elapsedMs = now - parseDbTimestamp(startedAt).getTime();
  return (
    <Progress
      className="ml-1 w-36"
      aria-label={t("ranks.details.rank_check_progress")}
      value={clamp(elapsedMs / USUAL_CHECK_MS, { min: 0.03, max: 0.95 })}
      max={1}
    />
  );
}

export function RankTrackingTableToolbar({
  showFilters,
  onToggleFilters,
  activeFilterCount,
  isRunning,
  latestRun,
  keywordCount,
  viewMode,
  onViewModeChange,
  historyAvailable,
  onExport,
  onCheckNow,
  onRefreshMetrics,
  metricsRefreshing,
  trackedKeywordCount,
  checkBusy,
  checkDisabled,
  hasData,
}: {
  showFilters: boolean;
  onToggleFilters: () => void;
  activeFilterCount: number;
  isRunning: boolean;
  latestRun:
    | { status: string; keywordsTotal: number; startedAt: string }
    | null
    | undefined;
  keywordCount: number;
  viewMode: "table" | "history";
  onViewModeChange: (v: "table" | "history") => void;
  historyAvailable: boolean;
  onExport: (action: "sheets" | "csv" | "copy-list") => void;
  onCheckNow: () => void;
  onRefreshMetrics: () => void;
  metricsRefreshing: boolean;
  trackedKeywordCount: number;
  checkBusy: boolean;
  checkDisabled: boolean;
  hasData: boolean;
}) {
  const { t } = useLocale();

  return (
    <div className="shrink-0 flex flex-wrap items-center gap-2 px-4 py-2 border-y border-border">
      {/* History needs at least two checks to compare; until then the toggle
          would only offer a worse copy of the Latest table. */}
      {historyAvailable && (
        <SegmentedToggle
          showLabels
          items={[
            {
              value: "table" as const,
              icon: <Table className="size-3.5" />,
              label: t("ranks.toolbar.latest"),
            },
            {
              value: "history" as const,
              icon: <CalendarDays className="size-3.5" />,
              label: t("ranks.toolbar.history"),
            },
          ]}
          value={viewMode}
          onChange={onViewModeChange}
        />
      )}

      <Button
        variant="outline"
        size="sm"
        aria-pressed={showFilters}
        className="aria-pressed:bg-muted aria-pressed:text-foreground"
        onClick={onToggleFilters}
        title={t("search_performance.filters.toggle_title")}
      >
        <SlidersHorizontal data-icon="inline-start" />
        {t("ranks.toolbar.filters")}
        {activeFilterCount > 0 && <Badge size="sm">{activeFilterCount}</Badge>}
      </Button>

      {isRunning && latestRun ? (
        <div className="ml-2 flex items-center gap-2.5 text-sm font-medium text-foreground">
          <Spinner className="text-primary" />
          <span>
            {latestRun.status === "pending"
              ? t("ranks.toolbar.preparing")
              : t("ranks.toolbar.fetching_rankings", {
                  count: latestRun.keywordsTotal || "?",
                })}
          </span>
          {latestRun.status === "running" && (
            <RankCheckProgress startedAt={latestRun.startedAt} />
          )}
        </div>
      ) : (
        <span className="text-sm text-muted-foreground">
          {keywordCount === 1
            ? t("ranks.toolbar.keywords_count_one")
            : t("ranks.toolbar.keywords_count", { count: keywordCount })}
        </span>
      )}

      <div className="flex-1" />

      <ExportMenu
        actions={["sheets", "csv", "copy-list"]}
        copyListLabel={t("ranks.toolbar.copy_keywords")}
        onExport={onExport}
        disabled={!hasData}
      />

      {/* Both actions need a paid plan; free users get the page's upgrade
          alert instead of a menu whose items fail. */}
      {!checkDisabled && (
        <MoreMenu
          onCheckNow={onCheckNow}
          checkBusy={checkBusy}
          onRefreshMetrics={onRefreshMetrics}
          metricsRefreshing={metricsRefreshing}
          trackedKeywordCount={trackedKeywordCount}
          hasData={hasData}
        />
      )}
    </div>
  );
}
