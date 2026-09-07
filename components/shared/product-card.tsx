import { useTranslations } from "next-intl";

import { AddToCartButton } from "@/components/shared/add-to-cart-button";
import { ProductImage } from "@/components/shared/product-image";
import { formatPrice } from "@/lib/format";
import { Link } from "@/lib/i18n/navigation";
import { cn, isSoldOut } from "@/lib/utils";
import type { Product } from "@/types";

interface ProductCardProps {
  product: Product;
  badge: string;
  className?: string;
}

/** Compact catalog card used on the products listing (Figma "Продукты"). */
export function ProductCard({ product, badge, className }: ProductCardProps) {
  const t = useTranslations(`catalog.${product.slug}`);
  const tCommon = useTranslations("common");
  const soldOut = isSoldOut(product);

  return (
    <article
      className={cn(
        "group flex flex-col rounded-lg border border-border bg-white p-6 text-center transition-shadow hover:shadow-card",
        className,
      )}
    >
      {/* A zero-stock product stays in the grid — the admin keeps it "Активный" —
          but the eyebrow that sold it now states the status instead. */}
      <p
        className={cn(
          "text-xs font-medium tracking-[0.3em] uppercase",
          soldOut ? "text-brand/50" : "text-gold-strong",
        )}
      >
        {soldOut ? tCommon("outOfStock") : badge}
      </p>

      <Link
        href={`/products/${product.slug}`}
        className="mt-6 block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
      >
        <ProductImage
          slug={product.slug}
          src={product.image}
          alt={t("name")}
          width={170}
          height={275}
          sizes="170px"
          className={cn(
            "mx-auto h-[155px] w-auto object-contain transition-transform duration-300 group-hover:scale-105",
            // Drained of colour, so the card reads as unavailable at a glance.
            soldOut && "opacity-45 saturate-25",
          )}
        />
      </Link>

      <h3 className="mt-6 text-xl text-brand">
        <Link
          href={`/products/${product.slug}`}
          className="font-brand font-normal transition-colors hover:text-brand-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        >
          {t("name")}
        </Link>
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">{t("tagline")}</p>

      <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-border pt-5 sm:flex-row">
        <p className="text-xs font-medium whitespace-nowrap text-brand">
          {tCommon("price", { value: formatPrice(product.price) })}
        </p>
        <AddToCartButton
          slug={product.slug}
          soldOut={soldOut}
          className="h-10 w-full px-3 text-xs whitespace-nowrap sm:w-auto"
        />
      </div>
    </article>
  );
}
