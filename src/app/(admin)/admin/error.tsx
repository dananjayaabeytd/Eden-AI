"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCw } from "lucide-react";

import { Button } from "@/components/ui/button";

/** Friendly error boundary for the admin area with a one-click retry. */
export default function AdminError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("[admin]", error);
  }, [error]);

  return (
    <div role="alert" className="flex flex-col items-center rounded-2xl border bg-card px-6 py-20 text-center">
      <div className="grid size-12 place-items-center rounded-full bg-destructive/10">
        <AlertTriangle className="size-5 text-destructive" aria-hidden />
      </div>
      <h1 className="mt-4 font-semibold">Something went wrong</h1>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        We couldn&apos;t load this page. It&apos;s usually temporary — try again in a moment.
      </p>
      {error.digest && <p className="mt-2 font-mono text-xs text-muted-foreground">Ref: {error.digest}</p>}
      <Button onClick={reset} variant="outline" size="lg" className="mt-6 h-10 rounded-full px-5">
        <RotateCw /> Try again
      </Button>
    </div>
  );
}
