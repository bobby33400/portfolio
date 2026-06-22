"use client";

import { MapPin } from "lucide-react";
import { motion, type Variants } from "framer-motion";
import { Reveal } from "@/components/reveal";
import { useI18n } from "@/components/i18n-provider";

const list: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.04 } },
};

const chip: Variants = {
  hidden: { opacity: 0, y: 10, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.3 } },
};

export function About() {
  const { dict } = useI18n();
  const { about } = dict;

  return (
    <section id="about" className="border-t border-border bg-muted/30">
      <div className="mx-auto max-w-5xl px-4 py-24 sm:px-6">
        <div className="grid gap-12 md:grid-cols-[1fr_1.5fr]">
          <Reveal>
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-accent">
                {about.eyebrow}
              </p>
              <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                {about.title}
              </h2>
              <p className="mt-4 inline-flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" aria-hidden="true" />
                {about.location}
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="space-y-5">
              {about.paragraphs.map((p, i) => (
                <p
                  key={i}
                  className="text-lg leading-relaxed text-muted-foreground"
                >
                  {p}
                </p>
              ))}

              <div className="pt-2">
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  {about.skillsTitle}
                </h3>
                <motion.ul
                  variants={list}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-60px" }}
                  className="flex flex-wrap gap-2"
                >
                  {about.skills.map((skill) => (
                    <motion.li
                      key={skill}
                      variants={chip}
                      className="cursor-default rounded-full border border-border bg-card px-3 py-1.5 text-sm font-medium text-foreground transition-colors duration-200 hover:border-primary hover:text-primary"
                    >
                      {skill}
                    </motion.li>
                  ))}
                </motion.ul>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
