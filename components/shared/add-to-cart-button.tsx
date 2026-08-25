"use client";

import { Minus, Plus, ShoppingCart } from "lucide-react";
import { useTranslations } from "next-intl";

import { useCart } from "@/hooks";
import { cn } from "@/lib/utils";
import type { ProductSlug } from "@/types";

interface AddToCartButtonProps {
  slug: ProductSlug;
  quantity?: number;
  className?: string;
  size?: "sm" | "lg";
  withIcon?: boolean;
  /** Nothing left in stock — the control is shown, disabled, in its place. */
  soldOut?: boolean;
}

/**
 * "Add to cart" until the product is in the basket, then an inline stepper.
 *
 * Both states fill the same box: swapping the label for a longer confirmation
 * string used to resize the button and shift everything laid out next to it.
 * Stepping below one drops the line and restores the button.
 */
export function AddToCartButton({
  slug,
  quantity = 1,
  className,
  size = "sm",
  withIcon = true,
  soldOut = false,
}: AddToCartButtonProps) {
  const t = useTranslations("common");
  const tProduct = useTranslations("product");
  const { add, setQuantity, lines, ready } = useCart();

  const inCart = lines.find((line) => line.slug === slug)?.quantity ?? 0;

  /*
   * Sold out outranks everything, including a line already in the basket: the
   * stock ran out while the shopper was browsing and the honest answer is that
   * it cannot be ordered, not a stepper that pretends it can.
   */
  if (soldOut) {
    return (
      <button
        type="button"
        disabled
        className={cn(
          "inline-flex cursor-not-allowed items-center justify-center gap-2 rounded-lg border border-border bg-stone/60 font-medium text-brand/45",
          size === "sm" ? "h-11 px-4 text-sm" : "h-14 px-8 text-base",
          className,
        )}
      >
        <span>{t("outOfStock")}</span>
      </button>
    );
  }

  if (ready && inCart > 0) {
    return (
      <div
        className={cn(
          "inline-flex items-center justify-between gap-1 rounded-lg bg-brand px-2 font-medium text-cream",
          size === "sm" ? "h-11 text-sm" : "h-14 text-base",
          className,
        )}
      >
        <button
          type="button"
          onClick={() => setQuantity(slug, inCart - 1)}
          aria-label={tProduct("decrease")}
          className="grid size-9 place-items-center rounded-md transition hover:bg-cream/20"
        >
          <Minus className="size-4" aria-hidden />
        </button>
        <output aria-label={tProduct("quantity")} className="min-w-8 text-center tabular-nums">
          {inCart}
        </output>
        <button
          type="button"
          onClick={() => setQuantity(slug, inCart + 1)}
          disabled={inCart >= 99}
          aria-label={tProduct("increase")}
          className="grid size-9 place-items-center rounded-md transition hover:bg-cream/20 disabled:opacity-40"
        >
          <Plus className="size-4" aria-hidden />
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => add(slug, quantity)}
      className={cn(
        "group inline-flex items-center justify-center gap-2 rounded-lg bg-brand font-medium text-cream transition-colors hover:bg-brand-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
        size === "sm" ? "h-11 px-4 text-sm" : "h-14 px-8 text-base",
        className,
      )}
    >
      <span>{t("addToCart")}</span>
      {withIcon ? <ShoppingCart className="size-4 shrink-0" aria-hidden /> : null}
    </button>
  );
}
