import Link from "next/link";

import { APP_NAME } from "@/config/site";
import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={cn("size-6", className)}>
      <rect width="24" height="24" rx="7" className="fill-foreground" />
      <path d="M7 8h10M12 8v9" className="stroke-background" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label={`${APP_NAME} home`}
      className={cn("inline-flex items-center gap-2 rounded-md font-semibold tracking-tight", className)}
    >
      <LogoMark />
      <span>{APP_NAME}</span>
    </Link>
  );
}
