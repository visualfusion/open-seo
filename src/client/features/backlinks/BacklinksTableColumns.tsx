import type { ColumnDef } from "@tanstack/react-table";
import { SortableHeader } from "@/client/components/table/SortableHeader";
import { HelpLabel } from "@/client/components/HelpLabel";
import type { BacklinksRowsSortField } from "@/types/schemas/backlinks";
import {
  formatCompactDate,
  formatDecimal,
  formatNumber,
} from "./backlinksPageUtils";
import type { DomainRatings } from "./useAhrefsDomainRatings";
import {
  type BacklinksDisplayRow,
  BacklinkFlags,
  BacklinksSourceLink,
  SourceCell,
  linkCell,
} from "./BacklinksTableCells";

export type { BacklinksDisplayRow };

function buildBaseColumns(
  onToggleDomain?: (domain: string) => void,
  t?: (key: string, params?: Record<string, string | number>) => string,
): ColumnDef<BacklinksDisplayRow>[] {
  // Sortable column ids ("rank", "domainRank", "spamScore", "firstSeen") map
  // to server-side sort fields — sorting re-queries DataForSEO across the
  // full backlink profile, not just the loaded page.
  return [
    {
      id: "source",
      enableSorting: false,
      header: () => (
        <HelpLabel
          label={t ? t("backlinks.backlinks_table.source") : "Source"}
          helpText={
            t
              ? t("backlinks.backlinks_table.source_help")
              : "Page linking to you"
          }
        />
      ),
      meta: { headerClassName: "min-w-[200px]" },
      cell: ({ row }) => (
        <SourceCell
          displayRow={row.original}
          onToggleDomain={onToggleDomain}
          t={t}
        />
      ),
    },
    {
      id: "target",
      enableSorting: false,
      header: () => (
        <HelpLabel
          label={t ? t("backlinks.backlinks_table.target") : "Target"}
          helpText={
            t
              ? t("backlinks.backlinks_table.target_help")
              : "Destination on your site"
          }
        />
      ),
      meta: { headerClassName: "min-w-[180px]" },
      cell: linkCell((row) => (
        <div className="break-all">
          {row.urlTo ? (
            <BacklinksSourceLink url={row.urlTo} maxLength={40} />
          ) : (
            "-"
          )}
        </div>
      )),
    },
    {
      id: "anchor",
      enableSorting: false,
      header: () => (
        <HelpLabel
          label={t ? t("backlinks.backlinks_table.anchor") : "Anchor"}
          helpText={
            t
              ? t("backlinks.backlinks_table.anchor_help")
              : "Text or format of the link"
          }
        />
      ),
      meta: { headerClassName: "min-w-[150px]" },
      cell: linkCell((row) => (
        <div className="space-y-0.5 wrap-anywhere">
          <span className="text-sm">
            {row.anchor ||
              (t ? t("backlinks.backlinks_table.no_anchor") : "No anchor text")}
          </span>
          {row.itemType ? (
            <div className="text-xs text-muted-foreground">{row.itemType}</div>
          ) : null}
        </div>
      )),
    },
    {
      id: "flags",
      enableSorting: false,
      header: () => (
        <HelpLabel
          label={t ? t("backlinks.backlinks_table.flags") : "Flags"}
          helpText={
            t
              ? t("backlinks.backlinks_table.flags_help")
              : "Special backlink attributes, such as lost, broken, nofollow, or multiple links from the same source."
          }
        />
      ),
      meta: { headerClassName: "min-w-[110px]" },
      cell: linkCell((row) => <BacklinkFlags row={row} t={t} />),
    },
    {
      id: "rank" satisfies BacklinksRowsSortField,
      accessorFn: (displayRow) =>
        displayRow.kind === "link" ? displayRow.row.rank : null,
      header: ({ column }) => (
        <SortableHeader
          column={column}
          label={t ? t("backlinks.backlinks_table.link_rank") : "Link"}
          helpText={
            t
              ? t("backlinks.backlinks_table.link_rank_help")
              : "Authority of the linking page"
          }
          align="right"
        />
      ),
      sortDescFirst: true,
      cell: linkCell((row) => (
        <div className="text-right tabular-nums text-sm">
          {formatNumber(row.rank)}
        </div>
      )),
    },
    {
      id: "domainRank" satisfies BacklinksRowsSortField,
      accessorFn: (displayRow) =>
        displayRow.kind === "link" ? displayRow.row.domainFromRank : null,
      header: ({ column }) => (
        <SortableHeader
          column={column}
          label={t ? t("backlinks.backlinks_table.da") : "DA"}
          helpText={
            t
              ? t("backlinks.backlinks_table.da_help")
              : "Authority of the linking domain"
          }
          align="right"
        />
      ),
      sortDescFirst: true,
      cell: linkCell((row) => (
        <div className="text-right tabular-nums text-sm">
          {formatNumber(row.domainFromRank)}
        </div>
      )),
    },
    {
      id: "spamScore" satisfies BacklinksRowsSortField,
      accessorFn: (displayRow) =>
        displayRow.kind === "link" ? displayRow.row.spamScore : null,
      header: ({ column }) => (
        <SortableHeader
          column={column}
          label={t ? t("backlinks.backlinks_table.spam") : "Spam"}
          helpText={
            t
              ? t("backlinks.backlinks_table.spam_help")
              : "Estimated spam risk for this backlink. Higher scores are more likely to be manipulative or low quality."
          }
          align="right"
        />
      ),
      sortDescFirst: true,
      cell: linkCell((row) => {
        const value = row.spamScore;
        return (
          <div className="text-right tabular-nums text-sm">
            {value != null ? (
              Math.round(value)
            ) : (
              <span title="Spam score unknown">-</span>
            )}
          </div>
        );
      }),
    },
    {
      id: "firstSeen" satisfies BacklinksRowsSortField,
      accessorFn: (displayRow) =>
        displayRow.kind === "link" ? displayRow.row.firstSeen : null,
      header: ({ column }) => (
        <SortableHeader
          column={column}
          label={t ? t("backlinks.backlinks_table.first_seen") : "First Seen"}
          helpText={
            t
              ? t("backlinks.backlinks_table.first_seen_help")
              : "When this link was first discovered by the crawler"
          }
        />
      ),
      sortDescFirst: true,
      cell: linkCell((row) => (
        <div className="whitespace-nowrap text-sm">
          <div>{formatCompactDate(row.firstSeen)}</div>
          {row.lastSeen ? (
            <div className="text-xs text-muted-foreground">
              {t
                ? t("backlinks.backlinks_table.last_seen", {
                    date: formatCompactDate(row.lastSeen),
                  })
                : `Last ${formatCompactDate(row.lastSeen)}`}
            </div>
          ) : null}
        </div>
      )),
    },
  ];
}

