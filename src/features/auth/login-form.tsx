"use client";

import { useActionState, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { AlertCircle, ArrowRight, Eye, EyeOff, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "@/features/auth/actions";
import type { SignInState } from "@/features/auth/schema";

const INITIAL: SignInState = { status: "idle" };

type LoginFormProps = {
  next: string;
  /** Message from the URL, e.g. after being bounced from /admin. */
  notice?: string;
};

export function LoginForm({ next, notice }: LoginFormProps) {
  const [state, action, pending] = useActionState(signIn, INITIAL);
  const [showPassword, setShowPassword] = useState(false);

  const error = state.status === "error" ? state : null;
  const message = error?.message ?? notice;

  return (
    <form action={action} className="grid gap-5" noValidate>
      <input type="hidden" name="next" value={next} />

      <div role="alert" aria-live="assertive" className="empty:hidden">
        <AnimatePresence initial={false}>
          {message && (
            <motion.p
              key={message}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-start gap-2.5 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive"
            >
              <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden />
              {message}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="username"
          autoFocus
          required
          defaultValue={error?.email}
          aria-invalid={error?.fieldErrors?.email ? true : undefined}
          aria-describedby={error?.fieldErrors?.email ? "email-error" : undefined}
          className="h-11 px-3"
        />
        {error?.fieldErrors?.email && (
          <p id="email-error" className="text-xs text-destructive">
            {error.fieldErrors.email}
          </p>
        )}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            required
            aria-invalid={error?.fieldErrors?.password ? true : undefined}
            aria-describedby={error?.fieldErrors?.password ? "password-error" : undefined}
            className="h-11 pr-11 pl-3"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            aria-pressed={showPassword}
            className="absolute inset-y-0 right-0 grid w-11 place-items-center rounded-r-lg text-muted-foreground transition-colors hover:text-foreground"
          >
            {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
        {error?.fieldErrors?.password && (
          <p id="password-error" className="text-xs text-destructive">
            {error.fieldErrors.password}
          </p>
        )}
      </div>

      <Button type="submit" size="lg" disabled={pending} className="group mt-2 h-11 rounded-full">
        {pending ? (
          <>
            <Loader2 className="animate-spin" /> Signing in…
          </>
        ) : (
          <>
            Sign in <ArrowRight className="transition-transform group-hover:translate-x-0.5" />
          </>
        )}
      </Button>
    </form>
  );
}
