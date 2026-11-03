import { getTranslation, useLocale } from "@/client/lib/i18n";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { getAiVisibilityResults } from "@/serverFunctions/ai-visibility";
import type { AiEngine, AiTrackerState } from "@/shared/ai-visibility";
import { SkeletonTableRows } from "@/client/components/SkeletonPresets";
import { DataTableToolbar } from "@/client/components/table/DataTableToolbar";
import { Badge } from "@/client/components/ui/badge";
import { Button } from "@/client/components/ui/button";
import { EngineFilter } from "./EngineFilter";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/client/components/ui/table";
import { DomainFavicon } from "./DomainFavicon";
import { SuggestedCompetitors } from "./SuggestedCompetitors";
import { AiQueryError, aiVisibilityKey } from "./shared";

export function CompetitorsTab({
  projectId,
  state,
  runId,
  collecting,
}: {
  projectId: string;
  state: AiTrackerState;
  runId: string | undefined;
  collecting: boolean;
}) {
  const { t } = useLocale();
  const [selectedEngines, setSelectedEngines] = useState<AiEngine[] | null>(
    null,
  );
  const engines = selectedEngines ?? state.engines;
  const query = useQuery({
    queryKey: [
      ...aiVisibilityKey(projectId),
      "results",
      "competitors",
      runId,
      engines,
    ],
    queryFn: () =>
      getAiVisibilityResults({
        data: { projectId, runId, engines, limit: 1 },
      }),
    enabled: Boolean(runId),
  });
  const rows = runId
    ? (query.data?.summaries ?? []).map((summary) => ({ ...summary, summary }))
    : state.brands
        .filter((brand) => !brand.own)
        .map((brand) => ({ ...brand, summary: null }));
  return (
    <>
      <DataTableToolbar
        actions={
          <Button
            size="sm"
            variant="outline"
            nativeButton={false}
            render={<Link to="/p/$projectId/context" params={{ projectId }} />}
          >
            {t("ai_visibility.manage_competitors")}
          </Button>
        }
      >
        {runId && state.engines.length > 1 && (
          <EngineFilter
            label={t("ai_visibility.filter_engine")}
            engines={state.engines}
            value={engines}
            onChange={setSelectedEngines}
          />
        )}
      </DataTableToolbar>
      {runId && query.isPending ? (
        <SkeletonTableRows rows={4} columns={4} className="p-4" />
      ) : query.isError ? (
        <AiQueryError error={query.error} />
      ) : runId && !rows.length ? (
        <p className="p-10 text-center text-sm text-muted-foreground">
          {collecting
            ? t("ai_visibility.collecting_competitors")
            : t("ai_visibility.no_competitors_match")}
        </p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("ai_visibility.col_brand")}</TableHead>
              <TableHead>{t("ai_visibility.col_mentioned_in")}</TableHead>
              <TableHead>{t("ai_visibility.col_cited_in")}</TableHead>
              <TableHead>{t("ai_visibility.col_avg_position")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map(({ name, domain, own, summary }) => (
              <TableRow key={domain}>
                <TableCell>
                  <span className="flex items-center gap-2">
                    <DomainFavicon domain={domain} />
                    {name}
                    {own && (
                      <Badge variant="secondary" className="ml-2">
                        {t("ai_visibility.badge_you")}
                      </Badge>
                    )}
                  </span>
                </TableCell>
                <TableCell>
                  {summary ? share(summary.mentions, summary.answers) : "—"}
                </TableCell>
                <TableCell>
                  {summary ? share(summary.citations, summary.answers) : "—"}
                </TableCell>
                <TableCell>
                  {summary?.positionCount
                    ? (summary.positionTotal / summary.positionCount).toFixed(1)
                    : "—"}
                </TableCell>
              </TableRow>
            ))}
            {!rows.length && (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="py-8 text-center text-muted-foreground"
                >
                  {t("ai_visibility.details.no_competitors_saved_yet_add_them")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
      {!runId && (
        <p className="border-t border-border p-4 text-sm text-muted-foreground">
          {t("ai_visibility.details.run")}{" "}
          <Link
            to="/p/$projectId/ai-visibility"
            params={{ projectId }}
            className="text-foreground underline underline-offset-4"
          >
            {t("ai_visibility.details.prompt_tracking")}
          </Link>{" "}
          {t("ai_visibility.details.to_see_how_often_cite_your")}
        </p>
      )}
      {runId && (
        <SuggestedCompetitors
          projectId={projectId}
          state={state}
          runId={runId}
        />
      )}
    </>
  );
}

function share(count: number, total: number) {
  return total
    ? `${count} / ${total} (${Math.round((count / total) * 100)}%)`
    : getTranslation("ai_visibility.details.no_answers");
}
