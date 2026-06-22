"use client";

import { Github, Linkedin, Twitter, Mail, Globe, ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { useI18n } from "@/components/i18n-provider";
import { profile, type Social } from "@/lib/content";

const iconMap = {
  github: Github,
  linkedin: Linkedin,
  twitter: Twitter,
  mail: Mail,
  globe: Globe,
} as const;

function SocialLink({ social }: { social: Social }) {
  const Icon = iconMap[social.icon];
  return (
    <a
      href={social.href}
      target={social.icon === "mail" ? undefined : "_blank"}
      rel="noopener noreferrer"
      className="inline-flex h-11 items-center gap-2 rounded-full border border-border bg-card px-4 text-sm font-medium text-foreground transition-colors duration-200 hover:bg-muted"
    >
      <Icon className="h-4 w-4" aria-hidden="true" />
      {social.label}
    </a>
  );
}

export function Contact() {
  const { dict } = useI18n();

  return (
    <section id="contact" className="mx-auto max-w-5xl px-4 py-24 sm:px-6">
      <Reveal>
        <div className="rounded-3xl border border-border bg-card px-6 py-16 text-center sm:px-12">
          <p className="text-sm font-semibold uppercase tracking-wider text-accent">
            {dict.contact.eyebrow}
          </p>
          <h2 className="mx-auto mt-2 max-w-2xl font-display text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
            {dict.contact.title}
          </h2>
          <p className="mx-auto mt-4 max-w-md text-lg text-muted-foreground">
            {dict.contact.blurb}
          </p>

          {profile.available && (
            <div className="mt-6 flex justify-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-muted px-3 py-1.5 text-sm font-medium text-muted-foreground">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
                </span>
                {dict.hero.availability}
              </span>
            </div>
          )}

          <div className="mt-8 flex justify-center">
            <a
              href={`mailto:${profile.email}`}
              className="inline-flex h-12 items-center gap-2 rounded-full bg-primary px-7 text-sm font-semibold text-primary-foreground transition duration-200 hover:bg-primary-hover hover:scale-[1.03] active:scale-[0.98]"
            >
              <Mail className="h-4 w-4" aria-hidden="true" />
              {profile.email}
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>

          {profile.socials.length > 0 && (
            <div className="mt-8 flex flex-wrap items-start justify-center gap-3">
              {profile.socials.map((s) => (
                <div
                  key={s.label}
                  className="flex flex-col items-center gap-1.5"
                >
                  <SocialLink social={s} />
                  {s.icon === "linkedin" && (
                    <span className="text-xs font-medium text-muted-foreground">
                      {dict.contact.connect}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </Reveal>
    </section>
  );
}
