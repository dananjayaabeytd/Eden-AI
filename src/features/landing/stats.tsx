import { Container } from "@/components/layout/container";
import { CountUp } from "@/components/motion/count-up";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { STATS } from "@/content/landing";

export function Stats() {
  return (
    <section aria-label="Key metrics" className="border-y py-20">
      <Container>
        <Stagger className="grid grid-cols-2 gap-y-12 md:grid-cols-4">
          {STATS.map((stat) => (
            <StaggerItem key={stat.label} className="text-center">
              <p className="text-4xl font-semibold tracking-tighter sm:text-6xl">
                <CountUp to={stat.value} suffix={stat.suffix} />
              </p>
              <p className="mt-2 text-sm text-muted-foreground">{stat.label}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}
