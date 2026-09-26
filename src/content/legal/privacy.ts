import { APP_NAME, LEGAL, SITE } from "@/config/site";

import type { LegalDocument } from "./types";

/**
 * Privacy Policy. It describes the processing this codebase actually performs
 * (contact form → Supabase, notifications → Resend, hashed IPs for rate limiting,
 * essential auth cookies for the admin area). Have it reviewed by counsel and
 * update it whenever data flows change.
 */
export const PRIVACY_POLICY: LegalDocument = {
  title: "Privacy Policy",
  description: `How ${APP_NAME} collects, uses and protects your personal information.`,
  lastUpdated: LEGAL.lastUpdated,
  summary: [
    "We only collect what you choose to send us, plus minimal technical data needed to keep the service secure.",
    "We never sell your personal information, and we don't use advertising or cross-site tracking cookies.",
    "Your data is stored with trusted providers and you can ask us to access, correct or delete it at any time.",
  ],
  sections: [
    {
      id: "who-we-are",
      title: "Who we are",
      blocks: [
        {
          type: "p",
          text: `${LEGAL.entityName} ("${APP_NAME}", "we", "us") operates ${SITE.url}. We are the controller of the personal information described in this policy. You can reach us at ${LEGAL.privacyEmail} or by post at ${LEGAL.address}.`,
        },
      ],
    },
    {
      id: "information-we-collect",
      title: "Information we collect",
      blocks: [
        { type: "p", text: "When you contact us through our website form, we collect the information you provide:" },
        {
          type: "list",
          items: [
            "Your first and last name and work email address (required).",
            "Your company, job title, phone number and company size (optional).",
            "The topic of your enquiry and the message you write.",
            "A record that you agreed to this policy when submitting the form.",
          ],
        },
        { type: "p", text: "We also collect limited technical information automatically:" },
        {
          type: "list",
          items: [
            "A one-way, salted hash of your IP address. We never store your raw IP address; the hash only lets us limit abusive submissions.",
            "Your browser's user-agent string, to help us detect spam and diagnose problems.",
            "Standard server logs kept by our hosting provider for security and reliability.",
          ],
        },
      ],
    },
    {
      id: "how-we-use-information",
      title: "How we use your information",
      blocks: [
        {
          type: "definitions",
          items: [
            { term: "To respond to you", description: "We use your contact details and message to reply to your enquiry and follow up on it. Legal basis: steps taken at your request prior to a contract, and our legitimate interest in responding to enquiries." },
            { term: "To protect our service", description: "We use hashed IPs and user-agent data to prevent spam, fraud and abuse. Legal basis: our legitimate interest in keeping our service secure." },
            { term: "To meet legal obligations", description: "We may retain or disclose information where required by law. Legal basis: compliance with a legal obligation." },
          ],
        },
        { type: "p", text: "We do not use your information for automated decision-making, and we will not add you to marketing lists without your separate consent." },
      ],
    },
    {
      id: "sharing",
      title: "How we share information",
      blocks: [
        { type: "p", text: "We share personal information only with service providers who process it on our behalf under written agreements:" },
        {
          type: "definitions",
          items: [
            { term: "Supabase", description: "Database hosting where contact submissions are stored." },
            { term: "Resend", description: "Email delivery for notifying our team about your enquiry and, where enabled, sending you a confirmation." },
            { term: "Hosting provider", description: "Serves the website and processes technical logs." },
          ],
        },
        { type: "p", text: "We may also disclose information if required by law, to protect our rights, or as part of a merger or acquisition, in which case we will notify you. We never sell or rent your personal information." },
      ],
    },
    {
      id: "international-transfers",
      title: "International transfers",
      blocks: [
        { type: "p", text: "Our providers may process data outside your country. Where required, we rely on appropriate safeguards such as the European Commission's Standard Contractual Clauses." },
      ],
    },
    {
      id: "retention",
      title: "How long we keep information",
      blocks: [
        {
          type: "list",
          items: [
            "Contact submissions: up to 24 months after our last interaction with you, unless we enter into a customer relationship.",
            "Submissions identified as spam: deleted within 30 days.",
            "Hashed IP data: kept with the related submission and deleted with it.",
          ],
        },
      ],
    },
    {
      id: "security",
      title: "Security",
      blocks: [
        { type: "p", text: "We use industry-standard measures to protect your information, including:" },
        {
          type: "list",
          items: [
            "Encryption in transit (HTTPS/TLS) and at rest with our database provider.",
            "Row-level security so that public keys cannot read or change stored submissions.",
            "Access to submissions restricted to authorised team members with individual accounts.",
            "Rate limiting and spam protection on public forms.",
          ],
        },
        { type: "p", text: `No method of transmission or storage is completely secure. If you believe your information has been compromised, please contact ${LEGAL.privacyEmail} immediately.` },
      ],
    },
    {
      id: "cookies",
      title: "Cookies",
      blocks: [
        { type: "p", text: "Our public website does not use advertising, analytics or cross-site tracking cookies. Authorised team members who sign in to our admin area receive strictly necessary session cookies that keep them signed in securely. If we add optional cookies in future, we will ask for your consent first." },
      ],
    },
    {
      id: "your-rights",
      title: "Your rights",
      blocks: [
        { type: "p", text: "Depending on where you live (for example under the GDPR, UK GDPR or CCPA), you may have the right to:" },
        {
          type: "list",
          items: [
            "Access the personal information we hold about you.",
            "Correct inaccurate or incomplete information.",
            "Delete your information.",
            "Object to or restrict certain processing.",
            "Receive your information in a portable format.",
            "Withdraw consent at any time, where processing is based on consent.",
            "Lodge a complaint with your local data protection authority.",
          ],
        },
        { type: "p", text: `To exercise any of these rights, email ${LEGAL.privacyEmail}. We will respond within 30 days and will not discriminate against you for exercising your rights.` },
      ],
    },
    {
      id: "children",
      title: "Children",
      blocks: [
        { type: "p", text: "Our services are intended for businesses and are not directed to children under 16. We do not knowingly collect personal information from children." },
      ],
    },
    {
      id: "changes",
      title: "Changes to this policy",
      blocks: [
        { type: "p", text: "We may update this policy from time to time. We will change the \"Last updated\" date above and, for material changes, provide more prominent notice." },
      ],
    },
  ],
};
