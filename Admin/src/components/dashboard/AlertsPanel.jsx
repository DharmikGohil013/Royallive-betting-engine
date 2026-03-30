import { alertsData } from "../../data/dashboardData";

export default function AlertsPanel() {
  return (
    <div
      id="alerts-panel"
      className="col-span-12 lg:col-span-4 surface-container rounded-3xl p-6 border-none flex flex-col animate-fade-in-up opacity-0"
      style={{ animationDelay: "600ms", animationFillMode: "forwards" }}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h4 className="text-lg font-bold text-slate-100 bengali-leading">
          অ্যালার্ট ও নোটিফিকেশন
        </h4>
        <span className="px-2 py-1 bg-error/10 text-error text-[10px] font-black rounded-lg">
          ৩ নতুন
        </span>
      </div>

      {/* Alert Items */}
      <div className="space-y-4 flex-1">
        {alertsData.map((alert) => (
          <div
            key={alert.id}
            className="flex gap-4 p-4 rounded-2xl bg-surface-container-low hover:bg-surface-container-high transition-all cursor-pointer group"
          >
            <div
              className={`w-10 h-10 rounded-full ${alert.iconBg} flex items-center justify-center ${alert.iconColor} shrink-0 group-hover:scale-110 transition-transform`}
            >
              <span className="material-symbols-outlined text-sm">{alert.icon}</span>
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-100 mb-1">{alert.title}</p>
              <p className="text-[10px] text-slate-500 line-clamp-1">{alert.desc}</p>
              <p className="text-[9px] text-slate-600 mt-1 uppercase">{alert.time}</p>
            </div>
          </div>
        ))}
      </div>

      {/* View All */}
      <button
        id="btn-view-all-alerts"
        className="w-full mt-6 py-3 text-xs font-bold text-slate-400 hover:text-amber-500 border-t border-slate-800/30 transition-colors"
      >
        সকল নোটিফিকেশন দেখুন
      </button>
    </div>
  );
}
