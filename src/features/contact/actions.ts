"use server";

import { after } from "next/server";

import { SITE } from "@/config/site";
import {
  HONEYPOT_FIELD,
  STARTED_AT_FIELD,
  contactSchema,
  readContactForm,
  toFieldErrors,
  type ContactFormState,
} from "@/features/contact/schema";
import { sendContactNotifications } from "@/server/contact/notifications";
import { countRecentSubmissions, insertContactSubmission } from "@/server/contact/repository";
import { getRequestMeta } from "@/server/request";
import { getSupabaseAdmin } from "@/server/supabase";

const RATE_LIMIT = { max: 3, windowMs: 10 * 60 * 1000 };
/** Humans take longer than this to fill in a detailed form. */
const MIN_FILL_TIME_MS = 3000;

const GENERIC_ERROR = `Something went wrong on our side. Please try again, or email us at ${SITE.email}.`;

/**
 * Handles contact form submissions:
 * spam checks → validation → rate limit → persist to Supabase → notify via Resend (after response).
 */
export async function submitContact(_prev: ContactFormState, formData: FormData): Promise<ContactFormState> {
  const raw = readContactForm(formData);

  // 1. Bots: a filled honeypot or an instant submit gets a fake success, so they learn nothing.
  const startedAt = Number(formData.get(STARTED_AT_FIELD));
  const tooFast = Number.isFinite(startedAt) && startedAt > 0 && Date.now() - startedAt < MIN_FILL_TIME_MS;
  if (formData.get(HONEYPOT_FIELD) || tooFast) {
    return { status: "success", firstName: raw.firstName.trim() || "there" };
  }

  // 2. Validate — the server is the source of truth.
  const parsed = contactSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      status: "error",
      message: "Please fix the highlighted fields and try again.",
      fieldErrors: toFieldErrors(parsed.error),
      values: raw,
    };
  }
  const input = parsed.data;

  const db = getSupabaseAdmin();
  if (!db) {
    console.error("[contact] Supabase is not configured; submission was not saved.");
    return { status: "error", message: GENERIC_ERROR, values: raw };
  }

  try {
    // 3. Rate limit per (hashed) IP, backed by the database so it holds across instances.
    const meta = await getRequestMeta();
    if (meta.ipHash) {
      const recent = await countRecentSubmissions(db, meta.ipHash, RATE_LIMIT.windowMs);
      if (recent >= RATE_LIMIT.max) {
        return {
          status: "error",
          message: "You've sent several messages recently. Please wait a few minutes before trying again.",
          values: raw,
        };
      }
    }

    // 4. Persist.
    const submission = await insertContactSubmission(db, input, meta);

    // 5. Notify without making the user wait.
    after(() => sendContactNotifications(input, submission.id));

    return { status: "success", firstName: input.firstName };
  } catch (error) {
    console.error("[contact]", error);
    return { status: "error", message: GENERIC_ERROR, values: raw };
  }
}
