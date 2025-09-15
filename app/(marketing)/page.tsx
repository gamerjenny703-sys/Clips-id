import HeroSection from "@/components/features/landing/HeroSection";
import FeaturesSection from "@/components/features/landing/FeaturesSection";
import StatsSection from "@/components/features/landing/StatsSection";
import HowItWorksSection from "@/components/features/landing/how-it-works-section";
import TestimonialsSection from "@/components/features/landing/testimonials-section";
import FaqSection from "@/components/features/landing/faq-section";
export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <FaqSection />
    </>
  );
}
