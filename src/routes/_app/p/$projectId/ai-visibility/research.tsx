import { createFileRoute } from "@tanstack/react-router";
import { Link2, ListPlus, MessagesSquare } from "lucide-react";
import { z } from "zod";
import { useLocale } from "@/client/lib/i18n";
import { PromptResearchPage } from "@/client/features/ai-visibility/PromptResearchPage";
import { PromptTrackingWithoutUpgradeButton } from "@/client/features/ai-visibility/shared";
import { PaidPlanGate } from "@/client/features/billing/PaidPlanGate";

export const Route = createFileRoute(
  "/_app/p/$projectId/ai-visibility/research",
)({
  validateSearch: z.object({ q: z.string().trim().max(100).optional() }),
  component: AiResearchRoute,
});

function AiResearchRoute() {
  const { t } = useLocale();
  const { projectId } = Route.useParams();
  const { q } = Route.useSearch();

  const features = [
    {
      icon: MessagesSquare,
      title: t("ai_visibility.research_feature_1_title"),
      body: t("ai_visibility.research_feature_1_body"),
    },
    {
      icon: Link2,
      title: t("ai_visibility.research_feature_2_title"),
      body: t("ai_visibility.research_feature_2_body"),
    },
    {
      icon: ListPlus,
      title: t("ai_visibility.research_feature_3_title"),
      body: t("ai_visibility.research_feature_3_body"),
    },
  ];

  return (
    <PaidPlanGate
      feature={t("ai_visibility.research_features_title")}
      description={t("ai_visibility.research_description")}
      features={features}
      alternative={<PromptTrackingWithoutUpgradeButton projectId={projectId} />}
    >
      <PromptResearchPage key={projectId} projectId={projectId} keyword={q} />
    </PaidPlanGate>
  );
}
