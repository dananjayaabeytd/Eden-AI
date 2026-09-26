"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/layout/section-heading";
import { STEPS } from "@/content/landing";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * GSAP ScrollTrigger showcase: on desktop the section pins while a progress
 * rail fills and each step lights up in turn. On mobile / reduced motion it
 * falls back to a plain, fully readable list.
 */
export function HowItWorks() {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        const steps = gsap.utils.toArray<HTMLElement>("[data-step]");
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: "[data-pin]",
            start: "top top+=64",
            end: `+=${steps.length * 60}%`,
            pin: true,
            scrub: 0.6,
          },
        });

        tl.fromTo("[data-rail]", { scaleY: 0 }, { scaleY: 1, ease: "none", duration: steps.length });

        steps.forEach((step, i) => {
          gsap.set(step, { opacity: 0.25 });
          tl.to(step, { opacity: 1, duration: 0.4 }, i).to(
            step.querySelector("[data-dot]"),
            { backgroundColor: "var(--foreground)", color: "var(--background)", scale: 1.1, duration: 0.3 },
            i,
          );
        });
      });

      return () => mm.revert();
    },
    { scope },
  );

  return (
    <section id="how-it-works" className="scroll-mt-24 bg-muted/40 py-24 sm:py-32">
      <div ref={scope}>
        <div data-pin className="md:flex md:min-h-[calc(100vh-64px)] md:items-center">
          <Container className="grid gap-16 md:grid-cols-2 md:items-center">
            <SectionHeading
              eyebrow="How it works"
              title="From question to done in three steps."
              description="No prompt engineering. No glue code. Just describe what you need."
              className="md:mx-0 md:text-left"
            />

            <div className="relative pl-14">
              <div aria-hidden className="absolute top-2 bottom-2 left-[19px] w-px bg-border">
                <div data-rail className="h-full w-full origin-top bg-foreground" />
              </div>
              <ol className="space-y-10">
              {STEPS.map((step, i) => (
                <li key={step.title} data-step className="relative">
                  <span
                    data-dot
                    className="absolute top-0 -left-14 grid size-10 place-items-center rounded-full border bg-background font-mono text-sm"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="text-xl font-semibold tracking-tight">{step.title}</h3>
                  <p className="mt-2 max-w-sm text-muted-foreground">{step.description}</p>
                </li>
              ))}
              </ol>
            </div>
          </Container>
        </div>
      </div>
    </section>
  );
}
