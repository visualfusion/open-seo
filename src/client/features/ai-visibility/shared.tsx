import { getCurrentLocale, getTranslation, useLocale } from "@/client/lib/i18n";
import { useEffect, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { queryOptions, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { QueryError } from "@/client/components/QueryState";
import { Spinner } from "@/client/components/Spinner";
import { Badge } from "@/client/components/ui/badge";
import { Button } from "@/client/components/ui/button";
import { Progress } from "@/client/components/ui/progress";
import {
  getAiResearchSetup,
  getAiVisibilityRun,
  getAiVisibilityTracker,
  getAiVisibilityTrend,
  getAiVisibilityResults,
  listAiResearchKeywords,
} from "@/serverFunctions/ai-visibility";
import type {
  AiRun,
  AiTrackerState,
  AiEngine,
  AiObservationStatus,
} from "@/shared/ai-visibility";

export const aiVisibilityKey = (projectId: string) => [
  "aiVisibility",
  projectId,
];

const isRunPending = (run: AiRun | null | undefined) =>
  run?.status === "running" || run?.status === "queued";

export const aiTrackerQueryOptions = (projectId: string) =>
  queryOptions({
    queryKey: [...aiVisibilityKey(projectId), "tracker"],
    queryFn: async ({ client, queryKey }) => {
      const before = client.getQueryData<AiTrackerState>(queryKey);
      const state = await getAiVisibilityTracker({ data: { projectId } });
      // Answers, trend and sources read while a run was collecting are
      // incomplete, wherever they were read (a hover preload, another tab), so
      // the read that first sees the run finish refreshes them.
      const finished = state.recentRuns.some(
        (run) =>
          !isRunPending(run) &&
          before?.recentRuns.some(
            (prior) => prior.id === run.id && isRunPending(prior),
          ),
      );
      if (finished) {
        void client.invalidateQueries({
          queryKey: [...aiVisibilityKey(projectId), "results"],
        });
        void client.invalidateQueries({
          queryKey: [...aiVisibilityKey(projectId), "sources"],
        });
      }
      return state;
    },
    // Fresh enough that a page mounting right after its loader read it, or
    // after a hover preload, does not read it again.
    staleTime: 10_000,
  });

export const aiResearchSetupQueryOptions = (projectId: string) =>
  queryOptions({
    queryKey: [...aiVisibilityKey(projectId), "researchSetup"],
    queryFn: () => getAiResearchSetup({ data: { projectId } }),
    refetchInterval: (query) =>
      query.state.data?.status === "running" ? 3000 : false,
  });

export const aiResearchKeywordsQueryOptions = (projectId: string) =>
  queryOptions({
    queryKey: [...aiVisibilityKey(projectId), "researchKeywords"],
    queryFn: () => listAiResearchKeywords({ data: { projectId } }),
  });

export type AiTrendDays = 7 | 28 | 90;

export const aiTrendQueryOptions = (projectId: string, days: AiTrendDays) =>
  queryOptions({
    queryKey: [...aiVisibilityKey(projectId), "results", "trend", days],
    queryFn: () => getAiVisibilityTrend({ data: { projectId, days } }),
  });

/** Every answer in a run, so each prompt can show its per-engine result. */
export const aiRunResultsQueryOptions = (
  projectId: string,
  runId: string | undefined,
) =>
  queryOptions({
    queryKey: [...aiVisibilityKey(projectId), "results", "all", runId],
    queryFn: async () => {
      const result = await getAiVisibilityResults({
        data: { projectId, runId, branded: "all" },
      });
      return result.rows;
    },
    enabled: Boolean(runId),
  });

export const aiPromptHistoryQueryOptions = (
  projectId: string,
  promptId: string,
) =>
  queryOptions({
    queryKey: [...aiVisibilityKey(projectId), "results", "history", promptId],
    // Read every answer of the latest 50 runs so engine ordering cannot hide
    // a newer execution from the selector.
    queryFn: () =>
      getAiVisibilityResults({
        data: { projectId, promptId, includeHistory: true, branded: "all" },
      }),
  });

export function useAiVisibilityTracker(projectId: string) {
  return useQuery(aiTrackerQueryOptions(projectId));
}

export function useAiRunProgress(projectId: string, initialRun: AiRun | null) {
  const queryClient = useQueryClient();
  const runId = initialRun?.id;
  const query = useQuery({
    queryKey: [...aiVisibilityKey(projectId), "run", runId],
    queryFn: () => getAiVisibilityRun({ data: { projectId, runId: runId! } }),
    enabled: Boolean(runId),
    initialData: initialRun ?? undefined,
    // A finished run never changes, so only an unfinished one is read again.
    staleTime: (current) => (isRunPending(current.state.data) ? 0 : Infinity),
    refetchInterval: (current) => {
      const run = current.state.data;
      return run && isRunPending(run)
        ? Math.max(4, run.pollAfterSeconds) * 1000
        : false;
    },
  });
  const run = query.data ?? initialRun;
  const previous = useRef(run);
  // Refresh what an unfinished run writes as its answers arrive. Once it
  // finishes, re-read the tracker, which sees the finish and refreshes the
  // answers itself. Polls that bring nothing new keep the same run object, and
  // a run that was already finished when the page opened changes nothing, so
  // neither reads anything again.
  useEffect(() => {
    const before = previous.current;
    previous.current = run;
    if (run === before || run?.id !== before?.id || !isRunPending(before))
      return;
    if (!isRunPending(run)) {
      void queryClient.invalidateQueries({
        queryKey: [...aiVisibilityKey(projectId), "tracker"],
      });
      return;
    }
    void queryClient.invalidateQueries({
      queryKey: [...aiVisibilityKey(projectId), "results"],
    });
    void queryClient.invalidateQueries({
      queryKey: [...aiVisibilityKey(projectId), "sources"],
    });
  }, [projectId, queryClient, run]);
  return { run, error: query.error };
}

export function AiQueryError({
  error,
  retry,
}: {
  error: unknown;
  retry?: () => void;
}) {
  const { t } = useLocale();
  return (
    <QueryError
      error={error}
      fallback={t("ai_visibility.details.could_not_load_ai_try_again")}
      onRetry={retry}
    />
  );
}

export function AiLoading() {
  const { t } = useLocale();
  return (
    <div className="flex justify-center py-12">
      <Spinner
        size="sm"
        label={t("ai_visibility.details.loading_ai_visibility")}
      />
    </div>
  );
}

export function AiMatchBadge({
  value,
  positive = "Mentioned",
}: {
  value: boolean;
  positive?: "Mentioned" | "Cited";
}) {
  const { t } = useLocale();
  return (
    <Badge variant={value ? "success" : "secondary"}>
      {value
        ? t(
            positive === "Cited"
              ? "ui.ai_visibility_ext.answer_view.cited"
              : "ui.ai_visibility_ext.answer_view.mentioned",
          )
        : positive === "Cited"
          ? t("ui.ai_visibility_ext.answer_view.not_cited")
          : t("ui.ai_visibility_ext.answer_view.not_mentioned")}
    </Badge>
  );
}

export function aiDate(value: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? getTranslation("ui.details.not_available")
    : date.toLocaleString(getCurrentLocale());
}

export function aiRate(count: number, eligible: number) {
  return eligible ? `${Math.round((count / eligible) * 100)}%` : "—";
}

export function aiMoney(value: number) {
  return new Intl.NumberFormat(getCurrentLocale(), {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: value > 0 && value < 1 ? 4 : 2,
  }).format(value);
}

export function AiRunStatus({ run }: { run: AiRun }) {
  const { t } = useLocale();
  const pending = run.status === "running" || run.status === "queued";
  return (
    <div
      className="space-y-2 rounded-lg border bg-card px-4 py-3 border-border"
      aria-live="polite"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
        <span className="flex items-center gap-2 font-medium">
          {pending && <Loader2 className="size-4 animate-spin" />}
          {run.trigger === "manual"
            ? t("ai_visibility.details.one_off_run")
            : run.trigger === "baseline"
              ? t("ai_visibility.details.first_scheduled_run")
              : t("ai_visibility.details.scheduled_run")}
          <Badge variant="secondary">{run.status}</Badge>
        </span>
        <span className="text-xs text-muted-foreground">
          {aiDate(run.createdAt)}
        </span>
      </div>
      <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted-foreground">
        <span>
          {run.completed} {t("ai_visibility.details.of")} {run.expected}{" "}
          {t("ai_visibility.details.answers_collected")}
        </span>
        {run.pending > 0 && (
          <span>
            {run.pending} {t("ai_visibility.details.pending")}
          </span>
        )}
        {run.failed > 0 && (
          <span className="text-destructive">
            {run.failed} {t("ai_visibility.details.failed")}
          </span>
        )}
      </div>
      {pending && (
        <Progress value={run.completed + run.failed} max={run.expected || 1} />
      )}
    </div>
  );
}

/** The paid-plan gate's way out on AI pages: tracking needs only credits. */
export function PromptTrackingWithoutUpgradeButton({
  projectId,
}: {
  projectId: string;
}) {
  const { t } = useLocale();
  return (
    <Button
      size="lg"
      variant="outline"
      nativeButton={false}
      render={<Link to="/p/$projectId/ai-visibility" params={{ projectId }} />}
    >
      {t("ai_visibility.details.use_prompt_tracking_without_upgrading")}
    </Button>
  );
}

export function aiObservationStatusLabel(status: AiObservationStatus) {
  return getTranslation("ai_visibility.details.observation_" + status);
}
export function aiNoAnswerLabel(engine: AiEngine) {
  return getTranslation(
    engine === "google_ai_overview"
      ? "ai_visibility.details.no_overview"
      : "ai_visibility.details.no_answer",
  );
}
