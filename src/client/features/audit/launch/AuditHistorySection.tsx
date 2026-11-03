import { Link } from "@tanstack/react-router";
import type { UseQueryResult } from "@tanstack/react-query";
import { ScanSearch, Trash2 } from "lucide-react";
import type { getAuditHistory } from "@/serverFunctions/audit";
import { EmptyState } from "@/client/components/EmptyState";
import { QueryState } from "@/client/components/QueryState";
import { RowActionsMenu } from "@/client/components/RowActionsMenu";
import { DataTableToolbar } from "@/client/components/table/DataTableToolbar";
import { Badge } from "@/client/components/ui/badge";
import { Button } from "@/client/components/ui/button";
import { DropdownMenuItem } from "@/client/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCard,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/client/components/ui/table";
import { useLocale } from "@/client/lib/i18n";
import { formatDate, StatusBadge } from "@/client/features/audit/shared";

type AuditHistory = Awaited<ReturnType<typeof getAuditHistory>>;

export function AuditHistorySection({
  projectId,
  historyQuery,
  onDelete,
}: {
  projectId: string;
  historyQuery: UseQueryResult<AuditHistory>;
  onDelete: (auditId: string) => void;
}) {
  const { t } = useLocale();
  return (
    <QueryState
      query={historyQuery}
      errorFallback={t("audit.history.failed_to_load")}
    >
      {(history) => (
        <AuditHistoryTable
          projectId={projectId}
          history={history}
          onDelete={onDelete}
        />
      )}
    </QueryState>
  );
}

function AuditHistoryTable({
  projectId,
  history,
  onDelete,
}: {
  projectId: string;
  history: AuditHistory;
  onDelete: (auditId: string) => void;
}) {
  const { t, locale } = useLocale();
  if (history.length === 0) {
    return (
      <EmptyState
        icon={ScanSearch}
        title={t("audit.history.no_audits_title")}
      />
    );
  }

  return (
    <TableCard>
      <DataTableToolbar>
        <h2 className="text-sm font-semibold">
          {t("audit.history.previous_audits")}
        </h2>
      </DataTableToolbar>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("common.date")}</TableHead>
            <TableHead>{t("common.url")}</TableHead>
            <TableHead>{t("common.status")}</TableHead>
            <TableHead>{t("audit.pages")}</TableHead>
            <TableHead>{t("audit.phases.lighthouse")}</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {history.map((audit) => (
            <TableRow key={audit.id} className="group">
              <TableCell className="text-xs text-muted-foreground">
                {formatDate(audit.startedAt, locale)}
              </TableCell>
              <TableCell className="max-w-[220px] truncate">
                {audit.startUrl}
              </TableCell>
              <TableCell>
                <StatusBadge status={audit.status} />
              </TableCell>
              <TableCell>{audit.pagesTotal || audit.pagesCrawled}</TableCell>
              <TableCell>
                {audit.ranLighthouse ? (
                  <Badge variant="outline" size="sm">
                    {t("audit.yes")}
                  </Badge>
                ) : null}
              </TableCell>
              <TableCell>
                <HistoryActions
                  projectId={projectId}
                  auditId={audit.id}
                  onDelete={onDelete}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableCard>
  );
}

function HistoryActions({
  projectId,
  auditId,
  onDelete,
}: {
  projectId: string;
  auditId: string;
  onDelete: (auditId: string) => void;
}) {
  const { t, locale } = useLocale();
  return (
    <div className="flex items-center justify-end gap-2 reveal-on-hover">
      <Button
        size="xs"
        nativeButton={false}
        render={
          <Link
            to="/p/$projectId/audit"
            params={{ projectId }}
            search={{ auditId, tab: "pages" }}
          />
        }
      >
        {locale === "de" ? "Ansehen" : "View"}
      </Button>
      <RowActionsMenu label={t("audit.history.actions_label")}>
        <DropdownMenuItem
          variant="destructive"
          onClick={() => onDelete(auditId)}
        >
          <Trash2 />
          {t("audit.history.delete_audit")}
        </DropdownMenuItem>
      </RowActionsMenu>
    </div>
  );
}
