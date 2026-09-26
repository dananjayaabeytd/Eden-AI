import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { MarketingProviders } from "@/components/providers/marketing-providers";

export default function MarketingLayout({ children }: LayoutProps<"/">) {
  return (
    <MarketingProviders>
      <SiteHeader />
      <main id="main" className="flex-1">
        {children}
      </main>
      <SiteFooter />
    </MarketingProviders>
  );
}
