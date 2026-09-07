import createMiddleware from "next-intl/middleware";

import { routing } from "@/lib/i18n/routing";

export const proxy = createMiddleware(routing);

export const config = {
  // Match everything except Next internals, API routes and files with an extension.
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
