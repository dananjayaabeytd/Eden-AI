"use client";

import { useEffect, useState } from "react";

import type { DemoScenario } from "@/content/demo";

export type DemoPhase = "typing" | "thinking" | "answering" | "done";

export type DemoState = {
  phase: DemoPhase;
  /** Characters of the prompt typed so far. */
  typed: number;
  /** Steps completed so far. */
  stepsDone: number;
  /** Words of the answer revealed so far. */
  words: number;
};

const TIMING = {
  typeChar: 26,
  beforeThinking: 380,
  step: 720,
  beforeAnswer: 260,
  word: 42,
  holdWhenDone: 4200,
} as const;

const WORDS_PER_TICK = 2;

export const countWords = (lines: readonly string[]) => lines.join(" ").split(/\s+/).length;

const initialState = (): DemoState => ({ phase: "typing", typed: 0, stepsDone: 0, words: 0 });

const finalState = (s: DemoScenario): DemoState => ({
  phase: "done",
  typed: s.prompt.length,
  stepsDone: s.steps.length,
  words: countWords(s.answer),
});

/** Pure transition: the next state and how long to wait before showing it. */
function next(state: DemoState, s: DemoScenario): { state: DemoState; delay: number } | null {
  switch (state.phase) {
    case "typing":
      return state.typed < s.prompt.length
        ? { state: { ...state, typed: state.typed + 1 }, delay: TIMING.typeChar + Math.random() * 30 }
        : { state: { ...state, phase: "thinking" }, delay: TIMING.beforeThinking };
    case "thinking":
      return state.stepsDone < s.steps.length
        ? { state: { ...state, stepsDone: state.stepsDone + 1 }, delay: TIMING.step }
        : { state: { ...state, phase: "answering" }, delay: TIMING.beforeAnswer };
    case "answering":
      return state.words < countWords(s.answer)
        ? { state: { ...state, words: state.words + WORDS_PER_TICK }, delay: TIMING.word }
        : { state: { ...state, phase: "done" }, delay: 0 };
    case "done":
      return null;
  }
}

/**
 * Plays a scenario as a small state machine. One timer is scheduled per state,
 * so pausing (`active = false`) and resuming are trivial and leak-free.
 * Remount (change `key`) to restart. With reduced motion, jumps to the end.
 */
export function useDemoPlayback(scenario: DemoScenario, { active, reduceMotion, onFinished }: { active: boolean; reduceMotion: boolean; onFinished?: () => void }) {
  const [state, setState] = useState<DemoState>(() => (reduceMotion ? finalState(scenario) : initialState()));

  useEffect(() => {
    // Reduced motion (known only after hydration): show the finished result, never auto-advance.
    if (reduceMotion) {
      if (state.phase === "done") return;
      const timer = setTimeout(() => setState(finalState(scenario)), 0);
      return () => clearTimeout(timer);
    }
    if (!active) return;
    const step = next(state, scenario);
    const timer = step
      ? setTimeout(() => setState(step.state), step.delay)
      : setTimeout(() => onFinished?.(), TIMING.holdWhenDone);
    return () => clearTimeout(timer);
  }, [state, scenario, active, reduceMotion, onFinished]);

  return state;
}
