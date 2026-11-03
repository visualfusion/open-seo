import { Archive, Pause, Pencil, Play } from "lucide-react";
import { useLocale } from "@/client/lib/i18n";
import { RowActionsMenu } from "@/client/components/RowActionsMenu";
import { DropdownMenuItem } from "@/client/components/ui/dropdown-menu";

/** The dots menu of a prompt or topic row in the tracked prompts table. */
export function PromptActionsMenu({
  label,
  kind,
  paused,
  scheduled,
  pending,
  onEdit,
  onTogglePause,
  onArchive,
}: {
  label: string;
  kind: "prompt" | "topic";
  paused: boolean;
  /** Pausing only skips scheduled runs, so it needs a schedule. */
  scheduled: boolean;
  pending: boolean;
  onEdit?: () => void;
  onTogglePause: () => void;
  onArchive: () => void;
}) {
  const { t } = useLocale();
  return (
    <RowActionsMenu label={label}>
      {onEdit && (
        <DropdownMenuItem onClick={onEdit}>
          <Pencil />
          {kind === "topic"
            ? t("ai_visibility.topic_rename")
            : t("ai_visibility.prompt_edit")}
        </DropdownMenuItem>
      )}
      <DropdownMenuItem
        disabled={pending || (!paused && !scheduled)}
        onClick={onTogglePause}
      >
        {paused ? <Play /> : <Pause />}
        {paused
          ? kind === "topic"
            ? t("ai_visibility.topic_resume")
            : t("ai_visibility.prompt_resume")
          : kind === "topic"
            ? t("ai_visibility.topic_pause")
            : t("ai_visibility.prompt_pause")}
      </DropdownMenuItem>
      <DropdownMenuItem
        variant="destructive"
        disabled={pending}
        onClick={onArchive}
      >
        <Archive />
        {kind === "topic"
          ? t("ai_visibility.topic_archive")
          : t("ai_visibility.prompt_archive")}
      </DropdownMenuItem>
    </RowActionsMenu>
  );
}
