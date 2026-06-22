"use client";

import { useEffect, useRef } from "react";

type Dot = {
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
  a: number;
  tw: number; // twinkle phase
  ts: number; // twinkle speed
};

/**
 * Animated, randomized dot field rendered to a canvas.
 * - Positions/sizes/velocities are randomized on every load (never the same).
 * - Dots drift and gently twinkle; the loop pauses when off-screen.
 * - Reduced motion → a single static (still random) frame, no animation.
 * - Colour follows the `--dot-rgb` token, so it adapts to light/dark.
 */
export function DotField({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let dots: Dot[] = [];
    let color: [number, number, number] = [217, 119, 6];
    let raf = 0;
    let running = false;
    let visible = true;
    let t = 0;

    const readColor = () => {
      const v = getComputedStyle(document.documentElement)
        .getPropertyValue("--dot-rgb")
        .trim();
      const parts = v.split(/\s+/).map(Number);
      if (parts.length === 3 && parts.every((n) => !Number.isNaN(n))) {
        color = [parts[0], parts[1], parts[2]];
      }
    };

    const seed = () => {
      const count = Math.max(
        24,
        Math.min(120, Math.round((width * height) / 11000)),
      );
      dots = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: 0.8 + Math.random() * 1.8,
        vx: (Math.random() - 0.5) * 0.28,
        vy: (Math.random() - 0.5) * 0.28,
        a: 0.25 + Math.random() * 0.5,
        tw: Math.random() * Math.PI * 2,
        ts: 0.5 + Math.random() * 1.5,
      }));
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      if (width === 0 || height === 0) return;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      for (const d of dots) {
        const tw = 0.65 + 0.35 * Math.sin(t * d.ts + d.tw);
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${d.a * tw})`;
        ctx.fill();
      }
    };

    const tick = () => {
      t += 0.016;
      for (const d of dots) {
        d.x += d.vx;
        d.y += d.vy;
        if (d.x < -5) d.x = width + 5;
        else if (d.x > width + 5) d.x = -5;
        if (d.y < -5) d.y = height + 5;
        else if (d.y > height + 5) d.y = -5;
      }
      draw();
      raf = requestAnimationFrame(tick);
    };

    const start = () => {
      if (running || reduced) return;
      running = true;
      raf = requestAnimationFrame(tick);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    readColor();
    resize();
    draw(); // first paint (also the only paint under reduced motion)
    if (!reduced) start();

    const onResize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      resize();
      draw();
    };
    window.addEventListener("resize", onResize);

    // Pause the loop when the hero scrolls out of view.
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) start();
        else stop();
      },
      { threshold: 0 },
    );
    io.observe(canvas);

    const onVisibility = () => {
      if (document.hidden) stop();
      else if (visible) start();
    };
    document.addEventListener("visibilitychange", onVisibility);

    // Re-read colour when the theme class on <html> changes.
    const themeObserver = new MutationObserver(() => {
      readColor();
      draw();
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      stop();
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      io.disconnect();
      themeObserver.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className={className} />;
}
