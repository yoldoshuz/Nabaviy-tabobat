"use client";

import { ChevronDown } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useRef, useState, useTransition } from "react";

import { FlagIcon } from "@/components/shared/flag-icons";
import { localeMeta } from "@/lib/constants";
import { usePathname, useRouter } from "@/lib/i18n/navigation";
import { locales } from "@/lib/i18n/routing";
import { cn } from "@/lib/utils";
import type { Locale } from "@/types";

export function LanguageSwitcher({ className }: { className?: string }) {
  const locale = useLocale() as Locale;
  const t = useTranslations("nav");
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handlePointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  function switchTo(next: Locale) {
    setOpen(false);
    if (next === locale) return;
    startTransition(() => {
      router.replace(pathname, { locale: next });
    });
  }

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t("language")}
        disabled={isPending}
        className="flex h-10 items-center gap-2 rounded-lg bg-cream px-3 text-sm font-medium text-brand transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
      >
        <FlagIcon locale={locale} className="h-4 w-6 rounded-[3px]" />
        <span>{localeMeta[locale].label}</span>
        <ChevronDown
          aria-hidden
          className={cn("size-4 transition-transform", open && "rotate-180")}
        />
      </button>

      {open ? (
        <ul
          role="listbox"
          aria-label={t("language")}
          className="absolute top-[calc(100%+8px)] right-0 z-50 w-36 overflow-hidden rounded-lg border border-border bg-white py-1 shadow-float"
        >
          {locales.map((item) => (
            <li key={item}>
              <button
                type="button"
                role="option"
                aria-selected={item === locale}
                onClick={() => switchTo(item)}
                className={cn(
                  "flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-brand transition-colors hover:bg-stone",
                  item === locale && "bg-stone/60 font-medium",
                )}
              >
                <FlagIcon locale={item} className="h-4 w-6 rounded-[3px]" />
                {localeMeta[item].label}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
