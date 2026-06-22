"use client";

import { useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageToggle } from "@/components/language-toggle";
import { useI18n } from "@/components/i18n-provider";
import { profile } from "@/lib/content";

export function Nav() {
  const [open, setOpen] = useState(false);
  const { dict } = useI18n();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  const links = [
    { label: dict.nav.work, href: "#projects" },
    { label: dict.nav.about, href: "#about" },
    { label: dict.nav.contact, href: "#contact" },
  ];

  return (
    <header className="fixed inset-x-0 top-0 z-40">
      <div className="border-b border-border/60 bg-background/80 backdrop-blur-md">
        <nav className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-3 px-4 sm:px-6">
          <a
            href="#top"
            className="shrink-0 font-display text-lg font-bold tracking-tight text-foreground"
          >
            {profile.name.split(" ")[0]}
            <span className="text-accent">.</span>
          </a>

          {/* Desktop links */}
          <div className="hidden items-center gap-1 md:flex">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors duration-200 hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Controls (always visible) */}
          <div className="flex items-center gap-2">
            <LanguageToggle />
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? dict.ui.closeMenu : dict.ui.openMenu}
              aria-expanded={open}
              className="inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:bg-muted md:hidden"
            >
              {open ? (
                <X className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Menu className="h-5 w-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </nav>

        {/* Scroll progress indicator */}
        <motion.div
          className="h-0.5 origin-left bg-accent"
          style={{ scaleX: progress }}
        />
      </div>

      {/* Mobile menu */}
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="border-b border-border bg-background md:hidden"
        >
          <div className="mx-auto flex max-w-5xl flex-col px-4 py-2 sm:px-6">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-3 text-base font-medium text-foreground transition-colors hover:bg-muted"
              >
                {link.label}
              </a>
            ))}
          </div>
        </motion.div>
      )}
    </header>
  );
}
