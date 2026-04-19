import { useState, useEffect, useCallback, useRef } from "react";
import { getSettings, updateSettingsBulk, uploadFile } from "../../services/api";

const ABOUT_KEYS = [
  { key: "about_content", default: "We are a premium cricket platform delivering real-time updates and an elevated gaming experience. Our mission is to combine a passion for cricket with modern technology to create a trusted community. For over 10 years, we have been serving thousands of users with reliable services.\n\nOur commitments:\n1. Transparent gaming policy\n2. Fast payment processing\n3. 24/7 customer support" },
  { key: "about_website_name", default: "Gain Live" },
  { key: "about_contact_email", default: "info@gainlive.com" },
  { key: "about_helpline", default: "+880 1700-000000" },
  { key: "about_address", default: "Gulshan 2, Dhaka 1212, Bangladesh" },
  { key: "about_facebook", default: "" },
  { key: "about_telegram", default: "" },
  { key: "about_quote", default: "Cricket is not just a game, it is an emotion. We bring that emotion to your fingertips through technology." },
  { key: "about_mission", default: "Provide the best user experience through modern analytics and a premium interface." },
  { key: "about_achievement", default: "More than 1 million active users and a nationwide cricket network." },
  { key: "about_years", default: "10+" },
  { key: "about_users_count", default: "500K+" },
  { key: "about_uptime", default: "99.9%" },
];

