"use client";

import type { PointerEvent } from "react";
import { motion, useMotionTemplate, useMotionValue } from "motion/react";

import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/layout/section-heading";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { APP_NAME } from "@/config/site";
import { FEATURES, type Feature } from "@/content/landing";
import { cn } from "@/lib/utils";

export function Features() {
  return (
    <section id="features" className="scroll-mt-24 py-24 sm:py-32">
      <Container>
        <SectionHeading
          eyebrow="Features"
          title="Everything you need. Nothing you don't."
          description={`${APP_NAME} brings your knowledge, tools and AI agents into one focused place.`}
        />
        <Stagger className="mt-16 grid auto-rows-[minmax(220px,auto)] gap-4 md:grid-cols-3">
          {FEATURES.map((feature) => (
            <StaggerItem key={feature.title} className={cn(feature.wide && "md:col-span-2")}>
              <FeatureCard feature={feature} />
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}

/** Card with a soft spotlight that follows the pointer. */
function FeatureCard({ feature }: { feature: Feature }) {
  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const spotlight = useMotionTemplate`radial-gradient(320px circle at ${x}px ${y}px, oklch(0 0 0 / 0.06), transparent 70%)`;

  const handleMove = (e: PointerEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set(e.clientX - rect.left);
    y.set(e.clientY - rect.top);
  };

  const Icon = feature.icon;

  return (
    <motion.article
      onPointerMove={handleMove}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      className="group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border bg-card p-8 transition-shadow hover:shadow-[0_20px_60px_-30px_oklch(0_0_0/0.3)]"
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: spotlight }}
      />
      <div className="grid size-11 place-items-center rounded-xl border bg-background shadow-xs transition-transform duration-300 group-hover:-rotate-6">
        <Icon className="size-5" />
      </div>
      <div className="relative mt-10">
        <h3 className="text-lg font-semibold tracking-tight">{feature.title}</h3>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
      </div>
    </motion.article>
  );
}
