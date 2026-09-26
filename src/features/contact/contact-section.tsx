import { Container } from "@/components/layout/container";
import { ParallaxImage } from "@/components/motion/parallax-image";
import { Reveal } from "@/components/motion/reveal";
import { PHOTOS } from "@/content/images";
import { CONTACT } from "@/content/landing";
import { ContactForm } from "@/features/contact/contact-form";

export function ContactSection() {
  return (
    <section id="contact" aria-labelledby="contact-title" className="scroll-mt-24 py-24 sm:py-32">
      <Container className="grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
        <Reveal className="lg:pt-4">
          <p className="font-mono text-xs tracking-[0.2em] text-muted-foreground uppercase">{CONTACT.eyebrow}</p>
          <h2 id="contact-title" className="mt-4 text-3xl font-semibold tracking-tight text-balance sm:text-5xl">
            {CONTACT.title}
          </h2>
          <p className="mt-4 text-base text-pretty text-muted-foreground sm:text-lg">{CONTACT.description}</p>

          <dl className="mt-10 space-y-5">
            {CONTACT.channels.map(({ icon: Icon, label, value, ...rest }) => (
              <div key={label} className="flex items-center gap-4">
                <div className="grid size-11 shrink-0 place-items-center rounded-xl border bg-background shadow-xs">
                  <Icon className="size-5" aria-hidden />
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">{label}</dt>
                  <dd className="text-sm font-medium">
                    {"href" in rest ? (
                      <a href={rest.href} className="underline-offset-4 hover:underline">
                        {value}
                      </a>
                    ) : (
                      value
                    )}
                  </dd>
                </div>
              </div>
            ))}
          </dl>

          <div className="mt-10 rounded-2xl border bg-muted p-6">
            <h3 className="text-sm font-semibold">What happens next</h3>
            <ol className="mt-4 space-y-3">
              {CONTACT.nextSteps.map((step, i) => (
                <li key={step} className="flex gap-3 text-sm text-muted-foreground">
                  <span className="grid size-5 shrink-0 place-items-center rounded-full bg-background font-mono text-[10px] text-foreground">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </div>

          <figure data-cursor={PHOTOS.hongKong.city} className="relative mt-6 overflow-hidden rounded-2xl">
            <ParallaxImage
              photo={PHOTOS.hongKong}
              sizes="(min-width: 1024px) 420px, 100vw"
              className="aspect-[16/10]"
            />
            <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-5 pt-12 text-white">
              <p className="text-sm font-semibold">Teams in 40+ countries</p>
              <p className="text-xs text-white/75">Wherever you are, we&apos;re a message away.</p>
            </figcaption>
          </figure>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="relative rounded-3xl border bg-card p-6 shadow-[0_30px_80px_-40px_oklch(0_0_0/0.25)] sm:p-10">
            <ContactForm />
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
