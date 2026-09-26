"use client";

import { useEffect, type ReactNode } from "react";
import { ReactLenis, useLenis } from "lenis/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { CustomCursor } from "@/components/effects/custom-cursor";

gsap.registerPlugin(ScrollTrigger);

/**
 * Experience layer for the marketing site only (not the admin app):
 *  - Lenis smooth scrolling (auto-disabled for reduced-motion users). Anchor links
 *    land at each target's CSS `scroll-margin-top` (`scroll-mt-*`), so offsets live in markup.
 *  - Custom cursor (fine pointers only).
 */
export function MarketingProviders({ children }: { children: ReactNode }) {
  return (
    <ReactLenis root options={{ autoRaf: false, anchors: true, lerp: 0.1 }}>
      <LenisGsapSync />
      {children}
      <CustomCursor />
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
