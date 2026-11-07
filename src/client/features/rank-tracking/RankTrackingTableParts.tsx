import { getTranslation, useLocale } from "@/client/lib/i18n";
import { Sparkles } from "lucide-react";
import { Badge } from "@/client/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/client/components/ui/tooltip";
import { exportRows } from "@/client/lib/exportRows";
import { captureClientEvent } from "@/client/lib/posthog";
import { isGoogleRedirect } from "@/shared/google-serp-url";
import { formatLocationLabel } from "@/shared/keyword-locations";
import type {
  RankTrackingDeviceResult,
  RankTrackingRow,
} from "@/types/schemas/rank-tracking";
import { formatExportTimestamp } from "@/client/lib/db-timestamp";

const FEATURE_SHORT_LABELS: Record<string, string> = {
  featured_snippet: "ranks.details.serp_featured_snippet_short",
  people_also_ask: "ranks.details.serp_people_also_ask_short",
  ai_overview: "ranks.details.serp_ai_overview_short",
  local_pack: "ranks.details.serp_local_pack_short",
  knowledge_panel: "ranks.details.serp_knowledge_panel_short",
  video: "ranks.details.serp_video_short",
  images: "ranks.details.serp_images_short",
  shopping: "ranks.details.serp_shopping_short",
  top_stories: "ranks.details.serp_top_stories_short",
};
const FEATURE_TOOLTIPS: Record<string, string> = {
  featured_snippet: "ranks.details.serp_featured_snippet_tooltip",
  people_also_ask: "ranks.details.serp_people_also_ask_tooltip",
  ai_overview: "ranks.details.serp_ai_overview_tooltip",
  local_pack: "ranks.details.serp_local_pack_tooltip",
  knowledge_panel: "ranks.details.serp_knowledge_panel_tooltip",
  video: "ranks.details.serp_video_tooltip",
  images: "ranks.details.serp_images_tooltip",
  shopping: "ranks.details.serp_shopping_tooltip",
  top_stories: "ranks.details.serp_top_stories_tooltip",
};
export function SerpFeatureTags({ features }: { features: string[] }) {
  const { t } = useLocale();
  const notable = features.filter((f) => f in FEATURE_SHORT_LABELS);
  if (notable.length === 0) return null;
  return (
    <div className="flex gap-1 flex-wrap">
      {notable.map((f) => (
        <Badge
          key={f}
          variant="secondary"
          size="sm"
          className="cursor-help"
          title={t(FEATURE_TOOLTIPS[f])}
        >
          {f === "ai_overview" && <Sparkles />}
          {t(FEATURE_SHORT_LABELS[f])}
        </Badge>
      ))}
    </div>
  );
}

export function DeviceRankCell({
  result,
}: {
  result: RankTrackingDeviceResult;
}) {
  const { t } = useLocale();
  const { position, previousPosition } = result;

  // Nothing at all
  if (position === null && previousPosition === null) {
    return <span className="text-muted-foreground">-</span>;
  }

  // Was ranking, now lost
  if (position === null && previousPosition !== null) {
    return (
      <span className="inline-flex items-center gap-1.5">
        <span className="w-6 text-right font-mono text-xs text-muted-foreground">
          {previousPosition}
        </span>
        <span className="text-muted-foreground/60">→</span>
        <span className="font-mono rounded px-1.5 py-0.5 text-xs font-semibold bg-destructive/15 text-destructive">
          {t("ranks.table_ext.lost_badge")}
        </span>
      </span>
    );
  }

  // First check — no previous data
  if (previousPosition === null) {
    return <span className="font-mono">{position}</span>;
  }

  // Both exist — show old → new with colored badge
  const change = previousPosition - position!;
  let badgeClass = "bg-muted text-foreground";
  if (change > 0) badgeClass = "bg-success/20 text-success";
  if (change < 0) badgeClass = "bg-warning/20 text-warning";

  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="w-6 text-right font-mono text-xs text-muted-foreground">
        {previousPosition}
      </span>
      <span className="text-muted-foreground/60">→</span>
      <span
        className={`font-mono rounded px-1.5 py-0.5 text-xs font-semibold ${badgeClass}`}
      >
        {position}
      </span>
    </span>
  );
}

