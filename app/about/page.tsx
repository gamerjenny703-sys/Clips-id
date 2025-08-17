import Layout from "@/components/shared/Layout";
import AboutHeroSection from "@/components/features/about/AboutHeroSection";
import StatsSection from "@/components/features/about/StatsSection";
import TeamSection from "@/components/features/about/TeamSection";
import ValuesSection from "@/components/features/about/ValuesSection";
import AboutCtaSection from "@/components/features/about/AboutCtaSection";

export default function AboutPage() {
  return (
    <Layout>
      <AboutHeroSection />
      <StatsSection />
      <TeamSection />
      <ValuesSection />
      <AboutCtaSection />
    </Layout>
  );
}
