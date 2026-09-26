import { ContactSection } from "@/features/contact/contact-section";
import { Cta } from "@/features/landing/cta";
import { Faq } from "@/features/landing/faq";
import { Features } from "@/features/landing/features";
import { Hero } from "@/features/landing/hero";
import { HowItWorks } from "@/features/landing/how-it-works";
import { LogoCloud } from "@/features/landing/logo-cloud";
import { Pricing } from "@/features/landing/pricing";
import { Showcase } from "@/features/landing/showcase";
import { Stats } from "@/features/landing/stats";
import { Testimonials } from "@/features/landing/testimonials";

export default function HomePage() {
  return (
    <>
      <Hero />
      <LogoCloud />
      <Features />
      <HowItWorks />
      <Showcase />
      <Stats />
      <Testimonials />
      <Pricing />
      <Faq />
      <ContactSection />
      <Cta />
    </>
  );
}
