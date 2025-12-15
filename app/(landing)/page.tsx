import HeroSection from "./_components/HeroSection";
import FeatureSection from "./_components/FeatureSection";
import RecentSection from "./_components/RecentSection";

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <FeatureSection />
      <RecentSection />
    </main>
  );
}
