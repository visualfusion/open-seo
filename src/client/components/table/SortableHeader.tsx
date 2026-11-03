import { getTranslation } from "@/client/lib/i18n";
import { ArrowDown, ArrowUp } from "lucide-react";
import { HelpLabel } from "@/client/components/HelpLabel";

type SortableColumn = {
  getIsSorted: () => false | "asc" | "desc";
  getToggleSortingHandler: () => ((event: unknown) => void) | undefined;
};

export function SortableHeader({
  column,
  label,
  helpText,
  title,
  align,
  className,
}: {
  column: SortableColumn;
  label: string;
  helpText?: string;
  /** Native tooltip, for tables that don't use the floating help label. */
  title?: string;
  align?: "left" | "right";
  className?: string;
}) {
  const sorted = column.getIsSorted();
  const content = (
    <button
      type="button"
      className={`inline-flex items-center gap-1 font-medium transition-colors hover:text-foreground ${className ?? ""}`}
      onClick={column.getToggleSortingHandler()}
      title={title}
      aria-label={getTranslation("ui.details.sort_by_value", undefined, {
        v1: label,
      })}
      aria-pressed={!!sorted}
    >
      {helpText ? <HelpLabel label={label} helpText={helpText} /> : label}
      {sorted === "asc" ? (
        <ArrowUp className="size-3 shrink-0" />
      ) : sorted === "desc" ? (
        <ArrowDown className="size-3 shrink-0" />
      ) : null}
    </button>
  );

  if (align === "right") {
    return <span className="flex w-full justify-end">{content}</span>;
  }

  return content;
}
