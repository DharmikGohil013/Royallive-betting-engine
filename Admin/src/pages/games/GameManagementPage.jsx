import { useState, useEffect } from "react";
import { getGames, createGame, updateGame, deleteGame } from "../../services/api";

const fallbackStats = [
  { label: "Total Games", value: "0", border: "border-amber-500" },
  { label: "Active Players", value: "0", border: "border-secondary" },
  { label: "Today's Revenue", value: "BDT 0", border: "border-primary" },
  { label: "System Load", value: "—", border: "border-tertiary" },
];

function fmtBDT(n) { return n != null ? `BDT ${Number(n).toLocaleString()}` : "BDT 0"; }
function fmt(n) { return n != null ? Number(n).toLocaleString() : "0"; }

export default function GameManagementPage() {
  const [games, setGames] = useState([]);
  const [stats, setStats] = useState(fallbackStats);

  async function loadGames() {
    try {
      const data = await getGames();
      const list = data.games || [];
      setGames(list);
      const active = list.filter((g) => g.isActive);
      const totalRevenue = list.reduce((s, g) => s + (g.totalRevenue || 0), 0);
      setStats([
        { label: "Total Games", value: String(list.length), border: "border-amber-500" },
        { label: "Active Games", value: String(active.length), border: "border-secondary" },
        { label: "Total Revenue", value: fmtBDT(totalRevenue), border: "border-primary" },
        { label: "System Load", value: `${Math.min(100, Math.round(active.length * 5))}%`, border: "border-tertiary" },
      ]);
    } catch { /* keep fallback */ }
  }

  useEffect(() => { loadGames(); }, []);

  async function handleToggle(game) {
    try {
      await updateGame(game._id, { isActive: !game.isActive });
      loadGames();
    } catch { /* silent */ }
  }

  async function handleDelete(game) {
    if (!confirm(`Delete "${game.name}"?`)) return;
    try {
      await deleteGame(game._id);
      loadGames();
    } catch { /* silent */ }
  }

  async function handleAddGame() {
    const name = prompt("Game Name:");
    if (!name) return;
    const category = prompt("Category (casino/sports/slots/live-dealer/esports/instant-win):", "sports");
    try {
      await createGame({ name, category: category || "sports", isActive: true });
      loadGames();
    } catch (err) { alert(err.message); }
  }
  return (
    <div className="font-body">
      <div className="mb-10 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
        <div>
          <p className="text-amber-500 font-bold tracking-widest text-xs uppercase mb-1">System Management</p>
          <h1 className="text-3xl font-black text-slate-100">Game Management</h1>
        </div>

        <button onClick={handleAddGame} className="flex items-center gap-2 bg-gradient-to-br from-primary to-primary-container text-on-primary font-bold px-6 py-3 rounded-xl shadow-lg shadow-amber-500/20 active:scale-95 transition-all w-fit">
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
        {games.slice(0, 6).map((game) => (
          <article
            key={game._id}
            className={`bg-surface-container group rounded-2xl overflow-hidden hover:bg-surface-container-high transition-all duration-300 ${
              game.isActive ? "" : "opacity-80"
            }`}
          >
            <div className={`relative h-44 ${game.isActive ? "" : "grayscale"}`}>
              <div className="absolute inset-0 bg-gradient-to-br from-surface-container-high via-surface-container to-surface-container-low" />
              <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg ${game.isActive ? "bg-secondary text-on-secondary" : "bg-surface-container-highest text-slate-400"}`}>
                <span className={`w-2 h-2 rounded-full ${game.isActive ? "bg-on-secondary live-pulse" : "bg-slate-500"}`} />
                {game.isActive ? "Active" : "Inactive"}
              </div>
            </div>

            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="text-xl font-bold text-white mb-1">{game.name}</h4>
                  <p className="text-sm text-slate-400">{game.category}</p>
                </div>
                <span className={`material-symbols-outlined ${game.isActive ? "text-amber-500" : "text-slate-500"}`}>sports_cricket</span>
              </div>

              <div className="grid grid-cols-2 gap-4 py-4 border-y border-white/5 mb-6">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">Total Bets</p>
                  <p className="text-lg font-black text-slate-100">{fmt(game.totalBets)}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">Revenue</p>
                  <p className={`text-lg font-black ${game.isActive ? "text-primary" : "text-slate-500"}`}>{fmtBDT(game.totalRevenue)}</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-slate-400">Status:</span>
                  <div className="w-12 h-6 bg-surface-container-highest rounded-full p-1 cursor-pointer" onClick={() => handleToggle(game)}>
                    <div
                      className={`w-4 h-4 rounded-full transition-transform ${
                        game.isActive ? "bg-secondary translate-x-6" : "bg-slate-600 translate-x-0"
                      }`}
                    />
                  </div>
                </div>

                <button className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors" onClick={() => handleDelete(game)}>
                  <span className="material-symbols-outlined">{game.isActive ? "edit" : "delete"}</span>
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
              {games.map((game) => (
                <tr key={game._id} className="hover:bg-white/5 transition-colors">
                  <td className="px-8 py-5 text-sm font-mono text-slate-500">#{String(game._id).slice(-5)}</td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded flex items-center justify-center ${game.isActive ? "bg-amber-500/20 text-amber-500" : "bg-primary/20 text-primary"}`}>
                        <span className="material-symbols-outlined text-sm">sports_cricket</span>
                      </div>
                      <span className="text-sm font-bold text-slate-100">{game.name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-sm text-slate-400">{game.category}</td>
                  <td className="px-8 py-5 text-sm font-medium text-slate-100">{fmt(game.totalBets)}</td>
                  <td className="px-8 py-5">
                    <div className="w-24 h-2 bg-surface-container rounded-full overflow-hidden" title={`RTP: ${game.rtp || 95}%`}>
                      <div className={`h-full ${game.isActive ? "bg-secondary" : "bg-primary"}`} style={{ width: `${game.rtp || 95}%` }} />
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <button className="text-slate-400 hover:text-white" onClick={() => handleDelete(game)}>
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