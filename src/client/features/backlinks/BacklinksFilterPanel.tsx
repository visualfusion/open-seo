import { useId } from "react";
import { Link, Link2, Unlink } from "lucide-react";
import { useLocale } from "@/client/lib/i18n";
import { SegmentedToggle } from "@/client/components/SegmentedToggle";
import { DataTableFilterGroup } from "@/client/components/table/DataTableToolbar";
import { Checkbox } from "@/client/components/ui/checkbox";
import { Label } from "@/client/components/ui/label";
import { DomainFilterPanel } from "@/client/features/domain/components/DomainFilterPanel";
import type { BacklinksTab } from "@/types/schemas/backlinks";
import {
  BACKLINKS_FILTER_FIELDS,
  REFERRING_DOMAINS_FILTER_FIELDS,
  TOP_PAGES_FILTER_FIELDS,
  countFilterConditions,
  type BacklinksTabFilterValues,
} from "./backlinksFilterTypes";
import type { BacklinksFiltersState } from "./useBacklinksFilters";

/**
 * Filters are applied explicitly (not per keystroke) because every change
 * triggers a billed DataForSEO request. Each include/exclude term and each
 * set field costs one DataForSEO filter condition, capped per request —
 * DomainFilterPanel surfaces the count and gates Apply.
 */
export function BacklinksFilterPanel({
  activeTab,
  filters,
  onApplied,
  maxConditions,
}: {
  activeTab: BacklinksTab;
  filters: BacklinksFiltersState;
  onApplied: () => void;
  /** Scope filters can consume part of the DataForSEO condition budget. */
  maxConditions?: number;
}) {
  const { t } = useLocale();

  if (activeTab === "backlinks") {
    const state = filters.backlinks;
    return (
      <DomainFilterPanel
        key="backlinks"
        appliedFilters={state.values}
        fields={BACKLINKS_FILTER_FIELDS}
        activeFilterCount={state.activeFilterCount}
        countConditions={countFilterConditions}
        maxConditions={maxConditions}
        textFields={[
          {
            key: "include",
            label: t("backlinks.filters.source_url_contains"),
            placeholder: t("backlinks.filters.source_url_contains_placeholder"),
          },
          {
            key: "exclude",
            label: t("backlinks.filters.source_url_excludes"),
            placeholder: t("backlinks.filters.source_url_excludes_placeholder"),
          },
        ]}
        rangeFields={[
          {
            title: t("backlinks.filters.domain_authority"),
            minKey: "minDomainRank",
            maxKey: "maxDomainRank",
          },
          {
            title: t("backlinks.filters.link_authority"),
            minKey: "minLinkAuthority",
            maxKey: "maxLinkAuthority",
          },
          {
            title: t("backlinks.filters.spam_score"),
            minKey: "minSpamScore",
            maxKey: "maxSpamScore",
            step: "0.1",
          },
        ]}
        onApply={(values) => {
          state.apply(values);
          onApplied();
        }}
        onClear={() => {
          state.reset();
          onApplied();
        }}
        renderExtra={(draft, setValue) => (
          <BacklinksToggleControls draft={draft} setValue={setValue} />
        )}
      />
    );
  }

  if (activeTab === "domains") {
    const state = filters.domains;
    return (
      <DomainFilterPanel
        key="domains"
        appliedFilters={state.values}
        fields={REFERRING_DOMAINS_FILTER_FIELDS}
        activeFilterCount={state.activeFilterCount}
        countConditions={countFilterConditions}
        maxConditions={maxConditions}
        textFields={[
          {
            key: "include",
            label: t("backlinks.filters.domain_contains"),
            placeholder: t("backlinks.filters.domain_contains_placeholder"),
          },
          {
            key: "exclude",
            label: t("backlinks.filters.domain_excludes"),
            placeholder: t("backlinks.filters.domain_excludes_placeholder"),
          },
        ]}
        rangeFields={[
          {
            title: t("backlinks.filters.backlinks"),
            minKey: "minBacklinks",
            maxKey: "maxBacklinks",
          },
          {
            title: t("backlinks.filters.rank"),
            minKey: "minRank",
            maxKey: "maxRank",
          },
          {
            title: t("backlinks.filters.spam_score"),
            minKey: "minSpamScore",
            maxKey: "maxSpamScore",
            step: "0.1",
          },
        ]}
        onApply={(values) => {
          state.apply(values);
          onApplied();
        }}
        onClear={() => {
          state.reset();
          onApplied();
        }}
      />
    );
  }

  const state = filters.pages;
  return (
    <DomainFilterPanel
      key="pages"
      appliedFilters={state.values}
      fields={TOP_PAGES_FILTER_FIELDS}
      activeFilterCount={state.activeFilterCount}
      countConditions={countFilterConditions}
      maxConditions={maxConditions}
      textFields={[
        {
          key: "include",
          label: t("backlinks.filters.page_url_contains"),
          placeholder: t("backlinks.filters.page_url_contains_placeholder"),
        },
        {
          key: "exclude",
          label: t("backlinks.filters.page_url_excludes"),
          placeholder: t("backlinks.filters.page_url_excludes_placeholder"),
        },
      ]}
      rangeFields={[
        {
          title: t("backlinks.filters.backlinks"),
          minKey: "minBacklinks",
          maxKey: "maxBacklinks",
        },
        {
          title: t("backlinks.filters.referring_domains"),
          minKey: "minReferringDomains",
          maxKey: "maxReferringDomains",
        },
        {
          title: t("backlinks.filters.rank"),
          minKey: "minRank",
          maxKey: "maxRank",
        },
      ]}
      onApply={(values) => {
        state.apply(values);
        onApplied();
      }}
      onClear={() => {
        state.reset();
        onApplied();
      }}
    />
  );
}

