import { useLocale } from "@/client/lib/i18n";
import { useState } from "react";
import { toast } from "sonner";
import { CardShell } from "@/client/components/CardShell";
import { Button } from "@/client/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { GoogleConnectionCard } from "@/client/features/integrations/GoogleConnectionCard";
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
  const [usesGa4, setUsesGa4] = useState(false);
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
      <CardShell title={t("dashboard.details.do_you_use_google_analytics_4")}>
        <p className="text-sm text-muted-foreground">
          {t("dashboard.details.bring_your_organic_traffic_your_dashboard")}
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
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
