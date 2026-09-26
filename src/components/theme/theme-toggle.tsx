"use client";

import type { MouseEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Monitor, Moon, Sun } from "lucide-react";

import { cn } from "@/lib/utils";

import { useTheme } from "./theme-provider";
import type { Theme } from "./theme-script";

const center = (e: MouseEvent<HTMLElement>) => {
  const r = e.currentTarget.getBoundingClientRect();
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
};

/** Icon button that flips between light and dark, with a sun/moon morph. */
export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={(e) => setTheme(isDark ? "light" : "dark", center(e))}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      title={isDark ? "Light theme" : "Dark theme"}
      className={cn(
        "relative grid size-9 place-items-center overflow-hidden rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
        className,
      )}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={resolvedTheme}
          initial={{ y: 18, rotate: -90, opacity: 0 }}
          animate={{ y: 0, rotate: 0, opacity: 1 }}
          exit={{ y: -18, rotate: 90, opacity: 0 }}
          transition={{ type: "spring", stiffness: 420, damping: 28 }}
          className="grid"
        >
          {isDark ? <Moon className="size-[18px]" aria-hidden /> : <Sun className="size-[18px]" aria-hidden />}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}

const OPTIONS: { value: Theme; label: string; icon: typeof Sun }[] = [
  { value: "light", label: "Light", icon: Sun },
  { value: "system", label: "System", icon: Monitor },
  { value: "dark", label: "Dark", icon: Moon },
];

/** Three-way segmented control — the only place "follow my OS" is exposed explicitly. */
export function ThemeSwitcher({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();

  return (
    <div role="group" aria-label="Theme" className={cn("inline-flex rounded-full border bg-muted/60 p-0.5", className)}>
      {OPTIONS.map(({ value, label, icon: Icon }) => {
        const active = theme === value;
        return (
          <button
            key={value}
            type="button"
            aria-pressed={active}
            aria-label={`${label} theme`}
            title={label}
            onClick={(e) => setTheme(value, center(e))}
            className={cn(
              "relative grid size-7 place-items-center rounded-full transition-colors",
              active ? "text-foreground" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {active && (
              <motion.span
                layoutId="theme-switcher"
                className="absolute inset-0 rounded-full bg-background shadow-xs"
                transition={{ type: "spring", stiffness: 420, damping: 34 }}
              />
            )}
            <Icon className="relative size-3.5" aria-hidden />
          </button>
        );
      })}
    </div>
  );
}
