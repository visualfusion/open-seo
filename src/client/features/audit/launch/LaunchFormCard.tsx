import { Link } from "@tanstack/react-router";
import { AlertCircle } from "lucide-react";
import { Alert, AlertTitle } from "@/client/components/ui/alert";
import { Button } from "@/client/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/client/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/client/components/ui/field";
import { Input } from "@/client/components/ui/input";
import { InsufficientCreditsError } from "@/client/features/billing/InsufficientCreditsError";
import { Switch } from "@/client/components/ui/switch";
import {
  clampMaxPagesInput,
  MIN_PAGES,
} from "@/client/features/audit/launch/types";
import type { useLaunchController } from "@/client/features/audit/launch/useLaunchController";
import { useLocale } from "@/client/lib/i18n";
import { getFieldError, getFormError } from "@/client/lib/forms";
import {
  isEveryAppClientAuthMode,
  isHostedClientAuthMode,
} from "@/lib/auth-mode";
import { PAID_MAX_AUDIT_PAGES } from "@/shared/audit-limits";
import { renderingEstimateText } from "@/shared/audit-rendering";
import { SUBSCRIBE_ROUTE } from "@/shared/billing";

type Props = {
  launchForm: ReturnType<typeof useLaunchController>["launchForm"];
  commitMaxPagesInput: () => number;
  maxPagesLimit: number;
  canRenderJavaScript?: boolean;
  outOfCredits?: boolean;
};

export function LaunchFormCard({
  commitMaxPagesInput,
  launchForm,
  maxPagesLimit,
  canRenderJavaScript,
  outOfCredits,
}: Props) {
  const { t } = useLocale();
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <h2>{t("audit.start_new_audit")}</h2>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <form
          className="grid grid-cols-1 gap-3 lg:grid-cols-12 lg:items-center"
          onSubmit={(event) => {
            event.preventDefault();
            void launchForm.handleSubmit();
          }}
        >
          <launchForm.Field name="url">
            {(field) => {
              const urlError = getFieldError(field.state.meta.errors);

              return (
                <Input
                  className="lg:col-span-9"
                  aria-label={t("audit.site_url_aria")}
                  aria-invalid={urlError ? true : undefined}
                  placeholder="https://example.com"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => {
                    field.handleChange(event.target.value);
                    if (launchForm.state.errorMap.onSubmit) {
                      launchForm.setErrorMap({ onSubmit: undefined });
                    }
                  }}
                />
              );
            }}
          </launchForm.Field>

          <launchForm.Subscribe selector={(state) => state.isSubmitting}>
            {(isSubmitting) => (
              <Button
                type="submit"
                className="w-full lg:col-span-3"
                pending={isSubmitting}
              >
                {isSubmitting ? t("audit.starting") : t("audit.start_audit")}
              </Button>
            )}
          </launchForm.Subscribe>

          <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:col-span-12 lg:items-start">
            <LaunchOptions
              launchForm={launchForm}
              commitMaxPagesInput={commitMaxPagesInput}
              maxPagesLimit={maxPagesLimit}
            />
            <div className="space-y-4">
              <LighthouseOptions launchForm={launchForm} />
              <RenderingOptions
                launchForm={launchForm}
                maxPagesLimit={maxPagesLimit}
                canRenderJavaScript={canRenderJavaScript}
              />
            </div>
          </div>
        </form>

        <LaunchErrors launchForm={launchForm} outOfCredits={outOfCredits} />
      </CardContent>
    </Card>
  );
}

function LaunchOptions({
  launchForm,
  commitMaxPagesInput,
  maxPagesLimit,
}: Props) {
  const { t, locale } = useLocale();
  const upgradeLink = (
    <Link to={SUBSCRIBE_ROUTE} search={{ upgrade: true }}>
      {t("audit.upgrade")}
    </Link>
  );
  const maxPagesFormatted = maxPagesLimit.toLocaleString(
    locale === "de" ? "de-DE" : "en-US",
  );
  const paidMaxPagesFormatted = PAID_MAX_AUDIT_PAGES.toLocaleString(
    locale === "de" ? "de-DE" : "en-US",
  );
  const upgradeTextParts = t("audit.upgrade_pages_desc", {
    link: "___LINK___",
    max: paidMaxPagesFormatted,
  }).split("___LINK___");

  return (
    <Field className="rounded-lg border border-border p-3">
      <FieldLabel htmlFor="audit-max-pages">{t("audit.max_pages")}</FieldLabel>
      <launchForm.Field name="maxPagesInput">
        {(field) => (
          <Input
            id="audit-max-pages"
            type="number"
            min={MIN_PAGES}
            max={maxPagesLimit}
            className="w-28"
            value={field.state.value}
            onChange={(event) => {
              const next = event.target.value;
              if (!/^\d*$/.test(next)) return;
              field.handleChange(next);
              if (launchForm.state.errorMap.onSubmit) {
                launchForm.setErrorMap({ onSubmit: undefined });
              }
            }}
            onBlur={commitMaxPagesInput}
          />
        )}
      </launchForm.Field>
      <FieldDescription>
        {t("audit.max_pages_desc", {
          min: String(MIN_PAGES),
          max: maxPagesFormatted,
        })}
        {maxPagesLimit < PAID_MAX_AUDIT_PAGES ? (
          <>
            {" "}
            {upgradeTextParts[0]}
            {upgradeLink}
            {upgradeTextParts[1] || null}
          </>
        ) : null}
      </FieldDescription>
    </Field>
  );
}

