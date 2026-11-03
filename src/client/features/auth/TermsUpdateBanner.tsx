import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/client/components/ui/button";
import { AppBanner } from "@/client/layout/AppBanner";
import { useLocale } from "@/client/lib/i18n";
import { useSession } from "@/lib/auth-client";
import { acceptTermsUpdate } from "@/serverFunctions/terms";
import {
  CURRENT_TERMS_EFFECTIVE_DATE,
  CURRENT_TERMS_VERSION,
  PRIVACY_URL,
  TERMS_URL,
} from "@/shared/terms";

// Asks existing users to affirmatively accept updated Terms. It never blocks
// the app: a user who doesn't accept stays on their prior agreement.
export function TermsUpdateBanner() {
  const { t } = useLocale();
  const { data: session, refetch } = useSession();
  const acceptMutation = useMutation({
    mutationFn: () => acceptTermsUpdate(),
    // The session is served from a signed cookie cache, so bypass it to pick
    // up the new acceptance and hide the banner.
    onSuccess: () => refetch({ query: { disableCookieCache: true } }),
    onError: () => toast.error(t("auth.terms_banner.failed")),
  });

  if (!session || session.user.termsAcceptedVersion === CURRENT_TERMS_VERSION) {
    return null;
  }

  return (
    <AppBanner variant="info">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span>
          {t("auth.terms_banner.prefix")}
          <a href={TERMS_URL} target="_blank" rel="noreferrer">
            {t("auth.terms_banner.terms_link")}
          </a>
          {t("auth.terms_banner.and")}
          <a href={PRIVACY_URL} target="_blank" rel="noreferrer">
            {t("auth.terms_banner.privacy_link")}
          </a>
          {t("auth.terms_banner.suffix", {
            date: CURRENT_TERMS_EFFECTIVE_DATE,
          })}
        </span>
        <Button
          size="sm"
          pending={acceptMutation.isPending}
          onClick={() => acceptMutation.mutate()}
        >
          {t("auth.terms_banner.accept")}
        </Button>
      </div>
    </AppBanner>
  );
}
