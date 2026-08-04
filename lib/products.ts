import type { Product, ProductSlug } from "@/types";

export const products: Product[] = [
  {
    slug: "omega-3",
    name: "Omega 3",
    price: 250000,
    currency: "UZS",
    sku: "NT-OMG3-400",
    volume: "400 mg",
    image: "/product-omega-3.png",
    imageBack: "/product-omega-3-back.png",
    gallery: ["/product-shot-1.png", "/product-shot-2.png"],
    banners: [
      "/product-banner.png",
      "/product-shot-3.png",
      "/product-shot-4.png",
    ],
    highlights: [
      { value: "400 mg", labelKey: "dose" },
      { value: "100%", labelKey: "natural" },
      { value: "1–3", labelKey: "course" },
      { value: "DHA/EPA", labelKey: "formula" },
    ],
    meters: [
      { key: "immunity", value: 95 },
      { key: "digestion", value: 90 },
      { key: "energy", value: 88 },
      { key: "antioxidant", value: 92 },
      { key: "strength", value: 90 },
      { key: "natural", value: 100 },
    ],
    benefitKeys: ["one", "two", "three", "four", "five", "six"],
    featureKeys: ["volume", "form", "age", "country", "shelfLife", "storage"],
    usageKeys: ["dose", "course", "water", "advice"],
    advantageKeys: ["one", "two", "three", "four", "five", "six"],
  },
  {
    slug: "qora-sedana",
    name: "Qora Sedana",
    price: 250000,
    currency: "UZS",
    sku: "NT-QSED-400",
    volume: "400 mg",
    image: "/product-qora-sedana.png",
    imageBack: "/product-omega-3-back.png",
    gallery: ["/product-shot-2.png", "/product-shot-1.png"],
    banners: [
      "/product-shot-3.png",
      "/product-shot-4.png",
      "/product-banner.png",
    ],
    highlights: [
      { value: "400 mg", labelKey: "dose" },
      { value: "100%", labelKey: "natural" },
      { value: "1 oy", labelKey: "course" },
      { value: "Nigella", labelKey: "formula" },
    ],
    meters: [
      { key: "immunity", value: 98 },
      { key: "digestion", value: 92 },
      { key: "energy", value: 85 },
      { key: "antioxidant", value: 94 },
      { key: "strength", value: 88 },
      { key: "natural", value: 100 },
    ],
    benefitKeys: ["one", "two", "three", "four", "five", "six"],
    featureKeys: ["volume", "form", "age", "country", "shelfLife", "storage"],
    usageKeys: ["dose", "course", "water", "advice"],
    advantageKeys: ["one", "two", "three", "four", "five", "six"],
  },
  {
    slug: "qust-al-hindi",
    name: "Qust al-Hindi",
    price: 250000,
    currency: "UZS",
    sku: "NT-QAH-400",
    volume: "400 mg",
    image: "/product-omega-3.png",
    imageBack: "/product-omega-3-back.png",
    gallery: ["/product-shot-1.png", "/product-shot-2.png"],
    banners: [
      "/product-shot-4.png",
      "/product-banner.png",
      "/product-shot-3.png",
    ],
    highlights: [
      { value: "400 mg", labelKey: "dose" },
      { value: "100%", labelKey: "natural" },
      { value: "1–3", labelKey: "course" },
      { value: "DHA/EPA", labelKey: "formula" },
    ],
    meters: [
      { key: "immunity", value: 95 },
      { key: "digestion", value: 90 },
      { key: "energy", value: 88 },
      { key: "antioxidant", value: 92 },
      { key: "strength", value: 90 },
      { key: "natural", value: 100 },
    ],
    benefitKeys: ["one", "two", "three", "four", "five", "six"],
    featureKeys: ["volume", "form", "age", "country", "shelfLife", "storage"],
    usageKeys: ["dose", "course", "water", "advice"],
    advantageKeys: ["one", "two", "three", "four", "five", "six"],
  },
];

export const productSlugs = products.map((product) => product.slug);

export function getProduct(slug: string): Product | undefined {
  return products.find((product) => product.slug === slug);
}

export function isProductSlug(slug: string): slug is ProductSlug {
  return products.some((product) => product.slug === slug);
}
