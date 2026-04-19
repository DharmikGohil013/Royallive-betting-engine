import { useState, useEffect, useCallback } from "react";
import { getSettings, updateSettingsBulk } from "../../services/api";

const ICON_OPTIONS = [
  "cookie", "tune", "analytics", "ads_click", "security",
  "manage_accounts", "update", "shield", "lock", "privacy_tip",
  "verified_user", "fingerprint", "storage", "dns", "data_usage",
];

const DEFAULT_SECTIONS = [
  { icon: "cookie", title: "What Are Cookies?", content: "Cookies are small text files placed on your device when you visit our website. They help us provide you with a better experience by remembering your preferences, keeping you signed in, and understanding how you use our platform." },
  { icon: "tune", title: "Essential Cookies", content: "These cookies are necessary for the website to function and cannot be disabled. They include session cookies for authentication, security tokens to protect your account, and preference cookies that remember your settings like language and theme." },
  { icon: "analytics", title: "Analytics Cookies", content: "We use analytics cookies to understand how visitors interact with our platform. This data helps us improve performance, fix bugs, and enhance user experience. All analytics data is anonymized and never sold to third parties." },
  { icon: "ads_click", title: "Marketing Cookies", content: "Marketing cookies track your activity across websites to deliver relevant advertisements. These cookies are only set with your explicit consent. You can opt out at any time through your browser settings or our cookie preferences panel." },
  { icon: "security", title: "Security Cookies", content: "These cookies help us detect and prevent fraudulent activity, protect against unauthorized access, and ensure the integrity of your transactions. They are critical for maintaining a safe and secure gaming environment." },
  { icon: "manage_accounts", title: "Managing Your Cookies", content: "You can control and delete cookies through your browser settings. Note that disabling certain cookies may affect the functionality of our platform. Essential cookies cannot be disabled as they are required for the site to operate." },
  { icon: "update", title: "Cookie Policy Updates", content: "We may update this Cookie Policy from time to time to reflect changes in our practices or for operational, legal, or regulatory reasons. We will notify you of any significant changes through our platform." },
];

