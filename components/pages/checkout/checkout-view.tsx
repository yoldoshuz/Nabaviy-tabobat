"use client";

import { useAuth, useCart, useCheckout, useMounted } from "@/hooks";
import { formatUzPhoneInput, UZ_PHONE_PREFIX } from "@/lib/phone";
import { CircleCheck } from "lucide-react";
import Image from "next/image";
import { useFormatter, useTranslations } from "next-intl";
import { useState, type FormEvent } from "react";

import { Container } from "@/components/shared/container";
import { GreenLeaf } from "@/components/shared/green-leaf";
import { enabledPaymentMethods, normalizePhone } from "@/lib/api/checkout";
import type { OfferedPaymentMethod } from "@/lib/api/types";
import { Link } from "@/lib/i18n/navigation";
import { cn } from "@/lib/utils";

const fields = ["name", "surname", "phone", "city", "address"] as const;
type FieldKey = (typeof fields)[number];

const autoComplete: Record<FieldKey, string> = {
  name: "given-name",
  surname: "family-name",
  phone: "tel",
  city: "address-level2",
  address: "street-address",
};

export function CheckoutView() {
  const t = useTranslations("checkout");
  const tCommon = useTranslations("common");
  const tCatalog = useTranslations("catalog");
  const format = useFormatter();
  const { lines, count, subtotal, totals } = useCart();
  const { user } = useAuth();

  /**
   * What the account already knows, so a signed-in customer is not asked to
   * type it again. Empty for a guest, who fills the form as before.
   */
  const prefill: Partial<Record<(typeof fields)[number], string>> = user
    ? {
        name: user.firstName,
        surname: user.lastName ?? "",
        phone: formatUzPhoneInput(user.phone),
      }
    : {};
  const mounted = useMounted();
  const { phase, errorKey, orderId, busy, setErrorKey, submit } = useCheckout();

  // First offered wins, so the preselected method follows the list rather than
  // a second constant that could drift from it.
  const methods = enabledPaymentMethods();
  const [method, setMethod] = useState<OfferedPaymentMethod>(methods[0] ?? "click");

  const [errors, setErrors] = useState<Partial<Record<FieldKey, string>>>({});

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;

    const data = new FormData(event.currentTarget);

    const nextErrors: Partial<Record<FieldKey, string>> = {};
    for (const field of fields) {
      if (!String(data.get(field) ?? "").trim()) {
        nextErrors[field] = t("errorRequired");
      }
    }

    const phone = normalizePhone(String(data.get("phone") ?? ""));
    if (!nextErrors.phone && !phone) nextErrors.phone = t("errorPhone");

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setErrorKey(null);
    submit({
      method,
      payload: {
        customerName: String(data.get("name") ?? "").trim(),
        customerSurname: String(data.get("surname") ?? "").trim(),
        customerPhone: phone as string,
        // The API takes a single address line; the city input is folded in.
        customerAddress: [data.get("city"), data.get("address")]
          .map((part) => String(part ?? "").trim())
          .filter(Boolean)
          .join(", "),
        deliveryType: "delivery",
      },
    });
  }

  if (orderId && !errorKey) {
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
          key={user?.id ?? "guest"}
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
                      defaultValue={
                        prefill[field] ?? (field === "phone" ? UZ_PHONE_PREFIX : undefined)
                      }
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
                    {/* Square frame, artwork letterboxed inside — a jar and a
                        bottle occupy the same box instead of one coming out
                        twice as wide as the other. */}
                    <span className="grid size-18 shrink-0 place-items-center overflow-hidden rounded-lg bg-stone/60">
                      <Image
                        src={line.product.image}
                        alt={tCatalog(`${line.slug}.name`)}
                        width={72}
                        height={72}
                        sizes="72px"
                        className="h-full w-full object-contain p-1.5"
                      />
                    </span>
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
              {/* Priced by the API so this line and the created order cannot
                  disagree; free from two units up. */}
              <div className="flex items-center justify-between gap-4">
                <dt className="text-brand/70">{t("delivery")}</dt>
                <dd className="text-brand">
                  {totals.deliveryFee > 0
                    ? tCommon("priceValue", {
                        value: format.number(totals.deliveryFee),
                      })
                    : t("deliveryPrice")}
                </dd>
              </div>
            </dl>

            <div className="mt-5 flex items-center justify-between gap-4 border-t border-border pt-5 text-base">
              <span className="text-brand/70">{t("total")}</span>
              <span className="text-brand">
                {tCommon("priceValue", {
                  value: format.number(totals.grandTotal),
                })}
              </span>
            </div>

            <fieldset disabled={busy} className="mt-6">
              <legend className="text-sm font-medium text-brand">
                {t("paymentTitle")}
              </legend>
              <div className="mt-3 flex flex-col gap-2">
                {methods.map((option) => {
                  const key = option.charAt(0).toUpperCase() + option.slice(1);
                  return (
                    <label
                      key={option}
                      className={cn(
                        "flex cursor-pointer items-start gap-3 rounded-lg border px-4 py-3 transition-colors",
                        method === option
                          ? "border-brand bg-cream"
                          : "border-border hover:border-brand/40",
                      )}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={option}
                        checked={method === option}
                        onChange={() => setMethod(option)}
                        className="mt-0.5 size-4 accent-brand"
                      />
                      <span className="leading-tight">
                        <span className="block text-sm font-medium text-brand">
                          {t(`payment${key}`)}
                        </span>
                        <span className="block text-xs text-muted-foreground">
                          {t(`payment${key}Hint`)}
                        </span>
                      </span>
                    </label>
                  );
                })}
              </div>
            </fieldset>

            {errorKey ? (
              <p role="alert" className="mt-4 text-sm font-medium text-red-600">
                {t(errorKey)}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={busy || lines.length === 0}
              className="mt-6 flex h-13 w-full items-center justify-center rounded-lg bg-brand text-sm font-medium text-cream transition-colors hover:bg-brand-soft disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              {phase === "submitting"
                ? t("submitting")
                : phase === "redirecting"
                  ? t("redirecting")
                  : method === "cash"
                    ? t("payCash")
                    : t("pay")}
            </button>
          </aside>
        </form>
      </Container>
    </section>
  );
}
