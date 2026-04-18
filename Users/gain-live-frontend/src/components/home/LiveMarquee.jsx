import { useState, useEffect } from "react";
import { marqueeWinners } from "../../data/homeData";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";

const LiveMarquee = () => {
  const [items, setItems] = useState(marqueeWinners);

  useEffect(() => {
    fetch(`${API_BASE}/api/user/marquee`)
      .then((r) => r.json())
      .then((data) => {
        const apiItems = data.items || [];
        if (apiItems.length) {
          setItems(
            apiItems.map((m) => ({
              label: m.label || "WIN",
              user: m.username,
              amount: `৳${Number(m.amount).toLocaleString()}`,
            }))
          );
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="bg-surface-container-lowest py-3 border-y border-primary-container/10 overflow-hidden relative">
      <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-surface-container-lowest to-transparent z-10"></div>
      <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-surface-container-lowest to-transparent z-10"></div>
      <div className="marquee-container flex items-center">
        <div className="marquee-content flex flex-nowrap w-max gap-8 items-center font-headline font-bold text-[10px] tracking-widest">
          {/* Render twice for seamless loop */}
          {[...items, ...items].map((winner, index) => (
            <span key={index} className="flex items-center gap-2">
              <span className="text-primary-container">{winner.label}</span>
              <span className="text-on-surface">{winner.user}</span>
              <span className="text-secondary-container">{winner.amount}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LiveMarquee;
