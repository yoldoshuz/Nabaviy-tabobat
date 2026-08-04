"use client";

import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { useConsultation } from "@/components/layout/consultation-provider";
import { cn } from "@/lib/utils";

interface ConsultationButtonProps {
  className?: string;
  children?: ReactNode;
  /** Uses the "Консультация олиш" wording instead of the short header label. */
  long?: boolean;
  /** Extra side effect when the dialog opens (e.g. closing the mobile menu). */
  onOpen?: () => void;
}

export function ConsultationButton({
  className,
  children,
  long = false,
  onOpen,
}: ConsultationButtonProps) {
  const t = useTranslations("common");
  const { open } = useConsultation();

  return (
    <button
      type="button"
      onClick={() => {
        onOpen?.();
        open();
      }}
      className={cn(
        "inline-flex items-center justify-center rounded-lg bg-cream px-5 py-2.5 text-sm font-medium text-brand transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold",
        className,
      )}
    >
      {children ?? (long ? t("getConsultation") : t("consultation"))}
    </button>
  );
}
