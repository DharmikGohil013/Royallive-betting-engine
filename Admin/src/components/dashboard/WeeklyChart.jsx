import { weeklyChartData } from "../../data/dashboardData";

export default function WeeklyChart() {
  return (
    <div
      id="weekly-chart"
      className="col-span-12 lg:col-span-8 surface-container rounded-3xl p-8 border-none overflow-hidden relative animate-fade-in-up opacity-0"
      style={{ animationDelay: "500ms", animationFillMode: "forwards" }}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h4 className="text-lg font-bold text-slate-100 bengali-leading">
            সাপ্তাহিক ডিপোজিট বনাম উইথড্র
          </h4>
          <p className="text-slate-500 text-xs">গত ৭ দিনের লেনদেনের তুলনা</p>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-secondary"></span>
            <span className="text-xs text-slate-400">ডিপোজিট</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-amber-500"></span>
            <span className="text-xs text-slate-400">উইথড্র</span>
          </div>
        </div>
      </div>

      {/* Chart Bars */}
      <div className="h-64 flex items-end justify-between gap-4 px-2">
        <div className="relative w-full h-full flex items-end gap-1">
          {weeklyChartData.map((bar, i) => (
            <div
              key={bar.day}
              className={`flex-1 ${bar.height} ${
                bar.highlight
                  ? "bg-secondary/20 border-t-2 border-secondary"
                  : "bg-secondary/10"
              } rounded-t-lg relative group transition-all duration-300 hover:bg-secondary/25 chart-bar`}
              style={{
                animationDelay: `${600 + i * 80}ms`,
              }}
            >
              <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-surface-container-highest px-3 py-1.5 rounded-lg text-[10px] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap font-bold text-slate-300">
                {bar.tooltip}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Day Labels */}
      <div className="flex justify-between mt-4 px-2 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
        {weeklyChartData.map((bar) => (
          <span key={bar.day}>{bar.day}</span>
        ))}
      </div>
    </div>
  );
}
