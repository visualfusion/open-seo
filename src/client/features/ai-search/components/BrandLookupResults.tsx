import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/client/components/ui/table";
import { Info, TriangleAlert } from "lucide-react";
import { Alert, AlertTitle } from "@/client/components/ui/alert";
import { Badge } from "@/client/components/ui/badge";
import { Card } from "@/client/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/client/components/ui/tooltip";
import { DomainLevelBadge } from "@/client/features/ai-search/components/DomainLevelBadge";
import { BrandLookupMentionTrendCard } from "@/client/features/ai-search/components/BrandLookupMentionTrendCard";
import { BrandLookupShareOfVoice } from "@/client/features/ai-search/components/BrandLookupShareOfVoice";
import { CitationTabsCard } from "@/client/features/ai-search/components/BrandLookupCitationsCard";
import {
  formatCount,
  formatPlatformLabel,
  PLATFORM_DOT_CLASS,
} from "@/client/features/ai-search/platformLabels";
import type { BrandLookupResult } from "@/types/schemas/ai-search";
import { RESEARCH_SCOPE_LABELS } from "@/shared/researchScope";
import { getTranslation, useLocale } from "@/client/lib/i18n";

type Props = {
  result: BrandLookupResult;
  projectId: string;
};

export function BrandLookupResults({ result, projectId }: Props) {
  const { t } = useLocale();
  if (!result.hasData) {
    const erroredPlatforms = result.perPlatform.filter(
      (p) => p.status === "error",
    );
    const allPlatformsErrored =
      erroredPlatforms.length === result.perPlatform.length &&
      result.perPlatform.length > 0;

    if (allPlatformsErrored) {
      return (
        <Alert variant="warning">
          <TriangleAlert aria-hidden />
          <AlertTitle className="font-normal">
            {t("brand_lookup.results.temp_unavailable_prefix")}
            <strong>{result.resolvedTarget}</strong>
            {t("brand_lookup.results.temp_unavailable_suffix")}
          </AlertTitle>
        </Alert>
      );
    }
    return (
      <div className="space-y-3">
        <Alert variant="info">
          <Info aria-hidden />
          <AlertTitle className="font-normal">
            {t("brand_lookup.results.no_mentions_prefix")}
            <strong>{result.resolvedTarget}</strong>.
          </AlertTitle>
        </Alert>
        {erroredPlatforms.length > 0 ? (
          <p className="text-xs text-muted-foreground">
            {t("brand_lookup.results.platform_unavailable_note", {
              platforms: erroredPlatforms
                .map((p) => formatPlatformLabel(p.platform))
                .join(", "),
            })}
          </p>
        ) : null}
      </div>
    );
  }

  const hasTrendData = result.monthlyVolume.length > 0;
  const sov = result.shareOfVoice;

  return (
    <Card className="gap-0 py-0">
      <BrandHeader result={result} />

      <div
        className={
          hasTrendData || sov
            ? "grid gap-3 px-4 pb-4 lg:grid-cols-2"
            : "px-4 pb-4"
        }
      >
        <StatsCard result={result} />
        {hasTrendData ? <MentionTrendCard result={result} /> : null}
        {sov ? (
          <BrandLookupShareOfVoice
            shareOfVoice={sov}
            isDomainLevel={result.aggregatesAreDomainLevel}
          />
        ) : null}
      </div>

      <div className="px-4 pb-4">
        <CitationTabsCard result={result} projectId={projectId} />
      </div>
    </Card>
  );
}

function BrandHeader({ result }: { result: BrandLookupResult }) {
  const { t } = useLocale();
  return (
    <section className="flex flex-wrap items-center justify-between gap-2 px-4 pt-4 pb-3">
      <div className="flex flex-wrap items-center gap-2">
        <h2 className="text-lg font-semibold break-all">
          {result.resolvedTarget}
        </h2>
        <Badge variant="secondary">{result.detectedTargetType}</Badge>
        {result.scope ? (
          <Badge variant="outline">{RESEARCH_SCOPE_LABELS[result.scope]}</Badge>
        ) : null}
      </div>
      <p className="ml-auto text-xs text-muted-foreground">
        {t("brand_lookup.results.updated_prefix")}
        {formatRelative(result.fetchedAt)}
      </p>
    </section>
  );
}

