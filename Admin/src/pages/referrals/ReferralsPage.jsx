import { useState, useEffect } from "react";
import { getReferrals } from "../../services/api";

export default function ReferralsPage() {
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => { load(); }, [page]);

  async function load() {
    try {
      setLoading(true);
      const data = await getReferrals({ page, limit: 20 });
      setReferrals(data.referrals || []);
      setTotalPages(data.totalPages || 1);
      setTotal(data.total || 0);
    } catch { } finally { setLoading(false); }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-100">Referrals</h1>
          <p className="text-slate-500 text-sm mt-1">Track referral program activity ({total} total)</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="bg-surface-container rounded-2xl p-4">
          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Total Referrals</p>
          <p className="text-2xl font-black text-slate-100">{total}</p>
        </div>
        <div className="bg-surface-container rounded-2xl p-4">
          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Rewards Claimed</p>
          <p className="text-2xl font-black text-green-400">{referrals.filter(r => r.rewardClaimed).length}</p>
        </div>
        <div className="bg-surface-container rounded-2xl p-4">
          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Total Rewards Paid</p>
          <p className="text-2xl font-black text-amber-400">BDT {referrals.reduce((sum, r) => sum + (r.rewardClaimed ? r.rewardAmount : 0), 0).toLocaleString()}</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-surface-container rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-500">Loading...</div>
        ) : referrals.length === 0 ? (
          <div className="p-12 text-center text-slate-500">No referrals yet.</div>
        ) : (
          <table className="w-full">
            <thead><tr className="border-b border-white/5 text-xs text-slate-500 uppercase tracking-wider">
              <th className="text-left p-4">Referrer</th>
              <th className="text-left p-4">Referred</th>
              <th className="text-left p-4">Code</th>
              <th className="text-right p-4">Reward</th>
              <th className="text-center p-4">Claimed</th>
              <th className="text-right p-4">Date</th>
            </tr></thead>
            <tbody>
              {referrals.map(ref => (
                <tr key={ref._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="p-4 text-sm font-bold text-slate-100">{ref.referrer?.username || "?"}</td>
                  <td className="p-4 text-sm text-slate-300">{ref.referred?.username || "?"}</td>
                  <td className="p-4"><span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 rounded text-xs font-mono font-bold">{ref.referralCode}</span></td>
                  <td className="p-4 text-sm text-amber-400 font-bold text-right">BDT {ref.rewardAmount}</td>
                  <td className="p-4 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${ref.rewardClaimed ? "bg-green-500/20 text-green-400" : "bg-slate-500/20 text-slate-400"}`}>
                      {ref.rewardClaimed ? "Yes" : "No"}
                    </span>
                  </td>
                  <td className="p-4 text-xs text-slate-500 text-right">{new Date(ref.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1.5 rounded-lg bg-surface-container text-slate-400 disabled:opacity-30 text-sm">Prev</button>
          <span className="px-3 py-1.5 text-sm text-slate-400">{page} / {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-3 py-1.5 rounded-lg bg-surface-container text-slate-400 disabled:opacity-30 text-sm">Next</button>
        </div>
      )}
    </div>
  );
}
