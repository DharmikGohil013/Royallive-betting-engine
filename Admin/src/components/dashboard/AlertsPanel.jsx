import { useState, useEffect } from "react";
import { getAlerts } from "../../services/api";

export default function AlertsPanel() {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    getAlerts().then(data => {
      const items = data.alerts || data || [];
      setAlerts(items.slice(0, 5).map((a, i) => ({
        id: a._id || i,
        icon: a.type === "error" ? "priority_high" : a.type === "registration" ? "person_add" : "security",
        iconBg: a.type === "error" ? "bg-error/20" : a.type === "registration" ? "bg-secondary/20" : "bg-amber-500/20",
        iconColor: a.type === "error" ? "text-error" : a.type === "registration" ? "text-secondary" : "text-amber-500",
        title: a.title || a.message || "Alert",
        desc: a.description || a.details || "",
        time: a.createdAt ? new Date(a.createdAt).toLocaleString() : "Just now",
      })));
    }).catch((err) => console.error(err));
  }, []);
  return (
    <div
      id="alerts-panel"
      className="col-span-12 lg:col-span-4 surface-container rounded-2xl sm:rounded-3xl p-4 sm:p-6 border-none flex flex-col animate-fade-in-up opacity-0"
      style={{ animationDelay: "600ms", animationFillMode: "forwards" }}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-4 sm:mb-6">
        <h4 className="text-base sm:text-lg font-bold text-slate-100">
          Alerts & Notifications
        </h4>
        <span className="px-2 py-1 bg-error/10 text-error text-[10px] font-black rounded-lg">
          {alerts.length} New
        </span>
      </div>

      {/* Alert Items */}
      <div className="space-y-3 sm:space-y-4 flex-1">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className="flex gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-surface-container-low hover:bg-surface-container-high transition-all cursor-pointer group"
          >
            <div
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full ${alert.iconBg} flex items-center justify-center ${alert.iconColor} shrink-0 group-hover:scale-110 transition-transform`}
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
        className="w-full mt-4 sm:mt-6 py-3 text-xs font-bold text-slate-400 hover:text-amber-500 border-t border-slate-800/30 transition-colors"
      >
        View All Notifications
      </button>
    </div>
  );
}
