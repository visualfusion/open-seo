import { useMemo, type MutableRefObject } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Star } from "lucide-react";
import { makeSelectionColumn } from "@/client/components/table/DataTable";
import { ScoreBadge } from "@/client/components/table/ScoreBadge";
import { Badge } from "@/client/components/ui/badge";
import { Button } from "@/client/components/ui/button";
import { SortableHeader } from "@/client/components/table/SortableHeader";
import type { RankTrackingRow } from "@/types/schemas/rank-tracking";
import { formatLocationLabel } from "@/shared/keyword-locations";
import { useLocale } from "@/client/lib/i18n";
import {
  CpcCell,
  DeviceRankCell,
  DeviceUrlCell,
  SerpFeatureTags,
  VolumeCell,
} from "./RankTrackingTableParts";
import type { SelectionAnchor } from "@/client/components/table/tableSelection";

export const RANK_TRACKING_HEADER_CLASS =
  "text-xs uppercase tracking-wide text-muted-foreground";

// Local configs fetch volume scoped to the tracked city, so the header must
// say which number the user is looking at — national volume can overstate
// local demand by orders of magnitude.
function makeVolumeColumn(
  t: (key: string) => string,
  locationLabel?: string,
): ColumnDef<RankTrackingRow> {
  return {
    id: "volume",
    accessorFn: (row) => row.searchVolume ?? undefined,
    header: ({ column }) => (
      <SortableHeader
        column={column}
        label={
          locationLabel ? t("ranks.local_volume") : t("ranks.search_volume")
        }
        title={
          locationLabel
            ? `Estimated monthly searches in ${locationLabel} from Google Ads`
            : t("ranks.tooltips.volume")
        }
        className={RANK_TRACKING_HEADER_CLASS}
      />
    ),
    size: 90,
    cell: ({ getValue }) => (
      <VolumeCell value={getValue<number | undefined>() ?? null} />
    ),
    sortUndefined: "last",
  };
}

function makeKdColumn(t: (key: string) => string): ColumnDef<RankTrackingRow> {
  return {
    id: "kd",
    accessorFn: (row) => row.keywordDifficulty ?? undefined,
    header: ({ column }) => (
      <SortableHeader
        column={column}
        label={t("ranks.kd")}
        title={t("ranks.tooltips.kd")}
        className={RANK_TRACKING_HEADER_CLASS}
      />
    ),
    size: 70,
    cell: ({ getValue }) => (
      <ScoreBadge value={getValue<number | undefined>() ?? null} />
    ),
    sortUndefined: "last",
  };
}

function makeCpcColumn(t: (key: string) => string): ColumnDef<RankTrackingRow> {
  return {
    id: "cpc",
    accessorFn: (row) => row.cpc ?? undefined,
    header: ({ column }) => (
      <SortableHeader
        column={column}
        label={t("ranks.cpc")}
        title={t("ranks.tooltips.cpc")}
        className={RANK_TRACKING_HEADER_CLASS}
      />
    ),
    size: 80,
    cell: ({ getValue }) => (
      <CpcCell value={getValue<number | undefined>() ?? null} />
    ),
    sortUndefined: "last",
  };
}

// Hidden column. The table always sorts by it first, so pinned keywords stay
// on top and each group keeps the sort the user picked.
export const PINNED_COLUMN_ID = "pinned";

const pinnedColumn: ColumnDef<RankTrackingRow> = {
  id: PINNED_COLUMN_ID,
  accessorFn: (row) => (row.pinned ? 0 : 1),
};

function makeKeywordColumn(
  t: (key: string) => string,
  onKeywordClick: (row: RankTrackingRow) => void,
  onSetPinned: (vars: { trackingKeywordId: string; pinned: boolean }) => void,
): ColumnDef<RankTrackingRow> {
  return {
    id: "keyword",
    accessorKey: "keyword",
    header: ({ column }) => (
      <SortableHeader
        column={column}
        label={t("ranks.keyword")}
        title={t("ranks.tooltips.keyword")}
        className={RANK_TRACKING_HEADER_CLASS}
      />
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-1.5">
        <PinButton
          t={t}
          pinned={row.original.pinned}
          onClick={() =>
            onSetPinned({
              trackingKeywordId: row.original.trackingKeywordId,
              pinned: !row.original.pinned,
            })
          }
        />
        <button
          type="button"
          className="text-left font-medium decoration-dotted underline-offset-2 hover:underline"
          onClick={() => onKeywordClick(row.original)}
          title={t("ranks.view_history")}
        >
          {row.original.keyword}
        </button>
        {row.original.matchCase && (
          <Badge
            variant="secondary"
            size="sm"
            className="cursor-help"
            title={t("ranks.match_case")}
          >
            Aa
          </Badge>
        )}
      </div>
    ),
    sortingFn: "alphanumeric",
  };
}

