import { useState, useEffect, useCallback } from "react";
import { getApiLogs, getApiLogsExportUrl } from "../../services/api";

const METHOD_COLORS = {
  GET: "bg-secondary/10 text-secondary",
  POST: "bg-primary/10 text-primary",
  PUT: "bg-amber-500/10 text-amber-500",
  PATCH: "bg-amber-500/10 text-amber-500",
  DELETE: "bg-error/10 text-error",
};

export default function ApiLogsPage() {
  const [logs, setLogs] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ method: "", status: "", search: "" });
  const [searchInput, setSearchInput] = useState("");
  const limit = 50;

  const loadLogs = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit };
      if (filters.method) params.method = filters.method;
      if (filters.status) params.status = filters.status;
      if (filters.search) params.search = filters.search;
      const res = await getApiLogs(params);
      setLogs(res.logs || []);
      setTotal(res.total || 0);
      setTotalPages(res.totalPages || 1);
    } catch {}
    setLoading(false);
  }, [page, filters]);

  useEffect(() => { loadLogs(); }, [loadLogs]);

  const handleSearch = () => {
    setPage(1);
    setFilters(f => ({ ...f, search: searchInput }));
  };

  const handleExport = (days) => {
    const params = { days };
    if (filters.method) params.method = filters.method;
    if (filters.status) params.status = filters.status;
    if (filters.search) params.search = filters.search;
    const url = getApiLogsExportUrl(params);
    window.open(url, "_blank");
  };

  const formatDate = (d) => {
    const dt = new Date(d);
    return dt.toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit" });
  };

  return (
    <div className="font-body">
      <div className="max-w-7xl mx-auto pb-16">
        {/* Header */}
        <section className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-white font-headline tracking-tight mb-2">
              API Logs
            </h1>
            <p className="text-slate-400 text-sm sm:text-base">
              Monitor every API request to the server in real time. Total: <span className="text-white font-bold">{total.toLocaleString()}</span> logs.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button onClick={() => handleExport(7)} className="flex items-center gap-2 bg-secondary/10 hover:bg-secondary/20 text-secondary px-4 py-2.5 rounded-xl font-bold text-sm transition-all">
              <span className="material-symbols-outlined text-lg">download</span>
              Export 7 Days
            </button>
            <button onClick={() => handleExport(30)} className="flex items-center gap-2 bg-primary/10 hover:bg-primary/20 text-primary px-4 py-2.5 rounded-xl font-bold text-sm transition-all">
              <span className="material-symbols-outlined text-lg">download</span>
              Export 30 Days
            </button>
            <button onClick={loadLogs} className="flex items-center gap-2 bg-surface-container-high hover:bg-surface-container-highest text-slate-300 px-4 py-2.5 rounded-xl font-bold text-sm transition-all">
              <span className="material-symbols-outlined text-lg">refresh</span>
              Refresh
            </button>
          </div>
        </section>

        {/* Stats Cards */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <article className="bg-surface-container rounded-2xl p-4 sm:p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary">api</span>
              </div>
              <p className="text-xs text-slate-400 font-medium">Total Requests</p>
            </div>
            <p className="text-2xl font-black text-white">{total.toLocaleString()}</p>
          </article>
          <article className="bg-surface-container rounded-2xl p-4 sm:p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-secondary">check_circle</span>
              </div>
              <p className="text-xs text-slate-400 font-medium">Success (2xx/3xx)</p>
            </div>
            <p className="text-2xl font-black text-secondary">{logs.filter(l => l.statusCode < 400).length}</p>
          </article>
          <article className="bg-surface-container rounded-2xl p-4 sm:p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-error/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-error">error</span>
              </div>
              <p className="text-xs text-slate-400 font-medium">Errors (4xx/5xx)</p>
            </div>
            <p className="text-2xl font-black text-error">{logs.filter(l => l.statusCode >= 400).length}</p>
          </article>
          <article className="bg-surface-container rounded-2xl p-4 sm:p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-amber-500">speed</span>
              </div>
              <p className="text-xs text-slate-400 font-medium">Avg Response</p>
            </div>
            <p className="text-2xl font-black text-amber-500">
              {logs.length ? Math.round(logs.reduce((s, l) => s + (l.responseTime || 0), 0) / logs.length) : 0}ms
            </p>
          </article>
        </section>

        {/* Filters */}
        <section className="bg-surface-container rounded-2xl p-4 sm:p-6 mb-6 flex flex-col sm:flex-row flex-wrap gap-3 items-stretch sm:items-center">
          <div className="relative flex-1 min-w-[200px]">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-lg">search</span>
            <input
              className="w-full bg-surface-dim border-none rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-100 focus:ring-1 focus:ring-primary/50"
              placeholder="Search by path (e.g. /api/admin/users)"
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSearch()}
            />
          </div>

          <select
            className="bg-surface-dim border-none rounded-xl py-2.5 px-4 text-sm text-slate-100 focus:ring-1 focus:ring-primary/50"
            value={filters.method}
            onChange={e => { setPage(1); setFilters(f => ({ ...f, method: e.target.value })); }}
          >
            <option value="">All Methods</option>
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="PATCH">PATCH</option>
            <option value="DELETE">DELETE</option>
          </select>

          <select
            className="bg-surface-dim border-none rounded-xl py-2.5 px-4 text-sm text-slate-100 focus:ring-1 focus:ring-primary/50"
            value={filters.status}
            onChange={e => { setPage(1); setFilters(f => ({ ...f, status: e.target.value })); }}
          >
            <option value="">All Status</option>
            <option value="success">Success (2xx/3xx)</option>
            <option value="error">Errors (4xx/5xx)</option>
          </select>

          <button onClick={handleSearch} className="bg-primary/10 text-primary px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-primary/20 transition-all">
            Search
          </button>
        </section>

        {/* Logs Table */}
        <section className="bg-surface-container rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left border-collapse">
              <thead className="bg-surface-container-high text-slate-400 font-bold text-xs uppercase tracking-widest">
                <tr>
                  <th className="px-4 sm:px-6 py-4">Time</th>
                  <th className="px-4 sm:px-6 py-4">Method</th>
                  <th className="px-4 sm:px-6 py-4">Path</th>
                  <th className="px-4 sm:px-6 py-4">Status</th>
                  <th className="px-4 sm:px-6 py-4">Response</th>
                  <th className="px-4 sm:px-6 py-4">IP</th>
                  <th className="px-4 sm:px-6 py-4">User</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loading ? (
                  <tr>
                    <td colSpan="7" className="text-center py-16 text-slate-500">
                      <span className="material-symbols-outlined animate-spin text-3xl">progress_activity</span>
                      <p className="mt-2">Loading logs...</p>
                    </td>
                  </tr>
                ) : logs.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-16 text-slate-500">
                      <span className="material-symbols-outlined text-4xl mb-2">inbox</span>
                      <p>No API logs found</p>
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => (
                    <tr key={log._id} className="hover:bg-white/5 transition-colors">
                      <td className="px-4 sm:px-6 py-3 text-xs text-slate-400 font-mono whitespace-nowrap">
                        {formatDate(log.createdAt)}
                      </td>
                      <td className="px-4 sm:px-6 py-3">
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${METHOD_COLORS[log.method] || "bg-white/10 text-slate-300"}`}>
                          {log.method}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-3 text-sm text-slate-200 font-mono max-w-[300px] truncate" title={log.path}>
                        {log.path}
                      </td>
                      <td className="px-4 sm:px-6 py-3">
                        <span className={`text-xs font-bold px-2 py-1 rounded ${
                          log.statusCode < 300 ? "bg-secondary/10 text-secondary" :
                          log.statusCode < 400 ? "bg-amber-500/10 text-amber-500" :
                          "bg-error/10 text-error"
                        }`}>
                          {log.statusCode}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-3 text-xs text-slate-400 font-mono">
                        {log.responseTime}ms
                      </td>
                      <td className="px-4 sm:px-6 py-3 text-xs text-slate-500 font-mono">
                        {log.ip || "—"}
                      </td>
                      <td className="px-4 sm:px-6 py-3 text-xs text-slate-400">
                        {log.user || "—"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-t border-white/5">
              <p className="text-xs text-slate-500">
                Page {page} of {totalPages} ({total.toLocaleString()} total)
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1.5 rounded-lg bg-surface-container-high text-slate-300 text-sm font-medium disabled:opacity-30 hover:bg-surface-container-highest transition-all"
                >
                  <span className="material-symbols-outlined text-sm">chevron_left</span>
                </button>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-3 py-1.5 rounded-lg bg-surface-container-high text-slate-300 text-sm font-medium disabled:opacity-30 hover:bg-surface-container-highest transition-all"
                >
                  <span className="material-symbols-outlined text-sm">chevron_right</span>
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
