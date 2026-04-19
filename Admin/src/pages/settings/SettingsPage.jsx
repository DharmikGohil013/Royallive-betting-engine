import { useState, useEffect } from "react";
import { getSettings, updateSetting } from "../../services/api";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    platformName: "",
    defaultLanguage: "",
    siteDescription: "",
    emailNotifications: false,
    systemNotifications: false,
    smsAlerts: false,
  });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await getSettings();
        const all = res.settings || [];
        const map = {};
        all.forEach(s => { map[s.key] = s.value; });
        setSettings({
          platformName: map.platformName ?? "",
          defaultLanguage: map.defaultLanguage ?? "",
          siteDescription: map.siteDescription ?? "",
          emailNotifications: map.emailNotifications ?? false,
          systemNotifications: map.systemNotifications ?? false,
          smsAlerts: map.smsAlerts ?? false,
        });
      } catch (err) { console.error(err); }
      setLoading(false);
    })();
  }, []);

  const handleSave = async () => {
    if (!settings.platformName?.trim()) return alert("Platform name is required");
    setSaving(true);
    try {
      await Promise.all([
        updateSetting("platformName", settings.platformName, "site", "Platform display name"),
        updateSetting("defaultLanguage", settings.defaultLanguage, "site", "Default language"),
        updateSetting("siteDescription", settings.siteDescription, "site", "Site description"),
        updateSetting("emailNotifications", settings.emailNotifications, "notifications", "Email notifications toggle"),
        updateSetting("systemNotifications", settings.systemNotifications, "notifications", "System notifications toggle"),
        updateSetting("smsAlerts", settings.smsAlerts, "notifications", "SMS alerts toggle"),
      ]);
      alert("Settings saved successfully!");
    } catch (err) { alert(err.message || "Failed to save"); }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="font-body flex items-center justify-center min-h-[60vh]">
        <div className="text-slate-400 flex items-center gap-3">
          <span className="material-symbols-outlined animate-spin">progress_activity</span>
          Loading settings...
        </div>
      </div>
    );
  }

  return (
    <div className="font-body">
      <div className="max-w-6xl mx-auto pb-16">
        <section className="mb-12 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-white font-headline tracking-tight mb-2">
              Settings
            </h1>
            <p className="text-slate-400 text-sm sm:text-base">
              Manage your account and platform configuration.
            </p>
          </div>

          <button onClick={handleSave} disabled={saving} className="bg-gradient-to-br from-primary to-primary-container text-on-primary font-bold px-8 py-3 rounded-xl shadow-lg shadow-primary/10 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 w-fit disabled:opacity-50">
            <span className="material-symbols-outlined text-xl">save</span>
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </section>

        <section className="grid grid-cols-12 gap-4 sm:gap-6 lg:gap-8">
          <div className="col-span-12 lg:col-span-4 space-y-8">
            <article className="bg-surface-container rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-primary/10 transition-colors" />

              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="relative mb-4 sm:mb-6">
                  <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-surface-container-high shadow-xl overflow-hidden bg-surface-container-high flex items-center justify-center">
                    <span className="material-symbols-outlined text-5xl sm:text-6xl text-slate-500">person</span>
                  </div>
                </div>

                <h2 className="text-lg sm:text-xl font-bold text-white mb-1">Admin Profile</h2>
                <p className="text-primary text-sm mb-6">Super Administrator</p>

                <div className="w-full space-y-3">
                  <div className="bg-surface-dim rounded-xl p-4 flex items-center gap-4">
                    <span className="material-symbols-outlined text-slate-500">mail</span>
                    <span className="text-sm text-slate-300">admin@gainlive.com</span>
                  </div>
                </div>
              </div>
            </article>
          </div>

          <div className="col-span-12 lg:col-span-8 space-y-8">
            <section className="bg-surface-container rounded-3xl p-6 sm:p-8">
              <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary">language</span>
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-white">Site Settings</h3>
                  <p className="text-sm text-slate-400">Global platform configuration</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300 ml-1">Platform Name</label>
                  <input
                    className="w-full bg-surface-dim border-none rounded-xl py-3 px-4 text-slate-100 focus:ring-1 focus:ring-primary/50 transition-all font-body"
                    type="text"
                    placeholder="Enter platform name"
                    value={settings.platformName}
                    onChange={e => setSettings({...settings, platformName: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300 ml-1">Default Language</label>
                  <select className="w-full bg-surface-dim border-none rounded-xl py-3 px-4 text-slate-100 focus:ring-1 focus:ring-primary/50 transition-all font-body" value={settings.defaultLanguage} onChange={e => setSettings({...settings, defaultLanguage: e.target.value})}>
                    <option value="">Select Language</option>
                    <option value="Bangla">Bangla</option>
                    <option value="English">English</option>
                    <option value="Hindi">Hindi</option>
                  </select>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-slate-300 ml-1">Site Description</label>
                  <textarea
                    className="w-full bg-surface-dim border-none rounded-xl py-3 px-4 text-slate-100 focus:ring-1 focus:ring-primary/50 transition-all font-body"
                    rows="3"
                    placeholder="Enter site description"
                    value={settings.siteDescription}
                    onChange={e => setSettings({...settings, siteDescription: e.target.value})}
                  />
                </div>
              </div>
            </section>

            <section className="bg-surface-container rounded-3xl p-6 sm:p-8">
              <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-secondary/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-secondary">lock</span>
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-white">Security</h3>
                  <p className="text-sm text-slate-400">Password and two-factor authentication</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-surface-dim rounded-2xl hover:bg-surface-container-high transition-colors cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <span className="material-symbols-outlined text-slate-500 group-hover:text-primary transition-colors">
                      key
                    </span>
                    <div>
                      <p className="font-bold text-slate-100">Change Password</p>
                      <p className="text-xs text-slate-500">Update your admin password</p>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-slate-600">chevron_right</span>
                </div>

                <div className="flex items-center justify-between p-4 bg-surface-dim rounded-2xl group">
                  <div className="flex items-center gap-4">
                    <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>
                      vibration
                    </span>
                    <div>
                      <p className="font-bold text-slate-100">Two-Factor Authentication (2FA)</p>
                      <p className="text-xs text-secondary">Active</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input checked readOnly className="sr-only peer" type="checkbox" />
                    <div className="w-11 h-6 bg-surface-container-high peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary" />
                  </label>
                </div>
              </div>
            </section>

            <section className="bg-surface-container rounded-3xl p-6 sm:p-8">
              <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-amber-500">notifications_active</span>
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-white">Notification Settings</h3>
                  <p className="text-sm text-slate-400">Set your alert and message preferences</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-outline-variant/10 gap-4">
                  <div>
                    <p className="text-slate-200 font-medium">Email Notifications</p>
                    <p className="text-xs text-slate-500">Daily reports and security alerts</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input checked={settings.emailNotifications} onChange={() => setSettings({...settings, emailNotifications: !settings.emailNotifications})} className="sr-only peer" type="checkbox" />
                    <div className="w-10 h-5 bg-surface-container-high peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-5 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary" />
                  </label>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-outline-variant/10 gap-4">
                  <div>
                    <p className="text-slate-200 font-medium">System Notifications</p>
                    <p className="text-xs text-slate-500">Real-time operational updates</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input checked={settings.systemNotifications} onChange={() => setSettings({...settings, systemNotifications: !settings.systemNotifications})} className="sr-only peer" type="checkbox" />
                    <div className="w-10 h-5 bg-surface-container-high peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-5 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary" />
                  </label>
                </div>

                <div className="flex items-center justify-between py-3 gap-4">
                  <div>
                    <p className="text-slate-200 font-medium">SMS Alerts</p>
                    <p className="text-xs text-slate-500">Only urgent payment and withdrawal updates</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input checked={settings.smsAlerts} onChange={() => setSettings({...settings, smsAlerts: !settings.smsAlerts})} className="sr-only peer" type="checkbox" />
                    <div className="w-10 h-5 bg-surface-container-high peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-5 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary" />
                  </label>
                </div>
              </div>
            </section>
          </div>
        </section>
      </div>
    </div>
  );
}
