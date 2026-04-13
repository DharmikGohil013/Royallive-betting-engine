import { useState } from "react";

const sportTabs = [
  { icon: "sports_soccer", label: "Football" },
  { icon: "sports_cricket", label: "Cricket" },
  { icon: "sports_basketball", label: "Basketball" },
  { icon: "sports_tennis", label: "Tennis" },
];

const liveMatches = [
  {
    league: "Premier League",
    time: "78:14",
    teamA: { name: "Manchester City", short: "MC", score: "2" },
    teamB: { name: "Arsenal FC", short: "AR", score: "1" },
    odds: ["1.45", "4.20", "8.50"],
  },
  {
    league: "La Liga",
    time: "12:05",
    teamA: { name: "Real Madrid", short: "RM", score: "0" },
    teamB: { name: "FC Barcelona", short: "FC", score: "0" },
    odds: ["2.10", "3.40", "3.10"],
  },
];

const SportsPage = () => {
  const [activeSport, setActiveSport] = useState("Football");

  return (
    <main className="pt-16 pb-32">
      {/* Live Score Ticker */}
      <div className="w-full bg-surface-container-lowest overflow-x-auto hide-scrollbar py-2 border-b border-outline-variant/10">
        <div className="flex items-center gap-6 px-4 whitespace-nowrap">
          <div className="flex items-center gap-2 text-[10px] font-mono tracking-tighter">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary-container animate-pulse" />
            <span className="text-secondary">LIVE: MNC 2 - 1 ARS (78&apos;)</span>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-mono tracking-tighter opacity-60">
            <span className="text-on-surface">RMD 0 - 0 BAR (12&apos;)</span>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-mono tracking-tighter opacity-60">
            <span className="text-on-surface">LAL 102 - 98 GSW (Q4)</span>
          </div>
        </div>
      </div>

      {/* Sport Category Tabs */}
      <section className="mt-4 px-4">
        <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2">
          {sportTabs.map((tab) => (
            <button
              key={tab.label}
              onClick={() => setActiveSport(tab.label)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                activeSport === tab.label
                  ? "bg-primary-container text-on-primary-container shadow-[0_0_12px_rgba(0,245,255,0.4)]"
                  : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
              }`}
            >
              <span className="material-symbols-outlined text-sm">{tab.icon}</span>
              <span className="text-xs font-headline font-bold tracking-wide uppercase">{tab.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Live Matches */}
      <section className="mt-6 px-4 space-y-4">
        <div className="flex justify-between items-end mb-2">
          <h2 className="font-headline text-lg font-bold tracking-tight text-primary uppercase italic">In-Play Now</h2>
          <span className="text-[10px] font-label text-outline uppercase tracking-widest">24 Events</span>
        </div>

        {liveMatches.map((match, i) => (
          <div key={i} className="bg-surface-container-low rounded-lg p-4 relative overflow-hidden group border border-outline-variant/10">
            {i === 0 && <div className="absolute top-0 right-0 w-32 h-32 bg-primary-container/5 blur-3xl rounded-full -mr-16 -mt-16" />}
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2 text-[10px] font-bold text-secondary uppercase tracking-widest">
                <span className="w-1 h-1 rounded-full bg-secondary" />
                {match.league}
              </div>
              <div className="text-[10px] font-mono text-on-surface-variant bg-surface-container-highest px-2 py-0.5 rounded-sm">{match.time}</div>
            </div>
            <div className="grid grid-cols-12 gap-4 items-center">
              <div className="col-span-8 space-y-3">
                {[match.teamA, match.teamB].map((team, ti) => (
                  <div key={ti} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-surface-container-highest rounded-full flex items-center justify-center text-[8px] font-bold">
                        {team.short}
                      </div>
                      <span className="font-headline font-medium text-sm">{team.name}</span>
                    </div>
                    <span className="font-mono font-bold text-primary">{team.score}</span>
                  </div>
                ))}
              </div>
              <div className="col-span-4 flex flex-col gap-2">
                <div className="text-[10px] text-center text-outline-variant font-bold uppercase tracking-tighter">1 X 2</div>
                <div className="grid grid-cols-1 gap-1">
                  {match.odds.map((odd, oi) => (
                    <button key={oi} className="bg-surface-container-high py-2 rounded-sm text-[11px] font-bold hover:bg-primary-container hover:text-on-primary-container transition-colors border border-outline-variant/5">
                      {odd}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Featured Banner */}
        <div className="w-full h-32 rounded-lg bg-[linear-gradient(135deg,#00F5FF_0%,#E00363_100%)] p-4 flex flex-col justify-end relative overflow-hidden">
          <div className="absolute top-0 right-0 w-full h-full bg-black/40" />
          <div className="relative z-10">
            <div className="text-[10px] font-bold uppercase tracking-widest text-primary mb-1">Weekly Challenge</div>
            <h3 className="font-headline text-xl font-black text-white leading-tight">
              WIN UP TO $50,000<br />ON MULTIBETS
            </h3>
          </div>
        </div>
      </section>

      {/* Floating Bet Slip */}
      <div className="fixed bottom-20 left-4 right-4 z-[55] md:left-[calc(50%-214px)] md:right-[calc(50%-214px)]">
        <div className="glass-card border border-[#00F5FF]/30 rounded-lg p-4 shadow-[0_-10px_30px_rgba(0,245,255,0.15)] flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-primary-container text-on-primary-container w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">2</div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Bet Slip</span>
              <span className="text-xs font-mono">Odds: 6.24</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className="text-[10px] block opacity-60 uppercase">Potential Payout</span>
              <span className="text-sm font-bold text-tertiary-fixed-dim">$624.00</span>
            </div>
            <span className="material-symbols-outlined text-primary">keyboard_arrow_up</span>
          </div>
        </div>
      </div>
    </main>
  );
};

export default SportsPage;
