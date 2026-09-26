"use client";

import { motion } from "motion/react";

import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

type TextRevealProps = {
  text: string;
  className?: string;
  delay?: number;
  as?: "h1" | "h2" | "p";
};

/**
 * Splits text into words that rise and un-blur in sequence.
 * The full string stays available to screen readers via `aria-label`.
 */
export function TextReveal({ text, className, delay = 0, as = "h2" }: TextRevealProps) {
  const Tag = motion[as];
  const words = text.split(" ");

  return (
    <Tag
      aria-label={text}
      className={cn("text-balance", className)}
      initial="hidden"
      animate="visible"
      transition={{ staggerChildren: 0.06, delayChildren: delay }}
    >
      {words.map((word, i) => (
        <span key={`${word}-${i}`} aria-hidden className="inline-block overflow-hidden pb-[0.1em] align-bottom">
          <motion.span
            className="inline-block"
            variants={{
              hidden: { y: "100%", opacity: 0, filter: "blur(8px)" },
              visible: {
                y: 0,
                opacity: 1,
                filter: "blur(0px)",
                transition: { duration: 0.9, ease: EASE.out },
              },
            }}
          >
            {word}
          </motion.span>
          {i < words.length - 1 && " "}
        </span>
      ))}
    </Tag>
  );
}