/**
 * Columns for the backlinks table. When `domainRatings` is provided (the user
 * clicked "Ahrefs DR"), an Ahrefs DR column is inserted after DA; otherwise it
 * stays hidden. DR is loaded client-side from Ahrefs, so it can't participate
 * in server-side sorting.
 */
export function buildBacklinksColumns(
  domainRatings: DomainRatings | null,
  onToggleDomain?: (domain: string) => void,
  t?: (key: string, params?: Record<string, string | number>) => string,
): ColumnDef<BacklinksDisplayRow>[] {
  const baseColumns = buildBaseColumns(onToggleDomain, t);
  if (!domainRatings) return baseColumns;

  const ratings = domainRatings;
  const drColumn: ColumnDef<BacklinksDisplayRow> = {
    id: "ahrefsDr",
    enableSorting: false,
    header: () => (
      <span className="flex w-full justify-end">
        <HelpLabel
          label={t ? t("backlinks.backlinks_table.ahrefs_dr") : "Ahrefs DR"}
          helpText={
            t
              ? t("backlinks.backlinks_table.ahrefs_dr_help")
              : "Ahrefs Domain Rating (0-100) for the linking domain."
          }
        />
      </span>
    ),
    cell: linkCell((row) => {
      const domain = row.domainFrom?.replace(/^www\./, "");
      const dr = domain ? (ratings[domain] ?? null) : null;
      return (
        <div className="text-right tabular-nums text-sm">
          {dr == null ? "-" : formatDecimal(dr)}
        </div>
      );
    }),
  };

  const insertAt =
    baseColumns.findIndex((column) => column.id === "domainRank") + 1;
  return [
    ...baseColumns.slice(0, insertAt),
    drColumn,
    ...baseColumns.slice(insertAt),
  ];
}
