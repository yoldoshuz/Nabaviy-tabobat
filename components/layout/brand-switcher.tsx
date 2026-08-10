"use client";

import { ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

import { Logo } from "@/components/layout/logo";
import { SIBLING_SITES } from "@/lib/constants";
import { cn } from "@/lib/utils";

/**
 * The logo doubles as an entry point to the rest of the NUMA group.
 *
 * Ported from Numa Kids, where the pattern already shipped, and re-skinned in
 * this storefront's accent — gold on the deep green header rather than pink —
 * so the group's sites behave identically without any of them looking borrowed.
 */
export function BrandSwitcher({ className }: { className?: string }) {
  const t = useTranslations();
  const [open, setOpen] = useState(false);
  const wrapper = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    function onPointerDown(event: PointerEvent) {
      if (!wrapper.current?.contains(event.target as Node)) setOpen(false);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  // A short close delay keeps the menu open while the pointer crosses the gap
  // between the trigger and the panel.
  function schedule(next: boolean) {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpen(next), next ? 0 : 150);
  }

  return (
    <div
      ref={wrapper}
      className={cn("relative", className)}
      onMouseEnter={() => schedule(true)}
      onMouseLeave={() => schedule(false)}
    >
      <div className="flex items-center gap-1">
        <Logo />
        <button
          type="button"
          aria-label={t("common.otherBrands")}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
          className="grid size-7 place-items-center rounded-full text-cream/50 transition hover:bg-brand-soft hover:text-gold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
        >
          <ChevronRight
            className={cn("size-4 transition-transform", open && "rotate-90")}
          />
        </button>
      </div>

      {open && (
        <div
          className="absolute top-full left-0 z-50 mt-3 w-72 rounded-lg border border-gold/30 bg-brand-deep p-3 shadow-xl"
          role="menu"
        >
          {SIBLING_SITES.map((site) => (
            <a
              key={site.id}
              href={site.href}
              target="_blank"
              rel="noopener noreferrer"
              role="menuitem"
              className="flex items-center gap-3 rounded-md p-2.5 transition hover:bg-brand-soft"
            >
              <span className="size-9 shrink-0 rounded-md bg-gradient-to-br from-gold/70 to-gold/20 ring-1 ring-gold/40" />
              <span className="flex-1 text-sm font-medium tracking-wide text-cream">
                {t(`brands.${site.id}`)}
              </span>
              <ChevronRight className="size-4 text-gold/80" />
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
