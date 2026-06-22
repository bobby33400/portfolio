"use client";

import { useI18n } from "@/components/i18n-provider";
import { profile } from "@/lib/content";

export function Footer() {
  const { dict } = useI18n();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:px-6">
        <p>
          © {year} {profile.name}. {dict.footer.rights}
        </p>
        <p>{dict.footer.builtWith}</p>
      </div>
    </footer>
  );
}
