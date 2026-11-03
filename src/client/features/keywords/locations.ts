// Location data lives in shared/ so the server can route keyword research by
// provider (Labs vs Google Ads). This shim keeps existing client imports.
export {
  DEFAULT_LOCATION_CODE,
  LABS_LOCATION_OPTIONS,
  LOCATIONS,
  getLanguageCode,
  getLanguageOptions,
  isLabsLocationCode,
  isSupportedLocationCode,
} from "@/shared/keyword-locations";

import { getCurrentLocale, type Locale } from "@/client/lib/i18n";
import { getIsoCountryCode } from "@/shared/keyword-locations";

export function countryLabel(locationCode: number, locale: Locale) {
  return new Intl.DisplayNames(locale, { type: "region" }).of(
    getIsoCountryCode(locationCode).toUpperCase(),
  );
}

export function languageLabel(
  languageCode: string,
  locale: Locale = getCurrentLocale(),
) {
  return (
    new Intl.DisplayNames(locale, { type: "language" }).of(languageCode) ??
    languageCode
  );
}
