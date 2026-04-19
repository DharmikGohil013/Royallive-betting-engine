import HeroSection from "../components/home/HeroSection";
import LiveMarquee from "../components/home/LiveMarquee";
import PromotionsStrip from "../components/home/PromotionsStrip";
import FeaturedGames from "../components/home/FeaturedGames";
import LiveSports from "../components/home/LiveSports";
import LiveMarkets from "../components/home/LiveMarkets";
import HallOfGlory from "../components/home/HallOfGlory";
import HomeFooter from "../components/home/HomeFooter";

const HomePage = () => {
  return (
    <main className="pt-24 overflow-x-hidden">
      <HeroSection />
      <LiveMarquee />

      <section id="promotions">
        <PromotionsStrip />
      </section>

      <section id="featured-games">
        <FeaturedGames />
      </section>

      <section id="live-sports">
        <LiveSports />
      </section>

      <section id="live-markets">
        <LiveMarkets />
      </section>

      <section id="hall-of-glory">
        <HallOfGlory />
      </section>

      <HomeFooter />
    </main>
  );
};

export default HomePage;
