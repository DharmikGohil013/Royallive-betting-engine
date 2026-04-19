import { useState, useEffect, useCallback, useRef } from "react";
import { getSponsors, createSponsor, updateSponsor, deleteSponsor, uploadSponsorImage } from "../../services/api";

const emptyForm = { name: "", logoUrl: "", isActive: true, order: 0 };

export default function SponsorsPage() {
  const [sponsors, setSponsors] = useState([]);
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
      const data = await getSponsors();
      setSponsors(data.sponsors || []);
    } catch (e) { console.error(e); }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { const handler = (e) => { if (e.key === 'Escape') setShowModal(false); }; window.addEventListener('keydown', handler); return () => window.removeEventListener('keydown', handler); }, [showModal]);


  const openCreate = () => { setEditing(null); setForm(emptyForm); setShowModal(true); };
  const openEdit = (s) => {
    setEditing(s._id);
    setForm({ name: s.name, logoUrl: s.logoUrl, isActive: s.isActive, order: s.order || 0 });
    setShowModal(true);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploading(true);
      const data = await uploadSponsorImage(file);
      setForm({ ...form, logoUrl: data.url });
    } catch (err) { console.error(err); }
    setUploading(false);
  };

  const handleSave = async () => {
    if (!form.name.trim()) return alert("Sponsor name is required");
    if (!form.logoUrl) return alert("Please upload a logo image");
    try {
      setSaving(true);
      if (editing) {
        await updateSponsor(editing, form);
      } else {
        await createSponsor(form);
      }
      setShowModal(false);
      load();
    } catch (e) { console.error(e); }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this sponsor?")) return;
    try {
      await deleteSponsor(id);
      load();
    } catch (e) { console.error(e); }
  };

  const toggleActive = async (s) => {
    try {
      await updateSponsor(s._id, { isActive: !s.isActive });
      load();
    } catch (e) { console.error(e); }
  };

  return (
    <div className="font-body">
      <div className="max-w-7xl mx-auto">
        <section className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-black text-on-surface mb-2 tracking-tight">Sponsors</h1>
            <p className="text-slate-400 text-sm">Manage sponsor logos displayed on the homepage.</p>
          </div>
          <button onClick={openCreate} className="flex items-center gap-2 bg-gradient-to-r from-primary to-primary-container text-on-primary px-6 py-3 rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all font-bold text-sm self-start">
            <span className="material-symbols-outlined">add</span>
            Add Sponsor
          </button>
        </section>

        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Total", value: sponsors.length, icon: "handshake", color: "text-primary", bg: "bg-primary/10" },
            { label: "Active", value: sponsors.filter(s => s.isActive).length, icon: "check_circle", color: "text-emerald-400", bg: "bg-emerald-400/10" },
            { label: "Inactive", value: sponsors.filter(s => !s.isActive).length, icon: "cancel", color: "text-slate-400", bg: "bg-slate-400/10" },
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
        ) : sponsors.length === 0 ? (
          <div className="text-center py-20 text-slate-500">
            <span className="material-symbols-outlined text-5xl mb-3 block opacity-30">handshake</span>
            <p className="font-bold">No sponsors yet</p>
            <p className="text-sm mt-1">Click "Add Sponsor" to create one.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {sponsors.map((s) => (
              <div key={s._id} className="bg-surface-container rounded-2xl p-5 flex flex-col items-center group">
                <div className="w-20 h-20 rounded-xl bg-surface-container-high flex items-center justify-center mb-3 overflow-hidden">
                  <img src={s.logoUrl} alt={s.name} className="w-full h-full object-contain p-2" />
                </div>
                <h3 className="font-bold text-on-surface text-sm mb-1 text-center">{s.name}</h3>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded mb-3 ${s.isActive ? "bg-emerald-500/20 text-emerald-400" : "bg-slate-500/20 text-slate-400"}`}>
                  {s.isActive ? "Active" : "Inactive"}
                </span>
                <div className="flex gap-2 w-full">
                  <button onClick={() => openEdit(s)} className="flex-1 text-xs font-bold py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition">Edit</button>
                  <button onClick={() => toggleActive(s)} className="flex-1 text-xs font-bold py-2 rounded-lg bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 transition">
                    {s.isActive ? "Disable" : "Enable"}
                  </button>
                  <button onClick={() => handleDelete(s._id)} className="text-xs font-bold py-2 px-3 rounded-lg bg-error/10 text-error hover:bg-error/20 transition">
                    <span className="material-symbols-outlined text-sm">delete</span>
                  </button>
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
            <h2 className="text-xl font-black text-on-surface mb-6">{editing ? "Edit Sponsor" : "Add Sponsor"}</h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">Name</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full bg-surface-container-low text-on-surface text-sm px-4 py-3 rounded-xl ring-1 ring-white/5 focus:ring-primary/50 outline-none" placeholder="Sponsor name" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">Logo</label>
                <input type="file" ref={fileRef} accept="image/*" onChange={handleImageUpload} className="hidden" />
                {form.logoUrl ? (
                  <div className="relative w-32 h-32 rounded-xl overflow-hidden bg-surface-container-high mx-auto">
                    <img src={form.logoUrl} alt="Preview" className="w-full h-full object-contain p-2" />
                    <button type="button" onClick={() => { setForm({ ...form, logoUrl: "" }); if (fileRef.current) fileRef.current.value = ""; }} className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition">
                      <span className="material-symbols-outlined text-xs">close</span>
                    </button>
                  </div>
                ) : (
                  <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading} className="w-full py-8 rounded-xl border-2 border-dashed border-white/10 hover:border-primary/40 bg-surface-container-low flex flex-col items-center justify-center gap-2 transition cursor-pointer disabled:opacity-50">
                    {uploading ? (
                      <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-3xl text-slate-500">cloud_upload</span>
                        <span className="text-xs text-slate-400 font-medium">Click to upload logo</span>
                        <span className="text-[10px] text-slate-600">PNG, SVG, JPG, WebP up to 5MB</span>
                      </>
                    )}
                  </button>
                )}
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
