import type { ApiProductBlock } from "@/lib/api/types";
import type { ProductImages } from "@/lib/product-images";
import type { locales } from "@/lib/i18n/routing";

export type Locale = (typeof locales)[number];

/**
 * The catalogue is served by the API and editable in the CMS, so a slug can no
 * longer be enumerated at compile time. `isProductSlug` still guards anything
 * read back from storage or the URL.
 */
export type ProductSlug = string;

export interface ProductSpec {
  /** Translation key inside `catalog.<slug>.specs` */
  key: string;
}

export interface Product {
  /**
   * Backend UUID. Present only on products resolved from the API — the server
   * cart addresses items by id, so its absence is what tells the cart to fall
   * back to its local, offline mode.
   */
  id?: string;
  /** Units left in stock; `undefined` when serving the static catalogue. */
  stock?: number;
  slug: ProductSlug;
  /** Latin brand name, identical in every locale */
  name: string;
  price: number;
  currency: "UZS";
  sku: string;
  volume: string;
  /** Packshot — the card, the cart and the comparison table read this. */
  image: string;
  /** Highlighted numbers rendered around the bottle on the detail page */
  highlights: { value: string; labelKey: string }[];
  /** Effectiveness meters on the detail page */
  meters: { key: string; value: number }[];
  benefitKeys: string[];
  featureKeys: string[];
  usageKeys: string[];
  advantageKeys: string[];
  /**
   * Position in the catalogue grid, editable in the admin.
   *
   * The API answers in its own insertion order, which has nothing to do with
   * the merchandising sequence, so this is what decides the shelf.
   */
  order: number;
  /**
   * The product page's editable sections, authored in the admin — visible ones
   * only, in the order they should render.
   *
   * Only the by-slug response carries them, so this is present on a product
   * page and absent everywhere else. Absent (or empty) means the page falls
   * back to the copy bundled in `messages/`.
   */
  blocks?: ApiProductBlock[];
  /**
   * Every place a photograph can go on this product's page, keyed by the name
   * of the place.
   *
   * This is the whole of the page's photography. Each section asks for the slot
   * that carries its own name — `benefits` reads `benefits_1`/`benefits_2`,
   * `metrics` reads `metrics_1` — and an empty slot means that section renders
   * without a picture.
   *
   * It replaces `imageBack`, `gallery` and `banners`, which were positions in
   * an unordered upload pile: `gallery_1` appeared five times on the Qora
   * Sedana page because "the first photo" was the only address the page had.
   */
  images?: ProductImages;
}

export interface CartItem {
  slug: ProductSlug;
  quantity: number;
}

export interface CartLine extends CartItem {
  product: Product;
  total: number;
}

export interface BlogArticle {
  slug: string;
  cardKeys: string[];
  tipKeys: string[];
  publishedAt: string;
  /**
   * Products the article recommends, so a reader can buy without going back to
   * the catalogue to hunt for what they just read about. Curated per article in
   * the admin CMS; empty when the storefront falls back to its static
   * catalogue, which is why the "buy these" strip is conditional.
   */
  relatedProducts: Product[];
  /** The editor's line for the lead product, when one was written. */
  relatedNote: string | null;
}

export interface Certificate {
  id: string;
  image: string;
}

export interface VideoItem {
  id: string;
  poster: string;
  url: string;
}

export interface Testimonial {
  id: string;
  avatar: string;
  rating: number;
  productName: string;
}

export interface DeliveryOption {
  id: "standard";
  priceKey: string;
}

export interface CheckoutFormValues {
  name: string;
  phone: string;
  city: string;
  address: string;
}

export interface ConsultationFormValues {
  name: string;
  phone: string;
  message: string;
}
