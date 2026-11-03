import { useLocale } from "@/client/lib/i18n";
import { ExternalLink, MessageSquare, RefreshCw } from "lucide-react";
import { Button } from "@/client/components/ui/button";
import { safeHttpUrl } from "@/shared/safe-url";
import type { SearchConsoleData } from "@/shared/mcp-contracts";
import type { WidgetHost } from "./useWidgetHost";

export function SearchConsoleConnection({
  host,
  data,
}: {
  host: WidgetHost;
  data: SearchConsoleData;
}) {
  const { t } = useLocale();
  const input = host.snapshot!.context.arguments;
  const busy = host.action.isPending;
  const connectUrl = safeHttpUrl(data.connectUrl);
  const setupUrl = safeHttpUrl(data.setupDocsUrl);
  const connection = data.reason === "not_connected" || data.connectionRequired;
  return (
    <section className="space-y-4 rounded-xl border border-border bg-card p-5">
      <div>
        <h1 className="text-xl font-semibold">
          {setupUrl
            ? t("widgets.details.set_up_google_search_console")
            : connection
              ? t("auth.onboarding.gsc.title")
              : t("widgets.details.couldn_t_load_search_console_data")}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {setupUrl
            ? t("widgets.details.this_self_hosted_openseo_configuration_before")
            : connection
              ? t("widgets.details.connect_google_and_choose_in_openseo")
              : host.snapshot?.text}
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        {(connectUrl || setupUrl) && (
          <Button
            disabled={busy}
            onClick={() => host.open((setupUrl ?? connectUrl)!)}
          >
            {setupUrl
              ? t("ai.setup.instructions")
              : connection
                ? t("widgets.details.connect_in_openseo")
                : t("widgets.details.check_connection_in_openseo")}
            <ExternalLink />
          </Button>
        )}
        <Button
          variant="outline"
          pending={busy}
          onClick={() => host.call(host.snapshot!.context)}
        >
          <RefreshCw />
          {connection
            ? t("widgets.details.check_connection")
            : t("ui.error_boundary.try_again")}
        </Button>
      </div>
      <div className="border-t border-border pt-4">
        <Button
          variant="outline"
          disabled={busy}
          onClick={() =>
            host.ask(
              "Help me research Google search results for this OpenSEO project. Ask me which keyword and market to use first.",
              { projectId: input.projectId },
            )
          }
        >
          <MessageSquare />
          {t("widgets.details.research_a_keyword_instead")}
        </Button>
      </div>
    </section>
  );
}
