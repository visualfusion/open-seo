import { useLocale } from "@/client/lib/i18n";
import { Button } from "@/client/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/client/components/ui/dialog";
import { SUPPORT_EMAIL } from "@/client/lib/support";

// Checkout can't sell the yearly plans yet, so /subscribe sends people who
// pick one to support, or lets them start monthly and switch later.
export function AnnualPlanDialog({
  open,
  onOpenChange,
  planName,
  annualPriceUsd,
  onSubscribeMonthly,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  planName: string;
  annualPriceUsd: number;
  onSubscribeMonthly: () => void;
}) {
  const { t } = useLocale();
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {t("billing.details.yearly_plans_are_set_for_now")}
          </DialogTitle>
          <DialogDescription>
            {t("sam.support.email_title")} {SUPPORT_EMAIL}{" "}
            {t("billing.details.and_we_ll_move_you_to_the")} {planName}{" "}
            {t("billing.details.at")}
            {annualPriceUsd.toLocaleString()}
            {t("billing.details.year_paying_yearly_in_coming_soon")}
          </DialogDescription>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          {t("billing.details.want_to_start_today_when_you")}
        </p>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              onOpenChange(false);
              onSubscribeMonthly();
            }}
          >
            {t("billing.details.subscribe_monthly")}
          </Button>
          <Button
            nativeButton={false}
            render={
              <a
                href={`mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(
                  t("billing.details.yearly_value", {
                    v1: planName,
                  }),
                )}`}
              />
            }
          >
            {t("billing.details.email_us")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
