import { useState, useEffect } from "react";
import { hallOfGloryWinners } from "../../data/homeData";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";

const HallOfGlory = () => {
  const [winners, setWinners] = useState(hallOfGloryWinners);

  useEffect(() => {
    fetch(`${API_BASE}/api/user/hall-of-glory`)
      .then(r => r.json())
      .then(data => {
        const entries = data.entries || [];
        if (entries.length) {
          setWinners(entries.map((e) => ({
            rank: e.rank || 0,
            username: e.username || e.user?.username || `Player`,
            amount: `৳${(e.totalPayout || 0).toLocaleString()}`,
            label: e.rank === 1 ? "Top Winner" : "",
            highlighted: e.rank === 1,
          })));
        }
      })
      .catch(() => {});
  }, []);
  return (
    <section className="px-4 mb-20">
      <div className="bg-surface-container-low p-6 rounded-lg border border-primary-container/10">
        <h3 className="font-headline font-black text-xl mb-6 text-center tracking-widest uppercase">
          HALL OF <span className="text-primary-container">GLORY</span>
        </h3>
        <div className="space-y-4">
          {winners.map((winner) => (
            <div
              key={winner.rank}
              className={`flex items-center gap-4 ${
                winner.highlighted ? "bg-surface-container/50" : ""
              } p-2 rounded-sm`}
            >
              <div
                className={`w-8 h-8 ${
                  winner.rank === 1
                    ? "bg-tertiary-fixed-dim"
                    : "bg-surface-container-highest"
                } rounded-sm flex items-center justify-center font-headline font-black ${
                  winner.rank === 1 ? "text-on-tertiary" : "text-on-surface"
                }`}
              >
                {winner.rank}
              </div>
              <div className="flex-1">
                <span className="block font-headline font-bold text-xs uppercase">
                  {winner.username}
                </span>
                {winner.label && (
                  <span className="text-[9px] text-on-surface-variant uppercase">
                    {winner.label}
                  </span>
                )}
              </div>
              <div className="text-right">
                <span
                  className={`block font-headline font-black text-xs ${
                    winner.highlighted ? "text-primary-container" : ""
                  }`}
                >
                  {winner.amount}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HallOfGlory;
