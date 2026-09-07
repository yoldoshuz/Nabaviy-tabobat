"use client";

import { Minus, Plus } from "lucide-react";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";

interface QuantityInputProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  className?: string;
  tone?: "light" | "dark";
  /**
   * `lg` matches the height of the large add-to-cart button it sits beside on
   * the product page. At the default size the two controls stack on a phone at
   * 44px against 56px, and the stepper reads as a thin strip below a proper
   * button rather than as its equal.
   */
  size?: "md" | "lg";
}

export function QuantityInput({
  value,
  onChange,
  min = 1,
  max = 99,
  className,
  tone = "light",
  size = "md",
}: QuantityInputProps) {
  const t = useTranslations("common");
  const isLarge = size === "lg";
  const stepper = isLarge ? "size-11" : "size-9";

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-lg p-1",
        isLarge && "h-14 justify-between",
        tone === "light" ? "bg-stone/70" : "bg-brand-soft",
        className,
      )}
    >
      <button
        type="button"
        aria-label={t("decrease")}
        disabled={value <= min}
        onClick={() => onChange(Math.max(min, value - 1))}
        className={cn(
          "flex items-center justify-center rounded-lg bg-brand text-cream transition-colors hover:bg-brand-soft disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
          stepper,
        )}
      >
        <Minus className="size-4" aria-hidden />
      </button>
      <input
        type="number"
        inputMode="numeric"
        aria-label={t("quantity")}
        value={value}
        min={min}
        max={max}
        onChange={(event) => {
          const next = Number.parseInt(event.target.value, 10);
          if (Number.isNaN(next)) return;
          onChange(Math.min(max, Math.max(min, next)));
        }}
        className={cn(
          isLarge ? "w-full" : "w-12",
          "border-0 bg-transparent text-center text-base font-medium outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",
          tone === "light" ? "text-brand" : "text-cream",
        )}
      />
      <button
        type="button"
        aria-label={t("increase")}
        disabled={value >= max}
        onClick={() => onChange(Math.min(max, value + 1))}
        className={cn(
          "flex items-center justify-center rounded-lg bg-brand text-cream transition-colors hover:bg-brand-soft disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
          stepper,
        )}
      >
        <Plus className="size-4" aria-hidden />
      </button>
    </div>
  );
}
