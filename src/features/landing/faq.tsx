import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/layout/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { FAQS } from "@/content/landing";

export function Faq() {
  return (
    <section id="faq" className="scroll-mt-24 bg-muted py-24 sm:py-32">
      <Container className="max-w-3xl">
        <SectionHeading eyebrow="FAQ" title="Questions, answered." />
        <Reveal className="mt-12">
          <Accordion className="rounded-2xl border bg-card px-6">
            {FAQS.map((faq) => (
              <AccordionItem key={faq.question} value={faq.question}>
                <AccordionTrigger className="py-5 text-base">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </Container>
    </section>
  );
}
