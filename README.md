# TestAI — web app

A production-ready marketing site built with a monochrome (white · gray · black) design system and motion-first UI.

## Stack

| Concern | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router, Turbopack) · React 19 · TypeScript |
| Styling | Tailwind CSS v4 · design tokens in `src/app/globals.css` |
| Components | shadcn/ui (Base UI primitives) · lucide icons |
| UI animation | Motion (`motion/react`) |
| Scroll animation | GSAP + ScrollTrigger (`@gsap/react`) |
| Smooth scroll | Lenis, driven by GSAP's ticker |

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run lint
```

Set `NEXT_PUBLIC_SITE_URL` in production so metadata, the sitemap and OG images use absolute URLs.

## Renaming the app

The app name lives in exactly one place:

```ts
// src/config/site.ts
export const APP_NAME = "TestAI";
```

The header, footer, page metadata, OG image, mobile menu and all copy read from it. Taglines, nav links and footer links are in the same file.

## Project structure

```
src/
├── app/                  Routes, layout, SEO files (robots, sitemap, OG image)
├── config/site.ts        Brand constants: APP_NAME, SITE, NAV_ITEMS, FOOTER_LINKS
├── content/landing.ts    All landing-page copy and data (no UI code)
├── features/landing/     One file per page section (hero, features, pricing, …)
├── components/
│   ├── ui/               shadcn primitives + ButtonLink
│   ├── layout/           Header, footer, Container, SectionHeading
│   ├── motion/           Reusable animation primitives (Reveal, TextReveal, Magnetic, CountUp, Marquee)
│   ├── brand/            Logo
│   └── providers/        Lenis + GSAP sync, MotionConfig
└── lib/                  `cn` helper, shared motion tokens (easings, durations, variants)
```

**Conventions**

- **Content and presentation stay separate.** To change copy, edit `content/`. To change layout, edit `features/`.
- **Server components by default.** `"use client"` is added only where interaction or animation needs it.
- **One motion language.** Easings and durations come from `lib/motion.ts`.
- **Links that look like buttons** use `<ButtonLink>`. Actions use `<Button>`.

## Accessibility & performance

- Respects `prefers-reduced-motion`: Motion, Lenis, GSAP pinning and the CSS marquees all turn their animations off.
- Skip-to-content link, semantic landmarks, visible focus rings, and `aria-label`s on decorative or animated text.
- Animations only change `transform`, `opacity` and `filter`. Marquees are CSS-only.
- Pages are statically prerendered, and fonts are self-hosted via `next/font`.
