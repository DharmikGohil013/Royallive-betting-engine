import { useState, useEffect } from "react";
import { getCricketMatches, createCricketMatch, updateCricketMatch, deleteCricketMatch } from "../../services/api";

export default function CricketUpdatesPage() {
  const [matches, setMatches] = useState([]);
  const [liveMatch, setLiveMatch] = useState(null);
  const [upcomingMatches, setUpcomingMatches] = useState([]);
  const [statItems, setStatItems] = useState([
    { icon: "trending_up", iconClass: "bg-secondary/10 text-secondary", label: "Total Live Bets", value: "0" },
    { icon: "payments", iconClass: "bg-amber-500/10 text-amber-500", label: "Transaction Volume", value: "BDT 0" },
    { icon: "warning", iconClass: "bg-error/10 text-error", label: "Reported Games", value: "0" },
  ]);
  const [form, setForm] = useState({ teamA: "", teamB: "", league: "", matchType: "ODI", venue: "", startTime: "", scoreA: "", scoreB: "", status: "upcoming" });

  const mapFromApi = (m) => ({ ...m, teamA: m.team1 || m.teamA, teamB: m.team2 || m.teamB, scoreA: m.score1 || m.scoreA || "", scoreB: m.score2 || m.scoreB || "", startTime: m.matchDate || m.startTime });
  const mapToApi = (f) => ({ title: `${f.teamA} vs ${f.teamB}`, team1: f.teamA, team2: f.teamB, league: f.league, matchType: f.matchType, venue: f.venue, matchDate: f.startTime, score1: f.scoreA, score2: f.scoreB, status: f.status });

  const loadMatches = async () => {
    try {
      const res = await getCricketMatches();
      const list = (res.matches || []).map(mapFromApi);
      setMatches(list);
      const live = list.find(m => m.status === "live");
      setLiveMatch(live || null);
      setUpcomingMatches(list.filter(m => m.status === "upcoming").slice(0, 5));
      setStatItems([
        { icon: "trending_up", iconClass: "bg-secondary/10 text-secondary", label: "Total Matches", value: String(list.length) },
        { icon: "payments", iconClass: "bg-amber-500/10 text-amber-500", label: "Live Matches", value: String(list.filter(m => m.status === "live").length) },
        { icon: "warning", iconClass: "bg-error/10 text-error", label: "Upcoming", value: String(list.filter(m => m.status === "upcoming").length) },
      ]);
    } catch {}
  };

  useEffect(() => { loadMatches(); }, []);

  const handleSaveMatch = async () => {
    if (!form.teamA || !form.teamB) return alert("Enter both team names");
    try {
      const payload = mapToApi(form);
      if (form._id) { await updateCricketMatch(form._id, payload); }
      else { await createCricketMatch(payload); }
      setForm({ teamA: "", teamB: "", league: "", matchType: "ODI", venue: "", startTime: "", scoreA: "", scoreB: "", status: "upcoming" });
      loadMatches();
    } catch (err) { alert(err.message || "Failed to save match"); }
  };

  const handleDeleteMatch = async (id) => {
    if (!confirm("Delete this match?")) return;
    try { await deleteCricketMatch(id); loadMatches(); } catch {}
  };

  const handleEditMatch = (match) => {
    setForm({ ...match, startTime: match.startTime ? new Date(match.startTime).toISOString().slice(0, 16) : "" });
  };

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

      <section className="grid grid-cols-12 gap-4 sm:gap-6 mb-6 sm:mb-10">
        {liveMatch ? (
        <article className="col-span-12 lg:col-span-8 bg-surface-container rounded-2xl overflow-hidden shadow-xl border border-white/5">
          <div className="p-4 sm:p-6 bg-surface-container-high flex flex-col sm:flex-row gap-3 sm:gap-0 justify-between sm:items-center border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 bg-secondary rounded-full live-pulse" />
              <span className="text-secondary font-bold text-sm tracking-widest uppercase">Live Match</span>
            </div>
            <span className="text-xs text-slate-400 font-medium tracking-tight">{liveMatch.league || "Match"} • {liveMatch.matchType || "ODI"}</span>
          </div>

          <div className="p-4 sm:p-6 lg:p-8">
              <div className="flex items-center justify-between gap-4 sm:gap-8 flex-col sm:flex-row">
              <div className="flex flex-col items-center text-center flex-1">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-surface-container-low rounded-full flex items-center justify-center mb-3 sm:mb-4 border-2 border-amber-500/20">
                  <span className="text-xs sm:text-sm font-black text-amber-500">{(liveMatch.teamA || "").slice(0, 3).toUpperCase()}</span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-100 mb-1">{liveMatch.teamA}</h3>
                <p className="text-2xl sm:text-3xl font-black text-amber-500 tracking-tighter">
                  {liveMatch.scoreA || "—"}
                </p>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-slate-600 font-black italic text-4xl mb-2">VS</div>
                <div className="bg-surface-container-highest px-3 py-1 rounded-full">
                  <span className="text-[10px] text-amber-500 font-bold uppercase tracking-widest">{liveMatch.venue || "TBD"}</span>
                </div>
              </div>
              <div className="flex flex-col items-center text-center flex-1">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-surface-container-low rounded-full flex items-center justify-center mb-3 sm:mb-4 border-2 border-white/5">
                  <span className="text-xs sm:text-sm font-black text-slate-300">{(liveMatch.teamB || "").slice(0, 3).toUpperCase()}</span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-100 mb-1">{liveMatch.teamB}</h3>
                <p className="text-2xl sm:text-3xl font-black text-slate-500 tracking-tighter">{liveMatch.scoreB || "Yet to Bat"}</p>
              </div>
            </div>

            <div className="mt-8 flex gap-4">
              <button onClick={() => handleEditMatch(liveMatch)} className="flex-1 bg-surface-container-highest hover:bg-surface-bright text-slate-100 font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all">
                <span className="material-symbols-outlined text-xl">edit</span>
                Update Score
              </button>
            </div>
          </div>
        </article>
        ) : (
        <article className="col-span-12 lg:col-span-8 bg-surface-container rounded-2xl p-8 flex items-center justify-center border border-white/5">
          <p className="text-slate-500 text-lg">No live match currently</p>
        </article>
        )}

        <aside className="col-span-12 lg:col-span-4 space-y-6">
          <div className="bg-surface-container p-4 sm:p-6 rounded-2xl border border-white/5">
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
        <div className="flex justify-between items-center mb-4 sm:mb-6 gap-3">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-100">Upcoming Matches</h2>
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
            <article key={match._id} className="bg-surface-container p-4 sm:p-6 rounded-2xl border border-white/5 hover:border-amber-500/30 transition-all group">
              <div className="flex justify-between items-start mb-6 gap-3">
                <span className="bg-surface-container-highest px-3 py-1 rounded text-[10px] font-bold text-amber-500 uppercase tracking-widest">
                  {match.league || match.matchType}
                </span>
                <span className="text-xs text-slate-500">{match.startTime ? new Date(match.startTime).toLocaleDateString() : "TBD"}</span>
              </div>

              <div className="flex justify-between items-center mb-4 sm:mb-8">
                <div className="text-center">
                  <div className="w-12 h-12 bg-surface-container-low rounded-full flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                    <span className="text-[11px] font-black text-slate-300">{(match.teamA || "").slice(0, 3).toUpperCase()}</span>
                  </div>
                  <p className="text-sm font-bold text-slate-300">{match.teamA}</p>
                </div>

                <div className="text-slate-700 font-black text-xl italic">VS</div>

                <div className="text-center">
                  <div className="w-12 h-12 bg-surface-container-low rounded-full flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                    <span className="text-[11px] font-black text-slate-300">{(match.teamB || "").slice(0, 3).toUpperCase()}</span>
                  </div>
                  <p className="text-sm font-bold text-slate-300">{match.teamB}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => handleEditMatch(match)} className="flex-1 py-2 bg-surface-container-high hover:bg-amber-500/10 hover:text-amber-500 rounded-lg text-xs font-bold transition-all">
                  Manage Match
                </button>
                <button onClick={() => handleDeleteMatch(match._id)} className="px-3 py-2 bg-surface-container-high hover:bg-error/10 hover:text-error rounded-lg transition-all">
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
          <div className="flex items-center justify-between mb-6 sm:mb-8 sm:mb-10">
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
                  <input className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 text-slate-100 focus:ring-1 focus:ring-amber-500" type="text" value={form.teamA} onChange={e => setForm({...form, teamA: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Team 2</label>
                  <input className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 text-slate-100 focus:ring-1 focus:ring-amber-500" type="text" value={form.teamB} onChange={e => setForm({...form, teamB: e.target.value})} />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Venue</label>
                <input className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 text-slate-100 focus:ring-1 focus:ring-amber-500" placeholder="Enter venue name" type="text" value={form.venue} onChange={e => setForm({...form, venue: e.target.value})} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Date & Time</label>
                  <input className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 text-slate-100 focus:ring-1 focus:ring-amber-500" type="datetime-local" value={form.startTime} onChange={e => setForm({...form, startTime: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">League</label>
                  <input className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 text-slate-100 focus:ring-1 focus:ring-amber-500" type="text" value={form.league} onChange={e => setForm({...form, league: e.target.value})} placeholder="IPL / ICC / T20 Series" />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Match Type</label>
                <select className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 text-slate-100 focus:ring-1 focus:ring-amber-500 appearance-none" value={form.matchType} onChange={e => setForm({...form, matchType: e.target.value})}>
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
                    <p className="text-[10px] text-slate-500 mb-2 uppercase">Score A</p>
                    <input className="w-full bg-surface-container border-none rounded-lg py-2 px-3 text-center text-xl font-black text-slate-100 focus:ring-1 focus:ring-amber-500" type="text" value={form.scoreA} onChange={e => setForm({...form, scoreA: e.target.value})} placeholder="285/7 (45.2)" />
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] text-slate-500 mb-2 uppercase">Score B</p>
                    <input className="w-full bg-surface-container border-none rounded-lg py-2 px-3 text-center text-xl font-black text-slate-100 focus:ring-1 focus:ring-amber-500" type="text" value={form.scoreB} onChange={e => setForm({...form, scoreB: e.target.value})} placeholder="Yet to Bat" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Status</label>
                <select className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 text-slate-100 focus:ring-1 focus:ring-amber-500" value={form.status} onChange={e => setForm({...form, status: e.target.value})}>
                  <option value="upcoming">Upcoming</option>
                  <option value="live">Live</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <button onClick={handleSaveMatch} className="w-full bg-amber-500 hover:bg-amber-600 text-on-primary font-black py-4 rounded-xl shadow-lg transition-all active:scale-[0.98]">
                {form._id ? "Update Match" : "Save Match"}
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}