export default function AboutManagementPage() {
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') setShowPreview(false); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [showPreview]);

  const [logoUrl, setLogoUrl] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");
  const [uploading, setUploading] = useState({ logo: false, banner: false });
  const logoInputRef = useRef(null);
  const bannerInputRef = useRef(null);

  const showToast = useCallback((msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const data = await getSettings("about");
        const loaded = {};
        for (const s of data.settings || []) {
          loaded[s.key] = s.value;
        }
        if (loaded.about_logo) setLogoUrl(loaded.about_logo);
        if (loaded.about_banner) setBannerUrl(loaded.about_banner);
        const merged = {};
        for (const item of ABOUT_KEYS) {
          merged[item.key] = loaded[item.key] !== undefined ? loaded[item.key] : item.default;
        }
        setForm(merged);
      } catch {
        showToast("Failed to load about data", "error");
        const defaults = {};
        for (const item of ABOUT_KEYS) defaults[item.key] = item.default;
        setForm(defaults);
      } finally {
        setLoading(false);
      }
    })();
  }, [showToast]);

  const handleUpload = async (file, field) => {
    const type = field === "about_logo" ? "logo" : "banner";
    setUploading((prev) => ({ ...prev, [type]: true }));
    try {
      const data = await uploadFile(file, field);
      if (field === "about_logo") setLogoUrl(data.url);
      else setBannerUrl(data.url);
      showToast(`${type === "logo" ? "Logo" : "Banner"} uploaded successfully!`);
    } catch (err) {
      showToast(err.message || "Upload failed", "error");
    } finally {
      setUploading((prev) => ({ ...prev, [type]: false }));
    }
  };

  const handleFileSelect = (e, field) => {
    const file = e.target.files?.[0];
    if (!file) return;
    handleUpload(file, field);
    e.target.value = "";
  };

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const settings = ABOUT_KEYS.map((item) => ({
        key: item.key,
        value: form[item.key] !== undefined ? form[item.key] : item.default,
        category: "about",
        description: item.key.replace("about_", "").replace(/_/g, " "),
      }));
      await updateSettingsBulk(settings);
      showToast("About page saved successfully!");
    } catch {
      showToast("Failed to save changes", "error");
    } finally {
      setSaving(false);
    }
  };

  const wordCount = (form.about_content || "").trim().split(/\s+/).filter(Boolean).length;
  const charCount = (form.about_content || "").length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="font-body custom-scrollbar">
      <div className="max-w-6xl mx-auto space-y-10 pb-24">
        {/* Toast */}
        {toast && (
          <div className={`fixed top-6 right-6 z-[100] px-5 py-3 rounded-xl shadow-2xl text-sm font-semibold flex items-center gap-2 ${toast.type === "error" ? "bg-red-500/90 text-white" : "bg-green-500/90 text-white"}`}>
            <span className="material-symbols-outlined text-lg">{toast.type === "error" ? "error" : "check_circle"}</span>
            {toast.msg}
          </div>
        )}

        {/* Header */}
        <section className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div>
            <p className="text-amber-500 font-medium mb-1 tracking-wider uppercase text-xs">System Content</p>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-100 font-headline leading-tight">About Management</h1>
            <p className="text-slate-400 mt-3 text-base sm:text-lg max-w-3xl">
              Manage the public about page, brand identity, and company information from one place.
            </p>
          </div>
          <div className="flex gap-4">
            <button onClick={() => setShowPreview(true)} className="px-6 py-3 rounded-xl border border-outline-variant text-slate-300 font-medium hover:bg-white/5 transition-all">
              Preview
            </button>
            <button onClick={handleSave} disabled={saving} className="px-8 py-3 rounded-xl bg-gradient-to-br from-primary to-primary-container text-on-primary font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50">
              <span className="material-symbols-outlined text-sm">{saving ? "hourglass_top" : "save"}</span>
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </section>

        {/* Main Grid */}
        <section className="grid grid-cols-12 gap-4 sm:gap-6 lg:gap-8">
          {/* Left Column */}
          <div className="col-span-12 lg:col-span-8 space-y-6 sm:space-y-8">
            {/* About Content */}
            <article className="bg-surface-container rounded-2xl p-4 sm:p-6 lg:p-8 shadow-sm">
              <div className="flex items-center justify-between mb-6 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <span className="material-symbols-outlined">description</span>
                  </div>
                  <h2 className="text-xl font-bold text-slate-100">About Us Content</h2>
                </div>
              </div>
              <div className="relative">
                <textarea
                  className="w-full h-64 sm:h-96 bg-surface-container-low border-none rounded-xl p-4 sm:p-6 text-slate-300 leading-[1.8] focus:ring-2 focus:ring-primary/30 transition-all resize-none font-body text-base"
                  placeholder="Write your about page content here..."
                  value={form.about_content || ""}
                  onChange={(e) => handleChange("about_content", e.target.value)}
                />
                <div className="absolute bottom-4 right-4 text-xs text-slate-500 font-headline">
                  Word count: {wordCount} | Character count: {charCount}
                </div>
              </div>
            </article>

            {/* Brand Logo */}
            <article className="bg-surface-container rounded-2xl p-4 sm:p-6 lg:p-8 shadow-sm">
              <h3 className="text-lg sm:text-xl font-bold text-slate-100 mb-6 flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">image</span>
                Brand Logo and Banner
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Logo Upload */}
                <div
                  onClick={() => !uploading.logo && logoInputRef.current?.click()}
                  className="p-6 rounded-xl bg-surface-container-low border-2 border-dashed border-outline-variant hover:border-primary/50 transition-all cursor-pointer group text-center relative overflow-hidden"
                >
                  <input
                    ref={logoInputRef}
                    type="file"
                    accept="image/png,image/svg+xml"
                    className="hidden"
                    onChange={(e) => handleFileSelect(e, "about_logo")}
                  />
                  {uploading.logo ? (
                    <div className="flex flex-col items-center justify-center py-4">
                      <div className="animate-spin w-10 h-10 border-2 border-primary border-t-transparent rounded-full mb-3" />
                      <p className="text-slate-400 text-sm">Uploading...</p>
                    </div>
                  ) : logoUrl ? (
                    <div className="flex flex-col items-center">
                      <img src={logoUrl} alt="Brand Logo" className="w-24 h-24 object-contain rounded-xl mb-3 bg-surface-container-high p-2" />
                      <p className="text-slate-100 font-bold">Logo Uploaded</p>
                      <p className="text-xs text-primary mt-1">Click to replace</p>
                    </div>
                  ) : (
                    <>
                      <div className="w-20 h-20 mx-auto rounded-xl bg-surface-container-high flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined text-3xl text-slate-500 group-hover:text-primary">upload_file</span>
                      </div>
                      <p className="text-slate-100 font-bold">Upload Logo</p>
                      <p className="text-xs text-slate-500 mt-1">PNG or SVG (500x500 px)</p>
                    </>
                  )}
                </div>
                {/* Banner Upload */}
                <div
                  onClick={() => !uploading.banner && bannerInputRef.current?.click()}
                  className="p-6 rounded-xl bg-surface-container-low border-2 border-dashed border-outline-variant hover:border-primary/50 transition-all cursor-pointer group text-center relative overflow-hidden"
                >
                  <input
                    ref={bannerInputRef}
                    type="file"
                    accept="image/jpeg,image/webp"
                    className="hidden"
                    onChange={(e) => handleFileSelect(e, "about_banner")}
                  />
                  {uploading.banner ? (
                    <div className="flex flex-col items-center justify-center py-4">
                      <div className="animate-spin w-10 h-10 border-2 border-primary border-t-transparent rounded-full mb-3" />
                      <p className="text-slate-400 text-sm">Uploading...</p>
                    </div>
                  ) : bannerUrl ? (
                    <div className="flex flex-col items-center">
                      <img src={bannerUrl} alt="Banner" className="w-full h-24 object-cover rounded-xl mb-3 bg-surface-container-high" />
                      <p className="text-slate-100 font-bold">Banner Uploaded</p>
                      <p className="text-xs text-primary mt-1">Click to replace</p>
                    </div>
                  ) : (
                    <>
                      <div className="w-20 h-20 mx-auto rounded-xl bg-surface-container-high flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined text-3xl text-slate-500 group-hover:text-primary">add_photo_alternate</span>
                      </div>
                      <p className="text-slate-100 font-bold">Banner Image</p>
                      <p className="text-xs text-slate-500 mt-1">JPEG or WebP (1920x480 px)</p>
                    </>
                  )}
                </div>
              </div>
            </article>
          </div>

          {/* Right Column */}
          <aside className="col-span-12 lg:col-span-4 space-y-6 sm:space-y-8">
            {/* General Info */}
            <article className="bg-surface-container rounded-2xl p-4 sm:p-6 lg:p-8 shadow-sm">
              <h3 className="text-lg sm:text-xl font-bold text-slate-100 mb-6">General Information</h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Website Name</label>
                  <input className="w-full bg-surface-container-low border-none rounded-lg p-3 text-slate-100 focus:ring-1 focus:ring-primary" type="text" value={form.about_website_name || ""} onChange={(e) => handleChange("about_website_name", e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Contact Email</label>
                  <input className="w-full bg-surface-container-low border-none rounded-lg p-3 text-slate-100 focus:ring-1 focus:ring-primary" type="email" value={form.about_contact_email || ""} onChange={(e) => handleChange("about_contact_email", e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Helpline Number</label>
                  <input className="w-full bg-surface-container-low border-none rounded-lg p-3 text-slate-100 focus:ring-1 focus:ring-primary" type="text" value={form.about_helpline || ""} onChange={(e) => handleChange("about_helpline", e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Office Address</label>
                  <textarea className="w-full bg-surface-container-low border-none rounded-lg p-3 text-slate-100 focus:ring-1 focus:ring-primary h-24 resize-none" value={form.about_address || ""} onChange={(e) => handleChange("about_address", e.target.value)} />
                </div>
              </div>
            </article>

            {/* Social Media */}
            <article className="bg-surface-container rounded-2xl p-4 sm:p-6 lg:p-8 shadow-sm">
              <h3 className="text-lg sm:text-xl font-bold text-slate-100 mb-6">Social Media Links</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-surface-container-low">
                  <span className="material-symbols-outlined text-slate-400">public</span>
                  <input className="flex-1 bg-transparent border-none text-sm text-slate-100 focus:ring-0" placeholder="Facebook page link" type="text" value={form.about_facebook || ""} onChange={(e) => handleChange("about_facebook", e.target.value)} />
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-surface-container-low">
                  <span className="material-symbols-outlined text-slate-400">chat</span>
                  <input className="flex-1 bg-transparent border-none text-sm text-slate-100 focus:ring-0" placeholder="Telegram channel" type="text" value={form.about_telegram || ""} onChange={(e) => handleChange("about_telegram", e.target.value)} />
                </div>
              </div>
            </article>

            {/* Stats */}
            <article className="bg-surface-container rounded-2xl p-4 sm:p-6 lg:p-8 shadow-sm">
              <h3 className="text-lg sm:text-xl font-bold text-slate-100 mb-6">Statistics & Highlights</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Quote / Tagline</label>
                  <textarea className="w-full bg-surface-container-low border-none rounded-lg p-3 text-slate-100 focus:ring-1 focus:ring-primary h-20 resize-none text-sm" value={form.about_quote || ""} onChange={(e) => handleChange("about_quote", e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Our Mission</label>
                  <textarea className="w-full bg-surface-container-low border-none rounded-lg p-3 text-slate-100 focus:ring-1 focus:ring-primary h-20 resize-none text-sm" value={form.about_mission || ""} onChange={(e) => handleChange("about_mission", e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Our Achievement</label>
                  <textarea className="w-full bg-surface-container-low border-none rounded-lg p-3 text-slate-100 focus:ring-1 focus:ring-primary h-20 resize-none text-sm" value={form.about_achievement || ""} onChange={(e) => handleChange("about_achievement", e.target.value)} />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Years</label>
                    <input className="w-full bg-surface-container-low border-none rounded-lg p-2 text-slate-100 focus:ring-1 focus:ring-primary text-center text-sm" value={form.about_years || ""} onChange={(e) => handleChange("about_years", e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Users</label>
                    <input className="w-full bg-surface-container-low border-none rounded-lg p-2 text-slate-100 focus:ring-1 focus:ring-primary text-center text-sm" value={form.about_users_count || ""} onChange={(e) => handleChange("about_users_count", e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Uptime</label>
                    <input className="w-full bg-surface-container-low border-none rounded-lg p-2 text-slate-100 focus:ring-1 focus:ring-primary text-center text-sm" value={form.about_uptime || ""} onChange={(e) => handleChange("about_uptime", e.target.value)} />
                  </div>
                </div>
              </div>
            </article>
          </aside>
        </section>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
            <div className="flex items-center justify-between mb-8">
              <span className="bg-amber-500/20 text-amber-500 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest font-headline">
                Live Preview
              </span>
              <button onClick={() => setShowPreview(false)} className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all">
                <span className="material-symbols-outlined text-white">close</span>
              </button>
            </div>

            <div className="bg-surface-container rounded-[2rem] overflow-hidden relative">
              {/* Banner */}
              {bannerUrl && (
                <div className="w-full h-40 sm:h-56 overflow-hidden">
                  <img src={bannerUrl} alt="Banner" className="w-full h-full object-cover" />
                </div>
              )}

              <div className="p-6 sm:p-8 lg:p-10">
                {/* Logo + Title */}
                <div className="flex items-center gap-5 mb-8">
                  {logoUrl && (
                    <img src={logoUrl} alt="Logo" className="w-16 h-16 sm:w-20 sm:h-20 object-contain rounded-xl bg-surface-container-high p-2 shrink-0" />
                  )}
                  <div>
                    <h2 className="text-3xl sm:text-4xl font-black text-slate-100 font-headline">Learn About Us</h2>
                    <p className="text-slate-500 text-sm mt-1">{form.about_website_name}</p>
                  </div>
                </div>

                <div className="max-w-3xl">
                  <div className="prose prose-invert max-w-none">
                    {/* Quote */}
                    {form.about_quote && (
                      <p className="text-slate-300 text-lg leading-relaxed font-body italic border-l-4 border-primary pl-6 py-2 mb-10 bg-white/5 rounded-r-xl">
                        &ldquo;{form.about_quote}&rdquo;
                      </p>
                    )}

                    {/* Content */}
                    <div className="text-slate-300 leading-relaxed whitespace-pre-wrap mb-10">{form.about_content}</div>

                    {/* Mission & Achievement */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-12 mt-12">
                      {form.about_mission && (
                        <div className="p-5 rounded-xl bg-surface-container-high">
                          <h6 className="text-primary font-bold mb-3 flex items-center gap-2">
                            <span className="material-symbols-outlined text-sm">target</span>
                            Our Mission
                          </h6>
                          <p className="text-slate-400 leading-relaxed text-sm">{form.about_mission}</p>
                        </div>
                      )}
                      {form.about_achievement && (
                        <div className="p-5 rounded-xl bg-surface-container-high">
                          <h6 className="text-primary font-bold mb-3 flex items-center gap-2">
                            <span className="material-symbols-outlined text-sm">stars</span>
                            Our Achievement
                          </h6>
                          <p className="text-slate-400 leading-relaxed text-sm">{form.about_achievement}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="mt-16 flex flex-wrap items-center gap-8 sm:gap-12">
                    <div className="flex flex-col">
                      <span className="text-3xl font-black text-slate-100 font-headline">{form.about_years}</span>
                      <span className="text-xs text-slate-500 uppercase font-headline tracking-tighter">Years Experience</span>
                    </div>
                    <div className="w-px h-10 bg-slate-800 hidden sm:block" />
                    <div className="flex flex-col">
                      <span className="text-3xl font-black text-slate-100 font-headline">{form.about_users_count}</span>
                      <span className="text-xs text-slate-500 uppercase font-headline tracking-tighter">Active Users</span>
                    </div>
                    <div className="w-px h-10 bg-slate-800 hidden sm:block" />
                    <div className="flex flex-col">
                      <span className="text-3xl font-black text-slate-100 font-headline">{form.about_uptime}</span>
                      <span className="text-xs text-slate-500 uppercase font-headline tracking-tighter">Uptime</span>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="mt-12 p-6 bg-surface-container-high rounded-xl space-y-3">
                    <h6 className="text-primary font-bold text-sm">Contact Info</h6>
                    <p className="text-slate-400 text-sm">{form.about_website_name} | {form.about_contact_email}</p>
                    <p className="text-slate-400 text-sm">{form.about_helpline}</p>
                    <p className="text-slate-400 text-sm">{form.about_address}</p>
                  </div>

                  {/* Social Media Links */}
                  {(form.about_facebook || form.about_telegram) && (
                    <div className="mt-8 flex flex-wrap items-center gap-4">
                      {form.about_facebook && (
                        <a href={form.about_facebook} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600/10 text-blue-400 hover:bg-blue-600/20 transition-all text-sm font-medium">
                          <span className="material-symbols-outlined text-lg">public</span>
                          Facebook
                        </a>
                      )}
                      {form.about_telegram && (
                        <a href={form.about_telegram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-500/10 text-sky-400 hover:bg-sky-500/20 transition-all text-sm font-medium">
                          <span className="material-symbols-outlined text-lg">chat</span>
                          Telegram
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
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