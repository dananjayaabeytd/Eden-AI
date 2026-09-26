import type { CSSProperties, ReactNode } from "react";

import { cn } from "@/lib/utils";

type MarqueeProps = {
  children: ReactNode;
  className?: string;
  /** Seconds per loop. */
  duration?: number;
  reverse?: boolean;
};

/**
 * Infinite horizontal loop in pure CSS (no JS on the main thread).
 * Content is duplicated once; the copy is hidden from assistive tech.
 * Pauses on hover and respects reduced motion (see globals.css).
 */
export function Marquee({ children, className, duration = 40, reverse = false }: MarqueeProps) {
  const style = { "--marquee-duration": `${duration}s`, "--marquee-gap": "3rem" } as CSSProperties;

  return (
    <div className={cn("group mask-fade-x flex overflow-hidden", className)} style={style}>
      <div
        className={cn(
          "animate-marquee flex w-max shrink-0 gap-12 group-hover:[animation-play-state:paused]",
          reverse && "[animation-direction:reverse]",
        )}
      >
        {children}
        <div aria-hidden className="flex shrink-0 gap-12">
          {children}
        </div>
      </div>
    </div>
  );
}
