import { defineRouting } from "next-intl/routing";

export const locales = ["uz", "ru", "en"] as const;

export const defaultLocale = "uz" as const;

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: "always",
  localeCookie: {
    name: "NEXT_LOCALE",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365,
  },
});