function BacklinksToggleControls({
  draft,
  setValue,
}: {
  draft: BacklinksTabFilterValues;
  setValue: (key: keyof BacklinksTabFilterValues, value: string) => void;
}) {
  const { t } = useLocale();

  const linkTypeItems = [
    {
      value: "all",
      icon: <Link2 />,
      label: t("backlinks.filters.link_type_all"),
    },
    {
      value: "dofollow",
      icon: <Link />,
      label: t("backlinks.filters.link_type_dofollow"),
    },
    {
      value: "nofollow",
      icon: <Unlink />,
      label: t("backlinks.filters.link_type_nofollow"),
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
      <DataTableFilterGroup label={t("backlinks.filters.link_type")}>
        <SegmentedToggle
          showLabels
          items={linkTypeItems}
          value={draft.linkType || "all"}
          onChange={(value) =>
            setValue("linkType", value === "all" ? "" : value)
          }
        />
      </DataTableFilterGroup>

      <DataTableFilterGroup label={t("backlinks.filters.visibility")}>
        <div className="flex h-7 items-center gap-4">
          <VisibilityCheckbox
            label={t("backlinks.filters.hide_lost")}
            checked={draft.hideLost === "true"}
            onCheckedChange={(checked) =>
              setValue("hideLost", checked ? "true" : "")
            }
          />
          <VisibilityCheckbox
            label={t("backlinks.filters.hide_broken")}
            checked={draft.hideBroken === "true"}
            onCheckedChange={(checked) =>
              setValue("hideBroken", checked ? "true" : "")
            }
          />
        </div>
      </DataTableFilterGroup>
    </div>
  );
}

function VisibilityCheckbox({
  label,
  checked,
  onCheckedChange,
}: {
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}) {
  const id = useId();
  return (
    <div className="flex items-center gap-2">
      <Checkbox id={id} checked={checked} onCheckedChange={onCheckedChange} />
      <Label htmlFor={id} className="text-xs font-normal">
        {label}
      </Label>
    </div>
  );
}
