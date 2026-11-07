import { useLocale } from "@/client/lib/i18n";
import { useState } from "react";
import { toast } from "sonner";
import { ChartLine } from "lucide-react";
import { CardShell } from "@/client/components/CardShell";
import { EmptyState } from "@/client/components/EmptyState";
import { Button } from "@/client/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { GoogleConnectionCard } from "@/client/features/integrations/GoogleConnectionCard";
import { GoogleAnalyticsLogo } from "@/client/features/integrations/GoogleProductLogos";
import { googlePickerPending } from "@/client/features/integrations/useGooglePickerResume";
import { captureClientEvent } from "@/client/lib/posthog";
import { dismissDashboardGa4Card } from "@/serverFunctions/dashboard";

export function Ga4ConnectCard({
  projectId,
  connected,
}: {
  projectId: string;
  connected: boolean;
}) {
  const { t } = useLocale();
  const queryClient = useQueryClient();
  // Back from Google's consent screen, the person already said yes: open
  // the property picker instead of asking again.
  const [usesGa4, setUsesGa4] = useState(() =>
    googlePickerPending("ga4", projectId),
  );
  const dismissMutation = useMutation({
    mutationFn: () => dismissDashboardGa4Card({ data: { projectId } }),
    onSuccess: () => {
      toast.success(t("dashboard.details.use_another_analytics_provider"), {
        description: t("dashboard.details.connect_its_mcp_server_to_work"),
        duration: 10000,
      });
      void queryClient.invalidateQueries({
        queryKey: ["dashboardActivation", projectId],
      });
    },
  });

  if (!connected && !usesGa4)
    return (
      <CardShell
        title="Google Analytics"
        icon={<GoogleAnalyticsLogo className="size-5" />}
      >
        <EmptyState
          variant="plain"
          icon={ChartLine}
          title={t("dashboard.details.do_you_use_google_analytics_4")}
          description={t(
            "dashboard.details.bring_your_organic_traffic_your_dashboard",
          )}
          action={
            <div className="flex flex-wrap justify-center gap-2">
              <Button onClick={() => setUsesGa4(true)}>
                {t("dashboard.details.yes_connect_ga4")}
              </Button>
              <Button
                variant="outline"
                disabled={dismissMutation.isPending}
                onClick={() => {
                  captureClientEvent("dashboard:ga4_dismiss");
                  dismissMutation.mutate();
                }}
              >
                {t("dashboard.details.no")}
              </Button>
            </div>
          }
        />
      </CardShell>
    );
  return (
    <GoogleConnectionCard
      provider="ga4"
      projectId={projectId}
      prominent
      onDismiss={
        connected
          ? undefined
          : () => {
              captureClientEvent("dashboard:ga4_dismiss");
              dismissMutation.mutate();
            }
      }
      dismissing={dismissMutation.isPending}
    />
  );
}
