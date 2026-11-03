import { useLocale } from "@/client/lib/i18n";
import { Button } from "@/client/components/ui/button";
import type { GooglePickerAccount } from "./GooglePropertyPicker";

export function GscPropertySetupHelp({
  accounts,
  loading,
  busy,
  linking,
  onRetry,
  onReconnect,
}: {
  accounts: GooglePickerAccount[];
  loading: boolean;
  busy: boolean;
  linking: boolean;
  onRetry: () => void;
  onReconnect: () => void;
}) {
  const { t } = useLocale();
  return (
    <>
      <div className="space-y-3 rounded-lg border border-border bg-muted/30 p-4 text-sm">
        <h2 className="font-semibold">
          {t("integrations.details.we_couldn_t_find_your_website")}
        </h2>
        <p className="break-words text-muted-foreground">
          {t("integrations.details.we_checked")}{" "}
          {accounts
            .map(
              (account) =>
                account.email ??
                t("integrations.details.google_account_value", {
                  v1: account.accountId.slice(-6),
                }),
            )
            .join(", ")}
          .
        </p>
        <p className="text-muted-foreground">
          {t("integrations.details.add_your_site_to_whoever_manages")}
          {accounts.length === 1
            ? t("integrations.details.this_account")
            : t("integrations.details.one_of_these_accounts")}{" "}
          {t("integrations.details.access")}
        </p>
        <div className="flex flex-wrap gap-x-4 gap-y-2">
          <a
            href="https://search.google.com/search-console"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4"
          >
            {t("integrations.details.open_search_console")}
          </a>
          <a
            href="https://openseo.so/blogs/google-search-console-setup"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4"
          >
            {t("audit.setup_guide")}
          </a>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onRetry}
          disabled={loading || busy}
        >
          {loading
            ? t("integrations.details.refreshing")
            : t("integrations.details.refresh")}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onReconnect}
          disabled={loading || busy}
          pending={linking}
        >
          {linking
            ? t("auth.onboarding.gsc.opening_google")
            : t("integrations.details.use_a_different_google_account")}
        </Button>
      </div>
    </>
  );
}

export function hasNoGscWebsites(
  accounts: GooglePickerAccount[],
  loading: boolean,
  error: boolean,
) {
  return (
    !loading &&
    !error &&
    accounts.length > 0 &&
    accounts.every(
      (account) =>
        !account.requiresReconnect &&
        !account.unavailable &&
        account.properties.length === 0,
    )
  );
}
