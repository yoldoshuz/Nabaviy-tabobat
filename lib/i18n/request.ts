import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";

import { buildContentMessages, deepMerge } from "@/lib/api/content";

import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  const bundled = (await import(`../../messages/${locale}.json`)).default;

  // Live product and article copy is layered over the shipped bundle, so the
  // storefront reads from the CMS when the backend answers and silently keeps
  // its bundled copy when it does not.
  const overlay = await buildContentMessages(locale);

  return {
    locale,
    messages: deepMerge(bundled, overlay),
    timeZone: "Asia/Tashkent",
  };
});
