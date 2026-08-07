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
  image: string;
  imageBack: string;
  /** Square-ish lifestyle shots used for thumbnails and cards. */
  gallery: string[];
  /** Wide lifestyle shots used for the banner carousel and usage collage. */
  banners: string[];
  /** Highlighted numbers rendered around the bottle on the detail page */
  highlights: { value: string; labelKey: string }[];
  /** Effectiveness meters on the detail page */
  meters: { key: string; value: number }[];
  benefitKeys: string[];
  featureKeys: string[];
  usageKeys: string[];
  advantageKeys: string[];
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
