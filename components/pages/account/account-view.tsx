"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ChevronDown,
  Loader2,
  LogOut,
  Package,
  Pencil,
  ReceiptText,
  ShoppingBag,
  ShoppingCart,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Container } from "@/components/shared/container";
import { useAuth, useCart } from "@/hooks";
import {
  getMyOrder,
  getMyOrders,
  getProfile,
  getPurchases,
  updateProfile,
  type Purchase,
} from "@/lib/api/account";
import { formatAmount } from "@/lib/format";
import { Link } from "@/lib/i18n/navigation";
import { cn } from "@/lib/utils";
import type { Locale } from "@/types";

const PANEL =
  "rounded-lg bg-white p-5 shadow-card sm:p-7";

const STATUS_TONE: Record<string, string> = {
  new: "bg-stone text-brand",
  processing: "bg-gold-soft text-brand",
  completed: "bg-brand text-cream",
  cancelled: "bg-pink-card text-brand",
};

export function AccountView() {
  const t = useTranslations("account");
  const { status } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (status === "anonymous") router.replace("/login");
  }, [status, router]);

  if (status !== "authenticated") {
    return (
      <div className="grid min-h-[60vh] place-items-center">
        <Loader2 className="size-6 animate-spin text-gold-strong" />
        <span className="sr-only">{t("loading")}</span>
      </div>
    );
  }

  return (
    <div className="bg-stone pb-14 sm:pb-20">
      <ProfileHeader />
      <Container className="mt-6 flex flex-col gap-5 sm:mt-8 sm:gap-6">
        <CartPanel />
        <OrdersPanel />
        <PurchasesPanel />
      </Container>
    </div>
  );
}

/* ── header ──────────────────────────────────────────────────────────────── */

function ProfileHeader() {
  const t = useTranslations("account");
  const { user, setUser, signOut } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [editing, setEditing] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const { data: profile } = useQuery({
    queryKey: ["account", "profile"],
    queryFn: getProfile,
    initialData: user ?? undefined,
  });

  const save = useMutation({
    mutationFn: () =>
      updateProfile({ firstName: firstName.trim(), lastName: lastName.trim() }),
    onSuccess: (updated) => {
      setUser(updated);
      queryClient.setQueryData(["account", "profile"], updated);
      setEditing(false);
    },
  });

  const fullName = [profile?.firstName, profile?.lastName].filter(Boolean).join(" ");
  const initials = [profile?.firstName?.[0], profile?.lastName?.[0]]
    .filter(Boolean)
    .join("")
    .toUpperCase();

  const field =
    "h-12 w-full rounded-lg bg-white px-3 text-sm text-brand ring-1 ring-border outline-none focus:ring-2 focus:ring-brand-pink";

  return (
    <section className="bg-brand pt-8 pb-6 text-cream sm:pt-12">
      <Container>
        <div className="flex flex-wrap items-center gap-4">
          <span
            aria-hidden
            className="grid size-16 shrink-0 place-items-center rounded-full bg-gold text-xl font-medium text-brand sm:size-20 sm:text-2xl"
          >
            {initials || "?"}
          </span>

          <div className="min-w-0 flex-1">
            <h1 className="text-2xl leading-tight break-words text-cream sm:text-3xl">
              {fullName || t("title")}
            </h1>
            {/* The number identifies the account and cannot be edited. */}
            <p className="mt-1 font-mono text-sm text-cream/60">{profile?.phone}</p>
          </div>

          {/* Own line on a phone: beside the name it squeezed it to an ellipsis
              and ran the number under the buttons. */}
          <div className="flex w-full items-center gap-2 sm:w-auto">
            {!editing && (
              <button
                type="button"
                onClick={() => {
                  setFirstName(profile?.firstName ?? "");
                  setLastName(profile?.lastName ?? "");
                  setEditing(true);
                }}
                className="inline-flex h-11 items-center gap-1.5 rounded-full bg-white px-4 text-sm font-bold text-brand transition-colors hover:text-gold-strong"
              >
                <Pencil className="size-3.5" />
                {t("edit")}
              </button>
            )}
            <button
              type="button"
              onClick={async () => {
                await signOut();
                router.replace("/");
              }}
              className="inline-flex h-11 items-center gap-1.5 rounded-full px-4 text-sm font-medium text-cream/70 transition-colors hover:text-cream"
            >
              <LogOut className="size-4" />
              {t("signOut")}
            </button>
          </div>
        </div>

        {editing && (
          <form
            onSubmit={(event) => {
              event.preventDefault();
              save.mutate();
            }}
            className="mt-5 grid gap-3 rounded-lg bg-white p-4 sm:grid-cols-[1fr_1fr_auto] sm:p-5"
          >
            <input
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
              placeholder={t("firstName")}
              className={field}
            />
            <input
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
              placeholder={t("lastName")}
              className={field}
            />
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={save.isPending || firstName.trim().length < 2}
                className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-lg bg-gold px-5 text-sm font-bold text-white hover:bg-sand disabled:opacity-60 sm:flex-none"
              >
                {save.isPending && <Loader2 className="size-4 animate-spin" />}
                {t("save")}
              </button>
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="h-12 rounded-lg px-4 text-sm font-medium text-brand/60"
              >
                {t("cancel")}
              </button>
            </div>
            {save.isError && (
              <p role="alert" className="text-sm text-destructive sm:col-span-3">
                {t("errors.network")}
              </p>
            )}
          </form>
        )}
      </Container>
    </section>
  );
}

