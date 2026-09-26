"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check } from "lucide-react";

import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/layout/section-heading";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button-link";
import { PLANS, type Plan } from "@/content/landing";
import { cn } from "@/lib/utils";

type Billing = "monthly" | "yearly";

const BILLING_OPTIONS: readonly { value: Billing; label: string }[] = [
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly" },
];

export function Pricing() {
  const [billing, setBilling] = useState<Billing>("yearly");

  return (
    <section id="pricing" className="scroll-mt-24 py-24 sm:py-32">
      <Container>
        <SectionHeading
          eyebrow="Pricing"
          title="Simple pricing that scales with you."
          description="Start free. Upgrade when your team is ready."
        />

        <div className="mt-10 flex justify-center">
          <div role="group" aria-label="Billing period" className="inline-flex rounded-full border bg-muted/60 p-1">
            {BILLING_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                aria-pressed={billing === opt.value}
                onClick={() => setBilling(opt.value)}
                className="relative rounded-full px-5 py-2 text-sm font-medium transition-colors aria-pressed:text-background"
              >
                {billing === opt.value && (
                  <motion.span
                    layoutId="billing-pill"
                    className="absolute inset-0 rounded-full bg-foreground"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                <span className="relative">
                  {opt.label}
                  {opt.value === "yearly" && <span className="ml-1.5 text-xs opacity-70">−20%</span>}
                </span>
              </button>
            ))}
          </div>
        </div>

        <Stagger className="mt-12 grid gap-4 lg:grid-cols-3">
          {PLANS.map((plan) => (
            <StaggerItem key={plan.name}>
              <PlanCard plan={plan} billing={billing} />
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}

function PlanCard({ plan, billing }: { plan: Plan; billing: Billing }) {
  const featured = plan.featured;

  return (
    <article
      className={cn(
        "relative flex h-full flex-col rounded-2xl border p-8",
        featured ? "bg-foreground text-background shadow-2xl lg:-my-4 lg:py-12" : "bg-card",
      )}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{plan.name}</h3>
        {featured && <Badge className="bg-background text-foreground">Most popular</Badge>}
      </div>
      <p className={cn("mt-2 text-sm", featured ? "text-background/70" : "text-muted-foreground")}>
        {plan.description}
      </p>

      <div className="mt-8 flex h-14 items-end gap-1">
        {plan.price ? (
          <>
            <span className="text-5xl font-semibold tracking-tighter">$</span>
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={plan.price[billing]}
                initial={{ y: 20, opacity: 0, filter: "blur(4px)" }}
                animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                exit={{ y: -20, opacity: 0, filter: "blur(4px)" }}
                transition={{ duration: 0.3 }}
                className="text-5xl font-semibold tracking-tighter tabular-nums"
              >
                {plan.price[billing]}
              </motion.span>
            </AnimatePresence>
            <span className={cn("mb-1.5 text-sm", featured ? "text-background/70" : "text-muted-foreground")}>
              / user / mo
            </span>
          </>
        ) : (
          <span className="text-5xl font-semibold tracking-tighter">Custom</span>
        )}
      </div>

      <ul className="mt-8 flex-1 space-y-3 text-sm">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-center gap-3">
            <Check className="size-4 shrink-0" />
            {feature}
          </li>
        ))}
      </ul>

      <ButtonLink
        href="#"
        variant={featured ? "secondary" : "outline"}
        size="lg"
        className={cn("mt-10 h-11 rounded-full", featured && "bg-background text-foreground hover:bg-background/90")}
      >
        {plan.cta}
      </ButtonLink>
    </article>
  );
}
