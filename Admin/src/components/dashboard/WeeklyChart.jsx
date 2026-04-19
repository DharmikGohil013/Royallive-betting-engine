import { useState, useEffect } from "react";
import { getWeeklyTransactions } from "../../services/api";

const defaultBars = [
  { day: "Sat", height: "h-[8rem]", tooltip: "৳0" },
  { day: "Sun", height: "h-[8rem]", tooltip: "৳0" },
  { day: "Mon", height: "h-[8rem]", tooltip: "৳0" },
  { day: "Tue", height: "h-[8rem]", tooltip: "৳0" },
  { day: "Wed", height: "h-[8rem]", tooltip: "৳0" },
  { day: "Thu", height: "h-[8rem]", tooltip: "৳0" },
  { day: "Fri", height: "h-[8rem]", tooltip: "৳0" },
];

const heightMap = [
  "h-[4rem]", "h-[6rem]", "h-[8rem]", "h-[10rem]", "h-[12rem]", "h-[14rem]", "h-[16rem]"
];

export default function WeeklyChart() {
  const [chartData, setChartData] = useState(defaultBars);

  useEffect(() => {
    getWeeklyTransactions().then(data => {
      const days = data.days || data || [];
      if (days.length) {
        const maxVal = Math.max(...days.map(d => d.deposits || d.total || 0), 1);
        setChartData(days.map((d, i) => {
          const val = d.deposits || d.total || 0;
          const idx = Math.min(Math.round((val / maxVal) * 6), 6);
          return {
            day: d.day || ["Sat","Sun","Mon","Tue","Wed","Thu","Fri"][i] || `D${i}`,
            height: heightMap[idx] || "h-[8rem]",
            tooltip: `৳${(val / 1000).toFixed(0)}K`,
            highlight: idx >= 5,
          };
        }));
      }
    }).catch((err) => console.error(err));
  }, []);
  return (
    <div
      id="weekly-chart"
      className="col-span-12 lg:col-span-8 surface-container rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border-none overflow-hidden relative animate-fade-in-up opacity-0"
      style={{ animationDelay: "500ms", animationFillMode: "forwards" }}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 mb-6 sm:mb-10">
        <div>
          <h4 className="text-base sm:text-lg font-bold text-slate-100">
            Weekly Deposits vs Withdrawals
          </h4>
          <p className="text-slate-500 text-[11px] sm:text-xs">Transaction comparison for the last 7 days</p>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-secondary"></span>
            <span className="text-[11px] sm:text-xs text-slate-400">Deposit</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-amber-500"></span>
            <span className="text-[11px] sm:text-xs text-slate-400">Withdraw</span>
          </div>
        </div>
      </div>

      {/* Chart Bars */}
      <div className="h-40 sm:h-52 lg:h-64 flex items-end justify-between gap-1.5 sm:gap-3 lg:gap-4 px-1 sm:px-2">
        <div className="relative w-full h-full flex items-end gap-1">
          {chartData.map((bar, i) => (
            <div
              key={bar.day}
              className={`flex-1 ${bar.height} max-h-full ${
                bar.highlight
                  ? "bg-secondary/20 border-t-2 border-secondary"
                  : "bg-secondary/10"
              } rounded-t-lg relative group transition-all duration-300 hover:bg-secondary/25 chart-bar`}
              style={{
                animationDelay: `${600 + i * 80}ms`,
              }}
            >
              <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-surface-container-highest px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[9px] sm:text-[10px] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap font-bold text-slate-300">
                {bar.tooltip}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Day Labels */}
      <div className="flex justify-between mt-3 sm:mt-4 px-1 sm:px-2 text-[8px] sm:text-[10px] text-slate-500 font-bold uppercase tracking-wider">
        {chartData.map((bar) => (
          <span key={bar.day}>{bar.day}</span>
        ))}
      </div>
    </div>
  );
}
