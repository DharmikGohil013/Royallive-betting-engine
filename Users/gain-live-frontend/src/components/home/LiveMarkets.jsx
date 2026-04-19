import { useState, useEffect } from "react";
import { bettingCards } from "../../data/homeData";
import { getGames } from "../../services/api";
import BettingCard from "../ui/BettingCard";

const LiveMarkets = () => {
  const [cards, setCards] = useState(bettingCards);

  useEffect(() => {
    getGames({ category: "sports" }).then(data => {
      const items = data.games || data || [];
      if (items.length) {
        setCards(items.map(g => ({
          league: g.category || "Sports",
          match: g.name || g.title,
          timeLeft: g.isActive ? "LIVE" : "Upcoming",
          options: g.odds || bettingCards[0]?.options || [],
        })));
      }
    }).catch((err) => console.error(err));
  }, []);
  return (
    <section className="mb-10">
      <div className="px-4 flex justify-between items-end mb-4">
        <h2 className="font-headline font-black text-2xl tracking-tighter uppercase italic border-l-4 border-secondary-container pl-3">
          Live Markets
        </h2>
        <span className="text-[10px] font-bold text-secondary-container uppercase tracking-widest">
          All Sports
        </span>
      </div>
      <div className="flex flex-col gap-3 px-4">
        {cards.map((card, index) => (
          <BettingCard key={index} card={card} />
        ))}
      </div>
    </section>
  );
};

export default LiveMarkets;
