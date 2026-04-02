const exportCards = [
  {
    title: "Full Payment Report",
    desc: "Export detailed transaction data for the last 30 days.",
    format: "Excel (.xlsx)",
    icon: "table_view",
    iconClass: "bg-primary/10 text-primary",
    formatClass: "text-primary bg-primary/10",
  },
  {
    title: "User Activity Log",
    desc: "Download sign-in and important action history for users.",
    format: "CSV (.csv)",
    icon: "description",
    iconClass: "bg-secondary/10 text-secondary",
    formatClass: "text-secondary bg-secondary/10",
  },
  {
    title: "Game Logic Data",
    desc: "Download configuration files for all active game events.",
    format: "JSON (.json)",
    icon: "data_object",
    iconClass: "bg-tertiary-container/10 text-tertiary",
    formatClass: "text-tertiary bg-tertiary/10",
  },
];

const logs = [
  {
    id: "#LOG-82941",
    timestamp: "13 October, 2024 | 12:45 PM",
    type: "DB_BACKUP",
    typeClass: "text-secondary bg-secondary/10",
    desc: "System database auto-backup completed.",
    user: "System Automation",
    status: "Success",
    statusClass: "text-secondary",
    dotClass: "bg-secondary",
  },
  {
    id: "#LOG-82939",
    timestamp: "13 October, 2024 | 11:20 AM",
    type: "AUTH_LOGIN",
    typeClass: "text-primary bg-primary/10",
    desc: "New admin dashboard sign-in detected.",
    user: "admin_main",
    status: "Success",
    statusClass: "text-secondary",
    dotClass: "bg-secondary",
  },
  {
    id: "#LOG-82935",
    timestamp: "13 October, 2024 | 09:15 AM",
    type: "PAYMENT_ERR",
    typeClass: "text-error bg-error/10",
    desc: "Gateway timeout: user ID #U-902.",
    user: "Bkash_API",
    status: "Error",
    statusClass: "text-error",
    dotClass: "bg-error",
  },
  {
    id: "#LOG-82932",
    timestamp: "12 October, 2024 | 08:30 PM",
    type: "SYS_CONFIG",
    typeClass: "text-amber-400 bg-amber-400/10",
    desc: "Game limit parameter updated.",
    user: "admin_02",
    status: "Warning",
    statusClass: "text-amber-400",
    dotClass: "bg-amber-400",
  },
];

