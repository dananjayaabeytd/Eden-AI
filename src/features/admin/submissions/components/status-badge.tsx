import { cn } from "@/lib/utils";

import { statusLabel, type SubmissionStatus } from "../model";

/** Colour + label (never colour alone) so status is clear to everyone. */
export const STATUS_TONE: Record<SubmissionStatus, string> = {
  new: "bg-sky-500/10 text-sky-700 ring-sky-600/20 dark:text-sky-300",
  in_progress: "bg-amber-500/10 text-amber-700 ring-amber-600/20 dark:text-amber-300",
  resolved: "bg-emerald-500/10 text-emerald-700 ring-emerald-600/20 dark:text-emerald-300",
  spam: "bg-muted text-muted-foreground ring-border",
};

export const STATUS_DOT: Record<SubmissionStatus, string> = {
  new: "bg-sky-500",
  in_progress: "bg-amber-500",
  resolved: "bg-emerald-500",
  spam: "bg-muted-foreground/50",
};

export function StatusBadge({ status, className }: { status: SubmissionStatus; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap ring-1 ring-inset",
        STATUS_TONE[status],
        className,
      )}
    >
      <span aria-hidden className={cn("size-1.5 rounded-full", STATUS_DOT[status])} />
      {statusLabel(status)}
    </span>
  );
}
