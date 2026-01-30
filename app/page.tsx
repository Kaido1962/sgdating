import HeroSection from "@/components/hero-section"
import HowItWorks from "@/components/how-it-works"
import Features from "@/components/features"
import Pricing from "@/components/pricing"
import Testimonials from "@/components/testimonials"
import FooterCTA from "@/components/footer-cta"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import AIChat from "@/components/ai-chat"
import FeaturedMember from "@/components/featured-member"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#c5c4c4] via-white to-[#c5c4c4]">
      <Navbar />
      <HeroSection />
      <HowItWorks />
      <Features />
      <Pricing />
      <Testimonials />
      <FeaturedMember />
      <AIChat />
      <FooterCTA />
      <Footer />
    </div>
  )
}
