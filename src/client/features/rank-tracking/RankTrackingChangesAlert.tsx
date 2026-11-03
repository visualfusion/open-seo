import { Info } from "lucide-react";
import { Alert, AlertDescription } from "@/client/components/ui/alert";
import { useLocale } from "@/client/lib/i18n";

export function RankTrackingChangesAlert() {
  const { t } = useLocale();
  return (
    <Alert variant="info">
      <Info />
      <AlertDescription className="text-foreground">
        <p>
          <span className="font-medium">{t("ranks.alerts.changes_bold")}</span>{" "}
          {t("ranks.alerts.changes_desc")}{" "}
          <a
            href="https://openseo.so/blogs/rank-tracking-changes"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium underline underline-offset-4"
          >
            {t("ranks.alerts.changes_link")}
          </a>
        </p>
      </AlertDescription>
    </Alert>
  );
}
