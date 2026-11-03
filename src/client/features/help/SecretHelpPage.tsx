import type { ReactNode } from "react";
import { CopyButton } from "@/client/components/CopyButton";
import { PageHeader } from "@/client/components/PageHeader";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/client/components/ui/card";
import { Separator } from "@/client/components/ui/separator";
import { useLocale } from "@/client/lib/i18n";
import { isEveryAppClientAuthMode } from "@/lib/auth-mode";

export const helpLinkClassName =
  "font-medium text-primary underline underline-offset-4";

/** A terminal command with a copy button. */
export function CommandBlock({ command }: { command: string }) {
  const { t } = useLocale();
  return (
    <div className="mt-2 flex items-center gap-2 rounded-lg border border-border bg-muted p-3">
      <pre className="min-w-0 flex-1 overflow-x-auto text-xs">
        <code>{command}</code>
      </pre>
      <CopyButton
        value={command}
        successMessage={t("sam.help.command_copied")}
        label={t("sam.help.copy_command")}
        variant="ghost"
        size="icon-xs"
      />
    </div>
  );
}

/**
 * Instructions for setting one secret: the self-hosting steps, or on Every
 * App the steps for the gateway, which holds the key for every app.
 */
export function SecretHelpPage({
  title,
  intro,
  everyAppIntro,
  secretName,
  steps,
  everyAppSteps,
  dashboardPasteStep,
  terminalPromptHint,
}: {
  title: string;
  intro: ReactNode;
  /** The intro on Every App, where the gateway holds the key. */
  everyAppIntro: ReactNode;
  secretName: string;
  /** The `<li>` items of the "Steps" card. */
  steps: ReactNode;
  /** The `<li>` items of the "Steps" card on Every App. */
  everyAppSteps: ReactNode;
  dashboardPasteStep: ReactNode;
  terminalPromptHint: ReactNode;
}) {
  const { t } = useLocale();
  const everyApp = isEveryAppClientAuthMode();
  return (
    <div className="h-full overflow-auto px-4 py-4 pb-24 md:px-6 md:py-6 md:pb-8">
      <div className="mx-auto max-w-7xl space-y-4">
        <PageHeader
          title={title}
          description={everyApp ? everyAppIntro : intro}
        />

        <Card>
          <CardHeader>
            <CardTitle>
              <h2>{t("sam.help.steps_title")}</h2>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal space-y-3 pl-5">
              {everyApp ? everyAppSteps : steps}
            </ol>
          </CardContent>
        </Card>

        {everyApp ? (
          <p className="text-sm text-muted-foreground">
            {t("sam.help.not_admin_hint")}
          </p>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>
                <h2>{t("sam.help.cf_title")}</h2>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <ol className="list-decimal space-y-2 pl-5">
                <li>
                  {t("sam.help.cf_step1_prefix")}
                  <code>Compute</code>
                  {t("sam.help.cf_step1_mid")}
                  <code>Workers &amp; Pages</code>
                  {t("sam.help.cf_step1_suffix")}
                </li>
                <li>
                  {t("sam.help.cf_step2_prefix")}
                  <code>{t("nav.settings")}</code>
                  {t("sam.help.cf_step2_suffix")}
                </li>
                <li>
                  {t("sam.help.cf_step3_prefix")}
                  <code>Variables &amp; Secrets</code>
                  {t("sam.help.cf_step3_mid")}
                  <code>{secretName}</code>
                  {t("sam.help.cf_step3_suffix")}
                </li>
                <li>{dashboardPasteStep}</li>
              </ol>

              <Separator />

              <div>
                <p>{t("sam.help.cf_terminal_or")}</p>
                <CommandBlock
                  command={`npx wrangler secret put ${secretName}`}
                />
              </div>
              <p className="text-muted-foreground">{terminalPromptHint}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
