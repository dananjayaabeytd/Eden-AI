import { z } from "zod";

import { CONTACT_TOPICS } from "@/features/contact/schema";

/** Triage workflow. Matches the `status` check constraint in the database. */
export const SUBMISSION_STATUSES = [
  { value: "new", label: "New" },
  { value: "in_progress", label: "In progress" },
  { value: "resolved", label: "Resolved" },
  { value: "spam", label: "Spam" },
] as const;

export type SubmissionStatus = (typeof SUBMISSION_STATUSES)[number]["value"];
type TopicValue = (typeof CONTACT_TOPICS)[number]["value"];

const statusValues = SUBMISSION_STATUSES.map((s) => s.value) as [SubmissionStatus, ...SubmissionStatus[]];
const topicValues = CONTACT_TOPICS.map((t) => t.value) as [TopicValue, ...TopicValue[]];

export const statusSchema = z.enum(statusValues);

export const statusLabel = (value: string) => SUBMISSION_STATUSES.find((s) => s.value === value)?.label ?? value;
export const topicLabel = (value: string) => CONTACT_TOPICS.find((t) => t.value === value)?.label ?? value;

/** Database row shape (snake_case, as stored). */
export type Submission = {
  id: string;
  created_at: string;
  first_name: string;
  last_name: string;
  email: string;
  company: string | null;
  job_title: string | null;
  phone: string | null;
  company_size: string | null;
  topic: TopicValue;
  message: string;
  status: SubmissionStatus;
  user_agent: string | null;
};

export const PAGE_SIZE = 20;

/**
 * Dashboard filters live in the URL, so views are shareable, bookmarkable and
 * survive refreshes. Invalid values fall back to defaults instead of erroring.
 */
export const filtersSchema = z.object({
  status: statusSchema.or(z.literal("all")).catch("all"),
  topic: z.enum(topicValues).or(z.literal("all")).catch("all"),
  q: z.string().trim().max(100).catch(""),
  page: z.coerce.number().int().min(1).max(10_000).catch(1),
});

export type SubmissionFilters = z.infer<typeof filtersSchema>;

export function parseFilters(params: Record<string, string | string[] | undefined>): SubmissionFilters {
  const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);
  return filtersSchema.parse({
    status: first(params.status) ?? "all",
    topic: first(params.topic) ?? "all",
    q: first(params.q) ?? "",
    page: first(params.page) ?? 1,
  });
}
