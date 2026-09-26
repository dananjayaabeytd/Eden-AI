import { z } from "zod";

export const signInSchema = z.object({
  email: z.string().trim().toLowerCase().pipe(z.email("Enter a valid email address.")),
  password: z.string().min(1, "Enter your password.").max(200),
});

export type SignInField = keyof z.input<typeof signInSchema>;

export type SignInState =
  | { status: "idle" }
  | { status: "error"; message: string; fieldErrors?: Partial<Record<SignInField, string>>; email?: string };
