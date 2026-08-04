import type { BlogArticle } from "@/types";

export const blogArticles: BlogArticle[] = [
  {
    slug: "qora-sedana",
    cardKeys: ["cold", "allergy", "stomach", "skin"],
    tipKeys: ["sugar", "water", "natural", "sleep", "rest", "activity"],
    publishedAt: "2025-11-12",
  },
  {
    slug: "omega-3",
    cardKeys: ["heart", "brain", "vision", "joints"],
    tipKeys: ["sugar", "water", "natural", "sleep", "rest", "activity"],
    publishedAt: "2025-12-03",
  },
  {
    slug: "qust-al-hindi",
    cardKeys: ["breath", "detox", "digestion", "immunity"],
    tipKeys: ["sugar", "water", "natural", "sleep", "rest", "activity"],
    publishedAt: "2026-01-21",
  },
];

export function getArticle(slug: string): BlogArticle | undefined {
  return blogArticles.find((article) => article.slug === slug);
}
