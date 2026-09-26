import type { Metadata } from "next";

import { ROUTES } from "@/config/site";
import { PRIVACY_POLICY } from "@/content/legal/privacy";
import { LegalDocument } from "@/features/legal/legal-document";

export const metadata: Metadata = {
  title: PRIVACY_POLICY.title,
  description: PRIVACY_POLICY.description,
  alternates: { canonical: ROUTES.privacy },
};

export default function PrivacyPage() {
  return <LegalDocument doc={PRIVACY_POLICY} path={ROUTES.privacy} />;
}
