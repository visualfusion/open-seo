import { useLocale } from "@/client/lib/i18n";
import { captureClientEvent } from "@/client/lib/posthog";
import { SUPPORT_EMAIL } from "@/client/lib/support";
import {
  PLAN_FOOTER_LINK_CLASS,
  PlanGuarantee,
} from "@/client/features/billing/PlanOfferCard";

export function SubscribeFooter({
  error,
  canManageBilling,
  isChangingPlan,
}: {
  error: string | null;
  canManageBilling: boolean;
  isChangingPlan: boolean;
}) {
  const { t } = useLocale();

  return (
    <>
      {error || !canManageBilling ? (
        <div className="mx-auto max-w-md space-y-2 text-center text-sm">
          {error ? (
            <p role="alert" className="text-destructive">
              {error}
            </p>
          ) : null}
          {canManageBilling ? null : (
            <p className="text-muted-foreground">
              {isChangingPlan
                ? t("billing.details.only_owner_can_change_plan")
                : t("ui.details.only_the_organization_owner_to_upgrade")}
            </p>
          )}
        </div>
      ) : null}

      <div className="space-y-2">
        <PlanGuarantee />
        <p className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
          <a
            className={PLAN_FOOTER_LINK_CLASS}
            href="https://openseo.so/pricing"
            target="_blank"
            rel="noreferrer"
            onClick={() =>
              captureClientEvent("billing:pricing_estimator_click")
            }
          >
            {t("ui.details.how_far_do_usage_credits_go")}{" "}
            <span aria-hidden="true">&#8599;</span>
          </a>
          <span aria-hidden="true">&middot;</span>
          <span>
            {t("ui.details.questions_email")}{" "}
            <a
              className={PLAN_FOOTER_LINK_CLASS}
              href={`mailto:${SUPPORT_EMAIL}`}
            >
              {SUPPORT_EMAIL}
            </a>
            .
          </span>
        </p>
      </div>
    </>
  );
}
