import { formatRelativeTime } from "@/client/lib/relative-time";
import { useId } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Copy, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/client/components/ConfirmDialog";
import { Button } from "@/client/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/client/components/ui/dialog";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
} from "@/client/components/ui/field";
import { Input } from "@/client/components/ui/input";
import { Switch } from "@/client/components/ui/switch";
import { getStandardErrorMessage } from "@/client/lib/error-messages";
import { useLocale, getTranslation } from "@/client/lib/i18n";
import { captureClientEvent } from "@/client/lib/posthog";
import {
  deleteReport,
  shareReport,
  unshareReport,
  type ReportListItem,
} from "@/serverFunctions/reports";
import { sharePath } from "@/shared/report-share";

// Query keys for the reports and templates pages. staleTime is 0 wherever these are used:
// the pages exist to inspect what an agent just wrote, so the app-wide
// five-minute staleTime would show a pre-save list as current.
export const reportsQueryKey = (projectId: string) =>
  ["reports", projectId] as const;

export const reportQueryKey = (projectId: string, reportId: string) =>
  ["report", projectId, reportId] as const;

export const reportTemplatesQueryKey = (projectId: string) =>
  ["report-templates", projectId] as const;

/**
 * "Ben · Claude Code". The person is the half that means something (it comes
 * from the session); the client half is a self-reported hint, so it stands
 * alone when the user cannot be resolved.
 */
export function formatCreatedBy(report: ReportListItem): string {
  return report.createdByName
    ? `${report.createdByName} · ${report.createdBy}`
    : report.createdBy;
}

/**
 * One delete flow for both the list row and the detail page, so the toast, the
 * event and the invalidation cannot drift apart.
 */
export function useDeleteReport(projectId: string, onDeleted?: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (reportId: string) =>
      deleteReport({ data: { projectId, reportId } }),
    onSuccess: (_result, reportId) => {
      captureClientEvent("report:deleted", {
        project_id: projectId,
        report_id: reportId,
      });
      toast.success(getTranslation("reports.report_deleted_toast"));
      void queryClient.invalidateQueries({
        queryKey: reportsQueryKey(projectId),
      });
      // Drop the detail entry too, or a later visit to that URL renders the
      // deleted report from cache before the refetch turns it into a 404.
      queryClient.removeQueries({
        queryKey: reportQueryKey(projectId, reportId),
      });
      onDeleted?.();
    },
  });
}

/** Reports have no version history and no undo, so deletes are confirmed by name. */
export function DeleteReportModal({
  title,
  isPending,
  onClose,
  onConfirm,
}: {
  title: string;
  isPending: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  const { t } = useLocale();

  return (
    <ConfirmDialog
      title={t("reports.delete_report_confirm_title", { title })}
      confirmLabel={t("reports.delete_report")}
      destructive
      pending={isPending}
      onClose={onClose}
      onConfirm={onConfirm}
    >
      {t("reports.delete_report_confirm_desc")}
    </ConfirmDialog>
  );
}

/**
 * The share toggle. The link is built from the browser's own origin, so the
 * same report shares correctly from app.openseo.so and from a self-hosted
 * hostname without the server knowing either.
 */
export function ShareReportModal({
  report,
  onClose,
}: {
  report: Pick<
    ReportListItem,
    "id" | "projectId" | "title" | "shareToken" | "sharedAt"
  >;
  onClose: () => void;
}) {
  const { t } = useLocale();
  const queryClient = useQueryClient();
  const switchId = useId();
  const { projectId, id: reportId } = report;
  // Share and unshare in one mutation, keyed by the state the toggle is moving
  // to. The response is written straight into the report query so the modal
  // shows the new link without waiting for a refetch; the list is invalidated
  // because its rows carry the same metadata.
  const mutation = useMutation({
    meta: { errorToast: false },
    mutationFn: (shared: boolean) =>
      shared
        ? shareReport({ data: { projectId, reportId } })
        : unshareReport({ data: { projectId, reportId } }),
    onSuccess: (result) => {
      // No client event here: the service already captures report:shared and
      // report:unshared server-side, and a second one would double the count.
      queryClient.setQueryData(
        reportQueryKey(projectId, reportId),
        (previous: ReportListItem | undefined) =>
          previous ? { ...previous, ...result } : previous,
      );
      void queryClient.invalidateQueries({
        queryKey: reportsQueryKey(projectId),
      });
    },
  });
  // The toggle follows the click while the mutation is in flight — a round
  // trip that leaves the switch sitting in its old position reads as broken.
  const shared = Boolean(report.shareToken);
  const url = report.shareToken
    ? `${window.location.origin}${sharePath(report.shareToken)}`
    : "";

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success(t("reports.link_copied"));
    } catch {
      toast.error(t("reports.clipboard_not_available"));
    }
  };

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="min-w-0 pr-8">
          <DialogTitle>{t("reports.share")}</DialogTitle>
          <DialogDescription className="truncate">
            {report.title}
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-lg border border-border">
          <Field orientation="horizontal" className="p-4">
            <FieldContent>
              <FieldLabel htmlFor={switchId}>
                {t("reports.public_link")}
              </FieldLabel>
              <FieldDescription id={`${switchId}-description`}>
                {shared
                  ? t("reports.share_desc_public")
                  : t("reports.share_desc_private")}
              </FieldDescription>
            </FieldContent>
            <Switch
              id={switchId}
              aria-describedby={`${switchId}-description`}
              checked={mutation.isPending ? mutation.variables : shared}
              disabled={mutation.isPending}
              onCheckedChange={(checked) => mutation.mutate(checked)}
            />
          </Field>

          {shared ? (
            <div className="space-y-3 border-t border-border p-4">
              {/* The field wraps onto its own line when the row gets narrow, so
                  the link stays readable on a phone instead of shrinking. */}
              <div className="flex flex-wrap items-stretch gap-2">
                <Input
                  readOnly
                  value={url}
                  aria-label={t("reports.share_link_aria")}
                  onFocus={(event) => event.target.select()}
                  className="min-w-0 flex-1 basis-64"
                />
                <div className="ml-auto flex items-stretch gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    nativeButton={false}
                    aria-label={t("reports.open_link")}
                    title={t("reports.open")}
                    render={<a href={url} target="_blank" rel="noreferrer" />}
                  >
                    <ExternalLink />
                  </Button>
                  <Button onClick={() => void copy()}>
                    <Copy data-icon="inline-start" />
                    {t("reports.copy_link")}
                  </Button>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                {t("reports.share_footer_note")}
                {report.sharedAt
                  ? t("reports.link_created", {
                      time: formatRelativeTime(report.sharedAt),
                    })
                  : ""}
              </p>
            </div>
          ) : null}
        </div>

        {/* Shown in place rather than as a toast: the message belongs next to
            the toggle that would not move. */}
        {mutation.isError ? (
          <p className="text-sm text-destructive">
            {getStandardErrorMessage(mutation.error, t("reports.share_error"))}
          </p>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
