import type { MetadataRoute } from "next";

import { localeMeta } from "@/lib/constants";
import { locales } from "@/lib/i18n/routing";
import { products } from "@/lib/products";
import { absoluteUrl, localizedPath } from "@/lib/seo";

const routes: { path: string; priority: number; changeFrequency: "daily" | "weekly" | "monthly" }[] = [
  { path: "/", priority: 1, changeFrequency: "weekly" },
  { path: "/products", priority: 0.9, changeFrequency: "weekly" },
  { path: "/blog", priority: 0.7, changeFrequency: "weekly" },
  { path: "/contacts", priority: 0.6, changeFrequency: "monthly" },
  ...products.map((product) => ({
    path: `/products/${product.slug}`,
    priority: 0.8,
    changeFrequency: "weekly" as const,
  })),
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return routes.flatMap((route) =>
    locales.map((locale) => ({
      url: absoluteUrl(localizedPath(route.path, locale)),
      lastModified,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
      alternates: {
        languages: Object.fromEntries(
          locales.map((item) => [
            localeMeta[item].htmlLang,
            absoluteUrl(localizedPath(route.path, item)),
          ]),
        ),
      },
    })),
  );
}
