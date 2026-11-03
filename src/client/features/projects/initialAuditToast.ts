import { toast } from "sonner";
import { getStandardErrorMessage } from "@/client/lib/error-messages";
import { getTranslation } from "@/client/lib/i18n";

/** Tells the user whether saving a website started its first site scan. */
export function toastInitialAudit(
  initialAudit:
    | { status: "started" | "pending" }
    | { status: "unavailable"; code: string }
    | null,
) {
  if (initialAudit?.status === "unavailable")
    toast.warning(getTranslation("projects.initial_audit.unavailable"), {
      description: getStandardErrorMessage(new Error(initialAudit.code)),
    });
  else if (initialAudit?.status === "started")
    toast.success(getTranslation("projects.initial_audit.started"));
}
