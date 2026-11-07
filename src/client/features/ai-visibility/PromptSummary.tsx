import { useLocale } from "@/client/lib/i18n";
import { useState } from "react";
import { sort } from "remeda";
import { Badge } from "@/client/components/ui/badge";
import { Button } from "@/client/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/client/components/ui/table";
import { aiBrandLabel, type AiBrandSummary } from "@/shared/ai-visibility";
import { DomainFavicon } from "./DomainFavicon";
import { aiRate } from "./shared";

// Your brand plus the top three competitors.
const VISIBLE_BRANDS = 4;

export function PromptSummary({ summaries }: { summaries: AiBrandSummary[] }) {
  const { t } = useLocale();
  const [expanded, setExpanded] = useState(false);
  // Most-mentioned competitors first, so the collapsed table shows the ones that matter.
  const ranked = sort(
    summaries,
    (a, b) =>
      Number(b.own) - Number(a.own) ||
      b.mentions - a.mentions ||
      b.citations - a.citations,
  );
  const visible = expanded ? ranked : ranked.slice(0, VISIBLE_BRANDS);
  const hiddenCount = ranked.length - visible.length;
  return (
    <div className="overflow-hidden rounded-lg border bg-card border-border">
      <h2 className="border-b px-4 py-2 text-sm font-medium border-border">
        {t("ai_visibility.details.brand_comparison")}
      </h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("ai_visibility.col_brand")}</TableHead>
            <TableHead>
              {t("ui.ai_visibility_ext.answer_view.mentioned")}
            </TableHead>
            <TableHead>{t("ui.ai_visibility_ext.answer_view.cited")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {visible.map((brand) => (
            <TableRow key={brand.domain}>
              <TableCell>
                <span className="flex items-center gap-2">
                  <DomainFavicon domain={brand.domain} />
                  {aiBrandLabel(brand)}
                  {brand.own && (
                    <Badge variant="secondary" size="sm">
                      {t("ai_visibility.badge_you")}
                    </Badge>
                  )}
                </span>
              </TableCell>
              <TableCell
                className="tabular-nums"
                title={t("ai_visibility.details.value_of_value_answers", {
                  v1: brand.mentions,
                  v2: brand.answers,
                })}
              >
                {aiRate(brand.mentions, brand.answers)}
                {brand.answers > 0 && (
                  <p className="text-xs text-muted-foreground">
                    {brand.mentions} {t("ai_visibility.details.of")}{" "}
                    {brand.answers}
                  </p>
                )}
              </TableCell>
              <TableCell
                className="tabular-nums"
                title={t("ai_visibility.details.value_of_value_answers", {
                  v1: brand.citations,
                  v2: brand.answers,
                })}
              >
                {aiRate(brand.citations, brand.answers)}
                {brand.answers > 0 && (
                  <p className="text-xs text-muted-foreground">
                    {brand.citations} {t("ai_visibility.details.of")}{" "}
                    {brand.answers}
                  </p>
                )}
              </TableCell>
            </TableRow>
          ))}
          {!summaries.length && (
            <TableRow>
              <TableCell colSpan={3} className="py-4 text-muted-foreground">
                {t("ai_visibility.details.no_brand_evidence_is_period_yet")}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {hiddenCount > 0 && (
        <div className="border-t px-4 py-2 border-border">
          <Button
            variant="link"
            size="xs"
            className="h-auto px-0 text-muted-foreground hover:text-foreground"
            onClick={() => setExpanded(true)}
          >
            {t("ai_visibility.details.show")} {hiddenCount}{" "}
            {t("ai_visibility.details.more")}
          </Button>
        </div>
      )}
    </div>
  );
}
