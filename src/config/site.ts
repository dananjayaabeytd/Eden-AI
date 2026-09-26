/**
 * Site-wide constants.
 *
 * This is the single source of truth for branding. Change `APP_NAME` here and
 * it propagates to the header, footer, metadata, OG image and all copy.
 */

export const APP_NAME = "Eden";

export const SITE = {
  name: APP_NAME,
  tagline: "Intelligence, beautifully crafted.",
  description: `${APP_NAME} turns scattered data into clear decisions. A calm, fast workspace that helps teams think, build and ship with AI.`,
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  locale: "en_US",
  email: "hello@Eden.example",
  twitter: "@Eden",
} as const;

/** Application routes — reference these instead of hard-coding paths. */
export const ROUTES = {
  home: "/",
  privacy: "/privacy",
  terms: "/terms",
  login: "/login",
  admin: "/admin",
} as const;

/**
 * Legal entity details used by the Privacy Policy and Terms.
 * Replace the placeholders before going live.
 */
export const LEGAL = {
  entityName: `${APP_NAME}, Inc.`,
  address: "123 Example Street, Suite 100, San Francisco, CA 94105, USA",
  jurisdiction: "the State of Delaware, USA",
  privacyEmail: "privacy@Eden.example",
  lastUpdated: "2026-09-26",
} as const;

export type NavItem = {
  label: string;
  href: string;
};

export const NAV_ITEMS: readonly NavItem[] = [
  { label: "Features", href: "/#features" },
  { label: "How it works", href: "/#how-it-works" },
  { label: "Pricing", href: "/#pricing" },
  { label: "FAQ", href: "/#faq" },
  { label: "Contact", href: "/#contact" },
];

export const FOOTER_LINKS: readonly { title: string; links: readonly NavItem[] }[] = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "/#features" },
      { label: "Pricing", href: "/#pricing" },
      { label: "Changelog", href: "#" },
      { label: "Roadmap", href: "#" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Blog", href: "#" },
      { label: "Contact", href: "/#contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: ROUTES.privacy },
      { label: "Terms", href: ROUTES.terms },
      { label: "Security", href: `${ROUTES.privacy}#security` },
    ],
  },
];
