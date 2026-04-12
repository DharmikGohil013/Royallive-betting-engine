import { useState, useEffect, useCallback } from "react";
import { getSettings, updateSettingsBulk } from "../../services/api";

const TABS = [
  { key: "policy_privacy", label: "à¦—à§‹à¦ªà¦¨à§€à¦¯à¦¼à¦¤à¦¾ à¦¨à§€à¦¤à¦¿", labelEn: "Privacy Policy" },
  { key: "policy_terms", label: "à¦¬à§à¦¯à¦¬à¦¹à¦¾à¦°à§‡à¦° à¦¶à¦°à§à¦¤à¦¾à¦¬à¦²à§€", labelEn: "Terms of Use" },
  { key: "policy_responsible_gaming", label: "à¦¦à¦¾à¦¯à¦¼à¦¿à¦¤à§à¦¬à¦¶à§€à¦² à¦—à§‡à¦®à¦¿à¦‚", labelEn: "Responsible Gaming" },
  { key: "policy_refund", label: "à¦°à¦¿à¦«à¦¾à¦¨à§à¦¡ à¦¨à§€à¦¤à¦¿", labelEn: "Refund Policy" },
];

const DEFAULT_CONTENT = {
  policy_privacy: `à¦†à¦®à¦¾à¦¦à§‡à¦° à¦ªà§à¦²à§à¦¯à¦¾à¦Ÿà¦«à¦°à§à¦® à¦¬à§à¦¯à¦¬à¦¹à¦¾à¦° à¦•à¦°à¦¾à¦° à¦œà¦¨à§à¦¯ à¦†à¦ªà¦¨à¦¾à¦•à§‡ à¦§à¦¨à§à¦¯à¦¬à¦¾à¦¦à¥¤ à¦†à¦ªà¦¨à¦¾à¦° à¦¬à§à¦¯à¦•à§à¦¤à¦¿à¦—à¦¤ à¦¤à¦¥à§à¦¯à§‡à¦° à¦¸à§à¦°à¦•à§à¦·à¦¾ à¦¨à¦¿à¦¶à§à¦šà¦¿à¦¤ à¦•à¦°à¦¾ à¦†à¦®à¦¾à¦¦à§‡à¦° à¦…à¦¨à§à¦¯à¦¤à¦® à¦ªà§à¦°à¦§à¦¾à¦¨ à¦²à¦•à§à¦·à§à¦¯à¥¤\n\nà§§. à¦¤à¦¥à§à¦¯ à¦¸à¦‚à¦—à§à¦°à¦¹\nà¦†à¦®à¦°à¦¾ à¦†à¦ªà¦¨à¦¾à¦° à¦¨à¦¾à¦®, à¦‡à¦®à§‡à¦² à¦ à¦¿à¦•à¦¾à¦¨à¦¾, à¦«à§‹à¦¨ à¦¨à¦®à§à¦¬à¦° à¦à¦¬à¦‚ à¦ªà§‡à¦®à§‡à¦¨à§à¦Ÿ à¦¸à¦‚à¦•à§à¦°à¦¾à¦¨à§à¦¤ à¦¤à¦¥à§à¦¯ à¦¸à¦‚à¦—à§à¦°à¦¹ à¦•à¦°à¦¤à§‡ à¦ªà¦¾à¦°à¦¿à¥¤\n\nà§¨. à¦¤à¦¥à§à¦¯à§‡à¦° à¦¬à§à¦¯à¦¬à¦¹à¦¾à¦°\n- à¦ªà¦°à¦¿à¦·à§‡à¦¬à¦¾ à¦ªà§à¦°à¦¦à¦¾à¦¨ à¦à¦¬à¦‚ à¦…à§à¦¯à¦¾à¦•à¦¾à¦‰à¦¨à§à¦Ÿà§‡à¦° à¦¨à¦¿à¦°à¦¾à¦ªà¦¤à§à¦¤à¦¾ à¦¨à¦¿à¦¶à§à¦šà¦¿à¦¤ à¦•à¦°à¦¾à¥¤\n- à¦¨à¦¤à§à¦¨ à¦®à§à¦¯à¦¾à¦š à¦à¦¬à¦‚ à¦…à¦«à¦¾à¦° à¦¸à¦®à§à¦ªà¦°à§à¦•à§‡ à¦†à¦ªà¦¨à¦¾à¦•à§‡ à¦…à¦¬à¦¹à¦¿à¦¤ à¦•à¦°à¦¾à¥¤\n- à¦²à§‡à¦¨à¦¦à§‡à¦¨ à¦¸à¦‚à¦•à§à¦°à¦¾à¦¨à§à¦¤ à¦­à§‡à¦°à¦¿à¦«à¦¿à¦•à§‡à¦¶à¦¨ à¦à¦¬à¦‚ à¦¸à¦¾à¦ªà§‹à¦°à§à¦Ÿ à¦ªà§à¦°à¦¦à¦¾à¦¨à¥¤\n\nà§©. à¦•à§à¦•à¦¿à¦œ à¦ªà¦²à¦¿à¦¸à¦¿\nà¦†à¦®à¦°à¦¾ à¦†à¦ªà¦¨à¦¾à¦° à¦¬à§à¦°à¦¾à¦‰à¦œà¦¿à¦‚ à¦…à¦­à¦¿à¦œà§à¦žà¦¤à¦¾ à¦‰à¦¨à§à¦¨à¦¤ à¦•à¦°à¦¤à§‡ à¦•à§à¦•à¦¿à¦œ à¦¬à§à¦¯à¦¬à¦¹à¦¾à¦° à¦•à¦°à¦¿à¥¤`,
  policy_terms: `à¦à¦‡ à¦“à¦¯à¦¼à§‡à¦¬à¦¸à¦¾à¦‡à¦Ÿ à¦¬à§à¦¯à¦¬à¦¹à¦¾à¦° à¦•à¦°à§‡ à¦†à¦ªà¦¨à¦¿ à¦¨à¦¿à¦®à§à¦¨à¦²à¦¿à¦–à¦¿à¦¤ à¦¶à¦°à§à¦¤à¦¾à¦¬à¦²à§€à¦¤à§‡ à¦¸à¦®à§à¦®à¦¤ à¦¹à¦šà§à¦›à§‡à¦¨à¥¤\n\nà§§. à¦¬à§à¦¯à¦¬à¦¹à¦¾à¦°à¦•à¦¾à¦°à§€à¦° à¦¯à§‹à¦—à§à¦¯à¦¤à¦¾\nà¦†à¦ªà¦¨à¦¾à¦•à§‡ à¦•à¦®à¦ªà¦•à§à¦·à§‡ à§§à§® à¦¬à¦›à¦° à¦¬à¦¯à¦¼à¦¸à§€ à¦¹à¦¤à§‡ à¦¹à¦¬à§‡à¥¤\n\nà§¨. à¦…à§à¦¯à¦¾à¦•à¦¾à¦‰à¦¨à§à¦Ÿ à¦¦à¦¾à¦¯à¦¼à¦¿à¦¤à§à¦¬\nà¦†à¦ªà¦¨à¦¾à¦° à¦…à§à¦¯à¦¾à¦•à¦¾à¦‰à¦¨à§à¦Ÿà§‡à¦° à¦¨à¦¿à¦°à¦¾à¦ªà¦¤à§à¦¤à¦¾ à¦†à¦ªà¦¨à¦¾à¦° à¦¦à¦¾à¦¯à¦¼à¦¿à¦¤à§à¦¬à¥¤\n\nà§©. à¦ªà¦°à¦¿à¦·à§‡à¦¬à¦¾à¦° à¦ªà¦°à¦¿à¦¬à¦°à§à¦¤à¦¨\nà¦†à¦®à¦°à¦¾ à¦¯à§‡à¦•à§‹à¦¨à§‹ à¦¸à¦®à¦¯à¦¼ à¦ªà¦°à¦¿à¦·à§‡à¦¬à¦¾ à¦ªà¦°à¦¿à¦¬à¦°à§à¦¤à¦¨ à¦¬à¦¾ à¦¬à¦¨à§à¦§ à¦•à¦°à¦¾à¦° à¦…à¦§à¦¿à¦•à¦¾à¦° à¦°à¦¾à¦–à¦¿à¥¤`,
  policy_responsible_gaming: `à¦†à¦®à¦°à¦¾ à¦¦à¦¾à¦¯à¦¼à¦¿à¦¤à§à¦¬à¦¶à§€à¦² à¦—à§‡à¦®à¦¿à¦‚-à¦ à¦¬à¦¿à¦¶à§à¦¬à¦¾à¦¸ à¦•à¦°à¦¿à¥¤\n\nà§§. à¦¸à§€à¦®à¦¾ à¦¨à¦¿à¦°à§à¦§à¦¾à¦°à¦£\nà¦†à¦ªà¦¨à¦¿ à¦†à¦ªà¦¨à¦¾à¦° à¦¦à§ˆà¦¨à¦¿à¦•, à¦¸à¦¾à¦ªà§à¦¤à¦¾à¦¹à¦¿à¦• à¦¬à¦¾ à¦®à¦¾à¦¸à¦¿à¦• à¦œà¦®à¦¾ à¦¸à§€à¦®à¦¾ à¦¨à¦¿à¦°à§à¦§à¦¾à¦°à¦£ à¦•à¦°à¦¤à§‡ à¦ªà¦¾à¦°à§‡à¦¨à¥¤\n\nà§¨. à¦¸à§à¦¬-à¦¬à¦°à§à¦œà¦¨\nà¦†à¦ªà¦¨à¦¿ à¦šà¦¾à¦‡à¦²à§‡ à¦¨à¦¿à¦°à§à¦¦à¦¿à¦·à§à¦Ÿ à¦¸à¦®à¦¯à¦¼à§‡à¦° à¦œà¦¨à§à¦¯ à¦†à¦ªà¦¨à¦¾à¦° à¦…à§à¦¯à¦¾à¦•à¦¾à¦‰à¦¨à§à¦Ÿ à¦¬à¦¨à§à¦§ à¦•à¦°à¦¤à§‡ à¦ªà¦¾à¦°à§‡à¦¨à¥¤\n\nà§©. à¦¸à¦¹à¦¾à¦¯à¦¼à¦¤à¦¾\nà¦—à§‡à¦®à¦¿à¦‚ à¦¸à¦®à¦¸à§à¦¯à¦¾à¦¯à¦¼ à¦ªà¦¡à¦¼à¦²à§‡ à¦†à¦®à¦¾à¦¦à§‡à¦° à¦¸à¦¾à¦ªà§‹à¦°à§à¦Ÿ à¦Ÿà¦¿à¦®à§‡ à¦¯à§‹à¦—à¦¾à¦¯à§‹à¦— à¦•à¦°à§à¦¨à¥¤`,
  policy_refund: `à¦°à¦¿à¦«à¦¾à¦¨à§à¦¡ à¦¸à¦‚à¦•à§à¦°à¦¾à¦¨à§à¦¤ à¦¨à§€à¦¤à¦¿à¦®à¦¾à¦²à¦¾:\n\nà§§. à¦°à¦¿à¦«à¦¾à¦¨à§à¦¡à§‡à¦° à¦¯à§‹à¦—à§à¦¯à¦¤à¦¾\nà¦­à§à¦² à¦²à§‡à¦¨à¦¦à§‡à¦¨ à¦¬à¦¾ à¦¸à¦¿à¦¸à§à¦Ÿà§‡à¦® à¦¤à§à¦°à§à¦Ÿà¦¿à¦° à¦•à§à¦·à§‡à¦¤à§à¦°à§‡ à¦°à¦¿à¦«à¦¾à¦¨à§à¦¡ à¦ªà§à¦°à¦¯à§‹à¦œà§à¦¯à¥¤\n\nà§¨. à¦°à¦¿à¦«à¦¾à¦¨à§à¦¡ à¦ªà§à¦°à¦•à§à¦°à¦¿à¦¯à¦¼à¦¾\nà¦°à¦¿à¦«à¦¾à¦¨à§à¦¡ à¦…à¦¨à§à¦°à§‹à¦§ à¦œà¦®à¦¾ à¦¦à§‡à¦“à¦¯à¦¼à¦¾à¦° à§©-à§« à¦•à¦¾à¦°à§à¦¯à¦¦à¦¿à¦¬à¦¸à§‡à¦° à¦®à¦§à§à¦¯à§‡ à¦ªà§à¦°à¦•à§à¦°à¦¿à¦¯à¦¼à¦¾ à¦•à¦°à¦¾ à¦¹à¦¬à§‡à¥¤\n\nà§©. à¦…-à¦«à§‡à¦°à¦¤à¦¯à§‹à¦—à§à¦¯\nà¦¸à¦®à§à¦ªà¦¨à§à¦¨ à¦¬à§‡à¦Ÿ à¦à¦¬à¦‚ à¦¬à§à¦¯à¦¬à¦¹à§ƒà¦¤ à¦¬à§‹à¦¨à¦¾à¦¸ à¦«à§‡à¦°à¦¤à¦¯à§‹à¦—à§à¦¯ à¦¨à¦¯à¦¼à¥¤`,
};

