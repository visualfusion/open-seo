import * as React from "react";
import { Badge } from "@/client/components/ui/badge";
import { FormActions } from "@/client/components/FormActions";
import { Input } from "@/client/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/client/components/ui/select";
import {
  KEY_PAGE_ROLES,
  type KeyPageRole,
  type ProjectContextUpdate,
} from "@/types/schemas/projectContext";
import { EditableListSection } from "./EditableListSection";
import { Provenance, useContextUpdate, type ContextKeyPage } from "./shared";
import { useLocale } from "@/client/lib/i18n";

const ROLE_LABEL_KEYS: Record<KeyPageRole, string> = {
  hub: "context.key_pages.role_hub",
  spoke: "context.key_pages.role_spoke",
  money: "context.key_pages.role_money",
  other: "context.key_pages.role_other",
};

type KeyPageDraft = {
  url: string;
  role: KeyPageRole;
  topic: string;
  notes: string;
};

export function KeyPagesSection({
  projectId,
  keyPages,
}: {
  projectId: string;
  keyPages: ContextKeyPage[];
}) {
  const { t } = useLocale();
  const update = useContextUpdate(projectId);

  const save = (
    previousUrl: string | null,
    draft: KeyPageDraft,
    close: () => void,
  ) => {
    const ops: ProjectContextUpdate[] = [];
    if (previousUrl && previousUrl !== draft.url.trim()) {
      ops.push({ removeKeyPages: [previousUrl] });
    }
    // Blank values clear stored fields. Omission would preserve agent writes.
    ops.push({
      addKeyPages: [
        {
          url: draft.url.trim(),
          role: draft.role,
          topic: draft.topic.trim(),
          notes: draft.notes.trim(),
        },
      ],
    });
    update.mutate(ops, { onSuccess: close });
  };

  return (
    <EditableListSection
      title={t("context.key_pages.title")}
      hint={t("context.key_pages.hint")}
      addLabel={t("context.key_pages.add_button")}
      emptyTitle={t("context.key_pages.empty_title")}
      emptyDescription={t("context.key_pages.empty_desc")}
      items={keyPages}
      getId={(item) => item.id}
      getLabel={(item) => item.url}
      pending={update.isPending}
      onRemove={(item) => update.mutate([{ removeKeyPages: [item.url] }])}
      renderItem={(item) => (
        <div className="min-w-0 space-y-0.5">
          <div className="flex flex-wrap items-baseline gap-x-2">
            <span className="truncate text-sm font-medium">{item.url}</span>
            <Badge variant="secondary" size="sm">
              {t(ROLE_LABEL_KEYS[item.role])}
            </Badge>
          </div>
          {item.topic ? (
            <p className="text-sm text-muted-foreground">
              {t("context.key_pages.target_prefix", { topic: item.topic })}
            </p>
          ) : null}
          {item.notes ? (
            <p className="text-sm text-muted-foreground">{item.notes}</p>
          ) : null}
          <Provenance by={item.updatedBy} at={item.updatedAt} />
        </div>
      )}
      renderForm={(item, close) => (
        <KeyPageForm
          initial={item}
          pending={update.isPending}
          onCancel={close}
          onSave={(draft) => save(item?.url ?? null, draft, close)}
        />
      )}
    />
  );
}

function KeyPageForm({
  initial,
  pending,
  onCancel,
  onSave,
}: {
  initial?: ContextKeyPage;
  pending: boolean;
  onCancel: () => void;
  onSave: (draft: KeyPageDraft) => void;
}) {
  const { t } = useLocale();
  const roleItems = KEY_PAGE_ROLES.map((role) => ({
    value: role,
    label: t(ROLE_LABEL_KEYS[role]),
  }));
  const [draft, setDraft] = React.useState<KeyPageDraft>({
    url: initial?.url ?? "",
    role: initial?.role ?? "other",
    topic: initial?.topic ?? "",
    notes: initial?.notes ?? "",
  });

  return (
    <form
      className="space-y-2 bg-muted/40 p-3"
      onSubmit={(event) => {
        event.preventDefault();
        if (!draft.url.trim() || pending) return;
        onSave(draft);
      }}
    >
      <Input
        autoFocus
        value={draft.url}
        onChange={(event) => setDraft({ ...draft, url: event.target.value })}
        placeholder={t("context.key_pages.url_placeholder")}
        maxLength={2048}
        aria-label={t("context.key_pages.url_aria")}
      />
      <div className="grid gap-2 sm:grid-cols-2">
        <Select
          items={roleItems}
          value={draft.role}
          onValueChange={(role) => {
            if (role !== null) setDraft({ ...draft, role });
          }}
        >
          <SelectTrigger
            className="w-full"
            aria-label={t("context.key_pages.role_aria")}
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {KEY_PAGE_ROLES.map((role) => (
              <SelectItem key={role} value={role}>
                {t(ROLE_LABEL_KEYS[role])}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          value={draft.topic}
          onChange={(event) =>
            setDraft({ ...draft, topic: event.target.value })
          }
          placeholder={t("context.key_pages.topic_placeholder")}
          maxLength={200}
          aria-label={t("context.key_pages.topic_aria")}
        />
      </div>
      <Input
        value={draft.notes}
        onChange={(event) => setDraft({ ...draft, notes: event.target.value })}
        placeholder={t("context.key_pages.notes_placeholder")}
        maxLength={500}
        aria-label={t("context.key_pages.notes_aria")}
      />
      <FormActions
        pending={pending}
        disabled={!draft.url.trim()}
        onCancel={onCancel}
        size="xs"
      />
    </form>
  );
}
