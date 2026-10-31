import { ChevronDown, Gauge, Link2, MoreHorizontal } from "lucide-react";
import { useLocale } from "@/client/lib/i18n";
import { Button } from "@/client/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/client/components/ui/dropdown-menu";
import { Spinner } from "@/client/components/ui/spinner";
import { DEFAULT_BACKLINKS_SPAM_THRESHOLD } from "@/types/schemas/backlinks";

export function BacklinksBestLinksMenu({
  hideSpam,
  onHideSpamChange,
}: {
  hideSpam: boolean;
  onHideSpamChange: (hideSpam: boolean) => void;
}) {
  const { t } = useLocale();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="ghost" size="sm" />}>
        <Link2 data-icon="inline-start" />
        {t("backlinks.toolbar.best_links_label", {
          status: hideSpam
            ? t("backlinks.toolbar.on")
            : t("backlinks.toolbar.off"),
        })}
        <ChevronDown data-icon="inline-end" className="opacity-60" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-72">
        <DropdownMenuRadioGroup
          value={hideSpam ? "best" : "all"}
          onValueChange={(value) => onHideSpamChange(value === "best")}
        >
          <DropdownMenuRadioItem value="best">
            <span>
              <span className="block">{t("backlinks.toolbar.best_only")}</span>
              <span className="block text-xs text-muted-foreground">
                {t("backlinks.toolbar.best_only_desc", {
                  threshold: DEFAULT_BACKLINKS_SPAM_THRESHOLD,
                })}
              </span>
            </span>
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="all">
            <span>
              <span className="block">{t("backlinks.toolbar.all_links")}</span>
              <span className="block text-xs text-muted-foreground">
                {t("backlinks.toolbar.all_links_desc", {
                  threshold: DEFAULT_BACKLINKS_SPAM_THRESHOLD,
                })}
              </span>
            </span>
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function BacklinksActionsMenu({
  isLoadingRatings,
  loadRatings,
  ratableDomains,
}: {
  isLoadingRatings: boolean;
  loadRatings: (domains: string[]) => void | Promise<void>;
  ratableDomains: string[];
}) {
  const { t } = useLocale();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={t("backlinks.toolbar.actions_aria_label")}
            title={t("backlinks.toolbar.actions_aria_label")}
          />
        }
      >
        <MoreHorizontal />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuItem
          onClick={() => void loadRatings(ratableDomains)}
          disabled={isLoadingRatings}
          title={t("backlinks.toolbar.ahrefs_dr_title")}
        >
          {isLoadingRatings ? <Spinner /> : <Gauge />}
          {t("backlinks.toolbar.ahrefs_dr")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
