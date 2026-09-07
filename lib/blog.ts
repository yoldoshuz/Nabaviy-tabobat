import type { BlogArticle } from "@/types";

/**
 * Offline fallback for the blog. Recommended products live in the admin CMS,
 * not here — with the API unreachable there is no catalogue to link to either,
 * so the "buy these" strip simply does not render.
 */
export const blogArticles: BlogArticle[] = [
  {
    slug: "qora-sedana",
    cardKeys: ["cold", "allergy", "stomach", "skin"],
    tipKeys: ["sugar", "water", "natural", "sleep", "rest", "activity"],
    publishedAt: "2025-11-12",
    relatedProducts: [],
    relatedNote: null,
  },
  {
    slug: "omega-3",
    cardKeys: ["heart", "brain", "vision", "joints"],
    tipKeys: ["sugar", "water", "natural", "sleep", "rest", "activity"],
    publishedAt: "2025-12-03",
    relatedProducts: [],
    relatedNote: null,
  },
  {
    slug: "qust-al-hindi",
    cardKeys: ["breath", "detox", "digestion", "immunity"],
    tipKeys: ["sugar", "water", "natural", "sleep", "rest", "activity"],
    publishedAt: "2026-01-21",
    relatedProducts: [],
    relatedNote: null,
  },
];

export function getArticle(slug: string): BlogArticle | undefined {
  return blogArticles.find((article) => article.slug === slug);
}
