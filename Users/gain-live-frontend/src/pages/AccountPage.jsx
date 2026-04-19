import { Link } from "react-router-dom";

const AccountPage = () => {
  return (
    <main className="pt-16 pb-24 overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative h-[420px] flex flex-col items-center justify-center text-center px-6 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-surface/80 to-surface" />
          <div className="w-full h-full bg-gradient-to-br from-[#00F5FF]/10 via-transparent to-[#E00363]/10" />
        </div>
        <div className="relative z-10 space-y-6">
          <h2 className="font-headline text-5xl font-black tracking-widest text-primary-container drop-shadow-[0_0_15px_rgba(0,245,255,0.5)] uppercase">
            GAIN LIVE
          </h2>
          <p className="font-headline text-xl text-tertiary-fixed-dim uppercase tracking-[0.2em] font-medium">
            Where Skill Meets Thrill
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-4">
            <div className="bg-surface-container-high/40 border border-primary-container/20 px-4 py-2 rounded-full backdrop-blur-md flex items-center gap-2">
              <span className="text-primary-container font-bold">15+</span>
              <span className="text-xs uppercase tracking-wider text-on-surface-variant">Countries</span>
            </div>
            <div className="bg-surface-container-high/40 border border-primary-container/20 px-4 py-2 rounded-full backdrop-blur-md flex items-center gap-2">
              <span className="text-primary-container font-bold">2M+</span>
              <span className="text-xs uppercase tracking-wider text-on-surface-variant">Players</span>
            </div>
            <div className="bg-surface-container-high/40 border border-primary-container/20 px-4 py-2 rounded-full backdrop-blur-md flex items-center gap-2">
              <span className="text-primary-container font-bold">500K+</span>
              <span className="text-xs uppercase tracking-wider text-on-surface-variant">Daily Bets</span>
            </div>
          </div>
        </div>
      </section>

      <div className="px-6 -mt-10 relative z-20 space-y-12">
        {/* Who We Are */}
        <section className="glass-card neon-glow-border p-6 rounded-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary-container/5 rounded-full blur-3xl" />
          <div className="space-y-4">
            <h3 className="font-headline text-2xl font-bold text-primary-container uppercase tracking-tight">WHO WE ARE</h3>
            <p className="text-on-surface-variant leading-relaxed text-sm">
              Born in the heart of the digital frontier, Gain Live is a next-generation gaming ecosystem designed for the hyper-connected era. We bridge the gap between AAA gaming aesthetics and high-stakes sportsbook precision.
            </p>
            <p className="text-on-surface-variant leading-relaxed text-sm">
              Our platform isn&apos;t just a place to play; it&apos;s a &quot;Heads-Up Display&quot; for the modern competitor, engineered to provide lightning-fast data, immersive visuals, and an uncompromising commitment to fairness.
            </p>
          </div>
        </section>

        {/* Mission */}
        <section className="text-center space-y-4 py-4">
          <h3 className="font-headline text-2xl font-bold text-tertiary-fixed-dim uppercase tracking-[0.1em]">OUR MISSION</h3>
          <p className="text-lg font-light text-on-surface italic leading-snug">
            &quot;To redefine the architecture of thrill through technological excellence, providing every player with the ultimate tactical advantage in the digital arena.&quot;
          </p>
        </section>

        {/* Why Choose Us */}
        <section className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="h-[2px] w-12 bg-primary-container" />
            <h3 className="font-headline text-xl font-bold text-on-surface uppercase tracking-widest">WHY CHOOSE US</h3>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {features.map((f, i) => (
              <div key={i} className="p-4 border-l-2 border-primary-container group hover:bg-surface-container-high transition-colors bg-surface-container-low">
                <span className="material-symbols-outlined text-primary-container text-3xl mb-3 group-hover:scale-110 transition-transform block">{f.icon}</span>
                <h4 className="font-headline text-base font-bold mb-1 uppercase">{f.title}</h4>
                <p className="text-on-surface-variant text-xs">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Contact Strip */}
        <section className="pb-8">
          <div className="rounded-lg border-t border-primary-container/10">
            <div className="flex flex-col divide-y divide-outline-variant/20">
              {[
                { icon: "forum", label: "Live Chat", href: "/help" },
                { icon: "mail", label: "Email Support", href: "mailto:gainlive@royallive.live" },
                { icon: "call", label: "Priority Line", href: "/help" },
              ].map((c) => (
                <a key={c.label} href={c.href} className="py-5 flex items-center justify-center gap-3 hover:bg-primary-container/5 transition-colors group">
                  <span className="material-symbols-outlined text-primary-container group-hover:scale-110 transition-transform">{c.icon}</span>
                  <span className="text-xs font-bold uppercase tracking-widest">{c.label}</span>
                  {c.href.startsWith("mailto:") && (
                    <span className="text-[10px] text-on-surface-variant">gainlive@royallive.live</span>
                  )}
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Privacy link */}
        <div className="pb-4 text-center">
          <Link to="/privacy" className="text-xs text-on-surface-variant underline uppercase tracking-widest hover:text-primary-container transition-colors">
            Privacy Policy
          </Link>
        </div>
      </div>
    </main>
  );
};

const features = [
  { icon: "shield", title: "Bank-Level Security", desc: "Quantum-encrypted transactions and multi-layer biometric authentication protocols." },
  { icon: "bolt", title: "Instant Withdrawals", desc: "Automated liquidity pools ensure your winnings are in your wallet in sub-second timeframes." },
  { icon: "monitoring", title: "Live HUD Stats", desc: "Real-time data telemetry fed directly to your dashboard for informed decision making." },
  { icon: "diamond", title: "VIP Tier Rewards", desc: "Exclusive access to high-volatility events and personalized account architects." },
  { icon: "support_agent", title: "24/7 Ops Center", desc: "Human experts and advanced AI agents standing by to resolve any operational friction." },
  { icon: "public", title: "Global Ecosystem", desc: "A unified network connecting players across continents in a single, fluid experience." },
];

export default AccountPage;
