const stats = [
  { label: "সক্রিয় মেথড", value: "06", icon: "check_circle", iconClass: "bg-secondary/10 text-secondary" },
  { label: "পেন্ডিং ভেরিফিকেশন", value: "02", icon: "pending", iconClass: "bg-primary/10 text-primary" },
  { label: "মোট ট্রানজাকশন ভলিউম", value: "৳ 8.5 লক্ষ", icon: "account_balance", iconClass: "bg-error/10 text-error" },
];

const methods = [
  {
    id: "bkash",
    name: "বিকাশ (bKash)",
    status: "সক্রিয়",
    color: "#D8126B",
    account: "০১৭০০-০০০০০",
    accountType: "মার্চেন্ট",
    limit: "৳ ২,০০,০০০",
    short: "BK",
  },
  {
    id: "nagad",
    name: "নগদ (Nagad)",
    status: "সক্রিয়",
    color: "#F7941D",
    account: "০১৮০০-১১১১১",
    accountType: "পার্সোনাল",
    limit: "৳ ৫০,০০০",
    short: "NG",
  },
  {
    id: "bank",
    name: "ডাচ-বাংলা ব্যাংক",
    status: "পেন্ডিং",
    color: "#ffc174",
    account: "১২৩.৪৫৬.৭৮৯",
    accountType: "ব্যাংক অ্যাকাউন্ট",
    limit: "মতিঝিল, ঢাকা",
    short: "DB",
  },
];

const history = [
  {
    short: "BK",
    method: "বিকাশ মার্চেন্ট",
    action: "লিমিট আপডেট করা হয়েছে",
    operator: "অ্যাডমিন_০২",
    time: "২০ মে ২০২৪, ১০:৩০ AM",
    status: "সফল",
  },
  {
    short: "NG",
    method: "নগদ পার্সোনাল",
    action: "নতুন মেথড যুক্ত করা হয়েছে",
    operator: "অ্যাডমিন_০১",
    time: "১৯ মে ২০২৪, ০৩:৪৫ PM",
    status: "সফল",
  },
  {
    short: "DB",
    method: "ডাচ-বাংলা ব্যাংক",
    action: "ভেরিফিকেশন রিকোয়েস্ট",
    operator: "সিস্টেম",
    time: "১৮ মে ২০২৪, ১১:১৫ AM",
    status: "প্রক্রিয়াধীন",
  },
];

export default function PaymentMethodsPage() {
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
            <button className="flex items-center gap-2 bg-gradient-to-r from-primary to-primary-container text-on-primary px-6 py-3 rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all font-bold text-sm">
              <span className="material-symbols-outlined">add</span>
              নতুন মেথড
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

        <section className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {methods.map((method) => (
            <article key={method.id} className="surface-container rounded-xl overflow-hidden hover:shadow-2xl hover:shadow-black/40 transition-all duration-300 group">
              <div className="h-2" style={{ background: `linear-gradient(to right, ${method.color}, ${method.color}cc)` }} />
              <div className="p-6">
                <div className="flex justify-between items-start mb-6 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${method.color}1A` }}>
                      <span className="material-symbols-outlined text-2xl" style={{ color: method.color }}>
                        {method.id === "nagad" ? "smartphone" : method.id === "bkash" ? "account_balance_wallet" : "account_balance"}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-on-surface">{method.name}</h3>
                      <p className={`text-xs font-semibold uppercase tracking-wider ${method.status === "সক্রিয়" ? "text-secondary" : "text-slate-500"}`}>
                        {method.status}
                      </p>
                    </div>
                  </div>

                  <label className="relative inline-flex items-center cursor-pointer">
                    <input checked={method.status === "সক্রিয়"} readOnly className="sr-only peer" type="checkbox" />
                    <div className="w-11 h-6 bg-surface-container-highest rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary" />
                  </label>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center bg-surface-container-low p-3 rounded-lg">
                    <span className="text-slate-400 text-sm">অ্যাকাউন্ট নম্বর</span>
                    <span className="font-bold text-on-surface">{method.account}</span>
                  </div>
                  <div className="flex justify-between items-center bg-surface-container-low p-3 rounded-lg">
                    <span className="text-slate-400 text-sm">অ্যাকাউন্ট টাইপ</span>
                    <span className="font-bold text-on-surface">{method.accountType}</span>
                  </div>
                  <div className="flex justify-between items-center bg-surface-container-low p-3 rounded-lg">
                    <span className="text-slate-400 text-sm">দৈনিক লিমিট</span>
                    <span className="font-bold text-on-surface">{method.limit}</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button className="flex-1 py-2.5 rounded-lg bg-surface-container-high text-on-surface font-semibold hover:bg-surface-container-highest transition-all flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-sm">edit</span>
                    এডিট
                  </button>
                  <button className="w-12 h-10 rounded-lg bg-surface-container-high text-error hover:bg-error/10 transition-all flex items-center justify-center">
                    <span className="material-symbols-outlined text-xl">delete</span>
                  </button>
                </div>
              </div>
            </article>
          ))}
        </section>

        <section className="mt-12">
          <h2 className="text-xl font-bold text-on-surface mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">history</span>
            সাম্প্রতিক পেমেন্ট আপডেট
          </h2>

          <div className="surface-container rounded-xl overflow-hidden">
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

      <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-6 hidden">
        <div className="surface-container w-full max-w-xl rounded-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
          <div className="px-8 py-6 bg-surface-container-high flex justify-between items-center">
            <h3 className="text-xl font-bold text-on-surface">নতুন পেমেন্ট পদ্ধতি যুক্ত করুন</h3>
            <button className="text-slate-400 hover:text-on-surface">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          <div className="p-8 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-400">পেমেন্ট টাইপ</label>
                <select className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary/50 text-on-surface">
                  <option>মোবাইল ব্যাংকিং</option>
                  <option>ব্যাংক ট্রান্সফার</option>
                  <option>ক্রিপ্টোকারেন্সি</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-400">অপারেটর</label>
                <select className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary/50 text-on-surface">
                  <option>বিকাশ</option>
                  <option>নগদ</option>
                  <option>রকেট</option>
                  <option>উপায়</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-400">অ্যাকাউন্ট নম্বর</label>
              <input className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary/50 text-on-surface" placeholder="উদা: ০১৭XXXXXXXX" type="text" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-400">অ্যাকাউন্ট টাইপ</label>
                <select className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary/50 text-on-surface">
                  <option>পার্সোনাল</option>
                  <option>মার্চেন্ট</option>
                  <option>এজেন্ট</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-400">দৈনিক লিমিট (৳)</label>
                <input className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary/50 text-on-surface text-right font-mono" placeholder="৳ ২৫,০০০" type="number" />
              </div>
            </div>

            <div className="pt-6 flex flex-col sm:flex-row gap-4">
              <button className="flex-1 py-3.5 rounded-xl bg-surface-container-highest text-on-surface font-bold hover:bg-surface-bright transition-all">বাতিল করুন</button>
              <button className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-primary to-primary-container text-on-primary font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">সংরক্ষণ করুন</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}