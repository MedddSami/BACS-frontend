import ShowcaseNavbar from "@/components/showcase/navbar"
import HeroSection from "@/components/showcase/hero-section"
import ProblemSection from "@/components/showcase/problem-section"
import FeaturesSection from "@/components/showcase/features-section"
import HowItWorksSection from "@/components/showcase/how-it-works-section"
import AIPoweredSection from "@/components/showcase/ai-powered-section"
import BACSSection from "@/components/showcase/bacs-section"
import UseCasesSection from "@/components/showcase/use-cases-section"
import BenefitsSection from "@/components/showcase/benefits-section"
import PricingSection from "@/components/showcase/pricing-section"
import FinalCtaSection from "@/components/showcase/final-cta-section"
import Footer from "@/components/showcase/footer"

export default function ShowcasePage() {
  return (
    <div className="min-h-screen animated-gradient bg-gradient-to-br from-background via-primary/5 to-secondary/10">
      <ShowcaseNavbar />
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/3 -right-32 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>
      <main className="pt-16 relative z-10">
        <HeroSection />
        <ProblemSection />
        <FeaturesSection />
        <HowItWorksSection />
        <AIPoweredSection />
        <BACSSection />
        <UseCasesSection />
        <BenefitsSection />
        {/*<PricingSection />*/}
        <FinalCtaSection />
      </main>
      <Footer />
    </div>
  )
}
