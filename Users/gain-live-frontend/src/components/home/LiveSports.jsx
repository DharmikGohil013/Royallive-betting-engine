import { useState, useEffect } from "react";
import { sportsMatches } from "../../data/homeData";
import { getLiveCricket } from "../../services/api";
import SportMatchCard from "../ui/SportMatchCard";

const LiveSports = () => {
  const [matches, setMatches] = useState(sportsMatches);

  useEffect(() => {
    getLiveCricket().then(data => {
      const items = data.matches || data || [];
      if (items.length) {
        setMatches(items.map(m => ({
          league: m.league || m.matchType || "LIVE",
          teamA: { name: m.teamA, flag: "🏏", score: m.scoreA || "" },
          teamB: { name: m.teamB, flag: "🏏", score: m.scoreB || "" },
          status: m.status === "live" ? "LIVE" : m.status?.toUpperCase() || "UPCOMING",
          statusColor: m.status === "live" ? "text-error" : "text-secondary",
          time: m.startTime ? new Date(m.startTime).toLocaleString() : "",
        })));
      }
    }).catch(() => {});
  }, []);
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
        {matches.map((match, index) => (
          <SportMatchCard key={index} match={match} />
        ))}
      </div>
    </section>
  );
};

export default LiveSports;
