import { useState, useEffect, useRef } from "react";
import { getPromotions, createPromotion, updatePromotion, deletePromotion, uploadPromotionImage } from "../../services/api";

const API_BASE = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? "" : "http://45.77.168.91:4000");
const resolveUrl = (path) => (path?.startsWith("/") ? `${API_BASE}${path}` : path);

const TYPES = ["banner", "popup", "promotion", "offer"];

export default function PromotionsPage() {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", image: "", brandName: "", link: "", type: "promotion", startDate: "", endDate: "" });
  const fileInputRef = useRef(null);

  useEffect(() => { load(); }, []);

  async function load() {
    try { setLoading(true); const data = await getPromotions(); setPromotions(data.promotions || []); } catch { } finally { setLoading(false); }
  }

  function openForm(item = null) {
    if (item) {
      setEditing(item);
      setForm({
        title: item.title || "", description: item.description || "", image: item.image || "",
        brandName: item.brandName || "", link: item.link || "", type: item.type || "promotion",
        startDate: item.startDate ? item.startDate.slice(0, 10) : "", endDate: item.endDate ? item.endDate.slice(0, 10) : "",
      });
    } else {
      setEditing(null);
      setForm({ title: "", description: "", image: "", brandName: "", link: "", type: "promotion", startDate: "", endDate: "" });
    }
    setShowForm(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if (editing) { await updatePromotion(editing._id, form); } else { await createPromotion(form); }
      setShowForm(false); load();
    } catch { }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this promotion?")) return;
    try { await deletePromotion(id); load(); } catch { }
  }

  async function toggleActive(item) {
    try { await updatePromotion(item._id, { isActive: !item.isActive }); load(); } catch { }
  }

  async function handleImageUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const data = await uploadPromotionImage(file);
      setForm((prev) => ({ ...prev, image: data.url }));
    } catch { }
    finally { setUploading(false); e.target.value = ""; }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-100">Promotions</h1>
          <p className="text-slate-500 text-sm mt-1">Manage banners, popups and promotional content</p>
        </div>
        <button onClick={() => openForm()} className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-black px-4 py-2.5 rounded-xl font-bold text-sm transition-all">
          <span className="material-symbols-outlined text-lg">add</span>New Promotion
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {loading ? <div className="col-span-full p-12 text-center text-slate-500">Loading...</div> :
          promotions.length === 0 ? <div className="col-span-full p-12 text-center text-slate-500 bg-surface-container rounded-2xl">No promotions yet.</div> :
          promotions.map(promo => (
            <div key={promo._id} className="bg-surface-container rounded-2xl overflow-hidden group">
              {promo.image && (
                <div className="h-32 bg-surface-dim overflow-hidden">
                  <img src={resolveUrl(promo.image)} alt={promo.title} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h3 className="text-sm font-bold text-slate-100">{promo.title}</h3>
                    {promo.brandName && <p className="text-xs text-amber-400">{promo.brandName}</p>}
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${promo.type === "banner" ? "bg-blue-500/20 text-blue-400" : promo.type === "popup" ? "bg-purple-500/20 text-purple-400" : "bg-amber-500/20 text-amber-400"}`}>{promo.type}</span>
                </div>
                {promo.description && <p className="text-xs text-slate-400 mb-3 line-clamp-2">{promo.description}</p>}
                <div className="text-xs text-slate-600 mb-3">
                  {promo.startDate && <span>{new Date(promo.startDate).toLocaleDateString()}</span>}
                  {promo.startDate && promo.endDate && <span> — </span>}
                  {promo.endDate && <span>{new Date(promo.endDate).toLocaleDateString()}</span>}
                </div>
                <div className="flex items-center justify-between">
                  <button onClick={() => toggleActive(promo)} className={`px-3 py-1 rounded-full text-xs font-bold ${promo.isActive ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                    {promo.isActive ? "Active" : "Inactive"}
                  </button>
                  <div className="flex gap-1">
                    <button onClick={() => openForm(promo)} className="p-1 rounded-lg hover:bg-white/10 text-slate-500 hover:text-amber-400 transition-all">
                      <span className="material-symbols-outlined text-lg">edit</span>
                    </button>
                    <button onClick={() => handleDelete(promo._id)} className="p-1 rounded-lg hover:bg-white/10 text-slate-500 hover:text-red-400 transition-all">
                      <span className="material-symbols-outlined text-lg">delete</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        }
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-surface-container rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-slate-100 mb-4">{editing ? "Edit" : "Create"} Promotion</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {[
                { key: "title", label: "Title", required: true },
                { key: "description", label: "Description", type: "textarea" },
                { key: "brandName", label: "Brand Name" },
                { key: "link", label: "Link URL" },
              ].map(f => (
                <div key={f.key}>
                  <label className="text-xs text-slate-500 font-bold">{f.label}</label>
                  {f.type === "textarea" ? (
                    <textarea value={form[f.key]} onChange={e => setForm({...form, [f.key]: e.target.value})} rows={3}
                      className="w-full bg-surface-dim border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-100 mt-1 resize-none" />
                  ) : (
                    <input type="text" required={f.required} value={form[f.key]} onChange={e => setForm({...form, [f.key]: e.target.value})}
                      className="w-full bg-surface-dim border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-100 mt-1" />
                  )}
                </div>
              ))}
              {/* Image Upload */}
              <div>
                <label className="text-xs text-slate-500 font-bold">Promotion Image</label>
                {form.image && (
                  <div className="mt-2 mb-2 relative rounded-xl overflow-hidden h-32 bg-surface-dim">
                    <img src={resolveUrl(form.image)} alt="Preview" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => setForm({...form, image: ""})}
                      className="absolute top-2 right-2 bg-black/60 hover:bg-red-500/80 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs transition-all">
                      <span className="material-symbols-outlined text-sm">close</span>
                    </button>
                  </div>
                )}
                <input type="file" ref={fileInputRef} accept="image/*" onChange={handleImageUpload} className="hidden" />
                <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading}
                  className="mt-1 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-dashed border-white/20 text-slate-400 hover:text-amber-400 hover:border-amber-400/40 text-sm transition-all">
                  <span className="material-symbols-outlined text-lg">{uploading ? "hourglass_top" : "cloud_upload"}</span>
                  {uploading ? "Uploading..." : form.image ? "Change Image" : "Upload Image"}
                </button>
              </div>
              <div>
                <label className="text-xs text-slate-500 font-bold">Type</label>
                <select value={form.type} onChange={e => setForm({...form, type: e.target.value})} className="w-full bg-surface-dim border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-100 mt-1">
                  {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-500 font-bold">Start Date</label>
                  <input type="date" value={form.startDate} onChange={e => setForm({...form, startDate: e.target.value})}
                    className="w-full bg-surface-dim border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-100 mt-1" />
                </div>
                <div>
                  <label className="text-xs text-slate-500 font-bold">End Date</label>
                  <input type="date" value={form.endDate} onChange={e => setForm({...form, endDate: e.target.value})}
                    className="w-full bg-surface-dim border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-100 mt-1" />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-2.5 rounded-xl border border-white/10 text-slate-400 font-bold text-sm">Cancel</button>
                <button type="submit" className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-bold text-sm">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
