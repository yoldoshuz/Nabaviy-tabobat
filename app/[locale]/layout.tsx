import type { Metadata, Viewport } from "next";
import { hasLocale, NextIntlClientProvider } from "next-intl";

import { AuthProvider, CartProvider, QueryProvider } from "@/hooks";
import { getProducts } from "@/lib/api/catalog";
import { getTranslations, setRequestLocale } from "next-intl/server";
import localFont from "next/font/local";
import { Manrope } from "next/font/google";
import { notFound } from "next/navigation";

import { ConsultationProvider } from "@/components/layout/consultation-provider";
import { CtaBanner } from "@/components/layout/cta-banner";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { JsonLd } from "@/components/shared/json-ld";
import { localeMeta, siteConfig } from "@/lib/constants";
import { locales, routing } from "@/lib/i18n/routing";
import { organizationJsonLd, websiteJsonLd } from "@/lib/json-ld";
import { buildAlternates, absoluteUrl } from "@/lib/seo";
import type { Locale } from "@/types";

import "../globals.css";

/**
 * Pehlevi is the brand display face (free for any use, by Andrew Markelov).
 * It is a light script, which reads beautifully at heading sizes and poorly in
 * a paragraph, so it is scoped to headings and ornamental numerals; body and UI
 * text use Manrope.
 */
const pehlevi = localFont({
  src: [
    { path: "../fonts/Pehlevi-Regular.woff2", weight: "400", style: "normal" },
    { path: "../fonts/Pehlevi-Regular.woff", weight: "400", style: "normal" },
  ],
  variable: "--font-pehlevi",
  display: "swap",
  fallback: ["Segoe UI", "system-ui", "sans-serif"],
  adjustFontFallback: false,
});

/** Body and UI text — chosen for its Cyrillic and Latin coverage. */
const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "cyrillic"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

/**
 * How long a rendered page may be reused before it is built again, in seconds.
 *
 * Applies to every route under this layout. Without it the storefront is a
 * pure build-time snapshot: the catalogue is read with axios, which Next's
 * fetch cache knows nothing about, so nothing ever marks a page stale and a
 * moderator's edit only appears after a redeploy. Kept in step with
 * `CATALOG_REVALIDATE_SECONDS`, which governs the same window on the client.
 *
 * Must stay a literal — Next evaluates this statically and rejects an import.
 */
export const revalidate = 60;

export const viewport: Viewport = {
  themeColor: "#10281b",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

export async function generateMetadata(
  props: LayoutProps<"/[locale]">,
): Promise<Metadata> {
  const { locale } = await props.params;
  if (!hasLocale(routing.locales, locale)) notFound();

  const t = await getTranslations({ locale, namespace: "metadata.home" });

  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: t("title"),
      template: `%s | ${siteConfig.name}`,
    },
    description: t("description"),
    applicationName: siteConfig.name,
    generator: "Next.js",
    referrer: "origin-when-cross-origin",
    authors: [{ name: siteConfig.name, url: siteConfig.url }],
    creator: siteConfig.name,
    publisher: siteConfig.name,
    formatDetection: { telephone: true, address: false, email: true },
    alternates: {
      canonical: absoluteUrl(`/${locale}`),
      ...buildAlternates("/"),
    },
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "any" },
        { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
        { url: "/icon-512.png", type: "image/png", sizes: "512x512" },
      ],
      apple: [{ url: "/apple-icon.png", sizes: "180x180" }],
    },
    manifest: "/manifest.webmanifest",
  };
}

export default async function LocaleLayout(props: LayoutProps<"/[locale]">) {
  const { locale } = await props.params;
  if (!hasLocale(routing.locales, locale)) notFound();

  setRequestLocale(locale);

  const typedLocale = locale as Locale;
  const t = await getTranslations({ locale, namespace: "metadata.home" });
  const tCommon = await getTranslations({ locale, namespace: "common" });

  // The cart addresses items by backend id, so it needs the resolved catalogue.
  const catalog = await getProducts();

  return (
    <html
      lang={localeMeta[typedLocale].htmlLang}
      className={`${pehlevi.variable} ${manrope.variable} h-full`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col bg-background">
        <NextIntlClientProvider>
          <QueryProvider>
            <AuthProvider>
            <CartProvider catalog={catalog}>
          <ConsultationProvider>
            <a
              href="#main"
              className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-100 focus:rounded-lg focus:bg-cream focus:px-4 focus:py-2 focus:text-sm focus:text-brand"
            >
              {tCommon("skipToContent")}
            </a>
            <Header />
            <main id="main" className="flex-1">
              {props.children}
            </main>
            <Footer />
            <CtaBanner />
          </ConsultationProvider>
            </CartProvider>
            </AuthProvider>
          </QueryProvider>
        </NextIntlClientProvider>

        <JsonLd
          id="ld-organization"
          data={[
            organizationJsonLd(typedLocale, t("description")),
            websiteJsonLd(typedLocale, t("description")),
          ]}
        />
      </body>
    </html>
  );
}
