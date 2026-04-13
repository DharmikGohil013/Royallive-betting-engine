const WalletPage = () => {
  return (
    <main className="pt-20 pb-28 px-4 max-w-md mx-auto space-y-6">
      {/* User Identity & Wallet Card */}
      <section className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-container to-secondary-container rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-1000" />
        <div className="relative glass-card rounded-xl p-5 overflow-hidden">
          {/* Profile Row */}
          <div className="flex items-center gap-4 mb-6">
            <div className="relative">
              <div className="w-16 h-16 rounded-lg overflow-hidden border-2 border-primary-container/30">
                <div className="w-full h-full bg-surface-container-high flex items-center justify-center">
                  <span className="material-symbols-outlined text-[#00F5FF] text-2xl">person</span>
                </div>
              </div>
              <div className="absolute -bottom-2 -right-2 bg-tertiary-fixed-dim text-on-tertiary-fixed text-[10px] font-black px-2 py-0.5 rounded-full border border-background shadow-lg">
                LVL 4
              </div>
            </div>
            <div className="flex-1">
              <h2 className="font-headline font-extrabold text-lg text-primary-container tracking-tight">CYBER_PUNK_88</h2>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="material-symbols-outlined text-tertiary-fixed-dim text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>military_tech</span>
                <span className="text-xs font-label uppercase tracking-widest text-on-surface-variant">VIP ELITE MEMBER</span>
              </div>
            </div>
          </div>

          {/* Wallet */}
          <div className="bg-surface-container-lowest/50 rounded-lg p-4 border-l-4 border-primary-container">
            <div className="flex justify-between items-end">
              <div>
                <p className="text-[10px] font-label uppercase tracking-[0.2em] text-on-surface-variant mb-1">Available Credits</p>
                <p className="text-3xl font-headline font-black text-primary-container tracking-tighter">$12,450.00</p>
              </div>
              <div className="flex gap-2 pb-1">
                <button className="p-2 bg-primary-container/10 text-primary-container rounded border border-primary-container/20 active:scale-90 transition-all">
                  <span className="material-symbols-outlined text-xl">add</span>
                </button>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-3 mt-4">
            <button className="flex items-center justify-center gap-2 py-3 bg-primary-container text-on-primary font-headline font-bold text-xs uppercase tracking-widest rounded-lg shadow-[0_0_15px_rgba(0,245,255,0.3)] active:scale-95 transition-transform">
              <span className="material-symbols-outlined text-sm">payments</span>
              DEPOSIT
            </button>
            <button className="flex items-center justify-center gap-2 py-3 bg-surface-container-high text-on-surface font-headline font-bold text-xs uppercase tracking-widest rounded-lg border border-outline-variant active:scale-95 transition-transform">
              <span className="material-symbols-outlined text-sm">account_balance_wallet</span>
              WITHDRAW
            </button>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <nav className="flex border-b border-outline-variant/30 overflow-x-auto hide-scrollbar">
        <button className="px-5 py-3 text-primary-container border-b-2 border-primary-container font-headline font-bold text-xs uppercase tracking-widest whitespace-nowrap">Overview</button>
        <button className="px-5 py-3 text-on-surface-variant/60 font-headline font-bold text-xs uppercase tracking-widest whitespace-nowrap">History</button>
        <button className="px-5 py-3 text-on-surface-variant/60 font-headline font-bold text-xs uppercase tracking-widest whitespace-nowrap">Bonuses</button>
        <button className="px-5 py-3 text-on-surface-variant/60 font-headline font-bold text-xs uppercase tracking-widest whitespace-nowrap">Referrals</button>
      </nav>

      {/* Stats */}
      <section className="grid grid-cols-2 gap-3">
        <div className="col-span-2 glass-card rounded-lg p-4 flex justify-between items-center">
          <div>
            <p className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant">Win Rate</p>
            <p className="text-2xl font-headline font-bold text-tertiary-fixed-dim">68.4%</p>
          </div>
          <div className="w-24 h-1 bg-surface-container-highest rounded-full overflow-hidden">
            <div className="h-full bg-tertiary-fixed-dim shadow-[0_0_8px_rgba(255,184,0,0.5)]" style={{ width: "68.4%" }} />
          </div>
        </div>
        <div className="glass-card rounded-lg p-4">
          <p className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant">Total Deposited</p>
          <p className="text-xl font-headline font-bold text-on-surface mt-1">$45,200</p>
        </div>
        <div className="glass-card rounded-lg p-4">
          <p className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant">Total Won</p>
          <p className="text-xl font-headline font-bold text-primary-container mt-1">$82,940</p>
        </div>
      </section>

      {/* Active Bets */}
      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-headline font-extrabold text-sm uppercase tracking-[0.15em] text-primary-container">Active Bets</h3>
          <span className="text-[10px] font-label font-medium bg-surface-container-highest px-2 py-0.5 rounded text-on-surface-variant">2 RUNNING</span>
        </div>
        <div className="space-y-3">
          <div className="glass-card rounded-lg p-4 border-l-2 border-primary-container">
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="text-xs font-bold font-headline">Man City vs Arsenal</p>
                <p className="text-[10px] text-on-surface-variant">Premier League • Today 20:00</p>
              </div>
              <div className="bg-primary-container/10 text-primary-container text-[10px] px-2 py-0.5 rounded font-black border border-primary-container/20">LIVE</div>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-on-surface-variant font-label">Pick: <b className="text-on-surface">Man City</b></span>
              <span className="font-headline font-bold text-primary-container">x1.85</span>
            </div>
          </div>
          <div className="glass-card rounded-lg p-4 border-l-2 border-secondary-container">
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="text-xs font-bold font-headline">Cyber Warriors vs Nexus 5</p>
                <p className="text-[10px] text-on-surface-variant">ESL Pro League • Tomorrow</p>
              </div>
              <div className="bg-surface-container-highest text-on-surface-variant text-[10px] px-2 py-0.5 rounded font-black uppercase">Pending</div>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-on-surface-variant font-label">Pick: <b className="text-on-surface">Nexus 5</b></span>
              <span className="font-headline font-bold text-primary-container">x2.40</span>
            </div>
          </div>
        </div>
      </section>

      {/* Transaction History */}
      <section className="space-y-4">
        <h3 className="font-headline font-extrabold text-sm uppercase tracking-[0.15em] text-primary-container">Transaction History</h3>
        <div className="glass-card rounded-lg overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-surface-container-highest/40 text-[10px] uppercase tracking-widest text-on-surface-variant">
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 font-medium">Amount</th>
                <th className="px-4 py-3 font-medium text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              <tr>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary-container text-lg">south_west</span>
                    <span>Deposit</span>
                  </div>
                </td>
                <td className="px-4 py-4 font-headline font-bold">$2,500.00</td>
                <td className="px-4 py-4 text-right">
                  <span className="text-[10px] font-bold text-primary-container px-2 py-0.5 rounded bg-primary-container/5 uppercase">Success</span>
                </td>
              </tr>
              <tr>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary-container text-lg">north_east</span>
                    <span>Withdraw</span>
                  </div>
                </td>
                <td className="px-4 py-4 font-headline font-bold">$1,200.00</td>
                <td className="px-4 py-4 text-right">
                  <span className="text-[10px] font-bold text-secondary-fixed-dim px-2 py-0.5 rounded bg-secondary-container/10 uppercase">Pending</span>
                </td>
              </tr>
              <tr>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-tertiary-fixed-dim text-lg">military_tech</span>
                    <span>Bonus</span>
                  </div>
                </td>
                <td className="px-4 py-4 font-headline font-bold">$150.00</td>
                <td className="px-4 py-4 text-right">
                  <span className="text-[10px] font-bold text-primary-container px-2 py-0.5 rounded bg-primary-container/5 uppercase">Success</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
};

export default WalletPage;
