import { bettingCards } from "../../data/homeData";
import BettingCard from "../ui/BettingCard";

const LiveMarkets = () => {
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
        {bettingCards.map((card, index) => (
          <BettingCard key={index} card={card} />
        ))}
      </div>
    </section>
  );
};

export default LiveMarkets;
