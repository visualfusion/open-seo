import { useLocale } from "@/client/lib/i18n";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { CopyButton } from "@/client/components/CopyButton";
import { Button } from "@/client/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/client/components/ui/dialog";
import { Step } from "@/client/features/every-app/Step";
import { organizationContextQueryOptions } from "@/client/features/team/organizationQueries";
import { getStandardErrorMessage } from "@/client/lib/error-messages";
import { hasOrgPermission } from "@/lib/org-permissions";
import { createEveryAppTransferCode } from "@/serverFunctions/everyAppTransfer";
import { version } from "../../../../package.json";

/**
 * The Import from self-hosted OpenSEO row in Settings → Every App, for owners
 * and admins: the transfer code a self-hosted OpenSEO pastes into its Move to
 * Every App dialog.
 */
export function ImportFromSelfHosted() {
  const { t } = useLocale();
  const { data: organization } = useQuery(organizationContextQueryOptions());
  const [open, setOpen] = useState(false);
  if (
    !organization ||
    !hasOrgPermission(organization.role, { organization: ["update"] })
  ) {
    return null;
  }
  return (
    <>
      <div className="flex items-start justify-between gap-6">
        <div>
          <p className="text-sm">
            {t("settings.import_from_self_hosted_openseo")}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("settings.bring_over_the_projects_history_and_chats")}
          </p>
        </div>
        <Button size="sm" variant="outline" onClick={() => setOpen(true)}>
          {t("settings.import")}
        </Button>
      </div>
      {open ? <ImportDialog onClose={() => setOpen(false)} /> : null}
    </>
  );
}

function ImportDialog({ onClose }: { onClose: () => void }) {
  const { t } = useLocale();
  const createCode = useMutation({
    mutationFn: () => createEveryAppTransferCode(),
  });
  const code = createCode.data?.code;
  // The server makes no code while another move is still sending.
  const moveRunning = createCode.data === null;
  return (
    <Dialog open onOpenChange={(next) => !next && onClose()}>
      <DialogContent className="grid-cols-1 sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {t("settings.import_from_self_hosted_openseo")}
          </DialogTitle>
          <DialogDescription>
            {t("settings.copies_its_projects_and_their_history_here")}
          </DialogDescription>
        </DialogHeader>
        <ol className="space-y-4">
          <Step
            number={1}
            title={t("settings.update_your_self_hosted_openseo_to_v", {
              version,
            })}
          />
          <Step number={2} title={t("settings.create_a_transfer_code")}>
            {code ? (
              <>
                <div className="flex items-center gap-2">
                  <code
                    className="min-w-0 flex-1 overflow-x-auto rounded bg-muted px-2.5 py-2 font-mono text-xs whitespace-nowrap"
                    data-ph-mask
                  >
                    {code}
                  </code>
                  <CopyButton
                    value={code}
                    successMessage={t("settings.transfer_code_copied")}
                    label={t("settings.copy_transfer_code")}
                    variant="ghost"
                    size="icon-sm"
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  {t("settings.works_once_for_24_hours")}
                </p>
              </>
            ) : (
              <Button
                variant="outline"
                disabled={createCode.isPending}
                onClick={() => createCode.mutate()}
              >
                {t("settings.create_code")}
              </Button>
            )}
            {moveRunning ? (
              <p className="text-sm text-destructive" role="alert">
                {t("settings.a_move_is_already_running_try_again")}
              </p>
            ) : null}
            {createCode.isError ? (
              <p className="text-sm text-destructive" role="alert">
                {getStandardErrorMessage(createCode.error)}
              </p>
            ) : null}
          </Step>
          <Step
            number={3}
            title={t("settings.paste_it_in_your_self_hosted_openseo")}
          >
            <p className="text-sm text-muted-foreground">
              {t("settings.settings_move_to_every_app_i_have")}
            </p>
          </Step>
        </ol>
        <DialogFooter>
          <Button variant={code ? "default" : "ghost"} onClick={onClose}>
            {code ? t("settings.done") : t("settings.cancel")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
