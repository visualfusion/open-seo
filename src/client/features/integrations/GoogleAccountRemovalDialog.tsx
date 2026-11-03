import { useLocale } from "@/client/lib/i18n";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getStandardErrorMessage } from "@/client/lib/error-messages";
import { Button } from "@/client/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/client/components/ui/dialog";
import {
  getGoogleAccountRemovalImpact,
  removeGoogleAccount,
} from "@/serverFunctions/googleAccounts";

export function GoogleAccountRemovalDialog({
  provider,
  accountId,
  label,
  onClose,
  onRemoved,
}: {
  provider: "gsc" | "ga4";
  accountId: string;
  label: string;
  onClose: () => void;
  onRemoved: () => void;
}) {
  const { t } = useLocale();
  const queryClient = useQueryClient();
  const impact = useQuery({
    queryKey: ["googleAccountRemovalImpact", provider, accountId],
    queryFn: () =>
      getGoogleAccountRemovalImpact({ data: { provider, accountId } }),
    staleTime: 0,
    gcTime: 0,
  });
  const removal = useMutation({
    meta: { errorToast: false },
    mutationFn: () =>
      removeGoogleAccount({ data: { provider, accountId, confirmed: true } }),
    onSuccess: async () => {
      const keys =
        provider === "gsc"
          ? [
              "gscConnection",
              "gscSites",
              "gscGrantStatus",
              "searchPerformance",
              "searchPerformanceTable",
              "dashboardGscReport",
              "dashboardActivation",
            ]
          : [
              "ga4Connection",
              "ga4Properties",
              "dashboardGa4Report",
              "dashboardActivation",
            ];
      await Promise.all(
        keys.map((key) => queryClient.invalidateQueries({ queryKey: [key] })),
      );
      toast.success(t("integrations.details.google_account_removed"));
      onRemoved();
    },
  });
  const name = provider === "gsc" ? "Search Console" : "Google Analytics";
  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open && !removal.isPending) onClose();
      }}
    >
      <DialogContent className="sm:max-w-md" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>
            {t("integrations.details.remove_google_account")}
          </DialogTitle>
          <DialogDescription>
            {t("integrations.details.this_removes_the_account_s")} {name}{" "}
            {t("integrations.details.connection_from_openseo_you_it_anytime")}
          </DialogDescription>
        </DialogHeader>
        <p className="break-all text-sm font-medium">{label}</p>
        {impact.isPending ? (
          <p role="status" className="text-sm text-muted-foreground">
            {t("integrations.details.checking_connected_projects")}
          </p>
        ) : impact.isError ? (
          <div role="alert" className="text-sm">
            <p className="text-destructive">
              {t("integrations.details.couldn_t_check_connected_projects")}
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => void impact.refetch()}
            >
              {t("ui.error_boundary.try_again")}
            </Button>
          </div>
        ) : impact.data.projectCount > 0 ? (
          <p className="text-sm font-medium">
            {t(
              impact.data.projectCount === 1
                ? "integrations.details.disconnect_project"
                : "integrations.details.disconnect_projects",
              { name, count: impact.data.projectCount },
            )}
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">
            {t("integrations.details.no_projects_will_be_affected")}
          </p>
        )}
        {removal.isError ? (
          <p role="alert" className="text-sm text-destructive">
            {getStandardErrorMessage(removal.error)}
          </p>
        ) : null}
        <DialogFooter>
          <Button
            variant="ghost"
            size="sm"
            disabled={removal.isPending}
            onClick={onClose}
          >
            {t("common.cancel")}
          </Button>
          <Button
            variant="destructive"
            size="sm"
            disabled={
              !impact.isSuccess || impact.isFetching || removal.isPending
            }
            onClick={() => removal.mutate()}
          >
            {removal.isPending
              ? t("integrations.details.removing")
              : t("integrations.details.remove_account")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
