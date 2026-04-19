import { useState, useEffect, useCallback, useRef } from "react";
import { getBanners, createBanner, updateBanner, deleteBanner, uploadBannerImage } from "../../services/api";

const emptyForm = { title: "", imageUrl: "", link: "", isActive: true, order: 0 };

export default function BannerManagementPage() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getBanners();
      setBanners(data.banners || []);
    } catch (e) { console.error(e); }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { const handler = (e) => { if (e.key === 'Escape') setShowModal(false); }; window.addEventListener('keydown', handler); return () => window.removeEventListener('keydown', handler); }, [showModal]);


  const openCreate = () => { setEditing(null); setForm(emptyForm); setShowModal(true); };
  const openEdit = (b) => {
    setEditing(b._id);
    setForm({ title: b.title, imageUrl: b.imageUrl, link: b.link || "", isActive: b.isActive, order: b.order || 0 });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.title.trim()) return alert("Banner title is required");
    if (!form.imageUrl) return alert("Please upload a banner image");
    try {
      setSaving(true);
      if (editing) {
        await updateBanner(editing, form);
      } else {
        await createBanner(form);
      }
      setShowModal(false);
      load();
    } catch (e) { console.error(e); alert("Failed to save banner"); }
    setSaving(false);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploading(true);
      const data = await uploadBannerImage(file);
      setForm({ ...form, imageUrl: data.url });
    } catch (err) { console.error(err); }
    setUploading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this banner?")) return;
    try {
      await deleteBanner(id);
      load();
    } catch (e) { console.error(e); }
  };

  const toggleActive = async (b) => {
    try {
      await updateBanner(b._id, { isActive: !b.isActive });
      load();
    } catch (e) { console.error(e); }
  };

  return (
    <div className="font-body">
      <div className="max-w-7xl mx-auto">
        <section className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-black text-on-surface mb-2 tracking-tight">Banner Management</h1>
            <p className="text-slate-400 text-sm">Manage homepage banner carousel images.</p>
          </div>
          <button onClick={openCreate} className="flex items-center gap-2 bg-gradient-to-r from-primary to-primary-container text-on-primary px-6 py-3 rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all font-bold text-sm self-start">
            <span className="material-symbols-outlined">add</span>
            Add Banner
          </button>
        </section>

        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Total", value: banners.length, icon: "image", color: "text-primary", bg: "bg-primary/10" },
            { label: "Active", value: banners.filter(b => b.isActive).length, icon: "check_circle", color: "text-emerald-400", bg: "bg-emerald-400/10" },
            { label: "Inactive", value: banners.filter(b => !b.isActive).length, icon: "cancel", color: "text-slate-400", bg: "bg-slate-400/10" },
          ].map((s) => (
            <div key={s.label} className="bg-surface-container rounded-2xl p-5 relative overflow-hidden">
              <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center mb-3`}>
                <span className={`material-symbols-outlined ${s.color}`}>{s.icon}</span>
              </div>
              <p className="text-2xl font-black text-on-surface">{s.value}</p>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">{s.label}</p>
            </div>
          ))}
        </section>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : banners.length === 0 ? (
          <div className="text-center py-20 text-slate-500">
            <span className="material-symbols-outlined text-5xl mb-3 block opacity-30">image</span>
            <p className="font-bold">No banners yet</p>
            <p className="text-sm mt-1">Click "Add Banner" to create one.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {banners.map((b) => (
              <div key={b._id} className="bg-surface-container rounded-2xl overflow-hidden group">
                <div className="aspect-[16/9] bg-surface-container-high relative">
                  <img src={b.imageUrl} alt={b.title} className="w-full h-full object-cover" />
                  <div className="absolute top-3 right-3 flex gap-2">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded ${b.isActive ? "bg-emerald-500/20 text-emerald-400" : "bg-slate-500/20 text-slate-400"}`}>
                      {b.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-on-surface text-sm mb-1">{b.title}</h3>
                  {b.link && <p className="text-xs text-slate-500 truncate">{b.link}</p>}
                  <p className="text-xs text-slate-600 mt-1">Order: {b.order}</p>
                  <div className="flex gap-2 mt-3">
                    <button onClick={() => openEdit(b)} className="flex-1 text-xs font-bold py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition">Edit</button>
                    <button onClick={() => toggleActive(b)} className="flex-1 text-xs font-bold py-2 rounded-lg bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 transition">
                      {b.isActive ? "Disable" : "Enable"}
                    </button>
                    <button onClick={() => handleDelete(b._id)} className="text-xs font-bold py-2 px-3 rounded-lg bg-error/10 text-error hover:bg-error/20 transition">
                      <span className="material-symbols-outlined text-sm">delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={() => setShowModal(false)}>
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <div className="relative w-full max-w-lg bg-surface-container rounded-t-2xl sm:rounded-2xl p-6 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-black text-on-surface mb-6">{editing ? "Edit Banner" : "Add Banner"}</h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">Title</label>
                <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full bg-surface-container-low text-on-surface text-sm px-4 py-3 rounded-xl ring-1 ring-white/5 focus:ring-primary/50 outline-none" placeholder="Banner title" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">Banner Image</label>
                <input type="file" ref={fileRef} accept="image/*" onChange={handleImageUpload} className="hidden" />
                {form.imageUrl ? (
                  <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-surface-container-high">
                    <img src={form.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => { setForm({ ...form, imageUrl: "" }); if (fileRef.current) fileRef.current.value = ""; }} className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition">
                      <span className="material-symbols-outlined text-sm">close</span>
                    </button>
                  </div>
                ) : (
                  <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading} className="w-full aspect-[16/9] rounded-xl border-2 border-dashed border-white/10 hover:border-primary/40 bg-surface-container-low flex flex-col items-center justify-center gap-2 transition cursor-pointer disabled:opacity-50">
                    {uploading ? (
                      <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-3xl text-slate-500">cloud_upload</span>
                        <span className="text-xs text-slate-400 font-medium">Click to upload image</span>
                        <span className="text-[10px] text-slate-600">PNG, JPG, WebP up to 5MB</span>
                      </>
                    )}
                  </button>
                )}
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">Link (optional)</label>
                <input value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} className="w-full bg-surface-container-low text-on-surface text-sm px-4 py-3 rounded-xl ring-1 ring-white/5 focus:ring-primary/50 outline-none" placeholder="/promotions" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">Order</label>
                  <input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} className="w-full bg-surface-container-low text-on-surface text-sm px-4 py-3 rounded-xl ring-1 ring-white/5 focus:ring-primary/50 outline-none" />
                </div>
                <div className="flex items-end">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="sr-only peer" />
                    <div className="w-10 h-5 bg-surface-container-high rounded-full peer-checked:bg-primary transition-all relative after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:w-4 after:h-4 after:bg-white after:rounded-full after:transition-all peer-checked:after:translate-x-5" />
                    <span className="text-sm text-slate-300 font-medium">Active</span>
                  </label>
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="flex-1 py-3 rounded-xl text-sm font-bold text-slate-400 bg-surface-container-low hover:bg-surface-container-high transition">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="flex-1 py-3 rounded-xl text-sm font-bold bg-primary text-on-primary hover:brightness-110 transition disabled:opacity-50">
                {saving ? "Saving..." : editing ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