export function DeviceUrlCell({
  result,
  domain,
}: {
  result: RankTrackingDeviceResult;
  domain: string;
}) {
  if (!result.rankingUrl) {
    return <span className="text-xs text-muted-foreground">-</span>;
  }
  const href = toFullUrl(result.rankingUrl, domain);
  // Until a run resolves them, Google's goto links have no useful path to show.
  if (isGoogleRedirect(result.rankingUrl)) {
    return (
      <Tooltip>
        <TooltipTrigger
          render={
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-fit text-xs underline"
            />
          }
        >
          View page
        </TooltipTrigger>
        <TooltipContent>Google hid this page's address.</TooltipContent>
      </Tooltip>
    );
  }
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="block truncate text-xs hover:underline"
      title={result.rankingUrl}
    >
      {toPath(result.rankingUrl)}
    </a>
  );
}

const compactFormatter = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
});

export function VolumeCell({ value }: { value: number | null }) {
  if (value == null) return <span className="text-muted-foreground">-</span>;
  return (
    <span className="font-mono text-sm">{compactFormatter.format(value)}</span>
  );
}

export function CpcCell({ value }: { value: number | null }) {
  if (value == null) return <span className="text-muted-foreground">-</span>;
  return <span className="font-mono text-sm">${value.toFixed(2)}</span>;
}

/** Numeric change for CSV export — numbers bypass the CSV formula-injection sanitizer */
export function csvChange(
  current: number | null,
  previous: number | null,
): number | string {
  if (previous === null) return current !== null ? "new" : "";
  if (current === null) return "lost";
  return previous - current;
}

function buildRankTrackingExport(
  sorted: RankTrackingRow[],
  showDesktop: boolean,
  showMobile: boolean,
  locationName?: string | null,
): { headers: string[]; rows: (string | number)[][] } {
  const headers = [
    "Keyword",
    // Exports lack the table's tooltip, so name the city inline.
    locationName
      ? getTranslation("ranks.details.local_volume_value", undefined, {
          v1: formatLocationLabel(locationName, 2),
        })
      : "Volume",
    "KD",
    "CPC",
    ...(showDesktop
      ? [
          "Desktop Position",
          "Desktop Change",
          "Desktop URL",
          "Desktop SERP Features",
          "Desktop Checked At (UTC)",
        ]
      : []),
    ...(showMobile
      ? [
          "Mobile Position",
          "Mobile Change",
          "Mobile URL",
          "Mobile SERP Features",
          "Mobile Checked At (UTC)",
        ]
      : []),
  ];
  // Emit empty cells (not "Not ranking" strings) so Sheets infers a numeric
  // column type and the user can sort by position.
  const rows = sorted.map((row) => [
    row.keyword,
    row.searchVolume ?? "",
    row.keywordDifficulty ?? "",
    row.cpc ?? "",
    ...(showDesktop
      ? [
          row.desktop.position ?? "",
          csvChange(row.desktop.position, row.desktop.previousPosition),
          row.desktop.rankingUrl ?? "",
          row.desktop.serpFeatures.join(", "),
          row.desktop.checkedAt
            ? formatExportTimestamp(row.desktop.checkedAt)
            : "",
        ]
      : []),
    ...(showMobile
      ? [
          row.mobile.position ?? "",
          csvChange(row.mobile.position, row.mobile.previousPosition),
          row.mobile.rankingUrl ?? "",
          row.mobile.serpFeatures.join(", "),
          row.mobile.checkedAt
            ? formatExportTimestamp(row.mobile.checkedAt)
            : "",
        ]
      : []),
  ]);
  return { headers, rows };
}

export function exportRankTracking(args: {
  format: "csv" | "sheets";
  rows: RankTrackingRow[];
  showDesktop: boolean;
  showMobile: boolean;
  domain: string;
  locationName?: string | null;
  scope?: "selection";
}) {
  const { format, scope } = args;
  const { headers, rows } = buildRankTrackingExport(
    args.rows,
    args.showDesktop,
    args.showMobile,
    args.locationName,
  );
  // CSV file download keeps cents-formatted CPC for human readability;
  // clipboard/Sheets export uses raw numbers (see buildRankTrackingExport).
  const exportedRows =
    format === "csv"
      ? rows.map((row) =>
          row.map((cell, idx) =>
            idx === 3 && typeof cell === "number" ? cell.toFixed(2) : cell,
          ),
        )
      : rows;
  void exportRows({
    format,
    feature: "rank_tracking",
    headers,
    rows: exportedRows,
    filename: `rank-tracking-${args.domain}${scope ? "-selected" : ""}`,
    scope,
  });
  if (format === "csv" && rows.length > 0) {
    captureClientEvent("rank_tracking:export_csv", scope ? { scope } : {});
  }
}

function toPath(url: string): string {
  try {
    return new URL(url).pathname;
  } catch {
    return url;
  }
}

function toFullUrl(url: string, domain: string): string {
  if (url.startsWith("http")) return url;
  return `https://${domain}${url}`;
}
