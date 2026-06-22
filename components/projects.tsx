"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight, Github } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { useI18n } from "@/components/i18n-provider";
import { projects, type ProjectMeta } from "@/lib/content";

function ProjectCard({
  project,
  index,
}: {
  project: ProjectMeta;
  index: number;
}) {
  const { dict } = useI18n();
  const copy = dict.projects.items[project.id];

  return (
    <Reveal
      as="article"
      delay={Math.min(index * 0.06, 0.3)}
      className={project.featured ? "sm:col-span-2" : ""}
    >
      <motion.div
        whileHover={{ y: -6 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card"
      >
        {/* Visual */}
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-muted">
          {project.image ? (
            <Image
              src={project.image}
              alt={`${project.title} preview`}
              fill
              sizes="(max-width: 640px) 100vw, 50vw"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            />
          ) : (
            <div
              aria-hidden="true"
              className="flex h-full w-full items-center justify-center bg-gradient-to-br from-muted to-card"
            >
              <span className="font-display text-4xl font-bold text-muted-foreground/40">
                {project.title.charAt(0)}
              </span>
            </div>
          )}
        </div>

        {/* Body */}
        <div className="flex flex-1 flex-col p-6">
          <div className="flex items-start justify-between gap-4">
            <h3 className="font-display text-xl font-semibold text-foreground">
              {project.title}
            </h3>
            <div className="flex shrink-0 items-center gap-1">
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${project.title} — ${dict.projects.codeLabel}`}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <Github className="h-[18px] w-[18px]" aria-hidden="true" />
                </a>
              )}
              {project.live && (
                <a
                  href={project.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${project.title} — ${dict.projects.liveLabel}`}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <ArrowUpRight className="h-5 w-5" aria-hidden="true" />
                </a>
              )}
            </div>
          </div>

          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {copy.description}
          </p>

          {/* Personal note */}
          <div className="mt-4 flex-1 rounded-xl border-l-2 border-accent bg-muted/40 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-accent">
              {dict.projects.noteLabel}
            </p>
            <p className="mt-1 text-sm italic leading-relaxed text-muted-foreground">
              {copy.note}
            </p>
          </div>

          <ul className="mt-4 flex flex-wrap gap-2">
            {project.tech.map((t) => (
              <li
                key={t}
                className="rounded-full border border-border bg-muted/50 px-2.5 py-1 text-xs font-medium text-muted-foreground"
              >
                {t}
              </li>
            ))}
          </ul>
        </div>
      </motion.div>
    </Reveal>
  );
}

export function Projects() {
  const { dict } = useI18n();

  return (
    <section id="projects" className="mx-auto max-w-5xl px-4 py-24 sm:px-6">
      <Reveal>
        <div className="mb-12">
          <p className="text-sm font-semibold uppercase tracking-wider text-accent">
            {dict.projects.eyebrow}
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {dict.projects.title}
          </h2>
        </div>
      </Reveal>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {projects.map((project, i) => (
          <ProjectCard key={project.id} project={project} index={i} />
        ))}
      </div>
    </section>
  );
}
