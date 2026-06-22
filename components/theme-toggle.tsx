"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useI18n } from "@/components/i18n-provider";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const { dict } = useI18n();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch — theme is only known on the client.
  useEffect(() => setMounted(true), []);

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? dict.ui.toLight : dict.ui.toDark}
      className="inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors duration-200 hover:bg-muted"
    >
      {mounted ? (
        isDark ? (
          <Sun className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
        ) : (
          <Moon className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
        )
      ) : (
        <span className="h-5 w-5" />
      )}
    </button>
  );
}
