import { useMemo, useState } from "react";
import type { ColumnDef, SortingState } from "@tanstack/react-table";
import { sort } from "remeda";
import { Button } from "@/client/components/ui/button";
import { Badge } from "@/client/components/ui/badge";
import { DataTable, useDataTable } from "@/client/components/table/DataTable";
import { SortableHeader } from "@/client/components/table/SortableHeader";
import { RANK_TRACKING_HEADER_CLASS } from "@/client/features/rank-tracking/RankTrackingColumns";
import { isLocalScanActive, LocalScanStatus } from "@/shared/local-seo";
import type { getLocalTracker } from "@/serverFunctions/local-seo";
import { useLocale } from "@/client/lib/i18n";

type TrackerData = Awaited<ReturnType<typeof getLocalTracker>>;
type KeywordRow = TrackerData["keywords"][number] & {
  latest: TrackerData["scans"][number] | undefined;
};

const NO_SORTING: SortingState = [];

/** A keyword's newest scan with results, or its newest scan. */
export function latestKeywordScan(
  scans: TrackerData["scans"],
  keywordId: string,
) {
  const keywordScans = scans.filter((scan) => scan.keywordId === keywordId);
  return (
    keywordScans.find((scan) => (scan.summary?.completed ?? 0) > 0) ??
    keywordScans[0]
  );
}

