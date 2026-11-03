import { useLocale } from "@/client/lib/i18n";
import { cn } from "cn";
import { Loader2Icon } from "lucide-react";

function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
  const { t } = useLocale();
  return (
    <Loader2Icon
      data-slot="spinner"
      role="status"
      aria-label={t("ui.details.loading")}
      className={cn("size-4 animate-spin", className)}
      {...props}
    />
  );
}

export { Spinner };
