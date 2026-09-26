import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import { getSupabaseEnv } from "@/server/env";

let client: SupabaseClient | null = null;

/**
 * Privileged Supabase client for trusted server code only.
 * It uses the secret key, which bypasses Row Level Security — never import this
 * from client components (the `server-only` import above enforces that at build time).
 */
export function getSupabaseAdmin(): SupabaseClient | null {
  if (client) return client;

  const env = getSupabaseEnv();
  if (!env) return null;

  client = createClient(env.SUPABASE_URL, env.SUPABASE_SECRET_KEY, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
  return client;
}
