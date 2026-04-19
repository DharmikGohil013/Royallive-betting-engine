import { useState } from "react";

const categories = ["All Games", "Live Roulette", "Live Blackjack", "Game Shows"];

const featuredTables = [
  { title: "Lightning Roulette", dealer: "Dealer: Sophia", seats: "3/7 seats", img: null, badge: "HOT" },
  { title: "Immersive Roulette", dealer: "Dealer: Marco", seats: "5/7 seats", img: null, badge: "" },
  { title: "VIP Blackjack", dealer: "Dealer: Elena", seats: "2/5 seats", img: null, badge: "VIP" },
  { title: "Speed Baccarat", dealer: "Dealer: Raj", seats: "6/7 seats", img: null, badge: "" },
];

const recommendedGames = [
  { title: "Mega Roulette", tag: "LIVE", players: "1,203" },
  { title: "Blackjack Party", tag: "LIVE", players: "892" },
  { title: "Dream Catcher", tag: "HOT", players: "2,104" },
  { title: "Crazy Time", tag: "LIVE", players: "4,512" },
  { title: "Deal or No Deal", tag: "", players: "648" },
  { title: "Monopoly Live", tag: "HOT", players: "3,201" },
];

const LiveCasinoPage = () => {
  const [activeCategory, setActiveCategory] = useState("All Games");

  return (
    <main className="pt-24 pb-32">
      {/* Cinematic Hero Banner */}
      <section className="relative h-[220px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0e] via-[#0d1117]/90 to-surface-dim" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,245,255,0.08)_0%,transparent_70%)]" />
        {/* Decorative grid */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(rgba(0,245,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,245,255,0.3) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
          <div className="mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-secondary-container animate-pulse" />
            <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-secondary-container">Live Now</span>
          </div>
          <h1 className="font-headline text-4xl font-black tracking-widest text-on-background uppercase drop-shadow-[0_0_15px_rgba(0,245,255,0.4)]">
            Live Casino
          </h1>
          <p className="mt-2 text-xs text-on-surface-variant tracking-widest uppercase">
            Immersive tables • Real dealers • Real time
          </p>
          <div className="mt-4 flex items-center gap-6">
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-primary-container text-sm">groups</span>
              <span className="text-xs text-primary-container font-medium">8,421 playing</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-tertiary-fixed-dim text-sm">table_restaurant</span>
              <span className="text-xs text-tertiary-fixed-dim font-medium">124 tables</span>
            </div>
          </div>
        </div>
      </section>

      {/* Category Tabs */}
      <section className="px-4 mt-6 mb-6">
        <div className="flex overflow-x-auto hide-scrollbar gap-2 pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={
                activeCategory === cat
                  ? "flex-none px-5 py-2 rounded-full border border-[#00F5FF] bg-[#00F5FF]/10 text-[#00F5FF] text-[10px] font-bold uppercase tracking-widest"
                  : "flex-none px-5 py-2 rounded-full border border-outline-variant text-on-surface-variant text-[10px] font-bold uppercase tracking-widest hover:bg-[#00F5FF]/5 transition-colors"
              }
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Featured Tables — Horizontal Scroll */}
      <section className="mb-8">
        <div className="px-4 flex justify-between items-center mb-4">
          <h2 className="font-headline text-lg font-bold tracking-wider uppercase text-on-background">Featured Tables</h2>
          <button className="text-primary-container text-[10px] uppercase tracking-widest font-bold">see all →</button>
        </div>
        <div className="flex overflow-x-auto hide-scrollbar gap-3 px-4 pb-2">
          {featuredTables.map((table) => (
            <div
              key={table.title}
              className="flex-none w-52 glass-card border border-outline-variant/10 rounded-xl overflow-hidden group"
            >
              <div className="relative h-28 bg-gradient-to-br from-surface-container-high to-surface-container-lowest">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="material-symbols-outlined text-5xl text-primary-container/20">casino</span>
                </div>
                {table.badge && (
                  <span
                    className={`absolute top-2 left-2 text-[9px] font-black uppercase px-2 py-0.5 rounded ${
                      table.badge === "VIP"
                        ? "bg-tertiary-fixed-dim text-on-tertiary-fixed"
                        : "bg-secondary-container text-on-secondary-container"
                    }`}
                  >
                    {table.badge}
                  </span>
                )}
                {/* Play Overlay */}
                <div className="absolute inset-0 bg-[#00F5FF]/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-12 h-12 rounded-full bg-[#00F5FF]/20 flex items-center justify-center border border-[#00F5FF]/40">
                    <span className="material-symbols-outlined text-[#00F5FF] text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
                  </div>
                </div>
              </div>
              <div className="p-3">
                <h3 className="font-headline font-bold text-sm tracking-tight text-on-background">{table.title}</h3>
                <p className="text-[10px] text-on-surface-variant mt-1">{table.dealer}</p>
                <div className="flex items-center gap-1 mt-2">
                  <span className="material-symbols-outlined text-primary-container text-xs">event_seat</span>
                  <span className="text-[10px] text-primary-container font-medium">{table.seats}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recommended Games Grid */}
      <section className="px-4">
        <h2 className="font-headline text-lg font-bold tracking-wider uppercase text-on-background mb-4">Recommended</h2>
        <div className="grid grid-cols-2 gap-3">
          {recommendedGames.map((game) => (
            <button
              key={game.title}
              className="glass-card rounded-xl border border-outline-variant/10 overflow-hidden group text-left active:scale-95 transition-transform"
            >
              <div className="relative h-24 bg-gradient-to-br from-surface-container-high to-surface-container-lowest flex items-center justify-center">
                <span className="material-symbols-outlined text-4xl text-primary-container/15">playing_cards</span>
                {game.tag && (
                  <span
                    className={`absolute top-2 left-2 text-[8px] font-black uppercase px-1.5 py-0.5 rounded ${
                      game.tag === "HOT"
                        ? "bg-secondary-container text-on-secondary-container"
                        : "bg-primary-container/20 text-primary-container border border-primary-container/30"
                    }`}
                  >
                    {game.tag}
                  </span>
                )}
              </div>
              <div className="p-3">
                <h3 className="font-headline font-bold text-xs tracking-tight">{game.title}</h3>
                <div className="flex items-center gap-1 mt-1">
                  <span className="material-symbols-outlined text-primary-container text-[10px]">groups</span>
                  <span className="text-[9px] text-on-surface-variant">{game.players} playing</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>
    </main>
  );
};

export default LiveCasinoPage;
