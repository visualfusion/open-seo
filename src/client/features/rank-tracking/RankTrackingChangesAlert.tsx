import { Info } from "lucide-react";
import { Alert, AlertDescription } from "@/client/components/ui/alert";
import { useLocale } from "@/client/lib/i18n";

export function RankTrackingChangesAlert() {
  const { t } = useLocale();

  return (
    <Alert variant="info" className="mb-4">
      <Info />
      <AlertDescription className="text-foreground">
        <p>
          <span className="font-medium">{t("ranks.alerts.changes_bold")}</span>{" "}
          {t("ranks.alerts.changes_desc")}{" "}
          <a
            href="https://openseo.so/blogs/state-of-rank-tracking-november-2026"
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
