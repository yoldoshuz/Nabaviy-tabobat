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
import type { ApiBlogPost, ApiBlogPostProduct, ApiProduct } from "./types";

/* ── mapping ─────────────────────────────────────────────────────────────── */

const staticProduct = (slug: string) => staticProducts.find((p) => p.slug === slug);
const staticArticle = (slug: string) => staticArticles.find((a) => a.slug === slug);

const mainMediaUrl = (api: ApiProduct): string | undefined =>
  (api.media ?? []).find((m) => m.isMain)?.url ?? (api.media ?? [])[0]?.url;

const img = (url: string | null | undefined) => resolveMediaUrl(url);
const imgs = (urls: (string | null | undefined)[] | undefined) =>
  (urls ?? []).map(img).filter(Boolean);

/**
 * The photos uploaded through the admin, the one marked main first and the rest
 * in their sort order.
 *
 * These outrank `attributes.images` on purpose. `attributes` is seed data that
 * no admin screen writes to, so as long as it won, a moderator could replace a
 * product's whole photo set and watch the storefront ignore every one of them.
 */
function uploadedShots(api: ApiProduct): string[] {
  return [...(api.media ?? [])]
    .filter((m) => m.type !== "video")
    .sort((a, b) => Number(b.isMain) - Number(a.isMain) || a.sortOrder - b.sortOrder)
    .map((m) => img(m.url))
    .filter(Boolean);
}

/**
 * Folds an API product onto the storefront's `Product`.
 *
 * Precedence for every field is live record → seeded `attributes` → the bundled
 * static entry, so whatever a moderator can edit is what the page shows and the
 * rest still has something to fall back on.
 */
function toProduct(api: ApiProduct): Product {
  const attrs = api.attributes ?? {};
  const images = attrs.images ?? {};
  const base = staticProduct(api.slug);
  const shots = uploadedShots(api);
  const card = shots[0] || img(images.card) || base?.image || "";
  const gallery = shots.length
    ? shots
    : images.gallery
      ? imgs(images.gallery)
      : (base?.gallery ?? []);

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
    imageBack: shots[1] || img(images.back) || base?.imageBack || card,
    gallery: gallery.length ? gallery : [card],
    banners: shots.length
      ? shots
      : images.banners
        ? imgs(images.banners)
        : (base?.banners ?? [card]),
    highlights: attrs.highlights ?? base?.highlights ?? [],
    meters: attrs.meters ?? base?.meters ?? [],
    benefitKeys: attrs.benefitKeys ?? base?.benefitKeys ?? [],
    featureKeys: attrs.featureKeys ?? base?.featureKeys ?? [],
    usageKeys: attrs.usageKeys ?? base?.usageKeys ?? [],
    advantageKeys: attrs.advantageKeys ?? base?.advantageKeys ?? [],
  };
}

/**
 * Folds a junction row onto a `Product` good enough for a card.
 *
 * The junction carries a trimmed product — id, name, slug, price, media — not
 * the full record, so the rest is filled from the static entry when the slug is
 * one the storefront knows. `AddToCartButton` addresses items by slug, so a
 * card built this way adds to the cart exactly like a catalogue card does.
 */
function toRelatedProduct(row: ApiBlogPostProduct): Product | null {
  const api = row.product;
  if (!api?.slug) return null;

  const base = staticProduct(api.slug);
  const image = img(mainMediaUrl(api as ApiProduct)) || base?.image || "";
  if (!image) return null;

  return {
    ...(base ?? ({} as Product)),
    id: api.id,
    slug: api.slug,
    name: api.name?.ru || api.name?.en || base?.name || api.slug,
    price: Number(api.price),
    currency: "UZS",
    image,
    gallery: base?.gallery ?? [image],
    banners: base?.banners ?? [image],
    imageBack: base?.imageBack ?? image,
    sku: base?.sku ?? "",
    volume: base?.volume ?? "",
    highlights: base?.highlights ?? [],
    meters: base?.meters ?? [],
    benefitKeys: base?.benefitKeys ?? [],
    featureKeys: base?.featureKeys ?? [],
    usageKeys: base?.usageKeys ?? [],
    advantageKeys: base?.advantageKeys ?? [],
  };
}

function toArticle(api: ApiBlogPost): BlogArticle {
  const base = staticArticle(api.slug);
  const rows = [...(api.products ?? [])].sort((a, b) => a.sortOrder - b.sortOrder);

  return {
    slug: api.slug,
    cardKeys: base?.cardKeys ?? [],
    tipKeys: base?.tipKeys ?? [],
    publishedAt: (api.publishedAt ?? base?.publishedAt ?? "").slice(0, 10),
    relatedProducts: rows.map(toRelatedProduct).filter((p): p is Product => p !== null),
    relatedNote: rows.find((row) => row.note)?.note ?? null,
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

  // The feed omits `products` — only the by-slug response carries the junction
  // — so each article is re-read to find what it should be selling. There are
  // three of them and both calls are cached by Next, so this is one extra
  // round of requests per revalidation, not per visitor.
  const detailed = await Promise.all(
    api.map(async (post) => (await tryFetch(() => getBlogPostBySlug(post.slug))) ?? post),
  );

  return detailed.map(toArticle).sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
}

export async function getArticle(slug: string): Promise<BlogArticle | undefined> {
  const api = await tryFetch(() => getBlogPostBySlug(slug));
  return api ? toArticle(api) : staticArticle(slug);
}
