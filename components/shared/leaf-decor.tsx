import Image from "next/image";

import { cn } from "@/lib/utils";

const sources = {
  tall: { src: "/leaf-gold-small.png", width: 271, height: 494 },
  wide: { src: "/leaf-gold-large.png", width: 173, height: 170 },
  /** Edge-cropped leaves used at the bottom of every page (Figma footer). */
  footerLeft: { src: "/footer-leaf.png", width: 281, height: 410 },
  footerRight: { src: "/footer-leaf-1.png", width: 271, height: 494 },
} as const;

/** Decorative gold leaf used on the dark sections (Figma CTA banner). */
export function LeafDecor({
  className,
  variant = "tall",
  flip = false,
}: {
  className?: string;
  variant?: keyof typeof sources;
  flip?: boolean;
}) {
  const { src, width, height } = sources[variant];

  return (
    <Image
      src={src}
      alt=""
      aria-hidden
      width={width}
      height={height}
      className={cn(
        "pointer-events-none absolute select-none",
        flip && "scale-x-[-1]",
        className,
      )}
    />
  );
}
