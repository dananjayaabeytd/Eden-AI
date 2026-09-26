import { CheckCircle2, Clock, Inbox, TrendingUp } from "lucide-react";

import type { SubmissionStats } from "../queries";

export function StatsCards({ stats }: { stats: SubmissionStats }) {
  const openCount = stats.new + stats.in_progress;
  const resolvedRate = stats.total ? Math.round((stats.resolved / stats.total) * 100) : 0;

  const cards = [
    { label: "Needs a reply", value: stats.new, hint: "New enquiries", icon: Inbox },
    { label: "Open", value: openCount, hint: `${stats.in_progress} in progress`, icon: Clock },
    { label: "Resolved", value: stats.resolved, hint: `${resolvedRate}% of all enquiries`, icon: CheckCircle2 },
    { label: "Last 7 days", value: stats.last7Days, hint: `${stats.total} all time`, icon: TrendingUp },
  ];

  return (
    <dl className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
      {cards.map(({ label, value, hint, icon: Icon }) => (
        <div key={label} className="rounded-2xl border bg-card p-5">
          <div className="flex items-center justify-between">
            <dt className="text-sm text-muted-foreground">{label}</dt>
            <Icon className="size-4 text-muted-foreground" aria-hidden />
          </div>
          <dd className="mt-3 text-3xl font-semibold tracking-tight tabular-nums">{value.toLocaleString()}</dd>
          <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
        </div>
      ))}
    </dl>
  );
}
