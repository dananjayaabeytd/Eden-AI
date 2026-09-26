"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { ArrowRight } from "lucide-react";

import { ParticleField } from "@/components/effects/particle-field";
import { Container } from "@/components/layout/container";
import { NavLink } from "@/components/layout/nav-link";
import { Magnetic } from "@/components/motion/magnetic";
import { TextReveal } from "@/components/motion/text-reveal";
import { ButtonLink } from "@/components/ui/button-link";
import { PHOTOS, type Photo } from "@/content/images";
import { HERO } from "@/content/landing";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { HeroDemo } from "./hero-demo/hero-demo";

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  // Scroll-linked: the preview tilts flat and scales up as you scroll past the hero.
  const rotateX = useTransform(scrollYProgress, [0, 0.5], [18, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.94, 1]);
  const copyY = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);
  // Floating photos drift at different speeds for depth.
  const driftSlow = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const driftFast = useTransform(scrollYProgress, [0, 1], [0, -260]);

  const fadeIn = (delay: number) => ({
    initial: { opacity: 0, y: 16, filter: "blur(6px)" },
    animate: { opacity: 1, y: 0, filter: "blur(0px)" },
    transition: { duration: 0.8, delay, ease: EASE.out },
  });

  return (
    <section ref={ref} className="relative isolate overflow-hidden pt-32 pb-24 sm:pt-40">
      <div aria-hidden className="bg-grid mask-radial absolute inset-0 -z-10" />
      <div
        aria-hidden
        className="absolute top-0 left-1/2 -z-10 h-[480px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,var(--glow),transparent)] opacity-70 blur-3xl"
      />
      <ParticleField className="-z-10 [mask-image:radial-gradient(ellipse_80%_70%_at_50%_35%,black_40%,transparent_85%)]" />

      <FloatingPhoto photo={PHOTOS.santorini} drift={driftFast} rotate={-8} delay={1.1} className="top-40 left-[calc(50%-39rem)] h-52 w-36" />
      <FloatingPhoto photo={PHOTOS.dubai} drift={driftSlow} rotate={5} delay={1.3} className="top-[26rem] left-[calc(50%-36rem)] h-32 w-48" />
      <FloatingPhoto photo={PHOTOS.bangkok} drift={driftSlow} rotate={7} delay={1.2} className="top-44 right-[calc(50%-38rem)] h-32 w-48" />
      <FloatingPhoto photo={PHOTOS.cinqueTerre} drift={driftFast} rotate={-5} delay={1.4} className="top-[22rem] right-[calc(50%-39rem)] h-52 w-36" />

      <Container>
        <motion.div style={{ y: copyY, opacity: copyOpacity }} className="mx-auto max-w-3xl text-center">
          <motion.div {...fadeIn(0)}>
            <NavLink
              href={HERO.badge.href}
              className="group inline-flex items-center gap-2 rounded-full border bg-background/60 py-1 pr-3 pl-1 text-xs font-medium text-muted-foreground shadow-xs backdrop-blur transition-colors hover:text-foreground"
            >
              <span className="rounded-full bg-foreground px-2 py-0.5 text-background">{HERO.badge.label}</span>
              {HERO.badge.text}
              <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
            </NavLink>
          </motion.div>

          <TextReveal
            as="h1"
            text={HERO.title}
            delay={0.15}
            className="mt-8 text-5xl leading-[1.05] font-semibold tracking-tighter sm:text-7xl"
          />

          <motion.p {...fadeIn(0.6)} className="mx-auto mt-6 max-w-xl text-lg text-pretty text-muted-foreground">
            {HERO.subtitle}
          </motion.p>

          <motion.div {...fadeIn(0.75)} className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Magnetic>
              <ButtonLink href={HERO.primaryCta.href} size="lg" className="group h-12 rounded-full px-6 text-base">
                {HERO.primaryCta.label}
                <ArrowRight className="transition-transform group-hover:translate-x-0.5" />
              </ButtonLink>
            </Magnetic>
            <ButtonLink
              href={HERO.secondaryCta.href}
              variant="outline"
              size="lg"
              className="h-12 rounded-full px-6 text-base"
            >
              {HERO.secondaryCta.label}
            </ButtonLink>
          </motion.div>
        </motion.div>

        <div className="mt-20 [perspective:1400px]">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.9, ease: EASE.out }}
          >
            <motion.div style={{ rotateX, scale }} className="origin-top will-change-transform">
              <HeroDemo />
            </motion.div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}

type FloatingPhotoProps = {
  photo: Photo;
  drift: MotionValue<number>;
  rotate: number;
  delay: number;
  className: string;
};

/** Decorative tilted photo that bobs gently and drifts with scroll. Wide screens only. */
function FloatingPhoto({ photo, drift, rotate, delay, className }: FloatingPhotoProps) {
  return (
    <motion.div
      aria-hidden
      style={{ y: drift }}
      initial={{ opacity: 0, scale: 0.8, rotate: 0 }}
      animate={{ opacity: 1, scale: 1, rotate }}
      transition={{ duration: 1.2, delay, ease: EASE.out }}
      className={cn("absolute -z-10 hidden xl:block", className)}
    >
      <motion.div
        animate={{ y: [0, -14, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay }}
        whileHover={{ scale: 1.06, rotate: -rotate / 2 }}
        data-cursor={photo.city}
        className="pointer-events-auto relative size-full overflow-hidden rounded-2xl shadow-[0_24px_60px_-20px_oklch(0_0_0/0.45)] ring-6 ring-background"
      >
        <Image src={photo.src} alt="" fill placeholder="blur" sizes="200px" className="object-cover" />
      </motion.div>
    </motion.div>
  );
}
