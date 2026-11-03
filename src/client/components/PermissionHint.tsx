import { useLocale } from "@/client/lib/i18n";
import { cn } from "cn";

/** Shown where a missing permission would otherwise leave a card or step empty. */
export function PermissionHint({
  action,
  className,
}: {
  action: string;
  className?: string;
}) {
  const { t } = useLocale();
  return (
    <p className={cn("text-sm text-muted-foreground", className)}>
      {t("ui.details.ask_an_organization_owner_or_admin_to")} {action}.
    </p>
  );
}
