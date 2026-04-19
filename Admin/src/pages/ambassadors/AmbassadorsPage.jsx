import { useState, useEffect, useCallback, useRef } from "react";
import { getAmbassadors, createAmbassador, updateAmbassador, deleteAmbassador, uploadAmbassadorImage } from "../../services/api";

const emptyForm = { name: "", role: "", imageUrl: "", isActive: true, order: 0 };

export default function AmbassadorsPage() {
  const [ambassadors, setAmbassadors] = useState([]);
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
      const data = await getAmbassadors();
      setAmbassadors(data.ambassadors || []);
    } catch (e) { console.error(e); }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => { setEditing(null); setForm(emptyForm); setShowModal(true); };
  const openEdit = (a) => {
    setEditing(a._id);
    setForm({ name: a.name, role: a.role, imageUrl: a.imageUrl || "", isActive: a.isActive, order: a.order || 0 });
    setShowModal(true);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploading(true);
      const data = await uploadAmbassadorImage(file);
      setForm({ ...form, imageUrl: data.url });
    } catch (err) { console.error(err); }
    setUploading(false);
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.role.trim()) return;
    try {
      setSaving(true);
      if (editing) {
        await updateAmbassador(editing, form);
      } else {
        await createAmbassador(form);
      }
      setShowModal(false);
      load();
    } catch (e) { console.error(e); }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this ambassador?")) return;
    try {
      await deleteAmbassador(id);
      load();
    } catch (e) { console.error(e); }
  };

  const toggleActive = async (a) => {
    try {
      await updateAmbassador(a._id, { isActive: !a.isActive });
      load();
    } catch (e) { console.error(e); }
  };

  return (
    <div className="font-body">
      <div className="max-w-7xl mx-auto">
        <section className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-black text-on-surface mb-2 tracking-tight">Brand Ambassadors</h1>
            <p className="text-slate-400 text-sm">Manage brand ambassadors displayed on the homepage.</p>
          </div>
          <button onClick={openCreate} className="flex items-center gap-2 bg-gradient-to-r from-primary to-primary-container text-on-primary px-6 py-3 rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all font-bold text-sm self-start">
            <span className="material-symbols-outlined">add</span>
            Add Ambassador
          </button>
        </section>

        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Total", value: ambassadors.length, icon: "star", color: "text-primary", bg: "bg-primary/10" },
            { label: "Active", value: ambassadors.filter(a => a.isActive).length, icon: "check_circle", color: "text-emerald-400", bg: "bg-emerald-400/10" },
            { label: "Inactive", value: ambassadors.filter(a => !a.isActive).length, icon: "cancel", color: "text-slate-400", bg: "bg-slate-400/10" },
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
        ) : ambassadors.length === 0 ? (
          <div className="text-center py-20 text-slate-500">
            <span className="material-symbols-outlined text-5xl mb-3 block opacity-30">star</span>
            <p className="font-bold">No ambassadors yet</p>
            <p className="text-sm mt-1">Click "Add Ambassador" to create one.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {ambassadors.map((a) => (
              <div key={a._id} className="bg-surface-container rounded-2xl p-5 flex items-start gap-4 group">
                <div className="w-16 h-16 rounded-full bg-surface-container-high flex items-center justify-center overflow-hidden shrink-0 border-2 border-primary/20">
                  {a.imageUrl ? (
                    <img src={a.imageUrl} alt={a.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="material-symbols-outlined text-2xl text-slate-500">person</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-on-surface text-sm truncate">{a.name}</h3>
                  <p className="text-xs text-primary font-medium mt-0.5">{a.role}</p>
                  <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded mt-2 ${a.isActive ? "bg-emerald-500/20 text-emerald-400" : "bg-slate-500/20 text-slate-400"}`}>
                    {a.isActive ? "Active" : "Inactive"}
                  </span>
                  <div className="flex gap-2 mt-3">
                    <button onClick={() => openEdit(a)} className="flex-1 text-xs font-bold py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition">Edit</button>
                    <button onClick={() => toggleActive(a)} className="flex-1 text-xs font-bold py-2 rounded-lg bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 transition">
                      {a.isActive ? "Disable" : "Enable"}
                    </button>
                    <button onClick={() => handleDelete(a._id)} className="text-xs font-bold py-2 px-3 rounded-lg bg-error/10 text-error hover:bg-error/20 transition">
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
            <h2 className="text-xl font-black text-on-surface mb-6">{editing ? "Edit Ambassador" : "Add Ambassador"}</h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">Name</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full bg-surface-container-low text-on-surface text-sm px-4 py-3 rounded-xl ring-1 ring-white/5 focus:ring-primary/50 outline-none" placeholder="Ambassador name" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">Role</label>
                <input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="w-full bg-surface-container-low text-on-surface text-sm px-4 py-3 rounded-xl ring-1 ring-white/5 focus:ring-primary/50 outline-none" placeholder="e.g. Pro Poker Champion" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">Photo (optional)</label>
                <input type="file" ref={fileRef} accept="image/*" onChange={handleImageUpload} className="hidden" />
                {form.imageUrl ? (
                  <div className="relative w-24 h-24 rounded-full overflow-hidden bg-surface-container-high mx-auto">
                    <img src={form.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => { setForm({ ...form, imageUrl: "" }); if (fileRef.current) fileRef.current.value = ""; }} className="absolute top-0 right-0 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition">
                      <span className="material-symbols-outlined text-xs">close</span>
                    </button>
                  </div>
                ) : (
                  <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading} className="w-full py-6 rounded-xl border-2 border-dashed border-white/10 hover:border-primary/40 bg-surface-container-low flex flex-col items-center justify-center gap-2 transition cursor-pointer disabled:opacity-50">
                    {uploading ? (
                      <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-3xl text-slate-500">cloud_upload</span>
                        <span className="text-xs text-slate-400 font-medium">Click to upload photo</span>
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
