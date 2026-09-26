"use client";

import { useOptimistic, useState, useTransition } from "react";
import { Check, Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

import { updateSubmissionStatus } from "../actions";
import { SUBMISSION_STATUSES, type SubmissionStatus } from "../model";
import { STATUS_DOT } from "./status-badge";

/**
 * Segmented status control. Updates optimistically (instant feedback) and
 * rolls back with an error message if the server rejects the change.
 */
export function StatusSelect({ id, status }: { id: string; status: SubmissionStatus }) {
  const [optimistic, setOptimistic] = useOptimistic(status);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const choose = (next: SubmissionStatus) => {
    if (next === optimistic) return;
    setError(null);
    startTransition(async () => {
      setOptimistic(next);
      const result = await updateSubmissionStatus(id, next);
      if (!result.ok) setError(result.message);
    });
  };

  return (
    <div>
      <div role="group" aria-label="Status" className="grid grid-cols-2 gap-2">
        {SUBMISSION_STATUSES.map((s) => {
          const checked = optimistic === s.value;
          return (
            <button
              key={s.value}
              type="button"
              aria-pressed={checked}
              onClick={() => choose(s.value)}
              className={cn(
                "flex items-center gap-2 rounded-xl border px-3 py-2.5 text-left text-sm font-medium transition-colors",
                checked ? "border-foreground/40 bg-muted" : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
              )}
            >
              <span aria-hidden className={cn("size-2 rounded-full", STATUS_DOT[s.value])} />
              <span className="flex-1">{s.label}</span>
              {checked && (pending ? <Loader2 className="size-3.5 animate-spin" aria-hidden /> : <Check className="size-3.5" aria-hidden />)}
            </button>
          );
        })}
      </div>
      <p role="status" aria-live="polite" className="mt-2 min-h-5 text-xs">
        {error ? <span className="text-destructive">{error}</span> : pending ? <span className="text-muted-foreground">Saving…</span> : null}
      </p>
    </div>
  );
}
