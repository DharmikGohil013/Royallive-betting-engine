import { useAuth } from "../contexts/AuthContext";

const tiers = [
  {
    name: "MEMBER",
    minBets: 0,
    color: "from-slate-600 to-slate-800",
    border: "border-slate-500/30",
    icon: "person",
    perks: ["Standard Support", "Basic Promotions", "Weekly Bonuses"],
  },
  {
    name: "VIP MEMBER",
    minBets: 20,
    color: "from-blue-600 to-blue-900",
    border: "border-blue-400/30",
    icon: "star",
    perks: ["Priority Support", "Exclusive Promotions", "Daily Bonuses", "Higher Limits"],
  },
  {
    name: "VIP ELITE",
    minBets: 100,
    color: "from-amber-500 to-yellow-700",
    border: "border-amber-400/40",
    icon: "workspace_premium",
    perks: ["24/7 Personal VIP Manager", "VIP Exclusive Rewards", "VIP Payment Channel", "Seasonal Leaderboard", "Custom Limits", "Birthday Bonus"],
  },
];

const privileges = [
  {
    icon: "support_agent",
    title: "24/7 Personal VIP Manager",
    desc: "Dedicated support agent available round the clock for all your needs.",
  },
  {
    icon: "card_giftcard",
    title: "VIP Exclusive Rewards",
    desc: "Unlock premium bonuses, cashback offers, and personalized promotions.",
  },
  {
    icon: "account_balance",
    title: "VIP Payment Channel",
    desc: "Faster deposits and withdrawals through priority payment processing.",
  },
  {
    icon: "leaderboard",
    title: "Seasonal Leaderboard",
    desc: "Compete with fellow VIPs for exclusive seasonal prizes and glory.",
  },
];

const VipPage = () => {
  const { user } = useAuth();
  const totalBets = user?.totalBets || 0;
  const currentTier = totalBets >= 100 ? "VIP ELITE" : totalBets >= 20 ? "VIP MEMBER" : "MEMBER";

  return (
    <div className="pb-28 pt-2">
      {/* Hero */}
      <section className="relative px-4 py-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-transparent to-[#00F5FF]/5" />
        <div className="relative text-center space-y-3">
          <span
            className="material-symbols-outlined text-5xl text-amber-400 drop-shadow-[0_0_20px_rgba(251,191,36,0.4)]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            workspace_premium
          </span>
          <h1 className="font-headline font-black text-2xl text-on-surface tracking-wide">
            VIP <span className="text-amber-400">CLUB</span>
          </h1>
          <p className="text-on-surface-variant text-sm max-w-xs mx-auto leading-relaxed">
            Elevate your gaming experience with exclusive privileges, personalized rewards, and premium support.
          </p>
          {user && (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-container border border-amber-400/20 mt-2">
              <span className="material-symbols-outlined text-base text-amber-400" style={{ fontVariationSettings: "'FILL' 1" }}>
                {currentTier === "VIP ELITE" ? "workspace_premium" : currentTier === "VIP MEMBER" ? "star" : "person"}
              </span>
              <span className="text-xs font-bold text-amber-400 tracking-wider">{currentTier}</span>
            </div>
          )}
        </div>
      </section>

      {/* VIP Tiers */}
      <section className="px-4 py-6 space-y-4">
        <h2 className="font-headline font-bold text-base text-on-surface tracking-wide uppercase flex items-center gap-2">
          <span className="material-symbols-outlined text-amber-400 text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
            military_tech
          </span>
          VIP Tiers
        </h2>
        <div className="space-y-3">
          {tiers.map((tier) => {
            const isActive = currentTier === tier.name;
            return (
              <div
                key={tier.name}
                className={`relative rounded-xl p-4 border bg-gradient-to-r ${tier.color} ${tier.border} ${
                  isActive ? "ring-2 ring-amber-400/50 shadow-lg shadow-amber-400/10" : "opacity-70"
                }`}
              >
                {isActive && (
                  <div className="absolute -top-2 right-3 bg-amber-400 text-black text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Current
                  </div>
                )}
                <div className="flex items-start gap-3">
                  <span
                    className="material-symbols-outlined text-2xl text-white/90"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    {tier.icon}
                  </span>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-headline font-bold text-sm text-white tracking-wider">{tier.name}</h3>
                    <p className="text-[10px] text-white/50 mt-0.5">
                      {tier.minBets === 0 ? "Starting tier" : `${tier.minBets}+ total bets`}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {tier.perks.map((perk) => (
                        <span
                          key={perk}
                          className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-white/10 text-white/80 uppercase tracking-wider"
                        >
                          {perk}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* VIP Privileges */}
      <section className="px-4 py-6 space-y-4">
        <h2 className="font-headline font-bold text-base text-on-surface tracking-wide uppercase flex items-center gap-2">
          <span className="material-symbols-outlined text-[#00F5FF] text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
            diamond
          </span>
          VIP Privileges
        </h2>
        <div className="grid grid-cols-1 gap-3">
          {privileges.map((p) => (
            <div
              key={p.title}
              className="bg-surface-container rounded-xl p-4 border border-[#00F5FF]/10 hover:border-[#00F5FF]/20 transition-all flex items-start gap-3"
            >
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500/20 to-[#00F5FF]/10 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-lg text-amber-400" style={{ fontVariationSettings: "'FILL' 1" }}>
                  {p.icon}
                </span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-on-surface">{p.title}</h3>
                <p className="text-xs text-on-surface-variant/70 mt-1 leading-relaxed">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Progress */}
      {user && currentTier !== "VIP ELITE" && (
        <section className="px-4 py-6">
          <div className="bg-surface-container rounded-xl p-5 border border-amber-400/10 space-y-3">
            <h3 className="font-headline font-bold text-sm text-on-surface">Your Progress</h3>
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-on-surface-variant">Total Bets</span>
                <span className="font-bold text-amber-400">{totalBets}</span>
              </div>
              <div className="w-full h-2 rounded-full bg-surface-container-high overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-amber-500 to-[#00F5FF] transition-all duration-500"
                  style={{
                    width: `${Math.min((totalBets / (currentTier === "MEMBER" ? 20 : 100)) * 100, 100)}%`,
                  }}
                />
              </div>
              <p className="text-[10px] text-on-surface-variant/50">
                {currentTier === "MEMBER"
                  ? `${Math.max(20 - totalBets, 0)} more bets to VIP MEMBER`
                  : `${Math.max(100 - totalBets, 0)} more bets to VIP ELITE`}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      {!user && (
        <section className="px-4 py-6">
          <a
            href="/login"
            className="block w-full text-center py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-headline font-bold text-sm uppercase tracking-wider hover:shadow-lg hover:shadow-amber-500/20 transition-all active:scale-[0.98]"
          >
            Join Now & Start Your VIP Journey
          </a>
        </section>
      )}
    </div>
  );
};

export default VipPage;
