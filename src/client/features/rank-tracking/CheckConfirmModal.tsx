import { ConfirmDialog } from "@/client/components/ConfirmDialog";
import type { RankTrackingConfig } from "@/types/schemas/rank-tracking";
import { devicesCount, RANK_CHECK_DURATION_COPY } from "@/shared/rank-tracking";
import { useLocale } from "@/client/lib/i18n";

export function CheckConfirmModal({
  keywordCount,
  devices,
  costUsd,
  isPending,
  isScheduled,
  onRunNow,
  onCancel,
}: {
  keywordCount: number;
  devices: RankTrackingConfig["devices"];
  costUsd: number | undefined;
  isPending: boolean;
  isScheduled: boolean;
  onRunNow: () => void;
  onCancel: () => void;
}) {
  const { t } = useLocale();
  const dc = devicesCount(devices);

  return (
    <ConfirmDialog
      title={
        keywordCount === 1
          ? t("ranks.modals.check_confirm_title_one")
          : t("ranks.modals.check_confirm_title", { count: keywordCount })
      }
      confirmLabel={t("ranks.modals.check_confirm_button")}
      pending={isPending}
      onConfirm={onRunNow}
      onClose={onCancel}
    >
      <span className="flex flex-col gap-1">
        <span>
          {t("ranks.modals.check_confirm_items", {
            keywords: keywordCount,
            s1: keywordCount !== 1 ? "s" : "",
            devices: dc,
            s2: dc !== 1 ? "e" : "",
          })}
        </span>
        {costUsd != null ? (
          <span>
            {t("ranks.modals.check_confirm_cost_up_to")}{" "}
            <span className="font-mono font-semibold text-foreground">
              ${costUsd.toFixed(2)}
            </span>
          </span>
        ) : null}
        <span>
          {RANK_CHECK_DURATION_COPY}
          {isScheduled ? ` ${t("ranks.modals.scheduled_tracking_wont_change")}` : null}
        </span>
      </span>
    </ConfirmDialog>
  );
}
