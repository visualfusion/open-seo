import { useLocale } from "@/client/lib/i18n";
import type { ReactNode } from "react";
import { GoogleGlyph } from "@/client/features/gsc/GoogleGlyph";
import { Button } from "@/client/components/ui/button";

export function GoogleProjectEmptyState({
  name,
  hasGrant,
  disabled,
  canManage,
  prominent,
  onChoose,
  onLink,
  children,
}: {
  name: string;
  hasGrant: boolean;
  disabled: boolean;
  canManage: boolean;
  prominent?: boolean;
  onChoose: () => void;
  onLink: () => void;
  children?: ReactNode;
}) {
  const { t } = useLocale();
  return (
    <div className="flex flex-1 flex-col gap-4">
      <p className="text-sm text-muted-foreground">
        {hasGrant
          ? t("integrations.details.choose_a_value_property_this_project", {
              v1: name,
            })
          : t("integrations.details.connect_value_to_see_s_data", { v1: name })}
      </p>
      {/* Actions sit bottom-right, with Dismiss (children) just left of the
          connect action. */}
      <div className="mt-auto flex flex-wrap items-center justify-end gap-1">
        {children}
        {canManage || hasGrant ? (
          <Button
            variant={prominent ? "default" : "outline"}
            size={prominent ? "lg" : "sm"}
            onClick={hasGrant ? onChoose : onLink}
            pending={disabled}
          >
            {disabled || hasGrant ? null : prominent ? (
              // The white chip keeps the brand colours readable on a primary
              // button.
              <span className="flex size-6 items-center justify-center rounded-full bg-white">
                <GoogleGlyph className="size-4" />
              </span>
            ) : (
              <GoogleGlyph className="size-[18px]" />
            )}
            {disabled
              ? t("auth.onboarding.gsc.opening_google")
              : canManage
                ? hasGrant
                  ? t("integrations.details.choose_property")
                  : t("settings.crawler_access.connect")
                : t("integrations.details.manage_google_accounts")}
          </Button>
        ) : null}
      </div>
    </div>
  );
}
