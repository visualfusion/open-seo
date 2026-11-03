import { Crown, Send, Trash2 } from "lucide-react";
import { useState } from "react";
import { ConfirmDialog } from "@/client/components/ConfirmDialog";
import { RowActionsMenu } from "@/client/components/RowActionsMenu";
import { Badge } from "@/client/components/ui/badge";
import { DropdownMenuItem } from "@/client/components/ui/dropdown-menu";
import { TableCell, TableRow } from "@/client/components/ui/table";
import { useLocale } from "@/client/lib/i18n";
import { hasOrgPermission } from "@/lib/org-permissions";

function formatRole(role: string, t: (key: string) => string) {
  return role
    .split(",")
    .map((name) => {
      const lower = name.trim().toLowerCase();
      if (lower === "owner") return t("team.roles.owner");
      if (lower === "admin") return t("team.roles.admin");
      if (lower === "member") return t("team.roles.member");
      return name.trim();
    })
    .join(", ");
}

export type Member = {
  id: string;
  userId: string;
  role: string;
  user: { name?: string | null; email: string };
};

type Invitation = {
  id: string;
  email: string;
  role?: string | null;
  expiresAt: Date | string;
};

export function MemberRow({
  member,
  isSelf,
  canManageTeam,
  isOwner,
  isRemoving,
  onRemove,
  onTransferOwnership,
}: {
  member: Member;
  isSelf: boolean;
  canManageTeam: boolean;
  isOwner: boolean;
  isRemoving: boolean;
  onRemove: () => void;
  onTransferOwnership: () => void;
}) {
  const { t } = useLocale();
  const memberIsOwner = hasOrgPermission(member.role, {
    billing: ["manage"],
  });
  // Owners are protected server-side (only an owner can touch an owner; the
  // last owner can't be removed) — don't render controls that would just 403.
  const canRemove = canManageTeam && !isSelf && (!memberIsOwner || isOwner);
  // Owners can always remove, so this only ever adds to the remove menu.
  const canTransferOwnership = isOwner && !isSelf && !memberIsOwner;
  const [isConfirmingRemove, setIsConfirmingRemove] = useState(false);

  return (
    <TableRow>
      <TableCell className="max-w-[280px]">
        <p className="truncate font-medium" data-ph-mask>
          {member.user.name || member.user.email}
          {isSelf ? (
            <span className="font-normal text-muted-foreground">
              {" "}
              {t("team.table.you")}
            </span>
          ) : null}
        </p>
        <p className="truncate text-xs text-muted-foreground" data-ph-mask>
          {member.user.email}
        </p>
      </TableCell>
      <TableCell>
        <Badge variant="secondary">{formatRole(member.role, t)}</Badge>
      </TableCell>
      <TableCell className="text-xs text-muted-foreground">
        {t("team.table.active")}
      </TableCell>
      <TableCell>
        {canRemove ? (
          <RowActionsMenu
            label={t("team.table.actions_for_member", {
              email: member.user.email,
            })}
          >
            {canTransferOwnership ? (
              <DropdownMenuItem onClick={onTransferOwnership}>
                <Crown />
                {t("team.table.transfer_ownership")}
              </DropdownMenuItem>
            ) : null}
            <DropdownMenuItem
              variant="destructive"
              disabled={isRemoving}
              onClick={() => setIsConfirmingRemove(true)}
            >
              <Trash2 />
              {t("team.table.remove_member")}
            </DropdownMenuItem>
          </RowActionsMenu>
        ) : null}
        {isConfirmingRemove ? (
          <ConfirmDialog
            title={t("team.table.remove_confirm_title", {
              email: member.user.email,
            })}
            confirmLabel={t("team.table.remove_member")}
            destructive
            onClose={() => setIsConfirmingRemove(false)}
            onConfirm={() => {
              setIsConfirmingRemove(false);
              onRemove();
            }}
          >
            {t("team.table.remove_confirm_desc")}
          </ConfirmDialog>
        ) : null}
      </TableCell>
    </TableRow>
  );
}

export function InvitationRow({
  invitation,
  canManageTeam,
  isResending,
  isCanceling,
  onResend,
  onCancel,
}: {
  invitation: Invitation;
  canManageTeam: boolean;
  isResending: boolean;
  isCanceling: boolean;
  onResend: () => void;
  onCancel: () => void;
}) {
  const { t } = useLocale();
  return (
    <TableRow>
      <TableCell className="max-w-[280px]">
        <p className="truncate font-medium" data-ph-mask>
          {invitation.email}
        </p>
      </TableCell>
      <TableCell>
        <Badge variant="secondary">
          {formatRole(invitation.role ?? "member", t)}
        </Badge>
      </TableCell>
      <TableCell className="text-xs text-muted-foreground">
        {t("team.table.invited", {
          date: new Date(invitation.expiresAt).toLocaleDateString(),
        })}
      </TableCell>
      <TableCell>
        {canManageTeam ? (
          <RowActionsMenu
            label={t("team.table.actions_for_invitation", {
              email: invitation.email,
            })}
          >
            <DropdownMenuItem disabled={isResending} onClick={onResend}>
              <Send />
              {t("team.table.resend")}
            </DropdownMenuItem>
            <DropdownMenuItem
              variant="destructive"
              disabled={isCanceling}
              onClick={onCancel}
            >
              <Trash2 />
              {t("team.table.cancel_invitation")}
            </DropdownMenuItem>
          </RowActionsMenu>
        ) : null}
      </TableCell>
    </TableRow>
  );
}
