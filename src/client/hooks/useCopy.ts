import { useLocale } from "@/client/lib/i18n";
import { useRef, useState } from "react";
import { toast } from "sonner";

/**
 * Copies text to the clipboard with a toast. `copied` stays true for two
 * seconds after a copy, for a check mark on the button.
 */
export function useCopy() {
  const { t } = useLocale();
  const [copied, setCopied] = useState(false);
  const resetTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const copy = async (value: string, successMessage: string) => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      toast.error(t("ui.details.could_not_copy_to_clipboard"));
      return false;
    }
    toast.success(successMessage);
    setCopied(true);
    // A second copy restarts the two seconds.
    clearTimeout(resetTimer.current);
    resetTimer.current = setTimeout(() => setCopied(false), 2000);
    return true;
  };

  return { copied, copy };
}
