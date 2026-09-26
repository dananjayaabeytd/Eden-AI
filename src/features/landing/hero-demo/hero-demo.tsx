"use client";

import { useCallback, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "motion/react";
import { ArrowUp, CheckCircle2, Link2, Loader2, RotateCcw, Search, Sparkles } from "lucide-react";

import { APP_NAME } from "@/config/site";
import { DEMO_SCENARIOS, type DemoScenario } from "@/content/demo";
import { useMediaQuery } from "@/hooks/use-media-query";
import { usePageVisible } from "@/hooks/use-page-visible";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

import { countWords, useDemoPlayback, type DemoPhase } from "./use-demo-playback";

const SIDEBAR = ["Inbox", "Agents", "Workflows", "Knowledge", "Settings"];

const STATUS: Record<DemoPhase, string> = {
  typing: "Listening…",
  thinking: "Working on it",
  answering: "Writing answer",
  done: "Done",
};

/**
 * Interactive product demo. Pick a task and watch the agent type, work through
 * steps and stream an answer. Autoplays through scenarios until the visitor
 * interacts; pauses when off-screen or in a background tab.
 */
export function HeroDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-10% 0px" });
  const pageVisible = usePageVisible();
  const reduceMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

  const [index, setIndex] = useState(0);
  const [run, setRun] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const scenario = DEMO_SCENARIOS[index];

  const choose = (i: number) => {
    setAutoplay(false);
    setIndex(i);
    setRun((r) => r + 1);
  };

  const advance = useCallback(() => {
    if (!autoplay) return;
    setIndex((i) => (i + 1) % DEMO_SCENARIOS.length);
    setRun((r) => r + 1);
  }, [autoplay]);

  return (
    <div
      ref={ref}
      role="region"
      aria-label={`Interactive ${APP_NAME} demo`}
      className="overflow-hidden rounded-2xl border bg-card text-left shadow-[0_40px_120px_-40px_oklch(0_0_0/0.35)] ring-8 ring-muted/60"
    >
      <div className="grid md:grid-cols-[200px_1fr]">
        <aside aria-hidden className="hidden border-r p-4 md:block">
          <div className="mb-4 flex items-center gap-1.5">
            {[0, 1, 2].map((i) => (
              <span key={i} className="size-3 rounded-full bg-foreground/15" />
            ))}
          </div>
          <div className="space-y-1">
            {SIDEBAR.map((item) => (
              <div key={item} className={cn("rounded-md px-3 py-2 text-sm", item === "Agents" ? "bg-muted font-medium" : "text-muted-foreground")}>
                {item}
              </div>
            ))}
          </div>
        </aside>

        <div className="min-w-0 p-4 sm:p-6">
          <DemoRun
            key={`${scenario.id}-${run}`}
            scenario={scenario}
            active={inView && pageVisible}
            reduceMotion={reduceMotion}
            announce={!autoplay}
            onFinished={advance}
            onReplay={() => choose(index)}
          />

          <div className="mt-5 flex items-center gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
            <span className="shrink-0 text-xs text-muted-foreground">Try:</span>
            {DEMO_SCENARIOS.map((s, i) => (
              <button
                key={s.id}
                type="button"
                onClick={() => choose(i)}
                aria-pressed={i === index}
                className={cn(
                  "shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                  i === index ? "border-foreground/30 bg-foreground text-background" : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                {s.chip}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

type DemoRunProps = {
  scenario: DemoScenario;
  active: boolean;
  reduceMotion: boolean;
  /** Announce the result to screen readers (only after the visitor chose a task). */
  announce: boolean;
  onFinished: () => void;
  onReplay: () => void;
};

function DemoRun({ scenario, active, reduceMotion, announce, onFinished, onReplay }: DemoRunProps) {
  const { phase, typed, stepsDone, words } = useDemoPlayback(scenario, { active, reduceMotion, onFinished });
  const totalWords = countWords(scenario.answer);
  const progress = phase === "typing" ? 0.1 : phase === "thinking" ? 0.15 + (stepsDone / scenario.steps.length) * 0.5 : 0.65 + (Math.min(words, totalWords) / totalWords) * 0.35;

  return (
    <>
      {/* Accessible summary; the animated UI below is decorative. */}
      <p className="sr-only" aria-live={announce ? "polite" : "off"}>
        {phase === "done" ? `${scenario.prompt}. ${scenario.answer.join(" ")}` : ""}
      </p>

      <div aria-hidden>
        {/* Prompt bar */}
        <div className="flex items-center gap-2 rounded-xl border bg-background px-3 py-2.5 text-sm">
          <Search className="size-4 shrink-0 text-muted-foreground" />
          <p className="min-w-0 flex-1 truncate">
            {typed === 0 ? <span className="text-muted-foreground">Ask {APP_NAME} anything…</span> : scenario.prompt.slice(0, typed)}
            {phase === "typing" && <span className="ml-px inline-block h-4 w-px translate-y-0.5 animate-pulse bg-foreground" />}
          </p>
          <span className={cn("grid size-7 shrink-0 place-items-center rounded-full transition-colors", phase === "typing" ? "bg-muted text-muted-foreground" : "bg-foreground text-background")}>
            <ArrowUp className="size-3.5" />
          </span>
        </div>

        {/* Agent */}
        <div className="mt-5 flex items-start gap-3">
          <div className="grid size-9 shrink-0 place-items-center rounded-full bg-foreground text-background">
            <Sparkles className="size-4" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-medium">Research agent</p>
              <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                {phase !== "done" && phase !== "typing" && <Loader2 className="size-3 animate-spin" />}
                {phase === "done" && <CheckCircle2 className="size-3 text-emerald-500" />}
                {STATUS[phase]}
              </p>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
              <motion.div className="h-full rounded-full bg-foreground" animate={{ width: `${progress * 100}%` }} transition={{ duration: 0.4, ease: EASE.out }} />
            </div>
          </div>
        </div>

        {/* Steps + answer (fixed min-height avoids layout shift between phases) */}
        <div className="mt-4 min-h-[232px] space-y-2">
          {scenario.steps.map((step, i) => {
            const started = phase !== "typing" && i <= stepsDone;
            const done = i < stepsDone;
            return (
              <AnimatePresence key={step}>
                {started && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.35, ease: EASE.out }}
                    className="flex items-center gap-3 rounded-lg border bg-background px-3.5 py-2.5 text-sm"
                  >
                    {done ? <CheckCircle2 className="size-4 shrink-0" /> : <span className="size-4 shrink-0 animate-spin rounded-full border-2 border-muted border-t-foreground" />}
                    <span className={cn("truncate", !done && "text-muted-foreground")}>{step}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            );
          })}

          <AnimatePresence>
            {(phase === "answering" || phase === "done") && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: EASE.out }}
                className="rounded-xl bg-muted/70 p-4 text-sm leading-relaxed"
              >
                <StreamedLines lines={scenario.answer} words={words} />
                {phase === "done" && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <Link2 className="size-3" />
                    {scenario.sources.map((source) => (
                      <span key={source} className="rounded-full border bg-background px-2 py-0.5">
                        {source}
                      </span>
                    ))}
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {phase === "done" && (
        <button type="button" onClick={onReplay} className="mt-2 inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground">
          <RotateCcw className="size-3" aria-hidden /> Replay
        </button>
      )}
    </>
  );
}

/** Reveals the first `words` words across lines, keeping each line's layout stable. */
function StreamedLines({ lines, words }: { lines: readonly string[]; words: number }) {
  const split = lines.map((line) => line.split(/\s+/));
  // Index of each line's first word within the whole answer.
  const offsets = split.map((_, i) => split.slice(0, i).reduce((sum, w) => sum + w.length, 0));

  return (
    <div className="space-y-1.5">
      {split.map((lineWords, i) => {
        const shown = Math.max(0, Math.min(lineWords.length, words - offsets[i]));
        return shown > 0 ? <p key={lines[i]}>{lineWords.slice(0, shown).join(" ")}</p> : null;
      })}
    </div>
  );
}
