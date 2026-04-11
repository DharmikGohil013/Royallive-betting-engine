import { useState, useEffect } from "react";
import { getGameStats, getTopUsers, getBetAnalysis } from "../../services/api";

export default function GameStatisticsPage() {
  const [statCards, setStatCards] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [betDist, setBetDist] = useState({ matchWinner: 70, playerFantasy: 20, others: 10, totalValue: "0" });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [stats, topUsers, bets] = await Promise.all([
        getGameStats(),
        getTopUsers("totalBets", 4),
        getBetAnalysis(),
      ]);

      if (stats) {
        setStatCards([
          { label: "Total Plays", value: (stats.totalPlays || 0).toLocaleString(), change: `+${stats.playsGrowth || 0}%`, changeClass: "text-secondary bg-secondary/10", icon: "sports_esports" },
          { label: "Total Revenue", value: `৳${(stats.totalRevenue || 0).toLocaleString()}`, change: `+${stats.revenueGrowth || 0}%`, changeClass: "text-secondary bg-secondary/10", icon: "payments" },
          { label: "Avg Bet", value: `৳${(stats.avgBet || 0).toLocaleString()}`, change: `${stats.avgBetChange || 0}%`, changeClass: (stats.avgBetChange || 0) >= 0 ? "text-secondary bg-secondary/10" : "text-error bg-error/10", icon: "equalizer" },
          { label: "Active Players", value: (stats.activePlayers || 0).toLocaleString(), change: `+${stats.playerGrowth || 0}%`, changeClass: "text-secondary bg-secondary/10", icon: "person_play" },
        ]);
      }

      if (topUsers?.users) {
        setLeaderboard(topUsers.users.map((u, i) => ({
          rank: `#${i + 1}`,
          name: u.username,
          id: u._id?.slice(-6),
          games: String(u.totalBets || 0),
          rate: `${Math.round((u.wonBets || 0) / Math.max(u.totalBets || 1, 1) * 100)}%`,
          total: `৳${(u.totalWinnings || u.totalDeposits || 0).toLocaleString()}`,
          avatarBg: i === 0 ? "bg-amber-500/20 text-amber-500" : "bg-slate-800 text-slate-400",
          bar: `w-[${Math.round((u.wonBets || 0) / Math.max(u.totalBets || 1, 1) * 100)}%]`,
        })));
      }

      if (bets) {
        const total = (bets.totalAmount || 1);
        setBetDist({ matchWinner: bets.matchWinnerPct || 70, playerFantasy: bets.fantasyPct || 20, others: bets.othersPct || 10, totalValue: `৳${(total / 100000).toFixed(1)}L` });
      }
    } catch (e) { console.error(e); }
  }
  return (
    <div className="font-body">
      <div className="max-w-[1400px] mx-auto">
        <section className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between mb-10">
          <div>
            <nav className="flex items-center space-x-2 text-xs text-slate-500 mb-2 font-medium">
              <span className="hover:text-amber-500 cursor-pointer">Dashboard</span>
              <span className="material-symbols-outlined text-[14px]">chevron_right</span>
              <span className="text-amber-500/80">Game Statistics</span>
            </nav>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-100 tracking-tight flex items-center flex-wrap gap-3">
              Game Statistics
              <span className="px-3 py-1 bg-amber-500/10 text-amber-500 text-xs font-bold rounded-full border border-amber-500/20">
                IPL Fantasy
              </span>
            </h1>
          </div>

          <div className="flex flex-wrap gap-3">
            <button className="bg-[#181c22] text-slate-300 px-5 py-2.5 rounded-xl text-sm font-bold flex items-center hover:bg-slate-800 transition-all">
              <span className="material-symbols-outlined mr-2 text-lg">calendar_today</span>
              Last 30 Days
            </button>
            <button className="bg-gradient-to-br from-primary to-primary-container text-on-primary-container px-6 py-2.5 rounded-xl text-sm font-bold flex items-center shadow-lg shadow-amber-500/20 active:scale-95 transition-all">
              <span className="material-symbols-outlined mr-2 text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                download
              </span>
              Download Report
            </button>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {statCards.map((card) => (
            <article key={card.label} className="bg-surface-container rounded-xl p-6 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <span className="material-symbols-outlined text-6xl">{card.icon}</span>
              </div>
              <p className="text-slate-400 text-sm font-medium mb-1">{card.label}</p>
              <div className="flex items-end justify-between gap-3">
                <h2 className="text-3xl font-black text-slate-100">{card.value}</h2>
                <span className={`text-xs font-bold flex items-center px-2 py-1 rounded-lg ${card.changeClass}`}>
                  <span className="material-symbols-outlined text-[14px] mr-1">
                    {card.change.startsWith("-") ? "trending_down" : "trending_up"}
                  </span>
                  {card.change}
                </span>
              </div>
            </article>
          ))}
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          <article className="lg:col-span-2 bg-surface-container rounded-xl p-8">
            <div className="flex items-center justify-between mb-8 gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-100 mb-1">Revenue Trend</h2>
                <p className="text-slate-500 text-xs">Daily revenue summary for the last 30 days</p>
              </div>
              <div className="flex bg-surface-container-low p-1 rounded-lg">
                <button className="px-4 py-1.5 text-[10px] font-bold bg-amber-500 text-on-primary-container rounded-md">Daily</button>
                <button className="px-4 py-1.5 text-[10px] font-bold text-slate-400">Weekly</button>
              </div>
            </div>

            <div className="h-80 w-full relative">
              <div className="absolute inset-0 flex items-end space-x-2">
                {[
                  "40%",
                  "65%",
                  "55%",
                  "85%",
                  "70%",
                  "95%",
                  "80%",
                  "60%",
                  "90%",
                  "75%",
                ].map((height, idx) => (
                  <div
                    key={idx}
                    className={`flex-1 bg-gradient-to-t from-amber-500/20 to-amber-500/5 h-[${height}] rounded-t-sm border-t-2 border-amber-500`}
                  />
                ))}
              </div>
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none border-b border-slate-800">
                <div className="border-t border-slate-800/30 w-full h-0" />
                <div className="border-t border-slate-800/30 w-full h-0" />
                <div className="border-t border-slate-800/30 w-full h-0" />
                <div className="border-t border-slate-800/30 w-full h-0" />
              </div>
            </div>

            <div className="flex justify-between mt-4 text-[10px] text-slate-600 font-bold uppercase tracking-widest px-2">
              <span>01 May</span>
              <span>07 May</span>
              <span>14 May</span>
              <span>21 May</span>
              <span>30 May</span>
            </div>
          </article>

          <article className="bg-surface-container rounded-xl p-8 flex flex-col">
            <h2 className="text-xl font-bold text-slate-100 mb-6">Betting Distribution</h2>
            <div className="flex-1 flex flex-col items-center justify-center relative py-6">
              <svg className="w-48 h-48 -rotate-90" viewBox="0 0 192 192">
                <circle cx="96" cy="96" r="80" fill="none" stroke="#181c22" strokeWidth="24" />
                <circle
                  cx="96"
                  cy="96"
                  r="80"
                  fill="none"
                  stroke="#f59e0b"
                  strokeDasharray="502"
                  strokeDashoffset="150"
                  strokeLinecap="round"
                  strokeWidth="24"
                />
                <circle
                  cx="96"
                  cy="96"
                  r="80"
                  fill="none"
                  stroke="#4edea3"
                  strokeDasharray="502"
                  strokeDashoffset="400"
                  strokeLinecap="round"
                  strokeWidth="24"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-black text-slate-100">{betDist.totalValue}</span>
                <span className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">Total Value</span>
              </div>
            </div>

            <div className="space-y-4 mt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-amber-500 mr-3" />
                  <span className="text-sm text-slate-400">Match Winner</span>
                </div>
                <span className="text-sm font-bold text-slate-200">{betDist.matchWinner}%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-secondary mr-3" />
                  <span className="text-sm text-slate-400">Player Fantasy</span>
                </div>
                <span className="text-sm font-bold text-slate-200">{betDist.playerFantasy}%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-slate-700 mr-3" />
                  <span className="text-sm text-slate-400">Others</span>
                </div>
                <span className="text-sm font-bold text-slate-200">{betDist.others}%</span>
              </div>
            </div>
          </article>
        </section>

        <section className="bg-surface-container rounded-xl overflow-hidden mb-10">
          <div className="p-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-white/5">
            <div>
              <h2 className="text-xl font-bold text-slate-100 mb-1">Top Winners Leaderboard</h2>
              <p className="text-slate-500 text-xs">List of the highest winning players this month</p>
            </div>
            <button className="text-amber-500 text-sm font-bold hover:underline text-left sm:text-right">View Details</button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left">
              <thead>
                <tr className="text-slate-500 text-xs font-bold uppercase tracking-wider bg-surface-container-low">
                  <th className="px-8 py-4">Rank</th>
                  <th className="px-8 py-4">Player</th>
                  <th className="px-8 py-4">Total Games</th>
                  <th className="px-8 py-4">Winning Rate</th>
                  <th className="px-8 py-4 text-right">Total Wins</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {leaderboard.map((player) => (
                  <tr key={player.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-8 py-5">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${player.avatarBg}`}>
                        {player.rank}
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-lg mr-3 bg-surface-container-high flex items-center justify-center text-slate-500 text-xs font-bold">
                          {player.name.slice(0, 1)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-200 leading-none">{player.name}</p>
                          <p className="text-xs text-slate-500 mt-1">ID: {player.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-sm text-slate-300">{player.games}</td>
                    <td className="px-8 py-5">
                      <div className="w-24 bg-surface-container-high h-1.5 rounded-full overflow-hidden">
                        <div className={`bg-secondary h-full ${player.bar}`} />
                      </div>
                      <span className="text-[10px] font-bold text-secondary mt-1 inline-block">{player.rate}</span>
                    </td>
                    <td className="px-8 py-5 text-right font-black text-slate-100">{player.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <button className="fixed bottom-10 right-10 bg-amber-500 text-on-primary-container p-4 rounded-full shadow-2xl shadow-amber-500/40 flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50 group">
        <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
          add
        </span>
        <span className="absolute right-full mr-4 bg-slate-900 text-slate-100 px-4 py-2 rounded-xl text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Add New Event
        </span>
      </button>
    </div>
  );
}