"use client";

import { useI18n } from "@/components/i18n-provider";
import { profile } from "@/lib/content";

export function Footer() {
  const { dict } = useI18n();
  const year = new Date().getFullYear();

  const [first, ...rest] = profile.name.split(" ");
  const last = rest.join(" ");

  return (
    <footer className="relative overflow-hidden border-t border-border pb-8">
      <div className="mx-auto max-w-6xl px-4 pt-16 sm:px-6">
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

      {/* Oversized name wordmark — full and uncut */}
      <div
        aria-hidden="true"
        className="pointer-events-none mt-12 select-none whitespace-nowrap text-center font-display font-bold uppercase leading-none tracking-tighter"
        style={{ fontSize: "clamp(2rem, 13.5vw, 15rem)" }}
      >
        <span className="text-foreground/[0.07]">{first} </span>
        <span className="text-primary/80">{last}</span>
      </div>
    </footer>
  );
}
