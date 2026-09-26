import type { ComponentProps } from "react";
import type { VariantProps } from "class-variance-authority";

import { NavLink } from "@/components/layout/nav-link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ButtonLinkProps = ComponentProps<typeof NavLink> & VariantProps<typeof buttonVariants>;

/**
 * A `<NavLink>` (Next.js `<Link>` with same-page anchor handling) styled as a button. Use for navigation; use `<Button>` for actions.
 * `className` is merged with `cn` so overrides (colours, radius, size) win over variant defaults.
 */
export function ButtonLink({ variant, size, className, ...props }: ButtonLinkProps) {
  return <NavLink className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
