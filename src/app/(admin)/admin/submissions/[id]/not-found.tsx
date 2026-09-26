import { SearchX } from "lucide-react";

import { ButtonLink } from "@/components/ui/button-link";
import { ROUTES } from "@/config/site";

export default function SubmissionNotFound() {
  return (
    <div className="flex flex-col items-center rounded-2xl border bg-card px-6 py-20 text-center">
      <div className="grid size-12 place-items-center rounded-full bg-muted">
        <SearchX className="size-5 text-muted-foreground" aria-hidden />
      </div>
      <h1 className="mt-4 font-semibold">Submission not found</h1>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">It may have been deleted, or the link is incorrect.</p>
      <ButtonLink href={ROUTES.admin} variant="outline" size="lg" className="mt-6 h-10 rounded-full px-5">
        Back to submissions
      </ButtonLink>
    </div>
  );
}
