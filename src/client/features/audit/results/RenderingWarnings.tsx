import { ShieldAlert } from "lucide-react";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/client/components/ui/alert";
import type { AuditResultsData } from "@/client/features/audit/results/types";
import { useLocale } from "@/client/lib/i18n";

/** Report notices about JavaScript: app shells, and pages a render missed. */
export function RenderingWarnings({ data }: { data: AuditResultsData }) {
  const { t } = useLocale();
  const rendered = data.audit.config.renderJavaScript;
  const hasShells = data.issues.some(
    (issue) => issue.issueType === "javascript-rendering-suspected",
  );
  const unreadCount = data.pages.filter(
    (page) => page.fetchClass === "error",
  ).length;

  return (
    <>
      {hasShells && (
        <Alert variant="warning">
          <ShieldAlert />
          <AlertTitle>{t("audit.warnings.shells_title")}</AlertTitle>
          <AlertDescription>
            {rendered
              ? t("audit.warnings.shells_rendered_desc")
              : t("audit.warnings.shells_not_rendered_desc")}
          </AlertDescription>
        </Alert>
      )}

      {rendered && unreadCount > 0 && (
        <Alert variant="warning">
          <ShieldAlert />
          <AlertTitle>
            {t("audit.warnings.unread_pages_title", {
              count: String(unreadCount),
              pages:
                unreadCount === 1
                  ? t("audit.page_singular")
                  : t("audit.page_plural"),
            })}
          </AlertTitle>
          <AlertDescription>
            {t("audit.warnings.unread_pages_desc")}
          </AlertDescription>
        </Alert>
      )}

      {rendered && (
        <p className="text-sm text-muted-foreground">
          {t("audit.warnings.js_rendering_enabled")}
        </p>
      )}
    </>
  );
}
