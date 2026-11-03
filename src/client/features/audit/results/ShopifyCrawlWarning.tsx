import { useLocale } from "@/client/lib/i18n";
import { useIsMutating, useMutation, useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { ShieldAlert, ShieldCheck } from "lucide-react";
import {
  CrawlerAccessForm,
  CrawlerAccessSetupHint,
  useCrawlerAccessNeedsSetup,
  crawlerCredentialsQueryKey,
  saveCrawlerCredentialMutationKey,
} from "@/client/features/crawler-access/CrawlerAccessForm";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/client/components/ui/alert";
import { Button } from "@/client/components/ui/button";
import { ShopifyRateLimitAlert } from "@/client/features/audit/results/ShopifyRateLimitAlert";
import type { AuditResultsData } from "@/client/features/audit/results/types";
import { extractHostname } from "@/client/features/audit/shared";
import { startAudit } from "@/serverFunctions/audit";
import { listCrawlerCredentials } from "@/serverFunctions/crawlerAccess";
import {
  SHOPIFY_CRAWLER_ACCESS_DOC_URL,
  isCrawlerAccessExpired,
} from "@/shared/crawler-access";

/**
 * Shown instead of the generic crawl warnings when a Shopify storefront
 * throttled or refused the crawl. Shopify's own fix is a crawler-access
 * signature the merchant creates in admin, so the report asks for it first.
 *
 * The setup steps only show while the domain has no usable signature. Once
 * one is saved they collapse to a single line with the re-run button. An
 * unrendered crawl Shopify still rate limited with the signature asks for
 * rendering instead. On Every App, where CRAWLER_ACCESS_SECRET is optional,
 * the warning says to set it first when it isn't: a signature created too
 * early only runs down its expiry.
 */
export function ShopifyCrawlWarning({
  projectId,
  audit,
  throttled,
}: {
  projectId: string;
  audit: AuditResultsData["audit"];
  /** Shopify answered with 429s, not only refusals. */
  throttled: boolean;
}) {
  const { t } = useLocale();
  const navigate = useNavigate();
  const host = extractHostname(audit.startUrl);
  const usedCredentialId = audit.config.crawlerCredentialId;

  const credentialsQuery = useQuery({
    queryKey: crawlerCredentialsQueryKey,
    queryFn: () => listCrawlerCredentials(),
  });
  const canStoreCrawlerAccess = !useCrawlerAccessNeedsSetup(projectId);
  const setupHint = canStoreCrawlerAccess ? null : (
    <p className="text-muted-foreground">
      {t("audit.details.a_signature_can_t_crawler_access")}{" "}
      <CrawlerAccessSetupHint />
    </p>
  );
  // A recorded credential id names the signature this crawl used, whatever
  // else is stored for the host on another project. If that one has expired
  // since (possibly mid-crawl), expiry is the explanation. Without a recorded
  // id, an expired row for the host is why the crawl went out unsigned.
  const expiredCredential = credentialsQuery.data?.find(
    (credential) =>
      (usedCredentialId
        ? credential.id === usedCredentialId
        : credential.host === host) &&
      isCrawlerAccessExpired(credential.expiresAt),
  );
  // Several projects can hold a live signature for this host; the one this
  // crawl used decides whether the crawl was signed.
  const liveCredentials = (credentialsQuery.data ?? []).filter(
    (credential) =>
      credential.host === host && !isCrawlerAccessExpired(credential.expiresAt),
  );
  const liveCredential =
    liveCredentials.find((credential) => credential.id === usedCredentialId) ??
    liveCredentials[0];
  // A re-run started mid-save would resolve the old signature, or none.
  const isSaving =
    useIsMutating({ mutationKey: saveCrawlerCredentialMutationKey }) > 0;

  const rerunMutation = useMutation({
    mutationFn: () =>
      startAudit({
        data: {
          projectId,
          startUrl: audit.startUrl,
          maxPages: audit.config.maxPages,
          lighthouseStrategy: audit.config.lighthouseStrategy,
          renderJavaScript: audit.config.renderJavaScript,
        },
      }),
    onSuccess: (result) => {
      void navigate({
        to: "/p/$projectId/audit",
        params: { projectId },
        search: { auditId: result.auditId, tab: "issues" },
      });
    },
  });

  const rerunButton = (
    <Button
      variant="outline"
      size="sm"
      pending={rerunMutation.isPending}
      disabled={isSaving}
      onClick={() => rerunMutation.mutate()}
    >
      {rerunMutation.isPending
        ? t("audit.details.starting")
        : t("audit.details.re_run_audit")}
    </Button>
  );

  // Until the list loads we can't tell which state applies; don't flash the
  // setup steps at someone who already has a signature.
  if (credentialsQuery.isPending) return null;

  if (liveCredential) {
    const signedAndStillLimited = liveCredential.id === usedCredentialId;
    if (signedAndStillLimited && throttled && !audit.config.renderJavaScript) {
      return (
        <ShopifyRateLimitAlert
          projectId={projectId}
          startUrl={audit.startUrl}
        />
      );
    }
    return (
      <Alert variant={signedAndStillLimited ? "warning" : "success"}>
        {signedAndStillLimited ? <ShieldAlert /> : <ShieldCheck />}
        <AlertDescription className="text-foreground">
          {signedAndStillLimited ? (
            <>
              {t("audit.details.shopify_limited_this_crawl_check_that")}{" "}
              <span className="font-mono">{host}</span>
              {t("audit.details.paste_it_again_in")}{" "}
              <Link
                to="/p/$projectId/settings/integrations"
                params={{ projectId }}
              >
                {t("projects.switcher.project_settings")}
              </Link>
              {t("audit.details.if_it_was_shopify_store_re")}
            </>
          ) : (
            <>
              {t("audit.details.crawler_access_is_saved_for")}{" "}
              <span className="font-mono">{host}</span>
              {t("audit.details.re_run_the_audit_with_it")}
            </>
          )}
        </AlertDescription>
        <div className="col-start-2 mt-2">{rerunButton}</div>
      </Alert>
    );
  }

  return (
    <Alert variant="warning">
      <ShieldAlert />
      <div className="min-w-0 space-y-3">
        {expiredCredential?.expiresAt ? (
          <>
            <AlertTitle>
              {t("audit.details.your_shopify_signature_for_has_expired")}
            </AlertTitle>
            {setupHint}
            <p className="text-muted-foreground">
              {t("audit.details.it_ran_out_on")}{" "}
              {new Date(expiredCredential.expiresAt).toLocaleDateString()}
              {t("audit.details.so_requests_after_that_shopify_limited")}
              {canStoreCrawlerAccess
                ? " Signatures can't be renewed: create a fresh one in Shopify admin and paste it below to replace the stored values."
                : null}
            </p>
          </>
        ) : (
          <>
            <AlertTitle>
              {t("audit.details.shopify_limited_this_crawl")}
            </AlertTitle>
            {setupHint}
            <p className="text-muted-foreground">
              {t("audit.details.shopify_rate_limits_crawlers_so_parts")}
              {canStoreCrawlerAccess
                ? t("audit.details.if_you_own_this_about_a")
                : null}
            </p>
          </>
        )}

        {canStoreCrawlerAccess ? (
          <>
            <ol className="list-decimal space-y-1 pl-5 text-muted-foreground">
              <li>{t("audit.details.in_shopify_admin_go_crawler_access")}</li>
              <li>
                {t("audit.details.pick_the_domain")}{" "}
                <span className="font-mono">{host}</span>{" "}
                {t("audit.details.and_an_expiry_up_to_3_months")}
              </li>
              <li>{t("audit.details.paste_the_two_values_below")}</li>
            </ol>

            {/* Keyed by hosthe report stays mounted when the audit changes. */}
            <CrawlerAccessForm
              key={host}
              projectId={projectId}
              initialHost={host}
              lockHost
            />
          </>
        ) : null}

        <div className="flex flex-wrap items-center gap-4">
          {rerunButton}
          <a
            className="text-primary underline underline-offset-3"
            href={SHOPIFY_CRAWLER_ACCESS_DOC_URL}
            target="_blank"
            rel="noreferrer"
          >
            {t("audit.details.shopify_s_crawler_access_guide")}
          </a>
        </div>
      </div>
    </Alert>
  );
}
