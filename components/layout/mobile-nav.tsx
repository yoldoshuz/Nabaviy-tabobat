"use client";

import { Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { ConsultationButton } from "@/components/layout/consultation-button";
import { Logo } from "@/components/layout/logo";
import { navigation } from "@/lib/constants";
import { Link, usePathname } from "@/lib/i18n/navigation";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const t = useTranslations("nav");
  const tCommon = useTranslations("common");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={tCommon("openMenu")}
        className="flex size-10 items-center justify-center rounded-lg text-cream transition-colors hover:bg-brand-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold lg:hidden"
      >
        <Menu className="size-6" aria-hidden />
      </button>

      {open ? (
        <div className="fixed inset-0 z-90 flex flex-col bg-brand lg:hidden">
          <div className="flex items-center justify-between px-4 py-4">
            <Logo />
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label={tCommon("close")}
              className="flex size-10 items-center justify-center rounded-lg text-cream transition-colors hover:bg-brand-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            >
              <X className="size-6" aria-hidden />
            </button>
          </div>

          <nav className="flex flex-1 flex-col gap-1 px-4 pt-6">
            {navigation.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "rounded-lg px-4 py-4 text-lg text-cream/85 transition-colors hover:bg-brand-soft hover:text-cream",
                    isActive && "bg-brand-soft text-gold",
                  )}
                >
                  {t(item.key)}
                </Link>
              );
            })}
          </nav>

          <div className="px-4 pb-10">
            <ConsultationButton
              className="h-12 w-full"
              onOpen={() => setOpen(false)}
            />
          </div>
        </div>
      ) : null}
    </>
  );
}
