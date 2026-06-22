# Qasim Alarab — Portfolio

A motion-driven, **bilingual (English / German)** personal portfolio built with **Next.js (App Router)**, **Tailwind CSS v4**, and **Framer Motion**. Light + dark mode, fully responsive, accessible, and reduced-motion friendly.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) (falls back to `:3001` if the port is busy).

## Language (i18n)

- On first visit the language is auto-detected **server-side** from the browser's `Accept-Language` header (German → `de`, otherwise `en`).
- A visitor can switch language with the **EN / DE** toggle in the nav. The choice is saved in a cookie, so the server renders the right language on the next visit (no flash).
- Add or edit translations in [`lib/dictionaries.ts`](./lib/dictionaries.ts) — every user-facing string lives there in both `en` and `de`.

## Editing your content

Content is split into two files:

| File | Holds |
| --- | --- |
| [`lib/content.ts`](./lib/content.ts) | Language-independent data: your name, email, GitHub, social links, and per-project **tech tags + links** |
| [`lib/dictionaries.ts`](./lib/dictionaries.ts) | All **translated text**: hero, about paragraphs, project descriptions + personal notes, labels |

Project descriptions and the "My take" notes are keyed by project `id` (`chargestay`, `synqro`, `protrack`) in both languages.

### Project images (optional)

Drop screenshots in `public/projects/` and set `image: "/projects/chargestay.png"` in `lib/content.ts`. With no image, a clean lettermark placeholder is shown.

### CV / résumé

Put your PDF in `public/` (e.g. `public/cv.pdf`) and set `resumeUrl: "/cv.pdf"` in `lib/content.ts` — a "Résumé / Lebenslauf" button then appears in the hero.

## Design system

| Token | Light | Dark |
| --- | --- | --- |
| Accent (CTA) | `#2563EB` | `#3B82F6` |
| Background | `#FAFAFA` | `#09090B` |
| Foreground | `#09090B` | `#FAFAFA` |

Fonts: **Archivo** (display) / **Space Grotesk** (body). Tokens live in [`app/globals.css`](./app/globals.css).

## Build & deploy

```bash
npm run build
```

Deploy to [Vercel](https://vercel.com) — connect the repo and it just works.

## Structure

```
app/             layout (locale detection), page, global styles + design tokens
components/      nav, hero, projects, about, contact, footer,
                 theme + language toggles, i18n provider, reveal, skip-link
lib/content.ts       ← stable data (links, tech, project meta)
lib/dictionaries.ts  ← EN/DE translated text
lib/i18n/config.ts   ← locale detection helpers
```
