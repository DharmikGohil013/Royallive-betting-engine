import { useState, useEffect } from "react";
import { getReports, updateReport } from "../../services/api";

const STATUS_COLORS = {
  pending: "bg-amber-500/20 text-amber-400",
  reviewed: "bg-blue-500/20 text-blue-400",
  resolved: "bg-green-500/20 text-green-400",
  dismissed: "bg-slate-500/20 text-slate-400",
};

export default function ReportsPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [actionModal, setActionModal] = useState(null);
  const [actionStatus, setActionStatus] = useState("reviewed");
  const [adminNote, setAdminNote] = useState("");

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') setActionModal(null); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [actionModal]);

  useEffect(() => { loadReports(); }, [filter, typeFilter, page]);

  async function loadReports() {
    try {
      setLoading(true);
      const params = { page, limit: 20 };
      if (filter) params.status = filter;
      if (typeFilter) params.type = typeFilter;
      const data = await getReports(params);
      setReports(data.reports || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) { console.error("Failed to load reports:", err); } finally { setLoading(false); }
  }

  async function handleAction(e) {
    e.preventDefault();
    if (!actionModal) return;
    try {
      await updateReport(actionModal._id, { status: actionStatus, adminNote });
      setActionModal(null);
      setAdminNote("");
      loadReports();
    } catch (err) { console.error("Failed to update report:", err); alert("Failed to update report"); }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-100">User Reports</h1>
        <p className="text-slate-500 text-sm mt-1">Manage block and report requests</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        <div className="flex gap-1">
          {["", "pending", "reviewed", "resolved", "dismissed"].map(s => (
            <button key={s} onClick={() => { setFilter(s); setPage(1); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${filter === s ? "bg-amber-500 text-black" : "bg-surface-container text-slate-400"}`}>
              {s || "All"}
            </button>
          ))}
        </div>
        <div className="flex gap-1">
          {["", "report", "block"].map(t => (
            <button key={t} onClick={() => { setTypeFilter(t); setPage(1); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${typeFilter === t ? "bg-blue-500 text-white" : "bg-surface-container text-slate-400"}`}>
              {t || "All Types"}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-surface-container rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-500">Loading...</div>
        ) : reports.length === 0 ? (
          <div className="p-12 text-center text-slate-500">No reports found.</div>
        ) : (
          <div className="divide-y divide-white/5">
            {reports.map(report => (
              <div key={report._id} className="p-4 hover:bg-white/5 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${report.type === "report" ? "bg-red-500/20 text-red-400" : "bg-blue-500/20 text-blue-400"}`}>
                        {report.type}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${STATUS_COLORS[report.status]}`}>{report.status}</span>
                      <span className="text-xs text-slate-600">{new Date(report.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-sm text-slate-300 mb-1">
                      <span className="text-slate-100 font-bold">{report.reporter?.username || "?"}</span>
                      <span className="text-slate-500"> {report.type === "block" ? "blocked" : "reported"} </span>
                      <span className="text-slate-100 font-bold">{report.reported?.username || "?"}</span>
                    </p>
                    {report.reason && <p className="text-xs text-slate-400">Reason: {report.reason}</p>}
                    {report.adminNote && <p className="text-xs text-green-400 mt-1">Note: {report.adminNote}</p>}
                    {report.reported?.reportCount > 0 && (
                      <p className="text-xs text-red-400 mt-1">Total reports on user: {report.reported.reportCount}</p>
                    )}
                  </div>
                  {report.status === "pending" && (
                    <button onClick={() => { setActionModal(report); setActionStatus("reviewed"); setAdminNote(""); }}
                      className="px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-400 text-xs font-bold hover:bg-amber-500/30 transition-all">
                      Review
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1.5 rounded-lg bg-surface-container text-slate-400 disabled:opacity-30 text-sm">Prev</button>
          <span className="px-3 py-1.5 text-sm text-slate-400">{page} / {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-3 py-1.5 rounded-lg bg-surface-container text-slate-400 disabled:opacity-30 text-sm">Next</button>
        </div>
      )}

      {/* Action Modal */}
      {actionModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setActionModal(null)}>
          <div className="bg-surface-container rounded-2xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-slate-100 mb-4">Review Report</h2>
            <form onSubmit={handleAction} className="space-y-4">
              <div>
                <label className="text-xs text-slate-500 font-bold">Action</label>
                <select value={actionStatus} onChange={e => setActionStatus(e.target.value)} className="w-full bg-surface-dim border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-100 mt-1">
                  <option value="reviewed">Mark Reviewed</option>
                  <option value="resolved">Resolve</option>
                  <option value="dismissed">Dismiss</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-500 font-bold">Admin Note</label>
                <textarea value={adminNote} onChange={e => setAdminNote(e.target.value)} rows={3}
                  className="w-full bg-surface-dim border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-100 mt-1 resize-none" />
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setActionModal(null)} className="flex-1 py-2.5 rounded-xl border border-white/10 text-slate-400 font-bold text-sm">Cancel</button>
                <button type="submit" className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-bold text-sm">Submit</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
