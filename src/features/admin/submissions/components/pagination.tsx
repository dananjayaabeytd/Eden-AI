import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { PAGE_SIZE, type SubmissionFilters } from "../model";

type PaginationProps = {
  filters: SubmissionFilters;
  total: number;
  pageCount: number;
  basePath: string;
};

/** Link-based pagination: works without JavaScript and keeps pages shareable. */
export function Pagination({ filters, total, pageCount, basePath }: PaginationProps) {
  if (total === 0) return null;

  const href = (page: number) => {
    const params = new URLSearchParams();
    if (filters.status !== "all") params.set("status", filters.status);
    if (filters.topic !== "all") params.set("topic", filters.topic);
    if (filters.q) params.set("q", filters.q);
    if (page > 1) params.set("page", String(page));
    const qs = params.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  };

  const from = (filters.page - 1) * PAGE_SIZE + 1;
  const to = Math.min(filters.page * PAGE_SIZE, total);
  const hasPrev = filters.page > 1;
  const hasNext = filters.page < pageCount;

  const button = "inline-flex h-9 items-center gap-1 rounded-full border bg-background px-3 text-sm font-medium transition-colors";

  return (
    <nav aria-label="Pagination" className="flex items-center justify-between gap-4">
      <p className="text-sm text-muted-foreground">
        Showing <span className="font-medium text-foreground tabular-nums">{from}–{to}</span> of{" "}
        <span className="font-medium text-foreground tabular-nums">{total}</span>
      </p>
      <div className="flex gap-2">
        {hasPrev ? (
          <Link href={href(filters.page - 1)} rel="prev" className={`${button} hover:bg-muted`}>
            <ChevronLeft className="size-4" aria-hidden /> Previous
          </Link>
        ) : (
          <span aria-disabled className={`${button} cursor-not-allowed opacity-40`}>
            <ChevronLeft className="size-4" aria-hidden /> Previous
          </span>
        )}
        {hasNext ? (
          <Link href={href(filters.page + 1)} rel="next" className={`${button} hover:bg-muted`}>
            Next <ChevronRight className="size-4" aria-hidden />
          </Link>
        ) : (
          <span aria-disabled className={`${button} cursor-not-allowed opacity-40`}>
            Next <ChevronRight className="size-4" aria-hidden />
          </span>
        )}
      </div>
    </nav>
  );
}
