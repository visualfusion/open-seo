import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { z } from "zod";
import { revalidateLogic } from "@tanstack/react-form";
import { useAppForm } from "@/client/components/form/useAppForm";
import { useAuditCapabilities } from "@/client/features/audit/shared";
import { isEveryAppClientAuthMode } from "@/lib/auth-mode";
import { saveCrawlerCredential } from "@/serverFunctions/crawlerAccess";
import { useLocale, getTranslation } from "@/client/lib/i18n";
import {
  isCrawlerAccessExpired,
  parseSignatureExpiry,
} from "@/shared/crawler-access";

export const crawlerCredentialsQueryKey = ["crawler-credentials"];
export const saveCrawlerCredentialMutationKey = ["save-crawler-credential"];

/**
 * CRAWLER_ACCESS_SECRET is optional on Every App and on self-hosts, so the form
 * and the Shopify crawl warning say how to set it instead of failing on save.
 */
export function CrawlerAccessSetupHint() {
  const { t } = useLocale();
  if (isEveryAppClientAuthMode()) {
    return (
      <>
        {t("ui.details.an_admin_sets")} <code>CRAWLER_ACCESS_SECRET</code>{" "}
        {t("ui.details.with")}{" "}
        <code>
          pnpm everyapp secret set CRAWLER_ACCESS_SECRET --app openseo
        </code>
        .
      </>
    );
  }
  return (
    <>
      {t("ui.details.an_admin_sets_secret_deployment")}
    </>
  );
}

/** Whether to show the setup hint, once the server has said. */
export function useCrawlerAccessNeedsSetup(projectId: string) {
  return useAuditCapabilities(projectId).data?.canStoreCrawlerAccess === false;
}

const signatureSchema = z.object({
  host: z
    .string()
    .trim()
    .min(1, getTranslation("settings.crawler_access.form.domain_required")),
  signatureInput: z
    .string()
    .trim()
    .min(1, getTranslation("settings.crawler_access.form.input_required"))
    .refine(
      (value) => !isCrawlerAccessExpired(parseSignatureExpiry(value)),
      getTranslation("settings.crawler_access.form.input_expired"),
    ),
  signature: z
    .string()
    .trim()
    .min(1, getTranslation("settings.crawler_access.form.sig_required")),
});

/**
 * The two values a merchant copies out of Shopify admin. `Signature-Agent` is
 * a constant we add ourselves, so it is not asked for here.
 */
export function CrawlerAccessForm({
  projectId,
  initialHost,
  lockHost = false,
  onSaved,
}: {
  /** The project (website) the signature is stored on. */
  projectId: string;
  initialHost: string;
  lockHost?: boolean;
  onSaved?: () => void;
}) {
  const { t } = useLocale();
  const queryClient = useQueryClient();

  const saveMutation = useMutation({
    mutationKey: saveCrawlerCredentialMutationKey,
    mutationFn: (values: z.infer<typeof signatureSchema>) =>
      saveCrawlerCredential({
        data: { projectId, ...values },
      }),
    onSuccess: async (result) => {
      if ("problem" in result) return;
      await queryClient.invalidateQueries({
        queryKey: crawlerCredentialsQueryKey,
      });
      toast.success(
        t("settings.crawler_access.form.success", {
          host: result.credential.host,
        }),
      );
      onSaved?.();
    },
  });

  const form = useAppForm({
    defaultValues: { host: initialHost, signatureInput: "", signature: "" },
    validationLogic: revalidateLogic(),
    validators: { onDynamic: signatureSchema },
    onSubmit: async ({ value, formApi }) => {
      const result = await saveMutation.mutateAsync(value);
      if ("problem" in result) {
        const { problem } = result;
        formApi.setErrorMap({
          onSubmit: {
            fields: {
              signatureInput:
                problem.reason === "wrong_domain"
                  ? t("settings.crawler_access.form.err_wrong_domain", {
                      signedHost: problem.signedHost,
                      host: problem.host,
                    })
                  : t("settings.crawler_access.form.err_rejected", {
                      host: problem.host,
                    }),
            },
          },
        });
        return;
      }
      formApi.reset({ ...value, signatureInput: "", signature: "" });
    },
  });

  if (useCrawlerAccessNeedsSetup(projectId)) {
    return (
      <p className="text-sm text-muted-foreground">
        {t("settings.crawler_access.form.needs_setup")}{" "}
        <CrawlerAccessSetupHint />
      </p>
    );
  }

  return (
    <form.AppForm>
      <form.Form className="space-y-3">
        {!lockHost ? (
          <form.AppField name="host">
            {(field) => (
              <field.TextField
                label={t("settings.crawler_access.form.domain_label")}
                placeholder={t(
                  "settings.crawler_access.form.domain_placeholder",
                )}
                className="font-mono"
                required
              />
            )}
          </form.AppField>
        ) : null}
        <form.AppField name="signatureInput">
          {(field) => (
            <field.TextField
              label={t("settings.crawler_access.form.input_label")}
              type="password"
              autoComplete="off"
              data-ph-mask
              className="font-mono"
              placeholder={t("settings.crawler_access.form.input_placeholder")}
              required
            />
          )}
        </form.AppField>
        <form.AppField name="signature">
          {(field) => (
            <field.TextField
              label={t("settings.crawler_access.form.sig_label")}
              description={t("settings.crawler_access.form.sig_desc")}
              type="password"
              autoComplete="off"
              data-ph-mask
              className="font-mono"
              placeholder={t("settings.crawler_access.form.sig_placeholder")}
              required
            />
          )}
        </form.AppField>
        <form.SubmitButton disabled={!projectId}>
          {t("settings.crawler_access.form.submit")}
        </form.SubmitButton>
      </form.Form>
    </form.AppForm>
  );
}
