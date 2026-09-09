import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

import type { ImageSlotKey } from "@/lib/api/types"
import type { Product } from "@/types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Whether the catalogue has nothing left to sell of this product.
 *
 * `stock` is only present on products resolved from the API; the bundled static
 * catalogue has no inventory at all, and `undefined` there must not read as
 * zero or the offline storefront would show every product sold out. The admin
 * keeps listing a product with `stock: 0` as "Активный" — active means visible,
 * not orderable, and until this existed the storefront happily took the order.
 */
export function isSoldOut(product: { stock?: number }): boolean {
  return typeof product.stock === "number" && product.stock <= 0
}

/**
 * The picture a moderator placed into a named slot, or the given fallback.
 *
 * Every section below the price used to borrow from the same unordered upload
 * pile by index — `banners[2]`, `gallery[1]` — so which photo appeared where was
 * an accident of upload order, and a product with two uploads left holes. Now
 * each section asks for the frame that was placed in its own slot, and the
 * borrowed one is only the floor underneath.
 */
export function slotImage(
  product: Pick<Product, "slots">,
  slot: ImageSlotKey,
  fallback: string | undefined,
): string | undefined {
  return product.slots?.[slot]?.url || fallback
}
