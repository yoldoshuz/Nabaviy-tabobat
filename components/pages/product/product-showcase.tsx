"use client";

import Image from "next/image";
import { useFormatter, useTranslations } from "next-intl";
import { useState } from "react";

import { AddToCartButton } from "@/components/shared/add-to-cart-button";
import { ProductImage } from "@/components/shared/product-image";
import { Container } from "@/components/shared/container";
import { GreenLeaf } from "@/components/shared/green-leaf";
import { QuantityInput } from "@/components/shared/quantity-input";
import { Link } from "@/lib/i18n/navigation";
import { cn, isSoldOut } from "@/lib/utils";
import type { Product } from "@/types";

const featureKeys = [
  "volume",
  "form",
  "age",
  "country",
  "shelfLife",
  "storage",
] as const;

export function ProductShowcase({ product }: { product: Product }) {
  const t = useTranslations("product");
  const tCommon = useTranslations("common");
  const tCatalog = useTranslations(`catalog.${product.slug}`);
  const format = useFormatter();
  const [quantity, setQuantity] = useState(1);

  const images = [product.image, product.imageBack, product.gallery[0]];
  const [active, setActive] = useState(0);
  const soldOut = isSoldOut(product);

  return (
    <section className="relative overflow-hidden bg-white pt-8 pb-16 lg:pb-24">
      <GreenLeaf
        variant={4}
        className="top-4 right-0 hidden w-[230px] opacity-90 lg:block"
      />
      <GreenLeaf
        variant={3}
        className="-bottom-8 left-0 hidden w-[170px] opacity-90 lg:block"
      />

      <Container className="relative grid gap-10 lg:grid-cols-2 lg:gap-14">
        <div>
          <div className="flex aspect-square items-center justify-center rounded-xl bg-stone/60 p-8">
            <ProductImage
              key={images[active]}
              slug={product.slug}
              src={images[active]}
              alt={tCatalog("name")}
              width={420}
              height={520}
              priority
              sizes="(min-width: 1024px) 520px, 90vw"
              className="h-[72%] w-auto object-contain drop-shadow-[0_16px_30px_rgba(16,40,27,0.2)]"
            />
          </div>

          <ul className="mt-4 grid grid-cols-3 gap-4">
            {images.map((image, index) => (
              <li key={image + index}>
                <button
                  type="button"
                  onClick={() => setActive(index)}
                  aria-label={t("galleryThumb", {
                    product: tCatalog("name"),
                    index: index + 1,
                  })}
                  aria-current={index === active}
                  className={cn(
                    "flex aspect-[190/175] w-full items-center justify-center overflow-hidden rounded-lg border-2 bg-stone/50 p-3 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
                    index === active ? "border-brand" : "border-transparent",
                  )}
                >
                  <Image
                    src={image}
                    alt=""
                    aria-hidden
                    width={160}
                    height={260}
                    sizes="180px"
                    className="h-[88%] w-auto object-contain"
                  />
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <nav aria-label="breadcrumb" className="text-xs text-muted-foreground">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link href="/" className="transition-colors hover:text-brand">
                  {t("breadcrumbHome")}
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li>
                <Link
                  href="/products"
                  className="transition-colors hover:text-brand"
                >
                  {t("breadcrumbProducts")}
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li aria-current="page" className="text-brand/70">
                {tCatalog("name")}
              </li>
            </ol>
          </nav>

          <h1 className="mt-4 text-4xl text-brand sm:text-5xl">
            {tCatalog("name")}
          </h1>
          <p className="mt-2 text-sm text-gold-strong">{tCatalog("tagline")}</p>

          <p className="mt-6 max-w-lg text-sm leading-relaxed text-brand/75">
            {tCatalog("description")}
          </p>

          <p className="mt-10 text-2xl text-brand">
            {tCommon("priceValue", { value: format.number(product.price) })}
          </p>

          {soldOut ? (
            /*
             * With nothing in stock there is no quantity worth picking, so the
             * row is replaced outright rather than greyed in place: a dimmed
             * stepper beside a dimmed button still invites a try, and this page
             * was taking the order all the way through to checkout.
             */
            <div className="mt-5 rounded-lg border border-border bg-stone/60 px-5 py-4">
              <p className="text-base font-medium text-brand">
                {tCommon("outOfStock")}
              </p>
              <p className="mt-1 text-sm leading-relaxed text-brand/70">
                {tCommon("outOfStockNote")}
              </p>
            </div>
          ) : (
            <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center">
              <QuantityInput
                value={quantity}
                onChange={setQuantity}
                size="lg"
                className="w-full sm:w-auto"
              />
              <AddToCartButton
                slug={product.slug}
                quantity={quantity}
                size="lg"
                withIcon={false}
                className="w-full flex-1 sm:w-auto sm:max-w-xs"
              />
            </div>
          )}

          <h2 className="mt-10 text-2xl text-brand">{t("features")}</h2>
          <dl className="mt-5 space-y-3 text-sm">
            {featureKeys.map((key) => (
              <div key={key} className="grid gap-1 sm:grid-cols-[1fr_1.2fr]">
                <dt className="text-brand/60">{t(`featureLabels.${key}`)}</dt>
                <dd className="text-brand/85">
                  {key === "volume"
                    ? product.volume
                    : t(`featureValues.${key}`)}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </Container>
    </section>
  );
}
