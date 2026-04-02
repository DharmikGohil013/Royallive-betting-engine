const upcomingMatches = [
  {
    id: "ipl-mi-csk",
    league: "IPL 2024",
    time: "Tomorrow • 19:30",
    teamA: "Mumbai Indians",
    teamB: "Chennai Super Kings",
    shortA: "MI",
    shortB: "CSK",
  },
  {
    id: "t20-aus-eng",
    league: "T20 Series",
    time: "27 May • 15:00",
    teamA: "Australia",
    teamB: "England",
    shortA: "AUS",
    shortB: "ENG",
  },
];

const statItems = [
  {
    icon: "trending_up",
    iconClass: "bg-secondary/10 text-secondary",
    label: "Total Live Bets",
    value: "12,450",
  },
  {
    icon: "payments",
    iconClass: "bg-amber-500/10 text-amber-500",
    label: "Transaction Volume",
    value: "BDT 5.8 Lac",
  },
  {
    icon: "warning",
    iconClass: "bg-error/10 text-error",
    label: "Reported Games",
    value: "02",
  },
];

export default function CricketUpdatesPage() {
  return (
    <div className="font-body">
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-8 sm:mb-10">
        <div>
          <p className="text-amber-500 font-medium mb-1 tracking-wider uppercase text-xs">Operations Control</p>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-100 leading-tight">Cricket Updates</h1>
        </div>

        <button className="flex items-center gap-2 bg-gradient-to-br from-primary to-primary-container text-on-primary font-bold px-6 py-3 rounded-xl shadow-lg shadow-amber-500/20 hover:scale-[1.02] transition-all active:scale-95 w-fit">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
            add_circle
          </span>
          Add New Match
        </button>
      </div>

      <section className="grid grid-cols-12 gap-6 mb-10">
        <article className="col-span-12 lg:col-span-8 bg-surface-container rounded-2xl overflow-hidden shadow-xl border border-white/5">
          <div className="p-6 bg-surface-container-high flex flex-col sm:flex-row gap-3 sm:gap-0 justify-between sm:items-center border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 bg-secondary rounded-full live-pulse" />
              <span className="text-secondary font-bold text-sm tracking-widest uppercase">Live Match</span>
            </div>
            <span className="text-xs text-slate-400 font-medium tracking-tight">ICC World Cup • ODI</span>
          </div>

          <div className="p-6 sm:p-8">
            <div className="flex items-center justify-between gap-4 sm:gap-8 flex-col sm:flex-row">
              <div className="flex flex-col items-center text-center flex-1">
                <div className="w-20 h-20 bg-surface-container-low rounded-full flex items-center justify-center mb-4 border-2 border-amber-500/20">
                  <span className="text-sm font-black text-amber-500">BAN</span>
                </div>
                <h3 className="text-xl font-bold text-slate-100 mb-1">Bangladesh</h3>
                <p className="text-3xl font-black text-amber-500 tracking-tighter">
                  285/7 <span className="text-sm font-medium text-slate-400 ml-1">(45.2 ov)</span>
                </p>
              </div>

              <div className="flex flex-col items-center">
                <div className="text-slate-600 font-black italic text-4xl mb-2">VS</div>
                <div className="bg-surface-container-highest px-3 py-1 rounded-full">
                  <span className="text-[10px] text-amber-500 font-bold uppercase tracking-widest">Sher-E-Bangla Stadium</span>
                </div>
              </div>

              <div className="flex flex-col items-center text-center flex-1">
                <div className="w-20 h-20 bg-surface-container-low rounded-full flex items-center justify-center mb-4 border-2 border-white/5">
                  <span className="text-sm font-black text-slate-300">IND</span>
                </div>
                <h3 className="text-xl font-bold text-slate-100 mb-1">India</h3>
                <p className="text-3xl font-black text-slate-500 tracking-tighter">Yet to Bat</p>
              </div>
            </div>

            <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-surface-container-low p-4 rounded-xl flex flex-col items-center hover:bg-surface-container-high transition-colors cursor-pointer">
                <span className="text-xs text-slate-500 mb-1">Bangladesh Win</span>
                <span className="text-2xl font-black text-amber-500">1.85</span>
              </div>
              <div className="bg-surface-container-low p-4 rounded-xl flex flex-col items-center hover:bg-surface-container-high transition-colors cursor-pointer">
                <span className="text-xs text-slate-500 mb-1">Draw (Tie)</span>
                <span className="text-2xl font-black text-slate-300">12.00</span>
              </div>
              <div className="bg-surface-container-low p-4 rounded-xl flex flex-col items-center hover:bg-surface-container-high transition-colors cursor-pointer">
                <span className="text-xs text-slate-500 mb-1">India Win</span>
                <span className="text-2xl font-black text-amber-500">2.10</span>
              </div>
            </div>

            <div className="mt-8 flex gap-4">
              <button className="flex-1 bg-surface-container-highest hover:bg-surface-bright text-slate-100 font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all">
                <span className="material-symbols-outlined text-xl">edit</span>
                Update Score
              </button>
              <button className="bg-surface-container-highest hover:bg-surface-bright text-slate-100 p-3 rounded-lg transition-all">
                <span className="material-symbols-outlined">settings_suggest</span>
              </button>
            </div>
          </div>
        </article>

        <aside className="col-span-12 lg:col-span-4 space-y-6">
          <div className="bg-surface-container p-6 rounded-2xl border border-white/5">
            <h4 className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-6">Today's Stats</h4>
            <div className="space-y-6">
              {statItems.map((item) => (
                <div key={item.label} className="flex justify-between items-center gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${item.iconClass}`}>
                      <span className="material-symbols-outlined">{item.icon}</span>
                    </div>
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                  <span className="text-lg font-black text-slate-100">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-amber-500/20 to-transparent p-6 rounded-2xl border border-amber-500/20 relative overflow-hidden">
            <div className="relative z-10">
              <h4 className="text-amber-500 font-bold text-xs uppercase tracking-widest mb-3">Urgent Alert</h4>
              <p className="text-sm text-slate-200 leading-relaxed mb-4">
                Check server load balancing before the India vs Pakistan high-voltage game.
              </p>
              <a href="#" className="text-amber-500 text-xs font-bold underline underline-offset-4">
                View Details
              </a>
            </div>
            <span className="material-symbols-outlined absolute -right-4 -bottom-4 text-amber-500/10 text-9xl">info</span>
          </div>
        </aside>
      </section>

      <section className="mb-10">
        <div className="flex justify-between items-center mb-6 gap-3">
          <h2 className="text-2xl font-bold text-slate-100">Upcoming Matches</h2>
          <div className="flex gap-2">
            <button className="bg-surface-container-high p-2 rounded-lg text-slate-400 hover:text-white transition-all">
              <span className="material-symbols-outlined">grid_view</span>
            </button>
            <button className="bg-surface-container-low p-2 rounded-lg text-slate-400 hover:text-white transition-all">
              <span className="material-symbols-outlined">format_list_bulleted</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {upcomingMatches.map((match) => (
            <article key={match.id} className="bg-surface-container p-6 rounded-2xl border border-white/5 hover:border-amber-500/30 transition-all group">
              <div className="flex justify-between items-start mb-6 gap-3">
                <span className="bg-surface-container-highest px-3 py-1 rounded text-[10px] font-bold text-amber-500 uppercase tracking-widest">
                  {match.league}
                </span>
                <span className="text-xs text-slate-500">{match.time}</span>
              </div>

              <div className="flex justify-between items-center mb-8">
                <div className="text-center">
                  <div className="w-12 h-12 bg-surface-container-low rounded-full flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                    <span className="text-[11px] font-black text-slate-300">{match.shortA}</span>
                  </div>
                  <p className="text-sm font-bold text-slate-300">{match.teamA}</p>
                </div>

                <div className="text-slate-700 font-black text-xl italic">VS</div>

                <div className="text-center">
                  <div className="w-12 h-12 bg-surface-container-low rounded-full flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                    <span className="text-[11px] font-black text-slate-300">{match.shortB}</span>
                  </div>
                  <p className="text-sm font-bold text-slate-300">{match.teamB}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <button className="flex-1 py-2 bg-surface-container-high hover:bg-amber-500/10 hover:text-amber-500 rounded-lg text-xs font-bold transition-all">
                  Manage Match
                </button>
                <button className="px-3 py-2 bg-surface-container-high hover:bg-error/10 hover:text-error rounded-lg transition-all">
                  <span className="material-symbols-outlined text-lg">delete</span>
                </button>
              </div>
            </article>
          ))}

          <button className="border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center p-6 hover:border-amber-500/30 transition-all cursor-pointer group min-h-[280px]">
            <div className="w-14 h-14 rounded-full bg-surface-container-low flex items-center justify-center mb-4 group-hover:bg-amber-500/20 transition-all">
              <span className="material-symbols-outlined text-3xl text-slate-600 group-hover:text-amber-500">add</span>
            </div>
            <p className="text-slate-500 font-bold text-sm group-hover:text-amber-500 transition-all">Schedule New Match</p>
          </button>
        </div>
      </section>

      <section className="mt-12 bg-surface-container rounded-3xl p-6 sm:p-10 border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 blur-[100px] rounded-full -mr-20 -mt-20" />

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-8 sm:mb-10">
            <div>
              <h3 className="text-2xl font-black text-slate-100 mb-2">Match Details Preview</h3>
              <p className="text-slate-400 text-sm">Use the fields below to add or edit a match.</p>
            </div>
            <button className="p-3 rounded-xl bg-surface-container-high text-slate-400 hover:text-white transition-all">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Team 1</label>
                  <input className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 text-slate-100 focus:ring-1 focus:ring-amber-500" type="text" defaultValue="Bangladesh" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Team 2</label>
                  <input className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 text-slate-100 focus:ring-1 focus:ring-amber-500" type="text" defaultValue="Australia" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Venue</label>
                <input className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 text-slate-100 focus:ring-1 focus:ring-amber-500" placeholder="Enter venue name" type="text" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Date</label>
                  <input className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 text-slate-100 focus:ring-1 focus:ring-amber-500" type="date" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Time</label>
                  <input className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 text-slate-100 focus:ring-1 focus:ring-amber-500" type="time" />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Match Type</label>
                <select className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 text-slate-100 focus:ring-1 focus:ring-amber-500 appearance-none">
                  <option>ODI</option>
                  <option>T20</option>
                  <option>Test</option>
                  <option>IPL</option>
                </select>
              </div>

              <div className="bg-surface-container-low p-6 rounded-2xl border border-white/5">
                <h4 className="text-xs font-bold text-amber-500 uppercase tracking-widest mb-4">Live Score Control</h4>
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <p className="text-[10px] text-slate-500 mb-2 uppercase">Runs</p>
                    <div className="flex items-center justify-center gap-3">
                      <button className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center">-</button>
                      <span className="text-2xl font-black">285</span>
                      <button className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center">+</button>
                    </div>
                  </div>

                  <div className="text-center">
                    <p className="text-[10px] text-slate-500 mb-2 uppercase">Wickets</p>
                    <div className="flex items-center justify-center gap-3">
                      <button className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center">-</button>
                      <span className="text-2xl font-black">07</span>
                      <button className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center">+</button>
                    </div>
                  </div>
                </div>
              </div>

              <button className="w-full bg-amber-500 hover:bg-amber-600 text-on-primary font-black py-4 rounded-xl shadow-lg transition-all active:scale-[0.98]">
                Save Match Update
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}