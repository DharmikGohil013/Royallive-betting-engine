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
      className="col-span-12 surface-container rounded-3xl p-8 border-none mt-6 animate-fade-in-up opacity-0"
      style={{ animationDelay: "900ms", animationFillMode: "forwards" }}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h4 className="text-lg font-bold text-slate-100 bengali-leading">
            মাসিক লাভ-ক্ষতি বিশ্লেষণ
          </h4>
          <p className="text-slate-500 text-xs">
            বছরের শুরু থেকে বর্তমান সময়ের রিপোর্ট
          </p>
        </div>
        <div className="px-4 py-2 bg-surface-container-low rounded-xl text-xs font-bold border border-outline-variant/10 text-slate-400">
          ২০২৪ অর্থবছর
        </div>
      </div>

      {/* Bar Chart */}
      <div className="h-48 flex items-end gap-3 sm:gap-6 px-2">
        {monthlyBars.map((bar, i) => (
          <div
            key={bar.month}
            className="flex-1 flex flex-col justify-end items-center gap-2 group"
          >
            <div
              className={`w-full ${getBarClasses(bar.type)} rounded-t-lg ${bar.height} transition-all duration-300 chart-bar`}
              style={{
                animationDelay: `${1000 + i * 60}ms`,
              }}
            ></div>
            <span className="text-[9px] text-slate-500 uppercase font-bold">
              {bar.month}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