function LighthouseOptions({ launchForm }: Pick<Props, "launchForm">) {
  const { t } = useLocale();
  return (
    <Field className="rounded-lg border border-border p-3">
      <div className="flex items-center gap-2">
        <launchForm.Field name="runLighthouse">
          {(field) => (
            <Switch
              id="audit-run-lighthouse"
              checked={Boolean(field.state.value)}
              onCheckedChange={(checked) => field.handleChange(checked)}
            />
          )}
        </launchForm.Field>
        <FieldLabel
          htmlFor="audit-run-lighthouse"
          title={t("audit.lighthouse_tooltip")}
        >
          {t("audit.include_lighthouse")}
        </FieldLabel>
      </div>

      <launchForm.Subscribe
        selector={(snapshot) => snapshot.values.runLighthouse}
      >
        {(runLighthouse) =>
          runLighthouse ? (
            <FieldDescription>{t("audit.lighthouse_desc")}</FieldDescription>
          ) : null
        }
      </launchForm.Subscribe>
    </Field>
  );
}

function RenderingOptions({
  launchForm,
  maxPagesLimit,
  canRenderJavaScript,
}: Pick<Props, "launchForm" | "maxPagesLimit" | "canRenderJavaScript">) {
  const { t } = useLocale();
  return (
    <Field className="rounded-lg border border-border p-3">
      <div className="flex items-center gap-2">
        <launchForm.Field name="renderJavaScript">
          {(field) => (
            <Switch
              id="audit-render-javascript"
              checked={field.state.value}
              disabled={canRenderJavaScript !== true}
              onCheckedChange={(checked) => field.handleChange(checked)}
            />
          )}
        </launchForm.Field>
        <FieldLabel
          htmlFor="audit-render-javascript"
          title={t("audit.render_javascript_tooltip")}
        >
          {t("audit.render_javascript")}
        </FieldLabel>
      </div>

      {isHostedClientAuthMode() && (
        <launchForm.Subscribe
          selector={(state) => ({
            renderJavaScript: state.values.renderJavaScript,
            maxPagesInput: state.values.maxPagesInput,
          })}
        >
          {({ renderJavaScript, maxPagesInput }) =>
            renderJavaScript ? (
              <FieldDescription>
                {renderingEstimateText(
                  clampMaxPagesInput(maxPagesInput, maxPagesLimit),
                )}
              </FieldDescription>
            ) : null
          }
        </launchForm.Subscribe>
      )}
      {canRenderJavaScript === false && isEveryAppClientAuthMode() && (
        <FieldDescription>
          {t("audit.details.javascript_rendering_isn_t_every_app")}{" "}
          <code>pnpm everyapp secret set CONTEXT_API_KEY</code>.
        </FieldDescription>
      )}
      {canRenderJavaScript === false && !isEveryAppClientAuthMode() && (
        <FieldDescription>
          {t("audit.details.this_deployment_has_no_a_context")}{" "}
          <code>CONTEXT_API_KEY</code>
          {t("audit.details.restart_openseo_then_reload_this_page")}{" "}
          <a
            href="https://github.com/every-app/open-seo/blob/main/docs/SELF_HOSTING_CLOUDFLARE_OPERATIONS.md#render-javascript-in-site-audits"
            target="_blank"
            rel="noreferrer"
          >
            {t("audit.setup_guide")}
          </a>
        </FieldDescription>
      )}
    </Field>
  );
}

function LaunchErrors({
  launchForm,
  outOfCredits,
}: Pick<Props, "launchForm" | "outOfCredits">) {
  return (
    <div className="space-y-2">
      <launchForm.Field name="url">
        {(field) => {
          const urlError = getFieldError(field.state.meta.errors);

          return urlError ? <FieldError>{urlError}</FieldError> : null;
        }}
      </launchForm.Field>

      <launchForm.Subscribe selector={(state) => state.errorMap.onSubmit}>
        {(submitError) => {
          const errorMessage = getFormError(submitError);

          if (errorMessage && outOfCredits)
            return <InsufficientCreditsError title={errorMessage} />;
          return errorMessage ? (
            <Alert variant="destructive">
              <AlertCircle />
              <AlertTitle>{errorMessage}</AlertTitle>
            </Alert>
          ) : null;
        }}
      </launchForm.Subscribe>
    </div>
  );
}
