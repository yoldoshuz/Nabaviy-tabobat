"use client";

import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useRef } from "react";

import { Container } from "@/components/shared/container";
import { useCart } from "@/hooks";
import { getOrderStatus } from "@/lib/api/endpoints";
import { Link } from "@/lib/i18n/navigation";

/** The callback normally beats the browser back by a second or two. */
const POLL_MS = 2_000;
/** Past this we stop asking and tell the truth: it is still being processed. */
const POLL_CEILING_MS = 30_000;

/**
 * Where the customer lands after Click / Payme / Uzum.
 *
 * The redirect itself proves nothing — it is the same URL for a paid order, a
 * declined card and someone who hit back on the provider's form. So this
 * screen shows nothing until the server, which alone hears the provider's
 * callback, says what happened.
 */
export function PaymentReturnView() {
  const t = useTranslations("PaymentReturn");
  const params = useSearchParams();
  const orderId = params.get("orderId");
  const { refresh } = useCart();

  const startedAt = useRef(Date.now());

  const { data, isPending, isError } = useQuery({
    queryKey: ["order-status", orderId],
    queryFn: () => getOrderStatus(orderId as string),
    enabled: Boolean(orderId),
    // Only the undecided state is worth asking about again, and only for a
    // while — a payment stuck in `pending` is not an error, just unfinished.
    refetchInterval: (query) => {
      const status = query.state.data;
      if (!status?.isAwaitingPayment) return false;
      if (Date.now() - startedAt.current > POLL_CEILING_MS) return false;
      return POLL_MS;
    },
    retry: 1,
  });

  // A rolled-back order puts its lines back in the cart server-side; pull that
  // down so the basket badge is right by the time the customer clicks through.
  useEffect(() => {
    if (data?.isFailed) refresh();
  }, [data?.isFailed, refresh]);

  if (!orderId) {
    return (
      <Shell tone="failure" title={t("missingOrder")}>
        <CartLink label={t("toCart")} />
      </Shell>
    );
  }

  if (isPending) {
    return <Shell tone="pending" title={t("checking")} />;
  }

  if (isError || !data) {
    return (
      <Shell tone="pending" title={t("unknownTitle")} text={t("unknownText")}>
        <CatalogLink label={t("toCatalog")} />
      </Shell>
    );
  }

  if (data.isPaid) {
    return (
      <Shell tone="success" title={t("paidTitle")} text={t("paidText")}>
        <OrderRef id={data.orderId} label={t("orderRef")} />
        <CatalogLink label={t("toCatalog")} />
      </Shell>
    );
  }

  if (data.isAwaitingPayment) {
    const exhausted = Date.now() - startedAt.current > POLL_CEILING_MS;
    return (
      <Shell
        tone="pending"
        title={exhausted ? t("stillPendingTitle") : t("checking")}
        text={exhausted ? t("stillPendingText") : undefined}
      >
        <OrderRef id={data.orderId} label={t("orderRef")} />
        {exhausted ? <CatalogLink label={t("toCatalog")} /> : null}
      </Shell>
    );
  }

  // Everything left is a failure. `canRetryPayment` is always false: the
  // rollback released the stock, so the way forward is a fresh order from the
  // restored basket, never a second attempt at this orderId.
  return (
    <Shell tone="failure" title={t("failedTitle")} text={t("failedText")}>
      <OrderRef id={data.orderId} label={t("orderRef")} />
      <CartLink label={t("toCart")} />
    </Shell>
  );
}

/* ── presentation ────────────────────────────────────────────────────────── */

const TONE_ICON = {
  success: CheckCircle2,
  failure: XCircle,
  pending: Loader2,
} as const;

const TONE_CLASS = {
  success: "text-emerald-600",
  failure: "text-red-600",
  pending: "text-slate-400 animate-spin",
} as const;

function Shell({
  tone,
  title,
  text,
  children,
}: {
  tone: keyof typeof TONE_ICON;
  title: string;
  text?: string;
  children?: React.ReactNode;
}) {
  const Icon = TONE_ICON[tone];

  return (
    <section className="py-14 lg:py-20">
      <Container>
        <div className="mx-auto flex max-w-lg flex-col items-center gap-4 rounded-2xl border border-slate-200 bg-white p-8 text-center sm:p-10">
          <Icon className={`size-12 ${TONE_CLASS[tone]}`} />
          <h1 className="text-2xl font-extrabold text-slate-900">{title}</h1>
          {text ? <p className="text-sm leading-relaxed text-slate-500">{text}</p> : null}
          {children}
        </div>
      </Container>
    </section>
  );
}

function OrderRef({ id, label }: { id: string; label: string }) {
  return (
    <p className="text-xs text-slate-500">
      {label}{" "}
      <span className="font-mono font-bold text-slate-900">
        {id.slice(0, 8).toUpperCase()}
      </span>
    </p>
  );
}

function CartLink({ label }: { label: string }) {
  return (
    <Link
      href="/cart"
      className="mt-2 inline-flex h-12 items-center justify-center rounded-full bg-brand px-7 text-sm font-bold text-white transition-opacity hover:opacity-90"
    >
      {label}
    </Link>
  );
}

function CatalogLink({ label }: { label: string }) {
  return (
    <Link
      href="/products"
      className="mt-2 inline-flex h-12 items-center justify-center rounded-full border border-slate-200 px-7 text-sm font-bold text-slate-900 transition-colors hover:bg-slate-50"
    >
      {label}
    </Link>
  );
}
