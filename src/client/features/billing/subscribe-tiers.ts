import {
  AGENCY_PLAN_OFFER,
  BASE_PLAN_OFFER,
  PRO_PLAN_OFFER,
  type PlanOffer,
} from "@/client/features/billing/plan-offers";

// The tiers on openseo.so/pricing, with the same copy. Its "Get started"
// links highlight one with ?plan=. Annual prices are the hidden yearly plans
// in Autumn, which support sets up by email until checkout can sell them.
export const TIERS = {
  base: {
    offer: BASE_PLAN_OFFER,
    annualPriceUsd: 100,
    description: "billing.details.tier_base_description",
    features: [
      "billing.details.tier_feature_research",
      "billing.details.tier_feature_ai",
      "billing.details.tier_feature_agents",
      "billing.details.tier_feature_gsc",
    ],
  },
  pro: {
    offer: PRO_PLAN_OFFER,
    annualPriceUsd: 300,
    description: "billing.details.tier_pro_description",
    features: [
      "billing.details.tier_feature_base",
      "billing.details.tier_feature_bonus",
      "billing.details.tier_feature_support",
    ],
  },
  agency: {
    offer: AGENCY_PLAN_OFFER,
    annualPriceUsd: 2000,
    description: "billing.details.tier_agency_description",
    features: [
      "billing.details.tier_feature_pro",
      "billing.details.tier_feature_bonus",
      "billing.details.tier_feature_slack",
      "billing.details.tier_feature_enablement",
    ],
  },
} satisfies Record<
  string,
  {
    offer: PlanOffer;
    annualPriceUsd: number;
    description: string;
    features: string[];
  }
>;
export type Tier = keyof typeof TIERS;

export function isTier(value: unknown): value is Tier {
  return typeof value === "string" && Object.hasOwn(TIERS, value);
}
