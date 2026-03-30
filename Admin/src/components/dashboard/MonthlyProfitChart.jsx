import { monthlyBars } from "../../data/dashboardData";

export default function MonthlyProfitChart() {
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
        {monthlyBars.map((bar, i) => (
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
