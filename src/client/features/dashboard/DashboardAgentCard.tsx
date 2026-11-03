import { useLocale } from "@/client/lib/i18n";
import type { ComponentType, ReactNode } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { cn } from "cn";
import { Bot, X } from "lucide-react";
import { CopyButton } from "@/client/components/CopyButton";
import { Button } from "@/client/components/ui/button";
import { Card } from "@/client/components/ui/card";
import { ONE_CLICK_INSTALLS } from "@/client/features/ai-mcp/agentInstalls";
import { captureClientEvent } from "@/client/lib/posthog";
import { dismissDashboardAgentCard } from "@/serverFunctions/dashboard";
import { listMcpConnections } from "@/serverFunctions/mcp-connections";

const actionClassName = "h-9 px-3 text-xs sm:text-sm";

// For people who haven't connected an agent.
export function DashboardAgentCard({ projectId }: { projectId: string }) {
  const { t } = useLocale();
  return (
    <AgentCard
      projectId={projectId}
      icons={ONE_CLICK_INSTALLS.map(({ Icon }) => Icon)}
      title={t("dashboard.details.use_openseo_in_chatgpt_or_claude")}
      description={t(
        "dashboard.details.research_keywords_and_audit_chatbot_you",
      )}
    >
      {ONE_CLICK_INSTALLS.map(({ agent, name, href, Icon }) => (
        <Button
          key={agent}
          variant="outline"
          className={actionClassName}
          nativeButton={false}
          render={<a href={href} target="_blank" rel="noreferrer" />}
          onClick={() =>
            captureClientEvent("onboarding:add_to_agent_click", {
              agent,
              source: "dashboard",
            })
          }
        >
          <Icon data-icon="inline-start" />
          {t("dashboard.details.add_to")} {name}
        </Button>
      ))}
    </AgentCard>
  );
}

// For people whose agent is connected but hasn't used OpenSEO yet: opens a new
// chat in the app they connected, with a first prompt filled in.
export function DashboardAgentPromptCard({
  projectId,
  domain,
}: {
  projectId: string;
  domain: string | null;
}) {
  const { t } = useLocale();
  const connections = useQuery({
    queryKey: ["mcpConnections"],
    queryFn: () => listMcpConnections(),
  });
  if (!connections.data) return null;

  // An API key or a teammate's agent leaves this person with no connections
  // of their own, so offer both chat apps.
  const grants = connections.data;
  const chats = ONE_CLICK_INSTALLS.filter(
    ({ agent }) =>
      grants.length === 0 || grants.some((grant) => grant.webChat === agent),
  );
  const prompt = t("dashboard.details.use_openseo_to_audit_the_3", {
    v1: domain ?? "my website",
  });

  return (
    <AgentCard
      projectId={projectId}
      icons={chats.length > 0 ? chats.map(({ Icon }) => Icon) : [Bot]}
      title={t("dashboard.details.ask_value_about_your_site", {
        v1:
          chats.length === 1
            ? chats[0].name
            : t("dashboard.details.your_agent"),
      })}
      description={t("dashboard.details.try_value", {
        v1: prompt,
      })}
    >
      {chats.map(({ agent, name, newChatUrl, Icon }) => (
        <Button
          key={agent}
          variant="outline"
          className={actionClassName}
          nativeButton={false}
          render={
            <a href={newChatUrl(prompt)} target="_blank" rel="noreferrer" />
          }
          onClick={() =>
            captureClientEvent("dashboard:open_in_agent_click", { agent })
          }
        >
          <Icon data-icon="inline-start" />
          {t("dashboard.details.open_in")} {name}
        </Button>
      ))}
      <CopyButton
        value={prompt}
        successMessage="Prompt copied"
        label={t("settings.indexnow.agent_copy_label")}
        size="default"
        className={actionClassName}
        onCopy={() => captureClientEvent("dashboard:agent_prompt_copy")}
      />
    </AgentCard>
  );
}

function AgentCard({
  projectId,
  icons,
  title,
  description,
  children,
}: {
  projectId: string;
  icons: ComponentType<{ className?: string }>[];
  title: string;
  description: string;
  children: ReactNode;
}) {
  const { t } = useLocale();
  const queryClient = useQueryClient();
  const dismiss = useMutation({
    mutationFn: () => dismissDashboardAgentCard({ data: { projectId } }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["dashboardActivation", projectId],
      });
      captureClientEvent("dashboard:agent_card_dismiss");
    },
  });

  return (
    <Card
      role="region"
      aria-label={title}
      className="relative flex-row flex-wrap items-center gap-x-6 gap-y-4 p-5 pr-9 shadow-none"
    >
      <div className="flex min-w-0 flex-1 basis-[32rem] items-center gap-4">
        <div className="flex shrink-0 items-center" aria-hidden>
          {icons.map((Icon, index) => (
            <span
              key={index}
              className={cn(
                "flex size-10 items-center justify-center rounded-lg border border-border",
                index === 0 ? "bg-card" : "-ml-2 mt-3 bg-muted",
              )}
            >
              <Icon className="size-5" />
            </span>
          ))}
        </div>
        <div className="min-w-0 space-y-1">
          <h2 className="text-sm font-semibold">{title}</h2>
          <p className="text-pretty text-sm text-muted-foreground">
            {description}
          </p>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2">{children}</div>
      <Button
        variant="ghost"
        size="icon-xs"
        className="absolute right-1 top-1 text-muted-foreground"
        aria-label={t("dashboard.details.dismiss_chatbot_card")}
        disabled={dismiss.isPending}
        onClick={() => dismiss.mutate()}
      >
        <X />
      </Button>
    </Card>
  );
}
