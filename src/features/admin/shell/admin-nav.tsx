"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Inbox } from "lucide-react";

import { ROUTES } from "@/config/site";
import { cn } from "@/lib/utils";

/**
 * Admin sections — add entries here as the app grows. Kept in this client module
 * because icon components can't be passed from Server to Client Components.
 */
const ADMIN_NAV = [{ href: ROUTES.admin, label: "Submissions", icon: Inbox }] as const;

/** Primary admin navigation with the current section highlighted. */
export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Admin" className="flex items-center gap-1">
      {ADMIN_NAV.map(({ href, label, icon: Icon }) => {
        const active = pathname === href || pathname.startsWith(`${href}/`);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
              active ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <Icon className="size-4" aria-hidden />
            <span className="sr-only sm:not-sr-only">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
