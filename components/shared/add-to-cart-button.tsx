"use client";

import { Check, ShoppingCart } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { useCart } from "@/hooks/use-cart";
import { cn } from "@/lib/utils";
import type { ProductSlug } from "@/types";

interface AddToCartButtonProps {
  slug: ProductSlug;
  quantity?: number;
  className?: string;
  size?: "sm" | "lg";
  withIcon?: boolean;
}

export function AddToCartButton({
  slug,
  quantity = 1,
  className,
  size = "sm",
  withIcon = true,
}: AddToCartButtonProps) {
  const t = useTranslations("common");
  const tProduct = useTranslations("product");
  const { add } = useCart();
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!added) return;
    const timeout = window.setTimeout(() => setAdded(false), 1800);
    return () => window.clearTimeout(timeout);
  }, [added]);

  return (
    <button
      type="button"
      onClick={() => {
        add(slug, quantity);
        setAdded(true);
      }}
      className={cn(
        "group inline-flex items-center justify-center gap-2 rounded-lg bg-brand font-medium text-cream transition-colors hover:bg-brand-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
        size === "sm" ? "h-11 px-4 text-sm" : "h-14 px-8 text-base",
        className,
      )}
    >
      <span>{added ? tProduct("added") : t("addToCart")}</span>
      {withIcon ? (
        added ? (
          <Check className="size-4 shrink-0" aria-hidden />
        ) : (
          <ShoppingCart className="size-4 shrink-0" aria-hidden />
        )
      ) : null}
    </button>
  );
}
