import { useMemo } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import type { OnChangeFn, SortingState } from "@tanstack/react-table";
import { useLocale } from "@/client/lib/i18n";
import { SafeExternalLink } from "@/client/components/SafeExternalLink";
import {
  DataTable,
  useDataTable,
  type DataTableFrameProps,
} from "@/client/components/table/DataTable";
import { SortableHeader } from "@/client/components/table/SortableHeader";
import { HelpLabel } from "@/client/components/HelpLabel";
import type { TopPageRow } from "./backlinksPageTypes";
import type { TopPagesSortField } from "@/types/schemas/backlinks";
import { formatNumber } from "./backlinksPageUtils";

const columnHelper = createColumnHelper<TopPageRow>();

type TranslateFn = (
  key: string,
  params?: Record<string, string | number>,
) => string;

// Column ids map to server-side sort fields; sorting re-queries DataForSEO
// across all pages, not just the loaded page of results.
function buildTopPagesColumns(t: TranslateFn) {
  return [
    columnHelper.accessor("page", {
      id: "page",
      enableSorting: false,
      meta: { cellClassName: "min-w-80" },
      header: () => (
        <HelpLabel
          label={t("backlinks.pages_table.page")}
          helpText={t("backlinks.pages_table.page_help")}
        />
      ),
      cell: ({ getValue }) => {
        const page = getValue();
        return page ? (
          <SafeExternalLink
            url={page}
            label={page}
            className="inline-flex items-center gap-1 break-all underline-offset-4 hover:underline"
          />
        ) : (
          "-"
        );
      },
    }),
    columnHelper.accessor("backlinks", {
      id: "backlinks" satisfies TopPagesSortField,
      header: ({ column }) => (
        <SortableHeader
          column={column}
          label={t("backlinks.pages_table.backlinks")}
          helpText={t("backlinks.pages_table.backlinks_help")}
        />
      ),
      cell: ({ getValue }) => formatNumber(getValue()),
      sortDescFirst: true,
    }),
    columnHelper.accessor("referringDomains", {
      id: "referringDomains" satisfies TopPagesSortField,
      header: ({ column }) => (
        <SortableHeader
          column={column}
          label={t("backlinks.pages_table.referring_domains")}
          helpText={t("backlinks.pages_table.referring_domains_help")}
        />
      ),
      cell: ({ getValue }) => formatNumber(getValue()),
      sortDescFirst: true,
    }),
    columnHelper.accessor("rank", {
      id: "rank" satisfies TopPagesSortField,
      header: ({ column }) => (
        <SortableHeader
          column={column}
          label={t("backlinks.pages_table.rank")}
          helpText={t("backlinks.pages_table.rank_help")}
        />
      ),
      cell: ({ getValue }) => formatNumber(getValue()),
      sortDescFirst: true,
    }),
    columnHelper.accessor("brokenBacklinks", {
      id: "brokenBacklinks" satisfies TopPagesSortField,
      header: ({ column }) => (
        <SortableHeader
          column={column}
          label={t("backlinks.pages_table.broken_backlinks")}
          helpText={t("backlinks.pages_table.broken_backlinks_help")}
        />
      ),
      cell: ({ getValue }) => formatNumber(getValue()),
      sortDescFirst: true,
    }),
  ];
}

export function TopPagesTable({
  rows,
  sorting,
  onSortingChange,
  ...frame
}: DataTableFrameProps & {
  rows: TopPageRow[];
  sorting: SortingState;
  onSortingChange: OnChangeFn<SortingState>;
}) {
  const { t } = useLocale();
  const columns = useMemo(() => buildTopPagesColumns(t), [t]);

  const table = useDataTable({
    data: rows,
    columns,
    state: { sorting },
    onSortingChange,
    manualSorting: true,
  });

  return (
    <DataTable
      table={table}
      empty={{ title: t("backlinks.pages_table.empty_title") }}
      {...frame}
    />
  );
}
