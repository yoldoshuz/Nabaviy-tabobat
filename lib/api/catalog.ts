/**
 * The storefront's catalogue, resolved from the API with the bundled static
 * catalogue as a fallback.
 *
 * Every exported function answers with the storefront's own domain types, so
 * page components are identical in both modes. When the backend is unreachable
 * — unconfigured, down, slow, or serving garbage — the static data in
 * `lib/products.ts` and `lib/blog.ts` takes over and the shop keeps working,
 * minus live stock.
 */

import { blogArticles as staticArticles } from "@/lib/blog";
import { products as staticProducts } from "@/lib/products";
import type { BlogArticle, Product } from "@/types";

import { isApiConfigured } from "./config";
import { resolveMediaUrl } from "./media";
import {
  getBlogFeed,
  getBlogPostBySlug,
  getFeatured,
  getProductBySlug,
  getProductList,
} from "./endpoints";
import type { ApiBlogPost, ApiProduct } from "./types";

/* ── mapping ─────────────────────────────────────────────────────────────── */

const staticProduct = (slug: string) => staticProducts.find((p) => p.slug === slug);
const staticArticle = (slug: string) => staticArticles.find((a) => a.slug === slug);

const mainMediaUrl = (api: ApiProduct): string | undefined =>
  (api.media ?? []).find((m) => m.isMain)?.url ?? (api.media ?? [])[0]?.url;

const img = (url: string | null | undefined) => resolveMediaUrl(url);
const imgs = (urls: (string | null | undefined)[] | undefined) =>
  (urls ?? []).map(img).filter(Boolean);

/**
 * Folds an API product onto the storefront's `Product`.
 *
 * The seeded catalogue carries the storefront's own imagery and facets in
 * `attributes`, so this is normally a straight read. The static entry is
 * consulted only for fields a CMS-authored product would not have — which is
 * what keeps a hand-created product renderable instead of blank.
 */
function toProduct(api: ApiProduct): Product {
  const attrs = api.attributes ?? {};
  const images = attrs.images ?? {};
  const base = staticProduct(api.slug);
  const card = img(images.card ?? mainMediaUrl(api)) || base?.image || "";
  const gallery = images.gallery
    ? imgs(images.gallery)
    : (base?.gallery ?? imgs((api.media ?? []).map((m) => m.url)));

  return {
    id: api.id,
    stock: api.stock,
    slug: api.slug,
    // Brand names are identical in every locale; `ru` is the seeded source.
    name: api.name?.ru || api.name?.en || base?.name || api.slug,
    price: Number(api.discountPrice ?? api.price),
    currency: "UZS",
    sku: api.sku || base?.sku || "",
    volume: attrs.volume ?? base?.volume ?? "",
    image: card,
    imageBack: img(images.back) || base?.imageBack || card,
    gallery: gallery.length ? gallery : [card],
    banners: images.banners ? imgs(images.banners) : (base?.banners ?? [card]),
    highlights: attrs.highlights ?? base?.highlights ?? [],
    meters: attrs.meters ?? base?.meters ?? [],
    benefitKeys: attrs.benefitKeys ?? base?.benefitKeys ?? [],
    featureKeys: attrs.featureKeys ?? base?.featureKeys ?? [],
    usageKeys: attrs.usageKeys ?? base?.usageKeys ?? [],
    advantageKeys: attrs.advantageKeys ?? base?.advantageKeys ?? [],
  };
}

function toArticle(api: ApiBlogPost): BlogArticle {
  const base = staticArticle(api.slug);
  return {
    slug: api.slug,
    cardKeys: base?.cardKeys ?? [],
    tipKeys: base?.tipKeys ?? [],
    publishedAt: (api.publishedAt ?? base?.publishedAt ?? "").slice(0, 10),
  };
}

/* ── fetchers ────────────────────────────────────────────────────────────── */

/** Resolves to `null` on any failure, which is the caller's cue to fall back. */
async function tryFetch<T>(run: () => Promise<T>): Promise<T | null> {
  if (!isApiConfigured()) return null;
  try {
    return await run();
  } catch {
    return null;
  }
}

/** Raw API products — used by the i18n content overlay, which needs `attributes`. */
export async function fetchApiProducts(): Promise<ApiProduct[] | null> {
  return tryFetch(async () => (await getProductList()).products ?? []);
}

export async function fetchApiBlogPosts(): Promise<ApiBlogPost[] | null> {
  return tryFetch(async () => {
    const data = await getBlogFeed();
    return Array.isArray(data) ? data : (data.posts ?? []);
  });
}

/* ── public surface ──────────────────────────────────────────────────────── */

export async function getProducts(): Promise<Product[]> {
  const api = await fetchApiProducts();
  if (!api?.length) return staticProducts;
  return api.map(toProduct);
}

export async function getProduct(slug: string): Promise<Product | undefined> {
  const api = await tryFetch(() => getProductBySlug(slug));
  return api ? toProduct(api) : staticProduct(slug);
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const api = await tryFetch(async () => {
    // This endpoint answers with Sequelize's `{ rows, count }` rather than the
    // paginated `{ products, total }` shape the list endpoint uses.
    const data = await getFeatured();
    return Array.isArray(data) ? data : (data.rows ?? []);
  });

  if (!api?.length) return staticProducts;
  return api.map(toProduct);
}

export async function getArticles(): Promise<BlogArticle[]> {
  const api = await fetchApiBlogPosts();
  if (!api?.length) return staticArticles;
  return api.map(toArticle).sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
}

export async function getArticle(slug: string): Promise<BlogArticle | undefined> {
  const api = await tryFetch(() => getBlogPostBySlug(slug));
  return api ? toArticle(api) : staticArticle(slug);
}
