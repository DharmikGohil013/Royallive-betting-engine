import { useState } from "react";

const tabs = ["Live", "International", "IPL", "Test Series", "Asia Cup"];

const liveMatches = [
  {
    league: "ICC World Cup Qualifier",
    status: "LIVE",
    time: "Day 2 • 45.3 Overs",
    teamA: { name: "India", short: "IND", score: "287/4" },
    teamB: { name: "Australia", short: "AUS", score: "Yet to bat" },
    odds: { teamA: "1.55", draw: "4.20", teamB: "3.10" },
  },
  {
    league: "IPL 2025",
    status: "LIVE",
    time: "14.2 Overs",
    teamA: { name: "Mumbai Indians", short: "MI", score: "142/3" },
    teamB: { name: "Chennai Super Kings", short: "CSK", score: "168/5" },
    odds: { teamA: "2.40", draw: "–", teamB: "1.65" },
  },
];

const playerSpecials = [
  { name: "V. Kohli", stat: "50+ Runs", odds: "2.10", trending: true },
  { name: "J. Bumrah", stat: "3+ Wickets", odds: "3.50", trending: false },
  { name: "J. Buttler", stat: "30+ Runs", odds: "1.85", trending: true },
  { name: "R. Jadeja", stat: "2+ Wickets", odds: "2.75", trending: false },
];

const marketSpecials = [
  { icon: "monitoring", title: "Total Sixes", desc: "Over/Under 8.5", odds: "1.90" },
  { icon: "sports_cricket", title: "Top Bowler", desc: "Most wickets taker", odds: "3.20" },
  { icon: "emoji_events", title: "Man of Match", desc: "MVP prediction", odds: "5.00" },
  { icon: "trending_up", title: "Run Rate", desc: "Over 7.5 per over", odds: "2.15" },
];

const upcomingMatches = [
  { teamA: "ENG", teamB: "NZ", time: "Tomorrow • 09:30 IST", league: "ICC ODI" },
  { teamA: "PAK", teamB: "SA", time: "Wed • 14:00 IST", league: "T20 Series" },
];

