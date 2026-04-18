import { useState, useEffect } from "react";
import { getHelpRequests, replyHelpRequest, deleteHelpRequest } from "../../services/api";

const STATUS_COLORS = {
  open: "bg-blue-500/20 text-blue-400",
  "in-progress": "bg-amber-500/20 text-amber-400",
  resolved: "bg-green-500/20 text-green-400",
  closed: "bg-slate-500/20 text-slate-400",
};

export default function HelpRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [replyModal, setReplyModal] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [replyStatus, setReplyStatus] = useState("resolved");

  useEffect(() => { loadRequests(); }, [filter, page]);

  async function loadRequests() {
    try {
      setLoading(true);
      const params = { page, limit: 20 };
      if (filter) params.status = filter;
      const data = await getHelpRequests(params);
      setRequests(data.requests || []);
      setTotalPages(data.totalPages || 1);
    } catch { /* ignore */ } finally { setLoading(false); }
  }

  async function handleReply(e) {
    e.preventDefault();
    if (!replyModal) return;
    try {
      await replyHelpRequest(replyModal._id, { adminReply: replyText, status: replyStatus });
      setReplyModal(null);
      setReplyText("");
      loadRequests();
    } catch { /* ignore */ }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this help request?")) return;
    try { await deleteHelpRequest(id); loadRequests(); } catch { /* ignore */ }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-100">Help Requests</h1>
          <p className="text-slate-500 text-sm mt-1">Manage user support tickets</p>
        </div>
        <div className="flex gap-2">
          {["", "open", "in-progress", "resolved", "closed"].map(s => (
            <button key={s} onClick={() => { setFilter(s); setPage(1); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${filter === s ? "bg-amber-500 text-black" : "bg-surface-container text-slate-400 hover:text-slate-200"}`}>
              {s || "All"}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-surface-container rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-500">Loading...</div>
        ) : requests.length === 0 ? (
          <div className="p-12 text-center text-slate-500">No help requests found.</div>
        ) : (
          <div className="divide-y divide-white/5">
            {requests.map(req => (
              <div key={req._id} className="p-4 hover:bg-white/5 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${STATUS_COLORS[req.status] || STATUS_COLORS.open}`}>{req.status}</span>
                      <span className="text-xs text-slate-500">{req.category}</span>
                      <span className="text-xs text-slate-600">{new Date(req.createdAt).toLocaleDateString()}</span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-100 mb-1">{req.subject}</h3>
                    <p className="text-xs text-slate-400 mb-2">{req.message}</p>
                    <p className="text-xs text-slate-500">From: <span className="text-slate-300">{req.user?.username || "Unknown"}</span> ({req.user?.mobile || "N/A"})</p>
                    {req.adminReply && (
                      <div className="mt-2 p-2 bg-green-500/10 rounded-lg">
                        <p className="text-xs text-green-400"><strong>Admin Reply:</strong> {req.adminReply}</p>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <button onClick={() => { setReplyModal(req); setReplyText(req.adminReply || ""); setReplyStatus(req.status === "open" ? "resolved" : req.status); }}
                      className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-amber-400 transition-all">
                      <span className="material-symbols-outlined text-lg">reply</span>
                    </button>
                    <button onClick={() => handleDelete(req._id)}
                      className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-red-400 transition-all">
                      <span className="material-symbols-outlined text-lg">delete</span>
                    </button>
                  </div>
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

      {/* Reply Modal */}
      {replyModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setReplyModal(null)}>
          <div className="bg-surface-container rounded-2xl p-6 w-full max-w-lg" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-slate-100 mb-2">Reply to Help Request</h2>
            <p className="text-sm text-slate-400 mb-4"><strong>{replyModal.subject}</strong> — {replyModal.user?.username}</p>
            <p className="text-xs text-slate-500 mb-4 p-3 bg-surface-dim rounded-lg">{replyModal.message}</p>
            <form onSubmit={handleReply} className="space-y-4">
              <div>
                <label className="text-xs text-slate-500 font-bold">Status</label>
                <select value={replyStatus} onChange={e => setReplyStatus(e.target.value)} className="w-full bg-surface-dim border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-100 mt-1">
                  <option value="in-progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-500 font-bold">Reply</label>
                <textarea value={replyText} onChange={e => setReplyText(e.target.value)} rows={4} required
                  className="w-full bg-surface-dim border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-100 mt-1 resize-none" />
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setReplyModal(null)} className="flex-1 py-2.5 rounded-xl border border-white/10 text-slate-400 font-bold text-sm">Cancel</button>
                <button type="submit" className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-bold text-sm">Send Reply</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
