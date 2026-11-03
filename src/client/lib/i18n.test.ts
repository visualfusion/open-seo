import { describe, it, expect, afterEach, vi } from "vitest";
import { sort } from "remeda";
import { getTranslation, DEFAULT_LOCALE } from "./i18n";
import { de } from "@/locales/de";
import { en } from "@/locales/en";

afterEach(() => vi.unstubAllGlobals());

describe("i18n client infrastructure", () => {
  it("defaults to English and supports German explicitly", () => {
    expect(DEFAULT_LOCALE).toBe("en");
    expect(getTranslation("nav.keywords")).toBe("Keyword Research");
    expect(getTranslation("nav.dashboard", "de")).toBe("Dashboard");
    expect(getTranslation("nav.keywords", "de")).toBe("Keyword-Recherche");
    expect(getTranslation("nav.audit", "de")).toBe("Site-Audit");
  });

  it("translates English when requested", () => {
    expect(getTranslation("nav.keywords", "en")).toBe("Keyword Research");
  });

  it("interpolates parameters", () => {
    expect(
      getTranslation("ui.table.page_of", "de", { page: 2, total: 5 }),
    ).toBe("Seite 2 von 5");
    expect(
      getTranslation("ui.table.page_of", "en", { page: 2, total: 5 }),
    ).toBe("Page 2 of 5");
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
