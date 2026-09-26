import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Mail, Reply } from "lucide-react";

import { CopyButton } from "@/components/copy-button";
import { ButtonLink } from "@/components/ui/button-link";
import { APP_NAME, ROUTES } from "@/config/site";
import { COMPANY_SIZES } from "@/features/contact/schema";
import { DeleteSubmission } from "@/features/admin/submissions/components/delete-submission";
import { StatusBadge } from "@/features/admin/submissions/components/status-badge";
import { StatusSelect } from "@/features/admin/submissions/components/status-select";
import { topicLabel, type Submission } from "@/features/admin/submissions/model";
import { getSubmission } from "@/features/admin/submissions/queries";
import { formatDateTime, formatRelative, initials } from "@/lib/format";
import { requireAdmin } from "@/server/auth/session";

export const metadata: Metadata = { title: "Submission" };

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default async function SubmissionPage({ params }: PageProps<"/admin/submissions/[id]">) {
  const { id } = await params;
  const { db } = await requireAdmin(`${ROUTES.admin}/submissions/${id}`);
  if (!UUID.test(id)) notFound();

  const submission = await getSubmission(db, id);
  if (!submission) notFound();

  const name = `${submission.first_name} ${submission.last_name}`;

  return (
    <div className="space-y-6">
      <Link href={ROUTES.admin} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground">
        <ArrowLeft className="size-4" aria-hidden /> All submissions
      </Link>

      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <span aria-hidden className="grid size-12 place-items-center rounded-full bg-foreground text-sm font-semibold text-background">
            {initials(name)}
          </span>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">{name}</h1>
            <p className="text-sm text-muted-foreground">
              {topicLabel(submission.topic)} ·{" "}
              <time dateTime={submission.created_at} title={formatDateTime(submission.created_at)}>
                {formatRelative(submission.created_at)}
              </time>
            </p>
          </div>
        </div>
        <StatusBadge status={submission.status} className="self-start text-sm sm:self-auto" />
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <article className="rounded-2xl border bg-card p-6 sm:p-8">
          <h2 className="text-sm font-medium text-muted-foreground">Message</h2>
          <p className="mt-4 text-[15px] leading-7 whitespace-pre-wrap">{submission.message}</p>
          <div className="mt-8 border-t pt-6">
            <ButtonLink href={replyMailto(submission)} size="lg" className="h-10 rounded-full px-5">
              <Reply /> Reply by email
            </ButtonLink>
          </div>
        </article>

        <aside className="space-y-6">
          <section aria-labelledby="status-title" className="rounded-2xl border bg-card p-5">
            <h2 id="status-title" className="mb-3 text-sm font-semibold">
              Status
            </h2>
            <StatusSelect id={submission.id} status={submission.status} />
          </section>

          <section aria-labelledby="contact-title" className="rounded-2xl border bg-card p-5">
            <h2 id="contact-title" className="mb-3 text-sm font-semibold">
              Contact details
            </h2>
            <dl className="space-y-3 text-sm">
              <Detail label="Email" copy={submission.email}>
                <a href={`mailto:${submission.email}`} className="inline-flex items-center gap-1.5 break-all hover:underline">
                  <Mail className="size-3.5 shrink-0 text-muted-foreground" aria-hidden />
                  {submission.email}
                </a>
              </Detail>
              {submission.phone && (
                <Detail label="Phone" copy={submission.phone}>
                  <a href={`tel:${submission.phone.replace(/[^\d+]/g, "")}`} className="hover:underline">
                    {submission.phone}
                  </a>
                </Detail>
              )}
              <Detail label="Company">{submission.company ?? "—"}</Detail>
              <Detail label="Job title">{submission.job_title ?? "—"}</Detail>
              <Detail label="Company size">{COMPANY_SIZES.find((s) => s.value === submission.company_size)?.label ?? "—"}</Detail>
            </dl>
          </section>

          <section aria-labelledby="meta-title" className="rounded-2xl border bg-card p-5">
            <h2 id="meta-title" className="mb-3 text-sm font-semibold">
              Details
            </h2>
            <dl className="space-y-3 text-sm">
              <Detail label="Received">{formatDateTime(submission.created_at)}</Detail>
              <Detail label="Reference" copy={submission.id}>
                <span className="font-mono text-xs break-all">{submission.id}</span>
              </Detail>
              {submission.user_agent && (
                <Detail label="Browser">
                  <span className="line-clamp-2 text-xs text-muted-foreground" title={submission.user_agent}>
                    {submission.user_agent}
                  </span>
                </Detail>
              )}
            </dl>
          </section>

          <DeleteSubmission id={submission.id} name={name} />
        </aside>
      </div>
    </div>
  );
}

function Detail({ label, copy, children }: { label: string; copy?: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 flex items-start justify-between gap-2">
        <div className="min-w-0">{children}</div>
        {copy && <CopyButton value={copy} label={`Copy ${label.toLowerCase()}`} className="-mt-1 shrink-0" />}
      </dd>
    </div>
  );
}

/** Pre-filled reply that quotes the original message. */
function replyMailto(s: Submission): string {
  const subject = `Re: your ${topicLabel(s.topic).toLowerCase()} enquiry — ${APP_NAME}`;
  const quoted = s.message
    .split("\n")
    .map((line) => `> ${line}`)
    .join("\n");
  const body = `Hi ${s.first_name},\n\nThanks for reaching out to ${APP_NAME}.\n\n\n\nOn ${formatDateTime(s.created_at)} you wrote:\n${quoted}`;
  return `mailto:${s.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
