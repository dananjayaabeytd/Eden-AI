# Eden — web app

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
| Backend | Next.js Server Actions · Zod validation |
| Database | Supabase (Postgres) |
| Email | Resend |

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run lint
```

Set `NEXT_PUBLIC_SITE_URL` in production so metadata, the sitemap and OG images use absolute URLs.

## Contact form backend

The contact form (`#contact`) posts to a Server Action (`src/features/contact/actions.ts`). Each submission goes through these steps:

1. **Spam checks.** A hidden honeypot field and a minimum fill time. Bots get a fake success, so they learn nothing.
2. **Validation.** One Zod schema (`src/features/contact/schema.ts`) runs in the browser for instant feedback and again on the server as the source of truth.
3. **Rate limit.** 3 submissions per IP per 10 minutes. The count comes from the database, so the limit holds across server instances. IPs are stored only as a salted SHA-256 hash.
4. **Save.** The submission is inserted into Supabase `contact_submissions` using the server-only secret key.
5. **Notify.** An email goes to the team via Resend, and optionally a confirmation to the sender. This runs in `after()`, so the user doesn't wait, and an email failure never loses a submission.

The form also works with JavaScript disabled (a native form post), and keeps the user's input if a submission fails.

### Setup

1. **Supabase.** Create a project, then open **SQL Editor** and run
   `supabase/migrations/20260926000000_create_contact_submissions.sql`
   (or use `supabase db push` with the Supabase CLI).
   RLS is enabled with no policies, so the public keys have no access to this table.
2. **Environment.** Run `cp .env.example .env.local`, then fill in:
   - `SUPABASE_URL` and `SUPABASE_SECRET_KEY`, from Project Settings → API. The legacy `SUPABASE_SERVICE_ROLE_KEY` name also works.
   - `IP_HASH_SALT`, generated with `openssl rand -hex 32`.
   - For email: `RESEND_API_KEY`, `CONTACT_TO_EMAIL` and `CONTACT_FROM_EMAIL`. Leave the key empty to disable emails.
3. **Reading submissions.** Use Supabase **Table Editor → contact_submissions**. The `status` column (`new`, `in_progress`, `resolved`, `spam`) is there for triage.

If Supabase isn't configured, the form shows a friendly error that includes your contact email, and the server logs the reason.

## Admin dashboard (`/admin`)

Signed-in admins can view, filter, search and triage contact submissions, change their status, reply by email and delete them.

**Security model (defence in depth):**

1. **Proxy** (`src/proxy.ts`) refreshes the Supabase session cookie and redirects signed-out visitors to `/login`. It's an optimisation, not a security boundary.
2. **Data Access Layer** (`src/server/auth/session.ts`). Every admin page and Server Action calls `requireAdmin()`, which verifies the session with Supabase Auth (`getUser()`) and checks the `admins` table.
3. **Row Level Security.** Admin queries run as the signed-in user with the publishable key, never the secret key, so the database itself only returns data to admins. Admins can change a submission's `status` but never its content.

Other protections: identical errors for unknown email and wrong password (no account enumeration), non-admin accounts are signed straight back out, and `?next=` redirects are limited to `/admin` paths.

### Setup

1. Run `supabase/migrations/20260926010000_admin_access.sql` in the Supabase SQL Editor, after the first migration.
2. In Supabase → **Authentication → Sign In / Providers**, turn **off** "Allow new users to sign up". Admin accounts are created by you, not self-registered.
3. Create a user in **Authentication → Users → Add user** (email and password).
4. Grant admin access in the SQL Editor:
   ```sql
   insert into public.admins (user_id, full_name)
   select id, 'Your Name' from auth.users where email = 'you@company.com';
   ```
5. Add `SUPABASE_PUBLISHABLE_KEY` to `.env.local`, then sign in at `/login`.

## Renaming the app

The app name lives in exactly one place:

```ts
// src/config/site.ts
export const APP_NAME = "Eden";
```

The header, footer, page metadata, OG image, mobile menu and all copy read from it. Taglines, nav links and footer links are in the same file.

## Project structure

