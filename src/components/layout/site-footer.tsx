import { Logo } from "@/components/brand/logo";
import { Container } from "@/components/layout/container";
import { NavLink } from "@/components/layout/nav-link";
import { ThemeSwitcher } from "@/components/theme/theme-toggle";
import { APP_NAME, FOOTER_LINKS, SITE } from "@/config/site";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t print:hidden">
      <Container className="grid gap-12 py-16 md:grid-cols-[1.5fr_repeat(3,1fr)]">
        <div className="max-w-xs">
          <Logo />
          <p className="mt-4 text-sm text-muted-foreground">{SITE.tagline}</p>
        </div>

        {FOOTER_LINKS.map((group) => (
          <nav key={group.title} aria-label={group.title}>
            <h3 className="text-sm font-medium">{group.title}</h3>
            <ul className="mt-4 space-y-3">
              {group.links.map((link) => (
                <li key={link.label}>
                  <NavLink
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </Container>

      <Container>
        <div className="flex flex-col items-start justify-between gap-2 border-t py-6 text-xs text-muted-foreground sm:flex-row sm:items-center">
          <p>
            © {year} {APP_NAME}, Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <ThemeSwitcher />
            <p className="font-mono">Made with care.</p>
          </div>
        </div>
      </Container>

      {/* Oversized wordmark — decorative. */}
      <p
        aria-hidden
        className="pointer-events-none text-center text-[22vw] leading-none font-bold tracking-tighter text-transparent select-none [-webkit-text-stroke:1px_var(--border)]"
      >
        {APP_NAME}
      </p>
    </footer>
  );
}
