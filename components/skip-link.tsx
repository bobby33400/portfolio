"use client";

import { useI18n } from "@/components/i18n-provider";

export function SkipLink() {
  const { dict } = useI18n();
  return (
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
    >
      {dict.ui.skipToContent}
    </a>
  );
}
