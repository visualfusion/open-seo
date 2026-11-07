import { AlertCircle } from "lucide-react";
import { BackButton } from "@/client/components/PageHeader";
import { useQuery } from "@tanstack/react-query";
import { QueryError, QueryState } from "@/client/components/QueryState";
import { SkeletonPage } from "@/client/components/SkeletonPresets";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/client/components/ui/alert";
import { Badge } from "@/client/components/ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/client/components/ui/card";
import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from "@/client/components/ui/progress";
import { Spinner } from "@/client/components/ui/spinner";
import {
  getAuditSummary,
  getAuditStatus,
  getCrawlProgress,
} from "@/serverFunctions/audit";
import { useLocale } from "@/client/lib/i18n";
import { ResultsView } from "@/client/features/audit/results/ResultsView";
import {
  BotProtectionAdvice,
  extractHostname,
  extractPathname,
  formatStartedAt,
  HttpStatusBadge,
  StatusBadge,
} from "@/client/features/audit/shared";
import { SUPPORT_EMAIL } from "@/client/lib/support";

export function AuditDetail({
  projectId,
  auditId,
  tab,
  onBack,
  onTabChange,
}: {
  projectId: string;
  auditId: string;
  tab: string;
  onBack: () => void;
  onTabChange: (tab: "issues" | "pages" | "performance") => void;
}) {
  const { t, locale } = useLocale();
  const statusQuery = useQuery({
    queryKey: ["audit-status", projectId, auditId],
    queryFn: () => getAuditStatus({ data: { projectId, auditId } }),
    refetchInterval: (query) => {
      const data = query.state.data;
      return data?.status === "running" ? 3000 : false;
    },
  });

  const isComplete = statusQuery.data?.status === "completed";
  const isFailed = statusQuery.data?.status === "failed";
  const isRunning = statusQuery.data?.status === "running";

  // Failed audits keep whatever pages were crawled before the failure
  // (persistence is per-batch), so fetch results for them too and show the
  // partial crawl instead of a dead end.
  const resultsQuery = useQuery({
    queryKey: ["audit-results", projectId, auditId],
    queryFn: () => getAuditSummary({ data: { projectId, auditId } }),
    enabled: isComplete || isFailed,
  });

  // isPending (not isLoading) also covers a fetch paused while offline, so
  // past these two returns the status is always loaded.
  if (statusQuery.isPending) {
    return <SkeletonPage />;
  }

  if (statusQuery.isError) {
    return (
      <div className="px-4 py-4 md:px-6 md:py-6">
        <div className="mx-auto max-w-7xl space-y-4">
          <BackButton onClick={onBack}>{t("audit.all_audits")}</BackButton>
          <QueryError
            fallback={t("audit.load_error_fallback")}
            onRetry={() => void statusQuery.refetch()}
            isRetrying={statusQuery.isFetching}
          />
        </div>
      </div>
    );
  }

  const status = statusQuery.data;
  const partialPageCount = isFailed ? (resultsQuery.data?.pageCount ?? 0) : 0;
  const failedWithResults = isFailed && partialPageCount > 0;
  // Wait for the results fetch before choosing between the "partial results"
  // banner and the zero-page banner, so the zero-page banner doesn't flash.
  const failedWithoutResults =
    isFailed && resultsQuery.isSuccess && !failedWithResults;
  const results = resultsQuery.data;
  // A completed crawl that reached one page or none was blocked by the site,
  // unless that page is an app shell or was rate limited, which the results
  // explain instead. A failed audit stopped on our side, so it gets the error
  // code instead.
  const siteBlocked =
    isComplete &&
    status.pagesCrawled <= 1 &&
    results !== undefined &&
    !results.issueGroups.some(
      (group) => group.issueType === "javascript-rendering-suspected",
    ) &&
    results.fetchClassCounts.rate_limited === 0;

  const supportLink = <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>;
  const renderSupportDesc = (template: string) => {
    const parts = template.split("{email}");
    return (
      <p>
        {parts[0]}
        {supportLink}
        {parts[1] || null}
      </p>
    );
  };

  return (
    <div className="px-4 py-4 md:px-6 md:py-6 pb-24 md:pb-8 overflow-auto">
      <div className="mx-auto max-w-7xl space-y-4">
        <div className="space-y-3">
          <BackButton onClick={onBack}>{t("audit.all_audits")}</BackButton>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <h1 className="text-2xl font-semibold tracking-tight">
                {extractHostname(status.startUrl)}
              </h1>
              {!isRunning && <StatusBadge status={status.status} />}
            </div>
            <p className="text-sm text-muted-foreground">
              {t("audit.started_at", {
                time: formatStartedAt(status.startedAt, locale),
              })}
            </p>
          </div>
        </div>

        {isRunning && (
          <ProgressCard
            projectId={projectId}
            auditId={auditId}
            status={status}
          />
        )}

        {failedWithoutResults && (
          <Alert variant="destructive">
            <AlertCircle />
            <AlertTitle>{t("audit.failed_zero_pages_title")}</AlertTitle>
            <AlertDescription>
              {renderSupportDesc(
                t("audit.failed_try_again", { email: "{email}" }),
              )}
              {status.errorCode ? (
                <p className="font-mono text-xs">
                  {t("audit.code", { code: status.errorCode })}
                </p>
              ) : null}
            </AlertDescription>
          </Alert>
        )}

        {siteBlocked && results && (
          <Alert variant="warning">
            <AlertCircle />
            <AlertTitle>{t("audit.blocked_title")}</AlertTitle>
            <AlertDescription>
              <BotProtectionAdvice
                projectId={projectId}
                rendered={results.audit.config.renderJavaScript === true}
              />
            </AlertDescription>
          </Alert>
        )}

        {failedWithResults && (
          <Alert variant="warning">
            <AlertCircle />
            <AlertTitle>
              {t("audit.stopped_early_title", {
                count: String(partialPageCount),
                pages:
                  partialPageCount === 1
                    ? t("audit.page_singular")
                    : t("audit.page_plural"),
              })}
            </AlertTitle>
            <AlertDescription>
              {renderSupportDesc(
                t("audit.stopped_early_desc", { email: "{email}" }),
              )}
            </AlertDescription>
          </Alert>
        )}

        {(isComplete || isFailed) && (
          <QueryState
            query={resultsQuery}
            errorFallback={t("audit.failed_to_load_results")}
          >
            {(data) =>
              (isComplete || failedWithResults) && (
                <ResultsView
                  projectId={projectId}
                  data={data}
                  tab={tab}
                  onTabChange={onTabChange}
                  siteBlocked={siteBlocked}
                />
              )
            }
          </QueryState>
        )}
      </div>
    </div>
  );
}

