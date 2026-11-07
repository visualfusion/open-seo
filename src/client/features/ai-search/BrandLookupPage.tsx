import { useMemo, useState, type FormEvent } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { BarChart3, Quote, Sparkles, TrendingUp } from "lucide-react";
import { lookupBrand } from "@/serverFunctions/ai-search";
import { useHostedPlanGate } from "@/client/features/billing/HostedPlanGate";
import { ResearchPageShell } from "@/client/features/ai-search/ResearchPageShell";
import { PromptTrackingWithoutUpgradeButton } from "@/client/features/ai-visibility/shared";
import { BrandLookupResults } from "@/client/features/ai-search/components/BrandLookupResults";
import { BrandLookupSearchCard } from "@/client/features/ai-search/components/BrandLookupSearchCard";
import { RecentSearches } from "@/client/components/RecentSearches";
import { BackLink } from "@/client/components/PageHeader";
import { Badge } from "@/client/components/ui/badge";
import { useBrandLookupSearchHistory } from "@/client/hooks/useBrandLookupSearchHistory";
import {
  BRAND_LOOKUP_MAX_INPUT_LENGTH,
  parseCompetitorList,
} from "@/types/schemas/ai-search";
import { detectTarget } from "@/shared/targetDetection";
import {
  parseResearchTarget,
  RESEARCH_SCOPE_LABELS,
  toScopeSearchParam,
  type ResearchScope,
} from "@/shared/researchScope";
import { useLocale } from "@/client/lib/i18n";

type Props = {
  projectId: string;
  initialQuery: string;
  initialCompetitors: string[];
  initialScope: ResearchScope | undefined;
  onSearchChange: (
    nextQuery: string,
    nextCompetitors: string[],
    nextScope: ResearchScope | undefined,
  ) => void;
};

