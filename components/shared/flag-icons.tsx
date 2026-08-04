import type { SVGProps } from "react";

import type { Locale } from "@/types";

/**
 * Inline flags — emoji flags do not render on Windows, so the switcher uses
 * these small SVGs instead.
 */
function UzFlag(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 16" aria-hidden {...props}>
      <rect width="24" height="16" rx="2" fill="#fff" />
      <path d="M0 2a2 2 0 0 1 2-2h20a2 2 0 0 1 2 2v3H0V2Z" fill="#0099B5" />
      <path d="M0 11h24v3a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-3Z" fill="#1EB53A" />
      <path d="M0 5h24v.6H0V5Zm0 5.4h24v.6H0v-.6Z" fill="#CE1126" />
      <circle cx="4.6" cy="2.6" r="1.5" fill="#fff" />
      <circle cx="5.3" cy="2.4" r="1.4" fill="#0099B5" />
    </svg>
  );
}

function RuFlag(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 16" aria-hidden {...props}>
      <rect width="24" height="16" rx="2" fill="#fff" />
      <path d="M0 5.33h24v5.34H0V5.33Z" fill="#0039A6" />
      <path d="M0 10.67h24V14a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-3.33Z" fill="#D52B1E" />
    </svg>
  );
}

function GbFlag(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 16" aria-hidden {...props}>
      <rect width="24" height="16" rx="2" fill="#012169" />
      <path d="m0 0 24 16M24 0 0 16" stroke="#fff" strokeWidth="3" />
      <path d="m0 0 24 16M24 0 0 16" stroke="#C8102E" strokeWidth="1.6" />
      <path d="M12 0v16M0 8h24" stroke="#fff" strokeWidth="5" />
      <path d="M12 0v16M0 8h24" stroke="#C8102E" strokeWidth="3" />
    </svg>
  );
}

const flags: Record<Locale, (props: SVGProps<SVGSVGElement>) => React.ReactElement> = {
  uz: UzFlag,
  ru: RuFlag,
  en: GbFlag,
};

export function FlagIcon({
  locale,
  className,
}: {
  locale: Locale;
  className?: string;
}) {
  const Flag = flags[locale];
  return <Flag className={className} />;
}
