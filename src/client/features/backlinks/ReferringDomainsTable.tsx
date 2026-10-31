import { createColumnHelper } from "@tanstack/react-table";
import type { OnChangeFn, SortingState } from "@tanstack/react-table";
import { useMemo } from "react";
import { useLocale } from "@/client/lib/i18n";
import { SafeExternalLink } from "@/client/components/SafeExternalLink";
import {
  DataTable,
  useDataTable,
  type DataTableFrameProps,
} from "@/client/components/table/DataTable";
import { SortableHeader } from "@/client/components/table/SortableHeader";
import { HelpLabel } from "@/client/components/HelpLabel";
import type { ReferringDomainRow } from "./backlinksPageTypes";
import type { ReferringDomainsSortField } from "@/types/schemas/backlinks";
import {
  formatCompactDate,
  formatDecimal,
  formatNumber,
} from "./backlinksPageUtils";
import type { DomainRatings } from "./useAhrefsDomainRatings";

const columnHelper = createColumnHelper<ReferringDomainRow>();

type TranslateFn = (
  key: string,
  params?: Record<string, string | number>,
) => string;

function buildReferringDomainColumns(
  domainRatings: DomainRatings | null,
  t: TranslateFn,
) {
  const baseColumns = [
    columnHelper.accessor("domain", {
      id: "domain" satisfies ReferringDomainsSortField,
      meta: { cellClassName: "font-medium break-all" },
      header: ({ column }) => (
        <SortableHeader
          column={column}
          label={t("backlinks.domains_table.domain")}
          helpText={t("backlinks.domains_table.domain_help")}
        />
      ),
      cell: ({ getValue }) => {
        const domain = getValue();
        if (!domain) return "-";
        return (
          <SafeExternalLink
            url={getDomainWebsiteHref(domain)}
            label={domain}
            className="inline-flex items-center gap-1 break-all text-primary underline-offset-4 hover:underline"
          />
        );
      },
    }),
    columnHelper.accessor("backlinks", {
      id: "backlinks" satisfies ReferringDomainsSortField,
      header: ({ column }) => (
        <SortableHeader
          column={column}
          label={t("backlinks.domains_table.backlinks")}
          helpText={t("backlinks.domains_table.backlinks_help")}
        />
      ),
      cell: ({ getValue }) => formatNumber(getValue()),
      sortDescFirst: true,
    }),
    columnHelper.accessor("referringPages", {
      id: "referringPages" satisfies ReferringDomainsSortField,
      header: ({ column }) => (
        <SortableHeader
          column={column}
          label={t("backlinks.domains_table.referring_pages")}
          helpText={t("backlinks.domains_table.referring_pages_help")}
        />
      ),
      cell: ({ getValue }) => formatNumber(getValue()),
      sortDescFirst: true,
    }),
    columnHelper.accessor("rank", {
      id: "rank" satisfies ReferringDomainsSortField,
      header: ({ column }) => (
        <SortableHeader
          column={column}
          label={t("backlinks.domains_table.rank")}
          helpText={t("backlinks.domains_table.rank_help")}
        />
      ),
      cell: ({ getValue }) => formatNumber(getValue()),
      sortDescFirst: true,
    }),
    columnHelper.accessor("spamScore", {
      id: "spamScore" satisfies ReferringDomainsSortField,
      header: ({ column }) => (
        <SortableHeader
          column={column}
          label={t("backlinks.domains_table.spam")}
          helpText={t("backlinks.domains_table.spam_help")}
        />
      ),
      cell: ({ getValue }) => formatDecimal(getValue()),
      sortDescFirst: true,
    }),
    columnHelper.accessor("firstSeen", {
      id: "firstSeen" satisfies ReferringDomainsSortField,
      header: ({ column }) => (
        <SortableHeader
          column={column}
          label={t("backlinks.domains_table.first_seen")}
          helpText={t("backlinks.domains_table.first_seen_help")}
        />
      ),
      cell: ({ getValue }) => formatCompactDate(getValue()),
      sortDescFirst: true,
    }),
    columnHelper.accessor("brokenBacklinks", {
      id: "brokenBacklinks" satisfies ReferringDomainsSortField,
      header: ({ column }) => (
        <SortableHeader
          column={column}
          label={t("backlinks.domains_table.issues")}
          helpText={t("backlinks.domains_table.issues_help")}
        />
      ),
      cell: ({ row }) => (
        <div className="text-sm">
          <div>
            {t("backlinks.domains_table.broken_links", {
              count: formatNumber(row.original.brokenBacklinks),
            })}
          </div>
          <div className="text-muted-foreground">
            {t("backlinks.domains_table.broken_pages", {
              count: formatNumber(row.original.brokenPages),
            })}
          </div>
        </div>
      ),
      sortDescFirst: true,
    }),
  ];

  if (!domainRatings) return baseColumns;

  const ratings = domainRatings;
  const drColumn = columnHelper.display({
    id: "ahrefsDr",
    header: () => (
      <HelpLabel
        label={t("backlinks.domains_table.ahrefs_dr")}
        helpText={t("backlinks.domains_table.ahrefs_dr_help")}
      />
    ),
    cell: ({ row }) => {
      const domain = row.original.domain;
      const dr = domain ? (ratings[domain] ?? null) : null;
      return dr == null ? "-" : formatDecimal(dr);
    },
  });

  const insertAt = baseColumns.findIndex((column) => column.id === "rank") + 1;
  return [
    ...baseColumns.slice(0, insertAt),
    drColumn,
    ...baseColumns.slice(insertAt),
  ];
}

function getDomainWebsiteHref(domain: string) {
  try {
    return new URL(domain).toString();
  } catch {
    return `https://${domain}`;
  }
}

export function ReferringDomainsTable({
  rows,
  domainRatings,
  sorting,
  onSortingChange,
  ...frame
}: DataTableFrameProps & {
  rows: ReferringDomainRow[];
  domainRatings: DomainRatings | null;
  sorting: SortingState;
  onSortingChange: OnChangeFn<SortingState>;
}) {
  const { t } = useLocale();
  const columns = useMemo(
    () => buildReferringDomainColumns(domainRatings, t),
    [domainRatings, t],
  );

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
      empty={{ title: t("backlinks.domains_table.empty_title") }}
      {...frame}
    />
  );
}
