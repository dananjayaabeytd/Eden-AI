import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: string;
  className?: string;
};

export function SectionHeading({ eyebrow, title, description, className }: SectionHeadingProps) {
  return (
    <Reveal className={cn("mx-auto max-w-2xl text-center", className)}>
      <p className="font-mono text-xs tracking-[0.2em] text-muted-foreground uppercase">{eyebrow}</p>
      <h2 className="mt-4 text-3xl font-semibold tracking-tight text-balance sm:text-5xl">{title}</h2>
      {description && (
        <p className="mt-4 text-base text-pretty text-muted-foreground sm:text-lg">{description}</p>
      )}
    </Reveal>
  );
}
