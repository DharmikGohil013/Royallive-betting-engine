import { revenueByGame } from "../../data/dashboardData";

export default function RevenueChart() {
  return (
    <div
      id="revenue-chart"
      className="col-span-12 lg:col-span-4 surface-container rounded-3xl p-8 border-none flex flex-col animate-fade-in-up opacity-0"
      style={{ animationDelay: "800ms", animationFillMode: "forwards" }}
    >
      <h4 className="text-lg font-bold text-slate-100 mb-2 bengali-leading">
        Revenue by Game
      </h4>
      <p className="text-slate-500 text-xs mb-8">Data from the last 30 days</p>

      {/* Donut Chart SVG */}
      <div className="relative w-48 h-48 mx-auto mb-8">
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
          <span className="text-2xl font-black text-slate-100 tracking-tighter font-body">
            BDT 12.5L
          </span>
          <span className="text-[9px] text-slate-500 uppercase font-bold">
            Total
          </span>
        </div>
      </div>

      {/* Legend */}
      <div className="space-y-4 flex-1">
        {revenueByGame.map((game) => (
          <div key={game.name} className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <span className={`w-3 h-3 rounded-full ${game.color}`}></span>
              <span className="text-xs text-slate-300">{game.name}</span>
            </div>
            <span className="text-xs font-bold text-slate-100 font-body">
              {game.amount}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
