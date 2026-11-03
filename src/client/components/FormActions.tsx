import { useLocale } from "@/client/lib/i18n";
import { Button } from "@/client/components/ui/button";

/** The Cancel and submit buttons at the end of a form. */
export function FormActions({
  pending,
  disabled = false,
  onCancel,
  size = "default",
}: {
  pending: boolean;
  disabled?: boolean;
  onCancel: () => void;
  size?: "xs" | "sm" | "default";
}) {
  const { t } = useLocale();
  return (
    <div className="flex justify-end gap-2">
      <Button
        type="button"
        variant="ghost"
        size={size}
        onClick={onCancel}
        disabled={pending}
      >
        {t("ui.confirm_dialog.cancel")}
      </Button>
      <Button type="submit" size={size} disabled={disabled} pending={pending}>
        {t("ui.form_actions.save")}
      </Button>
    </div>
  );
}
