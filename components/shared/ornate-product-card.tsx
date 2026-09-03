import { useTranslations } from "next-intl";

import { AddToCartButton } from "@/components/shared/add-to-cart-button";
import { ProductImage } from "@/components/shared/product-image";
import { formatPrice } from "@/lib/format";
import { Link } from "@/lib/i18n/navigation";
import { cn, isSoldOut } from "@/lib/utils";
import type { Product } from "@/types";

interface OrnateProductCardProps {
  product: Product;
  badge: string;
  className?: string;
}

/**
 * Featured product card from the Figma home page: gold ornament frame around a
 * cream inner card with the bottle, benefits list, price and cart action.
 */
export function OrnateProductCard({
  product,
  badge,
  className,
}: OrnateProductCardProps) {
  const t = useTranslations(`catalog.${product.slug}`);
  const tCommon = useTranslations("common");
  const soldOut = isSoldOut(product);

  return (
    <article
      className={cn(
        "ornament-frame relative flex flex-col rounded-[10px] bg-cream p-5 shadow-card sm:p-7",
        className,
      )}
    >
      <div className="flex flex-1 flex-col gap-5 rounded-[4px] border border-gold/50 bg-white px-5 py-7 text-center sm:px-6">
        {/* A zero-stock product stays on the page — the admin keeps it
            "Активный" — but the eyebrow that sold it now states the status. */}
        <p
          className={cn(
            "text-xs font-medium tracking-[0.32em] uppercase",
            soldOut ? "text-brand/50" : "text-gold-strong",
          )}
        >
          {soldOut ? tCommon("outOfStock") : badge}
        </p>

        <Link
          href={`/products/${product.slug}`}
          className="mx-auto block transition-transform duration-300 hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
        >
          <ProductImage
            slug={product.slug}
            src={product.image}
            alt={t("name")}
            width={200}
            height={320}
            sizes="200px"
            className={cn(
              "mx-auto h-[180px] w-auto object-contain",
              // Drained of colour, so the card reads as unavailable at a glance.
              soldOut && "opacity-45 saturate-25",
            )}
          />
        </Link>

        <div className="space-y-1">
          <h3 className="text-2xl text-brand">
            <Link
              href={`/products/${product.slug}`}
              className="font-brand font-normal transition-colors hover:text-brand-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              {t("name")}
            </Link>
          </h3>
          <p className="text-sm text-muted-foreground">{t("tagline")}</p>
        </div>

        <p className="text-sm leading-relaxed text-brand/80">{t("short")}</p>

        <ul className="space-y-1.5 text-sm leading-relaxed text-brand/75">
          {(["one", "two", "three", "four"] as const).map((key) => (
            <li key={key}>{t(`features.${key}`)}</li>
          ))}
        </ul>

        <div className="mt-auto flex flex-col items-center justify-between gap-3 pt-4 sm:flex-row">
          <p className="text-xs font-medium whitespace-nowrap text-brand">
            {tCommon("price", { value: formatPrice(product.price) })}
          </p>
          <AddToCartButton
            slug={product.slug}
            soldOut={soldOut}
            className="h-10 w-full px-3 text-xs whitespace-nowrap sm:w-auto"
          />
        </div>
      </div>
    </article>
  );
}
