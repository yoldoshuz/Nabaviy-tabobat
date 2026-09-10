import {
  EMPTY_PRODUCT_IMAGES,
  GALLERY_SLOTS,
  type ProductImages,
} from "@/lib/product-images";
import type { Product, ProductSlug } from "@/types";

/**
 * The bundled catalogue's own photographs, placed into the gallery slots.
 *
 * The offline storefront has no admin behind it, so this is where its artwork
 * declares which places it fills: the product page reads named slots and
 * nothing else. Only the gallery is bundled — the informational slots are
 * content, and content nobody has uploaded has no stand-in. The old `banners`
 * array is gone with the rest: it was the widest file the product happened to
 * have, which is not the same thing as a banner.
 *
 * The dimensions are the slot's specification, which is all a layout needs from
 * them.
 */
function bundledGallery(...urls: string[]): ProductImages {
  return {
    ...EMPTY_PRODUCT_IMAGES,
    ...Object.fromEntries(
      urls
        .slice(0, GALLERY_SLOTS.length)
        .map((url, index) => [GALLERY_SLOTS[index], { url, width: 1000, height: 1000 }]),
    ),
  };
}

export const products: Product[] = [
  {
    slug: "omega-3",
    name: "Omega 3",
    price: 250000,
    currency: "UZS",
    sku: "NT-OMG3-400",
    volume: "400 mg",
    image: "/product-omega-3.png",
    images: bundledGallery(
      "/product-omega-3.png",
      "/product-omega-3-back.png",
      "/product-shot-1.png",
      "/product-shot-2.png",
    ),
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
    order: 1,
  },
  {
    slug: "qora-sedana",
    name: "Qora Sedana",
    price: 250000,
    currency: "UZS",
    sku: "NT-QSED-400",
    volume: "400 mg",
    image: "/product-qora-sedana.png",
    images: bundledGallery(
      "/product-qora-sedana.png",
      "/product-omega-3-back.png",
      "/product-shot-2.png",
      "/product-shot-1.png",
    ),
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
    order: 2,
  },
  {
    slug: "qust-al-hindi",
    name: "Qust al-Hindi",
    price: 250000,
    currency: "UZS",
    sku: "NT-QAH-400",
    volume: "400 mg",
    image: "/product-omega-3.png",
    images: bundledGallery(
      "/product-omega-3.png",
      "/product-omega-3-back.png",
      "/product-shot-1.png",
      "/product-shot-2.png",
    ),
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
    order: 3,
  },
];

export const productSlugs = products.map((product) => product.slug);

export function getProduct(slug: string): Product | undefined {
  return products.find((product) => product.slug === slug);
}

export function isProductSlug(slug: string): slug is ProductSlug {
  return products.some((product) => product.slug === slug);
}
