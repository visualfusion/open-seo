export const teamEn = {
  table: {
    active: "Active",
    invitation_resent: "Invitation resent",
    remove_success: "Member removed",
    invitation_canceled: "Invitation canceled",
    member: "Member",
    role: "Role",
    status: "Status",
    you: "(you)",
    actions_for_member: "Actions for {email}",
    transfer_ownership: "Transfer ownership",
    remove_member: "Remove member",
    remove_confirm_title: "Remove {email} from this organization?",
    remove_confirm_desc:
      "They lose access immediately. Search Console and Google Analytics connections made with their Google account are disconnected.",
    invited: "Invited · expires {date}",
    actions_for_invitation: "Actions for the invitation to {email}",
    resend: "Resend invitation",
    cancel_invitation: "Cancel invitation",
  },
  invite_modal: {
    email_invalid: "Enter a valid email address.",
    rate_limited: "Invitation limit reached for today. Try again tomorrow.",
    upstream_error:
      "The invitation was saved but the email couldn't be sent. Use Resend in a moment to retry.",
    send_error: "We couldn't send that invitation.",
    link_copied: "Invitation link copied",
    link_title: "Invitation link",
    invitation_sent: "Invitation sent",
    already_member: "This person is already a member.",
    title_link: "Invite link",
    title: "Invite teammate",
    description_link:
      "Share this link with your teammate to join your organization.",
    description: "Send an invitation to join your organization.",
    email_label: "Email address",
    email_placeholder: "colleague@company.com",
    cancel: "Cancel",
    submit_link: "Generate invite link",
    submit: "Send invitation",
  },
  error_loading: "We couldn't load your team right now.",
  title: "Members",
  invite_button: "Invite teammate",
  description:
    "Teammates join as Admins. Admins have full access to each project except for billing.",
  permission_hint: "invite or remove teammates",
  roles: {
    owner: "Owner",
    admin: "Admin",
    member: "Member",
  },
  transfer_modal: {
    success: "{name} is now the owner",
    error_team_changed:
      "Your team changed while this was open. Ownership didn't change.",
    error_generic: "We couldn't transfer ownership. Ownership didn't change.",
    title: "Transfer ownership?",
    description_1:
      "{name} becomes the owner of this organization and manages its billing. You become an Admin and keep full access to each project.",
    description_2:
      "Projects, data, and the subscription stay with the organization. Only the new owner can transfer ownership again.",
    cancel: "Cancel",
    submit: "Transfer ownership",
  },
};
