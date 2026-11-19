import { getCurrentLocale, useLocale } from "@/client/lib/i18n";
import type { Dispatch, SetStateAction } from "react";
import { Checkbox } from "@/client/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/client/components/ui/table";
import { safeHttpUrl } from "@/shared/safe-url";
import type { SearchConsoleData } from "@/shared/mcp-contracts";

type Row = NonNullable<SearchConsoleData["rows"]>[number] & { index: number };

export function SearchConsoleTable({
  matching,
  dimensions,
  selected,
  setSelected,
  drill,
  busy,
  selectable,
}: {
  matching: Row[];
  dimensions: string[];
  selected: Set<number>;
  setSelected: Dispatch<SetStateAction<Set<number>>>;
  drill: (page: string) => void;
  busy: boolean;
  /** Rows can be picked to save or send to the assistant. */
  selectable: boolean;
}) {
  const { t } = useLocale();
  const queryIndex = dimensions.indexOf("query");
  const showSelection = selectable && queryIndex >= 0;
  const pageIndex = dimensions.indexOf("page");
  const number = new Intl.NumberFormat(getCurrentLocale());
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {showSelection && <TableHead className="w-8" />}
          <TableHead>{dimensions.join(" / ") || "Result"}</TableHead>
          <TableHead className="text-right">
            {t("search_performance.totals.impressions")}
          </TableHead>
          <TableHead className="text-right">
            {t("search_performance.totals.clicks")}
          </TableHead>
          <TableHead className="text-right">
            {t("search_performance.columns.ctr")}
          </TableHead>
          <TableHead className="text-right">{t("ranks.position")}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {matching.map((row) => (
          <TableRow
            key={row.index}
            data-state={selected.has(row.index) ? "selected" : undefined}
          >
            {showSelection && (
              <TableCell>
                <Checkbox
                  checked={selected.has(row.index)}
                  aria-label={t("widgets.details.select_value", {
                    v1: row.keys?.[queryIndex] ?? "",
                  })}
                  onCheckedChange={(checked) =>
                    setSelected((current) => {
                      const next = new Set(current);
                      if (checked) next.add(row.index);
                      else next.delete(row.index);
                      return next;
                    })
                  }
                />
              </TableCell>
            )}
            <TableCell className="min-w-40 max-w-72 break-words">
              {row.keys?.map((key, index) =>
                index === pageIndex && safeHttpUrl(key) ? (
                  <button
                    key={index}
                    className="block break-all text-left text-primary hover:underline"
                    disabled={busy}
                    onClick={() => drill(key)}
                  >
                    {key}
                  </button>
                ) : (
                  <span key={index} className="block">
                    {key}
                  </span>
                ),
              )}
            </TableCell>
            <TableCell className="text-right tabular-nums">
              {number.format(row.impressions)}
            </TableCell>
            <TableCell className="text-right tabular-nums">
              {number.format(row.clicks)}
            </TableCell>
            <TableCell className="text-right tabular-nums">
              {(row.ctr * 100).toFixed(1)}%
            </TableCell>
            <TableCell className="text-right tabular-nums">
              {row.position?.toFixed(1) ?? "—"}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
