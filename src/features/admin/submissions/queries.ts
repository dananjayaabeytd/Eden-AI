import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

import { PAGE_SIZE, SUBMISSION_STATUSES, type Submission, type SubmissionFilters, type SubmissionStatus } from "./model";

/**
 * Read models for the admin dashboard. They take the *user-scoped* client from
 * `requireAdmin()`, so Row Level Security decides what can be read.
 */

const TABLE = "contact_submissions";
const LIST_COLUMNS = "id, created_at, first_name, last_name, email, company, job_title, phone, company_size, topic, message, status, user_agent";

/** Escapes PostgREST filter syntax and LIKE wildcards in user-typed search text. */
const toSearchPattern = (q: string) => `*${q.replace(/[\\%_*,()."]/g, " ").trim()}*`;

export async function listSubmissions(db: SupabaseClient, filters: SubmissionFilters) {
  const from = (filters.page - 1) * PAGE_SIZE;

  let query = db
    .from(TABLE)
    .select(LIST_COLUMNS, { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, from + PAGE_SIZE - 1);

  if (filters.status !== "all") query = query.eq("status", filters.status);
  if (filters.topic !== "all") query = query.eq("topic", filters.topic);
  if (filters.q) {
    const p = toSearchPattern(filters.q);
    query = query.or(`first_name.ilike.${p},last_name.ilike.${p},email.ilike.${p},company.ilike.${p}`);
  }

  const { data, count, error } = await query.returns<Submission[]>();
  if (error) throw new Error(`Failed to load submissions: ${error.message}`);

  const total = count ?? 0;
  return { rows: data ?? [], total, pageCount: Math.max(1, Math.ceil(total / PAGE_SIZE)) };
}

export async function getSubmission(db: SupabaseClient, id: string): Promise<Submission | null> {
  const { data, error } = await db.from(TABLE).select(LIST_COLUMNS).eq("id", id).maybeSingle<Submission>();
  if (error) throw new Error(`Failed to load submission: ${error.message}`);
  return data;
}

export type SubmissionStats = { total: number; last7Days: number } & Record<SubmissionStatus, number>;

const countQuery = (db: SupabaseClient) => db.from(TABLE).select("id", { count: "exact", head: true });

async function runCount(query: ReturnType<typeof countQuery>): Promise<number> {
  const { count, error } = await query;
  if (error) throw new Error(`Failed to load stats: ${error.message}`);
  return count ?? 0;
}

/** Headline counts. Runs the (cheap, index-backed) count queries in parallel. */
export async function getSubmissionStats(db: SupabaseClient): Promise<SubmissionStats> {
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const [total, last7Days, ...byStatus] = await Promise.all([
    runCount(countQuery(db)),
    runCount(countQuery(db).gte("created_at", weekAgo)),
    ...SUBMISSION_STATUSES.map((s) => runCount(countQuery(db).eq("status", s.value))),
  ]);

  const statusCounts = Object.fromEntries(SUBMISSION_STATUSES.map((s, i) => [s.value, byStatus[i]])) as Record<SubmissionStatus, number>;
  return { total, last7Days, ...statusCounts };
}
