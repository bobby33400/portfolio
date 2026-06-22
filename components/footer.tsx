"use client";

import { useI18n } from "@/components/i18n-provider";
import { profile } from "@/lib/content";

export function Footer() {
  const { dict } = useI18n();
  const year = new Date().getFullYear();

  const [first, ...rest] = profile.name.split(" ");
  const last = rest.join(" ");

  return (
    <footer className="relative overflow-hidden border-t border-border pb-2">
      <div className="mx-auto max-w-6xl px-4 pt-16 sm:px-6">
        {/* Brand */}
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
            {profile.name}
          </p>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            {dict.hero.role} · {dict.about.location}
          </p>
        </div>

        <div className="mt-10 h-px w-full bg-border" />

        {/* Copyright row */}
        <div className="flex flex-col items-start justify-between gap-3 pt-6 text-sm text-muted-foreground sm:flex-row sm:items-center">
          <p>
            © {year} {profile.name}. {dict.footer.rights}
          </p>
          <p>{dict.footer.builtWith}</p>
        </div>
      </div>

      {/* Oversized name wordmark — SVG scales to the full width at any screen size */}
      <svg
        aria-hidden="true"
        viewBox="0 0 1000 90"
        preserveAspectRatio="xMidYMax meet"
        className="pointer-events-none mt-8 block w-full select-none"
      >
        <text
          x="500"
          y="90"
          textAnchor="middle"
          textLength={992}
          lengthAdjust="spacingAndGlyphs"
          fontSize={96}
          className="font-display font-bold"
        >
          <tspan style={{ fill: "var(--foreground)", fillOpacity: 0.07 }}>
            {`${first.toUpperCase()} `}
          </tspan>
          <tspan style={{ fill: "var(--primary)", fillOpacity: 0.8 }}>
            {last.toUpperCase()}
          </tspan>
        </text>
      </svg>
    </footer>
  );
}
