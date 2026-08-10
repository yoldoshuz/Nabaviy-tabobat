"use client";

import { useTranslations } from "next-intl";

import { CartButton } from "@/components/layout/cart-button";
import { ConsultationButton } from "@/components/layout/consultation-button";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { BrandSwitcher } from "@/components/layout/brand-switcher";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Container } from "@/components/shared/container";
import { navigation } from "@/lib/constants";
import { Link, usePathname } from "@/lib/i18n/navigation";
import { cn } from "@/lib/utils";

export function Header() {
  const t = useTranslations("nav");
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-80 bg-brand">
      <Container className="flex h-16 items-center gap-3 sm:h-[88px] lg:gap-6">
        <BrandSwitcher className="mr-auto lg:mr-0" />

        <nav
          aria-label={t("home")}
          className="mx-auto hidden items-center gap-8 lg:flex xl:gap-12"
        >
          {navigation.map((item) => {
            const isActive =
              item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.key}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "relative text-sm text-cream/85 transition-colors hover:text-gold focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold",
                  isActive && "text-gold",
                )}
              >
                {t(item.key)}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <CartButton />
          <LanguageSwitcher />
          <ConsultationButton className="hidden sm:inline-flex" />
          <MobileNav />
        </div>
      </Container>
    </header>
  );
}
