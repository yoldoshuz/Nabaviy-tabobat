"use client";

import { CircleCheck } from "lucide-react";
import Image from "next/image";
import { useFormatter, useTranslations } from "next-intl";
import { useState, type FormEvent } from "react";

import { Container } from "@/components/shared/container";
import { GreenLeaf } from "@/components/shared/green-leaf";
import { useCart } from "@/hooks/use-cart";
import { useMounted } from "@/hooks/use-mounted";
import { Link } from "@/lib/i18n/navigation";
import { cn } from "@/lib/utils";

const fields = ["name", "phone", "city", "address"] as const;
type FieldKey = (typeof fields)[number];

const autoComplete: Record<FieldKey, string> = {
  name: "name",
  phone: "tel",
  city: "address-level2",
  address: "street-address",
};

export function CheckoutView() {
  const t = useTranslations("checkout");
  const tCommon = useTranslations("common");
  const tCatalog = useTranslations("catalog");
  const format = useFormatter();
  const { lines, count, subtotal, clear } = useCart();
  const mounted = useMounted();

  const [errors, setErrors] = useState<Partial<Record<FieldKey, string>>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const nextErrors: Partial<Record<FieldKey, string>> = {};
    for (const field of fields) {
      if (!String(data.get(field) ?? "").trim()) {
        nextErrors[field] = t("errorRequired");
      }
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setStatus("sending");
    // Payment provider (CLICK) and order API are wired once the backend is ready.
    await new Promise((resolve) => window.setTimeout(resolve, 700));
    clear();
    setStatus("done");
  }

  if (status === "done") {
    return (
      <section className="bg-white pt-12 pb-20">
        <Container>
          <div className="mx-auto max-w-lg rounded-lg bg-white p-10 text-center shadow-card ring-1 ring-border">
            <CircleCheck className="mx-auto size-12 text-gold-strong" aria-hidden />
            <h1 className="mt-5 text-2xl text-brand">{t("successTitle")}</h1>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {t("successText")}
            </p>
            <Link
              href="/products"
              className="mt-7 inline-flex h-12 items-center justify-center rounded-lg bg-brand px-8 text-sm font-medium text-cream transition-colors hover:bg-brand-soft"
            >
              {tCommon("viewProducts")}
            </Link>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden bg-white pt-12 pb-16 lg:pb-24">
      <GreenLeaf
        variant={4}
        className="top-4 right-0 hidden w-[200px] opacity-90 lg:block"
      />

      <Container className="relative">
        <h1 className="text-3xl text-brand sm:text-4xl">{t("title")}</h1>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_1fr]"
        >
          <div className="space-y-6">
            <div className="rounded-lg bg-white p-6 shadow-card ring-1 ring-border sm:p-8">
              <h2 className="text-xl text-brand">{t("contactTitle")}</h2>

              <div className="mt-7 space-y-5">
                {fields.map((field) => (
                  <div key={field} className="space-y-2">
                    <label
                      htmlFor={`checkout-${field}`}
                      className="block text-xs text-muted-foreground"
                    >
                      {t(`${field}Label`)}
                    </label>
                    <input
                      id={`checkout-${field}`}
                      name={field}
                      type={field === "phone" ? "tel" : "text"}
                      autoComplete={autoComplete[field]}
                      placeholder={t(`${field}Placeholder`)}
                      aria-invalid={Boolean(errors[field])}
                      aria-describedby={
                        errors[field] ? `checkout-${field}-error` : undefined
                      }
                      className={cn(
                        "h-12 w-full rounded-lg border border-input bg-white px-4 text-sm text-brand outline-none transition-shadow placeholder:text-brand/35 focus-visible:ring-3 focus-visible:ring-brand/20",
                        errors[field] && "border-destructive",
                      )}
                    />
                    {errors[field] ? (
                      <p
                        id={`checkout-${field}-error`}
                        className="text-xs text-destructive"
                      >
                        {errors[field]}
                      </p>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-lg bg-white p-6 shadow-card ring-1 ring-border sm:p-8">
              <h2 className="text-xl text-brand">{t("deliveryTitle")}</h2>
              <div className="mt-5 flex items-center justify-between gap-4 rounded-lg border border-border px-5 py-4">
                <span className="text-sm text-brand/85">
                  {t("deliveryOption")}
                </span>
                <span className="text-sm text-brand">{t("deliveryPrice")}</span>
              </div>
            </div>
          </div>

          <aside className="rounded-lg bg-white p-6 shadow-card ring-1 ring-border sm:p-8">
            <h2 className="text-xl text-brand">{t("orderTitle")}</h2>

            {!mounted ? (
              <p className="mt-6 text-sm text-muted-foreground">
                {tCommon("loading")}
              </p>
            ) : lines.length === 0 ? (
              <p className="mt-6 text-sm text-muted-foreground">
                {t("emptyCart")}
              </p>
            ) : (
              <ul className="mt-6 space-y-5">
                {lines.map((line) => (
                  <li key={line.slug} className="flex items-center gap-4">
                    <Image
                      src={line.product.image}
                      alt={tCatalog(`${line.slug}.name`)}
                      width={96}
                      height={130}
                      sizes="72px"
                      className="h-[72px] w-auto rounded-lg bg-stone/60 object-contain p-1"
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm text-brand">
                        {tCatalog(`${line.slug}.name`)}
                      </span>
                      <span className="block text-xs text-muted-foreground">
                        {tCommon("pcs", { count: line.quantity })}
                      </span>
                    </span>
                    <span className="shrink-0 text-sm text-brand">
                      {tCommon("priceValue", {
                        value: format.number(line.total),
                      })}
                    </span>
                  </li>
                ))}
              </ul>
            )}

            <dl className="mt-7 space-y-3 border-t border-border pt-5 text-sm">
              <div className="flex items-center justify-between gap-4">
                <dt className="text-brand/70">{t("items", { count })}</dt>
                <dd className="text-brand">
                  {tCommon("priceValue", { value: format.number(subtotal) })}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-brand/70">{t("delivery")}</dt>
                <dd className="text-brand">{t("deliveryPrice")}</dd>
              </div>
            </dl>

            <div className="mt-5 flex items-center justify-between gap-4 border-t border-border pt-5 text-base">
              <span className="text-brand/70">{t("total")}</span>
              <span className="text-brand">
                {tCommon("priceValue", { value: format.number(subtotal) })}
              </span>
            </div>

            <button
              type="submit"
              disabled={status === "sending" || lines.length === 0}
              className="mt-6 flex h-13 w-full items-center justify-center rounded-lg bg-brand text-sm font-medium text-cream transition-colors hover:bg-brand-soft disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              {status === "sending" ? t("processing") : t("pay")}
            </button>
          </aside>
        </form>
      </Container>
    </section>
  );
}