export function BrandLookupPage({
  projectId,
  initialQuery,
  initialCompetitors,
  initialScope,
  onSearchChange,
}: Props) {
  const { t } = useLocale();
  const planStatus = useHostedPlanGate();
  const [query, setQuery] = useState(initialQuery);
  const [scopeChoice, setScopeChoice] = useState<ResearchScope | undefined>(
    initialScope,
  );
  const [competitorsInput, setCompetitorsInput] = useState(
    initialCompetitors.join(", "),
  );
  const [validationError, setValidationError] = useState<{
    field: "query" | "competitors";
    message: string;
  } | null>(null);

  const trimmedInitialQuery = initialQuery.trim();
  const hasActiveQuery = trimmedInitialQuery.length > 0;
  const competitorKey = initialCompetitors.join(",");

  const scopeTarget = useMemo(() => {
    if (detectTarget(query).type !== "domain") return null;
    const parsed = parseResearchTarget(query);
    return parsed.ok ? parsed.target : null;
  }, [query]);

  const selectedScope = scopeChoice ?? scopeTarget?.scope ?? "domain";
  const scopeDisabledReason =
    query.trim() !== "" && !scopeTarget
      ? t("brand_lookup.scope_reason")
      : undefined;

  const lookupQuery = useQuery({
    queryKey: [
      "brand-lookup",
      projectId,
      trimmedInitialQuery,
      competitorKey,
      initialScope ?? "",
    ],
    queryFn: () =>
      lookupBrand({
        data: {
          projectId,
          query: trimmedInitialQuery,
          competitors: initialCompetitors,
          scope: initialScope,
        },
      }),
    enabled: hasActiveQuery && planStatus === "paid",
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  const {
    history,
    isLoaded: historyLoaded,
    addSearch,
    removeHistoryItem,
  } = useBrandLookupSearchHistory(projectId);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const trimmed = query.trim();
    if (trimmed.length === 0) {
      setValidationError({
        field: "query",
        message: t("brand_lookup.err_enter_query"),
      });
      return;
    }
    if (trimmed.length > BRAND_LOOKUP_MAX_INPUT_LENGTH) {
      setValidationError({
        field: "query",
        message: t("brand_lookup.err_max_length", {
          max: BRAND_LOOKUP_MAX_INPUT_LENGTH,
        }),
      });
      return;
    }
    const competitors = parseCompetitorList(competitorsInput);
    const tooLong = competitors.find(
      (competitor) => competitor.length > BRAND_LOOKUP_MAX_INPUT_LENGTH,
    );
    if (tooLong) {
      setValidationError({
        field: "competitors",
        message: t("brand_lookup.err_comp_max_length", {
          max: BRAND_LOOKUP_MAX_INPUT_LENGTH,
        }),
      });
      return;
    }
    const targetValue = detectTarget(trimmed).value.toLowerCase();
    const matchesTarget = competitors.find(
      (competitor) =>
        detectTarget(competitor).value.toLowerCase() === targetValue,
    );
    if (matchesTarget) {
      setValidationError({
        field: "competitors",
        message: t("brand_lookup.err_comp_matches_target", {
          match: matchesTarget,
        }),
      });
      return;
    }
    if (
      scopeTarget &&
      selectedScope === "subfolder" &&
      scopeTarget.path === ""
    ) {
      setValidationError({
        field: "query",
        message: t("brand_lookup.err_subfolder_path"),
      });
      return;
    }
    setValidationError(null);
    const explicitScope = scopeTarget
      ? toScopeSearchParam(trimmed, selectedScope)
      : undefined;
    onSearchChange(trimmed, competitors, explicitScope);
  };

  const historyKey = `${projectId}::${trimmedInitialQuery}::${competitorKey}::${initialScope ?? ""}`;

  const brandLookupBullets = [
    {
      icon: TrendingUp,
      title: t("brand_lookup.bullet1_title"),
      body: t("brand_lookup.bullet1_body"),
    },
    {
      icon: Quote,
      title: t("brand_lookup.bullet2_title"),
      body: t("brand_lookup.bullet2_body"),
    },
    {
      icon: BarChart3,
      title: t("brand_lookup.bullet3_title"),
      body: t("brand_lookup.bullet3_body"),
    },
  ];

  return (
    <ResearchPageShell
      title={t("brand_lookup.title")}
      description={t("brand_lookup.subtitle")}
      gate={{
        feature: t("brand_lookup.title"),
        description: t("brand_lookup.gate_desc"),
        features: brandLookupBullets,
        alternative: (
          <PromptTrackingWithoutUpgradeButton projectId={projectId} />
        ),
      }}
      form={
        <BrandLookupSearchCard
          query={query}
          onQueryChange={(next) => {
            setQuery(next);
            if (validationError) setValidationError(null);
          }}
          scope={selectedScope}
          onScopeChange={setScopeChoice}
          scopeDisabledReason={scopeDisabledReason}
          competitors={competitorsInput}
          onCompetitorsChange={(next) => {
            setCompetitorsInput(next);
            if (validationError) setValidationError(null);
          }}
          onSubmit={handleSubmit}
          isLoading={hasActiveQuery && lookupQuery.isPending}
          validationError={validationError}
        />
      }
      query={lookupQuery}
      hasActiveQuery={hasActiveQuery}
      errorFallback={t("brand_lookup.err_load_failed")}
      urlKey={`${initialQuery}::${historyKey}`}
      onUrlChange={() => {
        setQuery(initialQuery);
        setCompetitorsInput(competitorKey.split(",").join(", "));
        setScopeChoice(initialScope);
        setValidationError(null);
      }}
      historyKey={historyKey}
      onSuccess={() =>
        addSearch({
          query: trimmedInitialQuery,
          competitors: competitorKey ? competitorKey.split(",") : [],
          scope: initialScope,
        })
      }
      backLink={
        <BackLink
          from="/p/$projectId/brand-lookup"
          to="/p/$projectId/brand-lookup"
          params={{ projectId }}
          search={{ q: undefined, c: undefined, scope: undefined }}
          replace
        >
          {t("brand_lookup.recent_searches")}
        </BackLink>
      }
      renderResults={(result) => (
        <BrandLookupResults result={result} projectId={projectId} />
      )}
      history={
        <RecentSearches
          items={history}
          loaded={historyLoaded}
          onRemove={removeHistoryItem}
          emptyIcon={Sparkles}
          emptyTitle={t("brand_lookup.empty_history")}
          getTitle={(item) => (
            <>
              {item.query}
              {item.scope ? (
                <Badge variant="secondary" className="ml-2">
                  {RESEARCH_SCOPE_LABELS[item.scope]}
                </Badge>
              ) : null}
            </>
          )}
          getSubtitle={(item) =>
            item.competitors.length > 0
              ? t("ui.details.vs_value", {
                  v1: item.competitors.join(", "),
                })
              : null
          }
          renderLink={(item, props) => (
            <Link
              from="/p/$projectId/brand-lookup"
              to="/p/$projectId/brand-lookup"
              params={{ projectId }}
              search={{
                q: item.query,
                c:
                  item.competitors.length > 0
                    ? item.competitors.join(",")
                    : undefined,
                scope: item.scope,
              }}
              replace
              {...props}
            />
          )}
        />
      }
    />
  );
}
