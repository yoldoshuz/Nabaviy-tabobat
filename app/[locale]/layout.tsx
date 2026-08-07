import type { Metadata, Viewport } from "next";
import { hasLocale, NextIntlClientProvider } from "next-intl";

import { CartProvider, QueryProvider } from "@/hooks";
import { getProducts } from "@/lib/api/catalog";
import { getTranslations, setRequestLocale } from "next-intl/server";
import localFont from "next/font/local";
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
 * Pehlevi is the brand typeface used across the whole Figma design
 * (free for any use, by Andrew Markelov). It carries both headings and body.
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

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

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
      className={`${pehlevi.variable} h-full`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col bg-background">
        <NextIntlClientProvider>
          <QueryProvider>
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
