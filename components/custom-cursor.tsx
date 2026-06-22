"use client";

import { useEffect, useRef } from "react";

const INTERACTIVE =
  'a, button, [role="button"], input, textarea, select, label, summary, .cursor-hover';

/**
 * Premium custom cursor: a small amber dot that tracks the pointer exactly,
 * plus a larger ring that trails it with eased motion (lerp @ 60fps).
 * Expands + glows on interactive elements, ripples on click.
 * Disabled on touch/tablet devices and when reduced motion is preferred.
 */
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const eligible = window.matchMedia(
      "(hover: hover) and (pointer: fine)",
    ).matches;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (!eligible || reduced) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    document.documentElement.classList.add("cursor-none");

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let visible = false;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
      if (!visible) {
        visible = true;
        dot.style.opacity = "1";
        ring.style.opacity = "1";
      }
    };

    const tick = () => {
      // Ease the ring toward the pointer for a smooth trailing feel.
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const onOver = (e: MouseEvent) => {
      const target = e.target as Element | null;
      if (target?.closest(INTERACTIVE)) {
        ring.classList.add("cursor-ring--hover");
        dot.classList.add("cursor-dot--hover");
      }
    };

    const onOut = (e: MouseEvent) => {
      const target = e.target as Element | null;
      const related = e.relatedTarget as Element | null;
      if (target?.closest(INTERACTIVE) && !related?.closest(INTERACTIVE)) {
        ring.classList.remove("cursor-ring--hover");
        dot.classList.remove("cursor-dot--hover");
      }
    };

    const onDown = () => {
      const ripple = document.createElement("div");
      ripple.className = "cursor-ripple";
      ripple.style.left = `${mouseX}px`;
      ripple.style.top = `${mouseY}px`;
      document.body.appendChild(ripple);
      ripple.addEventListener("animationend", () => ripple.remove());
    };

    const onLeaveWindow = () => {
      visible = false;
      dot.style.opacity = "0";
      ring.style.opacity = "0";
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver, { passive: true });
    window.addEventListener("mouseout", onOut, { passive: true });
    window.addEventListener("mousedown", onDown, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeaveWindow);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      window.removeEventListener("mouseout", onOut);
      window.removeEventListener("mousedown", onDown);
      document.documentElement.removeEventListener("mouseleave", onLeaveWindow);
      document.documentElement.classList.remove("cursor-none");
    };
  }, []);

  return (
    <>
      <div ref={ringRef} aria-hidden="true" className="cursor-ring" />
      <div ref={dotRef} aria-hidden="true" className="cursor-dot" />
    </>
  );
}
