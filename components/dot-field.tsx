"use client";

import { useEffect, useRef } from "react";

const RGB = (s: string): [number, number, number] | null => {
  const p = s.trim().split(/\s+/).map(Number);
  return p.length === 3 && p.every((n) => !Number.isNaN(n))
    ? [p[0], p[1], p[2]]
    : null;
};

type Blob = {
  bx: number;
  by: number;
  ax: number;
  ay: number;
  fx: number;
  fy: number;
  px: number;
  py: number;
  r: number;
  rp: number;
  rf: number;
};

/**
 * Halftone dot field: a uniform grid of dots whose brightness is driven by an
 * animated metaball field + a traveling wave. Soft amber/gray dot-clouds drift,
 * pulse and ripple across the grid — abstract shapes that move and breathe.
 *
 * - Randomized every load (blob layout + amber placement).
 * - Bucketed rendering (one fill per brightness band) → 60fps.
 * - Pauses off-screen / when hidden. Reduced motion → one static frame.
 * - Lighter grid + fewer blobs on mobile.
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

    const BUCKETS = 12;
    const MINA = 0.05; // faint baseline grid
    const MAXA = 0.62;
    const MINR = 0.8;
    const MAXR = 2.4;
    const GAIN = 0.55;
    const TAU = Math.PI * 2;

    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let mobile = false;
    let spacing = 16;

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

    let blobs: Blob[] = [];
    let bx: number[] = [];
    let by: number[] = [];
    let br2: number[] = [];

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
      spacing = mobile ? 20 : 18;
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
          amberFlag[i] = Math.random() < 0.18 ? 1 : 0;
          i++;
        }
      }
    };

    const seedBlobs = () => {
      const B = mobile ? 3 : 4;
      blobs = Array.from({ length: B }, () => ({
        bx: Math.random() * width,
        by: Math.random() * height,
        ax: (0.1 + Math.random() * 0.18) * width,
        ay: (0.1 + Math.random() * 0.18) * height,
        fx: 0.12 + Math.random() * 0.22,
        fy: 0.12 + Math.random() * 0.22,
        px: Math.random() * TAU,
        py: Math.random() * TAU,
        r: (mobile ? 90 : 120) + Math.random() * (mobile ? 60 : 110),
        rp: 0.18 + Math.random() * 0.16,
        rf: 0.3 + Math.random() * 0.4,
      }));
      bx = new Array(B);
      by = new Array(B);
      br2 = new Array(B);
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
      seedBlobs();
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      const B = blobs.length;
      for (let k = 0; k < B; k++) {
        const bl = blobs[k];
        bx[k] = bl.bx + Math.sin(t * bl.fx + bl.px) * bl.ax;
        by[k] = bl.by + Math.sin(t * bl.fy + bl.py) * bl.ay;
        const rr = bl.r * (1 + Math.sin(t * bl.rf + bl.px) * bl.rp);
        br2[k] = rr * rr;
      }

      for (let b = 0; b < BUCKETS; b++) {
        grayB[b].length = 0;
        amberB[b].length = 0;
      }

      for (let i = 0; i < N; i++) {
        const x = xs[i];
        const y = ys[i];
        let raw = 0;
        for (let k = 0; k < B; k++) {
          const dx = x - bx[k];
          const dy = y - by[k];
          raw += br2[k] / (dx * dx + dy * dy + br2[k]);
        }
        let v = raw * GAIN;
        if (v > 1) v = 1;
        const wave = 0.5 + 0.5 * Math.sin(x * 0.018 + y * 0.012 - t * 1.1);
        v *= 0.5 + 0.5 * wave;
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
