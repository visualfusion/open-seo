import { useLocale } from "@/client/lib/i18n";
import { useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Save } from "lucide-react";
import { QueryState } from "@/client/components/QueryState";
import { SafeExternalLink } from "@/client/components/SafeExternalLink";
import { Button } from "@/client/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/client/components/ui/sheet";
import { Skeleton } from "@/client/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/client/components/ui/table";
import { cardTableClass } from "@/client/features/dashboard/cardParts";
import { displayKey } from "@/client/features/search-performance/SearchPerformanceChanges";
import { SearchPerformanceChart } from "@/client/features/search-performance/SearchPerformanceChart";
import {
  formatCount,
  formatPosition,
} from "@/client/features/search-performance/SearchPerformanceColumns";
import { useSaveQueriesAsKeywords } from "@/client/features/search-performance/SearchPerformanceParts";
import {
  detailQueryOptions,
  type DetailSelection,
  type FilterInput,
} from "@/client/features/search-performance/searchPerformanceQueries";
import { TrackRankingsMenu } from "@/client/features/search-performance/TrackRankingsMenu";

function DetailBody({
  projectId,
  selection,
  filterInput,
  isWeb,
}: {
  projectId: string;
  selection: DetailSelection;
  filterInput: FilterInput;
  isWeb: boolean;
}) {
  const { t } = useLocale();
  const detailQuery = useQuery(
    detailQueryOptions(projectId, selection, filterInput),
  );
  const isQuery = selection.dimension === "query";
  return (
    <QueryState
      query={detailQuery}
      errorFallback={t("search_performance.failed_to_load_search_console_data")}
      loading={
        <div className="flex flex-col gap-4" aria-busy>
          <Skeleton className="h-32" />
          <Skeleton className="h-48" />
        </div>
      }
    >
      {(detail) =>
        // A dead grant: the page shows the connect card on its next load.
        !detail.connected ? null : (
          <div className="flex flex-col gap-8">
            <SearchPerformanceChart
              totals={detail.totals}
              prevTotals={detail.prevTotals}
              trend={detail.trend}
              prevTrend={detail.prevTrend}
              showPosition={isWeb}
              initialMetrics={
                isWeb ? ["clicks", "position"] : ["clicks", "impressions"]
              }
              chartClassName="h-48"
            />
            {isWeb ? (
              <div>
                <h3 className="mb-1 text-sm font-medium">
                  {isQuery
                    ? t("search_performance.pages_ranking_for_this_query")
                    : t("search_performance.queries_this_page_ranks_for")}
                </h3>
                {detail.related.length === 0 ? (
                  <p className="py-2 text-sm text-muted-foreground">
                    {isQuery
                      ? t(
                          "search_performance.google_reported_no_pages_for_this_query",
                        )
                      : t(
                          "search_performance.google_reported_no_queries_for_this_page",
                        )}
                  </p>
                ) : (
                  <Table className={cardTableClass}>
                    <TableHeader>
                      <TableRow>
                        <TableHead>
                          {isQuery
                            ? t("search_performance.page")
                            : t("search_performance.query")}
                        </TableHead>
                        <TableHead className="text-right">
                          {t("search_performance.clicks")}
                        </TableHead>
                        <TableHead className="hidden text-right sm:table-cell">
                          {t("search_performance.impressions")}
                        </TableHead>
                        <TableHead className="text-right">
                          {t("search_performance.position")}
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {detail.related.map((row) => (
                        <TableRow key={row.key}>
                          <TableCell className="w-full max-w-0">
                            <span className="block truncate" title={row.key}>
                              {displayKey(row.key)}
                            </span>
                          </TableCell>
                          <TableCell className="text-right tabular-nums">
                            {formatCount(row.clicks)}
                          </TableCell>
                          <TableCell className="hidden text-right tabular-nums sm:table-cell">
                            {formatCount(row.impressions)}
                          </TableCell>
                          <TableCell className="text-right tabular-nums">
                            {formatPosition(row.position)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </div>
            ) : null}
          </div>
        )
      }
    </QueryState>
  );
}

function QueryActions({
  projectId,
  query,
}: {
  projectId: string;
  query: string;
}) {
  const { t } = useLocale();
  const save = useSaveQueriesAsKeywords(projectId);
  return (
    <SheetFooter className="flex-row flex-wrap border-t border-border px-6">
      <Button
        variant="outline"
        size="sm"
        pending={save.isPending}
        onClick={() => save.mutate([query])}
      >
        {save.isPending ? null : <Save data-icon="inline-start" />}
        {t("search_performance.save_as_keyword")}
      </Button>
      <TrackRankingsMenu
        projectId={projectId}
        queries={[query]}
        variant="outline"
      />
    </SheetFooter>
  );
}

/**
 * One query or page from the tables: its own trend against the previous
 * period, and the pages that rank for the query (or the queries the page
 * ranks for).
 */
export function SearchPerformanceDetailSheet({
  projectId,
  selection,
  filterInput,
  isWeb,
  periodLabel,
  onClose,
}: {
  projectId: string;
  selection: DetailSelection | null;
  filterInput: FilterInput;
  isWeb: boolean;
  /** The selected date range, for example "Last 28 days". */
  periodLabel: string;
  onClose: () => void;
}) {
  const { t } = useLocale();
  // Focus starts on the panel, not on a metric toggle inside it.
  const headerRef = useRef<HTMLDivElement>(null);
  return (
    <Sheet
      open={selection !== null}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <SheetContent
        initialFocus={headerRef}
        className="gap-0 overflow-y-auto data-[side=right]:w-full data-[side=right]:sm:max-w-xl"
      >
        {selection ? (
          <>
            <SheetHeader
              ref={headerRef}
              tabIndex={-1}
              className="p-6 pb-4 outline-none"
            >
              <SheetDescription>
                {selection.dimension === "query"
                  ? t("search_performance.query")
                  : t("search_performance.page")}{" "}
                · {periodLabel}
              </SheetDescription>
              <SheetTitle className="pr-8 text-lg font-semibold break-words">
                {selection.dimension === "page" ? (
                  <SafeExternalLink
                    url={selection.key}
                    label={displayKey(selection.key)}
                    className="inline-flex items-center gap-1.5 underline-offset-4 hover:underline"
                  />
                ) : (
                  selection.key
                )}
              </SheetTitle>
            </SheetHeader>
            <div className="px-6 pb-6">
              <DetailBody
                // A fresh chart per row, so its metric toggles start over.
                key={`${selection.dimension}:${selection.key}`}
                projectId={projectId}
                selection={selection}
                filterInput={filterInput}
                isWeb={isWeb}
              />
            </div>
            {selection.dimension === "query" ? (
              <QueryActions projectId={projectId} query={selection.key} />
            ) : null}
          </>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