const CricketPage = () => {
  const [activeTab, setActiveTab] = useState("Live");

  return (
    <main className="pt-[120px] pb-32">
      {/* Header Badge */}
      <div className="px-4 py-4 flex items-center justify-between">
        <div>
          <h1 className="font-headline text-2xl font-black tracking-wider uppercase text-on-background">Cricket</h1>
          <p className="text-[10px] text-on-surface-variant uppercase tracking-widest mt-0.5">Live & Upcoming Matches</p>
        </div>
        <div className="flex items-center gap-2 bg-secondary-container/10 border border-secondary-container/30 px-3 py-1.5 rounded-full">
          <span className="w-2 h-2 rounded-full bg-secondary-container animate-pulse" />
          <span className="text-secondary-container text-xs font-bold">{liveMatches.length} LIVE</span>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex overflow-x-auto hide-scrollbar gap-2 px-4 pb-4">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={
              activeTab === tab
                ? "flex-none px-5 py-2 rounded-full border border-[#00F5FF] bg-[#00F5FF]/10 text-[#00F5FF] text-[10px] font-bold uppercase tracking-widest"
                : "flex-none px-5 py-2 rounded-full border border-outline-variant text-on-surface-variant text-[10px] font-bold uppercase tracking-widest hover:bg-[#00F5FF]/5 transition-colors"
            }
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Live Match Cards */}
      <section className="px-4 space-y-4 mb-8">
        {liveMatches.map((match, idx) => (
          <div key={idx} className="glass-card rounded-xl border border-outline-variant/10 overflow-hidden">
            {/* Match Header */}
            <div className="px-4 py-2 bg-surface-container-lowest flex items-center justify-between border-b border-outline-variant/10">
              <span className="text-[10px] text-on-surface-variant uppercase tracking-widest">{match.league}</span>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary-container animate-pulse" />
                <span className="text-secondary-container text-[10px] font-bold">{match.status}</span>
              </div>
            </div>

            {/* Teams */}
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                {/* Team A */}
                <div className="text-center flex-1">
                  <div className="w-12 h-12 mx-auto rounded-lg bg-surface-container-high border border-primary-container/20 flex items-center justify-center mb-2">
                    <span className="font-headline font-black text-primary-container text-sm">{match.teamA.short}</span>
                  </div>
                  <p className="text-xs font-bold">{match.teamA.name}</p>
                  <p className="text-primary-container font-headline font-black text-lg mt-1">{match.teamA.score}</p>
                </div>

                {/* VS */}
                <div className="text-center px-4">
                  <div className="text-tertiary-fixed-dim font-headline font-black text-xs">VS</div>
                  <p className="text-[9px] text-on-surface-variant mt-1">{match.time}</p>
                </div>

                {/* Team B */}
                <div className="text-center flex-1">
                  <div className="w-12 h-12 mx-auto rounded-lg bg-surface-container-high border border-primary-container/20 flex items-center justify-center mb-2">
                    <span className="font-headline font-black text-primary-container text-sm">{match.teamB.short}</span>
                  </div>
                  <p className="text-xs font-bold">{match.teamB.name}</p>
                  <p className="text-primary-container font-headline font-black text-lg mt-1">{match.teamB.score}</p>
                </div>
              </div>

              {/* Odds Row */}
              <div className="grid grid-cols-3 gap-2">
                <button className="py-2 text-center bg-surface-container-high rounded border border-outline-variant/20 hover:border-primary-container/40 transition-colors active:scale-95">
                  <span className="text-[9px] text-on-surface-variant block">1</span>
                  <span className="text-primary-container font-bold text-sm">{match.odds.teamA}</span>
                </button>
                <button className="py-2 text-center bg-surface-container-high rounded border border-outline-variant/20 hover:border-primary-container/40 transition-colors active:scale-95">
                  <span className="text-[9px] text-on-surface-variant block">X</span>
                  <span className="text-primary-container font-bold text-sm">{match.odds.draw}</span>
                </button>
                <button className="py-2 text-center bg-surface-container-high rounded border border-outline-variant/20 hover:border-primary-container/40 transition-colors active:scale-95">
                  <span className="text-[9px] text-on-surface-variant block">2</span>
                  <span className="text-primary-container font-bold text-sm">{match.odds.teamB}</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Player Specials — Horizontal Scroll */}
      <section className="mb-8">
        <div className="px-4 flex justify-between items-center mb-3">
          <h2 className="font-headline text-base font-bold tracking-wider uppercase text-on-background">Player Specials</h2>
          <button className="text-primary-container text-[10px] uppercase tracking-widest font-bold">all →</button>
        </div>
        <div className="flex overflow-x-auto hide-scrollbar gap-3 px-4 pb-2">
          {playerSpecials.map((p) => (
            <div
              key={p.name}
              className="flex-none w-36 glass-card rounded-xl border border-outline-variant/10 p-4 relative overflow-hidden"
            >
              {p.trending && (
                <span className="absolute top-2 right-2 text-[8px] text-tertiary-fixed-dim font-bold uppercase flex items-center gap-0.5">
                  <span className="material-symbols-outlined text-[10px]">trending_up</span>
                  HOT
                </span>
              )}
              <div className="w-10 h-10 rounded-lg bg-surface-container-high border border-primary-container/20 flex items-center justify-center mb-3">
                <span className="material-symbols-outlined text-primary-container text-lg">person</span>
              </div>
              <h3 className="font-headline font-bold text-sm text-on-background">{p.name}</h3>
              <p className="text-[10px] text-on-surface-variant mt-0.5">{p.stat}</p>
              <button className="mt-3 w-full py-1.5 rounded bg-primary-container/10 border border-primary-container/30 text-primary-container text-xs font-bold active:scale-95 transition-transform">
                {p.odds}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Market Specials Grid */}
      <section className="px-4 mb-8">
        <h2 className="font-headline text-base font-bold tracking-wider uppercase text-on-background mb-3">Market Specials</h2>
        <div className="grid grid-cols-2 gap-3">
          {marketSpecials.map((m) => (
            <div
              key={m.title}
              className="glass-card rounded-xl border border-outline-variant/10 p-4 flex flex-col justify-between"
            >
              <div>
                <span className="material-symbols-outlined text-primary-container text-2xl mb-2 block">{m.icon}</span>
                <h3 className="font-headline font-bold text-sm">{m.title}</h3>
                <p className="text-[10px] text-on-surface-variant mt-0.5">{m.desc}</p>
              </div>
              <button className="mt-3 w-full py-1.5 rounded bg-surface-container-high border border-outline-variant/20 text-primary-container text-xs font-bold hover:border-primary-container/40 active:scale-95 transition-all">
                {m.odds}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Upcoming International */}
      <section className="px-4 mb-8">
        <h2 className="font-headline text-base font-bold tracking-wider uppercase text-on-background mb-3">Upcoming</h2>
        <div className="space-y-3">
          {upcomingMatches.map((m, i) => (
            <div
              key={i}
              className="glass-card rounded-lg border border-outline-variant/10 p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded bg-surface-container-high flex items-center justify-center font-headline font-bold text-xs text-primary-container border border-primary-container/20">
                    {m.teamA}
                  </span>
                  <span className="text-[9px] text-on-surface-variant font-bold">vs</span>
                  <span className="w-8 h-8 rounded bg-surface-container-high flex items-center justify-center font-headline font-bold text-xs text-primary-container border border-primary-container/20">
                    {m.teamB}
                  </span>
                </div>
                <div>
                  <p className="text-xs font-bold">{m.league}</p>
                  <p className="text-[10px] text-on-surface-variant">{m.time}</p>
                </div>
              </div>
              <span className="material-symbols-outlined text-primary-container/40 text-xl">chevron_right</span>
            </div>
          ))}
        </div>
      </section>

      {/* Floating Bet Slip */}
      <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-2rem)] max-w-[428px]">
        <button className="w-full py-3 bg-primary-container text-on-primary-container font-headline font-bold text-sm uppercase tracking-widest rounded-xl shadow-[0_0_30px_rgba(0,245,255,0.3)] flex items-center justify-center gap-2 active:scale-95 transition-transform">
          <span className="material-symbols-outlined text-lg">receipt_long</span>
          Bet Slip
          <span className="bg-secondary-container text-on-secondary-container text-[10px] font-black px-2 py-0.5 rounded-full ml-1">0</span>
        </button>
      </div>
    </main>
  );
};

export default CricketPage;
