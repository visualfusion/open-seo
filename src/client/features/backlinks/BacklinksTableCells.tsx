import type React from "react";
import { ChevronRight } from "lucide-react";
import { SafeExternalLink } from "@/client/components/SafeExternalLink";
import { Badge } from "@/client/components/ui/badge";
import { Button } from "@/client/components/ui/button";
import { Spinner } from "@/client/components/ui/spinner";
import type { BacklinksRow } from "./backlinksPageTypes";
import { extractUrlPath, truncateMiddle } from "./backlinksPageUtils";

/**
 * Row model for the backlinks table. In the one-per-domain view, depth-0 rows
 * are each domain's strongest link and can expand into the domain's remaining
 * links (depth-1) plus a transient status row while they load.
 */
export type BacklinksDisplayRow =
  | {
      kind: "link";
      row: BacklinksRow;
      depth: 0 | 1;
      expandable: boolean;
      expanded: boolean;
    }
  | { kind: "status"; domain: string; status: "loading" | "error" | "empty" };

export function BacklinksSourceLink({
  url,
  maxLength,
  muted = false,
}: {
  url: string;
  maxLength: number;
  muted?: boolean;
}) {
  return (
    <SafeExternalLink
      url={url}
      label={truncateMiddle(extractUrlPath(url), maxLength)}
      className={`inline-flex items-center gap-1 break-all underline-offset-4 hover:underline ${muted ? "text-xs text-muted-foreground" : "text-sm"}`}
    />
  );
}

export function BacklinkFlags({
  row,
  t,
}: {
  row: BacklinksRow;
  t?: (key: string, params?: Record<string, string | number>) => string;
}) {
  return (
    <div className="flex flex-wrap gap-1">
      {row.isLost ? (
        <Badge variant="destructive">
          {t ? t("backlinks.backlinks_table.lost") : "Lost"}
        </Badge>
      ) : null}
      {row.isBroken ? (
        <Badge variant="warning">
          {t ? t("backlinks.backlinks_table.broken") : "Broken"}
        </Badge>
      ) : null}
      {row.isDofollow === false ? (
        <Badge variant="outline">
          {t ? t("backlinks.backlinks_table.nofollow") : "Nofollow"}
        </Badge>
      ) : null}
      {row.linksCount != null && row.linksCount > 1 ? (
        <Badge variant="outline">
          {t
            ? t("backlinks.backlinks_table.links_count", {
                count: row.linksCount,
              })
            : `${row.linksCount} links`}
        </Badge>
      ) : null}
    </div>
  );
}

function StatusCell({
  status,
  t,
}: {
  status: "loading" | "error" | "empty";
  t?: (key: string, params?: Record<string, string | number>) => string;
}) {
  if (status === "loading") {
    return (
      <span className="flex items-center gap-2 pl-6 text-sm text-muted-foreground">
        <Spinner className="size-3.5" />
        {t ? t("backlinks.backlinks_table.loading_links") : "Loading links…"}
      </span>
    );
  }
  return (
    <span className="pl-6 text-sm text-muted-foreground">
      {status === "error"
        ? t
          ? t("backlinks.backlinks_table.error_loading_links")
          : "Couldn't load this domain's links."
        : t
          ? t("backlinks.backlinks_table.empty_domain")
          : "No other links from this domain."}
    </span>
  );
}

export function SourceCell({
  displayRow,
  onToggleDomain,
  t,
}: {
  displayRow: BacklinksDisplayRow;
  onToggleDomain?: (domain: string) => void;
  t?: (key: string, params?: Record<string, string | number>) => string;
}) {
  if (displayRow.kind === "status") {
    return <StatusCell status={displayRow.status} t={t} />;
  }

  const { row, depth, expandable, expanded } = displayRow;
  if (depth > 0) {
    return (
      <div className="break-all pl-6">
        {row.urlFrom ? (
          <BacklinksSourceLink url={row.urlFrom} maxLength={48} muted />
        ) : (
          <span className="text-muted-foreground">-</span>
        )}
      </div>
    );
  }

  const domainLabel = row.domainFrom?.replace(/^www\./, "") ?? "-";
  const toggleLabel = t
    ? expanded
      ? t("backlinks.backlinks_table.hide_links", { domain: domainLabel })
      : t("backlinks.backlinks_table.show_links", { domain: domainLabel })
    : `${expanded ? "Hide" : "Show"} all links from ${domainLabel}`;

  return (
    <div className="flex items-start gap-1.5 break-all">
      {expandable && row.domainFrom && onToggleDomain ? (
        <Button
          variant="ghost"
          size="icon-xs"
          className="-ml-1 shrink-0"
          aria-label={toggleLabel}
          aria-expanded={expanded}
          onClick={() => onToggleDomain(row.domainFrom ?? "")}
        >
          <ChevronRight
            className={`size-4 transition-transform ${expanded ? "rotate-90" : ""}`}
          />
        </Button>
      ) : null}
      <div>
        <div className="font-semibold">{domainLabel}</div>
        {row.urlFrom ? (
          <BacklinksSourceLink url={row.urlFrom} maxLength={48} muted />
        ) : null}
      </div>
    </div>
  );
}

/** Renders nothing for status rows, the link cell otherwise. */
export function linkCell(
  render: (row: BacklinksRow) => React.ReactNode,
): (ctx: { row: { original: BacklinksDisplayRow } }) => React.ReactNode {
  return ({ row }) =>
    row.original.kind === "link" ? render(row.original.row) : null;
}