export default function PolicyPage() {
  const [activeTab, setActiveTab] = useState(TABS[0].key);
  const [contents, setContents] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [toast, setToast] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const showToast = useCallback((msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const data = await getSettings("policy");
        const loaded = {};
        let latest = null;
        for (const s of data.settings || []) {
          loaded[s.key] = s.value || "";
          if (s.updatedAt && (!latest || new Date(s.updatedAt) > new Date(latest))) {
            latest = s.updatedAt;
          }
        }
        for (const tab of TABS) {
          if (!loaded[tab.key]) loaded[tab.key] = DEFAULT_CONTENT[tab.key] || "";
        }
        setContents(loaded);
        if (latest) setLastUpdated(new Date(latest).toLocaleString("bn-BD"));
      } catch {
        showToast("Failed to load policies", "error");
        const defaults = {};
        for (const tab of TABS) defaults[tab.key] = DEFAULT_CONTENT[tab.key] || "";
        setContents(defaults);
      } finally {
        setLoading(false);
      }
    })();
  }, [showToast]);

  const handlePublish = async () => {
    setSaving(true);
    try {
      const settings = TABS.map((tab) => ({
        key: tab.key,
        value: contents[tab.key] || "",
        category: "policy",
        description: tab.labelEn,
      }));
      await updateSettingsBulk(settings);
      setLastUpdated(new Date().toLocaleString("bn-BD"));
      showToast("All policies published successfully!");
    } catch {
      showToast("Failed to publish policies", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleContentChange = (value) => {
    setContents((prev) => ({ ...prev, [activeTab]: value }));
  };

  const activeTabData = TABS.find((t) => t.key === activeTab);
  const wordCount = (contents[activeTab] || "").trim().split(/\s+/).filter(Boolean).length;
  const charCount = (contents[activeTab] || "").length;

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
              Policy Management
            </h1>
            <p className="text-slate-400 mt-2 text-sm sm:text-base">
              Manage public policies, terms of use, and responsible gaming content.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowPreview(true)}
              className="px-4 py-2 rounded-lg border border-outline-variant text-slate-300 font-medium text-xs hover:bg-white/5 transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-lg">visibility</span>
              Preview
            </button>
            <button
              onClick={handlePublish}
              disabled={saving}
              className="bg-gradient-to-br from-primary to-primary-container text-on-primary px-5 py-2 rounded-lg font-bold text-xs flex items-center gap-2 hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-lg">{saving ? "hourglass_top" : "publish"}</span>
              {saving ? "Publishing..." : "à¦ªà§à¦°à¦•à¦¾à¦¶ à¦•à¦°à§à¦¨"}
            </button>
          </div>
        </section>

        {/* Tabs */}
        <section className="flex items-center gap-2 bg-surface-container-low p-1 rounded-xl mb-10 overflow-x-auto max-w-full">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 sm:px-6 py-2.5 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${
                activeTab === tab.key
                  ? "bg-surface-container-highest text-primary shadow-lg"
                  : "text-slate-400 hover:text-slate-100 hover:bg-white/5"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </section>

        {/* Editor + Sidebar */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8">
          {/* Editor */}
          <div className="lg:col-span-8 space-y-6">
            <article className="bg-surface-container rounded-xl overflow-hidden">
              <div className="bg-surface-container-high px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-white/5">
                <div className="flex items-center gap-4">
                  <span className="material-symbols-outlined text-slate-400 hover:text-primary cursor-pointer">format_bold</span>
                  <span className="material-symbols-outlined text-slate-400 hover:text-primary cursor-pointer">format_italic</span>
                  <span className="material-symbols-outlined text-slate-400 hover:text-primary cursor-pointer">format_underlined</span>
                  <div className="w-[1px] h-4 bg-white/10 mx-1" />
                  <span className="material-symbols-outlined text-slate-400 hover:text-primary cursor-pointer">format_list_bulleted</span>
                  <span className="material-symbols-outlined text-slate-400 hover:text-primary cursor-pointer">format_list_numbered</span>
                  <div className="w-[1px] h-4 bg-white/10 mx-1" />
                  <span className="material-symbols-outlined text-slate-400 hover:text-primary cursor-pointer">link</span>
                </div>
                <span className="text-[10px] text-slate-500 font-mono">
                  {lastUpdated ? `Last updated: ${lastUpdated}` : "Not published yet"}
                </span>
              </div>

              <div className="p-4 sm:p-6 lg:p-8 bg-[#1c2026]">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-100 mb-4 leading-tight">
                  {activeTabData?.label} ({activeTabData?.labelEn})
                </h2>
                <textarea
                  className="w-full min-h-[350px] sm:min-h-[450px] bg-transparent border-none text-slate-300 leading-[1.9] focus:ring-0 focus:outline-none resize-none font-body text-base"
                  value={contents[activeTab] || ""}
                  onChange={(e) => handleContentChange(e.target.value)}
                  placeholder="Write policy content here..."
                />
                <div className="text-right text-xs text-slate-500 mt-2 font-mono">
                  Words: {wordCount} | Characters: {charCount}
                </div>
              </div>
            </article>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <article className="bg-surface-container rounded-xl p-6">
              <h3 className="text-sm font-bold text-slate-100 mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>info</span>
                Status & Metadata
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-white/5">
                  <span className="text-xs text-slate-500">Status</span>
                  <span className="text-xs font-bold text-secondary bg-secondary/10 px-2 py-1 rounded">
                    {lastUpdated ? "Published" : "Draft"}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-white/5">
                  <span className="text-xs text-slate-500">Active Section</span>
                  <span className="text-xs text-slate-300">{activeTabData?.labelEn}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-white/5">
                  <span className="text-xs text-slate-500">Language</span>
                  <span className="text-xs text-slate-300">Bengali</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-xs text-slate-500">Total Sections</span>
                  <span className="text-xs text-slate-300">{TABS.length}</span>
                </div>
              </div>
            </article>

            <article className="bg-surface-container rounded-xl p-6">
              <h3 className="text-sm font-bold text-slate-100 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => setShowPreview(true)}
                  className="w-full bg-surface-container-high hover:bg-white/5 text-slate-200 py-3 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-lg">visibility</span>
                  Preview All
                </button>
                <button
                  onClick={handlePublish}
                  disabled={saving}
                  className="w-full bg-primary/10 hover:bg-primary/20 text-primary py-3 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-lg">publish</span>
                  {saving ? "Publishing..." : "Publish All"}
                </button>
              </div>
            </article>

            <article className="bg-surface-container rounded-xl p-6">
              <h3 className="text-sm font-bold text-slate-100 mb-4">Section Overview</h3>
              <div className="space-y-3">
                {TABS.map((tab) => {
                  const filled = (contents[tab.key] || "").trim().length > 0;
                  return (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all text-left ${activeTab === tab.key ? "bg-primary/10 border border-primary/20" : "hover:bg-white/5"}`}
                    >
                      <span className={`material-symbols-outlined text-base ${filled ? "text-green-400" : "text-slate-500"}`}>
                        {filled ? "check_circle" : "radio_button_unchecked"}
                      </span>
                      <div>
                        <p className="text-xs font-semibold text-slate-200">{tab.label}</p>
                        <p className="text-[10px] text-slate-500">{tab.labelEn}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </article>
          </div>
        </section>
      </div>

      {/* Full-Screen Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
            <div className="flex items-center justify-between mb-8">
              <span className="bg-amber-500/20 text-amber-500 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                Live Preview
              </span>
              <button
                onClick={() => setShowPreview(false)}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all"
              >
                <span className="material-symbols-outlined text-white">close</span>
              </button>
            </div>

            <div className="space-y-12">
              {TABS.map((tab) => (
                <section key={tab.key} className="bg-surface-container rounded-2xl p-6 sm:p-8 lg:p-10">
                  <h2 className="text-2xl sm:text-3xl font-bold text-slate-100 mb-2 font-headline">
                    {tab.label}
                  </h2>
                  <p className="text-sm text-primary mb-6">{tab.labelEn}</p>
                  <div className="text-slate-300 leading-[1.9] text-base whitespace-pre-wrap">
                    {contents[tab.key] || <span className="text-slate-500 italic">No content yet</span>}
                  </div>
                </section>
              ))}
            </div>

            <div className="mt-8 text-center">
              <button
                onClick={() => setShowPreview(false)}
                className="px-8 py-3 rounded-xl bg-surface-container text-slate-300 hover:bg-white/10 transition-all font-medium"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
