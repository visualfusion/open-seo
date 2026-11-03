import type { KeywordIntent } from "@/types/keywords";
import { Badge } from "@/client/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/client/components/ui/tooltip";
import { useLocale } from "@/client/lib/i18n";

const VARIANTS: Record<
  KeywordIntent,
  "info" | "warning" | "success" | "soft" | "secondary"
> = {
  informational: "info",
  commercial: "warning",
  transactional: "success",
  navigational: "soft",
  unknown: "secondary",
};

export function IntentBadge({ intent }: { intent: KeywordIntent }) {
  const { t } = useLocale();

  const label = t(`keywords.intents.${intent}.label`);
  const description = t(`keywords.intents.${intent}.description`);
  const shortLabel = t(`keywords.intents.${intent}.short`);

  return (
    <Tooltip>
      <TooltipTrigger
        delay={0}
        render={
          <Badge
            variant={VARIANTS[intent]}
            tabIndex={0}
            className="h-6 min-w-11 cursor-help font-semibold"
          />
        }
        aria-label={t("ui.details.value_search_intent", { v1: label })}
      >
        {shortLabel}
      </TooltipTrigger>
      <TooltipContent className="flex-col items-start gap-1">
        <span className="font-semibold">{label}</span>
        <span>{description}</span>
      </TooltipContent>
    </Tooltip>
  );
}
