import { featuredGames } from "../../data/homeData";
import GameCard from "../ui/GameCard";

const FeaturedGames = () => {
  return (
    <section className="px-4 mb-10">
      <div className="flex justify-between items-end mb-4">
        <h2 className="font-headline font-black text-2xl tracking-tighter uppercase italic border-l-4 border-primary-container pl-3">
          Featured Games
        </h2>
        <span className="text-[10px] font-bold text-primary-container uppercase tracking-widest">
          See All
        </span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {featuredGames.map((game, index) => (
          <GameCard key={index} game={game} />
        ))}
      </div>
    </section>
  );
};

export default FeaturedGames;
