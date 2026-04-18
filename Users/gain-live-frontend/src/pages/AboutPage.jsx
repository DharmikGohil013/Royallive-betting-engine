const AboutPage = () => {
  return (
    <main className="pt-20 pb-32 px-4">
      <header className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <img
            src="/logos/gain-live-logo-blue-w-5.png"
            alt="Gain Live"
            className="h-16 w-auto object-contain"
          />
        </div>
        <h1 className="font-headline font-black text-2xl uppercase tracking-tight">
          About <span className="text-primary-container">Gain Live</span>
        </h1>
        <p className="text-on-surface-variant text-xs mt-2 leading-relaxed">
          The next generation of premium gaming and sportsbook experiences.
        </p>
      </header>

      <div className="space-y-6">
        {/* Mission */}
        <section className="bg-surface-container border border-outline-variant/10 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="material-symbols-outlined text-primary-container text-lg">rocket_launch</span>
            <h3 className="font-headline font-bold text-sm uppercase tracking-widest text-primary-container">Our Mission</h3>
          </div>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            Gain Live is committed to providing a secure, transparent, and entertaining gaming platform. We believe
            in fair play, responsible gaming, and delivering an exceptional experience for every user.
          </p>
        </section>

        {/* What We Offer */}
        <section className="bg-surface-container border border-outline-variant/10 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="material-symbols-outlined text-primary-container text-lg">category</span>
            <h3 className="font-headline font-bold text-sm uppercase tracking-widest text-primary-container">What We Offer</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: "casino", label: "Live Casino", desc: "Real-time dealer games" },
              { icon: "sports_cricket", label: "Cricket Betting", desc: "Live matches & odds" },
              { icon: "sports_esports", label: "Esports", desc: "Competitive gaming bets" },
              { icon: "style", label: "Card Games", desc: "Poker, Blackjack & more" },
            ].map((item) => (
              <div key={item.label} className="bg-surface-container-high rounded-lg p-3">
                <span className="material-symbols-outlined text-primary-container text-xl mb-1 block">{item.icon}</span>
                <p className="text-xs font-bold text-on-surface">{item.label}</p>
                <p className="text-[10px] text-on-surface-variant">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Security */}
        <section className="bg-surface-container border border-outline-variant/10 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="material-symbols-outlined text-primary-container text-lg">shield</span>
            <h3 className="font-headline font-bold text-sm uppercase tracking-widest text-primary-container">Security & Trust</h3>
          </div>
          <p className="text-xs text-on-surface-variant leading-relaxed mb-3">
            Your security is our top priority. We use industry-standard encryption and follow strict regulatory
            guidelines to ensure your data and funds are always safe.
          </p>
          <div className="flex gap-2">
            {["verified_user", "lock", "encrypted"].map((icon) => (
              <div key={icon} className="w-10 h-10 bg-primary-container/10 rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined text-primary-container text-sm">{icon}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Contact */}
        <section className="bg-surface-container border border-outline-variant/10 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="material-symbols-outlined text-primary-container text-lg">mail</span>
            <h3 className="font-headline font-bold text-sm uppercase tracking-widest text-primary-container">Contact Us</h3>
          </div>
          <div className="space-y-2">
            <p className="text-xs text-on-surface-variant flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">email</span>
              support@gainlive.com
            </p>
            <p className="text-xs text-on-surface-variant flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">schedule</span>
              24/7 Live Support Available
            </p>
          </div>
        </section>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center">
        <p className="text-[10px] text-on-surface-variant uppercase tracking-widest">
          © 2026 Gain Live Systems. All Rights Reserved.
        </p>
      </div>
    </main>
  );
};

export default AboutPage;
