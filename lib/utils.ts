import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

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
