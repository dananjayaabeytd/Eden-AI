import { ArrowRight } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Magnetic } from "@/components/motion/magnetic";
import { Reveal } from "@/components/motion/reveal";
import { ButtonLink } from "@/components/ui/button-link";
import { CTA } from "@/content/landing";

export function Cta() {
  const Icon = CTA.icon;

  return (
    <section className="py-24 sm:py-32">
      <Container>
        <Reveal className="relative isolate overflow-hidden rounded-3xl bg-foreground px-6 py-20 text-center text-background sm:px-16">
          <div aria-hidden className="bg-grid mask-radial absolute inset-0 -z-10 invert" />
          <Icon className="mx-auto size-8 opacity-80" aria-hidden />
          <h2 className="mx-auto mt-6 max-w-2xl text-4xl font-semibold tracking-tighter text-balance sm:text-6xl">
            {CTA.title}
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-background/70">{CTA.subtitle}</p>
          <div className="mt-10 flex justify-center">
            <Magnetic>
              <ButtonLink
                href="#pricing"
                size="lg"
                className="group h-12 rounded-full bg-background px-6 text-base text-foreground hover:bg-background/90"
              >
                Get started — it&apos;s free
                <ArrowRight className="transition-transform group-hover:translate-x-0.5" />
              </ButtonLink>
            </Magnetic>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
