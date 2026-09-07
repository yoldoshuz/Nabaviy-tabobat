import { Star } from "lucide-react";

import { cn } from "@/lib/utils";

interface StarRatingProps {
  value: number;
  max?: number;
  className?: string;
}

export function StarRating({ value, max = 5, className }: StarRatingProps) {
  return (
    <div
      className={cn("flex items-center gap-1", className)}
      role="img"
      aria-label={`${value} / ${max}`}
    >
      {Array.from({ length: max }).map((_, index) => (
        <Star
          key={index}
          aria-hidden
          className={cn(
            "size-4",
            index < value
              ? "fill-gold-strong text-gold-strong"
              : "fill-transparent text-gold-strong/30",
          )}
        />
      ))}
    </div>
  );
}
