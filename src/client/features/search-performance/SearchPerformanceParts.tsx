import { useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Copy, Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import {
  DataTable,
  useDataTable,
  useSelectionAnchor,
} from "@/client/components/table/DataTable";
import {
  TableBulkActionBar,
  TableBulkActionButton,
} from "@/client/components/table/TableBulkActionBar";
import { TablePagination } from "@/client/components/table/TablePagination";
import { Button } from "@/client/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/client/components/ui/table";
import {
  buildDimensionColumns,
  buildStrikingColumns,
  formatCount,
  formatCtr,
  formatPosition,
  type Report,
  type SearchPerformanceTableRow,
} from "@/client/features/search-performance/SearchPerformanceColumns";
import { normalizeExportValue } from "@/client/lib/csv";
import { captureClientEvent } from "@/client/lib/posthog";
import { SEARCH_PERFORMANCE_PAGE_SIZES } from "@/types/schemas/search-performance";
import { saveKeywords } from "@/serverFunctions/keywords";
import { useLocale } from "@/client/lib/i18n";

export * from "./searchPerformanceExport";

type Delta = { text: string; improved: boolean } | null;

function percentDelta(current: number, previous: number): Delta {
  if (previous <= 0) return null;
  const change = (current - previous) / previous;
  const pct = (change * 100).toFixed(1);
  return { text: `${change >= 0 ? "+" : ""}${pct}%`, improved: change >= 0 };
}

/** Position falls as rankings improve, so the delta is inverted. */
function positionDelta(current: number, previous: number): Delta {
  if (previous <= 0 || current <= 0) return null;
  const change = previous - current;
  return {
    text: `${change >= 0 ? "+" : ""}${change.toFixed(1)}`,
    improved: change >= 0,
  };
}

export function TotalsTable({ report }: { report: Report }) {
  const { t } = useLocale();
  const { totals, prevTotals, range } = report;
  const deltaTitle = t("search_performance.totals.compared_with", {
    start: range.prevStartDate,
    end: range.prevEndDate,
  });
  const metrics = [
    {
      label: t("search_performance.totals.clicks"),
      value: formatCount(totals.clicks),
      delta: percentDelta(totals.clicks, prevTotals.clicks),
    },
    {
      label: t("search_performance.totals.impressions"),
      value: formatCount(totals.impressions),
      delta: percentDelta(totals.impressions, prevTotals.impressions),
    },
    {
      label: t("search_performance.totals.ctr"),
      value: formatCtr(totals.ctr),
      delta: percentDelta(totals.ctr, prevTotals.ctr),
    },
    {
      label: t("search_performance.totals.position"),
      value: formatPosition(totals.position),
      delta: positionDelta(totals.position, prevTotals.position),
    },
  ];
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-full">
              {t("search_performance.totals.metric")}
            </TableHead>
            <TableHead className="min-w-32 text-right">
              {t("search_performance.totals.value")}
            </TableHead>
            <TableHead className="min-w-32 text-right" title={deltaTitle}>
              {t("search_performance.totals.change")}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {metrics.map(({ label, value, delta }) => (
            <TableRow key={label}>
              <TableCell>{label}</TableCell>
              <TableCell className="text-right tabular-nums">{value}</TableCell>
              <TableCell
                className={`text-right tabular-nums ${delta ? (delta.improved ? "text-success" : "text-destructive") : "text-muted-foreground"}`}
                title={deltaTitle}
              >
                {delta?.text ?? "—"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export function DimensionTable({
  rows,
  keyLabel,
  isFiltered,
  isPastEnd,
  onClearFilters,
  onFirstPage,
}: {
  rows: SearchPerformanceTableRow[];
  keyLabel: string;
  isFiltered: boolean;
  isPastEnd: boolean;
  onClearFilters: () => void;
  onFirstPage: () => void;
}) {
  const { t } = useLocale();
  const columnLabels = useMemo(
    () => ({
      clicks: t("search_performance.columns.clicks"),
      impressions: t("search_performance.columns.impressions"),
      ctr: t("search_performance.columns.ctr"),
      position: t("search_performance.columns.position"),
      query: t("search_performance.columns.query"),
      page: t("search_performance.columns.page"),
    }),
    [t],
  );
  const columns = useMemo(
    () => buildDimensionColumns(keyLabel, columnLabels),
    [keyLabel, columnLabels],
  );
  const table = useDataTable({
    data: rows,
    columns,
    withSorting: true,
    initialState: { sorting: [{ id: "clicks", desc: true }] },
  });
  return (
    <DataTable
      table={table}
      isFiltered={isFiltered && !isPastEnd}
      onClearFilters={onClearFilters}
      empty={
        isPastEnd
          ? {
              title: t("search_performance.dimension.past_end_title"),
              description: t(
                "search_performance.dimension.past_end_description",
              ),
              action: (
                <Button variant="outline" size="sm" onClick={onFirstPage}>
                  {t("search_performance.dimension.go_first_page")}
                </Button>
              ),
            }
          : {
              title: t("search_performance.dimension.empty_title"),
              description: t("search_performance.dimension.empty_description"),
            }
      }
    />
  );
}

export function StrikingDistanceTable({
  projectId,
  rows,
  page,
  pageSize,
  onPageChange,
  onPageSizeChange,
  isFiltered,
  onClearFilters,
}: {
  projectId: string;
  rows: Report["strikingDistance"];
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  isFiltered: boolean;
  onClearFilters: () => void;
}) {
  const { t } = useLocale();
  const queryClient = useQueryClient();
  const anchorRef = useSelectionAnchor();
  const [rowSelection, setRowSelection] = useState({});
  const columnLabels = useMemo(
    () => ({
      clicks: t("search_performance.columns.clicks"),
      impressions: t("search_performance.columns.impressions"),
      ctr: t("search_performance.columns.ctr"),
      position: t("search_performance.columns.position"),
      query: t("search_performance.columns.query"),
      page: t("search_performance.columns.page"),
    }),
    [t],
  );
  const columns = useMemo(
    () => buildStrikingColumns(anchorRef, columnLabels),
    [anchorRef, columnLabels],
  );
  const table = useDataTable({
    data: rows,
    columns,
    withSorting: true,
    withPagination: true,
    enableRowSelection: true,
    state: { rowSelection, pagination: { pageIndex: page - 1, pageSize } },
    onRowSelectionChange: setRowSelection,
    // The server collapses each query to its top page, so queries are unique.
    getRowId: (row) => row.query,
    initialState: {
      sorting: [{ id: "impressions", desc: true }],
    },
  });
  const isPastEnd = page > 1 && table.getRowModel().rows.length === 0;

  const selectedQueries = table
    .getSelectedRowModel()
    .rows.map((row) => row.original.query);

  const copyKeywords = async () => {
    try {
      // Sanitize against spreadsheet formula injection: GSC query strings are
      // untrusted and may begin with =, +, -, @, etc. See @/client/lib/csv.
      const text = selectedQueries
        .map((query) => normalizeExportValue(query))
        .join("\n");
      await navigator.clipboard.writeText(text);
      const count = selectedQueries.length;
      toast.success(
        count === 1
          ? t("search_performance.striking.copied_singular")
          : t("search_performance.striking.copied_plural", { count }),
      );
    } catch {
      toast.error(t("search_performance.striking.copy_failed"));
    }
  };

  const save = useMutation({
    mutationFn: (keywords: string[]) =>
      saveKeywords({ data: { projectId, keywords } }),
    onSuccess: (_result, keywords) => {
      captureClientEvent("keyword:save", {
        source_feature: "search_performance",
        keyword_count: keywords.length,
      });
      void queryClient.invalidateQueries({
        queryKey: ["savedKeywords", projectId],
      });
      const count = keywords.length;
      toast.success(
        count === 1
          ? t("search_performance.striking.saved_singular")
          : t("search_performance.striking.saved_plural", { count }),
      );
      setRowSelection({});
    },
  });

  return (
    <>
      <div className="p-4">
        <p className="mb-3 text-sm text-muted-foreground">
          {t("search_performance.striking.description")}
        </p>
        <DataTable
          table={table}
          isFiltered={isFiltered && !isPastEnd}
          onClearFilters={onClearFilters}
          empty={
            isPastEnd
              ? {
                  title: t("search_performance.dimension.past_end_title"),
                  description: t(
                    "search_performance.dimension.past_end_description",
                  ),
                  action: (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onPageChange(1)}
                    >
                      {t("search_performance.dimension.go_first_page")}
                    </Button>
                  ),
                }
              : {
                  title: t("search_performance.striking.empty_title"),
                  description: t(
                    "search_performance.striking.empty_description",
                  ),
                }
          }
        />
      </div>
      {!isPastEnd && rows.length > 0 && (
        <TablePagination
          page={page}
          pageSize={pageSize}
          pageSizes={SEARCH_PERFORMANCE_PAGE_SIZES}
          totalCount={rows.length}
          hasNextPage={table.getCanNextPage()}
          isLoading={false}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
        />
      )}
      <TableBulkActionBar
        selectedCount={selectedQueries.length}
        selectedLabel={
          selectedQueries.length === 1
            ? t("search_performance.striking.query_label_singular")
            : t("search_performance.striking.query_label_plural")
        }
        onClear={() => setRowSelection({})}
        actions={
          <div className="flex items-center gap-1 px-1.5">
            <TableBulkActionButton
              icon={<Copy className="size-3.5" />}
              onClick={() => void copyKeywords()}
            >
              {t("search_performance.striking.copy_keywords")}
            </TableBulkActionButton>
            <TableBulkActionButton
              icon={
                save.isPending ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : (
                  <Save className="size-3.5" />
                )
              }
              onClick={() => save.mutate(selectedQueries)}
              disabled={save.isPending}
            >
              {t("search_performance.striking.save_as_keywords")}
            </TableBulkActionButton>
          </div>
        }
      />
    </>
  );
}
