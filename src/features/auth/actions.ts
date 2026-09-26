"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { ROUTES } from "@/config/site";
import { signInSchema, type SignInState } from "@/features/auth/schema";
import { findAdmin, safeReturnPath } from "@/server/auth/session";
import { createSupabaseServerClient } from "@/server/auth/supabase-server";

/** Same message for unknown email and wrong password, so accounts can't be enumerated. */
const INVALID_CREDENTIALS = "Incorrect email or password.";

export async function signIn(_prev: SignInState, formData: FormData): Promise<SignInState> {
  const email = String(formData.get("email") ?? "");
  const parsed = signInSchema.safeParse({ email, password: formData.get("password") ?? "" });
  if (!parsed.success) {
    const { fieldErrors } = z.flattenError(parsed.error);
    return {
      status: "error",
      message: "Please check the highlighted fields.",
      fieldErrors: { email: fieldErrors.email?.[0], password: fieldErrors.password?.[0] },
      email,
    };
  }

  const db = await createSupabaseServerClient();
  if (!db) {
    console.error("[auth] Supabase Auth is not configured (SUPABASE_URL / SUPABASE_PUBLISHABLE_KEY).");
    return { status: "error", message: "Sign-in is temporarily unavailable.", email };
  }

  const { data, error } = await db.auth.signInWithPassword(parsed.data);
  if (error || !data.user) {
    const rateLimited = error?.status === 429;
    return {
      status: "error",
      message: rateLimited ? "Too many attempts. Please wait a minute and try again." : INVALID_CREDENTIALS,
      email,
    };
  }

  // Signed in — but only admins may enter. Anyone else is signed straight back out.
  if (!(await findAdmin(db, data.user.id))) {
    await db.auth.signOut();
    return { status: "error", message: "This account doesn't have access to the admin dashboard.", email };
  }

  redirect(safeReturnPath(formData.get("next")));
}

export async function signOut(): Promise<void> {
  const db = await createSupabaseServerClient();
  await db?.auth.signOut();
  redirect(ROUTES.login);
}
