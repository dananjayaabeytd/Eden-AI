"use client";

import type { ReactNode } from "react";
import { MotionConfig } from "motion/react";

import { ThemeProvider } from "@/components/theme/theme-provider";

/** Providers shared by every route (marketing, auth and admin). */
export function RootProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </ThemeProvider>
  );
}
