import { getCurrentLocale } from "@/client/lib/i18n";
import { createColumnHelper, type ColumnDef } from "@tanstack/react-table";
import type { MutableRefObject } from "react";
import { makeSelectionColumn } from "@/client/components/table/DataTable";
import { SortableHeader } from "@/client/components/table/SortableHeader";
import { safeHttpUrl } from "@/shared/safe-url";
import type { SelectionAnchor } from "@/client/components/table/tableSelection";
import type {
  getSearchPerformanceReport,
  getSearchPerformanceTable,
} from "@/serverFunctions/searchPerformance";

export type Report = Extract<
  Awaited<ReturnType<typeof getSearchPerformanceReport>>,
  { connected: true }
>;
export type SearchPerformanceTableRow = Extract<
  Awaited<ReturnType<typeof getSearchPerformanceTable>>,
  { connected: true }
>["rows"][number];
type DimensionRow = SearchPerformanceTableRow;
type StrikingRow = Report["strikingDistance"][number];

export function formatCount(value: number): string {
  return new Intl.NumberFormat(getCurrentLocale()).format(Math.round(value));
}

export function formatCtr(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
}

export function formatPosition(value: number): string {
  return value.toFixed(1);
}

const rightAligned = {
  headerClassName: "text-right",
  cellClassName: "text-right tabular-nums",
} as const;

const dimensionHelper = createColumnHelper<DimensionRow>();

type SearchPerformanceColumnLabels = {
  clicks?: string;
  impressions?: string;
  ctr?: string;
  position?: string;
  query?: string;
  page?: string;
};

export function buildDimensionColumns(
  keyLabel: string,
  showPosition: boolean,
  labels?: SearchPerformanceColumnLabels,
): ColumnDef<DimensionRow>[] {
  const clicksLabel = labels?.clicks ?? "Clicks";
  const impressionsLabel = labels?.impressions ?? "Impressions";
  const ctrLabel = labels?.ctr ?? "CTR";
  const positionLabel = labels?.position ?? "Position";

  const columns: ColumnDef<DimensionRow>[] = [
    dimensionHelper.accessor("key", {
      enableSorting: false,
      header: () => keyLabel,
      cell: ({ getValue }) => (
        <span className="block max-w-xl truncate" title={getValue()}>
          {getValue()}
        </span>
      ),
    }),
    dimensionHelper.accessor("clicks", {
      header: ({ column }) => (
        <SortableHeader column={column} label={clicksLabel} align="right" />
      ),
      cell: ({ getValue }) => formatCount(getValue()),
      meta: rightAligned,
    }),
    dimensionHelper.accessor("impressions", {
      header: ({ column }) => (
        <SortableHeader
          column={column}
          label={impressionsLabel}
          align="right"
        />
      ),
      cell: ({ getValue }) => formatCount(getValue()),
      meta: rightAligned,
    }),
    dimensionHelper.accessor("ctr", {
      header: ({ column }) => (
        <SortableHeader column={column} label={ctrLabel} align="right" />
      ),
      cell: ({ getValue }) => formatCtr(getValue()),
      meta: rightAligned,
    }),
  ];
  if (!showPosition) return columns;
  return [
    ...columns,
    dimensionHelper.accessor("position", {
      header: ({ column }) => (
        <SortableHeader column={column} label={positionLabel} align="right" />
      ),
      cell: ({ getValue }) => formatPosition(getValue()),
      meta: rightAligned,
    }),
  ];
}

const strikingHelper = createColumnHelper<StrikingRow>();

export function buildStrikingColumns(
  anchorRef: MutableRefObject<SelectionAnchor | null>,
  labels?: SearchPerformanceColumnLabels,
): ColumnDef<StrikingRow>[] {
  const queryLabel = labels?.query ?? "Query";
  const pageLabel = labels?.page ?? "Page";
  const clicksLabel = labels?.clicks ?? "Clicks";
  const impressionsLabel = labels?.impressions ?? "Impressions";
  const positionLabel = labels?.position ?? "Position";

  return [
    makeSelectionColumn<StrikingRow>(anchorRef),
    strikingHelper.accessor("query", {
      enableSorting: false,
      header: () => queryLabel,
      cell: ({ getValue }) => (
        <span className="block max-w-xs truncate" title={getValue()}>
          {getValue()}
        </span>
      ),
    }),
    strikingHelper.accessor("page", {
      enableSorting: false,
      header: () => pageLabel,
      // GSC page keys are canonical http(s) URLs of the verified property;
      // the scheme check is defense-in-depth before rendering an href.
      cell: ({ getValue }) => (
        <a
          href={safeHttpUrl(getValue()) ?? undefined}
          target="_blank"
          rel="noreferrer"
          className="block max-w-sm truncate text-primary underline-offset-4 hover:underline"
          title={getValue()}
        >
          {getValue()}
        </a>
      ),
    }),
    strikingHelper.accessor("impressions", {
      header: ({ column }) => (
        <SortableHeader
          column={column}
          label={impressionsLabel}
          align="right"
        />
      ),
      cell: ({ getValue }) => formatCount(getValue()),
      meta: rightAligned,
    }),
    strikingHelper.accessor("clicks", {
      header: ({ column }) => (
        <SortableHeader column={column} label={clicksLabel} align="right" />
      ),
      cell: ({ getValue }) => formatCount(getValue()),
      meta: rightAligned,
    }),
    strikingHelper.accessor("position", {
      header: ({ column }) => (
        <SortableHeader column={column} label={positionLabel} align="right" />
      ),
      cell: ({ getValue }) => formatPosition(getValue()),
      meta: rightAligned,
    }),
  ];
}
