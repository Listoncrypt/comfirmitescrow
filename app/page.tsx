import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { HeroSection } from "@/components/sections/hero"
import { BenefitsSection } from "@/components/sections/benefits"
import { FeaturesSection } from "@/components/sections/features"
import { HowItWorksSection } from "@/components/sections/how-it-works"
import { SecuritySection } from "@/components/sections/security"
import { TestimonialsSection } from "@/components/sections/testimonials"
import { FAQSection } from "@/components/sections/faq"
import { BlogSection } from "@/components/sections/blog"
import { CTASection } from "@/components/sections/cta"
import { ContactSection } from "@/components/sections/contact"
import { StatsSection } from "@/components/sections/stats"
import { TrustBadgesSection } from "@/components/sections/trust-badges"

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col">
      {/* Background illustration with shadow effect */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div
          className="absolute inset-0 bg-contain bg-center bg-no-repeat opacity-[0.15]"
          style={{ backgroundImage: "url('/images/escrow-illustration.jpg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/50 to-background" />
      </div>

      <Header />
      <main className="relative z-0 flex-1" aria-label="Main content">
        <HeroSection />
        <TrustBadgesSection />
        <BenefitsSection />
        <FeaturesSection />
        <HowItWorksSection />
        <StatsSection />
        <SecuritySection />
        <TestimonialsSection />
        <FAQSection />
        <BlogSection />
        <ContactSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}
