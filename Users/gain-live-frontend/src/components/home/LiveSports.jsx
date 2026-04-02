import { sportsMatches } from "../../data/homeData";
import SportMatchCard from "../ui/SportMatchCard";

const LiveSports = () => {
  return (
    <section className="mb-10">
      <div className="px-4 flex justify-between items-end mb-4">
        <h2 className="font-headline font-black text-2xl tracking-tighter uppercase italic border-l-4 border-primary-container pl-3 neon-glow-primary">
          Live Sports
        </h2>
        <span className="text-[10px] font-bold text-primary-container uppercase tracking-widest cursor-pointer hover:underline">
          See All
        </span>
      </div>
      <div className="flex overflow-x-auto gap-4 px-4 pb-4 hide-scrollbar">
        {sportsMatches.map((match, index) => (
          <SportMatchCard key={index} match={match} />
        ))}
      </div>
    </section>
  );
};

export default LiveSports;
