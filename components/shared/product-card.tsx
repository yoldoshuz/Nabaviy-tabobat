import Image from "next/image";
import { useFormatter, useTranslations } from "next-intl";

import { AddToCartButton } from "@/components/shared/add-to-cart-button";
import { Link } from "@/lib/i18n/navigation";
import { cn } from "@/lib/utils";
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
  const format = useFormatter();

  return (
    <article
      className={cn(
        "group flex flex-col rounded-lg border border-border bg-white p-6 text-center transition-shadow hover:shadow-card",
        className,
      )}
    >
      <p className="text-xs font-medium tracking-[0.3em] text-gold-strong uppercase">
        {badge}
      </p>

      <Link
        href={`/products/${product.slug}`}
        className="mt-6 block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
      >
        <Image
          src={product.image}
          alt={t("name")}
          width={170}
          height={275}
          sizes="170px"
          className="mx-auto h-[155px] w-auto object-contain transition-transform duration-300 group-hover:scale-105"
        />
      </Link>

      <h3 className="mt-6 text-xl text-brand">
        <Link
          href={`/products/${product.slug}`}
          className="transition-colors hover:text-brand-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        >
          {t("name")}
        </Link>
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">{t("tagline")}</p>

      <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-border pt-5 sm:flex-row">
        <p className="text-xs font-medium whitespace-nowrap text-brand">
          {tCommon("price", { value: format.number(product.price) })}
        </p>
        <AddToCartButton
          slug={product.slug}
          className="h-10 w-full px-3 text-xs whitespace-nowrap sm:w-auto"
        />
      </div>
    </article>
  );
}
