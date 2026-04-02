export default function SettingsPage() {
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

          <button className="bg-gradient-to-br from-primary to-primary-container text-on-primary font-bold px-8 py-3 rounded-xl shadow-lg shadow-primary/10 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 w-fit">
            <span className="material-symbols-outlined text-xl">save</span>
            Save Changes
          </button>
        </section>

        <section className="grid grid-cols-12 gap-8">
          <div className="col-span-12 lg:col-span-4 space-y-8">
            <article className="bg-surface-container rounded-3xl p-8 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-primary/10 transition-colors" />

              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="relative mb-6">
                  <div className="w-32 h-32 rounded-full border-4 border-surface-container-high shadow-xl object-cover overflow-hidden bg-surface-container-high flex items-center justify-center">
                    <img
                      alt="Admin profile"
                      className="w-full h-full object-cover"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuA_uxqypCCp7nxTtON5Et4x0nPJ8NP2gVHceYPfk9GF-PTN5LYC38gcMUgadQRgfGvrrdwq54HYthmb7uS6IFDQ4IHTRDFk8k9W1Qz5462LgzGeUaoaFDgBnxayaubjGW3QRlqiw_mhiVlZhI0Pio3okyev0JiU9wVybDjocUK6unNURKrx-nivUo_0wrTmL7QneVMvGrtWGIsurSYjlPsWQ6k49zXFFBKU7AKFHhe1RviDiEq4d_A8uCnMPISZ9IO_-7GQLCRcIA"
                    />
                  </div>
                  <button className="absolute bottom-0 right-0 bg-primary text-on-primary p-2 rounded-full shadow-lg border-4 border-surface-container">
                    <span className="material-symbols-outlined text-sm">photo_camera</span>
                  </button>
                </div>

                <h2 className="text-xl font-bold text-white mb-1">Admin Profile</h2>
                <p className="text-primary text-sm mb-6">Super Administrator</p>

                <div className="w-full space-y-3">
                  <div className="bg-surface-dim rounded-xl p-4 flex items-center gap-4">
                    <span className="material-symbols-outlined text-slate-500">mail</span>
                    <span className="text-sm text-slate-300">admin@cricket.ops</span>
                  </div>
                  <div className="bg-surface-dim rounded-xl p-4 flex items-center gap-4">
                    <span className="material-symbols-outlined text-slate-500">verified_user</span>
                    <span className="text-sm text-slate-300">Access Level: 10</span>
                  </div>
                </div>
              </div>
            </article>

            <article className="bg-surface-container-low border border-outline-variant/10 rounded-3xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-white">Security Status</h3>
                <span className="flex h-3 w-3 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-secondary" />
                </span>
              </div>
              <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                Your account is protected with two-factor authentication.
              </p>
              <div className="h-1 w-full bg-surface-container-highest rounded-full overflow-hidden">
                <div className="h-full bg-secondary w-[92%]" />
              </div>
              <p className="text-[10px] text-right mt-2 text-secondary">92% Secure</p>
            </article>
          </div>

          <div className="col-span-12 lg:col-span-8 space-y-8">
            <section className="bg-surface-container rounded-3xl p-8">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary">language</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Site Settings</h3>
                  <p className="text-sm text-slate-400">Global platform configuration</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300 ml-1">Platform Name</label>
                  <input
                    className="w-full bg-surface-dim border-none rounded-xl py-3 px-4 text-slate-100 focus:ring-1 focus:ring-primary/50 transition-all font-body"
                    type="text"
                    defaultValue="Gain Live Operations Dashboard"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300 ml-1">Default Language</label>
                  <select className="w-full bg-surface-dim border-none rounded-xl py-3 px-4 text-slate-100 focus:ring-1 focus:ring-primary/50 transition-all font-body">
                    <option>Bangla</option>
                    <option>English</option>
                    <option>Hindi</option>
                  </select>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-slate-300 ml-1">Site Description</label>
                  <textarea
                    className="w-full bg-surface-dim border-none rounded-xl py-3 px-4 text-slate-100 focus:ring-1 focus:ring-primary/50 transition-all font-body"
                    rows="3"
                    defaultValue="The number one gaming management and operational dashboard in Bangladesh."
                  />
                </div>
              </div>
            </section>

            <section className="bg-surface-container rounded-3xl p-8">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-secondary">lock</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Security</h3>
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
                      <p className="text-xs text-slate-500">Last changed: 3 months ago</p>
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

            <section className="bg-surface-container rounded-3xl p-8">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-amber-500">notifications_active</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Notification Settings</h3>
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
                    <input checked readOnly className="sr-only peer" type="checkbox" />
                    <div className="w-10 h-5 bg-surface-container-high peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-5 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary" />
                  </label>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-outline-variant/10 gap-4">
                  <div>
                    <p className="text-slate-200 font-medium">System Notifications</p>
                    <p className="text-xs text-slate-500">Real-time operational updates</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input checked readOnly className="sr-only peer" type="checkbox" />
                    <div className="w-10 h-5 bg-surface-container-high peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-5 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary" />
                  </label>
                </div>

                <div className="flex items-center justify-between py-3 gap-4">
                  <div>
                    <p className="text-slate-200 font-medium">SMS Alerts</p>
                    <p className="text-xs text-slate-500">Only urgent payment and withdrawal updates</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input className="sr-only peer" type="checkbox" />
                    <div className="w-10 h-5 bg-surface-container-high peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-5 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary" />
                  </label>
                </div>
              </div>
            </section>

            <section className="bg-error/5 border border-error/20 rounded-3xl p-8 mt-12">
              <h4 className="text-error font-bold mb-2 flex items-center gap-2">
                <span className="material-symbols-outlined">report</span>
                Danger Zone
              </h4>
              <p className="text-xs text-slate-400 mb-6">
                Deleting your account will permanently remove all your data. This action cannot be undone.
              </p>
              <button className="text-error border border-error/30 px-6 py-2.5 rounded-xl hover:bg-error hover:text-on-error transition-all font-bold text-sm">
                Deactivate Account
              </button>
            </section>
          </div>
        </section>

        <section className="mt-12 glass-panel border border-white/5 rounded-[2rem] p-8 sm:p-10 overflow-hidden relative">
          <div className="absolute top-0 right-0 p-8">
            <span className="bg-amber-500/20 text-amber-500 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest font-headline">
              Live Preview
            </span>
          </div>

          <div className="max-w-3xl">
            <h2 className="text-4xl font-black text-slate-100 font-headline mb-8">About Management Preview</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-12 mt-8">
              <div>
                <h6 className="text-primary font-bold mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">target</span>
                  Our Goal
                </h6>
                <p className="text-slate-400 leading-relaxed">
                  Ensure the most reliable, secure, and modern platform information is always visible to
                  users.
                </p>
              </div>
              <div>
                <h6 className="text-primary font-bold mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">stars</span>
                  Our Success
                </h6>
                <p className="text-slate-400 leading-relaxed">
                  Trusted by 1M+ users with consistent uptime and a nationwide operations footprint.
                </p>
              </div>
            </div>

            <div className="mt-16 flex items-center gap-12 flex-wrap">
              <div className="flex flex-col">
                <span className="text-3xl font-black text-slate-100 font-headline">10+</span>
                <span className="text-xs text-slate-500 uppercase font-headline tracking-tighter">Years Experience</span>
              </div>
              <div className="w-px h-10 bg-slate-800 hidden sm:block" />
              <div className="flex flex-col">
                <span className="text-3xl font-black text-slate-100 font-headline">500K+</span>
                <span className="text-xs text-slate-500 uppercase font-headline tracking-tighter">Active Users</span>
              </div>
              <div className="w-px h-10 bg-slate-800 hidden sm:block" />
              <div className="flex flex-col">
                <span className="text-3xl font-black text-slate-100 font-headline">99.9%</span>
                <span className="text-xs text-slate-500 uppercase font-headline tracking-tighter">Uptime</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}