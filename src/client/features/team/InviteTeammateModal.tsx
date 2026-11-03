import { useMutation } from "@tanstack/react-query";
import { revalidateLogic } from "@tanstack/react-form";
import { toast } from "sonner";
import { z } from "zod";
import { useAppForm } from "@/client/components/form/useAppForm";
import { Button } from "@/client/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/client/components/ui/dialog";
import { getErrorCode } from "@/client/lib/error-messages";
import { captureClientEvent } from "@/client/lib/posthog";
import { isHostedClientAuthMode, usesBetterAuthClient } from "@/lib/auth-mode";
import { sendTeamInvitation } from "@/serverFunctions/organization";
import { useLocale, getTranslation } from "@/client/lib/i18n";

const inviteSchema = z.object({
  email: z
    .string()
    .trim()
    .email(getTranslation("team.invite_modal.email_invalid")),
});

export function inviteErrorMessage(error: Error) {
  const code = getErrorCode(error);
  if (code === "RATE_LIMITED") {
    return getTranslation("team.invite_modal.rate_limited");
  }
  if (code === "UPSTREAM_UNAVAILABLE") {
    return getTranslation("team.invite_modal.upstream_error");
  }
  return getTranslation("team.invite_modal.send_error");
}

// Without an email transport (the standalone Docker edition) the server hands
// back the invitation link for the inviter to pass on; with one, it was sent.
export function announceInvitation(
  result: { invitationId: string; inviteUrl?: string },
  sentMessage: string,
) {
  if (!result.inviteUrl) {
    toast.success(sentMessage);
    return;
  }
  const inviteUrl = result.inviteUrl;
  void (
    navigator.clipboard?.writeText(inviteUrl) ?? Promise.reject(new Error())
  ).then(
    () => toast.success(getTranslation("team.invite_modal.link_copied")),
    () =>
      toast.success(getTranslation("team.invite_modal.link_title"), {
        description: inviteUrl,
        duration: 20000,
      }),
  );
}

export function InviteTeammateModal({
  onClose,
  onInvited,
}: {
  onClose: () => void;
  onInvited: () => void;
}) {
  const { t } = useLocale();
  // Server function (not authClient.inviteMember): it enforces the daily send
  // limits and fails visibly when the invite email doesn't send.
  const inviteMutation = useMutation({
    mutationFn: (inviteeEmail: string) =>
      sendTeamInvitation({ data: { email: inviteeEmail } }),
    onSuccess: (result) => {
      captureClientEvent("team:invitation_send");
      announceInvitation(result, t("team.invite_modal.invitation_sent"));
      onInvited();
      onClose();
    },
    onError: (error: Error) => {
      if (getErrorCode(error) === "CONFLICT") {
        form.setErrorMap({
          onSubmit: {
            fields: { email: t("team.invite_modal.already_member") },
          },
        });
      } else {
        toast.error(inviteErrorMessage(error));
      }
      // An email-send failure still creates the pending row — show it.
      onInvited();
    },
  });

  const sharesLink = usesBetterAuthClient() && !isHostedClientAuthMode();

  const form = useAppForm({
    defaultValues: { email: "" },
    validationLogic: revalidateLogic(),
    validators: { onDynamic: inviteSchema },
    onSubmit: ({ value }) => inviteMutation.mutateAsync(value.email.trim()),
  });

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open && !inviteMutation.isPending) onClose();
      }}
    >
      <DialogContent showCloseButton={false} className="sm:max-w-md">
        <form.AppForm>
          <form.Form className="flex flex-col gap-4">
            <DialogHeader>
              <DialogTitle>
                {sharesLink
                  ? t("team.invite_modal.title_link")
                  : t("team.invite_modal.title")}
              </DialogTitle>
              <DialogDescription>
                {sharesLink
                  ? t("team.invite_modal.description_link")
                  : t("team.invite_modal.description")}
              </DialogDescription>
            </DialogHeader>
            <form.AppField name="email">
              {(field) => (
                <field.TextField
                  label={t("team.invite_modal.email_label")}
                  type="email"
                  placeholder={t("team.invite_modal.email_placeholder")}
                  required
                  autoFocus
                />
              )}
            </form.AppField>
            <DialogFooter>
              <Button
                variant="ghost"
                onClick={onClose}
                disabled={inviteMutation.isPending}
              >
                {t("team.invite_modal.cancel")}
              </Button>
              <form.SubmitButton>
                {sharesLink
                  ? t("team.invite_modal.submit_link")
                  : t("team.invite_modal.submit")}
              </form.SubmitButton>
            </DialogFooter>
          </form.Form>
        </form.AppForm>
      </DialogContent>
    </Dialog>
  );
}
