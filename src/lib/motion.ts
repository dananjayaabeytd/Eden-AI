import type { Transition, Variants } from "motion/react";

/** Shared easing curves so every animation feels like part of one system. */
export const EASE = {
  /** Smooth, confident deceleration — default for entrances. */
  out: [0.22, 1, 0.36, 1],
  /** Symmetric ease for state changes. */
  inOut: [0.65, 0, 0.35, 1],
} as const;

export const DURATION = {
  fast: 0.2,
  base: 0.5,
  slow: 0.8,
} as const;

export const SPRING: Transition = {
  type: "spring",
  stiffness: 380,
  damping: 30,
  mass: 0.8,
};

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: DURATION.slow, ease: EASE.out },
  },
};

export const staggerContainer = (stagger = 0.08, delayChildren = 0): Variants => ({
  hidden: {},
  visible: { transition: { staggerChildren: stagger, delayChildren } },
});
