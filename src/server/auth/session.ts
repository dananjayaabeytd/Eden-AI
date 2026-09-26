import "server-only";

import { cache } from "react";
import type { SupabaseClient, User } from "@supabase/supabase-js";
import { redirect } from "next/navigation";

import { ROUTES } from "@/config/site";
import { createSupabaseServerClient } from "@/server/auth/supabase-server";

/**
 * Data Access Layer for authentication and authorization.
 * Every admin page and Server Action calls `requireAdmin()` — the proxy's
 * redirect is only an optimisation, never the security boundary.
 */

export type AdminSession = {
  user: Pick<User, "id" | "email">;
  name: string;
  /** User-scoped client: all queries are filtered by Row Level Security. */
  db: SupabaseClient;
};

type SessionResult =
  | { status: "unconfigured" }
  | { status: "signed-out" }
  | { status: "forbidden"; email: string | undefined }
  | { status: "admin"; session: AdminSession };

/** Admin membership for a user (RLS only lets users read their own row). */
export async function findAdmin(db: SupabaseClient, userId: string): Promise<{ full_name: string | null } | null> {
  const { data } = await db.from("admins").select("full_name").eq("user_id", userId).maybeSingle<{ full_name: string | null }>();
  return data;
}

/** Resolves the current user and whether they're an admin. Cached per request. */
export const getSession = cache(async (): Promise<SessionResult> => {
  const db = await createSupabaseServerClient();
  if (!db) return { status: "unconfigured" };

  // `getUser()` verifies the session with Supabase Auth; never trust cookie contents alone.
  const { data, error } = await db.auth.getUser();
  if (error || !data.user) return { status: "signed-out" };

  const admin = await findAdmin(db, data.user.id);
  if (!admin) return { status: "forbidden", email: data.user.email };

  return {
    status: "admin",
    session: {
      user: { id: data.user.id, email: data.user.email },
      name: admin.full_name || data.user.email?.split("@")[0] || "Admin",
      db,
    },
  };
});

/**
 * Returns the admin session, or redirects to the login page.
 * @param returnTo Path to come back to after signing in.
 */
export async function requireAdmin(returnTo: string = ROUTES.admin): Promise<AdminSession> {
  const result = await getSession();
  if (result.status === "admin") return result.session;

  const params = new URLSearchParams({ next: returnTo });
  if (result.status === "forbidden") params.set("error", "forbidden");
  if (result.status === "unconfigured") params.set("error", "unconfigured");
  redirect(`${ROUTES.login}?${params}`);
}

/** Only allow redirects back into the admin area (prevents open redirects). */
export function safeReturnPath(value: unknown): string {
  return typeof value === "string" && /^\/admin(\/|$|\?)/.test(value) && !value.startsWith("//")
    ? value
    : ROUTES.admin;
}