function ProgressCard({
  projectId,
  auditId,
  status,
}: {
  projectId: string;
  auditId: string;
  status: {
    pagesCrawled: number;
    pagesTotal: number;
    lighthouseTotal: number;
    lighthouseCompleted: number;
    lighthouseFailed: number;
    currentPhase: string | null;
  };
}) {
  const { t, locale } = useLocale();
  const crawlProgress =
    status.pagesTotal > 0
      ? Math.round((status.pagesCrawled / status.pagesTotal) * 100)
      : 0;
  const lighthouseDone = status.lighthouseCompleted + status.lighthouseFailed;
  const lighthouseProgress =
    status.lighthouseTotal > 0
      ? Math.round((lighthouseDone / status.lighthouseTotal) * 100)
      : 0;
  const isLighthousePhase = status.currentPhase === "lighthouse";
  const phaseLabel =
    status.currentPhase === "discovery"
      ? t("audit.phases.discovery")
      : status.currentPhase === "crawling"
        ? t("audit.phases.crawling")
        : status.currentPhase === "lighthouse"
          ? t("audit.phases.lighthouse")
          : status.currentPhase === "finalizing"
            ? t("audit.phases.finalizing")
            : t("audit.phases.running");
  const progress = isLighthousePhase ? lighthouseProgress : crawlProgress;

  const crawlProgressQuery = useQuery({
    queryKey: ["audit-crawl-progress", projectId, auditId],
    queryFn: () => getCrawlProgress({ data: { projectId, auditId } }),
    refetchInterval: 1500,
  });

  const crawledUrls = crawlProgressQuery.data ?? [];

  return (
    <div className="space-y-3">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-medium">
            <Spinner className="text-primary" aria-hidden />
            {isLighthousePhase
              ? t("audit.running_lighthouse")
              : t("audit.crawling_pages")}
          </CardTitle>
          <CardAction>
            <Badge variant="secondary">{phaseLabel}</Badge>
          </CardAction>
        </CardHeader>
        <CardContent>
          <Progress value={progress}>
            <ProgressLabel className="font-normal">
              {isLighthousePhase
                ? `${t("audit.lighthouse_progress", {
                    done: String(lighthouseDone),
                    total: String(status.lighthouseTotal),
                  })}${
                    status.lighthouseFailed > 0
                      ? ` ${t("audit.lighthouse_failed", {
                          count: String(status.lighthouseFailed),
                        })}`
                      : ""
                  }`
                : t("audit.crawl_progress", {
                    crawled: String(status.pagesCrawled),
                    total: String(status.pagesTotal),
                  })}
            </ProgressLabel>
            <ProgressValue />
          </Progress>
        </CardContent>
      </Card>

      {crawledUrls.length > 0 && (
        <Card size="sm">
          <CardHeader>
            <CardTitle className="font-medium text-muted-foreground">
              {t("audit.crawled_pages_count", {
                count: String(crawledUrls.length),
              })}
            </CardTitle>
            <CardAction className="text-xs text-muted-foreground">
              {t("audit.updated_at", {
                time: new Date(crawledUrls[0].crawledAt).toLocaleTimeString(
                  locale === "de" ? "de-DE" : "en-US",
                ),
              })}
            </CardAction>
          </CardHeader>
          <CardContent className="max-h-[400px] overflow-y-auto">
            {crawledUrls.map((entry, i) => (
              <ProgressRow
                key={`${entry.url}-${entry.crawledAt}`}
                entry={entry}
                index={i}
              />
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function ProgressRow({
  entry,
  index,
}: {
  entry: {
    url: string;
    statusCode: number | null;
    title: string | null;
    crawledAt: number;
  };
  index: number;
}) {
  const pathname = extractPathname(entry.url);

  return (
    <div
      className={`flex items-center justify-between gap-3 px-2 py-1.5 rounded text-sm ${
        index === 0
          ? "bg-primary/5 animate-in fade-in slide-in-from-top-1 duration-300"
          : ""
      }`}
    >
      <div className="flex items-center gap-2 min-w-0 flex-1">
        <HttpStatusBadge code={entry.statusCode} />
        <span className="truncate text-foreground/80" title={entry.url}>
          {pathname}
        </span>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        {entry.title && (
          <span
            className="text-xs text-muted-foreground truncate max-w-[260px] hidden md:block"
            title={entry.title}
          >
            {entry.title}
          </span>
        )}
      </div>
    </div>
  );
}
