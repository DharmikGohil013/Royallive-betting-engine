import { useState, useEffect, useCallback } from "react";
import { getActivityLogs, getPlatformSummary, getUsers, getTransactions, getGames, getApiLogs } from "../../services/api";

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

function getLogTypeClass(action) {
  if (action?.includes("LOGIN") || action?.includes("AUTH")) return "text-primary bg-primary/10";
  if (action?.includes("ERROR") || action?.includes("PAYMENT")) return "text-error bg-error/10";
  if (action?.includes("CONFIG") || action?.includes("UPDATE")) return "text-amber-400 bg-amber-400/10";
  return "text-secondary bg-secondary/10";
}

function getLogStatusInfo(action) {
  if (action?.includes("ERROR") || action?.includes("FAIL")) return { status: "Error", statusClass: "text-error", dotClass: "bg-error" };
  if (action?.includes("CONFIG") || action?.includes("WARNING")) return { status: "Warning", statusClass: "text-amber-400", dotClass: "bg-amber-400" };
  return { status: "Success", statusClass: "text-secondary", dotClass: "bg-secondary" };
}

function formatBytes(bytes) {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

export default function DataManagementPage() {
  const [logs, setLogs] = useState([]);
  const [page, setPage] = useState(1);
  const [totalLogs, setTotalLogs] = useState(0);
  const [filterType, setFilterType] = useState("All Events");
  const [storage, setStorage] = useState({ used: 0, total: 40, db: 0, media: 0, logs: 0, backups: 0 });
  const [dbStats, setDbStats] = useState({ users: 0, transactions: 0, games: 0, apiLogs: 0, bets: 0 });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [collections, setCollections] = useState([]);

  const loadLogs = useCallback(async () => {
    try {
      const data = await getActivityLogs({ page, limit: 10 });
      setLogs(data.logs || []);
      setTotalLogs(data.total || 0);
    } catch (e) { console.error(e); }
  }, [page]);

  const loadAllData = useCallback(async () => {
    try {
      setLoading(true);
      const [summaryData, usersData, txnData, gamesData, apiLogsData] = await Promise.all([
        getPlatformSummary().catch(() => ({ summary: {} })),
        getUsers({ limit: 1 }).catch(() => ({ total: 0 })),
        getTransactions({ limit: 1 }).catch(() => ({ total: 0 })),
        getGames().catch(() => ({ games: [] })),
        getApiLogs({ limit: 1 }).catch(() => ({ total: 0 })),
      ]);

      const totalUsers = summaryData?.summary?.totalUsers || usersData?.total || 0;
      const totalTxns = txnData?.total || summaryData?.summary?.totalTransactions || 0;
      const totalGames = gamesData?.games?.length || 0;
      const totalApiLogs = apiLogsData?.total || 0;
      const totalBets = summaryData?.summary?.totalBets || 0;

      const dbEst = Math.round((totalUsers * 0.003 + totalTxns * 0.001 + totalBets * 0.0008) * 100) / 100;
      const logsEst = Math.round(totalApiLogs * 0.0002 * 100) / 100;
      const mediaEst = 15.6;
      const backupsEst = 2.4;
      const totalUsed = Math.round((dbEst + logsEst + mediaEst + backupsEst) * 100) / 100;

      setStorage({ used: totalUsed, total: 40, db: dbEst, media: mediaEst, logs: logsEst, backups: backupsEst });
      setDbStats({ users: totalUsers, transactions: totalTxns, games: totalGames, apiLogs: totalApiLogs, bets: totalBets });

      setCollections([
        { name: "Users", icon: "group", count: totalUsers, size: formatBytes(totalUsers * 3072), color: "text-primary", bg: "bg-primary/10" },
        { name: "Transactions", icon: "receipt_long", count: totalTxns, size: formatBytes(totalTxns * 1024), color: "text-secondary", bg: "bg-secondary/10" },
        { name: "Bets", icon: "casino", count: totalBets, size: formatBytes(totalBets * 820), color: "text-amber-400", bg: "bg-amber-400/10" },
        { name: "Games", icon: "sports_esports", count: totalGames, size: formatBytes(totalGames * 5120), color: "text-emerald-400", bg: "bg-emerald-400/10" },
        { name: "API Logs", icon: "api", count: totalApiLogs, size: formatBytes(totalApiLogs * 205), color: "text-error", bg: "bg-error/10" },
      ]);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  }, []);

  useEffect(() => { loadAllData(); }, [loadAllData]);
  useEffect(() => { loadLogs(); }, [loadLogs]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([loadAllData(), loadLogs()]);
    setRefreshing(false);
  };

  const totalPages = Math.max(1, Math.ceil(totalLogs / 10));
  const usedPct = Math.round((storage.used / storage.total) * 100);
  return (
    <div className="font-body">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <section className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-black text-on-surface mb-2 tracking-tight">Data Management</h1>
            <p className="text-slate-400 text-sm">System data, database overview, storage monitoring & activity logs.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button onClick={handleRefresh} className={`flex items-center gap-2 bg-surface-container-high hover:bg-surface-container-highest text-on-surface px-5 py-3 rounded-xl transition-all font-bold text-sm ${refreshing ? "animate-pulse" : ""}`}>
              <span className={`material-symbols-outlined text-primary ${refreshing ? "animate-spin" : ""}`}>refresh</span>
              {refreshing ? "Refreshing..." : "Refresh Data"}
            </button>
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

        {loading ? (
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* Top Stats Row */}
            <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {[
                { label: "Total Records", value: (dbStats.users + dbStats.transactions + dbStats.bets + dbStats.apiLogs).toLocaleString(), icon: "database", color: "text-primary", bg: "bg-primary/10" },
                { label: "Storage Used", value: `${storage.used.toFixed(1)} GB`, icon: "hard_drive", color: "text-secondary", bg: "bg-secondary/10" },
                { label: "Free Space", value: `${(storage.total - storage.used).toFixed(1)} GB`, icon: "cloud_done", color: "text-emerald-400", bg: "bg-emerald-400/10" },
                { label: "Activity Logs", value: totalLogs.toLocaleString(), icon: "history", color: "text-amber-400", bg: "bg-amber-400/10" },
              ].map((s) => (
                <div key={s.label} className="bg-surface-container rounded-2xl p-5 relative overflow-hidden group hover:bg-surface-container-high transition-all">
                  <div className="absolute -right-4 -top-4 w-20 h-20 rounded-full opacity-5 group-hover:opacity-10 transition-opacity bg-white" />
                  <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center mb-3`}>
                    <span className={`material-symbols-outlined ${s.color}`}>{s.icon}</span>
                  </div>
                  <p className="text-2xl font-black text-on-surface tracking-tight">{s.value}</p>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">{s.label}</p>
                </div>
              ))}
            </section>

            {/* Storage + Collections Grid */}
            <section className="grid grid-cols-12 gap-6 mb-6">
              {/* Storage Status */}
              <article className="col-span-12 xl:col-span-4 bg-surface-container rounded-3xl p-6 lg:p-8 relative overflow-hidden group">
                <div className="absolute -right-8 -top-8 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-all duration-500" />
                <h2 className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-6 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Storage Status
                </h2>
                <div className="flex items-center gap-6 mb-8">
                  <div className="relative w-24 h-24">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 80 80">
                      <circle className="text-surface-container-highest" cx="40" cy="40" r="34" fill="transparent" stroke="currentColor" strokeWidth="6" />
                      <circle className={usedPct > 80 ? "text-error" : usedPct > 60 ? "text-amber-400" : "text-primary"} cx="40" cy="40" r="34" fill="transparent" stroke="currentColor" strokeDasharray="213" strokeDashoffset={213 - (213 * usedPct) / 100} strokeWidth="6" strokeLinecap="round" />
                    </svg>
                    <div className={`absolute inset-0 flex items-center justify-center text-lg font-black ${usedPct > 80 ? "text-error" : "text-primary"}`}>{usedPct}%</div>
                  </div>
                  <div>
                    <p className="text-3xl font-black text-on-surface tracking-tighter">{storage.used.toFixed(1)} GB</p>
                    <p className="text-slate-400 text-xs">Used out of {storage.total} GB</p>
                    <p className={`text-[10px] font-bold uppercase tracking-widest mt-1 ${usedPct > 80 ? "text-error" : usedPct > 60 ? "text-amber-400" : "text-emerald-400"}`}>
                      {usedPct > 80 ? "CRITICAL" : usedPct > 60 ? "WARNING" : "HEALTHY"}
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  {[
                    { label: "Database", size: storage.db, color: "bg-primary", textColor: "text-primary" },
                    { label: "Media Files", size: storage.media, color: "bg-secondary", textColor: "text-secondary" },
                    { label: "API Logs", size: storage.logs, color: "bg-amber-400", textColor: "text-amber-400" },
                    { label: "Backups", size: storage.backups, color: "bg-emerald-400", textColor: "text-emerald-400" },
                  ].map((bar) => (
                    <div key={bar.label}>
                      <div className="flex justify-between items-center text-sm mb-2">
                        <span className="text-slate-400">{bar.label}</span>
                        <span className={`font-bold ${bar.textColor}`}>{bar.size.toFixed(1)} GB</span>
                      </div>
                      <div className="w-full h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                        <div style={{ width: `${Math.min(100, Math.round((bar.size / storage.total) * 100))}%` }} className={`h-full ${bar.color} rounded-full transition-all duration-500`} />
                      </div>
                    </div>
                  ))}
                </div>
              </article>

              {/* Database Collections */}
              <article className="col-span-12 xl:col-span-8 bg-surface-container rounded-3xl p-6 lg:p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-slate-400 font-bold text-xs uppercase tracking-widest flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                    Database Collections
                  </h2>
                  <span className="text-[10px] font-bold text-slate-500 bg-surface-container-highest px-3 py-1 rounded-full">
                    {collections.length} COLLECTIONS
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-slate-500 text-[10px] uppercase tracking-widest border-b border-white/5">
                        <th className="pb-3 font-bold">Collection</th>
                        <th className="pb-3 font-bold text-right">Documents</th>
                        <th className="pb-3 font-bold text-right">Est. Size</th>
                        <th className="pb-3 font-bold text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.03]">
                      {collections.map((c) => (
                        <tr key={c.name} className="hover:bg-white/5 transition-colors">
                          <td className="py-4">
                            <div className="flex items-center gap-3">
                              <div className={`w-9 h-9 rounded-lg ${c.bg} flex items-center justify-center`}>
                                <span className={`material-symbols-outlined text-sm ${c.color}`}>{c.icon}</span>
                              </div>
                              <span className="text-sm font-bold text-on-surface">{c.name}</span>
                            </div>
                          </td>
                          <td className="py-4 text-right">
                            <span className="text-sm font-mono font-bold text-on-surface">{typeof c.count === "number" ? c.count.toLocaleString() : c.count}</span>
                          </td>
                          <td className="py-4 text-right">
                            <span className="text-xs font-bold text-slate-400">{c.size}</span>
                          </td>
                          <td className="py-4 text-right">
                            <span className="inline-flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                              <span className="text-[10px] font-bold text-emerald-400 uppercase">Active</span>
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </article>
            </section>

            {/* Data Export Tools */}
            <section className="bg-surface-container rounded-3xl p-6 lg:p-8 mb-6">
              <h2 className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-6 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                Data Export Tools
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                {exportCards.map((card) => (
                  <div key={card.title} className="bg-surface-container-low p-5 rounded-2xl hover:bg-surface-container-high transition-colors cursor-pointer group">
                    <div className="flex items-start justify-between mb-4 gap-3">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-105 transition-all ${card.iconClass}`}>
                        <span className="material-symbols-outlined">{card.icon}</span>
                      </div>
                      <span className={`text-xs font-bold px-2 py-1 rounded ${card.formatClass}`}>{card.format}</span>
                    </div>
                    <h3 className="text-on-surface font-bold mb-1">{card.title}</h3>
                    <p className="text-slate-500 text-xs leading-relaxed">{card.desc}</p>
                  </div>
                ))}
                <div className="bg-surface-container-low p-6 rounded-2xl border-2 border-dashed border-white/5 flex flex-col items-center justify-center text-center group hover:border-primary/50 transition-all cursor-pointer">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-slate-500 group-hover:text-primary">add</span>
                  </div>
                  <p className="text-slate-400 font-bold text-xs">Create Custom Export</p>
                </div>
              </div>
            </section>

            {/* System Log Viewer */}
            <section className="bg-surface-container rounded-3xl overflow-hidden">
              <div className="p-6 lg:p-8 border-b border-white/5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-surface-container-high/30">
                <div>
                  <h2 className="text-on-surface font-bold text-lg">System Log Viewer</h2>
                  <p className="text-slate-500 text-xs mt-1">Real-time system events and error tracking</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <select className="bg-surface-container-low border-none text-xs font-bold text-slate-400 rounded-lg px-4 py-2 ring-1 ring-white/5 focus:ring-primary/50" value={filterType} onChange={e => setFilterType(e.target.value)}>
                    <option>All Events</option>
                    <option>Success</option>
                    <option>Warning</option>
                    <option>Error</option>
                  </select>
                  <button onClick={loadLogs} className="bg-primary/10 text-primary px-4 py-2 rounded-lg text-xs font-bold hover:bg-primary hover:text-on-primary transition-all">
                    Refresh
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[900px] text-left">
                  <thead className="text-slate-500 text-[10px] uppercase tracking-widest bg-surface-container-low/50">
                    <tr>
                      <th className="px-6 py-4 font-bold">ID</th>
                      <th className="px-6 py-4 font-bold">Timestamp</th>
                      <th className="px-6 py-4 font-bold">Event Type</th>
                      <th className="px-6 py-4 font-bold">Description</th>
                      <th className="px-6 py-4 font-bold">User</th>
                      <th className="px-6 py-4 font-bold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.03]">
                    {logs.length === 0 ? (
                      <tr><td colSpan={6} className="px-6 py-12 text-center text-slate-500 text-sm">No activity logs found</td></tr>
                    ) : logs.map((log) => {
                      const typeClass = getLogTypeClass(log.action);
                      const { status, statusClass, dotClass } = getLogStatusInfo(log.action);
                      return (
                        <tr key={log._id} className="hover:bg-white/5 transition-colors">
                          <td className="px-6 py-5 text-xs font-mono text-slate-500">#{log._id?.slice(-6).toUpperCase()}</td>
                          <td className="px-6 py-5 text-sm text-on-surface">{new Date(log.createdAt).toLocaleString()}</td>
                          <td className="px-6 py-5"><span className={`text-xs font-bold px-2 py-1 rounded ${typeClass}`}>{log.action || "SYSTEM"}</span></td>
                          <td className="px-6 py-5 text-sm text-slate-400 max-w-[260px] truncate">{log.details || log.action}</td>
                          <td className="px-6 py-5 text-sm text-on-surface">{log.adminId || "System"}</td>
                          <td className="px-6 py-5">
                            <div className={`flex items-center gap-2 ${statusClass}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${dotClass} ${status === "Success" ? "animate-pulse" : ""}`} />
                              <span className="text-xs font-bold uppercase">{status}</span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="p-6 bg-surface-container-low/30 border-t border-white/5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-slate-500 text-xs">Showing {logs.length} of {totalLogs} records</p>
                <div className="flex gap-2">
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="w-8 h-8 flex items-center justify-center rounded bg-surface-container-high text-slate-400 hover:text-on-surface transition-all disabled:opacity-30">
                    <span className="material-symbols-outlined text-sm">chevron_left</span>
                  </button>
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let p;
                    if (totalPages <= 5) p = i + 1;
                    else if (page <= 3) p = i + 1;
                    else if (page >= totalPages - 2) p = totalPages - 4 + i;
                    else p = page - 2 + i;
                    return (
                      <button key={p} onClick={() => setPage(p)} className={`w-8 h-8 flex items-center justify-center rounded font-bold text-xs ${page === p ? "bg-primary text-on-primary" : "bg-surface-container-high text-slate-400 hover:text-on-surface"}`}>{p}</button>
                    );
                  })}
                  <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="w-8 h-8 flex items-center justify-center rounded bg-surface-container-high text-slate-400 hover:text-on-surface transition-all disabled:opacity-30">
                    <span className="material-symbols-outlined text-sm">chevron_right</span>
                  </button>
                </div>
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}