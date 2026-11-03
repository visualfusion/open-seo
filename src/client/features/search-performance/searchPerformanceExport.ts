import type { CsvValue } from "@/client/lib/csv";
import { exportRows } from "@/client/lib/exportRows";
import type {
  Report,
  SearchPerformanceTableRow,
} from "@/client/features/search-performance/SearchPerformanceColumns";
import type { SearchPerformanceTableDimension } from "@/types/schemas/search-performance";

export type ExportTarget = "csv" | "sheets";

type ExportTable = { filename: string; headers: string[]; rows: CsvValue[][] };

function strikingExportTable(report: Report): ExportTable {
  const stamp = `${report.range.startDate}-to-${report.range.endDate}`;
  return {
    filename: `search-performance-striking-distance-${stamp}`,
    headers: ["Query", "Page", "Impressions", "Clicks", "Position"],
    rows: report.strikingDistance.map((row) => [
      row.query,
      row.page,
      row.impressions,
      row.clicks,
      row.position,
    ]),
  };
}

function dimensionExportTable(
  dimension: SearchPerformanceTableDimension,
  rows: SearchPerformanceTableRow[],
  stamp: string,
): ExportTable {
  const isPage = dimension === "page";
  return {
    filename: `search-performance-${isPage ? "pages" : "queries"}-${stamp}`,
    headers: [
      isPage ? "Page" : "Query",
      "Clicks",
      "Impressions",
      "CTR",
      "Position",
    ],
    rows: rows.map((row) => [
      row.key,
      row.clicks,
      row.impressions,
      row.ctr,
      row.position,
    ]),
  };
}

function runExport(table: ExportTable, target: ExportTarget): Promise<void> {
  return exportRows({
    format: target,
    feature: "search_performance",
    ...table,
  });
}

export function exportStriking(
  report: Report,
  target: ExportTarget,
): Promise<void> {
  return runExport(strikingExportTable(report), target);
}

/** Export the full queries/pages dataset (fetched separately, not the visible
 *  page) so pagination never truncates a download. */
export function exportDimensionRows(
  dimension: SearchPerformanceTableDimension,
  rows: SearchPerformanceTableRow[],
  range: Report["range"],
  target: ExportTarget,
): Promise<void> {
  const stamp = `${range.startDate}-to-${range.endDate}`;
  return runExport(dimensionExportTable(dimension, rows, stamp), target);
}
