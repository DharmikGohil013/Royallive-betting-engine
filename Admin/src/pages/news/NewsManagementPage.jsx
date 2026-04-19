import { useState, useEffect, useCallback } from "react";
import { getNews, createNews, updateNews, deleteNews } from "../../services/api";

const CATEGORIES = ["general", "update", "maintenance", "promotion", "alert"];
const catColors = {
  general: "text-primary bg-primary/10",
  update: "text-emerald-400 bg-emerald-400/10",
  maintenance: "text-amber-400 bg-amber-400/10",
  promotion: "text-secondary bg-secondary/10",
  alert: "text-error bg-error/10",
};

const emptyForm = { title: "", content: "", category: "general", isActive: true, isPinned: false };

export default function NewsManagementPage() {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [filterCat, setFilterCat] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const params = { page, limit: 10 };
      if (filterCat) params.category = filterCat;
      const data = await getNews(params);
      setItems(data.news || []);
      setTotal(data.total || 0);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  }, [page, filterCat]);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => { setEditing(null); setForm(emptyForm); setShowModal(true); };
  const openEdit = (item) => {
    setEditing(item._id);
    setForm({ title: item.title, content: item.content, category: item.category, isActive: item.isActive, isPinned: item.isPinned });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.content.trim()) return;
    try {
      setSaving(true);
      if (editing) {
        await updateNews(editing, form);
      } else {
        await createNews(form);
      }
      setShowModal(false);
      load();
    } catch (e) { console.error(e); } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this news item?")) return;
    try {
      setDeleting(id);
      await deleteNews(id);
      load();
    } catch (e) { console.error(e); } finally { setDeleting(null); }
  };

  const toggleActive = async (item) => {
    try { await updateNews(item._id, { isActive: !item.isActive }); load(); } catch (e) { console.error(e); }
  };

  const togglePinned = async (item) => {
    try { await updateNews(item._id, { isPinned: !item.isPinned }); load(); } catch (e) { console.error(e); }
  };

  const totalPages = Math.ceil(total / 10) || 1;
  const filtered = searchTerm ? items.filter(i => i.title.toLowerCase().includes(searchTerm.toLowerCase())) : items;

  return (
    <div className="font-body">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <section className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-black text-on-surface mb-2 tracking-tight">News Management</h1>
            <p className="text-slate-400 text-sm">Create, edit, and manage news announcements for users.</p>
          </div>
          <button onClick={openCreate} className="flex items-center gap-2 bg-gradient-to-r from-primary to-primary-container text-on-primary px-6 py-3 rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all font-bold text-sm self-start">
            <span className="material-symbols-outlined">add</span>
            Create News
          </button>
        </section>

        {/* Stats */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Total News", value: total, icon: "newspaper", color: "text-primary", bg: "bg-primary/10" },
            { label: "Active", value: items.filter(i => i.isActive).length, icon: "check_circle", color: "text-emerald-400", bg: "bg-emerald-400/10" },
            { label: "Pinned", value: items.filter(i => i.isPinned).length, icon: "push_pin", color: "text-amber-400", bg: "bg-amber-400/10" },
            { label: "Alerts", value: items.filter(i => i.category === "alert").length, icon: "warning", color: "text-error", bg: "bg-error/10" },
          ].map((s) => (
            <div key={s.label} className="bg-surface-container rounded-2xl p-5 relative overflow-hidden group hover:bg-surface-container-high transition-all">
              <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center mb-3`}>
                <span className={`material-symbols-outlined ${s.color}`}>{s.icon}</span>
              </div>
              <p className="text-2xl font-black text-on-surface tracking-tight">{s.value}</p>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">{s.label}</p>
            </div>
          ))}
        </section>

        {/* Filters */}
        <section className="bg-surface-container rounded-3xl overflow-hidden">
          <div className="p-6 border-b border-white/5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-surface-container-high/30">
            <div className="flex flex-wrap gap-2">
              <button onClick={() => { setFilterCat(""); setPage(1); }} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${!filterCat ? "bg-primary text-on-primary" : "bg-surface-container-low text-slate-400 hover:text-on-surface"}`}>All</button>
              {CATEGORIES.map(c => (
                <button key={c} onClick={() => { setFilterCat(c); setPage(1); }} className={`px-4 py-2 rounded-lg text-xs font-bold capitalize transition-all ${filterCat === c ? "bg-primary text-on-primary" : "bg-surface-container-low text-slate-400 hover:text-on-surface"}`}>{c}</button>
              ))}
            </div>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">search</span>
              <input type="text" placeholder="Search news..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="bg-surface-container-low text-sm text-on-surface pl-10 pr-4 py-2 rounded-lg ring-1 ring-white/5 focus:ring-primary/50 focus:outline-none w-full sm:w-64" />
            </div>
          </div>

          {/* Table */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px] text-left">
                <thead className="text-slate-500 text-[10px] uppercase tracking-widest bg-surface-container-low/50">
                  <tr>
                    <th className="px-6 py-4 font-bold">Title</th>
                    <th className="px-6 py-4 font-bold">Category</th>
                    <th className="px-6 py-4 font-bold text-center">Status</th>
                    <th className="px-6 py-4 font-bold text-center">Pinned</th>
                    <th className="px-6 py-4 font-bold">Date</th>
                    <th className="px-6 py-4 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.03]">
                  {filtered.length === 0 ? (
                    <tr><td colSpan={6} className="px-6 py-16 text-center text-slate-500">No news items found</td></tr>
                  ) : filtered.map((item) => (
                    <tr key={item._id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-5">
                        <div>
                          <p className="text-sm font-bold text-on-surface">{item.title}</p>
                          <p className="text-xs text-slate-500 mt-1 max-w-[300px] truncate">{item.content}</p>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded capitalize ${catColors[item.category] || "text-slate-400 bg-slate-400/10"}`}>{item.category}</span>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <button onClick={() => toggleActive(item)} className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase transition-all ${item.isActive ? "bg-emerald-400/10 text-emerald-400" : "bg-slate-500/10 text-slate-500"}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${item.isActive ? "bg-emerald-400 animate-pulse" : "bg-slate-500"}`} />
                          {item.isActive ? "Active" : "Inactive"}
                        </button>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <button onClick={() => togglePinned(item)} className={`material-symbols-outlined text-lg transition-all ${item.isPinned ? "text-amber-400" : "text-slate-600 hover:text-slate-400"}`} style={item.isPinned ? { fontVariationSettings: "'FILL' 1" } : {}}>push_pin</button>
                      </td>
                      <td className="px-6 py-5 text-sm text-slate-400">{new Date(item.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => openEdit(item)} className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-on-primary transition-all">
                            <span className="material-symbols-outlined text-sm">edit</span>
                          </button>
                          <button onClick={() => handleDelete(item._id)} disabled={deleting === item._id} className="w-8 h-8 rounded-lg bg-error/10 text-error flex items-center justify-center hover:bg-error hover:text-white transition-all disabled:opacity-30">
                            <span className="material-symbols-outlined text-sm">{deleting === item._id ? "hourglass_top" : "delete"}</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          <div className="p-6 bg-surface-container-low/30 border-t border-white/5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-slate-500 text-xs">Showing {filtered.length} of {total} items</p>
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
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowModal(false)}>
          <div className="bg-surface-container rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 lg:p-8 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black text-on-surface">{editing ? "Edit News" : "Create News"}</h2>
              <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-slate-400 hover:text-on-surface">
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">Title</label>
                <input type="text" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className="w-full bg-surface-container-low text-on-surface text-sm px-4 py-3 rounded-xl ring-1 ring-white/5 focus:ring-primary/50 focus:outline-none" placeholder="News title..." />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">Content</label>
                <textarea value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} rows={5} className="w-full bg-surface-container-low text-on-surface text-sm px-4 py-3 rounded-xl ring-1 ring-white/5 focus:ring-primary/50 focus:outline-none resize-none" placeholder="News content..." />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">Category</label>
                <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className="w-full bg-surface-container-low text-on-surface text-sm px-4 py-3 rounded-xl ring-1 ring-white/5 focus:ring-primary/50 focus:outline-none">
                  {CATEGORIES.map(c => <option key={c} value={c} className="capitalize">{c}</option>)}
                </select>
              </div>

              <div className="flex gap-6">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={form.isActive} onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))} className="w-4 h-4 rounded accent-primary" />
                  <span className="text-sm text-on-surface font-bold">Active</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={form.isPinned} onChange={e => setForm(f => ({ ...f, isPinned: e.target.checked }))} className="w-4 h-4 rounded accent-amber-400" />
                  <span className="text-sm text-on-surface font-bold">Pinned</span>
                </label>
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button onClick={() => setShowModal(false)} className="flex-1 bg-surface-container-high text-slate-400 py-3 rounded-xl font-bold text-sm hover:text-on-surface transition-all">Cancel</button>
              <button onClick={handleSave} disabled={saving || !form.title.trim() || !form.content.trim()} className="flex-1 bg-gradient-to-r from-primary to-primary-container text-on-primary py-3 rounded-xl font-bold text-sm shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none">
                {saving ? "Saving..." : editing ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
