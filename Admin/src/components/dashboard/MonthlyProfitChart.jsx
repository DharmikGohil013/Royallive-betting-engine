import { useState, useEffect } from "react";
import { getMonthlyProfit } from "../../services/api";

const defaultBars = [
  { month: "Jan", height: "h-24", type: "default" },
  { month: "Feb", height: "h-32", type: "default" },
  { month: "Mar", height: "h-20", type: "default" },
  { month: "Apr", height: "h-40", type: "default" },
  { month: "May", height: "h-48", type: "default" },
  { month: "Jun", height: "h-16", type: "default" },
  { month: "Jul", height: "h-28", type: "default" },
  { month: "Aug", height: "h-36", type: "default" },
  { month: "Sep", height: "h-[10.5rem]", type: "default" },
];

const hMap = ["h-8", "h-16", "h-20", "h-24", "h-28", "h-32", "h-36", "h-40", "h-48", "h-[10.5rem]"];

export default function MonthlyProfitChart() {
  const [bars, setBars] = useState(defaultBars);

  useEffect(() => {
    getMonthlyProfit().then(data => {
      const months = data.months || data || [];
      if (months.length) {
        const maxVal = Math.max(...months.map(m => m.profit || m.revenue || 0), 1);
        setBars(months.map(m => {
          const val = m.profit || m.revenue || 0;
          const idx = Math.min(Math.round((val / maxVal) * 9), 9);
          return {
            month: m.month || m.label || "",
            height: hMap[idx] || "h-24",
            type: idx >= 7 ? "highlight" : idx >= 5 ? "highlight-soft" : "default",
          };
        }));
      }
    }).catch((err) => console.error(err));
  }, []);
  const getBarClasses = (type) => {
    switch (type) {
      case "highlight":
        return "bg-secondary/40 border-t-2 border-secondary";
      case "highlight-soft":
        return "bg-secondary/30 border-t-2 border-secondary/50";
      default:
        return "bg-surface-container-highest group-hover:bg-primary/20";
    }
  };

  return (
    <div
      id="monthly-profit-chart"
      className="col-span-12 surface-container rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border-none mt-4 sm:mt-6 animate-fade-in-up opacity-0"
      style={{ animationDelay: "900ms", animationFillMode: "forwards" }}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 mb-6 sm:mb-8">
        <div>
          <h4 className="text-base sm:text-lg font-bold text-slate-100">
            Monthly Profit/Loss Analysis
          </h4>
          <p className="text-slate-500 text-[11px] sm:text-xs">
            Report from the start of the year to the present
          </p>
        </div>
        <div className="px-3 sm:px-4 py-1.5 sm:py-2 bg-surface-container-low rounded-xl text-[11px] sm:text-xs font-bold border border-outline-variant/10 text-slate-400 self-start sm:self-auto">
          FY 2024
        </div>
      </div>

      {/* Bar Chart */}
      <div className="h-32 sm:h-40 lg:h-48 flex items-end gap-1.5 sm:gap-3 lg:gap-6 px-1 sm:px-2">
        {bars.map((bar, i) => (
          <div
            key={bar.month}
            className="flex-1 flex flex-col justify-end items-center gap-1 sm:gap-2 group"
          >
            <div
              className={`w-full ${getBarClasses(bar.type)} rounded-t-lg ${bar.height} max-h-full transition-all duration-300 chart-bar`}
              style={{
                animationDelay: `${1000 + i * 60}ms`,
              }}
            ></div>
            <span className="text-[7px] sm:text-[9px] text-slate-500 uppercase font-bold">
              {bar.month}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
