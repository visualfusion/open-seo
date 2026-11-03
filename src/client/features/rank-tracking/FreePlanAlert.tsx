import { Link } from "@tanstack/react-router";
import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/client/components/ui/alert";
import { useLocale } from "@/client/lib/i18n";
import { SUBSCRIBE_ROUTE } from "@/shared/billing";

export function FreePlanAlert({ visible }: { visible: boolean }) {
  const { t } = useLocale();
  if (!visible) return null;

  return (
    <Alert variant="warning">
      <AlertTriangle />
      <AlertDescription className="text-foreground">
        <p>
          {t("ranks.alerts.free_plan_prefix")}
          <Link
            to={SUBSCRIBE_ROUTE}
            search={{ upgrade: true }}
            className="font-medium underline underline-offset-3"
          >
            {t("ranks.alerts.free_plan_link")}
          </Link>
          {t("ranks.alerts.free_plan_suffix")}
        </p>
      </AlertDescription>
    </Alert>
  );
}
