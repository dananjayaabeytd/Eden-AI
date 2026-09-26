import type { ComponentProps } from "react";
import Link from "next/link";
import type { VariantProps } from "class-variance-authority";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ButtonLinkProps = ComponentProps<typeof Link> & VariantProps<typeof buttonVariants>;

/**
 * A Next.js `<Link>` styled as a button. Use for navigation; use `<Button>` for actions.
 * `className` is merged with `cn` so overrides (colours, radius, size) win over variant defaults.
 */
export function ButtonLink({ variant, size, className, ...props }: ButtonLinkProps) {
  return <Link className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
