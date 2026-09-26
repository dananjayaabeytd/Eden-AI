import { Logo } from "@/components/brand/logo";
import { Container } from "@/components/layout/container";
import { ButtonLink } from "@/components/ui/button-link";

export default function NotFound() {
  return (
    <main id="main" className="flex flex-1 flex-col">
      <Container className="flex h-16 items-center">
        <Logo />
      </Container>
      <Container className="flex flex-1 flex-col items-center justify-center py-32 text-center">
        <p className="font-mono text-sm text-muted-foreground">404</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tighter sm:text-6xl">Page not found.</h1>
        <p className="mt-4 text-muted-foreground">The page you&apos;re looking for doesn&apos;t exist or has moved.</p>
        <ButtonLink href="/" size="lg" className="mt-10 h-11 rounded-full px-6">
          Back home
        </ButtonLink>
      </Container>
    </main>
  );
}
