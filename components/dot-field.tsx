"use client";

import { useEffect, useRef } from "react";

const RGB = (s: string): [number, number, number] | null => {
  const p = s.trim().split(/\s+/).map(Number);
  return p.length === 3 && p.every((n) => !Number.isNaN(n))
    ? [p[0], p[1], p[2]]
    : null;
};

type Wave = {
  bx: number;
  by: number;
  ax: number;
  ay: number;
  fx: number;
  fy: number;
  px: number;
  py: number;
  k: number; // spatial frequency (2π / wavelength)
  w: number; // temporal speed
  ph: number; // phase
  amp: number;
};

/**
 * Dotted wave field: a dense grid of dots covering the whole hero, modulated by
 * several circular waves radiating from slowly-moving sources. Where wave crests
 * overlap (constructive interference) the dots grow brighter and larger; where
 * they cancel, they shrink — producing organic, water-like motion (not a flat
 * linear wave). Amber + gray dots, theme-aware.
 *
 * - Randomized every load. Bucketed rendering → 60fps.
 * - Pauses off-screen / when hidden. Reduced motion → one static frame.
 * - Lighter grid + fewer wave sources on mobile.
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

    const BUCKETS = 14;
    const MINA = 0.07; // faint baseline grid (whole section stays filled)
    const MAXA = 0.72;
    const MINR = 0.5;
    const MAXR = 1.7;
    const TAU = Math.PI * 2;

    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let mobile = false;
    let spacing = 14;

    let xs = new Float32Array(0);
    let ys = new Float32Array(0);
    let amberFlag = new Uint8Array(0);
    let N = 0;

    let amber: [number, number, number] = [217, 119, 6];
    let gray: [number, number, number] = [107, 114, 128];
    const grayFill: string[] = [];
    const amberFill: string[] = [];
    const bucketR: number[] = [];
    const grayB: number[][] = Array.from({ length: BUCKETS }, () => []);
    const amberB: number[][] = Array.from({ length: BUCKETS }, () => []);

    let waves: Wave[] = [];
    let sx: number[] = [];
    let sy: number[] = [];

    let raf = 0;
    let running = false;
    let visible = true;
    let t = 0;

    const buildFills = () => {
      for (let b = 0; b < BUCKETS; b++) {
        const f = (b + 0.5) / BUCKETS;
        const a = (MINA + f * (MAXA - MINA)).toFixed(3);
        grayFill[b] = `rgba(${gray[0]}, ${gray[1]}, ${gray[2]}, ${a})`;
        amberFill[b] = `rgba(${amber[0]}, ${amber[1]}, ${amber[2]}, ${a})`;
        bucketR[b] = MINR + f * (MAXR - MINR);
      }
    };

    const readColors = () => {
      const cs = getComputedStyle(document.documentElement);
      amber = RGB(cs.getPropertyValue("--dot-rgb")) ?? amber;
      gray = RGB(cs.getPropertyValue("--dot-rgb-2")) ?? gray;
      buildFills();
    };

    const seedDots = () => {
      mobile = width < 768;
      spacing = mobile ? 12 : 9;
      const cols = Math.ceil(width / spacing) + 1;
      const rows = Math.ceil(height / spacing) + 1;
      N = cols * rows;
      xs = new Float32Array(N);
      ys = new Float32Array(N);
      amberFlag = new Uint8Array(N);
      let i = 0;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          xs[i] = c * spacing;
          ys[i] = r * spacing;
          amberFlag[i] = Math.random() < 0.16 ? 1 : 0;
          i++;
        }
      }
    };

    const seedWaves = () => {
      const n = mobile ? 2 : 3;
      waves = Array.from({ length: n }, () => {
        const wavelength = 260 + Math.random() * 280; // bigger, broader waves
        return {
          bx: (Math.random() * 1.4 - 0.2) * width,
          by: (Math.random() * 1.4 - 0.2) * height,
          ax: 25 + Math.random() * 45,
          ay: 25 + Math.random() * 45,
          fx: 0.08 + Math.random() * 0.16,
          fy: 0.08 + Math.random() * 0.16,
          px: Math.random() * TAU,
          py: Math.random() * TAU,
          k: TAU / wavelength,
          w: 0.45 + Math.random() * 0.6, // slower, gentler swells
          ph: Math.random() * TAU,
          amp: 1 / n,
        };
      });
      sx = new Array(n);
      sy = new Array(n);
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      if (!width || !height) return;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seedDots();
      seedWaves();
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      const n = waves.length;
      for (let s = 0; s < n; s++) {
        const wv = waves[s];
        sx[s] = wv.bx + Math.sin(t * wv.fx + wv.px) * wv.ax;
        sy[s] = wv.by + Math.sin(t * wv.fy + wv.py) * wv.ay;
      }

      for (let b = 0; b < BUCKETS; b++) {
        grayB[b].length = 0;
        amberB[b].length = 0;
      }

      for (let i = 0; i < N; i++) {
        const x = xs[i];
        const y = ys[i];
        let acc = 0;
        for (let s = 0; s < n; s++) {
          const dx = x - sx[s];
          const dy = y - sy[s];
          const d = Math.sqrt(dx * dx + dy * dy);
          const wv = waves[s];
          acc += wv.amp * Math.sin(d * wv.k - t * wv.w + wv.ph);
        }
        // acc in ~[-1,1]; constructive crests -> ~1 -> big/bright dots
        let v = 0.5 + 0.5 * acc;
        if (v < 0) v = 0;
        else if (v > 1) v = 1;
        v = v * v * (1.7 - 0.7 * v); // emphasize crests, keep baseline alive
        let b = (v * BUCKETS) | 0;
        if (b >= BUCKETS) b = BUCKETS - 1;
        (amberFlag[i] ? amberB : grayB)[b].push(i);
      }

      for (let b = 0; b < BUCKETS; b++) {
        const r = bucketR[b];
        const gb = grayB[b];
        if (gb.length) {
          ctx.fillStyle = grayFill[b];
          ctx.beginPath();
          for (let j = 0; j < gb.length; j++) {
            const i = gb[j];
            ctx.moveTo(xs[i] + r, ys[i]);
            ctx.arc(xs[i], ys[i], r, 0, TAU);
          }
          ctx.fill();
        }
        const ab = amberB[b];
        if (ab.length) {
          ctx.fillStyle = amberFill[b];
          ctx.beginPath();
          for (let j = 0; j < ab.length; j++) {
            const i = ab[j];
            ctx.moveTo(xs[i] + r, ys[i]);
            ctx.arc(xs[i], ys[i], r, 0, TAU);
          }
          ctx.fill();
        }
      }
    };

    const tick = () => {
      t += 0.014; // gentle, broad motion
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
    draw();
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
