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
import { toProductImages } from "@/lib/product-images";
import { isSoldOut } from "@/lib/utils";
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
import type {
  ApiBlogPost,
  ApiBlogPostProduct,
  ApiProduct,
} from "./types";

/* ── mapping ─────────────────────────────────────────────────────────────── */

/**
 * The product's place in the catalogue grid.
 *
 * `sortOrder` is the backend's own column, set from the admin's arrows, and it
 * wins whenever it has been set. It starts at 0 for every product, so a
 * catalogue nobody has ordered by hand falls through to `attributes.order`
 * (where the position briefly lived) and then to the bundled catalogue, which
 * is the sequence this storefront shipped with.
 */
function resolveOrder(
  sortOrder: number | undefined,
  attributeOrder: unknown,
  bundled: number | undefined,
  fallback: number,
): number {
  if (typeof sortOrder === "number" && sortOrder > 0) return sortOrder;
  const legacy = Number(attributeOrder);
  if (Number.isFinite(legacy) && legacy > 0) return legacy;
  return bundled ?? fallback;
}


const staticProduct = (slug: string) => staticProducts.find((p) => p.slug === slug);
const staticArticle = (slug: string) => staticArticles.find((a) => a.slug === slug);

/**
 * The cover of a product the API sent in trimmed form — a blog junction row,
 * which carries `media` and no `images`.
 */
const mainMediaUrl = (api: ApiProduct): string | undefined =>
  (api.media ?? []).find((m) => m.slot === "gallery_1")?.url ??
  (api.media ?? []).find((m) => m.isMain)?.url ??
  (api.media ?? [])[0]?.url;

const img = (url: string | null | undefined) => resolveMediaUrl(url);
/**
 * The one photo a card needs: the product's cover.
 *
 * The by-slug response answers with the full `images` map, but a catalogue list
 * does not — it carries `media` only — so a card resolves its cover from the
 * slot each file says it sits in. `gallery_1` is the documented cover; `isMain`
 * is the same fact spelled the old way and stands behind it; the first upload
 * is the last resort, for a record whose files predate slots entirely.
 *
 * With `mainMediaUrl` above, these two are the only readers of `media` left, and
 * the only places `isMain` is consulted. Nothing on a product page goes near
 * either.
 */
function coverShot(api: ApiProduct): string {
  const photos = (api.media ?? []).filter((m) => m.type !== "video");
  const cover =
    api.images?.gallery_1?.url ??
    photos.find((m) => m.slot === "gallery_1")?.url ??
    photos.find((m) => m.isMain)?.url ??
    photos[0]?.url;
  return img(cover);
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
  const seeded = attrs.images ?? {};
  const base = staticProduct(api.slug);
  const images = toProductImages(api.images);
  const card = coverShot(api) || img(seeded.card) || base?.image || "";

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
    highlights: attrs.highlights ?? base?.highlights ?? [],
    meters: attrs.meters ?? base?.meters ?? [],
    benefitKeys: attrs.benefitKeys ?? base?.benefitKeys ?? [],
    featureKeys: attrs.featureKeys ?? base?.featureKeys ?? [],
    usageKeys: attrs.usageKeys ?? base?.usageKeys ?? [],
    advantageKeys: attrs.advantageKeys ?? base?.advantageKeys ?? [],
    order: resolveOrder(api.sortOrder, attrs.order, base?.order, 0),
    /*
     * Empty on a list, which is correct: the endpoint does not send `images`
     * there and every section that reads a slot lives on the product page.
     */
    images,
    // Only the by-slug response carries these, so on a list they are simply
    // absent — the catalogue has no use for them and they would bloat the
    // response.
    blocks: api.blocks?.length
      ? [...api.blocks].sort((a, b) => a.position - b.position)
      : undefined,
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
    /*
     * No slots: the junction sends five fields and none of them is `images`.
     * A card needs the cover, which it has, and every section that reads a slot
     * lives on the product page this card links to.
     */
    images: base?.images,
    sku: base?.sku ?? "",
    volume: base?.volume ?? "",
    highlights: base?.highlights ?? [],
    meters: base?.meters ?? [],
    benefitKeys: base?.benefitKeys ?? [],
    featureKeys: base?.featureKeys ?? [],
    usageKeys: base?.usageKeys ?? [],
    advantageKeys: base?.advantageKeys ?? [],
    order: base?.order ?? 0,
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

/**
 * The catalogue in the order the shop wants it shown.
 *
 * The API answers in its own insertion order, which has nothing to do with the
 * merchandising sequence, so `order` — the admin's `sortOrder`, falling back to
 * the bundled catalogue — is what decides the grid. The sort is stable, so
 * products sharing a number keep the order the API sent.
 */
const byOrder = (products: Product[]) => [...products].sort((a, b) => a.order - b.order);

export async function getProducts(): Promise<Product[]> {
  const api = await fetchApiProducts();
  if (!api?.length) return byOrder(staticProducts);
  /*
   * Sold-out products are dropped here rather than badged.
   *
   * The catalogue has to keep listing them — people search for a product by
   * name and need to find it, if only to read that it is gone. A "popular
   * products" shelf is the opposite job: a shortlist the storefront chose, and
   * spending one of its few slots on something nobody can buy is a waste of the
   * best space on the home page. `isFeatured` is set in the admin and never
   * cleared when stock runs out, so the filter belongs on this side.
   */
  return byOrder(api.map(toProduct).filter((product) => !isSoldOut(product)));
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

  if (!api?.length) return byOrder(staticProducts);
  return byOrder(api.map(toProduct));
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
