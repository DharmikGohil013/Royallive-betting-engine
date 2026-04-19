import { useState, useEffect } from "react";
import { getMarqueeItems, createMarqueeItem, updateMarqueeItem, deleteMarqueeItem } from "../../services/api";

export default function MarqueeManagementPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form, setForm] = useState({ label: "WINNER:", username: "", amount: "", highlighted: false });

  useEffect(() => { loadItems(); }, []);

  async function loadItems() {
    try {
      setLoading(true);
      const data = await getMarqueeItems();
      setItems(data.items || []);
    } catch { /* ignore */ } finally { setLoading(false); }
  }

  function openForm(item = null) {
    if (item) {
      setEditingItem(item);
      setForm({ label: item.label, username: item.username, amount: item.amount, highlighted: item.highlighted });
    } else {
      setEditingItem(null);
      setForm({ label: "WINNER:", username: "", amount: "", highlighted: false });
    }
    setShowForm(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if (editingItem) {
        await updateMarqueeItem(editingItem._id, form);
      } else {
        await createMarqueeItem(form);
      }
      setShowForm(false);
      loadItems();
    } catch { /* ignore */ }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this marquee item?")) return;
    try { await deleteMarqueeItem(id); loadItems(); } catch { /* ignore */ }
  }

  async function toggleActive(item) {
    try { await updateMarqueeItem(item._id, { isActive: !item.isActive }); loadItems(); } catch { /* ignore */ }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-100">Winner Marquee</h1>
          <p className="text-slate-500 text-sm mt-1">Manage scrolling winner announcements</p>
        </div>
        <button onClick={() => openForm()} className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-black px-4 py-2.5 rounded-xl font-bold text-sm transition-all">
          <span className="material-symbols-outlined text-lg">add</span>Add Winner
        </button>
      </div>

      {/* Preview */}
      <div className="bg-surface-container rounded-2xl p-4 overflow-hidden">
        <p className="text-xs text-slate-500 mb-2 font-bold uppercase tracking-wider">Live Preview</p>
        <div className="bg-black/40 rounded-xl p-3 overflow-hidden">
          <div className="flex gap-8 animate-marquee whitespace-nowrap">
            {items.filter(i => i.isActive).map((item, idx) => (
              <span key={idx} className={`text-sm ${item.highlighted ? "text-amber-400 font-bold" : "text-slate-300"}`}>
                {item.label} {item.username} won ৳{item.amount?.toLocaleString()}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Items List */}
      <div className="bg-surface-container rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-500">Loading...</div>
        ) : items.length === 0 ? (
          <div className="p-12 text-center text-slate-500">No marquee items yet. Add your first winner!</div>
        ) : (
          <table className="w-full">
            <thead><tr className="border-b border-white/5 text-xs text-slate-500 uppercase tracking-wider">
              <th className="text-left p-4">Label</th>
              <th className="text-left p-4">Username</th>
              <th className="text-left p-4">Amount</th>
              <th className="text-center p-4">Highlighted</th>
              <th className="text-center p-4">Active</th>
              <th className="text-right p-4">Actions</th>
            </tr></thead>
            <tbody>
              {items.map(item => (
                <tr key={item._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="p-4 text-slate-300 text-sm">{item.label}</td>
                  <td className="p-4 text-slate-100 font-bold text-sm">{item.username}</td>
                  <td className="p-4 text-amber-400 font-bold text-sm">৳{item.amount?.toLocaleString()}</td>
                  <td className="p-4 text-center">
                    {item.highlighted ? <span className="text-amber-400">★</span> : <span className="text-slate-600">☆</span>}
                  </td>
                  <td className="p-4 text-center">
                    <button onClick={() => toggleActive(item)} className={`px-3 py-1 rounded-full text-xs font-bold ${item.isActive ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                      {item.isActive ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td className="p-4 text-right">
                    <button onClick={() => openForm(item)} className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-amber-400 transition-all mr-1">
                      <span className="material-symbols-outlined text-lg">edit</span>
                    </button>
                    <button onClick={() => handleDelete(item._id)} className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-red-400 transition-all">
                      <span className="material-symbols-outlined text-lg">delete</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-surface-container rounded-2xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-slate-100 mb-4">{editingItem ? "Edit" : "Add"} Marquee Item</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs text-slate-500 font-bold">Label</label>
                <input type="text" value={form.label} onChange={e => setForm({...form, label: e.target.value})} className="w-full bg-surface-dim border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-100 mt-1" />
              </div>
              <div>
                <label className="text-xs text-slate-500 font-bold">Username *</label>
                <input type="text" required value={form.username} onChange={e => setForm({...form, username: e.target.value})} className="w-full bg-surface-dim border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-100 mt-1" />
              </div>
              <div>
                <label className="text-xs text-slate-500 font-bold">Amount (BDT) *</label>
                <input type="number" required value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} className="w-full bg-surface-dim border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-100 mt-1" />
              </div>
              <label className="flex items-center gap-2 text-sm text-slate-300">
                <input type="checkbox" checked={form.highlighted} onChange={e => setForm({...form, highlighted: e.target.checked})} className="rounded" />
                Highlight (gold color)
              </label>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-2.5 rounded-xl border border-white/10 text-slate-400 hover:text-slate-200 font-bold text-sm transition-all">Cancel</button>
                <button type="submit" className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-bold text-sm transition-all">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
