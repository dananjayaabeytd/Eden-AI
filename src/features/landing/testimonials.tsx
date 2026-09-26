import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/layout/section-heading";
import { Marquee } from "@/components/motion/marquee";
import { TESTIMONIALS } from "@/content/landing";

type Testimonial = (typeof TESTIMONIALS)[number];

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("");
}

function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <figure className="w-[340px] shrink-0 rounded-2xl border bg-card p-6">
      <blockquote className="text-[15px] leading-relaxed">“{t.quote}”</blockquote>
      <figcaption className="mt-6 flex items-center gap-3">
        <span className="grid size-9 place-items-center rounded-full bg-muted text-xs font-semibold">
          {initials(t.name)}
        </span>
        <span>
          <span className="block text-sm font-medium">{t.name}</span>
          <span className="block text-xs text-muted-foreground">{t.role}</span>
        </span>
      </figcaption>
    </figure>
  );
}

export function Testimonials() {
  const half = Math.ceil(TESTIMONIALS.length / 2);

  return (
    <section aria-label="Testimonials" className="overflow-hidden py-24 sm:py-32">
      <Container>
        <SectionHeading eyebrow="Loved by teams" title="Don't take our word for it." />
      </Container>
      <div className="mt-16 space-y-4">
        <Marquee duration={50}>
          {TESTIMONIALS.slice(0, half).map((t) => (
            <TestimonialCard key={t.name} t={t} />
          ))}
        </Marquee>
        <Marquee duration={50} reverse>
          {TESTIMONIALS.slice(half).map((t) => (
            <TestimonialCard key={t.name} t={t} />
          ))}
        </Marquee>
      </div>
    </section>
  );
}
