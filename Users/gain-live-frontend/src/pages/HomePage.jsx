import HeroSection from "../components/home/HeroSection";
import BannerCarousel from "../components/home/BannerCarousel";
import LiveMarquee from "../components/home/LiveMarquee";
import PromotionsStrip from "../components/home/PromotionsStrip";
import FeaturedGames from "../components/home/FeaturedGames";
import LiveSports from "../components/home/LiveSports";
import LiveMarkets from "../components/home/LiveMarkets";
import HallOfGlory from "../components/home/HallOfGlory";
import NewsSection from "../components/home/NewsSection";
import SponsorsSection from "../components/home/SponsorsSection";
import AmbassadorsSection from "../components/home/AmbassadorsSection";
import HomeFooter from "../components/home/HomeFooter";

const HomePage = () => {
  return (
    <main className="pt-[120px] overflow-x-hidden">
      <HeroSection />
      <BannerCarousel />
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

      <NewsSection />

      <SponsorsSection />
      <AmbassadorsSection />

      <HomeFooter />
    </main>
  );
};

export default HomePage;
