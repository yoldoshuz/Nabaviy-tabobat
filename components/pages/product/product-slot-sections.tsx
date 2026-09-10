/**
 * The four sections that are nothing but a photograph.
 *
 * They have no block in the CMS and no copy to speak of — a label shot, a
 * lifestyle frame, a certificate, a wide strip — so each one exists exactly as
 * long as its slot has a file in it and disappears when it does not. Every slot
 * here has been fillable in the admin for a while with nowhere on the page to
 * land, which is a large part of why none of the Nabaviy products has one.
 */

import { useTranslations } from "next-intl";

import { Container } from "@/components/shared/container";
import { GreenLeaf } from "@/components/shared/green-leaf";
import { SlotImage } from "@/components/shared/slot-image";
import { hasSlots } from "@/lib/product-images";
import type { Product } from "@/types";

/** Состав / этикетка — the pack read close up, shot square. */
export function ProductLabel({ product }: { product: Product }) {
  const t = useTranslations("product");
  const tCatalog = useTranslations(`catalog.${product.slug}`);
  if (!hasSlots(product.images, "composition_1")) return null;

  return (
    <section className="relative overflow-hidden bg-white pb-16 lg:pb-24">
      <GreenLeaf
        variant={2}
        className="top-6 left-0 hidden w-[140px] opacity-90 lg:block"
      />
      <Container className="relative grid items-center gap-10 lg:grid-cols-[1fr_minmax(0,400px)]">
        <div>
          <h2 className="text-balance text-3xl leading-[1.3] text-brand sm:text-4xl">
            {t("slots.compositionTitle")}
          </h2>
          <p className="mt-6 max-w-md text-sm leading-relaxed text-brand/75">
            {t("slots.compositionText", { product: tCatalog("name") })}
          </p>
        </div>
        <SlotImage
          images={product.images}
          slot="composition_1"
          alt={t("slots.compositionTitle")}
          sizes="(min-width: 1024px) 400px, 90vw"
          className="rounded-xl bg-stone"
          imageClassName="p-4"
        />
      </Container>
    </section>
  );
}

/** The lifestyle frame — the product in a kitchen rather than on a plate. */
export function ProductLifestyle({ product }: { product: Product }) {
  const t = useTranslations("product");
  const tCatalog = useTranslations(`catalog.${product.slug}`);
  if (!hasSlots(product.images, "lifestyle_1")) return null;

  return (
    <section className="bg-white pb-16 lg:pb-24">
      <Container>
        <SlotImage
          images={product.images}
          slot="lifestyle_1"
          alt={t("slots.lifestyleTitle", { product: tCatalog("name") })}
          sizes="(min-width: 1200px) 1140px, 92vw"
          fit="cover"
          className="rounded-xl bg-stone"
        />
      </Container>
    </section>
  );
}

/** Сертификат — upright, so it is readable rather than decorative. */
export function ProductCertificate({ product }: { product: Product }) {
  const t = useTranslations("product");
  if (!hasSlots(product.images, "certificate_1")) return null;

  return (
    <section className="relative overflow-hidden bg-white pb-16 lg:pb-24">
      <GreenLeaf
        variant={3}
        flip
        className="right-0 bottom-10 hidden w-[150px] opacity-90 lg:block"
      />
      <Container className="relative grid items-center gap-10 sm:grid-cols-[minmax(0,280px)_1fr] sm:gap-14">
        <SlotImage
          images={product.images}
          slot="certificate_1"
          alt={t("slots.certificateTitle")}
          sizes="(min-width: 640px) 280px, 80vw"
          className="mx-auto w-full max-w-[280px] rounded-lg bg-white ring-1 ring-border"
          imageClassName="p-3"
        />
        <div>
          <h2 className="text-balance text-3xl leading-[1.3] text-brand sm:text-4xl">
            {t("slots.certificateTitle")}
          </h2>
          <p className="mt-6 max-w-md text-sm leading-relaxed text-brand/75">
            {t("slots.certificateText")}
          </p>
        </div>
      </Container>
    </section>
  );
}

/**
 * The wide strip. This is the slot for a 3:1 band — the one place on the page
 * where a letterbox is the photograph's own shape rather than a crop of it.
 */
export function ProductBanner({ product }: { product: Product }) {
  const tCatalog = useTranslations(`catalog.${product.slug}`);
  if (!hasSlots(product.images, "banner_wide")) return null;

  return (
    <section className="bg-white pb-16 lg:pb-24">
      <Container>
        <SlotImage
          images={product.images}
          slot="banner_wide"
          alt={tCatalog("name")}
          sizes="(min-width: 1200px) 1140px, 92vw"
          fit="cover"
          className="rounded-xl bg-stone"
        />
      </Container>
    </section>
  );
}
