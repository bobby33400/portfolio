export const locales = ["en", "de"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";
export const LOCALE_COOKIE = "locale";

export function isLocale(value: string | undefined | null): value is Locale {
  return value === "en" || value === "de";
}

/**
 * Pick the best supported locale from an Accept-Language header.
 * Falls back to the default locale when nothing matches.
 */
export function localeFromAcceptLanguage(
  header: string | null | undefined,
): Locale {
  if (!header) return defaultLocale;
  const tags = header
    .toLowerCase()
    .split(",")
    .map((part) => part.trim().split(";")[0]);
  for (const tag of tags) {
    if (tag.startsWith("de")) return "de";
    if (tag.startsWith("en")) return "en";
  }
  return defaultLocale;
}
