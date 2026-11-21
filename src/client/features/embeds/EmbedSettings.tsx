import { useLocale } from "@/client/lib/i18n";
import { useId, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CardShell } from "@/client/components/CardShell";
import { CopyButton } from "@/client/components/CopyButton";
import { QueryError } from "@/client/components/QueryState";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
} from "@/client/components/ui/field";
import { Input } from "@/client/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/client/components/ui/select";
import { Switch } from "@/client/components/ui/switch";
import { organizationContextQueryOptions } from "@/client/features/team/organizationQueries";
import { usesBetterAuthClient } from "@/lib/auth-mode";
import { hasOrgPermission } from "@/lib/org-permissions";
import { getEmbedLink, setEmbedLink } from "@/serverFunctions/embeds";
import { EmbedWidget, embedPath } from "@/shared/embeds";

const OVERVIEW = "overview";

// The overview has every widget; the others are one widget each.
const VIEWS: { value: string; label: string; widget?: EmbedWidget }[] = [
  { value: OVERVIEW, label: "integrations.overview" },
  {
    value: EmbedWidget.Rankings,
    label: "integrations.rank_tracking",
    widget: EmbedWidget.Rankings,
  },
  {
    value: EmbedWidget.SearchConsole,
    label: "integrations.search_console",
    widget: EmbedWidget.SearchConsole,
  },
];

/**
 * The project's embed link: live, read-only views another dashboard can
 * frame. One switch covers the project; the view picker builds each URL.
 * Owners and admins only, like the integrations it publishes.
 */
export function EmbedSettings({ projectId }: { projectId: string }) {
  const org = useQuery(organizationContextQueryOptions());
  if (
    !usesBetterAuthClient() ||
    !org.data ||
    !hasOrgPermission(org.data.role, { integration: ["manage"] })
  )
    return null;
  return <EmbedSettingsCard projectId={projectId} />;
}

function EmbedSettingsCard({ projectId }: { projectId: string }) {
  const { t } = useLocale();
  const queryClient = useQueryClient();
  const switchId = useId();
  const [view, setView] = useState(OVERVIEW);
  const queryKey = ["embed-link", projectId];
  const linkQuery = useQuery({
    queryKey,
    queryFn: () => getEmbedLink({ data: { projectId } }),
  });
  const mutation = useMutation({
    mutationFn: (enabled: boolean) =>
      setEmbedLink({ data: { projectId, enabled } }),
    onSuccess: (link) => queryClient.setQueryData(queryKey, link),
  });
  const token = linkQuery.data?.token;
  const views = VIEWS.map((item) => ({ ...item, label: t(item.label) }));
  const widget = views.find((item) => item.value === view)?.widget;
  const url = token
    ? `${window.location.origin}${embedPath(token, widget)}`
    : null;

  return (
    <section id="embed-links" className="scroll-mt-6">
      <CardShell title={t("integrations.embed_links")}>
        {linkQuery.isError ? (
          <QueryError
            error={linkQuery.error}
            fallback={t("integrations.couldn_t_load_embed_links")}
            onRetry={() => void linkQuery.refetch()}
            isRetrying={linkQuery.isFetching}
          />
        ) : (
          <div className="space-y-4 text-sm">
            <Field orientation="horizontal">
              <FieldContent>
                <FieldLabel htmlFor={switchId}>
                  {t(
                    "integrations.show_this_project_in_another_dashboard",
                  )}{" "}
                </FieldLabel>
                <FieldDescription>
                  {token
                    ? t("integrations.turning_this_off_stops_every_embed_link")
                    : t("integrations.live_read_only_views_for_any_site")}
                </FieldDescription>
              </FieldContent>
              <Switch
                id={switchId}
                checked={
                  mutation.isPending ? mutation.variables : Boolean(token)
                }
                disabled={!linkQuery.data || mutation.isPending}
                onCheckedChange={(checked) => mutation.mutate(checked)}
              />
            </Field>
            {url ? (
              <div className="flex flex-wrap items-center gap-2">
                <Select
                  items={views}
                  value={view}
                  onValueChange={(value) => value && setView(value)}
                >
                  <SelectTrigger
                    aria-label={t("integrations.view")}
                    className="w-44"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {views.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  readOnly
                  value={url}
                  aria-label={t("integrations.embed_link")}
                  className="min-w-0 flex-1 font-mono text-xs"
                  onFocus={(event) => event.currentTarget.select()}
                />
                <CopyButton
                  value={url}
                  successMessage={t("integrations.link_copied")}
                />
              </div>
            ) : null}
          </div>
        )}
      </CardShell>
    </section>
  );
}
