import { useState, useEffect } from "react";
import { getMarqueeItems } from "../../services/api";
import { marqueeWinners } from "../../data/homeData";

const LiveMarquee = () => {
  const [items, setItems] = useState(marqueeWinners);

  useEffect(() => {
    getMarqueeItems()
      .then((data) => {
        const apiItems = data.items || [];
        if (apiItems.length) {
          setItems(
            apiItems.map((m) => ({
              label: m.label || "WINNER:",
              user: m.username,
              amount: m.amount,
              highlighted: m.highlighted,
            }))
          );
        }
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="bg-surface-container-lowest py-3 border-y border-primary-container/10 overflow-hidden relative">
      <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-surface-container-lowest to-transparent z-10"></div>
      <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-surface-container-lowest to-transparent z-10"></div>
      <div className="marquee-container flex items-center">
        <div className="marquee-content flex flex-nowrap w-max gap-8 items-center font-headline font-bold text-[10px] tracking-widest">
          {/* Render twice for seamless loop */}
          {[...items, ...items].map((winner, index) => (
            <span key={index} className={`flex items-center gap-2 ${winner.highlighted ? "text-yellow-400" : ""}`}>
              <span className="text-primary-container">{winner.label}</span>
              <span className={winner.highlighted ? "text-yellow-300" : "text-on-surface"}>{winner.user}</span>
              <span className={winner.highlighted ? "text-yellow-200" : "text-secondary-container"}>{winner.amount}</span>
              {winner.highlighted && <span className="text-yellow-400">★</span>}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LiveMarquee;
