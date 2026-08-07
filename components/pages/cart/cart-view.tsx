"use client";

import { useCart, useMounted } from "@/hooks";
import { Headphones, Leaf, Trash2, Truck } from "lucide-react";
import Image from "next/image";
import { useFormatter, useTranslations } from "next-intl";

import { ConsultationButton } from "@/components/layout/consultation-button";
import { Container } from "@/components/shared/container";
import { QuantityInput } from "@/components/shared/quantity-input";
import { Link } from "@/lib/i18n/navigation";

const benefits = [
  { key: "delivery", Icon: Truck },
  { key: "natural", Icon: Leaf },
  { key: "support", Icon: Headphones },
] as const;

export function CartView() {
  const t = useTranslations("cart");
  const tCommon = useTranslations("common");
  const tCatalog = useTranslations("catalog");
  const format = useFormatter();
  const { lines, count, subtotal, setQuantity, remove } = useCart();
  const mounted = useMounted();

  return (
    <section className="bg-white pt-12 pb-16 lg:pb-24">
      <Container>
        <h1 className="text-3xl text-brand sm:text-4xl">{t("title")}</h1>

        {!mounted ? (
          <p className="mt-10 text-sm text-muted-foreground">
            {tCommon("loading")}
          </p>
        ) : lines.length === 0 ? (
          <div className="mt-10 rounded-lg bg-white p-10 text-center shadow-card ring-1 ring-border">
            <p className="text-lg text-brand">{t("empty")}</p>
            <p className="mt-3 text-sm text-muted-foreground">
              {t("emptyDescription")}
            </p>
            <Link
              href="/products"
              className="mt-7 inline-flex h-12 items-center justify-center rounded-lg bg-brand px-8 text-sm font-medium text-cream transition-colors hover:bg-brand-soft"
            >
              {tCommon("viewProducts")}
            </Link>
          </div>
        ) : (
          <>
            <div className="mt-8 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
              <ul className="rounded-lg bg-white p-4 shadow-card ring-1 ring-border sm:p-6">
                {lines.map((line, index) => (
                  <li
                    key={line.slug}
                    className={
                      index === lines.length - 1
                        ? "py-4"
                        : "border-b border-border py-4"
                    }
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                      <Image
                        src={line.product.gallery[0]}
                        alt={tCatalog(`${line.slug}.name`)}
                        width={196}
                        height={196}
                        sizes="96px"
                        className="size-24 shrink-0 rounded-lg object-cover"
                      />

                      <div className="min-w-0 flex-1">
                        <Link
                          href={`/products/${line.slug}`}
                          className="text-base text-brand transition-colors hover:text-brand-soft"
                        >
                          {tCatalog(`${line.slug}.name`)}
                        </Link>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {t("naturalProduct")}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {line.product.volume}
                        </p>
                        <p className="mt-2 text-sm text-brand">
                          {tCommon("priceValue", {
                            value: format.number(line.product.price),
                          })}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <QuantityInput
                          value={line.quantity}
                          onChange={(value) => setQuantity(line.slug, value)}
                        />
                        <button
                          type="button"
                          onClick={() => remove(line.slug)}
                          aria-label={`${tCommon("remove")}: ${tCatalog(`${line.slug}.name`)}`}
                          className="flex size-11 items-center justify-center rounded-full bg-brand text-cream transition-colors hover:bg-brand-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                        >
                          <Trash2 className="size-4" aria-hidden />
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              <aside className="rounded-lg bg-brand p-6 text-cream sm:p-7">
                <h2 className="text-xl text-cream">{t("summaryTitle")}</h2>

                <dl className="mt-7 space-y-4 text-sm">
                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-cream/80">{t("items", { count })}</dt>
                    <dd>
                      {tCommon("priceValue", {
                        value: format.number(subtotal),
                      })}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-cream/80">{t("delivery")}</dt>
                    <dd>{t("deliveryFree")}</dd>
                  </div>
                </dl>

                <div className="mt-5 flex items-center justify-between gap-4 border-t border-brand-line pt-5 text-base">
                  <span className="text-cream/80">{t("total")}</span>
                  <span>
                    {tCommon("priceValue", { value: format.number(subtotal) })}
                  </span>
                </div>

                <Link
                  href="/checkout"
                  className="mt-6 flex h-12 items-center justify-center rounded-lg bg-gold text-sm font-medium text-brand transition-colors hover:bg-sand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
                >
                  {t("checkout")}
                </Link>

                <ul className="mt-6 space-y-4 rounded-lg bg-brand-deep p-5">
                  {benefits.map(({ key, Icon }) => (
                    <li key={key} className="flex items-center gap-4">
                      <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-gold text-brand">
                        <Icon className="size-5" aria-hidden />
                      </span>
                      <span>
                        <span className="block text-sm text-cream">
                          {t(`benefits.${key}.title`)}
                        </span>
                        <span className="block text-xs text-gold">
                          {t(`benefits.${key}.description`)}
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>
              </aside>
            </div>

            <div className="mt-6 flex flex-col items-center gap-6 rounded-lg bg-brand px-6 py-7 text-cream sm:px-10 lg:flex-row lg:justify-between">
              <div className="flex items-center gap-5">
                <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-gold text-brand">
                  <Headphones className="size-6" aria-hidden />
                </span>
                <span>
                  <span className="block text-base">{t("helpTitle")}</span>
                  <span className="mt-1 block text-sm text-cream/70">
                    {t("helpDescription")}
                  </span>
                </span>
              </div>

              <ConsultationButton
                long
                className="h-12 w-full bg-gold px-10 hover:bg-sand lg:w-auto"
              />
            </div>
          </>
        )}
      </Container>
    </section>
  );
}
