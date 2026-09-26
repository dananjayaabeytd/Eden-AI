import "server-only";

import { z } from "zod";

/**
 * Server-only environment, validated on first use (not at import time) so the
 * site still builds and renders when optional integrations aren't configured.
 */

const supabaseSchema = z.object({
  SUPABASE_URL: z.url(),
  SUPABASE_SECRET_KEY: z.string().min(20),
});

const supabaseAuthSchema = z.object({
  SUPABASE_URL: z.url(),
  SUPABASE_PUBLISHABLE_KEY: z.string().min(20),
});

const resendSchema = z.object({
  RESEND_API_KEY: z.string().startsWith("re_"),
  CONTACT_TO_EMAIL: z.string().min(3),
  CONTACT_FROM_EMAIL: z.string().min(3),
  CONTACT_SEND_CONFIRMATION: z
    .enum(["true", "false"])
    .default("false")
    .transform((v) => v === "true"),
});

const securitySchema = z.object({
  IP_HASH_SALT: z.string().min(16).default("dev-only-insecure-salt-change-me"),
});

export type SupabaseEnv = z.infer<typeof supabaseSchema>;
export type SupabaseAuthEnv = z.infer<typeof supabaseAuthSchema>;
export type ResendEnv = z.infer<typeof resendSchema>;

/** Treat `KEY=` (empty) the same as unset, so defaults apply. */
const withoutEmpty = (source: NodeJS.ProcessEnv) =>
  Object.fromEntries(Object.entries(source).filter(([, v]) => v !== undefined && v !== ""));

function read<T extends z.ZodType>(schema: T, name: string, source: NodeJS.ProcessEnv = process.env): z.infer<T> | null {
  const result = schema.safeParse(withoutEmpty(source));
  if (!result.success) {
    const missing = result.error.issues.map((i) => i.path.join(".")).join(", ");
    console.warn(`[env] ${name} is not configured (${missing}).`);
    return null;
  }
  return result.data;
}

/** Supabase credentials, or `null` if not configured. Accepts the legacy `service_role` key name too. */
export const getSupabaseEnv = () =>
  read(supabaseSchema, "Supabase", {
    ...process.env,
    SUPABASE_SECRET_KEY: process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY,
  });

/**
 * Public (publishable/anon) key for user-scoped, RLS-enforced clients used by admin auth.
 * Accepts the legacy `anon` key name too.
 */
export const getSupabaseAuthEnv = () =>
  read(supabaseAuthSchema, "Supabase Auth", {
    ...process.env,
    SUPABASE_PUBLISHABLE_KEY: process.env.SUPABASE_PUBLISHABLE_KEY ?? process.env.SUPABASE_ANON_KEY,
  });

/** Resend credentials, or `null` if email notifications are disabled. */
export const getResendEnv = () => read(resendSchema, "Resend");

export function getSecurityEnv() {
  const env = securitySchema.parse(withoutEmpty(process.env));
  if (process.env.NODE_ENV === "production" && !process.env.IP_HASH_SALT) {
    console.warn("[env] IP_HASH_SALT is not set — using an insecure default. Set it in production.");
  }
  return env;
}
