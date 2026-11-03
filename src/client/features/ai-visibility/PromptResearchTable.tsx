import { getTranslation, useLocale } from "@/client/lib/i18n";
import { useMemo, type ComponentProps } from "react";
import type {
  ColumnDef,
  OnChangeFn,
  RowSelectionState,
} from "@tanstack/react-table";
import { ChevronDown, ChevronRight } from "lucide-react";
import { SafeExternalLink } from "@/client/components/SafeExternalLink";
import {
  DataTable,
  type DataTableFrameProps,
  makeSelectionColumn,
  useDataTable,
  useSelectionAnchor,
} from "@/client/components/table/DataTable";
import { Badge } from "@/client/components/ui/badge";
import { Button } from "@/client/components/ui/button";
import type { AiResearchedPrompt } from "@/shared/ai-visibility";
import { DomainFavicon } from "./DomainFavicon";

const promptColumns: ColumnDef<AiResearchedPrompt>[] = [
  {
    id: "prompt",
    header: () => getTranslation("ai_visibility.details.prompt"),
    cell: ({ row: { original: prompt } }) => (
      <>
        <span>{prompt.text}</span>
        {prompt.tracked && (
          <Badge variant="secondary" className="ml-2">
            {getTranslation("ai_visibility.details.tracked")}
          </Badge>
        )}
        {prompt.variants.length > 0 && (
          <p
            className="text-xs text-muted-foreground"
            title={prompt.variants.join("\n")}
          >
            +
            {getTranslation(
              "ai_visibility.details.similar_prompts",
              undefined,
              { count: prompt.variants.length },
            )}
          </p>
        )}
      </>
    ),
  },
  {
    id: "sources",
    header: () => getTranslation("ai_visibility.details.sources"),
    meta: { headerClassName: "w-40" },
    cell: ({ row: { original: prompt } }) => (
      <>
        <span className="text-sm">
          {prompt.sources.length
            ? getTranslation(
                prompt.sources.length === 1
                  ? "ai_visibility.details.source_count"
                  : "ai_visibility.details.sources_count",
                undefined,
                { count: prompt.sources.length },
              )
            : getTranslation("ai_visibility.details.no_sources")}
        </span>
        {prompt.ownDomainCited && (
          <Badge variant="success" size="sm" className="ml-2">
            {getTranslation("ai_visibility.badge_you")}
          </Badge>
        )}
      </>
    ),
  },
  {
    id: "expand",
    header: () => (
      <span className="sr-only">
        {getTranslation("ai_visibility.details.details")}
      </span>
    ),
    meta: { headerClassName: "w-10" },
    cell: ({ row }) => (
      <Button
        variant="ghost"
        size="icon-sm"
        aria-expanded={row.getIsExpanded()}
        aria-label={getTranslation(
          "ai_visibility.details.show_sources",
          undefined,
          { prompt: row.original.text },
        )}
        onClick={() => row.toggleExpanded()}
      >
        {row.getIsExpanded() ? <ChevronDown /> : <ChevronRight />}
      </Button>
    ),
  },
];

/** Tracked prompts can't be selected; a selection only adds new prompts. */
export function PromptResearchTable({
  prompts,
  rowSelection,
  onRowSelectionChange,
  empty,
  ...frame
}: DataTableFrameProps & {
  prompts: AiResearchedPrompt[];
  rowSelection: RowSelectionState;
  onRowSelectionChange: OnChangeFn<RowSelectionState>;
  empty: ComponentProps<typeof DataTable>["empty"];
}) {
  const { t } = useLocale();
  const selectAnchorRef = useSelectionAnchor();
  const columns = useMemo(
    () => [
      makeSelectionColumn<AiResearchedPrompt>(selectAnchorRef, (row) =>
        t("ai_visibility.details.select_prompt", { prompt: row.original.text }),
      ),
      ...promptColumns,
    ],
    [selectAnchorRef, t],
  );
  const table = useDataTable({
    data: prompts,
    columns,
    state: { rowSelection },
    onRowSelectionChange,
    getRowId: (prompt) => prompt.text,
    enableRowSelection: (row) => !row.original.tracked,
  });
  return (
    <DataTable
      {...frame}
      table={table}
      empty={empty}
      renderExpandedRow={(row) => <PromptSources prompt={row.original} />}
    />
  );
}

function PromptSources({ prompt }: { prompt: AiResearchedPrompt }) {
  const { t } = useLocale();
  return (
    <div className="space-y-2 py-1 pl-10">
      <Badge variant={prompt.brandMentioned ? "success" : "outline"}>
        {prompt.brandMentioned
          ? t("ai_visibility.details.your_brand_is_mentioned")
          : t("ai_visibility.details.your_brand_is_not_mentioned")}
      </Badge>
      {prompt.sources.length ? (
        <ul className="space-y-1.5">
          {prompt.sources.map((source) => (
            <li key={source.url} className="flex items-center gap-2 text-sm">
              <DomainFavicon domain={source.domain} />
              <span className="w-40 shrink-0 truncate text-muted-foreground">
                {source.domain}
              </span>
              <SafeExternalLink
                url={source.url}
                label={source.title ?? source.url}
                className="inline-flex min-w-0 items-center gap-1 hover:underline"
              />
              {source.own && (
                <Badge variant="success" size="sm">
                  {t("ai_visibility.badge_you")}
                </Badge>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted-foreground">
          {t("ai_visibility.details.the_ai_answered_from_no_sources")}
        </p>
      )}
    </div>
  );
}
