import { useLocale } from "@/client/lib/i18n";
import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { KeyRound } from "lucide-react";
import { GateCard } from "@/client/components/GateCard";
import { QueryError } from "@/client/components/QueryState";
import { SkeletonPageContent } from "@/client/components/SkeletonPresets";
import { Button } from "@/client/components/ui/button";
import { useSamAccess } from "@/client/features/sam/useSamAccess";

/**
 * AI visibility setup researches the brand and suggests prompts through
 * OpenRouter, so a self-hosted install without a key would only fail after
 * the user starts research. Ask for the key first (hosted always has one).
 */
export function OpenRouterKeyGate({
  projectId,
  children,
}: {
  projectId: string;
  children: ReactNode;
}) {
  const { t } = useLocale();
  const access = useSamAccess(projectId);
  if (access.status === "ready") return children;
  if (access.status === "checking") return <SkeletonPageContent />;
  if (access.status === "error")
    return (
      <QueryError
        error={access.error}
        fallback={t(
          "ai_visibility.details.could_not_check_the_openrouter_api_key",
        )}
        onRetry={access.onRetry}
        isRetrying={access.isRetrying}
      />
    );
  return (
    <div className="grid min-h-[calc(100dvh-8rem)] place-items-center">
      <GateCard
        className="max-w-2xl"
        icon={KeyRound}
        tone="warning"
        title={t("ai_visibility.details.add_an_openrouter_api_key")}
        description={
          <>
            <p>
              {t(
                "ai_visibility.details.ai_visibility_uses_openrouter_and_suggest",
              )}
            </p>
            <p>
              {t("ai_visibility.details.create_a_key_on_it_as")}{" "}
              <code>OPENROUTER_API_KEY</code>
              {t(
                "ai_visibility.details.restart_openseo_then_confirm_here_the",
              )}{" "}
              <Link
                className="underline underline-offset-2 hover:text-foreground"
                to="/help/openrouter-api-key"
              >
                {t("sam.setup_gate.guide_link")}
              </Link>{" "}
              {t("ai_visibility.details.has_the_steps_for_each_deployment")}
            </p>
          </>
        }
        actions={
          <>
            <Button
              size="lg"
              pending={access.isRefetching}
              onClick={access.onRetry}
            >
              {t("sam.setup_gate.confirm_key")}
            </Button>
            <Button
              size="lg"
              variant="outline"
              nativeButton={false}
              render={
                <a
                  href="https://openrouter.ai/settings/keys"
                  target="_blank"
                  rel="noreferrer"
                />
              }
            >
              {t("sam.setup_gate.open_keys")}
            </Button>
          </>
        }
      />
    </div>
  );
}
