import HeroSection from "../components/home/HeroSection";
import LiveMarquee from "../components/home/LiveMarquee";
import PromotionsStrip from "../components/home/PromotionsStrip";
import FeaturedGames from "../components/home/FeaturedGames";
import LiveSports from "../components/home/LiveSports";
import LiveMarkets from "../components/home/LiveMarkets";
import HallOfGlory from "../components/home/HallOfGlory";

const HomePage = () => {
  return (
    <main className="pt-16 pb-24 overflow-x-hidden">
      <HeroSection />
      <LiveMarquee />
      <PromotionsStrip />
      <FeaturedGames />
      <LiveSports />
      <LiveMarkets />
      <HallOfGlory />
    </main>
  );
};

export default HomePage;
