import { useState, useEffect, useRef } from "react";
import { getLoginPromos, createLoginPromo, updateLoginPromo, deleteLoginPromo, uploadLoginPromoImage } from "../../services/api";

const API_BASE = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? "" : "http://45.77.168.91:4000");
const resolveUrl = (path) => (path?.startsWith("/") ? `${API_BASE}${path}` : path);

const EMPTY_FORM = { tagline: "", headline: "", ctaText: "", ctaIcon: "bolt", image: "", link: "" };

export default function LoginPromoPage() {
  const [promos, setPromos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const fileInputRef = useRef(null);

  useEffect(() => { load(); }, []);
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") setShowForm(false); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [showForm]);

  async function load() {
    try {
      setLoading(true);
      const data = await getLoginPromos();
      setPromos(data.promos || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function openForm(item = null) {
    if (item) {
      setEditing(item);
      setForm({
        tagline: item.tagline || "",
        headline: item.headline || "",
        ctaText: item.ctaText || "",
        ctaIcon: item.ctaIcon || "bolt",
        image: item.image || "",
        link: item.link || "",
      });
    } else {
      setEditing(null);
      setForm({ ...EMPTY_FORM });
    }
    setShowForm(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.tagline?.trim() || !form.headline?.trim()) return alert("Tagline and headline are required");
    try {
      if (editing) {
        await updateLoginPromo(editing._id, form);
      } else {
        await createLoginPromo(form);
      }
      setShowForm(false);
      load();
    } catch (err) {
      console.error(err);
      alert("Failed to save login promo");
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this login promo?")) return;
    try {
      await deleteLoginPromo(id);
      load();
    } catch (err) {
      console.error(err);
    }
  }

  async function toggleActive(item) {
    try {
      await updateLoginPromo(item._id, { isActive: !item.isActive });
      load();
    } catch (err) {
      console.error(err);
    }
  }

  async function handleImageUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const data = await uploadLoginPromoImage(file);
      setForm((prev) => ({ ...prev, image: data.url }));
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-100">Login Promo</h1>
          <p className="text-slate-500 text-sm mt-1">
            Manage the bonus/promo section shown on the login page
          </p>
        </div>
        <button
          onClick={() => openForm()}
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-black px-4 py-2.5 rounded-xl font-bold text-sm transition-all"
        >
          <span className="material-symbols-outlined text-lg">add</span>New Promo
        </button>
      </div>

      {/* Live Preview */}
      {promos.filter((p) => p.isActive).length > 0 && (
        <div className="bg-surface-container rounded-2xl p-5 border border-white/5">
          <p className="text-xs text-slate-600 font-bold uppercase tracking-widest mb-3">
            <span className="material-symbols-outlined text-xs mr-1 align-middle text-amber-500">visibility</span>
            Live Preview — Login Page
          </p>
          <div className="max-w-sm mx-auto space-y-3">
            {promos
              .filter((p) => p.isActive)
              .map((p) => (
                <div
                  key={p._id}
                  className="group relative overflow-hidden rounded-lg border border-cyan-400/15 bg-[#0f1923] transition-all duration-300 hover:border-cyan-400/40"
                >
                  <div className="flex items-center">
                    <div className="h-20 w-1/3 overflow-hidden sm:h-24 bg-[#1a2836]">
                      {p.image ? (
                        <img
                          src={resolveUrl(p.image)}
                          alt={p.headline}
                          className="h-full w-full object-cover grayscale transition-all duration-500 group-hover:grayscale-0"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <span className="material-symbols-outlined text-3xl text-cyan-400/20">local_offer</span>
                        </div>
                      )}
                    </div>
                    <div className="w-2/3 p-3 sm:p-4">
                      <p className="mb-1 text-[10px] font-black uppercase tracking-widest text-pink-400">
                        {p.tagline}
                      </p>
                      <h3 className="text-base font-bold uppercase leading-tight text-slate-100 sm:text-lg">
                        {p.headline}
                      </h3>
                      {p.ctaText && (
                        <p className="mt-1 flex items-center text-[10px] font-bold tracking-tight text-cyan-400">
                          {p.ctaText}
                          {p.ctaIcon && (
                            <span className="material-symbols-outlined ml-1 text-xs">{p.ctaIcon}</span>
                          )}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <div className="col-span-full p-12 text-center text-slate-500">Loading...</div>
        ) : promos.length === 0 ? (
          <div className="col-span-full p-12 text-center text-slate-500 bg-surface-container rounded-2xl">
            <span className="material-symbols-outlined text-4xl text-slate-600 mb-2 block">local_offer</span>
            No login promos yet. Create one to display on the login page.
          </div>
        ) : (
          promos.map((promo) => (
            <div key={promo._id} className="bg-surface-container rounded-2xl overflow-hidden group">
              {promo.image && (
                <div className="h-32 bg-surface-dim overflow-hidden">
                  <img
                    src={resolveUrl(promo.image)}
                    alt={promo.headline}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <p className="text-[10px] font-bold text-amber-400 uppercase tracking-widest mb-0.5">
                      {promo.tagline}
                    </p>
                    <h3 className="text-sm font-bold text-slate-100">{promo.headline}</h3>
                  </div>
                  {promo.ctaIcon && (
                    <span className="material-symbols-outlined text-lg text-cyan-400/40">{promo.ctaIcon}</span>
                  )}
                </div>
                {promo.ctaText && (
                  <p className="text-xs text-slate-400 mb-3">{promo.ctaText}</p>
                )}
                {promo.link && (
                  <p className="text-[10px] text-slate-600 mb-3 truncate">{promo.link}</p>
                )}
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => toggleActive(promo)}
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      promo.isActive
                        ? "bg-green-500/20 text-green-400"
                        : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    {promo.isActive ? "Active" : "Inactive"}
                  </button>
                  <div className="flex gap-1">
                    <button
                      onClick={() => openForm(promo)}
                      className="p-1 rounded-lg hover:bg-white/10 text-slate-500 hover:text-amber-400 transition-all"
                    >
                      <span className="material-symbols-outlined text-lg">edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(promo._id)}
                      className="p-1 rounded-lg hover:bg-white/10 text-slate-500 hover:text-red-400 transition-all"
                    >
                      <span className="material-symbols-outlined text-lg">delete</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
          onClick={() => setShowForm(false)}
        >
          <div
            className="bg-surface-container rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-bold text-slate-100 mb-4">
              {editing ? "Edit" : "Create"} Login Promo
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Tagline */}
              <div>
                <label className="text-xs text-slate-500 font-bold">Tagline</label>
                <input
                  type="text"
                  required
                  value={form.tagline}
                  onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                  placeholder="e.g. Top Bonus Offer"
                  className="w-full bg-surface-dim border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-100 mt-1"
                />
              </div>

              {/* Headline */}
              <div>
                <label className="text-xs text-slate-500 font-bold">Headline</label>
                <input
                  type="text"
                  required
                  value={form.headline}
                  onChange={(e) => setForm({ ...form, headline: e.target.value })}
                  placeholder="e.g. 200% Kinetic Boost"
                  className="w-full bg-surface-dim border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-100 mt-1"
                />
              </div>

              {/* CTA Text */}
              <div>
                <label className="text-xs text-slate-500 font-bold">CTA Text</label>
                <input
                  type="text"
                  value={form.ctaText}
                  onChange={(e) => setForm({ ...form, ctaText: e.target.value })}
                  placeholder="e.g. REDEEM ON FIRST DEPOSIT"
                  className="w-full bg-surface-dim border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-100 mt-1"
                />
              </div>

              {/* CTA Icon */}
              <div>
                <label className="text-xs text-slate-500 font-bold">CTA Icon (Material Symbol name)</label>
                <div className="flex items-center gap-3 mt-1">
                  <input
                    type="text"
                    value={form.ctaIcon}
                    onChange={(e) => setForm({ ...form, ctaIcon: e.target.value })}
                    placeholder="e.g. bolt"
                    className="flex-1 bg-surface-dim border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-100"
                  />
                  {form.ctaIcon && (
                    <span className="material-symbols-outlined text-2xl text-amber-400">{form.ctaIcon}</span>
                  )}
                </div>
              </div>

              {/* Link */}
              <div>
                <label className="text-xs text-slate-500 font-bold">Link URL (optional)</label>
                <input
                  type="text"
                  value={form.link}
                  onChange={(e) => setForm({ ...form, link: e.target.value })}
                  placeholder="e.g. /promotions"
                  className="w-full bg-surface-dim border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-100 mt-1"
                />
              </div>

              {/* Image */}
              <div>
                <label className="text-xs text-slate-500 font-bold">Promo Image</label>
                {form.image && (
                  <div className="mt-2 mb-2 relative rounded-xl overflow-hidden h-32 bg-surface-dim">
                    <img src={resolveUrl(form.image)} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, image: "" })}
                      className="absolute top-2 right-2 bg-black/60 hover:bg-red-500/80 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs transition-all"
                    >
                      <span className="material-symbols-outlined text-sm">close</span>
                    </button>
                  </div>
                )}
                <input type="file" ref={fileInputRef} accept="image/*" onChange={handleImageUpload} className="hidden" />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="mt-1 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-dashed border-white/20 text-slate-400 hover:text-amber-400 hover:border-amber-400/40 text-sm transition-all"
                >
                  <span className="material-symbols-outlined text-lg">
                    {uploading ? "hourglass_top" : "cloud_upload"}
                  </span>
                  {uploading ? "Uploading..." : form.image ? "Change Image" : "Upload Image"}
                </button>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex-1 h-px bg-white/10" />
                  <span className="text-[10px] text-slate-600 uppercase tracking-widest">or paste URL</span>
                  <div className="flex-1 h-px bg-white/10" />
                </div>
                <input
                  type="text"
                  placeholder="https://example.com/image.jpg"
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                  className="w-full bg-surface-dim border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-100 mt-1"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 py-2.5 rounded-xl border border-white/10 text-slate-400 font-bold text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-bold text-sm"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
