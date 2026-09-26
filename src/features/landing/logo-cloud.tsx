import { Container } from "@/components/layout/container";
import { Marquee } from "@/components/motion/marquee";
import { LOGOS } from "@/content/landing";

export function LogoCloud() {
  return (
    <section aria-label="Trusted by" className="py-12">
      <Container>
        <p className="text-center text-sm text-muted-foreground">Trusted by fast-moving teams worldwide</p>
        <Marquee className="mt-8" duration={35}>
          {LOGOS.map((name) => (
            <span
              key={name}
              className="shrink-0 text-2xl font-semibold tracking-tight text-foreground/35 transition-colors hover:text-foreground"
            >
              {name}
            </span>
          ))}
        </Marquee>
      </Container>
    </section>
  );
}
