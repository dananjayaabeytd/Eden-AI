/**
 * Landing page copy. Kept separate from components so marketing text can be
 * edited without touching UI code.
 */
import {
  Bolt,
  Boxes,
  BrainCircuit,
  Lock,
  Sparkles,
  Workflow,
  type LucideIcon,
} from "lucide-react";

import { APP_NAME } from "@/config/site";

export const HERO = {
  badge: { label: "New", text: "Agents that actually finish the job", href: "#features" },
  title: "Think faster. Build calmer. Ship with AI.",
  subtitle: `${APP_NAME} is the quiet workspace where your team and AI agents collaborate on real work — from first draft to production.`,
  primaryCta: { label: "Start for free", href: "#pricing" },
  secondaryCta: { label: "See how it works", href: "#how-it-works" },
} as const;

export const LOGOS = [
  "Northwind",
  "Acme",
  "Globex",
  "Umbrella",
  "Initech",
  "Hooli",
  "Stark",
  "Wayne",
] as const;

export type Feature = {
  icon: LucideIcon;
  title: string;
  description: string;
  /** Spans two columns of the bento grid on large screens. Keep rows full: wide + 1, then 3 singles. */
  wide?: boolean;
};

export const FEATURES: readonly Feature[] = [
  {
    icon: BrainCircuit,
    title: "Context that remembers",
    description:
      "Every document, thread and decision becomes shared memory your agents can reason over — securely and instantly.",
    wide: true,
  },
  {
    icon: Bolt,
    title: "Sub‑second answers",
    description: "Streaming responses on a globally distributed edge.",
  },
  {
    icon: Workflow,
    title: "Composable workflows",
    description: "Chain prompts, tools and approvals into flows anyone can run.",
  },
  {
    icon: Lock,
    title: "Private by default",
    description: "SOC 2 Type II, SSO, and zero data retention on every plan.",
  },
  {
    icon: Boxes,
    title: "Integrates everywhere",
    description:
      "Connect GitHub, Slack, Notion, Linear and 100+ tools in a click.",
  },
];

export const STEPS = [
  {
    title: "Connect your sources",
    description:
      "Plug in the tools you already use. We index everything securely in minutes, not weeks.",
  },
  {
    title: "Describe the outcome",
    description:
      "Tell an agent what done looks like in plain language. It plans the steps and asks when unsure.",
  },
  {
    title: "Review and ship",
    description:
      "Approve changes with full visibility. Every action is logged, reversible and explainable.",
  },
] as const;

export const STATS = [
  { value: 10, suffix: "x", label: "faster research" },
  { value: 98, suffix: "%", label: "answer accuracy" },
  { value: 40, suffix: "k+", label: "teams onboard" },
  { value: 120, suffix: "ms", label: "median latency" },
] as const;

export const TESTIMONIALS = [
  {
    quote: `${APP_NAME} replaced four tools and a weekly meeting. It just quietly gets things done.`,
    name: "Maya Chen",
    role: "Head of Product, Northwind",
  },
  {
    quote: "The first AI product our engineers asked to keep after the trial ended.",
    name: "Jonas Weber",
    role: "CTO, Globex",
  },
  {
    quote: "Beautifully designed and absurdly fast. It feels like it reads your mind.",
    name: "Priya Nair",
    role: "Design Lead, Hooli",
  },
  {
    quote: "Onboarding took an afternoon. Our support backlog dropped 60% in a month.",
    name: "Daniel Okafor",
    role: "VP Operations, Initech",
  },
  {
    quote: "Finally, an assistant that respects our security team's sleep schedule.",
    name: "Sara Lindqvist",
    role: "CISO, Umbrella",
  },
  {
    quote: "We ship twice as often, and the quality actually went up.",
    name: "Leo Martins",
    role: "Engineering Manager, Acme",
  },
] as const;

export type Plan = {
  name: string;
  description: string;
  price: { monthly: number; yearly: number } | null;
  features: readonly string[];
  cta: string;
  featured?: boolean;
};

export const PLANS: readonly Plan[] = [
  {
    name: "Starter",
    description: "For individuals exploring what AI can do.",
    price: { monthly: 0, yearly: 0 },
    features: ["1 workspace", "100 agent runs / month", "5 integrations", "Community support"],
    cta: "Get started",
  },
  {
    name: "Pro",
    description: "For teams that ship every day.",
    price: { monthly: 24, yearly: 19 },
    features: [
      "Unlimited workspaces",
      "5,000 agent runs / month",
      "All integrations",
      "Custom workflows",
      "Priority support",
    ],
    cta: "Start 14‑day trial",
    featured: true,
  },
  {
    name: "Enterprise",
    description: "For organisations with advanced needs.",
    price: null,
    features: ["SSO & SCIM", "Dedicated infrastructure", "Custom data retention", "99.99% SLA"],
    cta: "Contact sales",
  },
];

export const FAQS = [
  {
    question: `What is ${APP_NAME}?`,
    answer: `${APP_NAME} is an AI workspace that connects to your tools, understands your context and runs agents that complete real tasks — with you in control.`,
  },
  {
    question: "Is my data used to train models?",
    answer: "Never. Your data stays yours. We offer zero data retention and are SOC 2 Type II certified.",
  },
  {
    question: "Can I cancel anytime?",
    answer: "Yes. Plans are month‑to‑month or yearly, and you can downgrade or cancel from settings at any time.",
  },
  {
    question: "Do you offer discounts for startups or nonprofits?",
    answer: "We do — reach out to our team and we'll set you up with up to 50% off for your first year.",
  },
] as const;

export const CTA = {
  title: "Your best work, now on autopilot.",
  subtitle: `Join 40,000+ teams using ${APP_NAME} to move faster without the noise.`,
  icon: Sparkles,
} as const;
