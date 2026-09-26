"use client";

import type { ComponentProps } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * A `<Link>` that understands same-page section anchors.
 * Config uses page-absolute anchors like `/#pricing` so they work from any page;
 * when you're already on that page they become `#pricing`, so smooth scrolling
 * handles them instead of a navigation.
 */
export function NavLink({ href, ...props }: ComponentProps<typeof Link> & { href: string }) {
  const pathname = usePathname();
  const [path, hash] = href.split("#");
  const resolved = hash !== undefined && (path === "" || path === pathname) ? `#${hash}` : href;
  return <Link href={resolved} {...props} />;
}
