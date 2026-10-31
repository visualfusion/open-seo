import { ConfirmDialog } from "@/client/components/ConfirmDialog";
import type { RankTrackingConfig } from "@/types/schemas/rank-tracking";
import {
  devicesCount,
  KEYWORDS_PER_BATCH,
  SECONDS_PER_BATCH,
} from "@/shared/rank-tracking";
import { useLocale } from "@/client/lib/i18n";

export function CheckConfirmModal({
  keywordCount,
  devices,
  costUsd,
  isPending,
  onRunNow,
  onCancel,
}: {
  keywordCount: number;
  devices: RankTrackingConfig["devices"];
  /** Server estimate; it prices each keyword's text (operators cost 5x). */
  costUsd: number | undefined;
  isPending: boolean;
  onRunNow: () => void;
  onCancel: () => void;
}) {
  const { t } = useLocale();
  const dc = devicesCount(devices);
  const totalChecks = keywordCount * dc;
  const liveTime =
    Math.ceil(totalChecks / KEYWORDS_PER_BATCH) * SECONDS_PER_BATCH;

  const eta =
    liveTime < 60 ? `${liveTime}s` : `${Math.ceil(liveTime / 60)} min`;

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
      {t("ranks.modals.check_confirm_desc", {
        keywords: keywordCount,
        devices: dc,
        total: totalChecks,
        eta,
      })}
      {costUsd != null ? (
        <>
          {" "}
          {t("ranks.modals.check_confirm_cost", {
            cost: costUsd.toFixed(2),
          })}
        </>
      ) : null}
    </ConfirmDialog>
  );
}