export default function DataManagementPage() {
  return (
    <div className="font-body">
      <div className="max-w-6xl mx-auto">
        <section className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-black text-on-surface mb-2 tracking-tight">Data Management</h1>
            <p className="text-slate-400 text-sm">System data backup, export, and activity log monitoring.</p>
          </div>

          <div className="flex flex-wrap gap-4">
            <button className="flex items-center gap-2 bg-surface-container-high hover:bg-surface-container-highest text-on-surface px-5 py-3 rounded-xl transition-all font-bold text-sm">
              <span className="material-symbols-outlined text-primary">history</span>
              Backup History
            </button>
            <button className="flex items-center gap-2 bg-gradient-to-r from-primary to-primary-container text-on-primary px-6 py-3 rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all font-bold text-sm">
              <span className="material-symbols-outlined">cloud_upload</span>
              Create Backup
            </button>
          </div>
        </section>

        <section className="grid grid-cols-12 gap-6 mb-6">
          <article className="col-span-12 xl:col-span-4 bg-surface-container rounded-3xl p-8 relative overflow-hidden group">
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-all duration-500" />
            <h2 className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-6 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              Storage Status
            </h2>

            <div className="flex items-center gap-6 mb-8">
              <div className="relative w-20 h-20">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 80 80">
                  <circle className="text-surface-container-highest" cx="40" cy="40" r="34" fill="transparent" stroke="currentColor" strokeWidth="6" />
                  <circle
                    className="text-primary"
                    cx="40"
                    cy="40"
                    r="34"
                    fill="transparent"
                    stroke="currentColor"
                    strokeDasharray="213"
                    strokeDashoffset="64"
                    strokeWidth="6"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-sm font-black text-primary">70%</div>
              </div>
              <div>
                <p className="text-3xl font-black text-on-surface tracking-tighter">28.4 GB</p>
                <p className="text-slate-400 text-xs">Used out of 40 GB</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center text-sm mb-2">
                  <span className="text-slate-400">Database Size</span>
                  <span className="font-bold text-on-surface">12.8 GB</span>
                </div>
                <div className="w-full h-1 bg-surface-container-highest rounded-full overflow-hidden">
                  <div className="w-[45%] h-full bg-primary" />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center text-sm mb-2">
                  <span className="text-slate-400">Media Files</span>
                  <span className="font-bold text-on-surface">15.6 GB</span>
                </div>
                <div className="w-full h-1 bg-surface-container-highest rounded-full overflow-hidden">
                  <div className="w-[55%] h-full bg-secondary" />
                </div>
              </div>
            </div>
          </article>

          <article className="col-span-12 xl:col-span-8 bg-surface-container rounded-3xl p-8">
            <h2 className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-6">Data Export Tools</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {exportCards.map((card) => (
                <div key={card.title} className="bg-surface-container-low p-6 rounded-2xl hover:bg-surface-container-high transition-colors cursor-pointer group">
                  <div className="flex items-start justify-between mb-4 gap-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-105 transition-all duration-300 ${card.iconClass}`}>
                      <span className="material-symbols-outlined group-hover:text-on-primary">{card.icon}</span>
                    </div>
                    <span className={`text-xs font-bold px-2 py-1 rounded ${card.formatClass}`}>{card.format}</span>
                  </div>
                  <h3 className="text-on-surface font-bold mb-1">{card.title}</h3>
                  <p className="text-slate-500 text-xs leading-relaxed">{card.desc}</p>
                </div>
              ))}

              <div className="bg-surface-container-low p-6 rounded-2xl border-2 border-dashed border-white/5 flex flex-col items-center justify-center text-center group hover:border-primary/50 transition-all">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-slate-500 group-hover:text-primary">add</span>
                </div>
                <p className="text-slate-400 font-bold text-xs">Create Custom Export</p>
              </div>
            </div>
          </article>
        </section>

        <section className="bg-surface-container rounded-3xl overflow-hidden mt-6">
          <div className="p-8 border-b border-white/5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-surface-container-high/30">
            <div>
              <h2 className="text-on-surface font-bold text-lg">System Log Viewer</h2>
              <p className="text-slate-500 text-xs mt-1">Real-time system events and error tracking</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <select className="bg-surface-container-low border-none text-xs font-bold text-slate-400 rounded-lg px-4 py-2 ring-1 ring-white/5 focus:ring-primary/50">
                <option>All Events</option>
                <option>Success</option>
                <option>Warning</option>
                <option>Error</option>
              </select>
              <button className="bg-surface-container-low p-2 rounded-lg text-slate-400 hover:text-on-surface ring-1 ring-white/5">
                <span className="material-symbols-outlined text-sm">filter_alt</span>
              </button>
              <button className="bg-primary/10 text-primary px-4 py-2 rounded-lg text-xs font-bold hover:bg-primary hover:text-on-primary transition-all">
                Refresh
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px] text-left">
              <thead className="text-slate-500 text-[10px] uppercase tracking-widest bg-surface-container-low/50">
                <tr>
                  <th className="px-8 py-4 font-bold">ID</th>
                  <th className="px-8 py-4 font-bold">Timestamp</th>
                  <th className="px-8 py-4 font-bold">Event Type</th>
                  <th className="px-8 py-4 font-bold">Description</th>
                  <th className="px-8 py-4 font-bold">User</th>
                  <th className="px-8 py-4 font-bold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.03]">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-8 py-5 text-xs font-mono text-slate-500">{log.id}</td>
                    <td className="px-8 py-5 text-sm text-on-surface">{log.timestamp}</td>
                    <td className="px-8 py-5">
                      <span className={`text-xs font-bold px-2 py-1 rounded ${log.typeClass}`}>{log.type}</span>
                    </td>
                    <td className="px-8 py-5 text-sm text-slate-400">{log.desc}</td>
                    <td className="px-8 py-5 text-sm text-on-surface">{log.user}</td>
                    <td className="px-8 py-5">
                      <div className={`flex items-center gap-2 ${log.statusClass}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${log.dotClass} ${log.status === "Success" ? "animate-pulse" : ""}`} />
                        <span className="text-xs font-bold uppercase">{log.status}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-6 bg-surface-container-low/30 border-t border-white/5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-slate-500 text-xs">Showing 10 of 5,420 records</p>
            <div className="flex gap-2">
              <button className="w-8 h-8 flex items-center justify-center rounded bg-surface-container-high text-slate-400 hover:text-on-surface transition-all">
                <span className="material-symbols-outlined text-sm">chevron_left</span>
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded bg-primary text-on-primary font-bold text-xs">1</button>
              <button className="w-8 h-8 flex items-center justify-center rounded bg-surface-container-high text-slate-400 hover:text-on-surface font-bold text-xs">2</button>
              <button className="w-8 h-8 flex items-center justify-center rounded bg-surface-container-high text-slate-400 hover:text-on-surface font-bold text-xs">3</button>
              <button className="w-8 h-8 flex items-center justify-center rounded bg-surface-container-high text-slate-400 hover:text-on-surface transition-all">
                <span className="material-symbols-outlined text-sm">chevron_right</span>
              </button>
            </div>
          </div>
        </section>
      </div>

      <div className="fixed bottom-8 right-8 z-50">
        <button className="w-14 h-14 bg-primary text-on-primary rounded-full shadow-2xl shadow-primary/40 flex items-center justify-center hover:scale-110 active:scale-95 transition-all group overflow-hidden relative">
          <span className="material-symbols-outlined text-2xl relative z-10" style={{ fontVariationSettings: "'FILL' 1" }}>
            terminal
          </span>
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
        </button>
      </div>
    </div>
  );
}