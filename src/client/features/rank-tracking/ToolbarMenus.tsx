import { useState } from "react";
import { MoreHorizontal, Play, RefreshCw } from "lucide-react";
import { ConfirmDialog } from "@/client/components/ConfirmDialog";
import { Button } from "@/client/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/client/components/ui/dropdown-menu";
import { useLocale } from "@/client/lib/i18n";

function ItemText({
  label,
  description,
}: {
  label: string;
  description: string;
}) {
  return (
    <span className="flex flex-col">
      <span>{label}</span>
      <span className="text-xs text-muted-foreground">{description}</span>
    </span>
  );
}

export function MoreMenu({
  onCheckNow,
  checkBusy,
  onRefreshMetrics,
  metricsRefreshing,
  trackedKeywordCount,
  hasData,
}: {
  onCheckNow: () => void;
  checkBusy: boolean;
  onRefreshMetrics: () => void;
  metricsRefreshing: boolean;
  trackedKeywordCount: number;
  hasData: boolean;
}) {
  const { t } = useLocale();
  const [confirmingRefresh, setConfirmingRefresh] = useState(false);
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label={t("ranks.toolbar.more_actions")}
              title={t("ranks.toolbar.more_actions")}
            />
          }
        >
          <MoreHorizontal />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-60">
          <DropdownMenuItem onClick={onCheckNow} disabled={checkBusy}>
            <Play />
            <ItemText
              label={
                checkBusy
                  ? t("ranks.toolbar.running")
                  : t("ranks.toolbar.check_rankings")
              }
              description={t("ranks.toolbar.check_rankings_desc")}
            />
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setConfirmingRefresh(true)}
            disabled={metricsRefreshing || !hasData}
          >
            <RefreshCw className={metricsRefreshing ? "animate-spin" : ""} />
            <ItemText
              label={
                metricsRefreshing
                  ? t("ranks.toolbar.refreshing")
                  : t("ranks.toolbar.update_stats")
              }
              description={t("ranks.toolbar.update_stats_desc")}
            />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {confirmingRefresh ? (
        <ConfirmDialog
          title={t("ranks.toolbar.update_confirm_title")}
          confirmLabel={t("ranks.toolbar.update_confirm_button")}
          onConfirm={() => {
            setConfirmingRefresh(false);
            onRefreshMetrics();
          }}
          onClose={() => setConfirmingRefresh(false)}
        >
          {t("ranks.toolbar.update_confirm_desc", {
            count: trackedKeywordCount,
          })}
        </ConfirmDialog>
      ) : null}
    </>
  );
}
