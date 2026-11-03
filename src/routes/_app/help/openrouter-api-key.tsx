import { createFileRoute } from "@tanstack/react-router";
import {
  CommandBlock,
  helpLinkClassName,
  SecretHelpPage,
} from "@/client/features/help/SecretHelpPage";
import { useLocale } from "@/client/lib/i18n";

const OPENROUTER_KEYS_URL = "https://openrouter.ai/settings/keys";

export const Route = createFileRoute("/_app/help/openrouter-api-key")({
  component: OpenrouterApiKeyHelpPage,
});

function OpenrouterApiKeyHelpPage() {
  const { t } = useLocale();
  const accountStep = (
    <li>
      {t("sam.help.openrouter.account_prefix")}
      <a
        className={helpLinkClassName}
        href="https://openrouter.ai"
        target="_blank"
        rel="noreferrer"
      >
        openrouter.ai
      </a>
      {t("sam.help.openrouter.account_suffix")}
    </li>
  );
  const keyStep = (
    <li>
      {t("sam.help.openrouter.key_prefix")}
      <a
        className={helpLinkClassName}
        href={OPENROUTER_KEYS_URL}
        target="_blank"
        rel="noreferrer"
      >
        {t("sam.help.openrouter.key_link")}
      </a>
      {t("sam.help.openrouter.key_suffix")}
    </li>
  );
  return (
    <SecretHelpPage
      title={t("sam.help.openrouter.title")}
      intro={
        <>
          {t("sam.help.openrouter.intro_prefix")}
          <code>OPENROUTER_API_KEY</code>
          {t("sam.help.openrouter.intro_suffix")}
        </>
      }
      everyAppIntro={t("sam.help.openrouter.everyapp_intro")}
      secretName="OPENROUTER_API_KEY"
      steps={
        <>
          {accountStep}
          {keyStep}
          <li>
            {t("sam.help.openrouter.save_env_prefix")}
            <code>OPENROUTER_API_KEY</code>
            {t("sam.help.openrouter.save_env_suffix")}
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>
                {t("sam.help.openrouter.env_docker")}
                <code>.env</code>
              </li>
              <li>{t("sam.help.openrouter.env_cf")}</li>
              <li>
                {t("sam.help.openrouter.env_local")}
                <code>.env.local</code>
              </li>
            </ul>
          </li>
          <li>{t("sam.help.openrouter.restart")}</li>
        </>
      }
      everyAppSteps={
        <>
          {accountStep}
          {keyStep}
          <li>
            {t("sam.help.openrouter.everyapp_run")}
            <CommandBlock command="pnpm everyapp secret set OPENROUTER_API_KEY" />
          </li>
          <li>{t("sam.help.openrouter.everyapp_reload")}</li>
        </>
      }
      dashboardPasteStep={t("sam.help.openrouter.dashboard_paste")}
      terminalPromptHint={t("sam.help.openrouter.terminal_hint")}
    />
  );
}
