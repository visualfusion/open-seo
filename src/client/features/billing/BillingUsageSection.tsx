import { useLocale } from "@/client/lib/i18n";
import type { ReactNode } from "react";

/** A section of the billing Usage tab: a title with "Last 30 days" on the
 *  right. */
export function BillingUsageSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  const { t } = useLocale();
  return (
    <section className="space-y-3">
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="font-medium">{title}</h2>
        <span className="text-xs text-muted-foreground">
          {t("ui.ai_visibility_ext.date_range.last_30_days")}
        </span>
      </div>
      {children}
    </section>
  );
}
