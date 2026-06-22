"use client";

import { useI18n } from "@/components/i18n-provider";
import { profile } from "@/lib/content";

export function Footer() {
  const { dict } = useI18n();
  const year = new Date().getFullYear();

  const [first, ...rest] = profile.name.split(" ");
  const last = rest.join(" ");

  return (
    <footer className="relative overflow-hidden border-t border-border">
      <div className="mx-auto max-w-6xl px-4 pt-16 pb-[13vw] sm:px-6 sm:pb-[10vw]">
        {/* Brand */}
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
            {profile.name}
          </p>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            {dict.hero.role} · {dict.about.location}
          </p>
        </div>

        <div className="mt-10 h-px w-full bg-border" />

        {/* Copyright row */}
        <div className="flex flex-col items-start justify-between gap-3 pt-6 text-sm text-muted-foreground sm:flex-row sm:items-center">
          <p>
            © {year} {profile.name}. {dict.footer.rights}
          </p>
          <p>{dict.footer.builtWith}</p>
        </div>
      </div>

      {/* Oversized wordmark, bleeding off the bottom edge */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-[26%] select-none whitespace-nowrap text-center font-display font-bold uppercase leading-[0.75] tracking-tighter"
        style={{ fontSize: "clamp(2.5rem, 13.5vw, 13rem)" }}
      >
        <span className="text-foreground/[0.07]">{first} </span>
        <span className="text-primary/80">{last}</span>
      </div>
    </footer>
  );
}
