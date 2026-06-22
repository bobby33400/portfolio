"use client";

import { useEffect, useRef } from "react";

const RGB = (s: string): [number, number, number] | null => {
  const p = s.trim().split(/\s+/).map(Number);
  return p.length === 3 && p.every((n) => !Number.isNaN(n))
    ? [p[0], p[1], p[2]]
    : null;
};

/**
 * Dotted field with organic, random motion. A dense grid of dots samples an
 * animated low-res value-noise field (a coarse grid of control points that each
 * oscillate independently) plus a slow drift — so soft amber/gray patches fade
 * in and out and wander randomly, with no repeating wave pattern. Bright patches
 * make dots larger; the whole field stays filled at a faint baseline.
 *
 * - Randomized every load. Cheap per-dot sampling (no sqrt/sin per dot) → 60fps.
 * - Pauses off-screen / when hidden. Reduced motion → one static frame.
 * - Theme-aware colour + light-mode alpha boost. Lighter grid on mobile.
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
    const MINA = 0.07;
    const MAXA = 0.72;
    const MINR = 1; // clean, well-defined dots (no sub-pixel fuzz)
    const MAXR = 2.3;
    const TAU = Math.PI * 2;
    const CELL = 120; // value-noise control-grid cell size (px)

    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let mobile = false;
    let spacing = 9;

    let xs = new Float32Array(0);
    let ys = new Float32Array(0);
    let rnd = new Float32Array(0); // per-dot random value, fixed per load
    let N = 0;

    let amber: [number, number, number] = [217, 119, 6];
    let gray: [number, number, number] = [107, 114, 128];
    let alphaScale = 1;
    let amberRatio = 0.16; // fraction of dots that are orange (theme-aware)
    const grayFill: string[] = [];
    const amberFill: string[] = [];
    const bucketR: number[] = [];
    const grayB: number[][] = Array.from({ length: BUCKETS }, () => []);
    const amberB: number[][] = Array.from({ length: BUCKETS }, () => []);

    // value-noise control grid (covers canvas + 2-cell margin for the drift)
    let GW = 0;
    let GH = 0;
    let cbase = new Float32Array(0);
    let cs1 = new Float32Array(0);
    let cp1 = new Float32Array(0);
    let cs2 = new Float32Array(0);
    let cp2 = new Float32Array(0);
    let cval = new Float32Array(0);
    let panAx = 0;
    let panAy = 0;
    let panFx = 0;
    let panFy = 0;
    let panPx = 0;
    let panPy = 0;
    const ORIGIN = -2 * CELL;

    let raf = 0;
    let running = false;
    let visible = true;
    let t = 0;

    const buildFills = () => {
      for (let b = 0; b < BUCKETS; b++) {
        const f = (b + 0.5) / BUCKETS;
        let a = (MINA + f * (MAXA - MINA)) * alphaScale;
        if (a > 1) a = 1;
        grayFill[b] = `rgba(${gray[0]}, ${gray[1]}, ${gray[2]}, ${a.toFixed(3)})`;
        amberFill[b] = `rgba(${amber[0]}, ${amber[1]}, ${amber[2]}, ${a.toFixed(3)})`;
        bucketR[b] = MINR + f * (MAXR - MINR);
      }
    };

    const readColors = () => {
      const cs = getComputedStyle(document.documentElement);
      amber = RGB(cs.getPropertyValue("--dot-rgb")) ?? amber;
      gray = RGB(cs.getPropertyValue("--dot-rgb-2")) ?? gray;
      const sc = parseFloat(cs.getPropertyValue("--dot-alpha"));
      alphaScale = !Number.isNaN(sc) && sc > 0 ? sc : 1;
      const ar = parseFloat(cs.getPropertyValue("--dot-amber-ratio"));
      if (!Number.isNaN(ar) && ar >= 0) amberRatio = ar;
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
      rnd = new Float32Array(N);
      let i = 0;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          xs[i] = c * spacing;
          ys[i] = r * spacing;
          rnd[i] = Math.random();
          i++;
        }
      }
    };

    const seedNoise = () => {
      GW = Math.ceil(width / CELL) + 4;
      GH = Math.ceil(height / CELL) + 4;
      const n = GW * GH;
      cbase = new Float32Array(n);
      cs1 = new Float32Array(n);
      cp1 = new Float32Array(n);
      cs2 = new Float32Array(n);
      cp2 = new Float32Array(n);
      cval = new Float32Array(n);
      for (let i = 0; i < n; i++) {
        cbase[i] = -0.25 + Math.random() * 0.9; // some cells naturally brighter
        cs1[i] = 0.22 + Math.random() * 0.5; // independent oscillation speeds
        cp1[i] = Math.random() * TAU;
        cs2[i] = 0.14 + Math.random() * 0.38;
        cp2[i] = Math.random() * TAU;
      }
      panAx = 40 + Math.random() * 50;
      panAy = 40 + Math.random() * 50;
      panFx = 0.05 + Math.random() * 0.08;
      panFy = 0.05 + Math.random() * 0.08;
      panPx = Math.random() * TAU;
      panPy = Math.random() * TAU;
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
      seedNoise();
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // evolve the control grid (organic, independent motion)
      const cells = GW * GH;
      for (let i = 0; i < cells; i++) {
        cval[i] =
          cbase[i] +
          0.5 * Math.sin(t * cs1[i] + cp1[i]) +
          0.32 * Math.sin(t * cs2[i] + cp2[i]);
      }
      const panX = Math.sin(t * panFx + panPx) * panAx;
      const panY = Math.sin(t * panFy + panPy) * panAy;

      for (let b = 0; b < BUCKETS; b++) {
        grayB[b].length = 0;
        amberB[b].length = 0;
      }

      for (let i = 0; i < N; i++) {
        const fx = (xs[i] + panX - ORIGIN) / CELL;
        const fy = (ys[i] + panY - ORIGIN) / CELL;
        let gx = fx | 0;
        let gy = fy | 0;
        if (gx < 0) gx = 0;
        else if (gx > GW - 2) gx = GW - 2;
        if (gy < 0) gy = 0;
        else if (gy > GH - 2) gy = GH - 2;
        let tx = fx - gx;
        if (tx < 0) tx = 0;
        else if (tx > 1) tx = 1;
        let ty = fy - gy;
        if (ty < 0) ty = 0;
        else if (ty > 1) ty = 1;
        const sx = tx * tx * (3 - 2 * tx);
        const sy = ty * ty * (3 - 2 * ty);
        const i00 = gy * GW + gx;
        const i10 = i00 + 1;
        const i01 = i00 + GW;
        const i11 = i01 + 1;
        const a = cval[i00] + (cval[i10] - cval[i00]) * sx;
        const bb = cval[i01] + (cval[i11] - cval[i01]) * sx;
        let v = a + (bb - a) * sy;
        if (v < 0) v = 0;
        else if (v > 1) v = 1;
        v = v * v * (3 - 2 * v);
        let bk = (v * BUCKETS) | 0;
        if (bk >= BUCKETS) bk = BUCKETS - 1;
        (rnd[i] < amberRatio ? amberB : grayB)[bk].push(i);
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
