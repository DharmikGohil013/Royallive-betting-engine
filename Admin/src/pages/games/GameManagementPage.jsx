const stats = [
  { label: "Total Games", value: "24", border: "border-amber-500" },
  { label: "Active Players", value: "12,840", border: "border-secondary" },
  { label: "Today's Revenue", value: "BDT 85,400", border: "border-primary" },
  { label: "System Load", value: "15%", border: "border-tertiary" },
];

const gameCards = [
  {
    id: "ipl",
    title: "Indian Premier League",
    subtitle: "Fantasy Cricket League",
    icon: "sports_cricket",
    players: "5,420",
    revenue: "BDT 32,500",
    status: "Active",
    statusClass: "bg-secondary text-on-secondary",
    enabled: true,
  },
  {
    id: "t20wc",
    title: "T20 World Cup",
    subtitle: "Global Championship",
    icon: "trophy",
    players: "8,200",
    revenue: "BDT 42,800",
    status: "Active",
    statusClass: "bg-secondary text-on-secondary",
    enabled: true,
  },
  {
    id: "bbl",
    title: "Big Bash League",
    subtitle: "Australian Tournament",
    icon: "block",
    players: "0",
    revenue: "BDT 0",
    status: "Inactive",
    statusClass: "bg-surface-container-highest text-slate-400",
    enabled: false,
  },
];

const tableRows = [
  {
    id: "#G-8821",
    name: "BPL Finals",
    icon: "sports_cricket",
    iconClass: "bg-amber-500/20 text-amber-500",
    type: "Pre-match",
    participants: "1,250",
    success: "85%",
    successBar: "w-[85%] bg-secondary",
  },
  {
    id: "#G-8822",
    name: "Quick Play Cricket",
    icon: "bolt",
    iconClass: "bg-primary/20 text-primary",
    type: "Live In-Play",
    participants: "450",
    success: "62%",
    successBar: "w-[62%] bg-primary",
  },
];

export default function GameManagementPage() {
  return (
    <div className="font-body">
      <div className="mb-10 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
        <div>
          <p className="text-amber-500 font-bold tracking-widest text-xs uppercase mb-1">System Management</p>
          <h1 className="text-3xl font-black text-slate-100">Game Management</h1>
        </div>

        <button className="flex items-center gap-2 bg-gradient-to-br from-primary to-primary-container text-on-primary font-bold px-6 py-3 rounded-xl shadow-lg shadow-amber-500/20 active:scale-95 transition-all w-fit">
          <span className="material-symbols-outlined">add_circle</span>
          Add New Game
        </button>
      </div>

      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
        {stats.map((card) => (
          <article key={card.label} className={`bg-surface-container p-6 rounded-xl shadow-sm border-l-4 ${card.border}`}>
            <p className="text-slate-400 text-sm mb-2">{card.label}</p>
            <h3 className="text-2xl font-black text-white">{card.value}</h3>
          </article>
        ))}
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {gameCards.map((game) => (
          <article
            key={game.id}
            className={`bg-surface-container group rounded-2xl overflow-hidden hover:bg-surface-container-high transition-all duration-300 ${
              game.enabled ? "" : "opacity-80"
            }`}
          >
            <div className={`relative h-44 ${game.enabled ? "" : "grayscale"}`}>
              <div className="absolute inset-0 bg-gradient-to-br from-surface-container-high via-surface-container to-surface-container-low" />
              <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg ${game.statusClass}`}>
                <span className={`w-2 h-2 rounded-full ${game.enabled ? "bg-on-secondary live-pulse" : "bg-slate-500"}`} />
                {game.status}
              </div>
            </div>

            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="text-xl font-bold text-white mb-1">{game.title}</h4>
                  <p className="text-sm text-slate-400">{game.subtitle}</p>
                </div>
                <span className={`material-symbols-outlined ${game.enabled ? "text-amber-500" : "text-slate-500"}`}>{game.icon}</span>
              </div>

              <div className="grid grid-cols-2 gap-4 py-4 border-y border-white/5 mb-6">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">Players</p>
                  <p className="text-lg font-black text-slate-100">{game.players}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">Revenue</p>
                  <p className={`text-lg font-black ${game.enabled ? "text-primary" : "text-slate-500"}`}>{game.revenue}</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-slate-400">Status:</span>
                  <div className="w-12 h-6 bg-surface-container-highest rounded-full p-1 cursor-pointer">
                    <div
                      className={`w-4 h-4 rounded-full transition-transform ${
                        game.enabled ? "bg-secondary translate-x-6" : "bg-slate-600 translate-x-0"
                      }`}
                    />
                  </div>
                </div>

                <button className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors">
                  <span className="material-symbols-outlined">{game.enabled ? "edit" : "settings_backup_restore"}</span>
                </button>
              </div>
            </div>
          </article>
        ))}
      </section>

      <section className="bg-surface-container-low rounded-2xl overflow-hidden border border-white/5">
        <div className="px-8 py-6 border-b border-white/5 flex justify-between items-center">
          <h5 className="text-lg font-bold text-white">Game Details</h5>
          <button className="text-sm text-amber-500 hover:underline">View All</button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-left">
            <thead>
              <tr className="bg-surface-container-highest/30">
                <th className="px-8 py-4 text-[10px] uppercase tracking-widest text-slate-400">Game ID</th>
                <th className="px-8 py-4 text-[10px] uppercase tracking-widest text-slate-400">Game Name</th>
                <th className="px-8 py-4 text-[10px] uppercase tracking-widest text-slate-400">Type</th>
                <th className="px-8 py-4 text-[10px] uppercase tracking-widest text-slate-400">Participants</th>
                <th className="px-8 py-4 text-[10px] uppercase tracking-widest text-slate-400">Success Rate</th>
                <th className="px-8 py-4 text-[10px] uppercase tracking-widest text-slate-400">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/5">
              {tableRows.map((row) => (
                <tr key={row.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-8 py-5 text-sm font-mono text-slate-500">{row.id}</td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded flex items-center justify-center ${row.iconClass}`}>
                        <span className="material-symbols-outlined text-sm">{row.icon}</span>
                      </div>
                      <span className="text-sm font-bold text-slate-100">{row.name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-sm text-slate-400">{row.type}</td>
                  <td className="px-8 py-5 text-sm font-medium text-slate-100">{row.participants}</td>
                  <td className="px-8 py-5">
                    <div className="w-24 h-2 bg-surface-container rounded-full overflow-hidden" title={row.success}>
                      <div className={`h-full ${row.successBar}`} />
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <button className="text-slate-400 hover:text-white">
                      <span className="material-symbols-outlined text-lg">more_vert</span>
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