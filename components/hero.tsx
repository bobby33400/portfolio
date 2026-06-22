"use client";

import { motion, type Variants } from "framer-motion";
import { ArrowDown, ArrowUpRight, FileText } from "lucide-react";
import { useI18n } from "@/components/i18n-provider";
import { DotField } from "@/components/dot-field";
import { profile } from "@/lib/content";

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] },
  },
};

/** Decorative full-width dotted wave field + soft amber glow behind the hero. */
function HeroBackdrop() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
    >
      <DotField className="absolute inset-0 hero-dots h-full w-full" />
      <motion.div
        className="absolute left-1/2 top-[16%] h-[360px] w-[680px] max-w-[92vw] -translate-x-1/2 rounded-full blur-[110px]"
        style={{ background: "radial-gradient(circle, var(--glow), transparent 70%)" }}
        animate={{ opacity: [0.55, 0.85, 0.55], scale: [1, 1.08, 1] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

export function Hero() {
  const { dict } = useI18n();

  return (
    <section
      id="top"
      className="relative flex min-h-dvh flex-col justify-center overflow-hidden"
    >
      <HeroBackdrop />

      <div className="relative z-10 mx-auto w-full max-w-5xl px-4 pb-20 pt-28 sm:px-6">
        <motion.div variants={container} initial="hidden" animate="visible">
          <motion.h1
            variants={item}
            className="font-display text-5xl font-bold leading-[1.05] tracking-tight text-foreground sm:text-6xl md:text-7xl"
          >
            {profile.name}
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-4 text-xl font-medium text-accent sm:text-2xl"
          >
            {dict.hero.role}
          </motion.p>

          <motion.p
            variants={item}
            className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground"
          >
            {dict.hero.intro}
          </motion.p>

          <motion.div
            variants={item}
            className="mt-10 flex flex-wrap items-center gap-3"
          >
            <a
              href="#projects"
              className="inline-flex h-12 items-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground transition duration-200 hover:bg-primary-hover hover:scale-[1.03] active:scale-[0.98]"
            >
              {dict.hero.viewWork}
              <ArrowDown className="h-4 w-4" aria-hidden="true" />
            </a>
            <a
              href="#contact"
              className="inline-flex h-12 items-center gap-2 rounded-full border border-border bg-card px-6 text-sm font-semibold text-foreground transition-colors duration-200 hover:bg-muted"
            >
              {dict.hero.getInTouch}
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </a>
            {profile.resumeUrl && (
              <a
                href={profile.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center gap-2 px-3 text-sm font-semibold text-muted-foreground transition-colors duration-200 hover:text-foreground"
              >
                <FileText className="h-4 w-4" aria-hidden="true" />
                {dict.hero.resume}
              </a>
            )}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
