const sections = [
  {
    num: "01",
    color: "primary-container",
    title: "Data Collection",
    content: (
      <>
        <p className="mb-4">Our systems collect specific data to optimize your experience. This includes:</p>
        <ul className="grid grid-cols-2 gap-3">
          {[
            { icon: "fingerprint", label: "Biometric Signatures" },
            { icon: "location_on", label: "Geolocation Flux" },
            { icon: "payments", label: "Transaction Logs" },
            { icon: "devices", label: "Terminal Metadata" },
          ].map((item) => (
            <li key={item.label} className="flex items-center gap-2 bg-surface-container-lowest p-3 border border-outline-variant/10">
              <span className="material-symbols-outlined text-primary-container text-sm">{item.icon}</span>
              <span className="text-[10px] uppercase font-semibold">{item.label}</span>
            </li>
          ))}
        </ul>
      </>
    ),
  },
  {
    num: "02",
    color: "tertiary-fixed-dim",
    title: "Operational Usage",
    content: (
      <>
        <p className="mb-4">Data utilization is strictly confined to algorithmic enhancements and risk mitigation protocols.</p>
        <div className="space-y-3">
          <div className="p-3 bg-surface-container-low border-l border-tertiary-fixed-dim/30">
            <strong className="text-tertiary-fixed-dim uppercase text-[10px] block mb-1 tracking-tighter">Integrity Check</strong>
            <p className="text-xs">Identify non-human betting patterns and prevent illicit synchronization between external nodes.</p>
          </div>
          <div className="p-3 bg-surface-container-low border-l border-tertiary-fixed-dim/30">
            <strong className="text-tertiary-fixed-dim uppercase text-[10px] block mb-1 tracking-tighter">Kinetic Personalization</strong>
            <p className="text-xs">Dynamic UI adaptation based on your most frequent sportsbook destinations and market preferences.</p>
          </div>
        </div>
      </>
    ),
  },
  {
    num: "03",
    color: "primary-container",
    title: "Quantum Cookies",
    content: (
      <p>We use session-based tracking beacons to maintain terminal stability. Disabling these may lead to synchronization errors.</p>
    ),
  },
  {
    num: "04",
    color: "tertiary-fixed-dim",
    title: "External Nodes",
    content: (
      <p>Your data is never traded on open markets. We only transmit encrypted hashes to verified regulatory nodes and liquidity providers.</p>
    ),
  },
  {
    num: "05",
    color: "primary-container",
    title: "Fortress Protocols",
    content: (
      <>
        <p className="mb-4">Security is implemented via multi-layered AES-512 encryption. In the event of a terminal compromise, all active sessions are immediately terminated.</p>
        <div className="grid grid-cols-3 gap-2">
          <div className="h-1 bg-primary-container/20" />
          <div className="h-1 bg-primary-container/60" />
          <div className="h-1 bg-primary-container/20" />
        </div>
      </>
    ),
  },
];

const PrivacyPolicyPage = () => {
  return (
    <main className="pt-20 pb-32 px-4 max-w-4xl mx-auto">
      {/* Intro Banner */}
      <header className="relative mb-8 p-6 glass-card border border-outline-variant/20 rounded-xl overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-container/5 rounded-full blur-[80px] -mr-32 -mt-32" />
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-16 h-16 flex items-center justify-center bg-surface-container-high rounded-lg border border-primary-container/30 shadow-[0_0_30px_-5px_rgba(0,245,255,0.2)]">
            <span className="material-symbols-outlined text-3xl text-primary-container" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
          </div>
          <div>
            <h2 className="font-headline font-black text-2xl text-on-background uppercase tracking-tight mb-1">
              Your privacy is our <span className="text-primary-container">priority</span>
            </h2>
            <p className="text-on-surface-variant text-xs font-light leading-relaxed">
              Review how we safeguard your digital signature and data streams.
            </p>
          </div>
        </div>
      </header>

      {/* Section Chips */}
      <div className="flex overflow-x-auto gap-2 pb-4 mb-6 hide-scrollbar">
        {["Data Collection", "Cookies", "Third Parties", "Security", "User Rights"].map((chip, i) => (
          <button
            key={chip}
            className={`whitespace-nowrap px-4 py-2 text-[10px] font-bold uppercase tracking-widest border rounded-sm ${
              i === 0
                ? "bg-primary-container text-on-primary-container border-primary-container/50"
                : "bg-surface-container-high text-on-surface-variant border-outline-variant/30 hover:border-primary-container/50 transition-colors"
            }`}
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Content Sections */}
      <div className="space-y-4">
        {sections.map((s) => (
          <section
            key={s.num}
            className={`glass-card border-l-4 border-l-${s.color} border-y border-r border-outline-variant/10 p-6 rounded-r-xl relative`}
          >
            <span className={`absolute top-3 right-4 font-headline font-black text-4xl opacity-5 text-${s.color} select-none`}>{s.num}</span>
            <div className="flex items-start gap-3 mb-4">
              <div className={`mt-1 w-2 h-6 bg-${s.color}`} />
              <h3 className={`font-headline font-bold text-lg text-${s.color} uppercase tracking-widest`}>{s.title}</h3>
            </div>
            <div className="text-on-surface-variant leading-relaxed font-light text-sm">
              {s.content}
            </div>
          </section>
        ))}
      </div>

      {/* Decorative */}
      <div className="mt-12 flex justify-center opacity-20">
        <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-[#00F5FF] to-transparent" />
        <div className="mx-4 transform rotate-45 border border-[#00F5FF] w-2 h-2" />
        <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-[#00F5FF] to-transparent" />
      </div>

      {/* Bottom Acceptance */}
      <div className="mt-8 p-4 border-t border-[#00F5FF]/10 flex flex-col items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary-container text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
          <p className="text-[10px] uppercase font-semibold tracking-tighter text-on-surface-variant">
            By continuing, you acknowledge our data handling standards.
          </p>
        </div>
        <button className="w-full px-10 py-3 bg-primary-container text-on-primary-container font-headline font-black text-sm uppercase tracking-widest active:scale-95 transition-all shadow-[0_0_20px_-5px_rgba(0,245,255,0.4)]">
          I Understand
        </button>
      </div>
    </main>
  );
};

export default PrivacyPolicyPage;
