import type { Metadata } from "next";

import { ROUTES } from "@/config/site";
import { PAGE_SIZE, parseFilters } from "@/features/admin/submissions/model";
import { getSubmissionStats, listSubmissions } from "@/features/admin/submissions/queries";
import { Pagination } from "@/features/admin/submissions/components/pagination";
import { StatsCards } from "@/features/admin/submissions/components/stats-cards";
import { SubmissionsTable } from "@/features/admin/submissions/components/submissions-table";
import { SubmissionsToolbar } from "@/features/admin/submissions/components/submissions-toolbar";
import { requireAdmin } from "@/server/auth/session";

export const metadata: Metadata = { title: "Submissions" };

export default async function AdminSubmissionsPage({ searchParams }: PageProps<"/admin">) {
  const { db, name } = await requireAdmin();
  const filters = parseFilters(await searchParams);

  const [stats, { rows, total, pageCount }] = await Promise.all([getSubmissionStats(db), listSubmissions(db, filters)]);
  const filtered = filters.status !== "all" || filters.topic !== "all" || filters.q !== "";

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Hi {name.split(" ")[0]} 👋</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {stats.new === 0 ? "You're all caught up." : `${stats.new} new ${stats.new === 1 ? "enquiry needs" : "enquiries need"} a reply.`}
        </p>
      </div>

      <StatsCards stats={stats} />

      <section aria-labelledby="submissions-title" className="space-y-4">
        <h2 id="submissions-title" className="sr-only">
          Submissions
        </h2>
        <SubmissionsToolbar filters={filters} counts={stats} />
        <SubmissionsTable rows={rows} filtered={filtered} />
        {total > PAGE_SIZE && <Pagination filters={filters} total={total} pageCount={pageCount} basePath={ROUTES.admin} />}
      </section>
    </div>
  );
}
