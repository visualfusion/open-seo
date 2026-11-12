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

// Checkout sells the yearly plans to organizations without a plan. A monthly
// subscriber who picks one on /subscribe is sent to support, who credit what
// is left of the month they paid for.
export function AnnualPlanDialog({
  open,
  onOpenChange,
  planName,
  annualPriceUsd,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  planName: string;
  annualPriceUsd: number;
}) {
  const { locale, t } = useLocale();
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {t("billing.details.yearly_plans_are_set_for_now")}
          </DialogTitle>
          <DialogDescription>
            {t("billing.details.switch_yearly_support_desc", {
              email: SUPPORT_EMAIL,
              plan: planName,
              price: annualPriceUsd.toLocaleString(
                locale === "de" ? "de-DE" : "en-US",
              ),
            })}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
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
