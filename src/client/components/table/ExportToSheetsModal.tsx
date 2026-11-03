import { useLocale } from "@/client/lib/i18n";
import { useEffect } from "react";
import { useLocation } from "@tanstack/react-router";
import { Check, ExternalLink } from "lucide-react";
import { Button } from "@/client/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/client/components/ui/dialog";
import {
  closeExportToSheetsModal,
  openGoogleSheetsTab,
  useExportToSheetsModalState,
} from "@/client/lib/exportToSheets";

export function ExportToSheetsModal() {
  const { t } = useLocale();
  const state = useExportToSheetsModalState();
  // Close any stale modal when the user navigates away mid-flow. Deps must
  // be `[pathname]` only — adding `isOpen` would close the modal the instant
  // it opens (the effect would fire on the open->true transition).
  const pathname = useLocation({ select: (l) => l.pathname });
  useEffect(() => {
    closeExportToSheetsModal();
  }, [pathname]);

  if (!state.isOpen) return null;

  const { rowCount } = state;

  const handleOpenSheet = () => {
    openGoogleSheetsTab();
    closeExportToSheetsModal();
  };

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) closeExportToSheetsModal();
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 pr-8 leading-snug">
            <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-success/15 text-success">
              <Check className="size-4" />
            </span>
            {t(
              rowCount === 1
                ? "ui.sheets_modal.copied_badge_one"
                : "ui.sheets_modal.copied_badge",
              { rows: rowCount },
            )}
          </DialogTitle>
          <DialogDescription>
            {t("ui.details.open_a_new_google_fill_it")}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={handleOpenSheet}>
            {t("ui.sheets_modal.open_sheets")}
            <ExternalLink data-icon="inline-end" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