function StatsCard({ result }: { result: BrandLookupResult }) {
  const { t } = useLocale();
  const domainTip = t("brand_lookup.results.domain_level_tip");
  return (
    <div className="w-full max-w-xl rounded-lg border border-border p-3">
      {result.aggregatesAreDomainLevel && (
        <div className="mb-2">
          <DomainLevelBadge tooltip={domainTip} />
        </div>
      )}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("brand_lookup.results.platform_col")}</TableHead>
            <TableHead className="text-right">
              <span className="inline-flex items-center gap-1">
                {t("brand_lookup.results.mentions_col")}
                <InfoTooltip text={t("brand_lookup.results.mentions_tip")} />
              </span>
            </TableHead>
            <TableHead className="text-right">
              <span className="inline-flex items-center gap-1">
                {t("brand_lookup.results.ai_vol_col")}
                <InfoTooltip text={t("brand_lookup.results.ai_vol_tip")} />
              </span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow className="font-medium">
            <TableCell>{t("brand_lookup.results.total_row")}</TableCell>
            <TableCell className="text-right tabular-nums">
              {formatCount(result.totalMentions)}
            </TableCell>
            <TableCell className="text-right tabular-nums">
              {formatCount(result.totalAiSearchVolume)}
            </TableCell>
          </TableRow>
          {result.perPlatform.map((row) => (
            <TableRow key={row.platform}>
              <TableCell>
                <span className="inline-flex items-center gap-1.5">
                  <span
                    className={`size-1.5 rounded-full ${PLATFORM_DOT_CLASS[row.platform]}`}
                  />
                  {formatPlatformLabel(row.platform)}
                  {row.platform === "chat_gpt" && (
                    <InfoTooltip
                      text={t("brand_lookup.results.chatgpt_us_tip")}
                    />
                  )}
                  {row.status === "error" && (
                    <span className="text-destructive">
                      {t("brand_lookup.results.unavailable")}
                    </span>
                  )}
                </span>
              </TableCell>
              <TableCell className="text-right tabular-nums">
                {formatCount(row.status === "error" ? null : row.mentions)}
              </TableCell>
              <TableCell className="text-right tabular-nums">
                {formatCount(
                  row.status === "error" ? null : row.aiSearchVolume,
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function MentionTrendCard({ result }: { result: BrandLookupResult }) {
  const { t } = useLocale();
  return (
    <div className="rounded-lg border border-border">
      <div className="flex items-center justify-between gap-2 border-b border-border px-4 py-3">
        <h3 className="text-sm font-medium">
          {t("brand_lookup.results.trend_title")}
        </h3>
        {result.aggregatesAreDomainLevel ? (
          <DomainLevelBadge
            tooltip={t("brand_lookup.results.domain_level_tip")}
          />
        ) : null}
      </div>
      <div className="p-4">
        <BrandLookupMentionTrendCard result={result} />
      </div>
    </div>
  );
}

function InfoTooltip({ text }: { text: string }) {
  const { t } = useLocale();
  return (
    <Tooltip>
      <TooltipTrigger
        delay={150}
        aria-label={t("brand_lookup.results.more_info")}
        className="inline-flex rounded-sm text-muted-foreground/70 outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50"
      >
        <Info className="size-3" />
      </TooltipTrigger>
      <TooltipContent className="normal-case tracking-normal font-normal">
        {text}
      </TooltipContent>
    </Tooltip>
  );
}

function formatRelative(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime()))
    return getTranslation("brand_lookup.results.just_now");

  const diffMs = Date.now() - date.getTime();
  const diffMin = Math.floor(diffMs / 60_000);

  if (diffMin < 1) return getTranslation("brand_lookup.results.just_now");
  if (diffMin < 60)
    return getTranslation("brand_lookup.results.minutes_ago", undefined, {
      count: diffMin,
    });
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24)
    return getTranslation("brand_lookup.results.hours_ago", undefined, {
      count: diffHr,
    });
  const diffDay = Math.floor(diffHr / 24);
  return getTranslation("brand_lookup.results.days_ago", undefined, {
    count: diffDay,
  });
}
