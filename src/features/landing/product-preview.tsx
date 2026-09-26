"use client";

import { motion } from "motion/react";
import { CheckCircle2, FileText, Search, Sparkles } from "lucide-react";

import { APP_NAME } from "@/config/site";

const TASKS = [
  { label: "Summarised 42 customer calls", done: true },
  { label: "Drafted Q3 roadmap from Linear", done: true },
  { label: "Reviewing PR #1284 for regressions", done: false },
] as const;

/** Illustrative app window rendered in pure HTML/CSS — crisp at any size, no images. */
export function ProductPreview() {
  return (
    <div
      role="img"
      aria-label={`${APP_NAME} workspace preview showing an AI agent completing tasks`}
      className="overflow-hidden rounded-2xl border bg-card shadow-[0_40px_120px_-40px_oklch(0_0_0/0.35)] ring-8 ring-muted/60"
    >
      {/* Window chrome */}
      <div className="flex items-center gap-2 border-b bg-muted/40 px-4 py-3">
        <span className="size-3 rounded-full bg-foreground/15" />
        <span className="size-3 rounded-full bg-foreground/15" />
        <span className="size-3 rounded-full bg-foreground/15" />
        <div className="mx-auto flex w-full max-w-sm items-center gap-2 rounded-md border bg-background px-3 py-1 text-xs text-muted-foreground">
          <Search className="size-3" /> Ask {APP_NAME} anything…
        </div>
      </div>

      <div className="grid md:grid-cols-[220px_1fr]">
        {/* Sidebar */}
        <aside className="hidden space-y-1 border-r p-4 md:block">
          {["Inbox", "Agents", "Workflows", "Knowledge", "Settings"].map((item, i) => (
            <div
              key={item}
              className={`rounded-md px-3 py-2 text-sm ${i === 1 ? "bg-muted font-medium" : "text-muted-foreground"}`}
            >
              {item}
            </div>
          ))}
        </aside>

        {/* Main */}
        <div className="space-y-6 p-6 sm:p-8">
          <div className="flex items-start gap-3">
            <div className="grid size-9 shrink-0 place-items-center rounded-full bg-foreground text-background">
              <Sparkles className="size-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium">Research agent</p>
              <p className="text-sm text-muted-foreground">Working through your morning queue</p>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
                <motion.div
                  className="h-full rounded-full bg-foreground"
                  initial={{ width: "8%" }}
                  animate={{ width: ["8%", "72%", "68%", "86%"] }}
                  transition={{ duration: 6, delay: 1.6, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }}
                />
              </div>
            </div>
          </div>

          <ul className="space-y-2">
            {TASKS.map((task, i) => (
              <motion.li
                key={task.label}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.6 + i * 0.25, duration: 0.5 }}
                className="flex items-center gap-3 rounded-lg border bg-background px-4 py-3 text-sm"
              >
                {task.done ? (
                  <CheckCircle2 className="size-4 text-foreground" />
                ) : (
                  <span className="size-4 animate-spin rounded-full border-2 border-muted border-t-foreground" />
                )}
                <span className={task.done ? "" : "text-muted-foreground"}>{task.label}</span>
              </motion.li>
            ))}
          </ul>

          <div className="grid gap-3 sm:grid-cols-3">
            {["Brief.md", "Roadmap.pdf", "Notes.txt"].map((file) => (
              <div key={file} className="flex items-center gap-2 rounded-lg bg-muted/60 px-3 py-2 text-xs text-muted-foreground">
                <FileText className="size-3.5" /> {file}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
