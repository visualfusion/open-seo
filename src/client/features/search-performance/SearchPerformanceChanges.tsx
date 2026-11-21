import { useLocale } from "@/client/lib/i18n";
import { useState, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  FileText,
  Search,
  TrendingDown,
  TrendingUp,
  TrendingUpDown,
} from "lucide-react";
import { cn } from "cn";
import { CardShell } from "@/client/components/CardShell";
import { QueryState } from "@/client/components/QueryState";
import { SegmentedToggle } from "@/client/components/SegmentedToggle";
import { SkeletonTableRows } from "@/client/components/SkeletonPresets";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/client/components/ui/table";
import {
  cardMetaClass,
  cardTableClass,
} from "@/client/features/dashboard/cardParts";
import {
  changeClass,
  formatClickChange,
  formatCount,
  formatPosition,
} from "@/client/features/search-performance/SearchPerformanceColumns";
import {
  changesQueryOptions,
  type DetailSelection,
  type FilterInput,
} from "@/client/features/search-performance/searchPerformanceQueries";
import type { getSearchPerformanceChanges } from "@/serverFunctions/searchPerformance";
import type { SearchPerformanceTableDimension } from "@/types/schemas/search-performance";

type ChangeRow = Extract<
  Awaited<ReturnType<typeof getSearchPerformanceChanges>>,
  { connected: true }
>["gained"][number];

/** A page URL without its scheme, which only pushes the path out of view. */
export function displayKey(key: string): string {
  return key.replace(/^https?:\/\//, "");
}

function ChangeTable({
  title,
  icon,
  rows,
  keyLabel,
  emptyText,
  showPosition,
  onSelect,
}: {
  title: string;
  icon: ReactNode;
  rows: ChangeRow[];
  keyLabel: string;
  emptyText: string;
  showPosition: boolean;
  onSelect: (key: string) => void;
}) {
  const { t } = useLocale();
  return (
    <div>
      <h3 className="mb-1 flex items-center gap-1.5 text-sm font-medium">
        {icon}
        {title}
      </h3>
      {rows.length === 0 ? (
        <p className="py-2 text-sm text-muted-foreground">{emptyText}</p>
      ) : (
        <Table className={cardTableClass}>
          <TableHeader>
            <TableRow>
              <TableHead>{keyLabel}</TableHead>
              {showPosition ? (
                <TableHead className="hidden text-right sm:table-cell">
                  {t("search_performance.position")}
                </TableHead>
              ) : null}
              <TableHead className="text-right">
                {t("search_performance.clicks")}
              </TableHead>
              <TableHead className="text-right">
                {t("search_performance.change")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => {
              const change = row.clicks - row.prevClicks;
              return (
                <TableRow key={row.key}>
                  <TableCell className="w-full max-w-0">
                    <button
                      type="button"
                      onClick={() => onSelect(row.key)}
                      className="block max-w-full truncate rounded-sm text-left font-medium underline-offset-4 outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
                      title={row.key}
                    >
                      {displayKey(row.key)}
                    </button>
                  </TableCell>
                  {showPosition ? (
                    <TableCell className="hidden text-right whitespace-nowrap text-muted-foreground tabular-nums sm:table-cell">
                      {row.prevPosition === null
                        ? "—"
                        : formatPosition(row.prevPosition)}
                      <span aria-hidden className="px-1">
                        →
                      </span>
                      <span className="sr-only">
                        {t("search_performance.position_to")}
                      </span>
                      <span className="text-foreground">
                        {row.position === null
                          ? "—"
                          : formatPosition(row.position)}
                      </span>
                    </TableCell>
                  ) : null}
                  <TableCell className="text-right tabular-nums">
                    {formatCount(row.clicks)}
                  </TableCell>
                  <TableCell
                    className={cn(
                      "text-right tabular-nums",
                      changeClass(change > 0),
                    )}
                  >
                    {formatClickChange(change)}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

/**
 * The queries or pages that gained and lost the most clicks against the
 * previous period. Discover and Google News have no queries or positions, so
 * there it lists pages only.
 */
export function BiggestChangesCard({
  projectId,
  filterInput,
  isWeb,
  comparedWith,
  onSelect,
}: {
  projectId: string;
  filterInput: FilterInput;
  isWeb: boolean;
  /** The previous period's dates, for the hover title. */
  comparedWith: string;
  onSelect: (selection: DetailSelection) => void;
}) {
  const { t } = useLocale();
  const [picked, setPicked] =
    useState<SearchPerformanceTableDimension>("query");
  const dimension = isWeb ? picked : "page";
  const changesQuery = useQuery(
    changesQueryOptions(projectId, dimension, filterInput),
  );
  const keyLabel =
    dimension === "query"
      ? t("search_performance.query")
      : t("search_performance.page");

  return (
    <CardShell
      title={t("search_performance.biggest_changes")}
      icon={<TrendingUpDown className="size-5" />}
      titleInfo={
        <span className={cardMetaClass} title={comparedWith}>
          {t("search_performance.vs_previous_period")}
        </span>
      }
      action={
        isWeb ? (
          <SegmentedToggle
            showLabels
            value={picked}
            onChange={setPicked}
            items={[
              {
                value: "query",
                label: t("search_performance.queries"),
                icon: <Search className="size-3.5" />,
              },
              {
                value: "page",
                label: t("search_performance.pages"),
                icon: <FileText className="size-3.5" />,
              },
            ]}
          />
        ) : null
      }
    >
      <QueryState
        query={changesQuery}
        errorFallback={t("search_performance.failed_to_load_changes")}
        loading={
          <div className="grid gap-x-12 gap-y-6 lg:grid-cols-2">
            <SkeletonTableRows rows={5} columns={3} />
            <SkeletonTableRows rows={5} columns={3} />
          </div>
        }
      >
        {(changes) =>
          // A dead grant: the page shows the connect card on its next load.
          !changes.connected ? null : (
            <div className="grid gap-x-12 gap-y-6 lg:grid-cols-2">
              <ChangeTable
                title={t("search_performance.gained_clicks")}
                icon={
                  <TrendingUp className="size-4 text-green-700 dark:text-success" />
                }
                rows={changes.gained}
                keyLabel={keyLabel}
                emptyText={t(
                  dimension === "query"
                    ? "search_performance.no_queries_gained"
                    : "search_performance.no_pages_gained",
                )}
                showPosition={isWeb}
                onSelect={(key) => onSelect({ dimension, key })}
              />
              <ChangeTable
                title={t("search_performance.lost_clicks")}
                icon={
                  <TrendingDown className="size-4 text-red-700 dark:text-destructive" />
                }
                rows={changes.lost}
                keyLabel={keyLabel}
                emptyText={t(
                  dimension === "query"
                    ? "search_performance.no_queries_lost"
                    : "search_performance.no_pages_lost",
                )}
                showPosition={isWeb}
                onSelect={(key) => onSelect({ dimension, key })}
              />
            </div>
          )
        }
      </QueryState>
    </CardShell>
  );
}
