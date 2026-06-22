import type { Metadata } from "next";
import { cookies, headers } from "next/headers";
import { Archivo, Space_Grotesk } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { I18nProvider } from "@/components/i18n-provider";
import { SkipLink } from "@/components/skip-link";
import { CustomCursor } from "@/components/custom-cursor";
import { dictionaries } from "@/lib/dictionaries";
import {
  LOCALE_COOKIE,
  isLocale,
  localeFromAcceptLanguage,
  type Locale,
} from "@/lib/i18n/config";
import { profile } from "@/lib/content";
import "./globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

/** Cookie override first (manual choice), then the browser's Accept-Language. */
async function resolveLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const fromCookie = cookieStore.get(LOCALE_COOKIE)?.value;
  if (isLocale(fromCookie)) return fromCookie;

  const headerStore = await headers();
  return localeFromAcceptLanguage(headerStore.get("accept-language"));
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = await resolveLocale();
  const d = dictionaries[locale];
  const title = `${profile.name} — ${d.hero.role}`;
  return {
    title,
    description: d.hero.intro,
    openGraph: {
      title,
      description: d.hero.intro,
      type: "website",
      locale: locale === "de" ? "de_DE" : "en_US",
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await resolveLocale();

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={`${archivo.variable} ${spaceGrotesk.variable}`}
    >
      <body className="min-h-dvh bg-background font-sans text-foreground antialiased">
        <ThemeProvider>
          <I18nProvider initialLocale={locale}>
            <SkipLink />
            {children}
          </I18nProvider>
        </ThemeProvider>
        <CustomCursor />
      </body>
    </html>
  );
}
