import { useLocale } from "@/client/lib/i18n";
import { useQuery } from "@tanstack/react-query";
import { QueryError } from "@/client/components/QueryState";
import { DataTableTabs } from "@/client/components/table/DataTableToolbar";
import type { ColumnDef } from "@tanstack/react-table";
import { SortableHeader } from "@/client/components/table/SortableHeader";
import { DashboardDataTable } from "./DashboardDataTable";
import { useState, type ComponentProps } from "react";
import { TabsTrigger } from "@/client/components/ui/tabs";
import { getDashboardBacklinks } from "@/serverFunctions/dashboard";
import { Freshness, ExternalPage } from "./siteTabParts";
const KINDS = ["new", "lost", "all"] as const;
type Kind = (typeof KINDS)[number];

const DESCRIPTIONS: Record<Kind, string> = {
  new: "Links to your website found in the past week. A link may be older than the date it was found.",
  lost: "Links that were found before but are no longer there. Last checked is when we last checked the link, not when it disappeared.",
  all: "Recently found links that still point to your website.",
};

export function DashboardBacklinks({
  projectId,
  domain,
}: {
  projectId: string;
  domain: string;
}) {
  const { t } = useLocale();
  const [kind, setKind] = useState<Kind>("new");
  const query = useQuery({
    queryKey: ["dashboardBacklinks", projectId, domain, kind],
    queryFn: () => getDashboardBacklinks({ data: { projectId, kind } }),
    staleTime: 86400_000,
    retry: false,
  });
  return (
    <DashboardBacklinkTable
      rows={query.data?.value ?? []}
      kind={kind}
      isLoading={query.isPending}
      error={
        query.isError ? (
          <QueryError
            error={query.error}
            fallback={t("backlinks.load_error_title")}
            onRetry={() => void query.refetch()}
            isRetrying={query.isFetching}
          />
        ) : null
      }
      tabs={
        <DataTableTabs
          value={kind}
          onValueChange={(value) => {
            const next = KINDS.find((item) => item === value);
            if (next) setKind(next);
          }}
          description={
            <>
              {DESCRIPTIONS[kind]}
              {query.data ? <Freshness {...query.data} /> : null}
            </>
          }
        >
          <TabsTrigger value="new">
            {t("dashboard.details.new_this_week")}
          </TabsTrigger>
          <TabsTrigger value="lost">
            {t("dashboard.details.lost_links")}
          </TabsTrigger>
          <TabsTrigger value="all">
            {t("dashboard.details.active_links")}
          </TabsTrigger>
        </DataTableTabs>
      }
    />
  );
}

type Backlink = Awaited<
  ReturnType<typeof getDashboardBacklinks>
>["value"][number];
function DashboardBacklinkTable({
  rows,
  kind,
  ...tableProps
}: {
  rows: Backlink[];
  kind: Kind;
} & Pick<
  ComponentProps<typeof DashboardDataTable>,
  "tabs" | "isLoading" | "error"
>) {
  const { t } = useLocale();
  const columns: ColumnDef<Backlink>[] = [
    {
      id: "urlFrom",
      accessorFn: (row) => `${row.domainFrom ?? ""} ${row.urlFrom ?? ""}`,
      header: ({ column }) => (
        <SortableHeader
          column={column}
          label={t("dashboard.cards.referring_page")}
        />
      ),
      cell: ({ row }) => (
        <ExternalPage
          url={row.original.urlFrom}
          label={row.original.domainFrom}
        />
      ),
      filterFn: "includesString",
    },
    {
      accessorKey: "anchor",
      header: t("dashboard.cards.anchor"),
      cell: ({ row }) => (
        <span
          className="block max-w-48 truncate"
          title={row.original.anchor ?? undefined}
        >
          {row.original.anchor || "—"}
        </span>
      ),
      filterFn: "includesString",
    },
    {
      accessorKey: "urlTo",
      header: t("integrations.dashboard_ext.backlinks_tab.target"),
      cell: ({ row }) => <ExternalPage url={row.original.urlTo} />,
      filterFn: "includesString",
    },
    {
      id: "follow",
      accessorFn: (row) => (row.isDofollow ? "Follow" : "Nofollow"),
      header: t("dashboard.details.link_type"),
      filterFn: "equalsString",
    },
    {
      accessorKey: "domainFromRank",
      header: ({ column }) => (
        <SortableHeader
          column={column}
          label={t("dashboard.details.domain_rank")}
        />
      ),
      filterFn: "inNumberRange",
      cell: ({ getValue }) => getValue() ?? "—",
    },
    {
      accessorKey: "spamScore",
      header: ({ column }) => (
        <SortableHeader
          column={column}
          label={t("dashboard.details.spam_score")}
        />
      ),
      filterFn: "inNumberRange",
      cell: ({ getValue }) => getValue() ?? "—",
    },
    {
      id: "date",
      accessorFn: (row) =>
        (kind === "lost" ? row.lastSeen : row.firstSeen)?.slice(0, 10) ?? "—",
      header: ({ column }) => (
        <SortableHeader
          column={column}
          label={
            kind === "lost"
              ? t("ranks.last_checked")
              : t("dashboard.details.first_discovered")
          }
        />
      ),
    },
  ];
  return (
    <DashboardDataTable
      {...tableProps}
      resetKey={kind}
      rows={rows}
      empty={{
        title:
          kind === "new"
            ? t("dashboard.details.no_new_backlinks_this_week")
            : kind === "lost"
              ? t("dashboard.details.no_lost_backlinks_found")
              : t("dashboard.details.no_active_backlinks_found_yet"),
      }}
      columns={columns}
      filters={[
        {
          id: "urlFrom",
          label: t("dashboard.cards.referring_page"),
          kind: "text",
        },
        { id: "anchor", label: "Anchor text", kind: "text" },
        {
          id: "urlTo",
          label: t("integrations.dashboard_ext.backlinks_tab.target"),
          kind: "text",
        },
        {
          id: "follow",
          label: t("dashboard.details.link_type"),
          kind: "follow",
        },
        {
          id: "domainFromRank",
          label: t("dashboard.details.domain_rank"),
          kind: "number",
        },
        {
          id: "spamScore",
          label: t("dashboard.details.spam_score"),
          kind: "number",
        },
      ]}
    />
  );
}
