"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { motion } from "motion/react";
import { Loader2, Search, X } from "lucide-react";

import { Input } from "@/components/ui/input";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { CONTACT_TOPICS } from "@/features/contact/schema";
import { cn } from "@/lib/utils";

import { SUBMISSION_STATUSES, type SubmissionFilters, type SubmissionStatus } from "../model";

type ToolbarProps = {
  filters: SubmissionFilters;
  counts: Record<SubmissionStatus, number> & { total: number };
};

const SEARCH_DEBOUNCE_MS = 300;

/** Status tabs, topic filter and search — all synced to the URL. */
export function SubmissionsToolbar({ filters, counts }: ToolbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();
  const [query, setQuery] = useState(filters.q);
  const lastPushed = useRef(filters.q);

  const update = (changes: Partial<Record<keyof SubmissionFilters, string>>) => {
    const params = new URLSearchParams(searchParams);
    for (const [key, value] of Object.entries(changes)) {
      if (!value || value === "all") params.delete(key);
      else params.set(key, value);
    }
    params.delete("page"); // Any filter change starts again from page 1.
    const qs = params.toString();
    startTransition(() => router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false }));
  };

  // Debounced search: update the URL shortly after the user stops typing.
  useEffect(() => {
    if (query.trim() === lastPushed.current) return;
    const timer = setTimeout(() => {
      lastPushed.current = query.trim();
      update({ q: query.trim() });
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- `update` is recreated each render; only the query should retrigger.
  }, [query]);

  const tabs = [{ value: "all", label: "All", count: counts.total }, ...SUBMISSION_STATUSES.map((s) => ({ ...s, count: counts[s.value] }))];

  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div role="group" aria-label="Filter by status" className="-mx-1 flex gap-1 overflow-x-auto px-1 pb-1 [scrollbar-width:none] lg:pb-0">
        {tabs.map((tab) => {
          const active = filters.status === tab.value;
          return (
            <button
              key={tab.value}
              type="button"
              aria-pressed={active}
              onClick={() => update({ status: tab.value })}
              className={cn(
                "relative flex shrink-0 items-center gap-2 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
                active ? "text-background" : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              {active && (
                <motion.span
                  layoutId="status-tab"
                  className="absolute inset-0 rounded-full bg-foreground"
                  transition={{ type: "spring", stiffness: 400, damping: 34 }}
                />
              )}
              <span className="relative">{tab.label}</span>
              <span
                className={cn(
                  "relative rounded-full px-1.5 text-xs tabular-nums",
                  active ? "bg-background/20" : "bg-muted text-muted-foreground",
                )}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <NativeSelect
          aria-label="Filter by topic"
          value={filters.topic}
          onChange={(e) => update({ topic: e.target.value })}
          className="w-full sm:w-44 [&_select]:h-10 [&_select]:bg-background"
        >
          <NativeSelectOption value="all">All topics</NativeSelectOption>
          {CONTACT_TOPICS.map((t) => (
            <NativeSelectOption key={t.value} value={t.value}>
              {t.label}
            </NativeSelectOption>
          ))}
        </NativeSelect>

        <div className="relative sm:w-72">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <Input
            type="search"
            aria-label="Search by name, email or company"
            placeholder="Search name, email, company…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-10 bg-background pr-9 pl-9 [&::-webkit-search-cancel-button]:hidden"
          />
          <span className="absolute top-1/2 right-2.5 -translate-y-1/2">
            {pending ? (
              <Loader2 className="size-4 animate-spin text-muted-foreground" aria-label="Loading results" />
            ) : (
              query && (
                <button type="button" onClick={() => setQuery("")} aria-label="Clear search" className="grid text-muted-foreground hover:text-foreground">
                  <X className="size-4" />
                </button>
              )
            )}
          </span>
        </div>
      </div>
    </div>
  );
}
