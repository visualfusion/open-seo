import { useLocale } from "@/client/lib/i18n";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/client/components/ui/alert";
import { Button } from "@/client/components/ui/button";
import { usesBetterAuthClient } from "@/lib/auth-mode";
import {
  getWorkspaceMergeStatus,
  mergeLegacyWorkspaces,
} from "@/serverFunctions/workspace";

// Shown on self-hosted Cloudflare Access deployments that still have per-user
// workspaces from before the shared workspace existed. The server decides
// visibility (AUTH_MODE is a runtime var there); hosted builds skip the query
// entirely since the mode is known at build time.
export function WorkspaceMergeBanner() {
  const { t } = useLocale();
  const queryClient = useQueryClient();

  const statusQuery = useQuery({
    queryKey: ["workspaceMergeStatus"],
    queryFn: () => getWorkspaceMergeStatus(),
    enabled: !usesBetterAuthClient(),
  });

  const mergeMutation = useMutation({
    mutationFn: () => mergeLegacyWorkspaces(),
    onSuccess: ({ mergedWorkspaces }) => {
      toast.success(
        t(
          "dashboard.details.migrated_value_organizationvalue_into_the_shared_organization",
          { v1: mergedWorkspaces, v2: mergedWorkspaces === 1 ? "" : "s" },
        ),
      );
      // The merge changes projects, connections, and the banner's own status —
      // refetch everything rather than enumerating keys.
      void queryClient.invalidateQueries();
    },
  });

  if (!statusQuery.data || statusQuery.data.legacyWorkspaceCount === 0) {
    return null;
  }

  return (
    <Alert variant="warning" className="p-5">
      <AlertDescription className="max-w-3xl text-foreground">
        {t("dashboard.details.when_self_hosting_on_bug_where")}
      </AlertDescription>
      <Button
        size="sm"
        className="mt-4 justify-self-start"
        pending={mergeMutation.isPending}
        onClick={() => mergeMutation.mutate()}
      >
        {mergeMutation.isPending
          ? t("dashboard.details.migrating")
          : t("dashboard.details.migrate_organizations")}
      </Button>
    </Alert>
  );
}
