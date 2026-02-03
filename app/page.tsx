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
      {/* Fixed background image with overlay */}
      <div className="fixed inset-0 -z-10">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/images/hero-bg.jpg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/90 to-background/95" />
      </div>
      
      <Header />
      <main className="flex-1">
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
