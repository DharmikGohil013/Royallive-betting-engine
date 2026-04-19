import { useState, useEffect } from "react";
import { getRevenueByGame } from "../../services/api";

const defaultRevenue = [
  { name: "BPL Special", amount: "৳0", color: "bg-primary" },
  { name: "Live Casino", amount: "৳0", color: "bg-secondary" },
  { name: "Others", amount: "৳0", color: "bg-error" },
];

export default function RevenueChart() {
  const [revenueData, setRevenueData] = useState(defaultRevenue);
  const [totalRevenue, setTotalRevenue] = useState("৳0");

  useEffect(() => {
    getRevenueByGame().then(data => {
      const games = data.games || data || [];
      if (games.length) {
        const colors = ["bg-primary", "bg-secondary", "bg-error", "bg-amber-500", "bg-blue-500"];
        const total = games.reduce((s, g) => s + (g.revenue || 0), 0);
        setTotalRevenue(`৳${(total / 100000).toFixed(1)}L`);
        setRevenueData(games.slice(0, 5).map((g, i) => ({
          name: g.name || g._id || `Game ${i + 1}`,
          amount: `৳${(g.revenue || 0).toLocaleString()}`,
          color: colors[i % colors.length],
        })));
      }
    }).catch((err) => console.error(err));
  }, []);
  return (
    <div
      id="revenue-chart"
      className="col-span-12 lg:col-span-4 surface-container rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border-none flex flex-col animate-fade-in-up opacity-0"
      style={{ animationDelay: "800ms", animationFillMode: "forwards" }}
    >
      <h4 className="text-base sm:text-lg font-bold text-slate-100 mb-2">
        Revenue by Game
      </h4>
      <p className="text-slate-500 text-[11px] sm:text-xs mb-6 sm:mb-8">Data from the last 30 days</p>

      {/* Donut Chart SVG + Legend — side by side on mobile, stacked on lg */}
      <div className="flex flex-row lg:flex-col items-center gap-6 sm:gap-8">
        <div className="relative w-36 h-36 sm:w-48 sm:h-48 shrink-0">
          <svg
            className="w-full h-full transform -rotate-90"
            viewBox="0 0 100 100"
          >
            {/* Background */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="#1c2026"
              strokeWidth="12"
            />
            {/* BPL Special - Primary/Amber */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="#ffc174"
              strokeWidth="12"
              strokeDasharray="160 251.2"
              className="transition-all duration-1000"
              style={{ animationDelay: "1000ms" }}
            />
            {/* Live Casino - Secondary/Green */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="#4edea3"
              strokeWidth="12"
              strokeDasharray="80 251.2"
              strokeDashoffset="-160"
              className="transition-all duration-1000"
            />
            {/* Others - Error/Red */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="#ffb4ab"
              strokeWidth="12"
              strokeDasharray="11.2 251.2"
              strokeDashoffset="-240"
              className="transition-all duration-1000"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-lg sm:text-2xl font-black text-slate-100 tracking-tighter font-body">
              {totalRevenue}
            </span>
            <span className="text-[8px] sm:text-[9px] text-slate-500 uppercase font-bold">
              Total
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="space-y-3 sm:space-y-4 flex-1 w-full">
          {revenueData.map((game) => (
            <div key={game.name} className="flex justify-between items-center">
              <div className="flex items-center gap-2 sm:gap-3">
                <span className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full ${game.color}`}></span>
                <span className="text-[11px] sm:text-xs text-slate-300">{game.name}</span>
              </div>
              <span className="text-[11px] sm:text-xs font-bold text-slate-100 font-body">
                {game.amount}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
