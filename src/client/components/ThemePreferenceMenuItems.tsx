import { useLocale } from "@/client/lib/i18n";
import type { ReactNode } from "react";
import { Monitor, Moon, Sun } from "lucide-react";
import { SegmentedToggle } from "@/client/components/SegmentedToggle";
import {
  DropdownMenuLabel,
  DropdownMenuGroup,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/client/components/ui/dropdown-menu";
import { type ThemePreference, useThemePreference } from "@/client/lib/theme";

const THEME_OPTIONS: {
  value: ThemePreference;
  label: string;
  icon: ReactNode;
}[] = [
  { value: "system", label: "common.system", icon: <Monitor /> },
  { value: "light", label: "common.light", icon: <Sun /> },
  { value: "dark", label: "common.dark", icon: <Moon /> },
];

/** System / Light / Dark segmented radio, shared by Settings and account menus. */
export function ThemePreferenceRadio() {
  const { t } = useLocale();
  const { themePreference, setThemePreference } = useThemePreference();

  return (
    <SegmentedToggle
      items={THEME_OPTIONS.map((item) => ({ ...item, label: t(item.label) }))}
      value={themePreference}
      onChange={setThemePreference}
    />
  );
}

export function ThemePreferenceDropdownItems() {
  const { t } = useLocale();
  const { themePreference, setThemePreference } = useThemePreference();

  return (
    <DropdownMenuGroup>
      <DropdownMenuLabel>{t("common.theme")}</DropdownMenuLabel>
      <DropdownMenuRadioGroup
        value={themePreference}
        onValueChange={(value) => {
          const option = THEME_OPTIONS.find((item) => item.value === value);
          if (option) setThemePreference(option.value);
        }}
      >
        {THEME_OPTIONS.map(({ value, label, icon }) => (
          <DropdownMenuRadioItem key={value} value={value}>
            {icon} {t(label)}
          </DropdownMenuRadioItem>
        ))}
      </DropdownMenuRadioGroup>
    </DropdownMenuGroup>
  );
}
