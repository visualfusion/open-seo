import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { AlertTriangle, ExternalLink, Info } from "lucide-react";
import { AppBanner } from "@/client/layout/AppBanner";
import { dataforseoHelpLinkOptions } from "@/client/navigation/items";
import { isEveryAppClientAuthMode } from "@/lib/auth-mode";
import { Button } from "@/client/components/ui/button";
import { useLocale } from "@/client/lib/i18n";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/client/components/ui/dialog";

function SeoApiStatusBanners({
  shouldShowSeoApiWarning,
  seoApiKeyStatusError,
}: {
  shouldShowSeoApiWarning: boolean;
  seoApiKeyStatusError: boolean;
}) {
  const { t } = useLocale();
  const icon = <AlertTriangle className="size-4 shrink-0" />;
  const helpLink = (
    <Link
      {...dataforseoHelpLinkOptions}
      className="font-medium text-primary underline-offset-4 hover:underline"
    >
      {t("shell.help_page")}
    </Link>
  );
  return (
    <>
      {shouldShowSeoApiWarning ? (
        <AppBanner variant="warning" icon={icon}>
          {isEveryAppClientAuthMode() ? (
            <>
              {t("shell.dataforseo_warning_everyapp")}{" "}
              <code>pnpm everyapp secret set DATAFORSEO_API_KEY</code>.{" "}
              {helpLink}.
            </>
          ) : (
            <>
              {t("shell.dataforseo_warning")} {helpLink}.
            </>
          )}
        </AppBanner>
      ) : null}

      {seoApiKeyStatusError ? (
        <AppBanner variant="info" icon={icon}>
          {t("shell.dataforseo_error")} {helpLink}.
        </AppBanner>
      ) : null}
    </>
  );
}

const DOCKER_MOVE_URL =
  "https://github.com/every-app/open-seo/blob/main/docs/SELF_HOSTING_DOCKER.md#move-from-the-old-docker-image";
const DOCKER_MOVE_DISMISSED_KEY = "openseo:docker-move-dismissed";

// The old single-container Docker image builds the app at startup with this
// flag set (deploy/docker/Dockerfile), so only its users see the notice.
function LegacyDockerBanner() {
  const { t } = useLocale();
  const [dismissed, setDismissed] = useState(
    () => localStorage.getItem(DOCKER_MOVE_DISMISSED_KEY) === "1",
  );
  if (import.meta.env.VITE_OPENSEO_LEGACY_DOCKER !== "true" || dismissed) {
    return null;
  }
  return (
    <AppBanner variant="info" icon={<Info className="size-4 shrink-0" />}>
      {t("shell.legacy_docker_notice")}{" "}
      <a
        href={DOCKER_MOVE_URL}
        target="_blank"
        rel="noreferrer"
        className="font-medium text-primary underline-offset-4 hover:underline"
      >
        {t("shell.legacy_docker_how_to_move")}
      </a>{" "}
      ·{" "}
      <button
        type="button"
        className="font-medium text-primary underline-offset-4 hover:underline"
        onClick={() => {
          localStorage.setItem(DOCKER_MOVE_DISMISSED_KEY, "1");
          setDismissed(true);
        }}
      >
        {t("shell.dismiss")}
      </button>
    </AppBanner>
  );
}

function MissingSeoSetupModal({ onClose }: { onClose: () => void }) {
  const { t } = useLocale();
  const everyApp = isEveryAppClientAuthMode();
  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader className="flex-row items-start gap-3 text-left">
          <div className="rounded-full bg-warning/20 p-2 text-warning">
            <AlertTriangle className="size-5" />
          </div>
          <div className="space-y-2">
            <DialogTitle>
              {everyApp
                ? t("shell.missing_setup_title_everyapp")
                : t("shell.missing_setup_title")}
            </DialogTitle>
            <DialogDescription>
              {everyApp
                ? t("shell.missing_setup_desc_everyapp")
                : t("shell.missing_setup_desc")}
            </DialogDescription>
          </div>
        </DialogHeader>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>
            {t("shell.dismiss")}
          </Button>
          <Button
            nativeButton={false}
            render={<Link {...dataforseoHelpLinkOptions} onClick={onClose} />}
          >
            {t("shell.open_setup_guide")}
            <ExternalLink className="size-4" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export { LegacyDockerBanner, MissingSeoSetupModal, SeoApiStatusBanners };