export function LocalKeywordsTable({
  data,
  history,
  selectedKeywordId,
  selectedScanId,
  onSelect,
  onManage,
}: {
  data: TrackerData;
  history: boolean;
  selectedKeywordId?: string;
  selectedScanId?: string;
  onSelect: (keywordId: string, scanId?: string) => void;
  onManage: () => void;
}) {
  const { locale, t } = useLocale();
  const { keywords, scans, checks } = data;
  const [sorting, setSorting] = useState<SortingState>([
    { id: "keyword", desc: false },
  ]);
  const rows = useMemo(
    () =>
      keywords.map((keyword) => ({
        ...keyword,
        latest: latestKeywordScan(scans, keyword.id),
      })),
    [keywords, scans],
  );
  const columns = useMemo<ColumnDef<KeywordRow>[]>(() => {
    const keywordColumn: ColumnDef<KeywordRow> = {
      id: "keyword",
      accessorKey: "keyword",
      header: ({ column }) =>
        history ? (
          t("local_seo.keywords_table.keyword")
        ) : (
          <SortableHeader
            column={column}
            label={t("local_seo.keywords_table.keyword")}
            className={RANK_TRACKING_HEADER_CLASS}
          />
        ),
      meta: { headerClassName: "w-1/3 min-w-48", cellClassName: "font-medium" },
      cell: ({ row }) => (
        <button
          type="button"
          className="text-left font-medium decoration-dotted underline-offset-2 hover:underline"
          aria-pressed={row.id === selectedKeywordId}
          title={t("local_seo.keywords_table.view_map")}
          onClick={(event) => {
            event.stopPropagation();
            onSelect(row.id);
          }}
        >
          {row.original.keyword}
        </button>
      ),
    };
    if (history)
      return [
        keywordColumn,
        ...sort(
          checks.filter((check) => !isLocalScanActive(check.status)),
          (a, b) => a.createdAt.localeCompare(b.createdAt),
        ).map(
          (check): ColumnDef<KeywordRow> => ({
            id: check.id,
            header: () => (
              <span
                title={new Date(check.createdAt).toLocaleString(
                  locale === "de" ? "de-DE" : "en-US",
                )}
              >
                {new Date(check.createdAt).toLocaleString(
                  locale === "de" ? "de-DE" : "en-US",
                  {
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  },
                )}
              </span>
            ),
            meta: {
              headerClassName: "min-w-36 text-right",
              cellClassName: "text-right",
            },
            cell: ({ row }) => {
              const scan = scans.find(
                (candidate) =>
                  candidate.checkId === check.id &&
                  candidate.keywordId === row.id,
              );
              if (!scan)
                return <span className="text-muted-foreground">—</span>;
              return (
                <button
                  type="button"
                  className="font-mono text-xs decoration-dotted underline-offset-2 hover:underline aria-pressed:text-primary"
                  aria-pressed={scan.id === selectedScanId}
                  title={t("local_seo.keywords_table.view_map_for", {
                    keyword: row.original.keyword,
                    date: new Date(check.createdAt).toLocaleString(
                      locale === "de" ? "de-DE" : "en-US",
                    ),
                  })}
                  onClick={(event) => {
                    event.stopPropagation();
                    onSelect(row.id, scan.id);
                  }}
                >
                  {scan.status === LocalScanStatus.Failed
                    ? t("local_seo.keywords_table.failed")
                    : (scan.summary?.averageRank ?? "—")}
                </button>
              );
            },
          }),
        ),
      ];
    return [
      keywordColumn,
      {
        id: "averageRank",
        accessorFn: (row) => row.latest?.summary?.averageRank ?? undefined,
        header: ({ column }) => (
          <SortableHeader
            column={column}
            label={t("local_seo.keywords_table.avg_rank")}
            className={RANK_TRACKING_HEADER_CLASS}
          />
        ),
        cell: ({ row }) => row.original.latest?.summary?.averageRank ?? "—",
        meta: { cellClassName: "font-mono text-xs" },
        sortUndefined: "last",
      },
      {
        id: "top3Percent",
        accessorFn: (row) => row.latest?.summary?.top3Percent ?? undefined,
        header: ({ column }) => (
          <SortableHeader
            column={column}
            label={t("local_seo.keywords_table.top3_coverage")}
            className={RANK_TRACKING_HEADER_CLASS}
          />
        ),
        cell: ({ row }) =>
          row.original.latest?.summary?.top3Percent == null
            ? "—"
            : `${row.original.latest.summary.top3Percent}%`,
        meta: { cellClassName: "font-mono text-xs" },
        sortUndefined: "last",
      },
      {
        id: "pointsFound",
        accessorFn: (row) => row.latest?.summary?.found,
        header: ({ column }) => (
          <SortableHeader
            column={column}
            label={t("local_seo.keywords_table.points_found")}
            className={RANK_TRACKING_HEADER_CLASS}
          />
        ),
        cell: ({ row }) =>
          row.original.latest?.summary
            ? `${row.original.latest.summary.found}/${row.original.latest.summary.completed}`
            : "—",
        meta: { cellClassName: "font-mono text-xs" },
        sortUndefined: "last",
      },
      {
        id: "lastChecked",
        accessorFn: (row) => row.latest?.createdAt,
        header: ({ column }) => (
          <SortableHeader
            column={column}
            label={t("local_seo.keywords_table.last_checked")}
            className={RANK_TRACKING_HEADER_CLASS}
          />
        ),
        cell: ({ row }) => <LastChecked scan={row.original.latest} />,
        meta: { cellClassName: "text-xs text-muted-foreground" },
        sortUndefined: "last",
      },
    ];
  }, [
    history,
    checks,
    scans,
    onSelect,
    selectedKeywordId,
    selectedScanId,
    locale,
    t,
  ]);
  const table = useDataTable({
    data: rows,
    columns,
    state: { sorting: history ? NO_SORTING : sorting },
    onSortingChange: setSorting,
    withSorting: true,
    enableSortingRemoval: false,
    getRowId: (row) => row.id,
  });
  return (
    <DataTable
      table={table}
      activeRowId={selectedKeywordId}
      onRowClick={(row) => onSelect(row.id)}
      empty={{
        title: t("local_seo.keywords_table.empty_title"),
        description: t("local_seo.keywords_table.empty_desc"),
        action: (
          <Button size="sm" onClick={onManage}>
            {t("local_seo.keywords_table.add_keywords")}
          </Button>
        ),
      }}
    />
  );
}

function LastChecked({ scan }: { scan: KeywordRow["latest"] }) {
  const { locale, t } = useLocale();
  if (!scan) return t("local_seo.keywords_table.not_checked");
  return (
    <span className="flex flex-wrap items-center gap-2">
      {new Date(scan.createdAt).toLocaleString(
        locale === "de" ? "de-DE" : "en-US",
      )}
      {scan.status !== LocalScanStatus.Completed && (
        <Badge
          variant={
            scan.status === LocalScanStatus.Failed ? "destructive" : "secondary"
          }
        >
          {scan.status === LocalScanStatus.Running
            ? t("local_seo.keywords_table.checking")
            : scan.status === LocalScanStatus.Failed
              ? t("local_seo.keywords_table.failed")
              : scan.status}
        </Badge>
      )}
    </span>
  );
}
