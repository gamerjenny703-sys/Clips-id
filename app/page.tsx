import Layout from "@/components/shared/Layout";
import HeroSection from "@/components/features/landing/HeroSection";
import FeaturesSection from "@/components/features/landing/FeaturesSection";
import StatsSection from "@/components/features/landing/StatsSection";
import CtaSection from "@/components/features/landing/CtaSection";

export default function HomePage() {
  return (
    <Layout>
      <HeroSection />
      <FeaturesSection />
      <StatsSection />
      <CtaSection />
    </Layout>
  );
}
