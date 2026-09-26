import type { Metadata } from "next";

import { ROUTES } from "@/config/site";
import { TERMS_OF_SERVICE } from "@/content/legal/terms";
import { LegalDocument } from "@/features/legal/legal-document";

export const metadata: Metadata = {
  title: TERMS_OF_SERVICE.title,
  description: TERMS_OF_SERVICE.description,
  alternates: { canonical: ROUTES.terms },
};

export default function TermsPage() {
  return <LegalDocument doc={TERMS_OF_SERVICE} path={ROUTES.terms} />;
}
