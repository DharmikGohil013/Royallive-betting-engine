import { useState, useEffect } from "react";
import { getHallOfGlory, generateHallOfGlory, updateHallOfGloryEntry, createHallOfGloryEntry } from "../../services/api";

const MEDALS = ["🥇", "🥈", "🥉"];

export default function HallOfGloryPage() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [generating, setGenerating] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ username: "", totalPayout: "", rank: 1 });

  useEffect(() => { load(); }, [date]);

  async function load() {
    try { setLoading(true); const data = await getHallOfGlory(date); setEntries(data.entries || []); } catch { } finally { setLoading(false); }
  }

  async function handleGenerate() {
    if (!window.confirm("This will auto-generate today's Hall of Glory from top winning users. Continue?")) return;
    try { setGenerating(true); await generateHallOfGlory(); load(); } catch { } finally { setGenerating(false); }
  }

  async function handleManualAdd(e) {
    e.preventDefault();
    try {
      await createHallOfGloryEntry({ ...form, date });
      setShowForm(false);
      setForm({ username: "", totalPayout: "", rank: 1 });
      load();
    } catch { }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-100">Hall of Glory</h1>
          <p className="text-slate-500 text-sm mt-1">Daily top winners display</p>
        </div>
        <div className="flex gap-2">
          <input type="date" value={date} onChange={e => setDate(e.target.value)}
            className="bg-surface-container border border-white/10 rounded-xl px-3 py-2 text-sm text-slate-100" />
          <button onClick={handleGenerate} disabled={generating}
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl font-bold text-sm transition-all disabled:opacity-50">
            <span className="material-symbols-outlined text-lg">auto_awesome</span>{generating ? "Generating..." : "Auto Generate"}
          </button>
          <button onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-black px-4 py-2 rounded-xl font-bold text-sm transition-all">
            <span className="material-symbols-outlined text-lg">add</span>Manual Add
          </button>
        </div>
      </div>

      {/* Display */}
      <div className="bg-surface-container rounded-2xl p-6">
        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-6">Winners for {date}</h3>
        {loading ? (
          <div className="p-8 text-center text-slate-500">Loading...</div>
        ) : entries.length === 0 ? (
          <div className="p-8 text-center text-slate-500">No entries for this date. Click "Auto Generate" or add manually.</div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-3">
            {entries.map((entry, idx) => (
              <div key={entry._id || idx} className={`relative bg-surface-dim rounded-2xl p-6 text-center border ${idx === 0 ? "border-amber-500/30 shadow-lg shadow-amber-500/10" : "border-white/5"}`}>
                <div className="text-4xl mb-2">{MEDALS[entry.rank - 1] || `#${entry.rank}`}</div>
                <h3 className="text-lg font-black text-slate-100 mb-1">{entry.username}</h3>
                <p className="text-2xl font-black text-amber-400">BDT {entry.totalPayout?.toLocaleString()}</p>
                <p className="text-xs text-slate-500 mt-2">Rank #{entry.rank}</p>
                {entry.isManual && <span className="absolute top-3 right-3 text-[10px] bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full font-bold">Manual</span>}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Manual Add Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-surface-container rounded-2xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-slate-100 mb-4">Add Manual Entry</h2>
            <form onSubmit={handleManualAdd} className="space-y-4">
              <div>
                <label className="text-xs text-slate-500 font-bold">Username *</label>
                <input type="text" required value={form.username} onChange={e => setForm({...form, username: e.target.value})}
                  className="w-full bg-surface-dim border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-100 mt-1" />
              </div>
              <div>
                <label className="text-xs text-slate-500 font-bold">Total Payout (BDT) *</label>
                <input type="number" required value={form.totalPayout} onChange={e => setForm({...form, totalPayout: e.target.value})}
                  className="w-full bg-surface-dim border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-100 mt-1" />
              </div>
              <div>
                <label className="text-xs text-slate-500 font-bold">Rank *</label>
                <select value={form.rank} onChange={e => setForm({...form, rank: parseInt(e.target.value)})}
                  className="w-full bg-surface-dim border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-100 mt-1">
                  <option value={1}>1st Place</option>
                  <option value={2}>2nd Place</option>
                  <option value={3}>3rd Place</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-2.5 rounded-xl border border-white/10 text-slate-400 font-bold text-sm">Cancel</button>
                <button type="submit" className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-bold text-sm">Add Entry</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
