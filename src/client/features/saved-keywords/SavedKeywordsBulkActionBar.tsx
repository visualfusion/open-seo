import { Copy, FileDown, Sheet, Tags, Trash2 } from "lucide-react";
import {
  TableBulkActionBar,
  TableBulkActionButton,
  TableBulkExportMenu,
} from "@/client/components/table/TableBulkActionBar";
import { useLocale } from "@/client/lib/i18n";

export function SavedKeywordsBulkActionBar({
  selectedCount,
  onCopy,
  onOpenTags,
  onExportCsv,
  onExportSheets,
  onDelete,
  onClear,
  exportingSelection,
}: {
  selectedCount: number;
  onCopy: () => void;
  onOpenTags: () => void;
  onExportCsv: () => void;
  onExportSheets: () => void;
  onDelete: () => void;
  onClear: () => void;
  exportingSelection: boolean;
}) {
  const { t } = useLocale();
  if (selectedCount === 0) return null;

  return (
    <TableBulkActionBar
      selectedCount={selectedCount}
      onClear={onClear}
      actions={
        <>
          <div className="flex items-center gap-0.5 px-1.5">
            <TableBulkActionButton
              icon={<Tags className="size-3.5" />}
              onClick={onOpenTags}
            >
              {t("saved_keywords.bulk.tag_button")}
            </TableBulkActionButton>

            <TableBulkExportMenu
              busy={exportingSelection}
              actions={[
                {
                  label: t("saved_keywords.bulk.copy_keywords"),
                  icon: <Copy className="size-4" />,
                  onClick: onCopy,
                },
                {
                  label: t("saved_keywords.bulk.export_sheets"),
                  icon: <Sheet className="size-4" />,
                  onClick: onExportSheets,
                },
                {
                  label: t("saved_keywords.bulk.export_csv"),
                  icon: <FileDown className="size-4" />,
                  onClick: onExportCsv,
                },
              ]}
            />
          </div>

          <div className="flex items-center border-l border-border px-1.5">
            <TableBulkActionButton
              icon={<Trash2 className="size-3.5" />}
              onClick={onDelete}
              variant="danger"
            >
              {t("saved_keywords.bulk.delete_button")}
            </TableBulkActionButton>
          </div>
        </>
      }
    />
  );
}
