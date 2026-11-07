import { createFileRoute } from "@tanstack/react-router";
import {
  CommandBlock,
  helpLinkClassName,
  SecretHelpPage,
} from "@/client/features/help/SecretHelpPage";
import { useLocale } from "@/client/lib/i18n";
import { pageHead } from "@/client/lib/pageHead";

const DATAFORSEO_API_ACCESS_URL = "https://app.dataforseo.com/api-access";

export const Route = createFileRoute("/_app/help/dataforseo-api-key")({
  head: () => pageHead("DataForSEO API key"),
  component: DataforseoApiKeyHelpPage,
});

function DataforseoApiKeyHelpPage() {
  const { t } = useLocale();
  const requestStep = (
    <li>
      {t("sam.help.dataforseo.request_prefix")}
      <a
        className={helpLinkClassName}
        href={DATAFORSEO_API_ACCESS_URL}
        target="_blank"
        rel="noreferrer"
      >
        {t("sam.help.dataforseo.request_link")}
      </a>
      {t("sam.help.dataforseo.request_suffix")}
    </li>
  );
  const encodeStep = (
    <li>
      {t("sam.help.dataforseo.encode_desc")}
      <CommandBlock command="printf '%s' 'YOUR_LOGIN:YOUR_PASSWORD' | base64" />
    </li>
  );
  return (
    <SecretHelpPage
      title={t("sam.help.dataforseo.title")}
      intro={
        <>
          {t("sam.help.dataforseo.intro_prefix")}
          <code>DATAFORSEO_API_KEY</code>
          {t("sam.help.dataforseo.intro_suffix")}
        </>
      }
      everyAppIntro={t("sam.help.dataforseo.everyapp_intro")}
      secretName="DATAFORSEO_API_KEY"
      steps={
        <>
          {requestStep}
          {encodeStep}
          <li>
            {t("sam.help.dataforseo.save_env_prefix")}
            <code>DATAFORSEO_API_KEY</code>
            {t("sam.help.dataforseo.save_env_suffix")}
          </li>
        </>
      }
      everyAppSteps={
        <>
          {requestStep}
          {encodeStep}
          <li>
            {t("sam.help.dataforseo.everyapp_run")}
            <CommandBlock command="pnpm everyapp secret set DATAFORSEO_API_KEY" />
          </li>
          <li>{t("sam.help.dataforseo.everyapp_reload")}</li>
        </>
      }
      dashboardPasteStep={t("sam.help.dataforseo.dashboard_paste")}
      terminalPromptHint={
        <>
          {t("sam.help.dataforseo.terminal_hint_prefix")}
          <code>login:password</code>
          {t("sam.help.dataforseo.terminal_hint_suffix")}
        </>
      }
    />
  );
}
