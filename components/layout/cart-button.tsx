"use client";

import { ShoppingCart, User } from "lucide-react";
import { useTranslations } from "next-intl";

import { useAuth, useCart, useMounted } from "@/hooks";
import { Link } from "@/lib/i18n/navigation";
import { cn } from "@/lib/utils";

/**
 * One control in the header, not two.
 *
 * A visitor without an account has nothing to go to but the basket, so that is
 * what the button is. Once someone is signed in the basket stops being a
 * destination of its own — it lives inside the account alongside their orders —
 * and the button becomes the way in there. The badge follows the basket either
 * way, so the count is never hidden by being signed in.
 */
export function CartButton({ className }: { className?: string }) {
  const t = useTranslations("nav");
  const tAccount = useTranslations("account");
  const { count } = useCart();
  const { status } = useAuth();
  const mounted = useMounted();

  const signedIn = status === "authenticated";

  return (
    <Link
      href={signedIn ? "/account" : "/cart"}
      aria-label={signedIn ? tAccount("account") : t("cart")}
      className={cn(
        "relative flex h-10 w-10 items-center justify-center rounded-lg text-cream transition-colors hover:bg-brand-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold",
        className,
      )}
    >
      {signedIn ? (
        <User className="size-5" aria-hidden />
      ) : (
        <ShoppingCart className="size-5" aria-hidden />
      )}
      {mounted && count > 0 ? (
        <span className="absolute -top-0.5 right-0 flex min-w-5 items-center justify-center rounded-full bg-destructive px-1 text-[11px] leading-5 font-medium text-white">
          {count}
        </span>
      ) : null}
    </Link>
  );
}
