import { ArrowRight } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Magnetic } from "@/components/motion/magnetic";
import { ParallaxImage } from "@/components/motion/parallax-image";
import { Reveal } from "@/components/motion/reveal";
import { ButtonLink } from "@/components/ui/button-link";
import { PHOTOS } from "@/content/images";
import { CTA } from "@/content/landing";

export function Cta() {
  const Icon = CTA.icon;

  return (
    <section className="py-24 sm:py-32">
      <Container>
        <Reveal className="relative isolate overflow-hidden rounded-3xl bg-foreground px-6 py-24 text-center text-background sm:px-16 sm:py-28">
          <ParallaxImage photo={PHOTOS.newYork} sizes="(min-width: 1152px) 1152px, 100vw" className="absolute inset-0 -z-20" />
          {/* Scrim keeps the copy legible over any photo. */}
          <div
            aria-hidden
            className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_55%_at_50%_50%,rgb(0_0_0/0.5),rgb(0_0_0/0.12))]"
          />
          <Icon className="mx-auto size-8 opacity-80" aria-hidden />
          <h2 className="mx-auto mt-6 max-w-2xl text-4xl font-semibold tracking-tighter text-balance [text-shadow:0_2px_24px_rgb(0_0_0/0.35)] sm:text-6xl">
            {CTA.title}
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-white/90 [text-shadow:0_1px_12px_rgb(0_0_0/0.5)]">{CTA.subtitle}</p>
          <div className="mt-10 flex justify-center">
            <Magnetic>
              <ButtonLink
                href="/#pricing"
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
