"use client";

import { useCart, useMounted } from "@/hooks";
import { ShoppingCart } from "lucide-react";
import { useTranslations } from "next-intl";

import { Link } from "@/lib/i18n/navigation";
import { cn } from "@/lib/utils";

export function CartButton({ className }: { className?: string }) {
  const t = useTranslations("nav");
  const { count } = useCart();
  const mounted = useMounted();

  return (
    <Link
      href="/cart"
      aria-label={t("cart")}
      className={cn(
        "relative flex size-10 items-center justify-center rounded-lg text-cream transition-colors hover:bg-brand-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold",
        className,
      )}
    >
      <ShoppingCart className="size-5" aria-hidden />
      {mounted && count > 0 ? (
        <span className="absolute -top-0.5 right-0 flex min-w-5 items-center justify-center rounded-full bg-destructive px-1 text-[11px] leading-5 font-medium text-white">
          {count}
        </span>
      ) : null}
    </Link>
  );
}
