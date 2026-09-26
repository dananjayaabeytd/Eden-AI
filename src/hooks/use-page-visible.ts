"use client";

import { useSyncExternalStore } from "react";

const subscribe = (onChange: () => void) => {
  document.addEventListener("visibilitychange", onChange);
  return () => document.removeEventListener("visibilitychange", onChange);
};

/** `false` while the tab is in the background — use it to pause animations and timers. */
export function usePageVisible(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => !document.hidden,
    () => true,
  );
}
