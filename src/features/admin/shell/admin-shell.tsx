import type { ReactNode } from "react";
import Link from "next/link";
import { ExternalLink, LogOut } from "lucide-react";

import { LogoMark } from "@/components/brand/logo";
import { Container } from "@/components/layout/container";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Button } from "@/components/ui/button";
import { APP_NAME, ROUTES } from "@/config/site";
import { signOut } from "@/features/auth/actions";
import { initials } from "@/lib/format";
import type { AdminSession } from "@/server/auth/session";

import { AdminNav } from "./admin-nav";

export function AdminShell({ session, children }: { session: AdminSession; children: ReactNode }) {
  return (
    <div className="flex min-h-svh flex-1 flex-col bg-muted/40">
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-xl">
        <Container className="flex h-14 items-center gap-3 sm:gap-6">
          <Link href={ROUTES.admin} className="flex items-center gap-2 font-semibold tracking-tight">
            <LogoMark />
            <span className="hidden sm:inline">{APP_NAME}</span>
            <span className="hidden rounded-md bg-muted px-1.5 py-0.5 font-mono text-[10px] font-medium text-muted-foreground uppercase sm:inline">Admin</span>
          </Link>

          <AdminNav />

          <div className="ml-auto flex items-center gap-1 sm:gap-2">
            <ThemeToggle />
            <Link
              href={ROUTES.home}
              target="_blank"
              className="hidden items-center gap-1.5 rounded-full px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground sm:flex"
            >
              View site <ExternalLink className="size-3.5" aria-hidden />
            </Link>
            <div className="flex items-center gap-2 border-l pl-3">
              <span aria-hidden className="grid size-8 place-items-center rounded-full bg-foreground text-xs font-semibold text-background">
                {initials(session.name)}
              </span>
              <div className="hidden text-xs leading-tight md:block">
                <p className="font-medium">{session.name}</p>
                <p className="text-muted-foreground">{session.user.email}</p>
              </div>
              <form action={signOut}>
                <Button type="submit" variant="ghost" size="icon-lg" aria-label="Sign out" title="Sign out">
                  <LogOut />
                </Button>
              </form>
            </div>
          </div>
        </Container>
      </header>

      <main id="main" className="flex-1 py-8 sm:py-10">
        <Container>{children}</Container>
      </main>
    </div>
  );
}
