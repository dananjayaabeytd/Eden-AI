/**
 * Theme constants shared by the pre-paint inline script and the React provider.
 * The script runs synchronously in <head>, so the correct theme is applied
 * before first paint — no flash of the wrong theme and no hydration mismatch.
 */

export const THEME_STORAGE_KEY = "theme";
export const THEMES = ["light", "dark", "system"] as const;
export type Theme = (typeof THEMES)[number];
export type ResolvedTheme = Exclude<Theme, "system">;

/** Inline, dependency-free. Keep in sync with `applyTheme` in theme-provider.tsx. */
export const THEME_SCRIPT = `(function(){try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");if(t!=="light"&&t!=="dark")t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";var d=document.documentElement;d.classList.toggle("dark",t==="dark");d.style.colorScheme=t}catch(e){}})()`;
