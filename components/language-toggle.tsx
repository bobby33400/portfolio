"use client";

import { useI18n } from "@/components/i18n-provider";
import { locales } from "@/lib/i18n/config";

export function LanguageToggle() {
  const { locale, setLocale, dict } = useI18n();

  return (
    <div
      role="group"
      aria-label={dict.ui.switchLanguage}
      className="inline-flex h-11 items-center rounded-full border border-border bg-card p-1"
    >
      {locales.map((l) => {
        const active = locale === l;
        return (
          <button
            key={l}
            type="button"
            onClick={() => setLocale(l)}
            aria-pressed={active}
            className={`inline-flex h-9 min-w-[2.25rem] cursor-pointer items-center justify-center rounded-full px-2.5 text-xs font-semibold uppercase tracking-wide transition-colors duration-200 ${
              active
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {l}
          </button>
        );
      })}
    </div>
  );
}
