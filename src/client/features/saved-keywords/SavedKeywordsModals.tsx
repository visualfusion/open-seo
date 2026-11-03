import { useLocale } from "@/client/lib/i18n";
import { AlertCircle } from "lucide-react";
import { ConfirmDialog } from "@/client/components/ConfirmDialog";
import { Alert, AlertDescription } from "@/client/components/ui/alert";

export function RemoveSavedKeywordsError({ message }: { message: string }) {
  return (
    <Alert variant="destructive">
      <AlertCircle />
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}

export function DeleteSavedKeywordsModal({
  selectedCount,
  isPending,
  onClose,
  onConfirm,
}: {
  selectedCount: number;
  isPending: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  const { t } = useLocale();
  const plural = selectedCount !== 1 ? "s" : "";
  return (
    <ConfirmDialog
      title={t("saved_keywords.details.delete_keywords")}
      confirmLabel={t("saved_keywords.details.delete_value_keywordvalue", {
        v1: selectedCount,
        v2: plural,
      })}
      destructive
      pending={isPending}
      onClose={onClose}
      onConfirm={onConfirm}
    >
      {t(
        selectedCount === 1
          ? "saved_keywords.details.delete_description_one"
          : "saved_keywords.details.delete_description",
        { count: selectedCount },
      )}
    </ConfirmDialog>
  );
}
