const timeframeOptions = ["Today", "This Week", "This Month", "Yearly"];

const summaryCards = [
  {
    id: "total-deposit",
    icon: "account_balance_wallet",
    iconClass: "bg-secondary/10 text-secondary",
    trend: "+12.5%",
    trendClass: "text-secondary",
    title: "Total Deposit",
    value: "BDT 842,500",
  },
  {
    id: "total-withdraw",
    icon: "payments",
    iconClass: "bg-error/10 text-error",
    trend: "+8.2%",
    trendClass: "text-error",
    title: "Total Withdraw",
    value: "BDT 512,200",
  },
  {
    id: "net-profit",
    icon: "insights",
    iconClass: "bg-amber-500/10 text-amber-500",
    trend: "+21.0%",
    trendClass: "text-secondary",
    title: "Net Profit",
    value: "BDT 330,300",
    valueClass: "text-amber-500",
    cardClass: "bg-gradient-to-br from-surface-container to-surface-container-high",
  },
  {
    id: "expected-profit",
    icon: "analytics",
    iconClass: "bg-surface-container-highest text-on-surface-variant",
    title: "Expected Profit",
    value: "BDT 450,000",
    cardClass: "border-l-4 border-amber-500",
  },
];

const dailyTrend = [
  { day: "Sat", height: "h-[45%]" },
  { day: "Sun", height: "h-[60%]" },
  { day: "Mon", height: "h-[52%]" },
  { day: "Tue", height: "h-[85%]" },
  { day: "Wed", height: "h-[68%]" },
  { day: "Thu", height: "h-[92%]" },
  { day: "Fri", height: "h-[75%]" },
];

const topDepositors = [
  {
    initial: "A",
    initialClass: "bg-amber-500/20 text-amber-500",
    name: "Ariful Islam",
    tier: "Premium Member",
    id: "#CRI-89210",
    totalDeposit: "BDT 145,000",
    totalBet: "842",
    status: "Active",
    statusClass: "bg-secondary/10 text-secondary",
  },
  {
    initial: "R",
    initialClass: "bg-slate-700 text-slate-300",
    name: "Rakibul Hasan",
    tier: "VIP",
    id: "#CRI-77341",
    totalDeposit: "BDT 112,500",
    totalBet: "520",
    status: "Active",
    statusClass: "bg-secondary/10 text-secondary",
  },
  {
    initial: "S",
    initialClass: "bg-slate-700 text-slate-300",
    name: "Sakib Ahmed",
    tier: "Standard",
    id: "#CRI-66129",
    totalDeposit: "BDT 98,000",
    totalBet: "315",
    status: "Inactive",
    statusClass: "bg-surface-container-highest text-slate-400",
  },
  {
    initial: "T",
    initialClass: "bg-slate-700 text-slate-300",
    name: "Tamim Iqbal",
    tier: "New Member",
    id: "#CRI-55104",
    totalDeposit: "BDT 82,400",
    totalBet: "150",
    status: "Active",
    statusClass: "bg-secondary/10 text-secondary",
  },
  {
    initial: "M",
    initialClass: "bg-slate-700 text-slate-300",
    name: "Mahmudullah Riyad",
    tier: "VIP",
    id: "#CRI-44912",
    totalDeposit: "BDT 76,900",
    totalBet: "210",
    status: "Active",
    statusClass: "bg-secondary/10 text-secondary",
  },
];

