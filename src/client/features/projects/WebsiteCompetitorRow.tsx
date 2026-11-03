import { Check, Pencil, Trash2 } from "lucide-react";
import { DomainFavicon } from "@/client/features/ai-visibility/DomainFavicon";
import { Button } from "@/client/components/ui/button";
import { Input } from "@/client/components/ui/input";
import { TableCell, TableRow } from "@/client/components/ui/table";
import { useLocale } from "@/client/lib/i18n";

export type WebsiteCompetitor = {
  id: string;
  name: string;
  domain: string;
  notes: string;
};

export function WebsiteCompetitorRow({
  competitor,
  index,
  editing,
  onChange,
  onEdit,
  onRemove,
}: {
  competitor: WebsiteCompetitor;
  index: number;
  editing: boolean;
  onChange: (competitor: WebsiteCompetitor) => void;
  onEdit: () => void;
  onRemove: () => void;
}) {
  const { t } = useLocale();
  return (
    <TableRow>
      <TableCell>
        <span className="flex items-center gap-2">
          <DomainFavicon domain={competitor.domain} />
          {editing ? (
            <Input
              autoFocus
              aria-label={t("context.website_setup.competitor_name_aria", {
                index: index + 1,
              })}
              placeholder={t(
                "context.website_setup.competitor_name_placeholder",
              )}
              required
              maxLength={120}
              value={competitor.name}
              onChange={(event) =>
                onChange({ ...competitor, name: event.target.value })
              }
            />
          ) : (
            <span className="font-medium">{competitor.name}</span>
          )}
        </span>
      </TableCell>
      <TableCell>
        {editing ? (
          <Input
            aria-label={t("context.website_setup.competitor_website_aria", {
              index: index + 1,
            })}
            placeholder={t("context.competitors.domain_placeholder")}
            required
            maxLength={255}
            value={competitor.domain}
            onChange={(event) =>
              onChange({ ...competitor, domain: event.target.value, notes: "" })
            }
          />
        ) : (
          <span className="text-muted-foreground">{competitor.domain}</span>
        )}
      </TableCell>
      <TableCell className="w-20">
        <div className="flex items-center justify-end gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label={
              editing
                ? t("context.website_setup.competitor_done_aria")
                : t("context.website_setup.competitor_edit_aria", {
                    name: competitor.name,
                  })
            }
            disabled={
              editing && (!competitor.name.trim() || !competitor.domain.trim())
            }
            onClick={onEdit}
          >
            {editing ? (
              <Check className="size-4" />
            ) : (
              <Pencil className="size-4" />
            )}
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label={t("context.website_setup.competitor_remove_aria", {
              name:
                competitor.name ||
                t("context.website_setup.competitor_fallback_name", {
                  index: index + 1,
                }),
            })}
            onClick={onRemove}
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
