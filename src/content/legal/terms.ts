import { APP_NAME, LEGAL, ROUTES, SITE } from "@/config/site";

import type { LegalDocument } from "./types";

/** Terms of Service. A sensible SaaS baseline — have it reviewed by counsel before launch. */
export const TERMS_OF_SERVICE: LegalDocument = {
  title: "Terms of Service",
  description: `The terms that govern your use of ${APP_NAME}'s website and services.`,
  lastUpdated: LEGAL.lastUpdated,
  summary: [
    `By using ${APP_NAME}, you agree to these terms. If you use it on behalf of a company, you confirm you're authorised to accept them for that company.`,
    "You own your content. We only use it to provide and improve the service for you.",
    "Use the service lawfully and responsibly; we may suspend accounts that put others at risk.",
  ],
  sections: [
    {
      id: "acceptance",
      title: "Acceptance of these terms",
      blocks: [
        { type: "p", text: `These Terms of Service ("Terms") form an agreement between you and ${LEGAL.entityName} ("${APP_NAME}", "we", "us") covering your use of ${SITE.url} and any related products and services (the "Service"). If you do not agree, do not use the Service.` },
      ],
    },
    {
      id: "accounts",
      title: "Accounts",
      blocks: [
        {
          type: "list",
          items: [
            "You must provide accurate information and keep it up to date.",
            "You are responsible for keeping your credentials secure and for all activity under your account.",
            "Tell us immediately about any unauthorised access to your account.",
          ],
        },
      ],
    },
    {
      id: "acceptable-use",
      title: "Acceptable use",
      blocks: [
        { type: "p", text: "You agree not to:" },
        {
          type: "list",
          items: [
            "Break any law or infringe anyone's rights, including intellectual property and privacy rights.",
            "Upload malware or attempt to disrupt, probe or gain unauthorised access to the Service.",
            "Use the Service to generate spam, harassment, or deceptive or harmful content.",
            "Reverse engineer the Service, or resell it without our written permission.",
            "Circumvent usage limits, rate limits or security measures.",
          ],
        },
      ],
    },
    {
      id: "your-content",
      title: "Your content",
      blocks: [
        { type: "p", text: "You keep all rights to the data and content you submit (\"Your Content\"). You grant us a limited licence to host, process and display Your Content solely to provide and improve the Service for you. You are responsible for having the rights needed to submit Your Content." },
      ],
    },
    {
      id: "ai-output",
      title: "AI-generated output",
      blocks: [
        { type: "p", text: "The Service uses artificial intelligence to produce suggestions and results (\"Output\"). Output may be inaccurate or incomplete. You are responsible for reviewing Output before relying on it, especially for legal, medical, financial or safety-critical decisions." },
      ],
    },
    {
      id: "fees",
      title: "Plans, fees and cancellation",
      blocks: [
        {
          type: "list",
          items: [
            "Paid plans are billed in advance on a monthly or annual basis and are non-refundable except where required by law.",
            "We may change prices with at least 30 days' notice; changes apply from your next billing period.",
            "You can cancel at any time. Your plan stays active until the end of the current billing period.",
          ],
        },
      ],
    },
    {
      id: "intellectual-property",
      title: "Our intellectual property",
      blocks: [
        { type: "p", text: `The Service, including its software, design and branding, is owned by ${LEGAL.entityName} and protected by law. These Terms do not grant you any rights to our trademarks or brand features.` },
      ],
    },
    {
      id: "privacy",
      title: "Privacy",
      blocks: [
        { type: "p", text: `Our Privacy Policy (${SITE.url}${ROUTES.privacy}) explains how we handle personal information and forms part of these Terms.` },
      ],
    },
    {
      id: "termination",
      title: "Suspension and termination",
      blocks: [
        { type: "p", text: "We may suspend or terminate your access if you materially breach these Terms, if required by law, or to protect the Service or other users. Where reasonable, we will give notice and an opportunity to fix the issue first." },
      ],
    },
    {
      id: "disclaimers",
      title: "Disclaimers",
      blocks: [
        { type: "p", text: "The Service is provided \"as is\" and \"as available\". To the fullest extent permitted by law, we disclaim all warranties, express or implied, including merchantability, fitness for a particular purpose and non-infringement." },
      ],
    },
    {
      id: "liability",
      title: "Limitation of liability",
      blocks: [
        { type: "p", text: "To the fullest extent permitted by law, we will not be liable for any indirect, incidental, special, consequential or punitive damages, or for any loss of profits or data. Our total liability for any claim is limited to the amount you paid us in the 12 months before the claim arose." },
      ],
    },
    {
      id: "governing-law",
      title: "Governing law",
      blocks: [
        { type: "p", text: `These Terms are governed by the laws of ${LEGAL.jurisdiction}, without regard to its conflict-of-law rules. Mandatory consumer protection laws of your country of residence still apply.` },
      ],
    },
    {
      id: "changes",
      title: "Changes to these terms",
      blocks: [
        { type: "p", text: "We may update these Terms. For material changes we will give at least 30 days' notice. Continuing to use the Service after changes take effect means you accept the updated Terms." },
      ],
    },
    {
      id: "contact",
      title: "Contact",
      blocks: [
        { type: "p", text: `Questions about these Terms? Email ${SITE.email} or write to ${LEGAL.address}.` },
      ],
    },
  ],
};
