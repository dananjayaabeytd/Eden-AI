"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";

import type { LegalSection } from "@/content/legal/types";
import { cn } from "@/lib/utils";

/**
 * Distance (px) from the viewport top at which a section becomes "current".
 * Must be larger than the sections' `scroll-mt-*`, which is where anchor links land.
 */
const ACTIVATION_LINE = 140;

/** Section navigation with scroll-spy: highlights the section currently being read. */
export function TableOfContents({ sections }: { sections: readonly Pick<LegalSection, "id" | "title">[] }) {
  const [active, setActive] = useState(sections[0]?.id);

  useEffect(() => {
    let frame = 0;
    // The current section is the last one whose top has passed a line just below the header.
    const update = () => {
      frame = 0;
      let current = sections[0]?.id;
      for (const { id } of sections) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= ACTIVATION_LINE) current = id;
      }
      // At the very bottom, the final (often short) section should win.
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
        current = sections[sections.length - 1]?.id;
      }
      setActive(current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [sections]);

  return (
    <nav aria-label="On this page">
      <p className="mb-3 text-xs font-medium tracking-wide text-muted-foreground uppercase">On this page</p>
      <ol className="relative space-y-0.5 border-l">
        {sections.map((section) => {
          const isActive = section.id === active;
          return (
            <li key={section.id} className="relative">
              {isActive && (
                <motion.span
                  layoutId="toc-indicator"
                  className="absolute top-0 -left-px h-full w-0.5 rounded-full bg-foreground"
                  transition={{ type: "spring", stiffness: 400, damping: 34 }}
                />
              )}
              <a
                href={`#${section.id}`}
                aria-current={isActive ? "location" : undefined}
                onClick={() => setActive(section.id)}
                className={cn(
                  "block py-1.5 pl-4 text-sm transition-colors",
                  isActive ? "font-medium text-foreground" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {section.title}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
