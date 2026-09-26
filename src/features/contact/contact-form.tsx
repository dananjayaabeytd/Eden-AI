"use client";

import { useActionState, useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { AlertCircle, ArrowRight, Check, CheckCircle2, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { Textarea } from "@/components/ui/textarea";
import { ROUTES } from "@/config/site";
import { submitContact } from "@/features/contact/actions";
import {
  COMPANY_SIZES,
  CONTACT_FIELDS,
  CONTACT_TOPICS,
  HONEYPOT_FIELD,
  MESSAGE_LIMITS,
  STARTED_AT_FIELD,
  contactSchema,
  readContactForm,
  toFieldErrors,
  type ContactField,
  type ContactFormState,
  type FieldErrors,
} from "@/features/contact/schema";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

const INITIAL_STATE: ContactFormState = { status: "idle" };

const CONTROL = "h-11 px-3 text-sm bg-background";

/**
 * Contact form. Works without JavaScript (native form post to the Server Action);
 * with JavaScript it adds instant validation, pending state and an animated success view.
 */
export function ContactForm() {
  // Remounting the inner form is the cleanest way to reset action state for "send another".
  const [instance, setInstance] = useState(0);
  return <ContactFormInner key={instance} onReset={() => setInstance((n) => n + 1)} />;
}

function ContactFormInner({ onReset }: { onReset: () => void }) {
  const [state, formAction, pending] = useActionState(submitContact, INITIAL_STATE);
  const [clientErrors, setClientErrors] = useState<FieldErrors | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const startedAtRef = useRef<HTMLInputElement>(null);

  const values = state.status === "error" ? (state.values ?? {}) : {};
  const errors: FieldErrors = clientErrors ?? (state.status === "error" ? (state.fieldErrors ?? {}) : {});
  const [messageLength, setMessageLength] = useState(values.message?.length ?? 0);

  // Timestamp for the server's "too fast to be human" check. Set on the client, never at build time.
  useEffect(() => {
    if (startedAtRef.current) startedAtRef.current.value = String(Date.now());
  }, []);

  // Move focus to the first field the server rejected.
  useEffect(() => {
    if (state.status === "error" && state.fieldErrors) focusFirstError(formRef.current, state.fieldErrors);
  }, [state]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    const result = contactSchema.safeParse(readContactForm(new FormData(event.currentTarget)));
    if (result.success) {
      setClientErrors(null);
      return; // Let the Server Action run.
    }
    event.preventDefault();
    const fieldErrors = toFieldErrors(result.error);
    setClientErrors(fieldErrors);
    focusFirstError(event.currentTarget, fieldErrors);
  };

  // Clear a field's error as soon as the user edits it.
  const handleChange = (event: FormEvent<HTMLFormElement>) => {
    const name = (event.target as HTMLInputElement).name as ContactField;
    if (name === "message") setMessageLength((event.target as HTMLTextAreaElement).value.length);
    if (errors[name]) setClientErrors({ ...errors, [name]: undefined });
  };

  return (
    <AnimatePresence mode="wait" initial={false}>
      {state.status === "success" ? (
        <SuccessView key="success" firstName={state.firstName} onReset={onReset} />
      ) : (
        <motion.form
          key="form"
          ref={formRef}
          action={formAction}
          onSubmit={handleSubmit}
          onChange={handleChange}
          noValidate
          aria-describedby="contact-form-status"
          exit={{ opacity: 0, y: -12, filter: "blur(4px)" }}
          transition={{ duration: 0.3, ease: EASE.out }}
          className="grid gap-5 sm:grid-cols-2"
        >
          <FormStatus state={state} />

          <Field name="firstName" label="First name" required error={errors.firstName}>
            <Input {...controlProps("firstName", errors)} autoComplete="given-name" defaultValue={values.firstName} className={CONTROL} />
          </Field>
          <Field name="lastName" label="Last name" required error={errors.lastName}>
            <Input {...controlProps("lastName", errors)} autoComplete="family-name" defaultValue={values.lastName} className={CONTROL} />
          </Field>
          <Field name="email" label="Work email" required error={errors.email} className="sm:col-span-2">
            <Input
              {...controlProps("email", errors)}
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="you@company.com"
              defaultValue={values.email}
              className={CONTROL}
            />
          </Field>
          <Field name="company" label="Company" error={errors.company}>
            <Input {...controlProps("company", errors)} autoComplete="organization" defaultValue={values.company} className={CONTROL} />
          </Field>
          <Field name="jobTitle" label="Job title" error={errors.jobTitle}>
            <Input {...controlProps("jobTitle", errors)} autoComplete="organization-title" defaultValue={values.jobTitle} className={CONTROL} />
          </Field>
          <Field name="phone" label="Phone" error={errors.phone}>
            <Input
              {...controlProps("phone", errors)}
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder="+1 555 000 0000"
              defaultValue={values.phone}
              className={CONTROL}
            />
          </Field>
          <Field name="companySize" label="Company size" error={errors.companySize}>
            <NativeSelect
              {...controlProps("companySize", errors)}
              defaultValue={values.companySize ?? ""}
              className="w-full [&_select]:h-11 [&_select]:bg-background [&_select]:px-3"
            >
              <NativeSelectOption value="">Select size</NativeSelectOption>
              {COMPANY_SIZES.map((o) => (
                <NativeSelectOption key={o.value} value={o.value}>
                  {o.label}
                </NativeSelectOption>
              ))}
            </NativeSelect>
          </Field>
          <Field name="topic" label="What can we help with?" required error={errors.topic} className="sm:col-span-2">
            <NativeSelect
              {...controlProps("topic", errors)}
              defaultValue={values.topic ?? ""}
              className="w-full [&_select]:h-11 [&_select]:bg-background [&_select]:px-3"
            >
              <NativeSelectOption value="" disabled>
                Choose a topic
              </NativeSelectOption>
              {CONTACT_TOPICS.map((o) => (
                <NativeSelectOption key={o.value} value={o.value}>
                  {o.label}
                </NativeSelectOption>
              ))}
            </NativeSelect>
          </Field>
          <Field
            name="message"
            label="Message"
            required
            error={errors.message}
            className="sm:col-span-2"
            hint={
              <span className={cn("tabular-nums", messageLength > MESSAGE_LIMITS.max && "text-destructive")}>
                {messageLength.toLocaleString()} / {MESSAGE_LIMITS.max.toLocaleString()}
              </span>
            }
          >
            <Textarea
              {...controlProps("message", errors)}
              rows={6}
              placeholder="Tell us about your team, what you're trying to achieve and any timelines."
              defaultValue={values.message}
              className="min-h-36 resize-y bg-background px-3 py-2.5 text-sm"
            />
          </Field>

          <ConsentField error={errors.consent} defaultChecked={values.consent === "on"} />

          {/* Anti-spam: invisible to people and assistive tech, tempting to bots. */}
          <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
            <label>
              Website
              <input type="text" name={HONEYPOT_FIELD} tabIndex={-1} autoComplete="off" />
            </label>
          </div>
          <input ref={startedAtRef} type="hidden" name={STARTED_AT_FIELD} />

          <div className="flex flex-col-reverse items-start gap-4 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-muted-foreground">
              Fields marked <span aria-hidden>*</span>
              <span className="sr-only">with an asterisk</span> are required.
            </p>
            <Button type="submit" size="lg" disabled={pending} className="group h-11 w-full rounded-full px-6 sm:w-auto">
              {pending ? (
                <>
                  <Loader2 className="animate-spin" /> Sending…
                </>
              ) : (
                <>
                  Send message
                  <ArrowRight className="transition-transform group-hover:translate-x-0.5" />
                </>
              )}
            </Button>
          </div>
        </motion.form>
      )}
    </AnimatePresence>
  );
}

function controlProps(name: ContactField, errors: FieldErrors) {
  return {
    id: name,
    name,
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? `${name}-error` : undefined,
  };
}

function focusFirstError(form: HTMLFormElement | null, errors: FieldErrors) {
  const first = CONTACT_FIELDS.find((f) => errors[f]);
  const el = first && form?.elements.namedItem(first);
  if (el instanceof HTMLElement) el.focus();
}

type FieldProps = {
  name: ContactField;
  label: string;
  required?: boolean;
  error?: string;
  hint?: ReactNode;
  className?: string;
  children: ReactNode;
};

function Field({ name, label, required, error, hint, className, children }: FieldProps) {
  return (
    <div className={cn("grid content-start gap-2", className)}>
      <div className="flex items-center justify-between gap-2">
        <Label htmlFor={name}>
          {label}
          {required && (
            <span aria-hidden className="-ml-1 text-muted-foreground">
              *
            </span>
          )}
        </Label>
        {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
      </div>
      {children}
      <FieldError id={`${name}-error`} message={error} />
    </div>
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  return (
    <AnimatePresence initial={false}>
      {message && (
        <motion.p
          id={id}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
          className="flex items-center gap-1.5 overflow-hidden text-xs text-destructive"
        >
          <AlertCircle className="size-3.5 shrink-0" aria-hidden />
          {message}
        </motion.p>
      )}
    </AnimatePresence>
  );
}

function ConsentField({ error, defaultChecked }: { error?: string; defaultChecked: boolean }) {
  return (
    <div className="grid gap-2 sm:col-span-2">
      <label htmlFor="consent" className="flex cursor-pointer items-start gap-3 text-sm text-muted-foreground">
        <span className="relative mt-0.5 grid size-4 shrink-0 place-items-center">
          <input
            id="consent"
            name="consent"
            type="checkbox"
            defaultChecked={defaultChecked}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? "consent-error" : undefined}
            className="peer size-4 cursor-pointer appearance-none rounded-[4px] border border-input bg-background transition-colors checked:border-primary checked:bg-primary focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none aria-invalid:border-destructive"
          />
          <Check
            aria-hidden
            className="pointer-events-none absolute size-3 text-primary-foreground opacity-0 transition-opacity peer-checked:opacity-100"
          />
        </span>
        <span>
          I agree to the processing of my information to respond to this enquiry, as described in the{" "}
          <a href={ROUTES.privacy} target="_blank" rel="noopener" className="font-medium text-foreground underline underline-offset-4">
            privacy policy
          </a>
          . <span aria-hidden>*</span>
        </span>
      </label>
      <FieldError id="consent-error" message={error} />
    </div>
  );
}

function FormStatus({ state }: { state: ContactFormState }) {
  const message = state.status === "error" ? state.message : null;
  return (
    <div id="contact-form-status" role="alert" aria-live="assertive" className="sm:col-span-2 empty:hidden">
      <AnimatePresence initial={false}>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive"
          >
            <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden />
            {message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SuccessView({ firstName, onReset }: { firstName: string; onReset: () => void }) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => headingRef.current?.focus(), []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.5, ease: EASE.out }}
      className="flex min-h-[420px] flex-col items-center justify-center text-center"
      role="status"
    >
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.1 }}
        className="grid size-14 place-items-center rounded-full bg-primary text-primary-foreground"
      >
        <CheckCircle2 className="size-7" aria-hidden />
      </motion.div>
      <h3 ref={headingRef} tabIndex={-1} className="mt-6 text-2xl font-semibold tracking-tight outline-none">
        Thanks, {firstName}!
      </h3>
      <p className="mt-2 max-w-sm text-muted-foreground">
        Your message is on its way. We usually reply within one business day.
      </p>
      <Button variant="outline" size="lg" onClick={onReset} className="mt-8 h-11 rounded-full px-6">
        Send another message
      </Button>
    </motion.div>
  );
}
