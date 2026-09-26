import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

import type { ContactInput } from "@/features/contact/schema";
import type { RequestMeta } from "@/server/request";

/** Matches `supabase/migrations/*_create_contact_submissions.sql`. */
const TABLE = "contact_submissions";

export type ContactSubmissionRow = {
  id: string;
  created_at: string;
};

export async function insertContactSubmission(
  db: SupabaseClient,
  input: ContactInput,
  meta: RequestMeta,
): Promise<ContactSubmissionRow> {
  const { data, error } = await db
    .from(TABLE)
    .insert({
      first_name: input.firstName,
      last_name: input.lastName,
      email: input.email,
      company: input.company,
      job_title: input.jobTitle,
      phone: input.phone,
      company_size: input.companySize,
      topic: input.topic,
      message: input.message,
      consent: true,
      ip_hash: meta.ipHash,
      user_agent: meta.userAgent,
    })
    .select("id, created_at")
    .single<ContactSubmissionRow>();

  if (error) throw new Error(`Failed to save contact submission: ${error.message}`);
  return data;
}

/** Number of submissions from the same (hashed) IP within the window. */
export async function countRecentSubmissions(
  db: SupabaseClient,
  ipHash: string,
  windowMs: number,
): Promise<number> {
  const since = new Date(Date.now() - windowMs).toISOString();
  const { count, error } = await db
    .from(TABLE)
    .select("id", { count: "exact", head: true })
    .eq("ip_hash", ipHash)
    .gte("created_at", since);

  if (error) throw new Error(`Failed to check rate limit: ${error.message}`);
  return count ?? 0;
}
