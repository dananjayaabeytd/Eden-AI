/**
 * Legal documents are plain data rendered by `features/legal/legal-document.tsx`,
 * so wording can change without touching layout code.
 */

export type LegalBlock =
  | { type: "p"; text: string }
  | { type: "list"; items: readonly string[] }
  | { type: "definitions"; items: readonly { term: string; description: string }[] };

export type LegalSection = {
  /** Stable anchor id — safe to deep-link (e.g. `/privacy#security`). */
  id: string;
  title: string;
  blocks: readonly LegalBlock[];
};

export type LegalDocument = {
  title: string;
  description: string;
  lastUpdated: string;
  /** Plain-language summary shown above the full text. */
  summary: readonly string[];
  sections: readonly LegalSection[];
};