export default function AnalyticsPage() {
  return (
    <div className="font-body">
      <div className="mb-8 sm:mb-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-100 font-headline tracking-tight">
            Gain Live Analytics
          </h1>
          <p className="text-slate-500 mt-2 text-sm">Track deposits, withdrawals, and performance trends.</p>
        </div>

        <div className="relative w-full lg:w-80 group">
          <span className="absolute inset-y-0 left-3 flex items-center text-slate-500 group-focus-within:text-amber-500">
            <span className="material-symbols-outlined text-xl">search</span>
          </span>
          <input
            className="bg-surface-container-low border border-outline-variant/20 rounded-lg pl-10 pr-4 py-2.5 w-full text-sm focus:ring-1 focus:ring-amber-500 transition-all outline-none text-on-surface"
            placeholder="Search transaction ID..."
            type="text"
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 mb-8 sm:mb-10">
        <div className="flex flex-wrap bg-surface-container-low p-1.5 rounded-xl shadow-inner gap-1">
          {timeframeOptions.map((option) => (
            <button
              key={option}
              className={
                option === "This Week"
                  ? "px-5 sm:px-6 py-2 rounded-lg text-sm font-semibold transition-all bg-amber-500 text-on-primary shadow-lg shadow-amber-500/20"
                  : "px-5 sm:px-6 py-2 rounded-lg text-sm font-semibold transition-all text-slate-400 hover:text-slate-100"
              }
            >
              {option}
            </button>
          ))}

          <button className="px-5 sm:px-6 py-2 rounded-lg text-sm font-semibold transition-all text-slate-400 hover:text-slate-100 flex items-center gap-2 border-l border-white/5 ml-0 sm:ml-1 pl-4">
            <span className="material-symbols-outlined text-lg">calendar_today</span>
            Custom Date
          </button>
        </div>

        <button className="flex items-center gap-2 bg-surface-container-high px-5 py-2.5 rounded-xl font-bold text-sm text-secondary hover:bg-secondary hover:text-on-secondary transition-all">
          <span className="material-symbols-outlined">download</span>
          Download Report
        </button>
      </div>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-10">
        {summaryCards.map((card) => (
          <article
            key={card.id}
            className={`surface-container p-6 rounded-xl border-none shadow-lg group hover:-translate-y-1 transition-all duration-300 ${
              card.cardClass || ""
            }`}
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl ${card.iconClass}`}>
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                  {card.icon}
                </span>
              </div>

              {card.trend ? (
                <span className={`text-xs font-bold flex items-center gap-1 ${card.trendClass}`}>
                  {card.trend}
                  <span className="material-symbols-outlined text-xs">trending_up</span>
                </span>
              ) : null}
            </div>

            <h3 className="text-slate-400 text-sm font-medium mb-1">{card.title}</h3>
            <p className={`text-3xl font-black tracking-tight ${card.valueClass || "text-slate-100"}`}>
              {card.value}
            </p>
          </article>
        ))}
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 sm:mb-10">
        <article className="lg:col-span-2 surface-container rounded-xl p-6 sm:p-8 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h3 className="text-lg font-bold text-slate-100 mb-1 leading-tight">Daily Deposit Trend</h3>
              <p className="text-xs text-slate-500">Detailed tracking over the last 7 days.</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-amber-500" />
                <span className="text-slate-400">Deposit</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-secondary" />
                <span className="text-slate-400">Success Rate</span>
              </div>
            </div>
          </div>

          <div className="h-64 flex items-end justify-between gap-1 mt-4 relative">
            <div className="absolute inset-0 flex flex-col justify-between opacity-10 pointer-events-none">
              <div className="border-t border-slate-500 w-full" />
              <div className="border-t border-slate-500 w-full" />
              <div className="border-t border-slate-500 w-full" />
              <div className="border-t border-slate-500 w-full" />
            </div>

            {dailyTrend.map((bar) => (
              <div key={bar.day} className="flex-1 flex flex-col justify-end items-center group">
                <div
                  className={`w-full bg-gradient-to-t from-amber-500/5 to-amber-500/40 ${bar.height} rounded-t-sm transition-all group-hover:to-amber-500/60`}
                />
                <span className="text-[10px] mt-4 font-bold text-slate-500 uppercase">{bar.day}</span>
              </div>
            ))}
          </div>
        </article>

        <article className="surface-container rounded-xl p-6 sm:p-8">
          <h3 className="text-lg font-bold text-slate-100 mb-6 leading-tight">Weekly Comparison</h3>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-400">This Week</span>
                <span className="text-amber-500 font-bold">BDT 8.4 Lac</span>
              </div>
              <div className="h-2.5 w-full bg-surface-container-high rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 w-[85%] rounded-full" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-400">Last Week</span>
                <span className="text-slate-100 font-bold">BDT 7.2 Lac</span>
              </div>
              <div className="h-2.5 w-full bg-surface-container-high rounded-full overflow-hidden">
                <div className="h-full bg-slate-500 w-[72%] rounded-full" />
              </div>
            </div>

            <div className="pt-6 border-t border-white/5 mt-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-surface-container-low rounded-xl">
                  <p className="text-[10px] uppercase text-slate-500 mb-1">Growth</p>
                  <p className="text-lg font-bold text-secondary">+14%</p>
                </div>
                <div className="text-center p-4 bg-surface-container-low rounded-xl">
                  <p className="text-[10px] uppercase text-slate-500 mb-1">Target</p>
                  <p className="text-lg font-bold text-slate-100">92%</p>
                </div>
              </div>
            </div>
          </div>
        </article>
      </section>

      <section className="surface-container rounded-xl overflow-hidden">
        <div className="px-6 sm:px-8 py-6 border-b border-white/5 flex flex-col sm:flex-row gap-3 sm:gap-0 justify-between sm:items-center">
          <h3 className="text-lg font-bold text-slate-100">Top 10 Depositor Users</h3>
          <button className="text-amber-500 text-sm font-semibold hover:underline text-left sm:text-right">
            View All
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[920px] text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low">
                <th className="px-8 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  User
                </th>
                <th className="px-8 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">ID</th>
                <th className="px-8 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  Total Deposit
                </th>
                <th className="px-8 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  Total Bets
                </th>
                <th className="px-8 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  Status
                </th>
                <th className="px-8 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/5">
              {topDepositors.map((user) => (
                <tr key={user.id} className="hover:bg-white/5 transition-colors cursor-pointer group">
                  <td className="px-8 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                          user.initialClass
                        }`}
                      >
                        {user.initial}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-100">{user.name}</p>
                        <p className="text-[10px] text-slate-500 uppercase tracking-tighter">{user.tier}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-4 font-mono text-xs text-slate-400">{user.id}</td>
                  <td className="px-8 py-4 font-bold text-slate-100">{user.totalDeposit}</td>
                  <td className="px-8 py-4 text-slate-400 text-sm">{user.totalBet}</td>
                  <td className="px-8 py-4">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase ${user.statusClass}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-8 py-4">
                    <button className="material-symbols-outlined text-slate-500 hover:text-amber-500 transition-colors">
                      visibility
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}