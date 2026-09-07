import { contacts, siteConfig } from "@/lib/constants";
import { absoluteUrl, localizedPath } from "@/lib/seo";
import { isSoldOut } from "@/lib/utils";
import type { Locale, Product } from "@/types";

type JsonLd = Record<string, unknown>;

export function organizationJsonLd(locale: Locale, description: string): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteConfig.url}#organization`,
    name: siteConfig.name,
    url: absoluteUrl(localizedPath("/", locale)),
    logo: absoluteUrl("/icon-512.png"),
    description,
    email: contacts.email,
    telephone: contacts.phone,
    sameAs: [contacts.instagramHref, contacts.telegram, contacts.facebookHref],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Toshkent",
      addressCountry: "UZ",
    },
  };
}

export function websiteJsonLd(locale: Locale, description: string): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteConfig.url}#website`,
    name: siteConfig.name,
    description,
    url: absoluteUrl(localizedPath("/", locale)),
    inLanguage: locale,
    publisher: { "@id": `${siteConfig.url}#organization` },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${absoluteUrl(localizedPath("/blog", locale))}?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function localBusinessJsonLd(locale: Locale, description: string): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    "@id": `${siteConfig.url}#business`,
    name: siteConfig.name,
    description,
    url: absoluteUrl(localizedPath("/contacts", locale)),
    telephone: contacts.phone,
    email: contacts.email,
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Toshkent",
      addressCountry: "UZ",
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ],
      opens: "09:00",
      closes: "20:00",
    },
  };
}

export function productJsonLd(
  product: Product,
  locale: Locale,
  { name, description }: { name: string; description: string },
): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    sku: product.sku,
    image: [product.image, ...product.gallery].map((src) => absoluteUrl(src)),
    brand: { "@type": "Brand", name: siteConfig.name },
    offers: {
      "@type": "Offer",
      url: absoluteUrl(localizedPath(`/products/${product.slug}`, locale)),
      priceCurrency: product.currency,
      price: product.price,
      // Mirrors the storefront: a zero-stock product must not tell Google it
      // is buyable while the page itself refuses the order.
      availability: isSoldOut(product)
        ? "https://schema.org/OutOfStock"
        : "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@id": `${siteConfig.url}#organization` },
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: 4.9,
      reviewCount: 128,
    },
  };
}

export function breadcrumbJsonLd(
  items: { name: string; path: string }[],
  locale: Locale,
): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(localizedPath(item.path, locale)),
    })),
  };
}

export function faqJsonLd(items: { question: string; answer: string }[]): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

export function itemListJsonLd(
  items: { name: string; path: string }[],
  locale: Locale,
): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      url: absoluteUrl(localizedPath(item.path, locale)),
    })),
  };
}

export function articleJsonLd({
  headline,
  description,
  path,
  locale,
  publishedAt,
}: {
  headline: string;
  description: string;
  path: string;
  locale: Locale;
  publishedAt: string;
}): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline,
    description,
    inLanguage: locale,
    datePublished: publishedAt,
    dateModified: publishedAt,
    mainEntityOfPage: absoluteUrl(localizedPath(path, locale)),
    author: { "@id": `${siteConfig.url}#organization` },
    publisher: { "@id": `${siteConfig.url}#organization` },
  };
}
