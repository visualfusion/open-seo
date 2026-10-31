import { useMemo } from "react";
import { useLocale } from "@/client/lib/i18n";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/client/components/ui/select";
import {
  RESEARCH_SCOPES,
  RESEARCH_SCOPE_DESCRIPTIONS,
  RESEARCH_SCOPE_EXAMPLES,
  type ResearchScope,
} from "@/shared/researchScope";

type Props = {
  value: ResearchScope;
  onChange: (scope: ResearchScope) => void;
  /** Greys the whole control (e.g. a brand-keyword lookup) with this reason. */
  disabledReason?: string;
  className?: string;
  "aria-label"?: string;
};

/**
 * The shared research-scope selector: Exact URL / Subfolder / Domain /
 * Subdomains. Each option explains what it covers. Every research input that
 * accepts a URL or domain renders this next to the input so scope is explicit
 * instead of inferred.
 */
export function ResearchScopeSelect({
  value,
  onChange,
  disabledReason,
  className,
  "aria-label": ariaLabel,
}: Props) {
  const { t } = useLocale();

  const scopeLabels = useMemo<
    Record<ResearchScope, { label: string; description: string }>
  >(
    () => ({
      exact_url: {
        label: t("domain.scopes.exact_url"),
        description:
          t("domain.scopes.exact_url_desc") ||
          RESEARCH_SCOPE_DESCRIPTIONS.exact_url,
      },
      subfolder: {
        label: t("domain.scopes.subfolder"),
        description:
          t("domain.scopes.subfolder_desc") ||
          RESEARCH_SCOPE_DESCRIPTIONS.subfolder,
      },
      domain: {
        label: t("domain.scopes.domain"),
        description:
          t("domain.scopes.domain_desc") || RESEARCH_SCOPE_DESCRIPTIONS.domain,
      },
      subdomains: {
        label: t("domain.scopes.subdomains"),
        description:
          t("domain.scopes.subdomains_desc") ||
          RESEARCH_SCOPE_DESCRIPTIONS.subdomains,
      },
    }),
    [t],
  );

  const scopeItems = useMemo(
    () =>
      RESEARCH_SCOPES.map((scope) => ({
        value: scope,
        label: scopeLabels[scope].label,
      })),
    [scopeLabels],
  );

  return (
    <Select
      items={scopeItems}
      value={value}
      onValueChange={(scope) => {
        if (scope != null) onChange(scope);
      }}
      disabled={disabledReason != null}
    >
      <SelectTrigger
        className={className}
        aria-label={ariaLabel ?? t("domain.scopes.aria_label")}
        title={disabledReason}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent align="end" alignItemWithTrigger={false} className="w-72">
        {RESEARCH_SCOPES.map((scope) => (
          <SelectItem key={scope} value={scope} className="items-start py-1.5">
            <span className="flex flex-col whitespace-normal">
              <span>{scopeLabels[scope].label}</span>
              <span className="text-xs text-muted-foreground">
                {scopeLabels[scope].description}
              </span>
              <span className="font-mono text-xs text-muted-foreground/70">
                {RESEARCH_SCOPE_EXAMPLES[scope]}
              </span>
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