export default function CookiePolicyPage() {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [editIdx, setEditIdx] = useState(null);
  const [form, setForm] = useState({ icon: "cookie", title: "", content: "" });
  const [showModal, setShowModal] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const showToast = useCallback((msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const data = await getSettings("policy");
        const found = (data.settings || []).find((s) => s.key === "cookie_policy_sections");
        if (found && found.value) {
          setSections(JSON.parse(found.value));
        } else {
          setSections(DEFAULT_SECTIONS);
        }
      } catch {
        showToast("Failed to load cookie policy", "error");
        setSections(DEFAULT_SECTIONS);
      } finally {
        setLoading(false);
      }
    })();
  }, [showToast]);

  const handlePublish = async () => {
    setSaving(true);
    try {
      await updateSettingsBulk([
        {
          key: "cookie_policy_sections",
          value: JSON.stringify(sections),
          category: "policy",
          description: "Cookie Policy Sections",
        },
      ]);
      showToast("Cookie policy published successfully!");
    } catch {
      showToast("Failed to publish cookie policy", "error");
    } finally {
      setSaving(false);
    }
  };

  const openAdd = () => {
    setEditIdx(null);
    setForm({ icon: "cookie", title: "", content: "" });
    setShowModal(true);
  };

  const openEdit = (idx) => {
    setEditIdx(idx);
    setForm({ ...sections[idx] });
    setShowModal(true);
  };

  const handleSave = () => {
    if (!form.title.trim() || !form.content.trim()) {
      showToast("Title and content are required", "error");
      return;
    }
    const updated = [...sections];
    if (editIdx !== null) {
      updated[editIdx] = { ...form };
    } else {
      updated.push({ ...form });
    }
    setSections(updated);
    setShowModal(false);
    showToast(editIdx !== null ? "Section updated" : "Section added");
  };

  const handleDelete = (idx) => {
    setSections((prev) => prev.filter((_, i) => i !== idx));
    showToast("Section removed");
  };

  const moveUp = (idx) => {
    if (idx === 0) return;
    const updated = [...sections];
    [updated[idx - 1], updated[idx]] = [updated[idx], updated[idx - 1]];
    setSections(updated);
  };

  const moveDown = (idx) => {
    if (idx === sections.length - 1) return;
    const updated = [...sections];
    [updated[idx], updated[idx + 1]] = [updated[idx + 1], updated[idx]];
    setSections(updated);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="font-body">
      <div className="max-w-6xl mx-auto pb-12">
        {/* Toast */}
        {toast && (
          <div className={`fixed top-6 right-6 z-[100] px-5 py-3 rounded-xl shadow-2xl text-sm font-semibold flex items-center gap-2 ${toast.type === "error" ? "bg-red-500/90 text-white" : "bg-green-500/90 text-white"}`}>
            <span className="material-symbols-outlined text-lg">{toast.type === "error" ? "error" : "check_circle"}</span>
            {toast.msg}
          </div>
        )}

        {/* Header */}
        <section className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-100 font-headline tracking-tight">
              Cookie Policy
            </h1>
            <p className="text-slate-400 mt-2 text-sm sm:text-base">
              Manage cookie policy sections displayed on the user site.
            </p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setShowPreview(true)} className="px-4 py-2 rounded-lg border border-outline-variant text-slate-300 font-medium text-xs hover:bg-white/5 transition-all flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">visibility</span>
              Preview
            </button>
            <button onClick={openAdd} className="px-4 py-2 rounded-lg border border-outline-variant text-slate-300 font-medium text-xs hover:bg-white/5 transition-all flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">add</span>
              Add Section
            </button>
            <button onClick={handlePublish} disabled={saving} className="bg-gradient-to-br from-primary to-primary-container text-on-primary px-5 py-2 rounded-lg font-bold text-xs flex items-center gap-2 hover:brightness-110 active:scale-95 transition-all disabled:opacity-50">
              <span className="material-symbols-outlined text-lg">{saving ? "hourglass_top" : "publish"}</span>
              {saving ? "Publishing..." : "Publish"}
            </button>
          </div>
        </section>

        {/* Stats */}
        <section className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-surface-container rounded-xl p-5">
            <div className="text-2xl font-black text-slate-100">{sections.length}</div>
            <div className="text-xs text-slate-500 mt-1">Total Sections</div>
          </div>
          <div className="bg-surface-container rounded-xl p-5">
            <div className="text-2xl font-black text-emerald-400">{sections.filter((s) => s.title && s.content).length}</div>
            <div className="text-xs text-slate-500 mt-1">Complete</div>
          </div>
          <div className="bg-surface-container rounded-xl p-5">
            <div className="text-2xl font-black text-amber-400">{new Set(sections.map((s) => s.icon)).size}</div>
            <div className="text-xs text-slate-500 mt-1">Unique Icons</div>
          </div>
          <div className="bg-surface-container rounded-xl p-5">
            <div className="text-2xl font-black text-blue-400">{sections.reduce((a, s) => a + (s.content || "").split(/\s+/).length, 0)}</div>
            <div className="text-xs text-slate-500 mt-1">Total Words</div>
          </div>
        </section>

        {/* Sections List */}
        <section className="space-y-3">
          {sections.length === 0 ? (
            <div className="bg-surface-container rounded-xl p-12 text-center">
              <span className="material-symbols-outlined text-5xl text-slate-600 mb-4">cookie</span>
              <p className="text-slate-400 text-sm">No sections yet. Click "Add Section" to get started.</p>
            </div>
          ) : (
            sections.map((s, idx) => (
              <article key={idx} className="bg-surface-container rounded-xl p-5 flex items-start gap-4 group hover:bg-surface-container-high transition-all">
                <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center shrink-0 border border-primary/20">
                  <span className="material-symbols-outlined text-xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>{s.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-slate-100 mb-1">{s.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">{s.content}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => moveUp(idx)} disabled={idx === 0} className="p-1.5 rounded-lg hover:bg-white/5 text-slate-400 hover:text-slate-200 disabled:opacity-30 transition-all">
                    <span className="material-symbols-outlined text-lg">arrow_upward</span>
                  </button>
                  <button onClick={() => moveDown(idx)} disabled={idx === sections.length - 1} className="p-1.5 rounded-lg hover:bg-white/5 text-slate-400 hover:text-slate-200 disabled:opacity-30 transition-all">
                    <span className="material-symbols-outlined text-lg">arrow_downward</span>
                  </button>
                  <button onClick={() => openEdit(idx)} className="p-1.5 rounded-lg hover:bg-white/5 text-slate-400 hover:text-blue-400 transition-all">
                    <span className="material-symbols-outlined text-lg">edit</span>
                  </button>
                  <button onClick={() => handleDelete(idx)} className="p-1.5 rounded-lg hover:bg-white/5 text-slate-400 hover:text-red-400 transition-all">
                    <span className="material-symbols-outlined text-lg">delete</span>
                  </button>
                </div>
              </article>
            ))
          )}
        </section>
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-high rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-100">
                {editIdx !== null ? "Edit Section" : "Add Section"}
              </h3>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-lg hover:bg-white/10 transition-all">
                <span className="material-symbols-outlined text-slate-400">close</span>
              </button>
            </div>
            <div className="p-6 space-y-5">
              {/* Icon Picker */}
              <div>
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 block">Icon</label>
                <div className="flex flex-wrap gap-2">
                  {ICON_OPTIONS.map((ic) => (
                    <button
                      key={ic}
                      onClick={() => setForm((p) => ({ ...p, icon: ic }))}
                      className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${form.icon === ic ? "bg-primary/20 border border-primary text-primary" : "bg-surface-container hover:bg-white/5 text-slate-400 border border-transparent"}`}
                    >
                      <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>{ic}</span>
                    </button>
                  ))}
                </div>
              </div>
              {/* Title */}
              <div>
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 block">Title</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                  className="w-full bg-surface-container border border-white/10 rounded-lg px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-primary/50"
                  placeholder="Section title..."
                />
              </div>
              {/* Content */}
              <div>
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 block">Content</label>
                <textarea
                  value={form.content}
                  onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))}
                  rows={5}
                  className="w-full bg-surface-container border border-white/10 rounded-lg px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-primary/50 resize-none"
                  placeholder="Section content..."
                />
              </div>
            </div>
            <div className="px-6 py-4 border-t border-white/5 flex justify-end gap-3">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 rounded-lg text-slate-400 hover:text-slate-200 text-sm font-medium transition-all">
                Cancel
              </button>
              <button onClick={handleSave} className="bg-primary text-on-primary px-6 py-2 rounded-lg font-bold text-sm hover:brightness-110 transition-all">
                {editIdx !== null ? "Update" : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
            <div className="flex items-center justify-between mb-8">
              <span className="bg-amber-500/20 text-amber-500 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                Live Preview
              </span>
              <button onClick={() => setShowPreview(false)} className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all">
                <span className="material-symbols-outlined text-white">close</span>
              </button>
            </div>

            <div className="bg-surface-container rounded-2xl p-6 sm:p-8 lg:p-10 mb-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-xl bg-surface-container-high flex items-center justify-center border border-primary/20">
                  <span className="material-symbols-outlined text-3xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>cookie</span>
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-100">Cookie Policy</h2>
                  <p className="text-xs text-slate-400">Learn how we use cookies to enhance your experience.</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {sections.map((s, i) => (
                <div key={i} className="bg-surface-container rounded-xl p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center border border-primary/20">
                      <span className="material-symbols-outlined text-lg text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>{s.icon}</span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-100 uppercase tracking-tight">{s.title}</h3>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed pl-[52px]">{s.content}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <button onClick={() => setShowPreview(false)} className="px-8 py-3 rounded-xl bg-surface-container text-slate-300 hover:bg-white/10 transition-all font-medium">
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