```
src/
├── app/                  Routes, grouped by layout:
│   ├── (marketing)/      Home, /privacy, /terms (header, footer, smooth scroll, cursor)
│   ├── (auth)/login      Admin sign-in
│   └── (admin)/admin     Dashboard + submission detail
├── config/site.ts        Brand constants: APP_NAME, SITE, NAV_ITEMS, FOOTER_LINKS
├── content/landing.ts    All landing-page copy and data (no UI code)
├── features/landing/     One file per page section (hero, features, pricing, …)
├── features/contact/     Contact form: shared schema, Server Action, form UI, section
├── features/legal/       Privacy Policy & Terms renderer (content in content/legal/)
├── features/auth/        Admin sign-in: schema, Server Actions, login form
├── features/admin/       Admin dashboard: submissions model, queries, actions, UI, shell
├── server/               Server-only code (guarded by `server-only`): env, Supabase clients,
│                         auth Data Access Layer, request metadata, contact repository, emails
├── proxy.ts              Session refresh + optimistic /admin redirect
├── components/
│   ├── ui/               shadcn primitives + ButtonLink
│   ├── layout/           Header, footer, Container, SectionHeading
│   ├── motion/           Reusable animation primitives (Reveal, TextReveal, Magnetic, CountUp, Marquee)
│   ├── brand/            Logo
│   ├── providers/        Root (theme, motion) and marketing (Lenis + GSAP sync, cursor) providers
│   ├── theme/            Pre-paint theme script, ThemeProvider, toggles
│   └── effects/          Particle field, custom cursor
└── lib/                  `cn` helper, shared motion tokens (easings, durations, variants)
supabase/migrations/      SQL schema for the database
```

**Conventions**

- **Content and presentation stay separate.** To change copy, edit `content/`. To change layout, edit `features/`.
- **Server components by default.** `"use client"` is added only where interaction or animation needs it.
- **One motion language.** Easings and durations come from `lib/motion.ts`.
- **Links that look like buttons** use `<ButtonLink>`. Actions use `<Button>`.
- **Secrets stay on the server.** Anything using credentials lives in `src/server/` and imports `server-only`, so the build fails if client code imports it.

## Theming (light / dark / system)

- Colour tokens live in `src/app/globals.css`: `:root` for light and `.dark` for dark, the same neutral grey ramp inverted.
- `components/theme/theme-script.ts` runs inline in `<head>` **before first paint**, so there's no flash of the wrong theme and no hydration mismatch. The default is the OS setting.
- `ThemeProvider` keeps the preference in `localStorage`, follows OS changes while "System" is selected, and syncs across tabs. `ThemeToggle` (headers) and `ThemeSwitcher` (footer) switch themes with a circular View Transition, which is skipped for reduced motion.

## Interactive hero demo

- `features/landing/hero-demo/` plays scripted scenarios from `content/demo.ts`: the prompt types out, steps complete one by one, and the answer streams in. Visitors pick a task with the chips.
- Playback is a small state machine (`use-demo-playback.ts`) that schedules one timer per state. It pauses off-screen and in background tabs, stops auto-advancing once the visitor interacts, and shows finished results for reduced-motion users (WCAG 2.2.2).
- Screen readers get a text summary of each result. The animation itself is marked decorative.

## Legal pages

`/privacy` and `/terms` are rendered from structured data in `content/legal/` by `features/legal/legal-document.tsx`, with a scroll-spy table of contents, linkable sections and print styles. Company details come from `LEGAL` in `src/config/site.ts`. **Replace the placeholders and have both documents reviewed by a lawyer before launch.**

## Photography & effects

- **Photos** live in `src/assets/architecture/` and are registered in `src/content/images.ts`. They're statically imported, so `next/image` serves them as AVIF/WebP with blur-up placeholders. The images are from [Unsplash](https://unsplash.com) under the Unsplash License (free for commercial use, no attribution required). To swap a photo, replace the file and update its alt text in `images.ts`.
- **Particles** (`components/effects/particle-field.tsx`) run on a dependency-free canvas. They pause when off-screen or when the tab is hidden, and render a single static frame for reduced-motion users.
- **Custom cursor** (`components/effects/custom-cursor.tsx`) only appears on mouse or trackpad devices when reduced motion is off. Add `data-cursor="Label"` to any element to show a label bubble on hover.

## Accessibility & performance

- Respects `prefers-reduced-motion`: Motion, Lenis, GSAP pinning and the CSS marquees all turn their animations off.
- Skip-to-content link, semantic landmarks, visible focus rings, and `aria-label`s on decorative or animated text.
- Animations only change `transform`, `opacity` and `filter`. Marquees are CSS-only.
- Pages are statically prerendered, and fonts are self-hosted via `next/font`.
