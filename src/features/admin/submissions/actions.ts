"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { ROUTES } from "@/config/site";
import { requireAdmin } from "@/server/auth/session";

import { statusSchema } from "./model";

export type ActionResult = { ok: true } | { ok: false; message: string };

const idSchema = z.uuid();

/** Changes a submission's triage status. Authorization: `requireAdmin` + RLS. */
export async function updateSubmissionStatus(id: string, status: string): Promise<ActionResult> {
  const { db } = await requireAdmin();

  const parsed = z.object({ id: idSchema, status: statusSchema }).safeParse({ id, status });
  if (!parsed.success) return { ok: false, message: "Invalid request." };

  const { error, count } = await db
    .from("contact_submissions")
    .update({ status: parsed.data.status }, { count: "exact" })
    .eq("id", parsed.data.id);

  if (error || count === 0) {
    console.error("[admin] Status update failed:", error?.message ?? "no rows updated");
    return { ok: false, message: "Couldn't update the status. Please try again." };
  }

  revalidatePath(ROUTES.admin, "layout");
  return { ok: true };
}

/** Permanently deletes a submission (e.g. on a data-deletion request), then returns to the list. */
export async function deleteSubmission(id: string): Promise<ActionResult> {
  const { db } = await requireAdmin();

  const parsed = idSchema.safeParse(id);
  if (!parsed.success) return { ok: false, message: "Invalid request." };

  const { error, count } = await db.from("contact_submissions").delete({ count: "exact" }).eq("id", parsed.data);
  if (error || count === 0) {
    console.error("[admin] Delete failed:", error?.message ?? "no rows deleted");
    return { ok: false, message: "Couldn't delete this submission. Please try again." };
  }

  revalidatePath(ROUTES.admin, "layout");
  redirect(ROUTES.admin);
}
