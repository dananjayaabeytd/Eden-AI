"use client";

import { useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { MenuIcon } from "lucide-react";

import { Logo } from "@/components/brand/logo";
import { Container } from "@/components/layout/container";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { NavLink } from "@/components/layout/nav-link";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button-link";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { APP_NAME, NAV_ITEMS, ROUTES } from "@/config/site";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  // Frosted background once scrolled; hide on scroll down, reveal on scroll up.
  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 12);
    setHidden(y > prev && y > 240);
  });

  return (
    <motion.header
      className="fixed inset-x-0 top-0 z-50 print:hidden"
      animate={{ y: hidden && !menuOpen ? "-100%" : "0%" }}
      transition={{ duration: 0.35, ease: EASE.out }}
    >
      <div
        className={cn(
          "border-b transition-[background-color,border-color,backdrop-filter] duration-300",
          scrolled
            ? "border-border/70 bg-background/75 backdrop-blur-xl backdrop-saturate-150"
            : "border-transparent bg-transparent",
        )}
      >
        <Container className="flex h-16 items-center justify-between">
          <Logo />

          <nav aria-label="Primary" className="hidden md:block">
            <ul className="flex items-center" onMouseLeave={() => setHovered(null)}>
              {NAV_ITEMS.map((item) => (
                <li key={item.href} className="relative">
                  <NavLink
                    href={item.href}
                    onMouseEnter={() => setHovered(item.href)}
                    className="relative z-10 block rounded-full px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {item.label}
                  </NavLink>
                  {hovered === item.href && (
                    <motion.span
                      layoutId="nav-hover"
                      className="absolute inset-0 rounded-full bg-muted"
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                </li>
              ))}
            </ul>
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            <ThemeToggle />
            <ButtonLink href={ROUTES.login} variant="ghost" size="lg" className="px-4">
              Sign in
            </ButtonLink>
            <ButtonLink href="/#pricing" size="lg" className="rounded-full px-4">
              Get started
            </ButtonLink>
          </div>

          <div className="flex items-center gap-1 md:hidden">
            <ThemeToggle />
            <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
              <SheetTrigger render={<Button variant="ghost" size="icon-lg" aria-label="Open menu" />}>
                <MenuIcon />
              </SheetTrigger>
              <SheetContent side="right" className="w-full max-w-xs">
                <SheetHeader>
                  <SheetTitle>{APP_NAME}</SheetTitle>
                </SheetHeader>
                <nav aria-label="Mobile" className="flex flex-col gap-1 px-4">
                  {NAV_ITEMS.map((item) => (
                    <NavLink
                      key={item.href}
                      href={item.href}
                      onClick={() => setMenuOpen(false)}
                      className="rounded-lg px-3 py-3 text-lg font-medium transition-colors hover:bg-muted"
                    >
                      {item.label}
                    </NavLink>
                  ))}
                  <ButtonLink
                    href="/#pricing"
                    onClick={() => setMenuOpen(false)}
                    size="lg"
                    className="mt-4 h-11 rounded-full"
                  >
                    Get started
                  </ButtonLink>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </Container>
      </div>
    </motion.header>
  );
}
