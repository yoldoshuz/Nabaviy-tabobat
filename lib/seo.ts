import type { Metadata } from "next";

import { localeMeta, siteConfig } from "@/lib/constants";
import { locales } from "@/lib/i18n/routing";
import type { Locale } from "@/types";

type BuildMetadataOptions = {
  locale: Locale;
  title: string;
  description: string;
  /** Path without the locale prefix, e.g. `/products/omega-3`. */
  path?: string;
  keywords?: string[];
  images?: string[];
  type?: "website" | "article";
  noIndex?: boolean;
};

export function absoluteUrl(path = "/"): string {
  return `${siteConfig.url}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Builds the localized URL for a path, e.g. ("/cart", "ru") -> "/ru/cart". */
export function localizedPath(path: string, locale: Locale): string {
  const clean = path === "/" ? "" : path.replace(/\/$/, "");
  return `/${locale}${clean}`;
}

export function buildAlternates(path = "/") {
  const languages = Object.fromEntries(
    locales.map((locale) => [
      localeMeta[locale].htmlLang,
      absoluteUrl(localizedPath(path, locale)),
    ]),
  );

  return {
    languages: {
      ...languages,
      "x-default": absoluteUrl(localizedPath(path, "uz")),
    },
  };
}

export function buildMetadata({
  locale,
  title,
  description,
  path = "/",
  keywords,
  images,
  type = "website",
  noIndex = false,
}: BuildMetadataOptions): Metadata {
  const url = absoluteUrl(localizedPath(path, locale));
  const ogImages = (images ?? [siteConfig.ogImage]).map((image) =>
    image.startsWith("http") ? image : absoluteUrl(image),
  );

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: url,
      ...buildAlternates(path),
    },
    openGraph: {
      type,
      url,
      title,
      description,
      siteName: siteConfig.name,
      locale: localeMeta[locale].ogLocale,
      alternateLocale: locales
        .filter((item) => item !== locale)
        .map((item) => localeMeta[item].ogLocale),
      images: ogImages.map((image) => ({
        url: image,
        width: 1200,
        height: 630,
        alt: title,
      })),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImages,
      site: siteConfig.twitter,
    },
    robots: noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
          },
        },
  };
}
