import { Link } from "@tanstack/react-router";
import { ShieldAlert, Wrench } from "lucide-react";
import { GateCard } from "@/client/components/GateCard";
import { Alert, AlertDescription } from "@/client/components/ui/alert";
import { Button } from "@/client/components/ui/button";
import { useLocale } from "@/client/lib/i18n";
import { isEveryAppClientAuthMode } from "@/lib/auth-mode";

export function SamSetupGate({
  errorMessage,
  isRefetching,
  onRetry,
}: {
  errorMessage: string | null;
  isRefetching: boolean;
  onRetry: () => void;
}) {
  const { t } = useLocale();
  return (
    <GateCard
      icon={Wrench}
      tone="warning"
      title={t("sam.setup_gate.title")}
      description={
        <>
          {isEveryAppClientAuthMode() ? (
            <p>
              {t("sam.setup_gate.everyapp_p1_prefix")}
              <code>pnpm everyapp secret set OPENROUTER_API_KEY</code>
              {t("sam.setup_gate.everyapp_p1_suffix")}
            </p>
          ) : (
            <p>
              {t("sam.setup_gate.selfhosted_p1_prefix")}
              <code>OPENROUTER_API_KEY</code>
              {t("sam.setup_gate.selfhosted_p1_suffix")}
            </p>
          )}
          <p className="text-xs">
            {t("sam.setup_gate.guide_prefix")}
            <Link
              className="underline underline-offset-2 hover:text-foreground"
              to="/help/openrouter-api-key"
            >
              {t("sam.setup_gate.guide_link")}
            </Link>
            {t("sam.setup_gate.guide_suffix")}
          </p>
        </>
      }
      actions={
        <>
          <Button size="lg" pending={isRefetching} onClick={onRetry}>
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
    >
      {errorMessage ? (
        <Alert variant="warning">
          <ShieldAlert />
          <AlertDescription className="text-foreground">
            {errorMessage}
          </AlertDescription>
        </Alert>
      ) : null}
    </GateCard>
  );
}
