import "server-only";

import { Resend } from "resend";

import { APP_NAME } from "@/config/site";
import { COMPANY_SIZES, CONTACT_TOPICS, type ContactInput } from "@/features/contact/schema";
import { getResendEnv } from "@/server/env";

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

const labelFor = <T extends readonly { value: string; label: string }[]>(options: T, value: string | null) =>
  options.find((o) => o.value === value)?.label ?? "—";

/**
 * Emails the team about a new submission and, if enabled, sends the sender a
 * confirmation. Failures are logged, never thrown: the submission is already
 * safely stored in Supabase.
 */
export async function sendContactNotifications(input: ContactInput, submissionId: string): Promise<void> {
  const env = getResendEnv();
  if (!env) return;

  const resend = new Resend(env.RESEND_API_KEY);
  const name = `${input.firstName} ${input.lastName}`;
  const topic = labelFor(CONTACT_TOPICS, input.topic);

  const rows: [string, string][] = [
    ["Name", name],
    ["Email", input.email],
    ["Company", input.company ?? "—"],
    ["Job title", input.jobTitle ?? "—"],
    ["Phone", input.phone ?? "—"],
    ["Company size", labelFor(COMPANY_SIZES, input.companySize)],
    ["Topic", topic],
    ["Reference", submissionId],
  ];

  const html = `
    <div style="font-family:system-ui,sans-serif;color:#3d3d3d;max-width:560px">
      <h2 style="margin:0 0 16px">New ${escapeHtml(topic)} enquiry</h2>
      <table style="border-collapse:collapse;width:100%;font-size:14px">
        ${rows
          .map(
            ([k, v]) =>
              `<tr><td style="padding:6px 12px 6px 0;color:#777;white-space:nowrap">${k}</td><td style="padding:6px 0">${escapeHtml(v)}</td></tr>`,
          )
          .join("")}
      </table>
      <p style="margin:24px 0 8px;color:#777;font-size:14px">Message</p>
      <p style="white-space:pre-wrap;margin:0;font-size:15px;line-height:1.6">${escapeHtml(input.message)}</p>
    </div>`;

  const text = `${rows.map(([k, v]) => `${k}: ${v}`).join("\n")}\n\nMessage:\n${input.message}`;

  const jobs = [
    resend.emails.send({
      from: env.CONTACT_FROM_EMAIL,
      to: env.CONTACT_TO_EMAIL,
      replyTo: input.email,
      subject: `[${APP_NAME}] ${topic} — ${name}`,
      html,
      text,
    }),
  ];

  if (env.CONTACT_SEND_CONFIRMATION) {
    jobs.push(
      resend.emails.send({
        from: env.CONTACT_FROM_EMAIL,
        to: input.email,
        subject: `We've received your message — ${APP_NAME}`,
        text: `Hi ${input.firstName},\n\nThanks for reaching out to ${APP_NAME}. We've received your message and will get back to you within one business day.\n\nReference: ${submissionId}\n\n— The ${APP_NAME} team`,
      }),
    );
  }

  const results = await Promise.allSettled(jobs);
  for (const result of results) {
    if (result.status === "rejected") console.error("[contact] Email failed:", result.reason);
    else if (result.value.error) console.error("[contact] Email failed:", result.value.error);
  }
}
