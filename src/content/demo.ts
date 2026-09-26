/** Scripted scenarios for the interactive hero demo (`features/landing/hero-demo`). */

export type DemoScenario = {
  id: string;
  /** Short label for the suggestion chip. */
  chip: string;
  prompt: string;
  steps: readonly string[];
  /** Streamed answer; each entry renders as its own line. */
  answer: readonly string[];
  sources: readonly string[];
};

export const DEMO_SCENARIOS: readonly DemoScenario[] = [
  {
    id: "calls",
    chip: "Summarise calls",
    prompt: "Summarise this week's customer calls and flag churn risks",
    steps: ["Reading 42 call transcripts", "Clustering themes across accounts", "Scoring churn signals"],
    answer: [
      "Top themes: onboarding speed (18 calls), SSO requests (11), pricing clarity (7).",
      "3 accounts at risk — Globex, Initech and Hooli mentioned evaluating alternatives.",
      "Suggested next step: book success check-ins with all three before Friday.",
    ],
    sources: ["Gong", "HubSpot"],
  },
  {
    id: "roadmap",
    chip: "Draft roadmap",
    prompt: "Draft our Q3 roadmap from open Linear issues",
    steps: ["Pulling 128 open issues", "Grouping by customer impact", "Estimating effort from past cycles"],
    answer: [
      "Theme 1 — Enterprise readiness: SSO, audit logs, SCIM (6 weeks).",
      "Theme 2 — Faster onboarding: guided setup, templates (4 weeks).",
      "Theme 3 — Reliability: queue retries, status page (3 weeks).",
    ],
    sources: ["Linear", "Notion"],
  },
  {
    id: "review",
    chip: "Review PR #1284",
    prompt: "Review PR #1284 for regressions before we ship",
    steps: ["Diffing 14 changed files", "Running the affected test suites", "Checking performance budgets"],
    answer: [
      "✓ Tests pass (212/212) and bundle size is down 3.1 kB.",
      "⚠ `useInvoices` refetches on every render — suggest memoising the query key.",
      "Safe to merge once that one fix lands. I've left an inline comment.",
    ],
    sources: ["GitHub", "CI"],
  },
];
