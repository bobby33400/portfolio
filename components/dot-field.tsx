"use client";

import { useEffect, useRef } from "react";

type Dot = { ox: number; oy: number; a: number };

type Cluster = {
  bx: number; // base center x
  by: number; // base center y
  ampX: number;
  ampY: number;
  fx: number; // orbit frequency x
  fy: number; // orbit frequency y
  px: number; // orbit phase x
  py: number; // orbit phase y
  depth: number; // 0.35 (far) .. 1 (near)
  pulseAmp: number;
  pulseF: number;
  pulseP: number;
  opF: number;
  opP: number;
  baseOp: number;
  amber: boolean;
  dotR: number;
  dots: Dot[];
};

const RGB = (s: string): [number, number, number] | null => {
  const p = s.trim().split(/\s+/).map(Number);
  return p.length === 3 && p.every((n) => !Number.isNaN(n))
    ? [p[0], p[1], p[2]]
    : null;
};

/**
 * Animated abstract dot field of soft clusters.
 * Each cluster is a disc of regularly-spaced dots that drifts (orbit),
 * breathes (scale pulse) and shifts opacity together. Depth gives parallax:
 * nearer clusters are larger, brighter and faster. Amber + some gray dots.
 *
 * - Randomized on every load (never the same).
 * - 60fps, capped density, pauses off-screen / when tab hidden.
 * - Reduced motion → a single static frame. Lighter on mobile.
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
    let mobile = false;
    let clusters: Cluster[] = [];
    let amber: [number, number, number] = [217, 119, 6];
    let gray: [number, number, number] = [107, 114, 128];
    let raf = 0;
    let running = false;
    let visible = true;
    let t = 0;

    const readColors = () => {
      const cs = getComputedStyle(document.documentElement);
      amber = RGB(cs.getPropertyValue("--dot-rgb")) ?? amber;
      gray = RGB(cs.getPropertyValue("--dot-rgb-2")) ?? gray;
    };

    const makeCluster = (): Cluster => {
      const depth = 0.35 + Math.random() * 0.65;
      const spacing = mobile ? 26 : 22;
      const R = (mobile ? 45 : 55) + depth * (mobile ? 35 : 55);
      const jitter = 2;
      const dots: Dot[] = [];
      for (let y = -R; y <= R; y += spacing) {
        for (let x = -R; x <= R; x += spacing) {
          const dist = Math.hypot(x, y);
          if (dist > R) continue;
          const falloff = Math.pow(1 - dist / R, 1.5);
          if (falloff < 0.05) continue;
          dots.push({
            ox: x + (Math.random() - 0.5) * jitter,
            oy: y + (Math.random() - 0.5) * jitter,
            a: falloff,
          });
        }
      }
      return {
        bx: Math.random() * width,
        by: Math.random() * height,
        ampX: (18 + Math.random() * 34) * depth,
        ampY: (14 + Math.random() * 26) * depth,
        fx: (0.04 + Math.random() * 0.05) * depth,
        fy: (0.04 + Math.random() * 0.05) * depth,
        px: Math.random() * Math.PI * 2,
        py: Math.random() * Math.PI * 2,
        depth,
        pulseAmp: 0.05 + Math.random() * 0.06,
        pulseF: 0.3 + Math.random() * 0.4,
        pulseP: Math.random() * Math.PI * 2,
        opF: 0.2 + Math.random() * 0.3,
        opP: Math.random() * Math.PI * 2,
        baseOp: (mobile ? 0.16 : 0.2) + depth * 0.3,
        amber: Math.random() < 0.62,
        dotR: 1.1 + depth * 0.9,
        dots,
      };
    };

    const seed = () => {
      mobile = width < 768;
      const max = mobile ? 4 : 8;
      const min = mobile ? 3 : 5;
      const count = Math.max(
        min,
        Math.min(max, Math.round((width * height) / 180000)),
      );
      clusters = Array.from({ length: count }, makeCluster);
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      if (!width || !height) return;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      const TAU = Math.PI * 2;
      for (const c of clusters) {
        const cx = c.bx + Math.sin(t * c.fx + c.px) * c.ampX;
        const cy = c.by + Math.sin(t * c.fy + c.py) * c.ampY;
        const scale = 1 + Math.sin(t * c.pulseF + c.pulseP) * c.pulseAmp;
        const op = c.baseOp * (0.72 + 0.28 * Math.sin(t * c.opF + c.opP));
        const col = c.amber ? amber : gray;
        const prefix = `rgba(${col[0]}, ${col[1]}, ${col[2]}, `;
        for (const d of c.dots) {
          const x = cx + d.ox * scale;
          const y = cy + d.oy * scale;
          if (x < -10 || x > width + 10 || y < -10 || y > height + 10) continue;
          ctx.beginPath();
          ctx.arc(x, y, c.dotR, 0, TAU);
          ctx.fillStyle = prefix + (d.a * op).toFixed(3) + ")";
          ctx.fill();
        }
      }
    };

    const tick = () => {
      t += 0.016;
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

    readColors();
    resize();
    draw(); // first paint (only paint under reduced motion)
    if (!reduced) start();

    const onResize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      resize();
      draw();
    };
    window.addEventListener("resize", onResize);

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

    const themeObserver = new MutationObserver(() => {
      readColors();
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