function PinButton({
  t,
  pinned,
  onClick,
}: {
  t: (key: string) => string;
  pinned: boolean;
  onClick: () => void;
}) {
  const label = pinned ? t("ranks.unpin_keyword") : t("ranks.pin_keyword");
  return (
    <Button
      variant="ghost"
      size="icon-xs"
      onClick={onClick}
      aria-label={label}
      aria-pressed={pinned}
      title={label}
      className={
        pinned ? "text-amber-500 hover:text-amber-600" : "text-muted-foreground"
      }
    >
      <Star className={pinned ? "fill-current" : undefined} />
    </Button>
  );
}

function makeDeviceColumn(
  t: (key: string) => string,
  device: "desktop" | "mobile",
): ColumnDef<RankTrackingRow> {
  const id = device === "desktop" ? "desktopPosition" : "mobilePosition";
  const title =
    device === "desktop"
      ? t("ranks.tooltips.desktop_position")
      : t("ranks.tooltips.mobile_position");
  return {
    id,
    accessorFn: (row) => row[device].position ?? undefined,
    header: ({ column }) => (
      <SortableHeader
        column={column}
        label={t("ranks.position")}
        title={title}
        className={RANK_TRACKING_HEADER_CLASS}
      />
    ),
    size: 120,
    maxSize: 140,
    cell: ({ row }) => <DeviceRankCell result={row.original[device]} />,
    sortUndefined: "last",
  };
}

function makeUrlColumn(
  t: (key: string) => string,
  device: "desktop" | "mobile",
  domain: string,
): ColumnDef<RankTrackingRow> {
  return {
    id: device === "desktop" ? "desktopUrl" : "mobileUrl",
    enableSorting: false,
    header: () => (
      <span
        className="cursor-help text-xs font-medium tracking-wide uppercase text-muted-foreground"
        title={t("ranks.tooltips.url")}
      >
        {t("ranks.url")}
      </span>
    ),
    size: 240,
    cell: ({ row }) => (
      <DeviceUrlCell result={row.original[device]} domain={domain} />
    ),
  };
}

function makeSerpColumn(
  t: (key: string) => string,
  device: "desktop" | "mobile",
): ColumnDef<RankTrackingRow> {
  return {
    id: device === "desktop" ? "desktopSerp" : "mobileSerp",
    enableSorting: false,
    header: () => (
      <span
        className="cursor-help text-xs font-medium tracking-wide uppercase text-muted-foreground"
        title={t("ranks.tooltips.serp")}
      >
        {t("ranks.serp_features")}
      </span>
    ),
    cell: ({ row }) => {
      const features = row.original[device].serpFeatures;
      if (features.length === 0) return null;
      return <SerpFeatureTags features={features} />;
    },
  };
}

export function useRankTrackingColumns(options: {
  showDesktop: boolean;
  showMobile: boolean;
  domain: string;
  selectAnchorRef: MutableRefObject<SelectionAnchor | null>;
  onKeywordClick: (row: RankTrackingRow) => void;
  onSetPinned: (vars: { trackingKeywordId: string; pinned: boolean }) => void;
  locationName?: string | null;
}): ColumnDef<RankTrackingRow>[] {
  const { t } = useLocale();
  const {
    showDesktop,
    showMobile,
    domain,
    selectAnchorRef,
    onKeywordClick,
    onSetPinned,
    locationName,
  } = options;
  const locationLabel = locationName
    ? formatLocationLabel(locationName, 2)
    : undefined;
  return useMemo(() => {
    const cols: ColumnDef<RankTrackingRow>[] = [
      pinnedColumn,
      makeSelectionColumn<RankTrackingRow>(selectAnchorRef),
      makeKeywordColumn(t, onKeywordClick, onSetPinned),
    ];
    if (showDesktop) {
      cols.push(makeDeviceColumn(t, "desktop"));
      cols.push(makeUrlColumn(t, "desktop", domain));
    }
    if (showMobile) {
      cols.push(makeDeviceColumn(t, "mobile"));
      cols.push(makeUrlColumn(t, "mobile", domain));
    }
    cols.push(
      makeVolumeColumn(t, locationLabel),
      makeKdColumn(t),
      makeCpcColumn(t),
    );
    if (showDesktop) {
      cols.push(makeSerpColumn(t, "desktop"));
    }
    if (showMobile) {
      cols.push(makeSerpColumn(t, "mobile"));
    }
    return cols;
  }, [
    t,
    showDesktop,
    showMobile,
    domain,
    selectAnchorRef,
    onKeywordClick,
    onSetPinned,
    locationLabel,
  ]);
}
