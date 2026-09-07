import type { Locale } from "@/types";

const localeTags: Record<Locale, string> = {
  uz: "uz-UZ",
  ru: "ru-RU",
  en: "en-US",
};

/**
 * `390000` → `390 000`, grouped with a non-breaking space in every language.
 *
 * The grouping is fixed here instead of following the active locale on purpose.
 * `Intl.NumberFormat("uz")` disagrees between ICU builds — Node groups with a
 * non-breaking space, Chrome with a comma — so a locale-formatted price makes
 * the server HTML and the client render differ and React throws a hydration
 * mismatch on every page that prints one. `ru-RU` groups with a space in every
 * ICU version, and the replace normalises whichever space character it picks.
 * The design wants the space grouping in all three languages anyway.
 */
export function formatPrice(value: number): string {
  return new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 0 })
    .format(value)
    .replace(/\s/g, " ");
}

export function formatDate(value: string, locale: Locale): string {
  return new Intl.DateTimeFormat(localeTags[locale], {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}
