import { useLocale } from "@/client/lib/i18n";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ExternalLink, RefreshCw } from "lucide-react";
import { Button } from "@/client/components/ui/button";
import { Alert, AlertDescription } from "@/client/components/ui/alert";
import { Skeleton } from "@/client/components/ui/skeleton";
import { safeHttpUrl } from "@/shared/safe-url";
import {
  EMBED_PAGE_ELEMENT_ID,
  EMBED_WIDGET_CONTEXTS,
  embedPageSchema,
  type EmbedPage,
  type EmbedWidget,
} from "@/shared/embeds";
import {
  WidgetTool,
  mcpMetaOutputSchema,
  rankTrackerSchema,
  searchConsoleSchema,
  serpSchema,
} from "@/shared/mcp-contracts";
import type { WidgetHost } from "./host";
import { useEmbedHost } from "./useEmbedHost";
import { useMcpHost } from "./useMcpHost";
import { RankTrackerWidget } from "./RankTrackerWidget";
import { SearchConsoleWidget } from "./SearchConsoleWidget";
import { SerpWidget } from "./SerpWidget";
// oxlint-disable-next-line import/no-unassigned-import -- Vite emits the widget's app stylesheet.
import "@/client/styles/app.css";
// oxlint-disable-next-line import/no-unassigned-import -- Widget document overrides follow the app stylesheet.
import "./widgets.css";

/** One widget, drawn from its host's latest snapshot, whichever host it is. */
function WidgetBody({ host }: { host: WidgetHost }) {
  const { t } = useLocale();
  const snapshot = host.snapshot;
  const tool = snapshot?.context.tool;
  const search =
    tool === WidgetTool.SearchConsole
      ? searchConsoleSchema.safeParse(snapshot?.data)
      : null;
  const serp =
    tool === WidgetTool.Serp ? serpSchema.safeParse(snapshot?.data) : null;
  const rank =
    tool === WidgetTool.RankTracker
      ? rankTrackerSchema.safeParse(snapshot?.data)
      : null;
  return (
    <>
      {host.error && (
        <Alert variant="destructive">
          <AlertDescription className="whitespace-pre-wrap text-foreground">
            {host.error}
          </AlertDescription>
        </Alert>
      )}
      {!snapshot && !host.error ? (
        <div role="status" aria-busy="true" className="space-y-3">
          <span className="text-sm text-muted-foreground">
            {t("widgets.details.loading_openseo_results")}
          </span>
          <Skeleton className="h-10" />
          <Skeleton className="h-24" />
        </div>
      ) : search?.success ? (
        <SearchConsoleWidget host={host} data={search.data} />
      ) : serp?.success ? (
        <SerpWidget host={host} data={serp.data} />
      ) : rank?.success ? (
        <RankTrackerWidget host={host} data={rank.data} />
      ) : snapshot ? (
        <p role="alert">
          {host.conversation
            ? t("widgets.details.could_not_read_these_to_run")
            : t("widgets.could_not_read_embed_results")}
        </p>
      ) : null}
      {host.notice && (
        <p role="status" className="text-sm">
          {host.notice}
        </p>
      )}
    </>
  );
}

/** Inside an MCP client's conversation. */
function McpWidget() {
  const { t } = useLocale();
  const host = useMcpHost();
  const meta = mcpMetaOutputSchema.safeParse(host.snapshot?.data.meta);
  const appUrl = safeHttpUrl(meta.success ? meta.data.url : undefined);
  return (
    <main className="space-y-4 p-4">
      <header className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
        <span className="font-medium">OpenSEO</span>
        {appUrl && (
          <Button
            variant="ghost"
            disabled={!host.isConnected || host.busy}
            onClick={() => host.open(appUrl)}
          >
            {t("widgets.open_in_openseo")} <ExternalLink />
          </Button>
        )}
      </header>
      <WidgetBody host={host} />
    </main>
  );
}

function EmbeddedWidget({
  token,
  widget,
}: {
  token: string;
  widget: EmbedWidget;
}) {
  const host = useEmbedHost(token, EMBED_WIDGET_CONTEXTS[widget]);
  return (
    <div className="space-y-4">
      <WidgetBody host={host} />
    </div>
  );
}

/** An embed link's page, framed by another dashboard. */
function EmbedWidgets({ page }: { page: EmbedPage }) {
  const { t } = useLocale();
  return (
    <main className="space-y-8 p-4">
      <header className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
        <span className="font-medium">OpenSEO</span>
        <Button variant="ghost" onClick={() => window.location.reload()}>
          <RefreshCw />
          {t("widgets.refresh")}
        </Button>
      </header>
      {page.widgets.map((widget) => (
        <EmbeddedWidget key={widget} token={page.token} widget={widget} />
      ))}
    </main>
  );
}

const embed = document.getElementById(EMBED_PAGE_ELEMENT_ID)?.textContent;

const queryClient = new QueryClient({
  defaultOptions: { mutations: { retry: false } },
});
createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    {embed ? (
      <EmbedWidgets page={embedPageSchema.parse(JSON.parse(embed))} />
    ) : (
      <McpWidget />
    )}
  </QueryClientProvider>,
);
