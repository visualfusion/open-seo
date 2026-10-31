import type { BacklinksTab } from "@/types/schemas/backlinks";
import type { BacklinksOverviewData } from "./backlinksPageTypes";

export const TAB_DESCRIPTIONS: Record<BacklinksTab, string> = {
  backlinks:
    "See the individual links pointing to your target, including source page, anchor text, and link quality signals.",
  domains:
    "View the unique domains linking to your target, grouped at the site level instead of by individual link.",
  pages:
    "See which pages on the target site attract the most backlinks and referring domains.",
};

export function buildSummaryStats(
  data: BacklinksOverviewData | undefined,
  t?: (key: string) => string,
) {
  if (!data) return [];

  return [
    {
      label: t ? t("backlinks.overview.stats.backlinks") : "Backlinks",
      value: formatNumber(data.summary.backlinks),
      description: t
        ? t("backlinks.overview.stats.backlinks_desc")
        : "Total links pointing to this site or page.",
    },
    {
      label: t
        ? t("backlinks.overview.stats.referring_domains")
        : "Referring Domains",
      value: formatNumber(data.summary.referringDomains),
      description: t
        ? t("backlinks.overview.stats.referring_domains_desc")
        : "Unique domains linking to this site or page.",
    },
    {
      label: t
        ? t("backlinks.overview.stats.referring_pages")
        : "Referring Pages",
      value: formatNumber(data.summary.referringPages),
      description: t
        ? t("backlinks.overview.stats.referring_pages_desc")
        : "Unique pages linking to this site or page.",
    },
    {
      label: t ? t("backlinks.overview.stats.rank") : "Rank",
      value: formatNumber(data.summary.rank),
      description: t
        ? t("backlinks.overview.stats.rank_desc")
        : "DataForSEO's 0-100 authority score.",
    },
    {
      label: t
        ? t("backlinks.overview.stats.backlink_spam_score")
        : "Backlink Spam Score",
      value: formatDecimal(data.summary.backlinksSpamScore),
      description: t
        ? t("backlinks.overview.stats.backlink_spam_score_desc")
        : "Estimated spam risk of links pointing here.",
    },
    {
      label: t
        ? t("backlinks.overview.stats.broken_backlinks")
        : "Broken Backlinks",
      value: formatNumber(data.summary.brokenBacklinks),
      description: t
        ? t("backlinks.overview.stats.broken_backlinks_desc")
        : "Links pointing to broken pages here.",
    },
    {
      label: t ? t("backlinks.overview.stats.broken_pages") : "Broken Pages",
      value: formatNumber(data.summary.brokenPages),
      description: t
        ? t("backlinks.overview.stats.broken_pages_desc")
        : "Broken pages here that still have backlinks.",
    },
    {
      label: t
        ? t("backlinks.overview.stats.target_spam_score")
        : "Target Spam Score",
      value: formatDecimal(data.summary.targetSpamScore),
      description: t
        ? t("backlinks.overview.stats.target_spam_score_desc")
        : "Estimated spam risk of this site or page.",
    },
  ];
}

export function formatNumber(value: number | null | undefined) {
  if (value == null) return "-";
  return new Intl.NumberFormat().format(Math.round(value));
}

export function formatDecimal(value: number | null | undefined) {
  if (value == null) return "-";
  return value.toFixed(value >= 100 ? 0 : 1);
}

export function formatTooltipValue(value: unknown) {
  if (Array.isArray(value)) return value.join(", ");
  if (typeof value === "number") return formatNumber(value);
  if (typeof value === "string") return value;
  return "-";
}

export function formatCompactDate(value: string | null | undefined) {
  if (!value) return "-";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatMonthLabel(value: string) {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString(undefined, {
    month: "short",
    year: "2-digit",
  });
}

export function formatRelativeTimestamp(value: string) {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "recently";
  return parsed.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function extractUrlPath(url: string) {
  try {
    const parsed = new URL(url);
    return parsed.pathname + parsed.search + parsed.hash;
  } catch {
    return url;
  }
}

const ELLIPSIS = "...";

export function truncateMiddle(value: string, maxLength: number) {
  if (value.length <= maxLength) return value;
  if (maxLength <= ELLIPSIS.length)
    return value.slice(0, Math.max(maxLength, 0));
  const sideLength = Math.floor((maxLength - ELLIPSIS.length) / 2);
  if (sideLength <= 0) {
    return `${value.slice(0, maxLength - ELLIPSIS.length)}${ELLIPSIS}`;
  }
  return `${value.slice(0, sideLength)}${ELLIPSIS}${value.slice(-sideLength)}`;
}
