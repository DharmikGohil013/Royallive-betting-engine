const auditLogs = [
  {
    operatorInitials: "SK",
    operator: "Sakib Khan",
    game: "Cricket Predictor",
    change: "House Edge: 4.0% -> 4.5%",
    timestamp: "October 25, 2024 | 10:30 AM",
    status: "Applied",
    statusClass: "bg-secondary/10 text-secondary",
  },
  {
    operatorInitials: "AH",
    operator: "Arif Hossain",
    game: "Slot Machine",
    change: "Auto-Pay: Disabled",
    timestamp: "October 24, 2024 | 04:15 PM",
    status: "Applied",
    statusClass: "bg-secondary/10 text-secondary",
  },
];

export default function GameLogicPage() {
  return (
    <div className="font-body pb-20">
      <section className="mb-10 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-black text-on-surface tracking-tight mb-2">Game Logic Management</h2>
            <p className="text-slate-400 max-w-3xl text-sm leading-relaxed">
              Manage platform algorithms, win probability, and house margin with precision. Every
              change here can directly affect your real-time gaming ecosystem.
            </p>
          </div>

          <button className="bg-gradient-to-br from-primary to-primary-container text-on-primary font-bold px-8 py-3 rounded-xl shadow-lg shadow-primary/20 active:scale-95 transition-all flex items-center gap-2 w-fit">
            <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
              save
            </span>
            Save Changes
          </button>
        </div>

        <div className="bg-error/10 border-l-4 border-error p-5 rounded-xl flex gap-4 items-start">
          <span className="material-symbols-outlined text-error text-2xl mt-0.5">warning</span>
          <div className="space-y-1">
            <p className="text-error font-bold text-lg">Warning: Logic Change Impact</p>
            <p className="text-on-surface/70 text-sm leading-relaxed">
              Changing house edge or win probability affects player RTP and platform margin. Review
              analytics before applying major configuration updates.
            </p>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-12 gap-6">
        <article className="col-span-12 lg:col-span-8 bg-surface-container rounded-2xl overflow-hidden border-none shadow-xl shadow-black/20">
          <div className="p-6 sm:p-8 border-b border-outline-variant/10 flex flex-col sm:flex-row gap-4 sm:gap-0 justify-between sm:items-center bg-surface-container-high/30">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                  sports_cricket
                </span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-100">Cricket Predictor (Live)</h3>
                <span className="text-xs bg-secondary/10 text-secondary px-2 py-0.5 rounded-full flex items-center gap-1 mt-1 w-fit font-medium">
                  <span className="w-1.5 h-1.5 bg-secondary rounded-full live-pulse" /> Active Game
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-slate-400">
              <span className="text-xs uppercase font-bold tracking-widest">Last Updated: 10m ago</span>
              <button className="p-2 hover:bg-white/5 rounded-full transition-all">
                <span className="material-symbols-outlined">expand_less</span>
              </button>
            </div>
          </div>

          <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
            <div className="space-y-8">
              <div>
                <label className="block text-sm font-semibold text-slate-400 mb-3">House Edge (%)</label>
                <div className="relative">
                  <input
                    className="w-full bg-surface-container-low border-none rounded-xl py-4 px-5 text-2xl font-bold text-primary focus:ring-1 focus:ring-primary/50"
                    type="number"
                    defaultValue="4.5"
                  />
                  <span className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500 font-bold">%</span>
                </div>
                <p className="mt-2 text-[11px] text-slate-500 italic">Recommended range: 2.5% - 7.0%</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-400 mb-3">Win Probability</label>
                <input
                  className="w-full accent-primary h-2 bg-surface-container-lowest rounded-lg appearance-none cursor-pointer"
                  type="range"
                  min="0"
                  max="100"
                  defaultValue="48"
                />
                <div className="flex justify-between mt-2 text-sm font-bold">
                  <span className="text-error">0%</span>
                  <span className="text-primary">48%</span>
                  <span className="text-secondary">100%</span>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-400 mb-3">Minimum Bet</label>
                  <input
                    className="w-full bg-surface-container-low border-none rounded-xl py-4 px-4 text-lg font-bold text-on-surface focus:ring-1 focus:ring-primary/50"
                    type="text"
                    defaultValue="BDT 100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-400 mb-3">Maximum Bet</label>
                  <input
                    className="w-full bg-surface-container-low border-none rounded-xl py-4 px-4 text-lg font-bold text-on-surface focus:ring-1 focus:ring-primary/50"
                    type="text"
                    defaultValue="BDT 50,000"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-surface-container-low rounded-xl">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-secondary">flash_on</span>
                  <span className="font-bold text-slate-200">Auto-Payout</span>
                </div>
                <button className="w-12 h-6 bg-secondary rounded-full relative flex items-center px-1 transition-all">
                  <span className="w-4 h-4 bg-on-secondary rounded-full absolute right-1" />
                </button>
              </div>
            </div>
          </div>
        </article>

        <aside className="col-span-12 lg:col-span-4 space-y-6">
          <article className="bg-surface-container rounded-2xl p-8 shadow-xl shadow-black/20 border-none">
            <h3 className="text-lg font-bold text-slate-100 mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-amber-500">analytics</span>
              Impact Analysis
            </h3>
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-400">Expected Monthly Margin</span>
                <span className="text-secondary font-bold text-lg">+BDT 12.5L</span>
              </div>
              <div className="h-1 bg-surface-container-low rounded-full">
                <div className="h-full bg-secondary w-[72%] rounded-full shadow-[0_0_10px_rgba(78,222,163,0.3)]" />
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-400">Player Retention (RTP)</span>
                <span className="text-primary font-bold text-lg">95.5%</span>
              </div>
              <div className="h-1 bg-surface-container-low rounded-full">
                <div className="h-full bg-primary w-[95%] rounded-full shadow-[0_0_10px_rgba(255,193,116,0.3)]" />
              </div>
            </div>
          </article>

          <article className="bg-gradient-to-br from-[#1c2026] to-[#10141a] rounded-2xl p-8 border border-outline-variant/10">
            <h4 className="font-bold text-slate-200 mb-4">Logic Backup</h4>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              Save a snapshot of the current logic configuration to quickly roll back to a previous
              stable state.
            </p>
            <button className="w-full py-3 rounded-xl border border-outline-variant/30 text-slate-300 font-bold hover:bg-white/5 transition-all flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-sm">history</span>
              Create Backup
            </button>
          </article>
        </aside>

        <article className="col-span-12 lg:col-span-6 bg-surface-container rounded-2xl overflow-hidden border-none shadow-lg">
          <div className="p-6 flex justify-between items-center border-b border-outline-variant/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-tertiary-container/20 flex items-center justify-center text-tertiary-container">
                <span className="material-symbols-outlined">casino</span>
              </div>
              <h3 className="font-bold text-slate-200">Slot Machine Logic</h3>
            </div>
            <button className="p-2 hover:bg-white/5 rounded-full transition-all text-slate-500">
              <span className="material-symbols-outlined">expand_more</span>
            </button>
          </div>
          <div className="p-6 grid grid-cols-2 gap-4">
            <div className="bg-surface-container-low p-4 rounded-xl">
              <span className="text-[10px] uppercase tracking-wider text-slate-500 block mb-1">Jackpot Trigger</span>
              <span className="text-lg font-bold text-on-surface">0.05%</span>
            </div>
            <div className="bg-surface-container-low p-4 rounded-xl">
              <span className="text-[10px] uppercase tracking-wider text-slate-500 block mb-1">House Ratio</span>
              <span className="text-lg font-bold text-primary">6.2%</span>
            </div>
          </div>
        </article>

        <article className="col-span-12 lg:col-span-6 bg-surface-container rounded-2xl overflow-hidden border-none shadow-lg">
          <div className="p-6 flex justify-between items-center border-b border-outline-variant/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary">
                <span className="material-symbols-outlined">stadium</span>
              </div>
              <h3 className="font-bold text-slate-200">Virtual Sports Logic</h3>
            </div>
            <button className="p-2 hover:bg-white/5 rounded-full transition-all text-slate-500">
              <span className="material-symbols-outlined">expand_more</span>
            </button>
          </div>
          <div className="p-6 grid grid-cols-2 gap-4">
            <div className="bg-surface-container-low p-4 rounded-xl">
              <span className="text-[10px] uppercase tracking-wider text-slate-500 block mb-1">Software Version</span>
              <span className="text-lg font-bold text-on-surface">v4.2.0</span>
            </div>
            <div className="bg-surface-container-low p-4 rounded-xl">
              <span className="text-[10px] uppercase tracking-wider text-slate-500 block mb-1">Odds Multiplier</span>
              <span className="text-lg font-bold text-secondary">1.85x</span>
            </div>
          </div>
        </article>
      </section>

      <section className="mt-12 bg-surface-container rounded-2xl p-8">
        <h3 className="text-xl font-bold text-slate-100 mb-8 flex items-center gap-2 uppercase tracking-wide">
          <span className="material-symbols-outlined text-amber-500">receipt_long</span>
          Logic Change Audit Trail
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="text-left text-slate-500 text-xs uppercase tracking-widest border-b border-outline-variant/10">
                <th className="pb-4 font-black">Operator</th>
                <th className="pb-4 font-black">Game</th>
                <th className="pb-4 font-black">Change</th>
                <th className="pb-4 font-black">Time & Date</th>
                <th className="pb-4 text-right font-black">Status</th>
              </tr>
            </thead>

            <tbody>
              {auditLogs.map((item) => (
                <tr key={`${item.operator}-${item.timestamp}`} className="group hover:bg-surface-container-high transition-all">
                  <td className="py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">
                        {item.operatorInitials}
                      </div>
                      <span className="font-medium text-slate-200">{item.operator}</span>
                    </div>
                  </td>
                  <td className="py-5 text-slate-400">{item.game}</td>
                  <td className="py-5 font-mono text-xs text-primary">{item.change}</td>
                  <td className="py-5 text-slate-500 text-xs">{item.timestamp}</td>
                  <td className="py-5 text-right">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded ${item.statusClass}`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="fixed bottom-8 right-8 z-40">
        <button className="w-16 h-16 bg-gradient-to-br from-primary to-primary-container rounded-2xl shadow-2xl shadow-primary/40 text-on-primary flex items-center justify-center group active:scale-90 transition-all">
          <span className="material-symbols-outlined text-3xl transition-transform group-hover:rotate-12" style={{ fontVariationSettings: "'FILL' 1" }}>
            bolt
          </span>
        </button>
      </div>
    </div>
  );
}