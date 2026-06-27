"use client";

import { useState } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValueEvent,
} from "framer-motion";

/**
 * Vertical scroll-progress rail pinned to the right edge of the viewport.
 * Replaces the old horizontal bar under the navbar: a faint track holds an
 * amber fill that grows as you scroll, a glowing knob rides the leading edge,
 * a live percentage counts up, and the "scroll" hint fades out near the top.
 * Purely decorative (aria-hidden) and never intercepts pointer events.
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  // Drive the fill height and knob position straight from the spring.
  const fillHeight = useTransform(progress, [0, 1], ["0%", "100%"]);
  // The hint sits at the top and gracefully gets out of the way once moving.
  const hintOpacity = useTransform(scrollYProgress, [0, 0.04], [1, 0]);

  const [percent, setPercent] = useState(0);
  useMotionValueEvent(progress, "change", (v) => {
    setPercent(Math.round(Math.min(1, Math.max(0, v)) * 100));
  });

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed right-5 top-1/2 z-30 hidden -translate-y-1/2 flex-col items-center gap-3 lg:flex"
    >
      {/* Live percentage */}
      <span className="tabular-nums text-[11px] font-medium tracking-wide text-muted-foreground">
        {percent.toString().padStart(2, "0")}
      </span>

      {/* Rail */}
      <div className="relative h-56 w-px rounded-full bg-border">
        {/* Growing amber fill */}
        <motion.div
          style={{ height: fillHeight }}
          className="absolute inset-x-0 top-0 origin-top rounded-full bg-gradient-to-b from-accent to-primary"
        />

        {/* Glowing knob riding the leading edge */}
        <motion.div
          style={{ top: fillHeight }}
          className="absolute left-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent shadow-[0_0_10px_2px_var(--glow)] ring-2 ring-background"
        />
      </div>

      {/* Vertical "scroll" hint that fades as the page moves */}
      <motion.span
        style={{ opacity: hintOpacity }}
        className="select-none text-[10px] font-medium uppercase tracking-[0.25em] text-muted-foreground [writing-mode:vertical-rl]"
      >
        scroll
      </motion.span>
    </div>
  );
}
