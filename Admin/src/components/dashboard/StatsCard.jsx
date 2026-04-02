export default function StatsCard({ icon, iconColor, iconBg, trendIcon, trendValue, trendColor, label, value, delay = 0 }) {
  return (
    <div
      className="surface-container rounded-xl sm:rounded-2xl p-4 sm:p-6 flex flex-col justify-between h-28 sm:h-36 border-none group hover:bg-surface-container-high transition-all duration-300 animate-fade-in-up opacity-0"
      style={{ animationDelay: `${delay}ms`, animationFillMode: "forwards" }}
    >
      <div className="flex justify-between items-start">
        <span className={`material-symbols-outlined ${iconColor} ${iconBg} p-1.5 sm:p-2 rounded-lg sm:rounded-xl text-xl sm:text-2xl`}>
          {icon}
        </span>
        <span className={`${trendColor} text-[10px] sm:text-xs font-bold flex items-center gap-0.5 sm:gap-1`}>
          <span className="material-symbols-outlined text-[10px] sm:text-xs">{trendIcon}</span>
          {trendValue}
        </span>
      </div>
      <div>
        <p className="text-slate-400 text-[10px] sm:text-xs font-medium mb-0.5 sm:mb-1">{label}</p>
        <h3 className="text-lg sm:text-2xl font-black text-slate-100 tracking-tight font-body">
          {value}
        </h3>
      </div>
    </div>
  );
}
