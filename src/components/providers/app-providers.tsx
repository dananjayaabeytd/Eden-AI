"use client";

import { useEffect, type ReactNode } from "react";
import { MotionConfig } from "motion/react";
import { ReactLenis, useLenis } from "lenis/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Global client providers:
 *  - Lenis smooth scrolling (auto-disabled for reduced-motion users).
 *  - MotionConfig that honours the user's reduced-motion preference.
 */
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ReactLenis root options={{ autoRaf: false, anchors: { offset: -80 }, lerp: 0.1 }}>
      <LenisGsapSync />
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </ReactLenis>
  );
}

/** Drives Lenis from GSAP's ticker so ScrollTrigger and smooth scroll share one frame loop. */
function LenisGsapSync() {
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;

    const update = (time: number) => lenis.raf(time * 1000);
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.off("scroll", ScrollTrigger.update);
      gsap.ticker.remove(update);
    };
  }, [lenis]);

  return null;
}
