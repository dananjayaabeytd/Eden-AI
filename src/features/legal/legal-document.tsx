import { CheckCircle2, ChevronDown, Hash, Mail } from "lucide-react";

import { Container } from "@/components/layout/container";
import { NavLink } from "@/components/layout/nav-link";
import { Reveal } from "@/components/motion/reveal";
import { ButtonLink } from "@/components/ui/button-link";
import { LEGAL, ROUTES } from "@/config/site";
import type { LegalBlock, LegalDocument as LegalDocumentData } from "@/content/legal/types";
import { cn } from "@/lib/utils";

import { TableOfContents } from "./table-of-contents";

const DOCUMENTS = [
  { href: ROUTES.privacy, label: "Privacy Policy" },
  { href: ROUTES.terms, label: "Terms of Service" },
] as const;

const formatDate = (iso: string) =>
  new Intl.DateTimeFormat("en", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" }).format(new Date(iso));

/** Renders a legal document with a sticky, scroll-spying table of contents. */
export function LegalDocument({ doc, path }: { doc: LegalDocumentData; path: string }) {
  return (
    <div className="pt-32 pb-24 sm:pt-40">
      <Container>
        <Reveal>
          <nav aria-label="Legal documents" className="flex gap-1 rounded-full border bg-muted p-1 text-sm print:hidden sm:w-fit">
            {DOCUMENTS.map((d) => (
              <NavLink
                key={d.href}
                href={d.href}
                aria-current={d.href === path ? "page" : undefined}
                className={cn(
                  "flex-1 rounded-full px-4 py-1.5 text-center font-medium whitespace-nowrap transition-colors",
                  d.href === path ? "bg-background text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {d.label}
              </NavLink>
            ))}
          </nav>

          <h1 className="mt-10 text-4xl font-semibold tracking-tighter text-balance sm:text-6xl">{doc.title}</h1>
          <p className="mt-4 max-w-2xl text-lg text-pretty text-muted-foreground">{doc.description}</p>
          <p className="mt-4 text-sm text-muted-foreground">
            Last updated <time dateTime={doc.lastUpdated}>{formatDate(doc.lastUpdated)}</time>
          </p>

          <section aria-labelledby="summary-title" className="mt-10 max-w-3xl rounded-2xl border bg-muted p-6 sm:p-8">
            <h2 id="summary-title" className="text-sm font-semibold">
              The short version
            </h2>
            <ul className="mt-4 space-y-3">
              {doc.summary.map((point) => (
                <li key={point} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-foreground" aria-hidden />
                  {point}
                </li>
              ))}
            </ul>
          </section>
        </Reveal>

        <div className="mt-16 grid gap-12 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-16">
          <aside className="print:hidden">
            {/* Mobile: collapsible contents */}
            <details className="group rounded-xl border p-4 lg:hidden">
              <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-medium">
                On this page
                <ChevronDown className="size-4 transition-transform group-open:rotate-180" aria-hidden />
              </summary>
              <ol className="mt-3 space-y-2 text-sm">
                {doc.sections.map((s) => (
                  <li key={s.id}>
                    <a href={`#${s.id}`} className="text-muted-foreground hover:text-foreground">
                      {s.title}
                    </a>
                  </li>
                ))}
              </ol>
            </details>
            {/* Desktop: sticky scroll-spy */}
            <div className="sticky top-28 hidden lg:block">
              <TableOfContents sections={doc.sections} />
            </div>
          </aside>

          <article className="max-w-3xl">
            {doc.sections.map((section, i) => (
              <section key={section.id} id={section.id} aria-labelledby={`${section.id}-title`} className="scroll-mt-28 border-t py-10 first:border-t-0 first:pt-0">
                <h2 id={`${section.id}-title`} className="group flex items-baseline gap-3 text-xl font-semibold tracking-tight sm:text-2xl">
                  <span className="font-mono text-sm text-muted-foreground tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                  {section.title}
                  <a
                    href={`#${section.id}`}
                    aria-label={`Link to ${section.title}`}
                    className="text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100 print:hidden"
                  >
                    <Hash className="size-4" aria-hidden />
                  </a>
                </h2>
                <div className="mt-5 space-y-4 text-[15px] leading-7 text-muted-foreground">
                  {section.blocks.map((block, j) => (
                    <Block key={j} block={block} />
                  ))}
                </div>
              </section>
            ))}

            <div className="mt-6 flex flex-col items-start gap-4 rounded-2xl border p-6 sm:flex-row sm:items-center sm:justify-between print:hidden">
              <div className="flex items-center gap-3">
                <div className="grid size-10 place-items-center rounded-full bg-muted">
                  <Mail className="size-4" aria-hidden />
                </div>
                <div>
                  <p className="text-sm font-medium">Questions about this document?</p>
                  <p className="text-sm text-muted-foreground">{LEGAL.privacyEmail}</p>
                </div>
              </div>
              <ButtonLink href="/#contact" variant="outline" size="lg" className="h-10 rounded-full px-5">
                Contact us
              </ButtonLink>
            </div>
          </article>
        </div>
      </Container>
    </div>
  );
}

function Block({ block }: { block: LegalBlock }) {
  switch (block.type) {
    case "p":
      return <p className="text-pretty">{block.text}</p>;
    case "list":
      return (
        <ul className="space-y-2 pl-5 marker:text-foreground/40 [list-style:disc]">
          {block.items.map((item) => (
            <li key={item} className="pl-1">
              {item}
            </li>
          ))}
        </ul>
      );
    case "definitions":
      return (
        <dl className="divide-y rounded-xl border">
          {block.items.map((item) => (
            <div key={item.term} className="grid gap-1 p-4 sm:grid-cols-[180px_1fr] sm:gap-6">
              <dt className="font-medium text-foreground">{item.term}</dt>
              <dd>{item.description}</dd>
            </div>
          ))}
        </dl>
      );
  }
}
