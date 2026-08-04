import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  title: ReactNode;
  subtitle?: ReactNode;
  align?: "center" | "start";
  tone?: "dark" | "light";
  className?: string;
  as?: "h1" | "h2" | "h3";
  id?: string;
}

export function SectionHeading({
  title,
  subtitle,
  align = "center",
  tone = "dark",
  className,
  as: Tag = "h2",
  id,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-5",
        align === "center" ? "items-center text-center" : "items-start text-left",
        className,
      )}
    >
      <Tag
        id={id}
        className={cn(
          "text-balance pb-1 text-3xl leading-[1.35] sm:text-4xl",
          tone === "light" ? "text-cream" : "text-brand",
        )}
      >
        {title}
      </Tag>
      {subtitle ? (
        <p
          className={cn(
            "max-w-3xl text-balance text-sm leading-relaxed sm:text-base",
            tone === "light" ? "text-cream/75" : "text-muted-foreground",
          )}
        >
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}
