import { Link } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";
import { GateCard } from "@/client/components/GateCard";
import { Button } from "@/client/components/ui/button";
import { useLocale } from "@/client/lib/i18n";

/**
 * Shown on the chat route until the user opts into Sam. Sam is the OpenSEO
 * MCP plus skills wrapped in an in-app chat; the agents people already use
 * run that same toolset with a more mature harness, so the primary action
 * points there and Sam is the explicit fallback.
 */
export function SamBetaGate({ onContinue }: { onContinue: () => void }) {
  const { t } = useLocale();
  return (
    <GateCard
      icon={Sparkles}
      title={t("sam.beta_gate.title")}
      description={
        <>
          <p>{t("sam.beta_gate.p1")}</p>
          <p>{t("sam.beta_gate.p2")}</p>
        </>
      }
      actions={
        <>
          <Button size="lg" nativeButton={false} render={<Link to="/ai" />}>
            {t("sam.beta_gate.setup_agent")}
          </Button>
          <Button size="lg" variant="ghost" onClick={onContinue}>
            {t("sam.beta_gate.use_anyway")}
          </Button>
        </>
      }
    />
  );
}
