import Image from "next/image";

import { cn } from "@/lib/utils";

const sources = {
  1: { src: "/green-leaf-1.png", width: 160, height: 234 },
  2: { src: "/green-leaf-2.png", width: 206, height: 286 },
  3: { src: "/green-leaf-3.png", width: 205, height: 191 },
  4: { src: "/green-leaf-4.png", width: 339, height: 537 },
} as const;

/** Soft green leaf photo used along the edges of the product detail page. */
export function GreenLeaf({
  variant = 1,
  className,
  flip = false,
}: {
  variant?: keyof typeof sources;
  className?: string;
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
