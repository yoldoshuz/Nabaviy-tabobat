import Image from "next/image";
import { useTranslations } from "next-intl";

import { Container } from "@/components/shared/container";
import { GreenLeaf } from "@/components/shared/green-leaf";
import { SectionHeading } from "@/components/shared/section-heading";
import type { Product } from "@/types";

const importantKeys = ["one", "two", "three", "four", "five"] as const;

export function ProductUsage({ product }: { product: Product }) {
  const t = useTranslations("product");
  const tCatalog = useTranslations(`catalog.${product.slug}`);

  return (
    <section className="relative overflow-hidden bg-white pb-16 lg:pb-24">
      <GreenLeaf
        variant={1}
        className="top-1/3 left-0 hidden w-[130px] opacity-90 lg:block"
      />

      <Container className="relative">
        <SectionHeading
          title={t("usageTitle", { product: tCatalog("name") })}
          subtitle={t("usageSubtitle", { product: tCatalog("name") })}
          className="mx-auto"
        />

        <div className="mt-12 grid gap-8 lg:grid-cols-2 lg:gap-12">
          <ol className="relative space-y-6 border-l border-border pl-8 lg:pl-10">
            {product.usageKeys.map((key, index) => (
              <li key={key} className="relative">
                <span
                  aria-hidden
                  className="absolute top-1 -left-[3.25rem] flex size-11 items-center justify-center rounded-full border border-border bg-white font-display text-lg text-brand lg:-left-[3.75rem]"
                >
                  {index + 1}
                </span>
                <div className="rounded-lg bg-brand px-6 py-5 text-cream">
                  <h3 className="font-sans text-sm font-medium">
                    {t(`usage.${key}.title`)}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-cream/75">
                    {t(`usage.${key}.description`)}
                  </p>
                </div>
              </li>
            ))}
          </ol>

          <div className="space-y-5">
            {/*
              Contained, not cropped: both slots are filled from the product's
              uploaded photos, and a 190px-tall cover-crop of an upright bottle
              is a strip of its label blown up past recognition.
            */}
            <div className="grid gap-5 sm:grid-cols-2">
              <Image
                src={product.banners[2]}
                alt={tCatalog("name")}
                width={506}
                height={207}
                sizes="(min-width: 1024px) 260px, 45vw"
                className="h-[190px] w-full rounded-lg bg-stone object-contain"
              />
              <Image
                src={product.gallery[1]}
                alt={tCatalog("name")}
                width={271}
                height={207}
                loading="lazy"
                sizes="(min-width: 1024px) 260px, 45vw"
                className="h-[190px] w-full rounded-lg bg-stone object-contain"
              />
            </div>

            <div className="relative overflow-hidden rounded-lg">
              <Image
                src={product.banners[1]}
                alt=""
                aria-hidden
                fill
                sizes="(min-width: 1024px) 540px, 90vw"
                className="object-cover"
              />
              <div className="relative bg-brand-deep/55 px-6 py-8 sm:px-10">
                <h3 className="font-display text-lg text-gold">
                  {t("importantTitle")}
                </h3>
                <ul className="mt-4 space-y-2 text-sm leading-relaxed text-cream/90">
                  {importantKeys.map((key) => (
                    <li key={key}>{t(`important.${key}`)}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
