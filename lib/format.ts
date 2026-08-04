import type { Locale } from "@/types";

const localeTags: Record<Locale, string> = {
  uz: "uz-UZ",
  ru: "ru-RU",
  en: "en-US",
};

/** Formats a UZS amount with locale aware thousand separators (no currency code). */
export function formatAmount(value: number, locale: Locale): string {
  return new Intl.NumberFormat(localeTags[locale], {
    maximumFractionDigits: 0,
  })
    .format(value)
    .replace(/ /g, " ");
}

export function formatDate(value: string, locale: Locale): string {
  return new Intl.DateTimeFormat(localeTags[locale], {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}
