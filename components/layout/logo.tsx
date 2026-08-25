import Image from "next/image";
import { useTranslations } from "next-intl";

import { Link } from "@/lib/i18n/navigation";
import { cn } from "@/lib/utils";

/**
 * The wordmark on its own, with no link around it.
 *
 * The brand switcher wraps the logo in a `<button>`, and an anchor inside a
 * button is invalid markup — the browser hands the click to the anchor, so the
 * logo navigated home instead of opening the group menu that is the whole point
 * of the control. Anything supplying its own interactive element takes this;
 * everything else takes `<Logo>` below.
 */
export function LogoMark({ className }: { className?: string }) {
  const t = useTranslations("common");

  return (
    <Image
      src="/logo.png"
      alt={t("brand")}
      width={240}
      height={68}
      priority
      sizes="240px"
      className={cn("h-7 w-auto sm:h-8", className)}
    />
  );
}

export function Logo({ className }: { className?: string }) {
  const t = useTranslations("common");

  return (
    <Link
      href="/"
      aria-label={t("brand")}
      className={cn(
        "inline-flex shrink-0 items-center transition-opacity hover:opacity-85 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold",
        className,
      )}
    >
      <LogoMark />
    </Link>
  );
}
