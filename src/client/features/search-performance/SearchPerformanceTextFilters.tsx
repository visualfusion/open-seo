import { useMemo, useState } from "react";
import { RotateCcw } from "lucide-react";
import type { z } from "zod";
import { Badge } from "@/client/components/ui/badge";
import { Button } from "@/client/components/ui/button";
import { Input } from "@/client/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/client/components/ui/select";
import { useLocale } from "@/client/lib/i18n";
import type { searchPerformanceInputSchema } from "@/types/schemas/search-performance";

export type TextFilters = Pick<
  z.infer<typeof searchPerformanceInputSchema>,
  "pageFilter" | "queryFilter"
>;

export function SearchPerformanceTextFilters({
  value,
  showQuery,
  activeFilterCount,
  onApply,
  onReset,
}: {
  value: TextFilters;
  /** Discover and Google News have no queries to filter on. */
  showQuery: boolean;
  activeFilterCount: number;
  onApply: (filters: TextFilters) => void;
  onReset: () => void;
}) {
  const { t } = useLocale();

  const matchItems = useMemo(
    () => [
      {
        value: "contains",
        label: t("search_performance.filters.match_contains"),
      },
      {
        value: "equals",
        label: t("search_performance.filters.match_equals"),
      },
    ],
    [t],
  );

  const [page, setPage] = useState(value.pageFilter?.expression ?? "");
  const [query, setQuery] = useState(value.queryFilter?.expression ?? "");
  const [pageOperator, setPageOperator] = useState<"contains" | "equals">(
    value.pageFilter?.operator ?? "contains",
  );
  const [queryOperator, setQueryOperator] = useState<"contains" | "equals">(
    value.queryFilter?.operator ?? "contains",
  );
  const dirtyCount =
    Number(
      page.trim() !== (value.pageFilter?.expression ?? "") ||
        pageOperator !== (value.pageFilter?.operator ?? "contains"),
    ) +
    Number(
      query.trim() !== (value.queryFilter?.expression ?? "") ||
        queryOperator !== (value.queryFilter?.operator ?? "contains"),
    );
  const cancel = () => {
    setPage(value.pageFilter?.expression ?? "");
    setQuery(value.queryFilter?.expression ?? "");
    setPageOperator(value.pageFilter?.operator ?? "contains");
    setQueryOperator(value.queryFilter?.operator ?? "contains");
  };
  return (
    <form
      id="search-performance-filters"
      className="space-y-3 border-b border-border bg-muted/20 px-4 py-3"
      onSubmit={(event) => {
        event.preventDefault();
        setPage(page.trim());
        setQuery(query.trim());
        if (!page.trim()) setPageOperator("contains");
        if (!query.trim()) setQueryOperator("contains");
        onApply({
          pageFilter: page.trim()
            ? { operator: pageOperator, expression: page.trim() }
            : undefined,
          queryFilter: query.trim()
            ? { operator: queryOperator, expression: query.trim() }
            : undefined,
        });
      }}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold">
            {t("search_performance.filters.refine")}
          </p>
          {activeFilterCount > 0 ? (
            <Badge size="sm">
              {t("search_performance.filters.active", {
                count: activeFilterCount,
              })}
            </Badge>
          ) : null}
          {dirtyCount > 0 ? (
            <Badge variant="warning" size="sm">
              {t("search_performance.filters.unapplied", {
                count: dirtyCount,
              })}
            </Badge>
          ) : null}
        </div>
        <Button
          type="button"
          variant="ghost"
          size="xs"
          disabled={activeFilterCount === 0 && dirtyCount === 0}
          onClick={() => {
            setPage("");
            setQuery("");
            setPageOperator("contains");
            setQueryOperator("contains");
            onReset();
          }}
        >
          <RotateCcw data-icon="inline-start" />
          {t("search_performance.filters.clear_all")}
        </Button>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <div className="space-y-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            {t("search_performance.filters.page_url")}
          </span>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Select
              items={matchItems}
              value={pageOperator}
              onValueChange={(operator) =>
                setPageOperator(operator === "equals" ? "equals" : "contains")
              }
            >
              <SelectTrigger
                size="sm"
                className="w-full sm:w-44 sm:shrink-0"
                aria-label={t("search_performance.filters.page_match_aria")}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {matchItems.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              className="h-7 w-full min-w-0 sm:flex-1"
              aria-label={t("search_performance.filters.page_url_filter_aria")}
              value={page}
              maxLength={4096}
              onChange={(event) => setPage(event.target.value)}
              placeholder={t("search_performance.filters.page_placeholder")}
            />
          </div>
        </div>
        <div className={showQuery ? "space-y-1.5" : "hidden"}>
          <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            {t("search_performance.filters.query")}
          </span>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Select
              items={matchItems}
              value={queryOperator}
              onValueChange={(operator) =>
                setQueryOperator(operator === "equals" ? "equals" : "contains")
              }
            >
              <SelectTrigger
                size="sm"
                className="w-full sm:w-44 sm:shrink-0"
                aria-label={t("search_performance.filters.query_match_aria")}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {matchItems.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              className="h-7 w-full min-w-0 sm:flex-1"
              aria-label={t("search_performance.filters.query_filter_aria")}
              value={query}
              maxLength={4096}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t("search_performance.filters.query_placeholder")}
            />
          </div>
        </div>
      </div>
      <p className="text-xs text-muted-foreground">
        {t("search_performance.filters.help")}
      </p>
      <div className="flex items-center justify-end gap-2 pt-1">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={cancel}
          disabled={dirtyCount === 0}
        >
          {t("search_performance.filters.cancel")}
        </Button>
        <Button size="sm" type="submit" disabled={dirtyCount === 0}>
          {t("search_performance.filters.apply")}
          {dirtyCount > 0 ? (
            <Badge variant="secondary" size="sm" className="ml-1">
              {dirtyCount}
            </Badge>
          ) : null}
        </Button>
      </div>
    </form>
  );
}
