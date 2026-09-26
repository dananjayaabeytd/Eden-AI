"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "motion/react";

import { useTheme } from "@/components/theme/theme-provider";
import { useMediaQuery } from "@/hooks/use-media-query";

const INTERACTIVE = "a, button, [role='button'], label, select, summary, [data-cursor]";
const TEXT_INPUT = "input:not([type='checkbox']):not([type='radio']), textarea, [contenteditable='true']";

type CursorState = { variant: "default" | "hover" | "text" | "label"; label?: string };

/**
 * Custom cursor: a precise dot plus a trailing ring that grows over interactive
 * elements and can show a label (`data-cursor="Label"`). Only enabled for fine
 * pointers without a reduced-motion preference; touch devices keep the native UI.
 */
export function CustomCursor() {
  const finePointer = useMediaQuery("(pointer: fine) and (hover: hover)");
  const reduceMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const enabled = finePointer && !reduceMotion;

  return enabled ? <Cursor /> : null;
}

function Cursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 500, damping: 40, mass: 0.5 });
  const ringY = useSpring(y, { stiffness: 500, damping: 40, mass: 0.5 });

  const [state, setState] = useState<CursorState>({ variant: "default" });
  const [visible, setVisible] = useState(false);
  const [pressed, setPressed] = useState(false);

  useEffect(() => {
    document.documentElement.classList.add("has-custom-cursor");

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
    };
    const onOver = (e: PointerEvent) => {
      const target = e.target as Element | null;
      if (!target?.closest) return;
      if (target.closest(TEXT_INPUT)) return setState({ variant: "text" });
      const labelled = target.closest<HTMLElement>("[data-cursor]");
      if (labelled?.dataset.cursor) return setState({ variant: "label", label: labelled.dataset.cursor });
      if (target.closest(INTERACTIVE)) return setState({ variant: "hover" });
      setState({ variant: "default" });
    };
    const onLeave = () => setVisible(false);
    const onDown = () => setPressed(true);
    const onUp = () => setPressed(false);

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);

    return () => {
      document.documentElement.classList.remove("has-custom-cursor");
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
    };
  }, [x, y]);

  const isLabel = state.variant === "label";
  const dark = useTheme().resolvedTheme === "dark";
  // Two-tone styling (dark ink + white halo) keeps the cursor visible on white, grey,
  // dark and photographic backgrounds alike — no reliance on blend modes.
  const INK = dark ? "rgb(235 235 235 / 0.95)" : "rgb(51 51 51 / 0.9)";
  const HALO_COLOR = dark ? "rgb(0 0 0 / 0.7)" : "rgb(255 255 255 / 0.85)";
  const HALO = `0 0 0 1px ${HALO_COLOR}, inset 0 0 0 1px ${HALO_COLOR}`;
  const ring = {
    default: { width: 36, height: 36, backgroundColor: "rgb(128 128 128 / 0)", borderColor: INK, borderWidth: 1.5, boxShadow: HALO },
    hover: { width: 60, height: 60, backgroundColor: dark ? "rgb(235 235 235 / 0.12)" : "rgb(51 51 51 / 0.12)", borderColor: INK, borderWidth: 1.5, boxShadow: HALO },
    text: { width: 3, height: 26, backgroundColor: INK, borderColor: INK, borderWidth: 0, boxShadow: `0 0 0 1px ${HALO_COLOR}` },
    label: {
      width: 88,
      height: 88,
      backgroundColor: "rgb(255 255 255 / 1)",
      borderColor: "rgb(0 0 0 / 0.08)",
      borderWidth: 1,
      boxShadow: "0 12px 32px -10px rgb(0 0 0 / 0.45)",
    },
  }[state.variant];

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[9999]">
      <motion.div
        className="absolute top-0 left-0 grid -translate-x-1/2 -translate-y-1/2 place-items-center"
        style={{ x: ringX, y: ringY, borderStyle: "solid" }}
        animate={{ ...ring, opacity: visible ? 1 : 0, scale: pressed ? 0.85 : 1, borderRadius: state.variant === "text" ? 2 : 999 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
      >
        <AnimatePresence>
          {isLabel && (
            <motion.span
              key={state.label}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              className="px-2 text-center text-[11px] leading-tight font-semibold tracking-wide text-neutral-800 uppercase"
            >
              {state.label}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
      <motion.div
        className="absolute top-0 left-0 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ x, y, backgroundColor: INK, boxShadow: `0 0 0 1.5px ${HALO_COLOR}` }}
        animate={{ opacity: visible && (state.variant === "default" || state.variant === "hover") ? 1 : 0 }}
        transition={{ duration: 0.15 }}
      />
    </div>
  );
}
