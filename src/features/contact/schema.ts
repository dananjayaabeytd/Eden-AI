import { z } from "zod";

/**
 * Contact form contract, shared by the client (instant feedback) and the
 * server action (source of truth). Never trust client-side validation alone.
 */

export const CONTACT_TOPICS = [
  { value: "sales", label: "Sales & pricing" },
  { value: "demo", label: "Book a demo" },
  { value: "support", label: "Technical support" },
  { value: "partnership", label: "Partnerships" },
  { value: "press", label: "Press & media" },
  { value: "other", label: "Something else" },
] as const;

export const COMPANY_SIZES = [
  { value: "1-10", label: "1–10 employees" },
  { value: "11-50", label: "11–50 employees" },
  { value: "51-200", label: "51–200 employees" },
  { value: "201-1000", label: "201–1,000 employees" },
  { value: "1000+", label: "1,000+ employees" },
] as const;

export const MESSAGE_LIMITS = { min: 20, max: 5000 } as const;

type Values<T extends readonly { value: string }[]> = T[number]["value"];
const topicValues = CONTACT_TOPICS.map((t) => t.value) as [Values<typeof CONTACT_TOPICS>, ...Values<typeof CONTACT_TOPICS>[]];
const sizeValues = COMPANY_SIZES.map((s) => s.value) as [Values<typeof COMPANY_SIZES>, ...Values<typeof COMPANY_SIZES>[]];

/** Optional free-text field: trims, caps length and stores empty input as `null`. */
const optionalText = (max: number, label: string) =>
  z
    .string()
    .trim()
    .max(max, `${label} must be ${max} characters or fewer.`)
    .transform((v) => (v === "" ? null : v));

export const contactSchema = z.object({
  firstName: z.string().trim().min(1, "Please enter your first name.").max(80, "First name is too long."),
  lastName: z.string().trim().min(1, "Please enter your last name.").max(80, "Last name is too long."),
  email: z.string().trim().toLowerCase().pipe(z.email("Please enter a valid email address.").max(254)),
  company: optionalText(120, "Company"),
  jobTitle: optionalText(120, "Job title"),
  phone: z
    .string()
    .trim()
    .refine((v) => v === "" || /^\+?[\d\s().-]{7,20}$/.test(v), "Please enter a valid phone number.")
    .transform((v) => (v === "" ? null : v)),
  companySize: z
    .union([z.enum(sizeValues), z.literal("")])
    .transform((v) => (v === "" ? null : v)),
  topic: z.enum(topicValues, "Please choose what this is about."),
  message: z
    .string()
    .trim()
    .min(MESSAGE_LIMITS.min, `Please share a bit more detail (at least ${MESSAGE_LIMITS.min} characters).`)
    .max(MESSAGE_LIMITS.max, `Message must be ${MESSAGE_LIMITS.max} characters or fewer.`),
  consent: z.literal("on", "Please agree to the privacy policy so we can reply."),
});

export type ContactInput = z.output<typeof contactSchema>;
export type ContactField = keyof z.input<typeof contactSchema>;

export const CONTACT_FIELDS = Object.keys(contactSchema.shape) as ContactField[];

/** Names of the anti-spam fields rendered alongside the real ones. */
export const HONEYPOT_FIELD = "website";
export const STARTED_AT_FIELD = "startedAt";

/** Reads the form's fields as plain strings (missing → ""), ignoring anything unexpected. */
export function readContactForm(formData: FormData): Record<ContactField, string> {
  return Object.fromEntries(
    CONTACT_FIELDS.map((field) => {
      const value = formData.get(field);
      return [field, typeof value === "string" ? value : ""];
    }),
  ) as Record<ContactField, string>;
}

export type FieldErrors = Partial<Record<ContactField, string>>;

/** First error message per field, in a shape that's easy to render. */
export function toFieldErrors(error: z.ZodError): FieldErrors {
  const { fieldErrors } = z.flattenError(error);
  return Object.fromEntries(
    Object.entries(fieldErrors).map(([field, messages]) => [field, (messages as string[] | undefined)?.[0]]),
  ) as FieldErrors;
}

export type ContactFormState =
  | { status: "idle" }
  | { status: "success"; firstName: string }
  | {
      status: "error";
      message: string;
      fieldErrors?: FieldErrors;
      /** Echoed back so the form keeps the user's input after a failed submit. */
      values?: Partial<Record<ContactField, string>>;
    };
