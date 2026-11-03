import { useMutation } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";
import { Button } from "@/client/components/ui/button";
import { Switch } from "@/client/components/ui/switch";
import {
  updatePrivacyChoices,
  usePrivacyChoices,
} from "@/client/components/PrivacyChoices";
import { WizardFooter } from "@/client/features/onboarding/WizardFooter";
import { useLocale } from "@/client/lib/i18n";
import { useSession } from "@/lib/auth-client";
import { setProductUpdatesOptIn } from "@/serverFunctions/product-updates";
import type { PrivacyChoices } from "@/shared/privacy-choices";
import { PRIVACY_URL } from "@/shared/terms";

export function AnalyticsOnboardingStep({
  onBack,
  onNext,
}: {
  onBack: () => void;
  onNext: () => void;
}) {
  const { t } = useLocale();
  const choices = usePrivacyChoices();
  const { data: session, refetch } = useSession();
  const [analytics, setAnalytics] = React.useState<boolean>();
  const [productUpdates, setProductUpdates] = React.useState<boolean>();

  const save = useMutation({
    mutationFn: async (next: {
      privacy: PrivacyChoices;
      productUpdates: boolean | undefined;
    }) => {
      await Promise.all([
        updatePrivacyChoices(next.privacy, true),
        next.productUpdates === undefined
          ? null
          : setProductUpdatesOptIn({ data: { optIn: next.productUpdates } }),
      ]);
      await refetch({ query: { disableCookieCache: true } });
    },
    onError: () =>
      toast.error(t("auth.onboarding.analytics.save_failed_toast")),
    onSettled: onNext,
  });

  if (!choices) return null;
  const analyticsOn = analytics ?? choices.analytics;
  const productUpdatesOn =
    productUpdates ?? session?.user.productUpdatesOptIn === true;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          {t("auth.onboarding.analytics.title")}
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          {t("auth.onboarding.analytics.subtitle_prefix")}
          <a
            href={PRIVACY_URL}
            target="_blank"
            rel="noreferrer"
            className="text-foreground underline underline-offset-2"
          >
            {t("auth.onboarding.analytics.privacy_link")}
          </a>
          .
        </p>
      </div>
      <div className="flex items-start justify-between gap-6">
        <div>
          <p className="text-sm">
            {t("auth.onboarding.analytics.usage_title")}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("auth.onboarding.analytics.usage_desc")}
          </p>
        </div>
        <Switch
          checked={analyticsOn}
          onCheckedChange={setAnalytics}
          aria-label={t("auth.onboarding.analytics.usage_aria")}
        />
      </div>
      <div className="flex items-start justify-between gap-6">
        <div>
          <p className="text-sm">
            {t("auth.onboarding.analytics.updates_title")}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("auth.onboarding.analytics.updates_desc")}
          </p>
        </div>
        <Switch
          checked={productUpdatesOn}
          onCheckedChange={setProductUpdates}
          aria-label={t("auth.onboarding.analytics.updates_aria")}
        />
      </div>
      <WizardFooter
        onBack={onBack}
        continueAction={
          <Button
            type="button"
            className="font-semibold"
            pending={save.isPending}
            onClick={() =>
              save.mutate({
                privacy: { ...choices, analytics: analyticsOn },
                productUpdates,
              })
            }
          >
            {t("auth.onboarding.continue")}
            <ArrowRight className="size-4" />
          </Button>
        }
      />
    </div>
  );
}
