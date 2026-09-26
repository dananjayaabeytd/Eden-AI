import type { Metadata } from "next";

import { AdminShell } from "@/features/admin/shell/admin-shell";
import { requireAdmin } from "@/server/auth/session";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s · Admin" },
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  // Renders the shell; each page still calls `requireAdmin()` because layouts
  // don't re-run on client-side navigation.
  const session = await requireAdmin();
  return <AdminShell session={session}>{children}</AdminShell>;
}
