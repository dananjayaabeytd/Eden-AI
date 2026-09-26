import Link from "next/link";
import { ChevronRight, Inbox, SearchX } from "lucide-react";

import { ROUTES } from "@/config/site";
import { formatDateTime, formatRelative, initials } from "@/lib/format";

import { topicLabel, type Submission } from "../model";
import { StatusBadge } from "./status-badge";

type SubmissionsTableProps = {
  rows: Submission[];
  /** Whether any filter/search is active — changes the empty state copy. */
  filtered: boolean;
};

const detailHref = (id: string) => `${ROUTES.admin}/submissions/${id}`;

/** Responsive list: a table on desktop, stacked cards on mobile. Each row links to its detail page. */
export function SubmissionsTable({ rows, filtered }: SubmissionsTableProps) {
  if (rows.length === 0) return <EmptyState filtered={filtered} />;

  return (
    <div className="overflow-hidden rounded-2xl border bg-card">
      {/* Desktop */}
      <table className="hidden w-full text-sm md:table">
        <caption className="sr-only">Contact submissions</caption>
        <thead className="border-b bg-muted/60 text-left text-xs text-muted-foreground">
          <tr>
            <th scope="col" className="px-5 py-3 font-medium">From</th>
            <th scope="col" className="px-5 py-3 font-medium">Topic</th>
            <th scope="col" className="hidden px-5 py-3 font-medium lg:table-cell">Message</th>
            <th scope="col" className="px-5 py-3 font-medium">Status</th>
            <th scope="col" className="px-5 py-3 text-right font-medium">Received</th>
            <th scope="col" className="w-10"><span className="sr-only">Open</span></th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {rows.map((row) => (
            <tr key={row.id} className="group relative transition-colors hover:bg-muted/50 focus-within:bg-muted/50">
              <td className="px-5 py-4">
                <div className="flex items-center gap-3">
                  <Avatar name={`${row.first_name} ${row.last_name}`} />
                  <div className="min-w-0">
                    {/* The stretched link makes the whole row clickable while keeping one tab stop per row. */}
                    <Link href={detailHref(row.id)} className="font-medium outline-none after:absolute after:inset-0 focus-visible:underline">
                      {row.first_name} {row.last_name}
                    </Link>
                    <p className="truncate text-xs text-muted-foreground">
                      {row.email}
                      {row.company && ` · ${row.company}`}
                    </p>
                  </div>
                </div>
              </td>
              <td className="px-5 py-4 whitespace-nowrap text-muted-foreground">{topicLabel(row.topic)}</td>
              <td className="hidden max-w-xs px-5 py-4 lg:table-cell">
                <p className="truncate text-muted-foreground">{row.message}</p>
              </td>
              <td className="px-5 py-4">
                <StatusBadge status={row.status} />
              </td>
              <td className="px-5 py-4 text-right whitespace-nowrap text-muted-foreground">
                <time dateTime={row.created_at} title={formatDateTime(row.created_at)}>
                  {formatRelative(row.created_at)}
                </time>
              </td>
              <td className="pr-4">
                <ChevronRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" aria-hidden />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Mobile */}
      <ul className="divide-y md:hidden">
        {rows.map((row) => (
          <li key={row.id}>
            <Link href={detailHref(row.id)} className="flex gap-3 p-4 transition-colors hover:bg-muted/50">
              <Avatar name={`${row.first_name} ${row.last_name}`} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate font-medium">
                    {row.first_name} {row.last_name}
                  </p>
                  <time dateTime={row.created_at} className="shrink-0 text-xs text-muted-foreground">
                    {formatRelative(row.created_at)}
                  </time>
                </div>
                <p className="truncate text-xs text-muted-foreground">{topicLabel(row.topic)}</p>
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{row.message}</p>
                <StatusBadge status={row.status} className="mt-2" />
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Avatar({ name }: { name: string }) {
  return (
    <span aria-hidden className="grid size-9 shrink-0 place-items-center rounded-full bg-muted text-xs font-semibold">
      {initials(name)}
    </span>
  );
}

function EmptyState({ filtered }: { filtered: boolean }) {
  const Icon = filtered ? SearchX : Inbox;
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed bg-card px-6 py-20 text-center">
      <div className="grid size-12 place-items-center rounded-full bg-muted">
        <Icon className="size-5 text-muted-foreground" aria-hidden />
      </div>
      <h2 className="mt-4 font-semibold">{filtered ? "No matching submissions" : "No submissions yet"}</h2>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        {filtered
          ? "Try a different search or clear the filters."
          : "When someone sends a message through the contact form, it will appear here."}
      </p>
      {filtered && (
        <Link href={ROUTES.admin} className="mt-6 text-sm font-medium underline underline-offset-4">
          Clear filters
        </Link>
      )}
    </div>
  );
}
