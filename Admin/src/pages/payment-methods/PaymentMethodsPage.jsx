import { useState, useEffect } from "react";
import { getPaymentMethods, createPaymentMethod, updatePaymentMethod, deletePaymentMethod } from "../../services/api";

const colorMap = { bkash: "#D8126B", nagad: "#F7941D", rocket: "#8E24AA", bank: "#ffc174", upay: "#00BCD4" };

export default function PaymentMethodsPage() {
  const [methods, setMethods] = useState([]);
  const [stats, setStats] = useState([
    { label: "Active Methods", value: "0", icon: "check_circle", iconClass: "bg-secondary/10 text-secondary" },
    { label: "Pending", value: "0", icon: "pending", iconClass: "bg-primary/10 text-primary" },
    { label: "Total", value: "0", icon: "account_balance", iconClass: "bg-error/10 text-error" },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [modalForm, setModalForm] = useState({ name: "", type: "mobile_banking", accountNumber: "", accountType: "personal", dailyLimit: 25000, isActive: true });

  const loadMethods = async () => {
    try {
      const res = await getPaymentMethods();
      const list = res.paymentMethods || [];
      setMethods(list);
      const active = list.filter(m => m.isActive).length;
      const pending = list.filter(m => !m.isActive).length;
      setStats([
        { label: "Active Methods", value: String(active).padStart(2, "0"), icon: "check_circle", iconClass: "bg-secondary/10 text-secondary" },
        { label: "Pending", value: String(pending).padStart(2, "0"), icon: "pending", iconClass: "bg-primary/10 text-primary" },
        { label: "Total", value: String(list.length).padStart(2, "0"), icon: "account_balance", iconClass: "bg-error/10 text-error" },
      ]);
    } catch {}
  };

  useEffect(() => { loadMethods(); }, []);

  const handleToggle = async (method) => {
    try { await updatePaymentMethod(method._id, { isActive: !method.isActive }); loadMethods(); } catch {}
  };

  const handleDelete = async (method) => {
    if (!confirm("Delete " + method.name + "?")) return;
    try { await deletePaymentMethod(method._id); loadMethods(); } catch {}
  };

  const handleAddMethod = async () => {
    if (!modalForm.name || !modalForm.accountNumber) return alert("Fill required fields");
    try { await createPaymentMethod(modalForm); setShowModal(false); setModalForm({ name: "", type: "mobile_banking", accountNumber: "", accountType: "personal", dailyLimit: 25000, isActive: true }); loadMethods(); } catch (err) { alert(err.message); }
  };

  return (
    <div className="font-body">
      <div className="max-w-6xl mx-auto pb-16">
        <section className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-100 font-headline tracking-tight">
              পেমেন্ট পদ্ধতি ব্যবস্থাপনা
            </h1>
            <p className="text-slate-400 mt-2 text-sm sm:text-base">
              আপনার payment methods, verification flow, and transaction controls পরিচালনা করুন।
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button className="hidden sm:flex items-center gap-2 bg-surface-container-high hover:bg-surface-container-highest text-on-surface px-5 py-3 rounded-xl transition-all font-bold text-sm">
              <span className="material-symbols-outlined text-primary">history</span>
              ব্যাকআপ হিস্ট্রি
            </button>
            <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-gradient-to-r from-primary to-primary-container text-on-primary px-6 py-3 rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all font-bold text-sm">
              <span className="material-symbols-outlined">add</span>
              Add Method
            </button>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10 mb-10">
          {stats.map((item) => (
            <article key={item.label} className="glass-card p-6 rounded-xl border-none flex items-center gap-5">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center ${item.iconClass}`}>
                <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                  {item.icon}
                </span>
              </div>
              <div>
                <p className="text-slate-400 text-sm font-medium">{item.label}</p>
                <p className="text-3xl font-black text-on-surface leading-tight">{item.value}</p>
              </div>
            </article>
          ))}
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {methods.map((method) => {
            const color = colorMap[method.type] || colorMap[method.name?.toLowerCase()?.split(" ")[0]] || "#ffc174";
            return (
            <article key={method._id} className="bg-surface-container rounded-xl overflow-hidden hover:shadow-2xl hover:shadow-black/40 transition-all duration-300 group">
              <div className="h-2" style={{ background: `linear-gradient(to right, ${color}, ${color}cc)` }} />
              <div className="p-6">
                <div className="flex justify-between items-start mb-6 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${color}1A` }}>
                      <span className="material-symbols-outlined text-2xl" style={{ color }}>
                        {method.type === "bank_transfer" ? "account_balance" : "account_balance_wallet"}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-on-surface">{method.name}</h3>
                      <p className={`text-xs font-semibold uppercase tracking-wider ${method.isActive ? "text-secondary" : "text-slate-500"}`}>
                        {method.isActive ? "Active" : "Inactive"}
                      </p>
                    </div>
                  </div>

                  <label className="relative inline-flex items-center cursor-pointer" onClick={() => handleToggle(method)}>
                    <input checked={method.isActive} readOnly className="sr-only peer" type="checkbox" />
                    <div className="w-11 h-6 bg-surface-container-highest rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary" />
                  </label>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center bg-surface-container-low p-3 rounded-lg">
                    <span className="text-slate-400 text-sm">Account Number</span>
                    <span className="font-bold text-on-surface">{method.accountNumber}</span>
                  </div>
                  <div className="flex justify-between items-center bg-surface-container-low p-3 rounded-lg">
                    <span className="text-slate-400 text-sm">Account Type</span>
                    <span className="font-bold text-on-surface">{method.accountType || method.type}</span>
                  </div>
                  <div className="flex justify-between items-center bg-surface-container-low p-3 rounded-lg">
                    <span className="text-slate-400 text-sm">Daily Limit</span>
                    <span className="font-bold text-on-surface">BDT {(method.dailyLimit || 0).toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button className="flex-1 py-2.5 rounded-lg bg-surface-container-high text-on-surface font-semibold hover:bg-surface-container-highest transition-all flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-sm">edit</span>
                    Edit
                  </button>
                  <button onClick={() => handleDelete(method)} className="w-12 h-10 rounded-lg bg-surface-container-high text-error hover:bg-error/10 transition-all flex items-center justify-center">
                    <span className="material-symbols-outlined text-xl">delete</span>
                  </button>
                </div>
              </div>
            </article>
            );
          })}
        </section>

        <section className="mt-12">
          <h2 className="text-xl font-bold text-on-surface mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">history</span>
            সাম্প্রতিক পেমেন্ট আপডেট
          </h2>

          <div className="bg-surface-container rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left border-collapse">
                <thead className="bg-surface-container-high text-slate-400 font-bold text-xs uppercase tracking-widest">
                  <tr>
                    <th className="px-6 py-4">পদ্ধতি</th>
                    <th className="px-6 py-4">অ্যাকশন</th>
                    <th className="px-6 py-4">অপারেটর</th>
                    <th className="px-6 py-4">তারিখ ও সময়</th>
                    <th className="px-6 py-4">স্ট্যাটাস</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {history.map((row) => (
                    <tr key={`${row.method}-${row.time}`} className="hover:bg-white/5 transition-colors group">
                      <td className="px-6 py-4 flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-primary/20 flex items-center justify-center text-primary font-bold text-[10px]">
                          {row.short}
                        </div>
                        <span className="text-on-surface font-medium">{row.method}</span>
                      </td>
                      <td className="px-6 py-4 text-slate-300">{row.action}</td>
                      <td className="px-6 py-4 text-slate-300">{row.operator}</td>
                      <td className="px-6 py-4 text-slate-400 font-mono text-xs">{row.time}</td>
                      <td className="px-6 py-4">
                        <span className={`${row.status === "সফল" ? "bg-secondary/10 text-secondary" : row.status === "প্রক্রিয়াধীন" ? "bg-primary/10 text-primary" : "bg-error/10 text-error"} text-[10px] px-2 py-1 rounded-full font-bold`}>{row.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>

      {showModal && (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-6">
        <div className="surface-container w-full max-w-xl rounded-2xl overflow-hidden shadow-2xl">
          <div className="px-4 sm:px-6 lg:px-8 py-6 bg-surface-container-high flex justify-between items-center">
            <h3 className="text-lg sm:text-xl font-bold text-on-surface">Add New Payment Method</h3>
            <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-on-surface">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
          <div className="p-4 sm:p-6 lg:p-8 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-400">Payment Type</label>
                <select value={modalForm.type} onChange={e => setModalForm({...modalForm, type: e.target.value})} className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary/50 text-on-surface">
                  <option value="mobile_banking">Mobile Banking</option>
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="crypto">Cryptocurrency</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-400">Name</label>
                <input value={modalForm.name} onChange={e => setModalForm({...modalForm, name: e.target.value})} className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary/50 text-on-surface" placeholder="bKash / Nagad" type="text" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-400">Account Number</label>
              <input value={modalForm.accountNumber} onChange={e => setModalForm({...modalForm, accountNumber: e.target.value})} className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary/50 text-on-surface" placeholder="01XXXXXXXXX" type="text" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-400">Account Type</label>
                <select value={modalForm.accountType} onChange={e => setModalForm({...modalForm, accountType: e.target.value})} className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary/50 text-on-surface">
                  <option value="personal">Personal</option>
                  <option value="merchant">Merchant</option>
                  <option value="agent">Agent</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-400">Daily Limit (BDT)</label>
                <input value={modalForm.dailyLimit} onChange={e => setModalForm({...modalForm, dailyLimit: Number(e.target.value)})} className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary/50 text-on-surface text-right font-mono" placeholder="25000" type="number" />
              </div>
            </div>
            <div className="pt-6 flex flex-col sm:flex-row gap-4">
              <button onClick={() => setShowModal(false)} className="flex-1 py-3.5 rounded-xl bg-surface-container-highest text-on-surface font-bold hover:bg-surface-bright transition-all">Cancel</button>
              <button onClick={handleAddMethod} className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-primary to-primary-container text-on-primary font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">Save</button>
            </div>
          </div>
        </div>
      </div>
      )}
    </div>
  );
}