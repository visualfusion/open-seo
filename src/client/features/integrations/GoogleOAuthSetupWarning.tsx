import { useLocale } from "@/client/lib/i18n";
import { AlertTriangle, Info } from "lucide-react";
import { SafeExternalLink } from "@/client/components/SafeExternalLink";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/client/components/ui/alert";
import { isEveryAppClientAuthMode } from "@/lib/auth-mode";

const EVERY_APP_GOOGLE_SETUP_URL =
  "https://everyapp.com/docs/providers/google#connect-accounts";

export function GoogleOAuthSetupWarning({
  integrationName,
  docsUrl,
}: {
  integrationName: string;
  docsUrl: string;
}) {
  const { t } = useLocale();
  if (isEveryAppClientAuthMode()) {
    // Google connects through the gateway, which holds the Google client;
    // OpenSEO holds none here (server/features/google/googleAccess.ts).
    return (
      <Alert variant="info">
        <Info className="size-4" />
        <AlertTitle>
          {t("integrations.details.add_google_to_every_app_first")}
        </AlertTitle>
        <AlertDescription>
          <p>
            {t("integrations.details.an_owner_or_admin_a_google")}{" "}
            <code>
              https://&lt;your gateway&gt;/connect/google-workspace/callback
            </code>
            {t("integrations.details.then_paste_its_client_every_app")}{" "}
            <code>
              pnpm everyapp secret set GOOGLE_WORKSPACE_CLIENT_ID
              GOOGLE_WORKSPACE_CLIENT_SECRET
            </code>
            {t("integrations.details.then_connect")} {integrationName}{" "}
            {t("integrations.details.here")}
          </p>
          <SafeExternalLink
            url={EVERY_APP_GOOGLE_SETUP_URL}
            label={t("integrations.details.how_to_add_a_provider")}
            className="inline-flex items-center gap-1 font-medium underline underline-offset-2"
          />
        </AlertDescription>
      </Alert>
    );
  }
  return (
    <Alert variant="warning">
      <AlertTriangle className="size-4" />
      <AlertTitle>
        {t("integrations.details.google_oauth_client_not_configured")}
      </AlertTitle>
      <AlertDescription>
        <p>
          {t("integrations.details.add_your_google_client_this_openseo")}{" "}
          {integrationName}.
        </p>
        <SafeExternalLink
          url={docsUrl}
          label={t("shell.open_setup_guide")}
          className="inline-flex items-center gap-1 font-medium underline underline-offset-2"
        />
      </AlertDescription>
    </Alert>
  );
}
