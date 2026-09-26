import type { Metadata } from "next";
import Image from "next/image";
import { redirect } from "next/navigation";

import { Logo } from "@/components/brand/logo";
import { NavLink } from "@/components/layout/nav-link";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { APP_NAME } from "@/config/site";
import { PHOTOS } from "@/content/images";
import { LoginForm } from "@/features/auth/login-form";
import { getSession, safeReturnPath } from "@/server/auth/session";

export const metadata: Metadata = {
  title: "Sign in",
  robots: { index: false, follow: false },
};

const NOTICES: Record<string, string> = {
  forbidden: "This account doesn't have access to the admin dashboard.",
  unconfigured: "Sign-in isn't configured yet. Add the Supabase environment variables.",
};

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const params = await searchParams;
  const next = safeReturnPath(params.next);

  // Already signed in as an admin? Skip the form.
  const session = await getSession();
  if (session.status === "admin") redirect(next);

  const errorKey = typeof params.error === "string" ? params.error : undefined;

  return (
    <main id="main" className="grid min-h-svh flex-1 lg:grid-cols-2">
      <div className="flex flex-col px-6 py-8 sm:px-12">
        <div className="flex items-center justify-between">
          <Logo />
          <ThemeToggle />
        </div>
        <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center py-16">
          <p className="font-mono text-xs tracking-[0.2em] text-muted-foreground uppercase">Admin</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight">Welcome back</h1>
          <p className="mt-2 text-sm text-muted-foreground">Sign in to manage enquiries and your workspace.</p>
          <div className="mt-8">
            <LoginForm next={next} notice={errorKey ? NOTICES[errorKey] : undefined} />
          </div>
          <p className="mt-8 text-xs text-muted-foreground">
            Access is limited to authorised team members. Need an account? Ask an existing admin.
          </p>
        </div>
        <NavLink href="/" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
          ← Back to {APP_NAME}
        </NavLink>
      </div>

      <div className="relative hidden overflow-hidden lg:block">
        <Image src={PHOTOS.cinqueTerre.src} alt="" fill preload placeholder="blur" sizes="50vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        <blockquote className="absolute inset-x-0 bottom-0 p-12 text-white">
          <p className="max-w-md text-2xl leading-snug font-medium tracking-tight text-balance">
            &ldquo;Every enquiry answered, every lead followed up. It&apos;s our calmest inbox yet.&rdquo;
          </p>
          <footer className="mt-4 text-sm text-white/75">Maya Chen · Head of Product, Northwind</footer>
        </blockquote>
      </div>
    </main>
  );
}
