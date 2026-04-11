import { useState, useEffect } from "react";
import { getNotifications, createNotification, deleteNotification } from "../../services/api";

const fallbackStats = [
  { label: "Total Sent", value: "0", icon: "send", iconClass: "bg-primary/10 text-primary" },
  { label: "Click Rate", value: "0%", icon: "ads_click", iconClass: "bg-secondary/10 text-secondary" },
  { label: "Scheduled", value: "0", icon: "schedule", iconClass: "bg-tertiary-container/10 text-tertiary-container" },
  { label: "Failed Notifications", value: "0%", icon: "error_outline", iconClass: "bg-error/10 text-error" },
];

export default function NotificationsPage() {
  const [stats, setStats] = useState(fallbackStats);
  const [notifications, setNotifications] = useState([]);
  const [banners, setBanners] = useState([]);
  const [form, setForm] = useState({ title: "", message: "", target: "All Users", actionUrl: "", imageUrl: "" });
  const [sending, setSending] = useState(false);

  const loadNotifications = async () => {
    try {
      const res = await getNotifications({ limit: 20 });
      const list = res.notifications || [];
      setNotifications(list);
      const sent = list.filter(n => n.status === "sent").length;
      const failed = list.filter(n => n.status === "failed").length;
      const total = list.length || 1;
      setStats([
        { label: "Total Sent", value: String(sent), icon: "send", iconClass: "bg-primary/10 text-primary" },
        { label: "Click Rate", value: total > 0 ? ((sent / total) * 100).toFixed(1) + "%" : "0%", icon: "ads_click", iconClass: "bg-secondary/10 text-secondary" },
        { label: "Scheduled", value: String(list.filter(n => n.status === "scheduled").length), icon: "schedule", iconClass: "bg-tertiary-container/10 text-tertiary-container" },
        { label: "Failed", value: total > 0 ? ((failed / total) * 100).toFixed(1) + "%" : "0%", icon: "error_outline", iconClass: "bg-error/10 text-error" },
      ]);
      setBanners(list.filter(n => n.type === "banner" || n.type === "popup").slice(0, 3));
    } catch { /* keep fallback */ }
  };

  useEffect(() => { loadNotifications(); }, []);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!form.title || !form.message) return;
    setSending(true);
    try {
      await createNotification({ ...form, type: "push" });
      setForm({ title: "", message: "", target: "All Users", actionUrl: "", imageUrl: "" });
      loadNotifications();
    } catch (err) { alert(err.message || "Failed to send notification"); }
    setSending(false);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this notification?")) return;
    try { await deleteNotification(id); loadNotifications(); } catch {}
  };

  const historyRows = notifications.map(n => ({
    _id: n._id,
    date: new Date(n.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
    time: new Date(n.createdAt).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
    title: n.title,
    message: (n.message || "").slice(0, 40) + "...",
    audience: n.target || "All Users",
    status: n.status === "sent" ? "Sent" : n.status === "failed" ? "Failed" : "Pending",
    failed: n.status === "failed",
    rate: n.status === "sent" ? "100%" : n.status === "failed" ? "Server Error" : "—",
    rateBar: n.status === "sent" ? "w-full" : "w-0",
  }));

  return (
    <div className="font-body">
      <div className="max-w-6xl mx-auto space-y-10 pb-20">
        <section className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-100 font-headline tracking-tight">
              Notifications & Updates
            </h1>
            <p className="text-slate-400 mt-2 text-sm sm:text-base">
              Manage push notifications, banners, pop-ups, and delivery performance.
            </p>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-container-high text-sm font-bold text-slate-300 hover:text-white transition-all">
              <span className="material-symbols-outlined text-sm">history</span>
              View History
            </button>
            <button className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-primary to-primary-container text-sm font-bold text-on-primary shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
              <span className="material-symbols-outlined text-sm">add</span>
              New Notification
            </button>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {stats.map((item) => (
            <article key={item.label} className="bg-surface-container rounded-xl p-6 flex items-center gap-4 hover:bg-surface-container-high transition-all">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${item.iconClass}`}>
                <span className="material-symbols-outlined">{item.icon}</span>
              </div>
              <div>
                <p className="text-slate-400 text-xs mb-1">{item.label}</p>
                <h3 className="text-xl font-black text-slate-100">{item.value}</h3>
              </div>
            </article>
          ))}
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <article className="lg:col-span-7 bg-surface-container-low rounded-xl p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
              <span className="material-symbols-outlined text-primary">campaign</span>
              <h2 className="text-lg font-bold text-slate-100">New Push Notification</h2>
            </div>

            <form className="space-y-6" onSubmit={handleSend}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Notification Title</label>
                  <input className="w-full bg-surface-container border-none rounded-xl py-3 px-4 text-sm text-on-surface focus:ring-1 focus:ring-primary/50" placeholder="E.g. New bonus offer!" type="text" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Target Audience</label>
                  <select className="w-full bg-surface-container border-none rounded-xl py-3 px-4 text-sm text-on-surface focus:ring-1 focus:ring-primary/50" value={form.target} onChange={e => setForm({...form, target: e.target.value})}>
                    <option>All Users</option>
                    <option>New Users (7 days)</option>
                    <option>VIP Members</option>
                    <option>Unregistered Users</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Message Content</label>
                <textarea className="w-full bg-surface-container border-none rounded-xl py-3 px-4 text-sm text-on-surface focus:ring-1 focus:ring-primary/50 resize-none" placeholder="Write your message here..." rows="4" value={form.message} onChange={e => setForm({...form, message: e.target.value})} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Action Link (URL)</label>
                  <input className="w-full bg-surface-container border-none rounded-xl py-3 px-4 text-sm text-on-surface focus:ring-1 focus:ring-primary/50" placeholder="https://app.gainlive.com/offers" type="text" value={form.actionUrl} onChange={e => setForm({...form, actionUrl: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Icon or Image</label>
                  <div className="flex gap-2">
                    <input className="flex-1 bg-surface-container border-none rounded-xl py-3 px-4 text-sm text-on-surface focus:ring-1 focus:ring-primary/50" placeholder="Image link..." type="text" value={form.imageUrl} onChange={e => setForm({...form, imageUrl: e.target.value})} />
                    <button className="bg-surface-container-high px-4 rounded-xl hover:bg-surface-bright transition-colors" type="button">
                      <span className="material-symbols-outlined text-slate-300">attach_file</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-t border-outline-variant/10">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input className="sr-only peer" type="checkbox" />
                  <div className="w-11 h-6 bg-surface-container rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
                  <span className="ml-3 text-xs font-medium text-slate-400">Schedule Notification</span>
                </label>

                <div className="flex gap-3">
                  <button className="px-6 py-3 rounded-xl border border-outline-variant/20 text-sm font-bold text-slate-400 hover:bg-white/5 transition-all" type="button">
                    Save Draft
                  </button>
                  <button className="px-8 py-3 rounded-xl bg-gradient-to-br from-primary to-primary-container text-on-primary text-sm font-bold shadow-lg shadow-primary/20 active:scale-95 transition-all disabled:opacity-50" type="submit" disabled={sending}>
                    {sending ? "Sending..." : "Send Now"}
                  </button>
                </div>
              </div>
            </form>
          </article>

          <article className="lg:col-span-5 space-y-8">
            <div className="relative mx-auto w-72 h-[500px] border-[8px] border-slate-800 rounded-[3rem] shadow-2xl overflow-hidden bg-slate-900">
              <div className="absolute top-0 w-full h-6 bg-black flex justify-center items-end pb-1">
                <div className="w-20 h-4 bg-slate-900 rounded-b-xl" />
              </div>
              <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDSbmlWBJDCqpK55McK6zafr2Fts7bJhpL5SFO9JJymh9FdTm8FqwioSRWJMyq3xnEDL3i5TFxKb0E5jJbvcZr6R_Euo5D7odLfirwmVcpTHNsSK7HA-dWCM0FWEIBL2NzRx-zWdGeln9cpQX5NeijGGI8TK9aTg5HBlh5axWeZ8ixytynFwrrhIinPcrL_EjR7nBQF9RlSwFVpwmgrBOtsiW99NgVjSrsuFxaExWIxUre0M58ppxT49cM2Z29rh7WVpXFlDqkcOg')" }}>
                <div className="w-full h-full bg-black/40 backdrop-blur-[2px] p-4 pt-12">
                  <div className="glass-effect rounded-2xl p-4 shadow-xl border border-white/10 animate-pulse">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-amber-500 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-on-primary text-xl">sports_cricket</span>
                      </div>
                      <div className="space-y-1 overflow-hidden">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-bold text-primary uppercase tracking-tighter">Gain Live Dashboard</span>
                          <span className="text-[8px] text-slate-400">Now</span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-100 truncate">New bonus offer!</h4>
                        <p className="text-[10px] text-slate-300 leading-tight">Bet on today’s India vs Pakistan match and get a 200% cashback bonus. Limited time only!</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-center text-xs text-slate-500 italic">Push notification preview (live)</p>
          </article>
        </section>

        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-secondary">view_carousel</span>
              <h2 className="text-lg font-bold text-slate-100">Banner & Pop-up Manager</h2>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-surface-container-high rounded-xl text-xs font-bold text-secondary hover:bg-secondary/10 transition-all">
              <span className="material-symbols-outlined text-sm">add</span> Add New Banner
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {banners.map((item) => (
              <article key={item._id || item.title} className="bg-surface-container rounded-xl overflow-hidden group border border-transparent hover:border-primary/20 transition-all">
                <div className="h-40 relative flex items-center justify-center bg-surface-container-high/50">
                  <div className="w-3/4 aspect-[4/5] bg-surface-container-low rounded-lg shadow-xl border border-white/5 flex flex-col p-3 overflow-hidden">
                    <div className="h-16 w-full bg-primary/20 rounded mb-2" />
                    <div className="h-2 w-full bg-slate-600 rounded mb-1" />
                    <div className="h-2 w-2/3 bg-slate-600 rounded mb-3" />
                    <div className="h-5 w-full bg-primary/40 rounded mt-auto" />
                  </div>

                  <div className="absolute top-3 left-3 px-2 py-1 rounded bg-secondary text-[10px] font-black text-on-secondary uppercase">{item.status || "Active"}</div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex gap-2">
                      <button className="p-2 bg-white/10 rounded-lg backdrop-blur-md hover:bg-white/20 transition-all"><span className="material-symbols-outlined text-sm">edit</span></button>
                      <button className="p-2 bg-white/10 rounded-lg backdrop-blur-md hover:bg-white/20 transition-all"><span className="material-symbols-outlined text-sm">visibility</span></button>
                      <button onClick={() => handleDelete(item._id)} className="p-2 bg-error/20 rounded-lg backdrop-blur-md hover:bg-error/40 transition-all"><span className="material-symbols-outlined text-sm text-error">delete</span></button>
                    </div>
                  </div>
                </div>

                <div className="p-4 space-y-3">
                  <h3 className="font-bold text-slate-100 text-sm">{item.title}</h3>
                  <div className="flex justify-between text-[11px] text-slate-400 gap-3">
                    <span>Target: {item.target || "All Users"}</span>
                    <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </article>
            ))}

            <button className="bg-surface-container/50 border-2 border-dashed border-outline-variant/30 rounded-xl flex flex-col items-center justify-center p-8 group hover:border-primary/40 cursor-pointer transition-all">
              <div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-slate-500 group-hover:text-primary">add</span>
              </div>
              <p className="text-sm font-bold text-slate-400 group-hover:text-slate-200 transition-colors">Create New Campaign</p>
            </button>
          </div>
        </section>

        <section className="bg-surface-container-low rounded-xl overflow-hidden">
          <div className="px-8 py-6 border-b border-outline-variant/10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-lg font-bold text-slate-100">Recent Notification History</h2>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 rounded-lg bg-surface-container-high text-xs font-bold text-slate-300 hover:text-white transition-all">Filter</button>
              <button className="px-3 py-1.5 rounded-lg bg-surface-container-high text-xs font-bold text-slate-300 hover:text-white transition-all">Export</button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left">
              <thead>
                <tr className="text-slate-500 text-[10px] uppercase tracking-widest border-b border-outline-variant/5">
                  <th className="px-8 py-5 font-semibold">Date & Time</th>
                  <th className="px-8 py-5 font-semibold">Notification Title</th>
                  <th className="px-8 py-5 font-semibold">Audience</th>
                  <th className="px-8 py-5 font-semibold">Status</th>
                  <th className="px-8 py-5 font-semibold text-right">Success Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/5">
                {historyRows.map((row) => (
                  <tr key={row._id || `${row.date}-${row.time}-${row.title}`} className="hover:bg-white/5 transition-all group">
                    <td className="px-8 py-4">
                      <p className="text-xs font-bold text-slate-200">{row.date}</p>
                      <p className="text-[10px] text-slate-500">{row.time}</p>
                    </td>
                    <td className="px-8 py-4">
                      <p className="text-xs font-medium text-slate-200">{row.title}</p>
                      <p className="text-[10px] text-slate-500">Message: {row.message}</p>
                    </td>
                    <td className="px-8 py-4 text-xs text-slate-400">{row.audience}</td>
                    <td className="px-8 py-4">
                      <span className={`px-2 py-1 rounded text-[10px] font-bold border uppercase ${row.failed ? "bg-error/10 text-error border-error/20" : "bg-secondary/10 text-secondary border-secondary/20"}`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="px-8 py-4 text-right">
                      {row.failed ? (
                        <span className="text-xs text-error font-bold">Server Error</span>
                      ) : (
                        <div className="flex flex-col items-end gap-1">
                          <span className="text-xs font-bold text-slate-200">{row.rate}</span>
                          <div className="w-20 h-1 bg-surface-container rounded-full overflow-hidden">
                            <div className={`h-full bg-secondary ${row.rateBar}`} />
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-6 border-t border-outline-variant/5 flex justify-center">
            <button className="text-xs font-bold text-primary hover:underline transition-all">View More</button>
          </div>
        </section>
      </div>

      <button className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-primary text-on-primary shadow-2xl shadow-primary/40 flex items-center justify-center md:hidden transition-transform active:scale-95">
        <span className="material-symbols-outlined">add_comment</span>
      </button>
    </div>
  );
}