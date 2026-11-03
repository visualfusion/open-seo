import { useLocale, getTranslation } from "@/client/lib/i18n";
import { ExternalPage } from "./siteTabParts";
import type { ColumnDef } from "@tanstack/react-table";
import { SortableHeader } from "@/client/components/table/SortableHeader";
import type { ComponentProps } from "react";
import { DashboardDataTable } from "./DashboardDataTable";

type Keyword = {
  query: string;
  page?: string;
  clicks: number;
  impressions: number;
  position: number;
};
const columns: ColumnDef<Keyword>[] = [
  {
    accessorKey: "query",
    header: ({ column }) => (
      <SortableHeader
        column={column}
        label={getTranslation("dashboard.cards.keyword")}
      />
    ),
    filterFn: "includesString",
  },
  ...(["impressions", "clicks", "position"] as const).map(
    (id) =>
      ({
        accessorKey: id,
        header: ({ column }) => (
          <SortableHeader
            column={column}
            label={
              id === "position"
                ? getTranslation("ai_visibility.col_avg_position")
                : id === "clicks"
                  ? getTranslation("dashboard.cards.clicks")
                  : getTranslation("dashboard.cards.impressions")
            }
            align="right"
          />
        ),
        cell: ({ getValue }) =>
          id === "position"
            ? Number(getValue()).toFixed(1)
            : Number(getValue()).toLocaleString(),
        filterFn: "inNumberRange",
        meta: {
          headerClassName: "text-right",
          cellClassName: "text-right tabular-nums",
        },
      }) satisfies ColumnDef<Keyword>,
  ),
];
export function DashboardKeywordTable({
  rows,
  showPages = false,
  sortBy = "impressions",
  ...tableProps
}: {
  rows: Keyword[];
  showPages?: boolean;
  sortBy?: "impressions" | "clicks";
} & Pick<
  ComponentProps<typeof DashboardDataTable>,
  "tabs" | "resetKey" | "isLoading" | "error" | "empty"
>) {
  const { t } = useLocale();
  const pageColumn: ColumnDef<Keyword> = {
    accessorKey: "page",
    header: t("domain.pages_table.page"),
    filterFn: "includesString",
    cell: ({ row }) => <ExternalPage url={row.original.page ?? null} />,
  };
  return (
    <DashboardDataTable
      {...tableProps}
      rows={rows}
      columns={
        showPages ? [columns[0], pageColumn, ...columns.slice(1)] : columns
      }
      initialSorting={[{ id: sortBy, desc: true }]}
      filters={[
        {
          id: "query",
          label: t("dashboard.cards.keyword"),
          kind: "text",
        },
        ...(showPages
          ? [
              {
                id: "page",
                label: t("domain.pages_table.page"),
                kind: "text" as const,
              },
            ]
          : []),
        {
          id: "impressions",
          label: t("dashboard.cards.impressions"),
          kind: "number",
        },
        {
          id: "clicks",
          label: t("dashboard.cards.clicks"),
          kind: "number",
        },
        {
          id: "position",
          label: t("dashboard.cards.avg_position"),
          kind: "number",
        },
      ]}
    />
  );
}
