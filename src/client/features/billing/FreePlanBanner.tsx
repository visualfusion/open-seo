import { useLocale } from "@/client/lib/i18n";
import { useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { AppBanner } from "@/client/layout/AppBanner";
import { BASE_PLAN_OFFER } from "@/client/features/billing/plan-offers";
import { useCreditBalance } from "@/client/features/billing/useCreditBalance";
import { captureClientEvent } from "@/client/lib/posthog";
import { useCanManageBilling } from "@/client/features/team/organizationQueries";
import { BILLING_ROUTE, SUBSCRIBE_ROUTE } from "@/shared/billing";

export function FreePlanBanner() {
  const { t } = useLocale();
  const {
    accountQuery,
    isFreePlan,
    isOutOfCredits,
    isLowCredits,
    refillDate,
    autoReload,
    autoReloadState,
    isPausedByBudget,
  } = useCreditBalance();
  const canManageBilling = useCanManageBilling();
  const showsOutOfCredits = Boolean(accountQuery.data) && isOutOfCredits;

  useEffect(() => {
    if (showsOutOfCredits)
      captureClientEvent("billing:out_of_credits_shown", { surface: "banner" });
  }, [showsOutOfCredits]);

  if (!accountQuery.data) {
    return null;
  }

  // Credits may be in the balance, but the budget holds them back; buying
  // more would not help, only raising it does.
  if (isPausedByBudget && autoReload) {
    const until = refillDate
      ? t("billing.details.until_value", {
          v1: refillDate,
        })
      : "";
    return (
      <AppBanner variant="warning">
        {canManageBilling ? (
          <>
            {t("billing.details.you_ve_hit_your")}
            {autoReload.monthlyLimitUsd}{" "}
            {t("billing.details.monthly_auto_reload_budget_are_paused")}
            {until}.{" "}
            <Link
              to={BILLING_ROUTE}
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              {t("billing.details.raise_your_budget")}
            </Link>{" "}
            {t("billing.details.to_keep_going")}
          </>
        ) : (
          <>
            {t("billing.details.your_organization_hit_its_so_credits")}
            {until}
            {t("billing.details.ask_the_owner_to_raise_it")}
          </>
        )}
      </AppBanner>
    );
  }

  // Out of credits with auto-reload on and working means Autumn is charging
  // the card right now; a "buy more" notice would have them pay twice.
  if (!isFreePlan && isOutOfCredits && autoReloadState === "on" && autoReload) {
    return (
      <AppBanner variant="info">
        {t("billing.details.you_re_out_of_is_adding")}
        {autoReload.amountUsd} {t("billing.details.now")}
      </AppBanner>
    );
  }

  // Only the owner can change the plan or buy credits, so a link would lead
  // everyone else to a page where they can't act.
  if (!canManageBilling && (isOutOfCredits || isLowCredits)) {
    return (
      <AppBanner variant={isOutOfCredits ? "destructive" : "warning"}>
        {isOutOfCredits
          ? autoReloadState === "card_failed"
            ? t("billing.details.your_organization_is_out_card_was")
            : t("billing.details.your_organization_has_used_its_credits")
          : t(
              "billing.details.your_organization_is_running_low_on_credits",
            )}{" "}
        {t("billing.details.ask_your_organization_owner_to")}{" "}
        {autoReloadState === "card_failed"
          ? t("billing.details.update_it")
          : t("billing.details.add_more")}
        .
      </AppBanner>
    );
  }

  const creditsActionLink = isFreePlan ? (
    <Link
      to={SUBSCRIBE_ROUTE}
      search={{ upgrade: true }}
      className="font-medium text-primary underline-offset-4 hover:underline"
    >
      {t("billing.details.upgrade_your_plan")}
    </Link>
  ) : (
    <Link
      to={BILLING_ROUTE}
      className="font-medium text-primary underline-offset-4 hover:underline"
    >
      {t("billing.details.buy_more_credits")}
    </Link>
  );

  if (isOutOfCredits) {
    return (
      <AppBanner variant="destructive">
        {isFreePlan ? (
          <>
            {t("billing.details.you_ve_used_your_free_credits")}{" "}
            {creditsActionLink} {t("billing.details.to_get")}
            {BASE_PLAN_OFFER.monthlyCreditsUsd}{" "}
            {t("billing.details.of_credits_every_month")}
          </>
        ) : autoReloadState === "card_failed" ? (
          <>
            {t("billing.details.you_re_out_of_couldn_t")}{" "}
            <Link
              to={BILLING_ROUTE}
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              {t("billing.details.update_your_card")}
            </Link>{" "}
            {t("billing.details.to_keep_going")}
          </>
        ) : autoReloadState === "failed" ? (
          <>
            {t("billing.details.you_re_out_of_t_2")} {creditsActionLink}{" "}
            {t("billing.details.to_keep_going")}
          </>
        ) : (
          <>
            {t("billing.details.you_ve_used_this_month_s_credits")}{" "}
            {creditsActionLink} {t("billing.details.to_keep_going_2")}
            {refillDate
              ? t("billing.details.or_wait_for_them_on_value", {
                  v1: refillDate,
                })
              : ""}
            .
          </>
        )}
      </AppBanner>
    );
  }

  if (isLowCredits) {
    return (
      <AppBanner variant="warning">
        {t("billing.details.you_re_running_low_on_credits")} {creditsActionLink}{" "}
        {t("billing.details.to_keep_using_openseo")}
      </AppBanner>
    );
  }

  if (isFreePlan) {
    return (
      <AppBanner variant="info">
        {t("billing.details.we_hope_you_re_enjoying_openseo")}{" "}
        <Link
          to={SUBSCRIBE_ROUTE}
          search={{ upgrade: true }}
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          {t("billing.details.upgrade_anytime")}
        </Link>{" "}
        {t("billing.details.or")}{" "}
        <Link
          to="/support"
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          {t("billing.details.reach_out_with_questions")}
        </Link>
        .
      </AppBanner>
    );
  }

  return null;
}
