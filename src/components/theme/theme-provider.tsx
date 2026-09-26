"use client";

import { createContext, use, useCallback, useEffect, useMemo, useSyncExternalStore, type ReactNode } from "react";

import { THEME_STORAGE_KEY, THEMES, type ResolvedTheme, type Theme } from "./theme-script";

type ThemeContextValue = {
  /** The user's preference (may be "system"). */
  theme: Theme;
  /** What's actually shown right now. */
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme, origin?: { x: number; y: number }) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

const DARK_QUERY = "(prefers-color-scheme: dark)";
const CHANGE_EVENT = "theme-change";

function readPreference(): Theme {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    return THEMES.includes(stored as Theme) ? (stored as Theme) : "system";
  } catch {
    return "system";
  }
}

const systemTheme = (): ResolvedTheme => (window.matchMedia(DARK_QUERY).matches ? "dark" : "light");

function applyTheme(resolved: ResolvedTheme) {
  const root = document.documentElement;
  root.classList.toggle("dark", resolved === "dark");
  root.style.colorScheme = resolved;
}

// External store: localStorage preference + OS setting, kept in sync across tabs.
function subscribe(onChange: () => void) {
  const mql = window.matchMedia(DARK_QUERY);
  const onStorage = (e: StorageEvent) => e.key === THEME_STORAGE_KEY && onChange();
  mql.addEventListener("change", onChange);
  window.addEventListener("storage", onStorage);
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => {
    mql.removeEventListener("change", onChange);
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(CHANGE_EVENT, onChange);
  };
}

const getSnapshot = () => `${readPreference()}:${systemTheme()}`;
// The server doesn't know the preference; the inline script already fixed the DOM.
const getServerSnapshot = () => "system:light";

export function ThemeProvider({ children }: { children: ReactNode }) {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [theme, system] = snapshot.split(":") as [Theme, ResolvedTheme];
  const resolvedTheme: ResolvedTheme = theme === "system" ? system : theme;

  // Keep the DOM in sync (e.g. OS theme flips while "system" is selected, or another tab changes it).
  useEffect(() => applyTheme(resolvedTheme), [resolvedTheme]);

  const setTheme = useCallback((next: Theme, origin?: { x: number; y: number }) => {
    const commit = () => {
      try {
        localStorage.setItem(THEME_STORAGE_KEY, next);
      } catch {
        // Storage can be unavailable (private mode); the change still applies for this page view.
      }
      applyTheme(next === "system" ? systemTheme() : next);
      window.dispatchEvent(new Event(CHANGE_EVENT));
    };

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!document.startViewTransition || reduceMotion) return commit();

    // Circular reveal from the control that was clicked.
    const x = origin?.x ?? window.innerWidth / 2;
    const y = origin?.y ?? 0;
    const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
    const transition = document.startViewTransition(commit);
    transition.ready.then(() => {
      document.documentElement.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        { duration: 550, easing: "cubic-bezier(0.22, 1, 0.36, 1)", pseudoElement: "::view-transition-new(root)" },
      );
    });
  }, []);

  const value = useMemo(() => ({ theme, resolvedTheme, setTheme }), [theme, resolvedTheme, setTheme]);
  return <ThemeContext value={value}>{children}</ThemeContext>;
}

export function useTheme(): ThemeContextValue {
  const ctx = use(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within <ThemeProvider>");
  return ctx;
}
