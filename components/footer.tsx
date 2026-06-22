"use client";

import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/components/i18n-provider";
import { profile } from "@/lib/content";

/**
 * Oversized name wordmark that always spans the full page width.
 * We render the text once, measure its real bounding box, and set the SVG
 * viewBox to it — so `w-full` scales the actual name to the container width
 * responsively, without relying on SVG textLength (flaky with web fonts).
 */
function FooterWordmark({ first, last }: { first: string; last: string }) {
  const textRef = useRef<SVGTextElement>(null);
  const [viewBox, setViewBox] = useState("0 -74 784 96");

  useEffect(() => {
    const measure = () => {
      const node = textRef.current;
      if (!node) return;
      try {
        const b = node.getBBox();
        if (b.width > 0 && b.height > 0) {
          setViewBox(`${b.x} ${b.y} ${b.width} ${b.height}`);
        }
      } catch {
        /* getBBox can throw before layout; ignore */
      }
    };
    measure();
    // Re-measure once the display font has loaded (changes the metrics).
    if (document.fonts?.ready) {
      document.fonts.ready.then(measure).catch(() => {});
    }
  }, [first, last]);

  return (
    <svg
      aria-hidden="true"
      viewBox={viewBox}
      preserveAspectRatio="xMidYMax meet"
      className="pointer-events-none mt-8 block w-full select-none"
    >
      <text ref={textRef} x={0} y={0} fontSize={100} className="font-display font-bold">
        <tspan style={{ fill: "var(--foreground)", fillOpacity: 0.07 }}>
          {`${first.toUpperCase()} `}
        </tspan>
        <tspan style={{ fill: "var(--primary)", fillOpacity: 0.8 }}>
          {last.toUpperCase()}
        </tspan>
      </text>
    </svg>
  );
}

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

      <FooterWordmark first={first} last={last} />
    </footer>
  );
}
