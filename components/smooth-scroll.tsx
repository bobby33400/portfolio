"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Momentum smooth-scrolling (eased wheel) via Lenis.
 * - Keeps native scroll position, so scroll-linked UI keeps working.
 * - Smooths the mouse wheel on desktop; leaves native touch scroll on mobile.
 * - Intercepts in-page anchor links so they ease to the target.
 * - Disabled entirely when the user prefers reduced motion.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({ duration: 1.1, smoothWheel: true });

    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const onClick = (e: MouseEvent) => {
      const anchor = (e.target as Element | null)?.closest<HTMLAnchorElement>(
        'a[href^="#"]',
      );
      const href = anchor?.getAttribute("href");
      if (!href || href === "#") return;
      if (document.querySelector(href)) {
        e.preventDefault();
        // -80px keeps the target clear of the fixed nav.
        lenis.scrollTo(href, { offset: -80 });
      }
    };
    document.addEventListener("click", onClick);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("click", onClick);
      lenis.destroy();
    };
  }, []);

  return null;
}
