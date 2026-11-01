import HeroSection from "@/components/home/HeroSection";
import CategorySection from "@/components/home/CategorySection";
import HowItWorksSection from "@/components/home/HowItWorksSection";
import FeaturedStudiosSection from "@/components/home/FeaturedStudiosSection";
import WhyStudioSpaceSection from "@/components/home/WhyStudioSpaceSection";
import StudioOwnerSection from "@/components/home/StudioOwnerSection";

export default function Home() {
  return (
    <main className="flex flex-col">
      <HeroSection />
      <CategorySection />
      <HowItWorksSection />
      <FeaturedStudiosSection />
      <WhyStudioSpaceSection />
      <StudioOwnerSection />
    </main>
  );
}