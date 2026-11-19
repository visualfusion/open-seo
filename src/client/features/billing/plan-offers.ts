import { getTranslation } from "@/client/lib/i18n";
import {
  AUTUMN_AGENCY_PLAN_ID,
  AUTUMN_PAID_PLAN_ID,
  AUTUMN_PRO_PLAN_ID,
  type CheckoutPlanId,
} from "@/shared/billing";

// What a checkout page advertises before the customer holds the plan. Once
// they do, everything shown about it comes from the Autumn customer (see
// billing-account.ts), so these only need to match the Autumn plans they sell.
export type PlanOffer = {
  planId: CheckoutPlanId;
  name: string;
  priceUsd: number;
  monthlyCreditsUsd: number;
};

export const BASE_PLAN_OFFER: PlanOffer = {
  planId: AUTUMN_PAID_PLAN_ID,
  name: "Base Plan",
  priceUsd: 10,
  monthlyCreditsUsd: 10,
};

export const PRO_PLAN_OFFER: PlanOffer = {
  planId: AUTUMN_PRO_PLAN_ID,
  name: "Pro Plan",
  priceUsd: 30,
  monthlyCreditsUsd: 36,
};

export const AGENCY_PLAN_OFFER: PlanOffer = {
  planId: AUTUMN_AGENCY_PLAN_ID,
  name: "Agency Plan",
  priceUsd: 100,
  monthlyCreditsUsd: 120,
};

export function monthlyCreditsFeature(offer: PlanOffer) {
  return getTranslation(
    "billing.details.includes_value_of_usage_credits_each_month",
    undefined,
    { v1: offer.monthlyCreditsUsd.toFixed(2) },
  );
}
