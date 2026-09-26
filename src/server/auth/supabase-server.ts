import "server-only";

import { createServerClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

import { getSupabaseAuthEnv } from "@/server/env";

/**
 * User-scoped Supabase client for Server Components, Server Actions and Route Handlers.
 * It acts as the signed-in user, so every query is subject to Row Level Security.
 * Returns `null` when auth isn't configured.
 */
export async function createSupabaseServerClient(): Promise<SupabaseClient | null> {
  // Read cookies first: this opts every auth-dependent route into per-request rendering,
  // even when env vars are missing at build time (so nothing gets baked in statically).
  const cookieStore = await cookies();

  const env = getSupabaseAuthEnv();
  if (!env) return null;

  return createServerClient(env.SUPABASE_URL, env.SUPABASE_PUBLISHABLE_KEY, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (toSet) => {
        try {
          for (const { name, value, options } of toSet) cookieStore.set(name, value, options);
        } catch {
          // Server Components can't write cookies; the proxy refreshes the session instead.
        }
      },
    },
  });
}
