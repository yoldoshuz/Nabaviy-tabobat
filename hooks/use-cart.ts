"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";

import { getProduct, isProductSlug } from "@/lib/products";
import type { CartItem, CartLine, ProductSlug } from "@/types";

const STORAGE_KEY = "nt-cart";
const EVENT = "nt-cart-change";

let memoryState: CartItem[] = [];
let hydrated = false;

function parse(raw: string | null): CartItem[] {
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(
        (item): item is CartItem =>
          typeof item === "object" &&
          item !== null &&
          typeof (item as CartItem).slug === "string" &&
          isProductSlug((item as CartItem).slug) &&
          Number.isFinite((item as CartItem).quantity),
      )
      .map((item) => ({
        slug: item.slug,
        quantity: Math.min(99, Math.max(1, Math.round(item.quantity))),
      }));
  } catch {
    return [];
  }
}

function read(): CartItem[] {
  if (typeof window === "undefined") return memoryState;
  if (!hydrated) {
    memoryState = parse(window.localStorage.getItem(STORAGE_KEY));
    hydrated = true;
  }
  return memoryState;
}

function write(next: CartItem[]) {
  memoryState = next;
  hydrated = true;
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    window.dispatchEvent(new Event(EVENT));
  }
}

function subscribe(onChange: () => void) {
  if (typeof window === "undefined") return () => {};
  const handleStorage = (event: StorageEvent) => {
    if (event.key && event.key !== STORAGE_KEY) return;
    hydrated = false;
    onChange();
  };
  window.addEventListener(EVENT, onChange);
  window.addEventListener("storage", handleStorage);
  return () => {
    window.removeEventListener(EVENT, onChange);
    window.removeEventListener("storage", handleStorage);
  };
}

const serverSnapshot: CartItem[] = [];

export function useCart() {
  const items = useSyncExternalStore(subscribe, read, () => serverSnapshot);

  const add = useCallback((slug: ProductSlug, quantity = 1) => {
    const current = read();
    const existing = current.find((item) => item.slug === slug);
    const next = existing
      ? current.map((item) =>
          item.slug === slug
            ? { ...item, quantity: Math.min(99, item.quantity + quantity) }
            : item,
        )
      : [...current, { slug, quantity: Math.min(99, Math.max(1, quantity)) }];
    write(next);
  }, []);

  const setQuantity = useCallback((slug: ProductSlug, quantity: number) => {
    const current = read();
    const next =
      quantity <= 0
        ? current.filter((item) => item.slug !== slug)
        : current.map((item) =>
            item.slug === slug
              ? { ...item, quantity: Math.min(99, quantity) }
              : item,
          );
    write(next);
  }, []);

  const remove = useCallback((slug: ProductSlug) => {
    write(read().filter((item) => item.slug !== slug));
  }, []);

  const clear = useCallback(() => write([]), []);

  const lines = useMemo<CartLine[]>(
    () =>
      items.flatMap((item) => {
        const product = getProduct(item.slug);
        if (!product) return [];
        return [{ ...item, product, total: product.price * item.quantity }];
      }),
    [items],
  );

  const count = lines.reduce((sum, line) => sum + line.quantity, 0);
  const subtotal = lines.reduce((sum, line) => sum + line.total, 0);

  return { items, lines, count, subtotal, add, setQuantity, remove, clear };
}
