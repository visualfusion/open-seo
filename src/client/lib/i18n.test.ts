import { describe, it, expect, afterEach, vi } from "vitest";
import { sort } from "remeda";
import { getTranslation, DEFAULT_LOCALE } from "./i18n";
import { de } from "@/locales/de";
import { en } from "@/locales/en";
import { getIssueDescriptor } from "@/shared/audit-issues";

afterEach(() => vi.unstubAllGlobals());

describe("i18n client infrastructure", () => {
  it("defaults to English and supports German explicitly", () => {
    expect(DEFAULT_LOCALE).toBe("en");
    expect(getTranslation("nav.keywords")).toBe("Keyword Research");
    expect(getTranslation("nav.dashboard", "de")).toBe("Dashboard");
    expect(getTranslation("nav.keywords", "de")).toBe("Keyword-Recherche");
    expect(getTranslation("nav.audit", "de")).toBe("Site-Audit");
    expect(getTranslation("audit.critical", "de")).toBe("Kritisch");
  });

  it("translates English when requested", () => {
    expect(getTranslation("nav.keywords", "en")).toBe("Keyword Research");
    expect(getTranslation("audit.critical", "en")).toBe("Critical");
  });

  it("interpolates parameters", () => {
    expect(
      getTranslation("auth.password_rules.min_length", "de", { min: 12 }),
    ).toBe("Das Passwort muss mindestens 12 Zeichen lang sein.");
    expect(
      getTranslation("auth.password_rules.min_length", "en", { min: 12 }),
    ).toBe("Password must be at least 12 characters.");
  });

  it.each([
    ["de", "Abbrechen"],
    ["en", "Cancel"],
    ["unsupported", "Cancel"],
    [null, "Cancel"],
  ])(
    "uses the saved language %s and ignores unsupported preferences",
    (stored, expected) => {
      vi.stubGlobal("window", { localStorage: { getItem: () => stored } });
      expect(getTranslation("common.cancel")).toBe(expected);
    },
  );

  it("keeps English available when browser storage is blocked", () => {
    vi.stubGlobal("window", {
      localStorage: {
        getItem: () => {
          throw new Error("Storage blocked");
        },
      },
    });
    expect(getTranslation("common.cancel")).toBe("Cancel");
  });

  it("provides localized audit issue descriptors", () => {
    const enIssue = getIssueDescriptor("broken-internal-link", "en");
    const deIssue = getIssueDescriptor("broken-internal-link", "de");

    expect(enIssue?.title).toBe("Broken internal link");
    expect(deIssue?.title).toBe("Fehlerhafter interner Link");
    expect(deIssue?.explanation).toContain("Fehlerstatus (4xx/5xx)");
    expect(deIssue?.howToFix).toContain("Aktualisiere den Link");
  });
});

function flattenTranslations(
  dictionary: unknown,
  prefix = "",
): Record<string, string> {
  if (typeof dictionary !== "object" || dictionary === null) return {};
  return Object.fromEntries(
    Object.entries(dictionary).flatMap(([key, value]) => {
      const path = prefix ? `${prefix}.${key}` : key;
      return typeof value === "string"
        ? [[path, value]]
        : Object.entries(flattenTranslations(value, path));
    }),
  );
}

function parameters(message: string) {
  return sort(
    [...message.matchAll(/\{(\w+)\}/g)].map((match) => match[1]),
    (a, b) => a.localeCompare(b),
  );
}

it("offers the same messages and interpolation parameters in both languages", () => {
  const german = flattenTranslations(de);
  const english = flattenTranslations(en);
  expect(sort(Object.keys(german), (a, b) => a.localeCompare(b))).toEqual(
    sort(Object.keys(english), (a, b) => a.localeCompare(b)),
  );

  for (const key of Object.keys(english)) {
    expect(parameters(german[key]), key).toEqual(parameters(english[key]));
  }
});
