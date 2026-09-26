import { Skeleton } from "@/components/ui/skeleton";

/** Instant loading state shaped like the dashboard, so the layout doesn't jump. */
export default function Loading() {
  return (
    <div className="space-y-8" aria-busy="true" aria-label="Loading submissions">
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        {Array.from({ length: 4 }, (_, i) => (
          <Skeleton key={i} className="h-[118px] rounded-2xl" />
        ))}
      </div>
      <Skeleton className="h-10 w-full max-w-xl rounded-full" />
      <div className="space-y-px overflow-hidden rounded-2xl border bg-card">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="flex items-center gap-3 p-4">
            <Skeleton className="size-9 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3 w-64" />
            </div>
            <Skeleton className="h-5 w-20 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
