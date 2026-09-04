import { defineRouting } from "next-intl/routing";

export const locales = ["uz", "ru", "en"] as const;

export const defaultLocale = "uz" as const;

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: "always",
  /*
   * Uzbek for anyone arriving without a locale in the URL.
   *
   * next-intl defaults `localeDetection` to true, and its resolution order is
   * path, then cookie, then `accept-language`, then the default — so a browser
   * announcing Russian was landing on /ru even though the shop asked for Uzbek
   * by default, and the year-long cookie then pinned it there. Off, the bare
   * "/" always resolves to `defaultLocale`. Switching language still works and
   * still sticks while browsing: `localePrefix: "always"` means every internal
   * link carries its own locale.
   */
  localeDetection: false,
  localeCookie: {
    name: "NEXT_LOCALE",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365,
  },
});

/** Alias used by the API layer, which is shared across storefronts. */
export type AppLocale = (typeof locales)[number];