/* ── shared bits ─────────────────────────────────────────────────────────── */

function PanelHead({
  icon,
  title,
  count,
  hint,
  action,
}: {
  icon: React.ReactNode;
  title: string;
  count?: number;
  hint?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div>
        <h2 className="flex items-center gap-2 text-lg font-extrabold text-brand">
          <span className="grid size-9 place-items-center rounded-lg bg-stone text-gold-strong">
            {icon}
          </span>
          {title}
          {count !== undefined && count > 0 && (
            <span className="rounded-full bg-stone px-2 py-0.5 text-xs font-bold text-brand">
              {count}
            </span>
          )}
        </h2>
        {hint && <p className="mt-1.5 text-sm text-brand/60">{hint}</p>}
      </div>
      {action}
    </div>
  );
}

function EmptyState({
  icon,
  text,
  action,
}: {
  icon: React.ReactNode;
  text: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mt-5 flex flex-col items-center gap-2 rounded-lg bg-stone px-4 py-8 text-center">
      <span className="grid size-11 place-items-center rounded-full bg-white text-brand/40">
        {icon}
      </span>
      <p className="text-sm text-brand/60">{text}</p>
      {action}
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const t = useTranslations("account");
  return (
    <span
      className={cn(
        "rounded-full px-2.5 py-1 text-[0.6875rem] font-bold",
        STATUS_TONE[status] ?? "bg-stone text-brand/60",
      )}
    >
      {t(`status.${status}`)}
    </span>
  );
}

/** Which shop a row came from — one account covers all of them. */
function StoreTag({ store }: { store?: string }) {
  const t = useTranslations("account");
  if (!store) return null;
  return (
    <span className="rounded-full bg-stone px-2.5 py-1 text-[0.6875rem] font-medium text-brand/60">
      {t(`stores.${store}`)}
    </span>
  );
}

/* ── basket ──────────────────────────────────────────────────────────────── */

/**
 * The basket lives in the account rather than on a page of its own: once
 * someone is signed in, what they are about to buy and what they have bought
 * read better as one screen. `/cart` still works — it just stops being where
 * the header points.
 */
function CartPanel() {
  const t = useTranslations("account");
  const locale = useLocale();
  const { items, count, subtotal, ready, hasUnavailable } = useCart();

  return (
    <section className={PANEL}>
      <PanelHead
        icon={<ShoppingCart className="size-4" />}
        title={t("cart")}
        count={ready ? count : undefined}
        action={
          ready && count > 0 ? (
            <Link
              href="/checkout"
              className="inline-flex h-12 items-center rounded-lg bg-gold px-6 text-sm font-bold text-white transition-colors hover:bg-sand"
            >
              {t("checkout")}
            </Link>
          ) : undefined
        }
      />

      {!ready ? (
        <Loader2 className="mt-5 size-5 animate-spin text-gold-strong" />
      ) : count === 0 ? (
        <EmptyState
          icon={<ShoppingBag className="size-4" />}
          text={t("emptyCart")}
          action={
            <Link
              href="/products"
              className="text-sm font-bold text-gold-strong hover:underline"
            >
              {t("toCatalogue")}
            </Link>
          }
        />
      ) : (
        <>
          <ul className="mt-5 flex flex-col divide-y divide-border">
            {items.map((item) => (
              <li key={item.slug} className="flex items-center gap-3 py-3 first:pt-0">
                <span className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-stone">
                  <Image
                    src={item.product.image}
                    alt=""
                    fill
                    sizes="56px"
                    className="object-contain p-1.5"
                  />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-bold text-brand">
                    {item.product.name}
                  </span>
                  <span className="block text-xs text-brand/60">
                    {formatAmount(item.product.price, locale as Locale)} × {item.quantity}
                  </span>
                </span>
                <span className="whitespace-nowrap text-sm font-bold text-brand">
                  {formatAmount(item.product.price * item.quantity, locale as Locale)}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-4 flex items-center justify-between rounded-lg bg-stone px-4 py-3">
            <span className="text-sm font-bold text-brand">{t("total")}</span>
            <span className="text-xl font-extrabold text-brand">
              {formatAmount(subtotal, locale as Locale)}
            </span>
          </div>

          {hasUnavailable && (
            <p className="mt-3 text-sm text-destructive">{t("cartUnavailable")}</p>
          )}
        </>
      )}
    </section>
  );
}

/* ── orders ──────────────────────────────────────────────────────────────── */

function OrdersPanel() {
  const t = useTranslations("account");
  const locale = useLocale();
  const [page, setPage] = useState(1);
  const [openId, setOpenId] = useState<string | null>(null);

  const { data, isPending, isError } = useQuery({
    queryKey: ["account", "orders", page],
    queryFn: () => getMyOrders({ page, limit: 10 }),
  });

  return (
    <section className={PANEL}>
      <PanelHead
        icon={<Package className="size-4" />}
        title={t("orders")}
        count={data?.total}
      />

      {isPending ? (
        <Loader2 className="mt-5 size-5 animate-spin text-gold-strong" />
      ) : isError ? (
        <p className="mt-5 text-sm text-destructive">{t("errors.network")}</p>
      ) : !data?.orders.length ? (
        <EmptyState icon={<Package className="size-4" />} text={t("noOrders")} />
      ) : (
        <>
          <ul className="mt-5 flex flex-col gap-2.5">
            {data.orders.map((order) => {
              const open = openId === order.id;
              return (
                <li
                  key={order.id}
                  className={cn(
                    "rounded-lg transition-colors",
                    open ? "bg-stone" : "ring-1 ring-border",
                  )}
                >
                  <button
                    type="button"
                    onClick={() => setOpenId(open ? null : order.id)}
                    aria-expanded={open}
                    className="flex w-full flex-wrap items-center justify-between gap-3 p-4 text-left"
                  >
                    <span className="flex min-w-0 flex-col gap-1">
                      <span className="font-mono text-sm font-bold text-brand">
                        #{order.id.slice(0, 8)}
                      </span>
                      <span className="text-xs text-brand/60">
                        {new Date(order.createdAt).toLocaleDateString(locale)}
                      </span>
                    </span>
                    {/* Wraps: four items in a fixed row pushed the total off a
                        375px screen. */}
                    <span className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
                      <StoreTag store={order.store} />
                      <StatusPill status={order.status} />
                      <span className="text-base font-extrabold whitespace-nowrap text-brand">
                        {formatAmount(Number(order.totalAmount), locale as Locale)}
                      </span>
                      <ChevronDown
                        className={cn(
                          "size-4 shrink-0 text-brand/40 transition-transform",
                          open && "rotate-180",
                        )}
                      />
                    </span>
                  </button>
                  {open && <OrderLines id={order.id} />}
                </li>
              );
            })}
          </ul>

          {data.pages > 1 && (
            <div className="mt-5 flex items-center gap-2">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((current) => current - 1)}
                className="h-11 rounded-lg px-4 text-sm font-bold ring-1 ring-border disabled:opacity-40"
              >
                {t("prev")}
              </button>
              <span className="text-sm text-brand/60">
                {data.page} / {data.pages}
              </span>
              <button
                type="button"
                disabled={page >= data.pages}
                onClick={() => setPage((current) => current + 1)}
                className="h-11 rounded-lg px-4 text-sm font-bold ring-1 ring-border disabled:opacity-40"
              >
                {t("next")}
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}

/** The full order, fetched only when its row is opened. */
function OrderLines({ id }: { id: string }) {
  const t = useTranslations("account");
  const locale = useLocale();
  const { data, isPending, isError } = useQuery({
    queryKey: ["account", "order", id],
    queryFn: () => getMyOrder(id),
  });

  if (isPending) {
    return (
      <div className="px-4 pb-4">
        <Loader2 className="size-4 animate-spin text-gold-strong" />
      </div>
    );
  }
  if (isError) {
    return <p className="px-4 pb-4 text-sm text-destructive">{t("errors.network")}</p>;
  }

  return (
    <ul className="mx-4 mb-4 flex flex-col gap-2 border-t border-border pt-3">
      {data.items.map((item) => (
        <li key={item.productId} className="flex justify-between gap-3 text-sm">
          <span className="text-brand/60">
            {item.productName[locale as keyof typeof item.productName] ??
              item.productName.ru}
            <span className="text-brand/40"> × {item.quantity}</span>
          </span>
          <span className="font-bold whitespace-nowrap text-brand">
            {formatAmount(Number(item.subtotal), locale as Locale)}
          </span>
        </li>
      ))}
    </ul>
  );
}

/* ── purchase history ────────────────────────────────────────────────────── */

function PurchasesPanel() {
  const t = useTranslations("account");
  const locale = useLocale();
  const { data, isPending, isError } = useQuery({
    queryKey: ["account", "purchases"],
    queryFn: getPurchases,
  });

  return (
    <section className={PANEL}>
      <PanelHead
        icon={<ReceiptText className="size-4" />}
        title={t("purchases")}
        hint={t("purchasesHint")}
      />

      {isPending ? (
        <Loader2 className="mt-5 size-5 animate-spin text-gold-strong" />
      ) : isError ? (
        <p className="mt-5 text-sm text-destructive">{t("errors.network")}</p>
      ) : !data?.purchases.length ? (
        <EmptyState icon={<ReceiptText className="size-4" />} text={t("noPurchases")} />
      ) : (
        // Already newest-first from the API; re-sorting could only disagree.
        <ol className="mt-5 flex flex-col border-l border-border pl-4">
          {data.purchases.map((purchase) => (
            <PurchaseRow
              key={`${purchase.source}-${purchase.id}`}
              purchase={purchase}
              locale={locale}
            />
          ))}
        </ol>
      )}
    </section>
  );
}

function PurchaseRow({ purchase, locale }: { purchase: Purchase; locale: string }) {
  const t = useTranslations("account");
  const fromCrm = purchase.source === "crm";

  return (
    <li className="relative py-4 first:pt-0 last:pb-0">
      <span
        aria-hidden
        className={cn(
          "absolute -left-[1.3125rem] top-5 size-2.5 rounded-full ring-4 ring-white first:top-1.5",
          fromCrm ? "bg-brand-ink/25" : "bg-gold",
        )}
      />
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-sm font-bold break-words text-brand">
            {fromCrm
              ? (purchase.title ?? t("managerPurchase"))
              : `#${purchase.id.slice(0, 8)}`}
          </p>
          <p className="mt-0.5 text-xs text-brand/60">
            {new Date(purchase.date).toLocaleDateString(locale)}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5">
          {fromCrm ? (
            <span className="rounded-full px-2.5 py-1 text-[0.6875rem] font-medium text-brand/60 ring-1 ring-border">
              {t("viaManager")}
            </span>
          ) : (
            <>
              <StoreTag store={purchase.store} />
              {purchase.status && <StatusPill status={purchase.status} />}
            </>
          )}
          {/* `amount` is already in sums — nothing to divide here. */}
          <span className="text-base font-extrabold whitespace-nowrap text-brand">
            {formatAmount(purchase.amount, locale as Locale)}
          </span>
        </div>
      </div>

      {purchase.items.length > 0 && (
        <ul className="mt-2.5 flex flex-col gap-1 rounded-lg bg-stone px-3 py-2">
          {purchase.items.map((item, index) => (
            <li
              key={`${item.name}-${index}`}
              className="flex justify-between gap-3 text-[0.8125rem]"
            >
              <span className="text-brand/60">
                {item.name}
                <span className="text-brand/40"> × {item.quantity}</span>
              </span>
              <span className="whitespace-nowrap text-brand">
                {formatAmount(item.price * item.quantity, locale as Locale)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}
