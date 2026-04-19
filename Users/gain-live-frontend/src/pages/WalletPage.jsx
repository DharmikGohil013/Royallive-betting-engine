import { useState, useCallback } from "react";
import { useAuth } from "../contexts/AuthContext";

const WALLET_KEY = "gain-live-fake-wallet";
const TXN_KEY = "gain-live-fake-txns";

const PAYMENT_METHODS = [
  { id: "bkash", name: "bKash", icon: "phone_android", color: "#E2136E" },
  { id: "nagad", name: "Nagad", icon: "phone_android", color: "#F6A31B" },
  { id: "rocket", name: "Rocket", icon: "phone_android", color: "#8B2F8B" },
  { id: "bank", name: "Bank Transfer", icon: "account_balance", color: "#00F5FF" },
  { id: "crypto", name: "Crypto (USDT)", icon: "currency_bitcoin", color: "#26A17B" },
];

const BONUS_OFFERS = [
  { id: 1, title: "Welcome Bonus", desc: "200% on first deposit up to $500", code: "WELCOME200", multiplier: 2, maxBonus: 500, minDeposit: 20, used: false },
  { id: 2, title: "Reload Bonus", desc: "50% on every deposit up to $100", code: "RELOAD50", multiplier: 0.5, maxBonus: 100, minDeposit: 10, used: false },
  { id: 3, title: "Weekend Special", desc: "100% bonus up to $250 on weekends", code: "WEEKEND100", multiplier: 1, maxBonus: 250, minDeposit: 25, used: false },
  { id: 4, title: "VIP Cashback", desc: "10% cashback on net losses", code: "VIPCASH10", multiplier: 0.1, maxBonus: 1000, minDeposit: 50, used: false },
  { id: 5, title: "Refer & Earn", desc: "Free $25 for each friend who joins", code: "REFER25", multiplier: 0, maxBonus: 25, minDeposit: 0, used: false },
];

function getWallet() {
  try {
    const raw = localStorage.getItem(WALLET_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { balance: 0, totalDeposited: 0, totalWithdrawn: 0, totalWon: 0, totalLost: 0, bonusBalance: 0, level: 1, xp: 0 };
}

function saveWallet(wallet) {
  localStorage.setItem(WALLET_KEY, JSON.stringify(wallet));
}

function getTxns() {
  try {
    const raw = localStorage.getItem(TXN_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
}

function saveTxns(txns) {
  localStorage.setItem(TXN_KEY, JSON.stringify(txns));
}

function genId() {
  return "TXN-" + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substring(2, 6).toUpperCase();
}

const WalletPage = () => {
  const { user } = useAuth();
  const [wallet, setWallet] = useState(getWallet);
  const [txns, setTxns] = useState(getTxns);
  const [activeTab, setActiveTab] = useState("overview");
  const [showDeposit, setShowDeposit] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [showBonusModal, setShowBonusModal] = useState(null);

  const [depositAmt, setDepositAmt] = useState("");
  const [depositMethod, setDepositMethod] = useState("bkash");
  const [depositRef, setDepositRef] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [depositSuccess, setDepositSuccess] = useState(false);

  const [withdrawAmt, setWithdrawAmt] = useState("");
  const [withdrawMethod, setWithdrawMethod] = useState("bkash");
  const [withdrawAccount, setWithdrawAccount] = useState("");
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);

  const [txnFilter, setTxnFilter] = useState("all");

  const username = user?.username || "USER";
  const displayName = username.toUpperCase().replace(/ /g, "_");

  const winRate = wallet.totalWon + wallet.totalLost > 0
    ? ((wallet.totalWon / (wallet.totalWon + wallet.totalLost)) * 100).toFixed(1)
    : "0.0";

  const level = Math.floor(wallet.xp / 500) + 1;
  const xpProgress = ((wallet.xp % 500) / 500) * 100;

  const updateWallet = useCallback((updater) => {
    setWallet((prev) => {
      const next = typeof updater === "function" ? updater(prev) : { ...prev, ...updater };
      saveWallet(next);
      return next;
    });
  }, []);

  const addTxn = useCallback((txn) => {
    setTxns((prev) => {
      const next = [txn, ...prev].slice(0, 100);
      saveTxns(next);
      return next;
    });
  }, []);

  const handleDeposit = () => {
    const amount = parseFloat(depositAmt);
    if (!amount || amount < 1 || amount > 100000) return;

    let bonusAmount = 0;
    const matchedBonus = BONUS_OFFERS.find((b) => b.code === promoCode.toUpperCase().trim());
    if (matchedBonus && amount >= matchedBonus.minDeposit) {
      bonusAmount = Math.min(amount * matchedBonus.multiplier, matchedBonus.maxBonus);
    }

    updateWallet((prev) => ({
      ...prev,
      balance: prev.balance + amount + bonusAmount,
      totalDeposited: prev.totalDeposited + amount,
      bonusBalance: prev.bonusBalance + bonusAmount,
      xp: prev.xp + Math.floor(amount / 10),
    }));

    addTxn({ id: genId(), type: "deposit", amount, method: depositMethod, reference: depositRef, status: "success", date: new Date().toISOString() });

    if (bonusAmount > 0) {
      addTxn({ id: genId(), type: "bonus", amount: bonusAmount, method: "promo", reference: promoCode.toUpperCase(), status: "success", date: new Date().toISOString() });
    }

    setDepositSuccess(true);
    setTimeout(() => { setShowDeposit(false); setDepositAmt(""); setDepositRef(""); setPromoCode(""); setDepositSuccess(false); }, 2000);
  };

  const handleWithdraw = () => {
    const amount = parseFloat(withdrawAmt);
    if (!amount || amount < 1 || amount > wallet.balance) return;

    updateWallet((prev) => ({ ...prev, balance: prev.balance - amount, totalWithdrawn: prev.totalWithdrawn + amount }));
    addTxn({ id: genId(), type: "withdraw", amount, method: withdrawMethod, reference: withdrawAccount, status: "pending", date: new Date().toISOString() });

    setWithdrawSuccess(true);
    setTimeout(() => { setShowWithdraw(false); setWithdrawAmt(""); setWithdrawAccount(""); setWithdrawSuccess(false); }, 2000);
  };

  const handleClaimBonus = (bonus) => {
    if (bonus.minDeposit === 0) {
      updateWallet((prev) => ({ ...prev, balance: prev.balance + bonus.maxBonus, bonusBalance: prev.bonusBalance + bonus.maxBonus, xp: prev.xp + 50 }));
      addTxn({ id: genId(), type: "bonus", amount: bonus.maxBonus, method: "promo", reference: bonus.code, status: "success", date: new Date().toISOString() });
    }
    setShowBonusModal(null);
  };

  const filteredTxns = txnFilter === "all" ? txns : txns.filter((t) => t.type === txnFilter);

  const tabs = [
    { key: "overview", label: "Overview" },
    { key: "history", label: "History" },
    { key: "bonuses", label: "Bonuses" },
    { key: "stats", label: "Statistics" },
  ];

  return (
    <main className="pt-20 pb-28 px-4 max-w-md mx-auto space-y-6">
      {/* User Identity & Wallet Card */}
      <section className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-container to-secondary-container rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-1000" />
        <div className="relative glass-card rounded-xl p-5 overflow-hidden">
          <div className="flex items-center gap-4 mb-6">
            <div className="relative">
              <div className="w-16 h-16 rounded-lg overflow-hidden border-2 border-primary-container/30">
                <div className="w-full h-full bg-surface-container-high flex items-center justify-center">
                  <span className="material-symbols-outlined text-[#00F5FF] text-2xl">person</span>
                </div>
              </div>
              <div className="absolute -bottom-2 -right-2 bg-tertiary-fixed-dim text-on-tertiary-fixed text-[10px] font-black px-2 py-0.5 rounded-full border border-background shadow-lg">
                LVL {level}
              </div>
            </div>
            <div className="flex-1">
              <h2 className="font-headline font-extrabold text-lg text-primary-container tracking-tight">{displayName}</h2>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="material-symbols-outlined text-tertiary-fixed-dim text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>military_tech</span>
                <span className="text-xs font-label uppercase tracking-widest text-on-surface-variant">
                  {level >= 10 ? "VIP ELITE" : level >= 5 ? "VIP MEMBER" : "MEMBER"}
                </span>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <div className="flex-1 h-1 bg-surface-container-highest rounded-full overflow-hidden">
                  <div className="h-full bg-tertiary-fixed-dim transition-all duration-500" style={{ width: `${xpProgress}%` }} />
                </div>
                <span className="text-[9px] font-label text-on-surface-variant">{Math.floor(wallet.xp % 500)}/500 XP</span>
              </div>
            </div>
          </div>

          <div className="bg-surface-container-lowest/50 rounded-lg p-4 border-l-4 border-primary-container">
            <div className="flex justify-between items-end">
              <div>
                <p className="text-[10px] font-label uppercase tracking-[0.2em] text-on-surface-variant mb-1">Available Credits</p>
                <p className="text-3xl font-headline font-black text-primary-container tracking-tighter">
                  ${wallet.balance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                {wallet.bonusBalance > 0 && (
                  <p className="text-[10px] text-tertiary-fixed-dim mt-1">includes ${wallet.bonusBalance.toFixed(2)} bonus</p>
                )}
              </div>
              <div className="flex gap-2 pb-1">
                <button onClick={() => setShowDeposit(true)} className="p-2 bg-primary-container/10 text-primary-container rounded border border-primary-container/20 active:scale-90 transition-all">
                  <span className="material-symbols-outlined text-xl">add</span>
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-4">
            <button onClick={() => setShowDeposit(true)} className="flex items-center justify-center gap-2 py-3 bg-primary-container text-on-primary font-headline font-bold text-xs uppercase tracking-widest rounded-lg shadow-[0_0_15px_rgba(0,245,255,0.3)] active:scale-95 transition-transform">
              <span className="material-symbols-outlined text-sm">payments</span>
              DEPOSIT
            </button>
            <button onClick={() => setShowWithdraw(true)} className="flex items-center justify-center gap-2 py-3 bg-surface-container-high text-on-surface font-headline font-bold text-xs uppercase tracking-widest rounded-lg border border-outline-variant active:scale-95 transition-transform">
              <span className="material-symbols-outlined text-sm">account_balance_wallet</span>
              WITHDRAW
            </button>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <nav className="flex border-b border-outline-variant/30 overflow-x-auto hide-scrollbar">
        {tabs.map((t) => (
          <button key={t.key} onClick={() => setActiveTab(t.key)} className={`px-5 py-3 font-headline font-bold text-xs uppercase tracking-widest whitespace-nowrap transition-colors ${activeTab === t.key ? "text-primary-container border-b-2 border-primary-container" : "text-on-surface-variant/60"}`}>
            {t.label}
          </button>
        ))}
      </nav>

      {/* TAB: Overview */}
      {activeTab === "overview" && (
        <>
          <section className="grid grid-cols-2 gap-3">
            <div className="col-span-2 glass-card rounded-lg p-4 flex justify-between items-center">
              <div>
                <p className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant">Win Rate</p>
                <p className="text-2xl font-headline font-bold text-tertiary-fixed-dim">{winRate}%</p>
              </div>
              <div className="w-24 h-1 bg-surface-container-highest rounded-full overflow-hidden">
                <div className="h-full bg-tertiary-fixed-dim shadow-[0_0_8px_rgba(255,184,0,0.5)]" style={{ width: `${winRate}%` }} />
              </div>
            </div>
            <div className="glass-card rounded-lg p-4">
              <p className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant">Total Deposited</p>
              <p className="text-xl font-headline font-bold text-on-surface mt-1">${wallet.totalDeposited.toLocaleString("en-US", { minimumFractionDigits: 0 })}</p>
            </div>
            <div className="glass-card rounded-lg p-4">
              <p className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant">Total Withdrawn</p>
              <p className="text-xl font-headline font-bold text-primary-container mt-1">${wallet.totalWithdrawn.toLocaleString("en-US", { minimumFractionDigits: 0 })}</p>
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-headline font-extrabold text-sm uppercase tracking-[0.15em] text-primary-container">Recent Transactions</h3>
              <button onClick={() => setActiveTab("history")} className="text-[10px] font-label font-medium text-primary-container">VIEW ALL →</button>
            </div>
            {txns.length === 0 ? (
              <div className="glass-card rounded-lg p-8 text-center">
                <span className="material-symbols-outlined text-on-surface-variant/30 text-4xl mb-2 block">receipt_long</span>
                <p className="text-xs text-on-surface-variant">No transactions yet. Make your first deposit!</p>
              </div>
            ) : (
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
                    {txns.slice(0, 5).map((t) => (
                      <tr key={t.id}>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <span className={`material-symbols-outlined text-lg ${t.type === "deposit" ? "text-primary-container" : t.type === "withdraw" ? "text-secondary-container" : "text-tertiary-fixed-dim"}`}>
                              {t.type === "deposit" ? "south_west" : t.type === "withdraw" ? "north_east" : "military_tech"}
                            </span>
                            <div>
                              <span className="capitalize">{t.type}</span>
                              <p className="text-[9px] text-on-surface-variant">{new Date(t.date).toLocaleDateString()}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 font-headline font-bold">${t.amount.toFixed(2)}</td>
                        <td className="px-4 py-4 text-right">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${t.status === "success" ? "text-primary-container bg-primary-container/5" : t.status === "pending" ? "text-secondary-fixed-dim bg-secondary-container/10" : "text-error bg-error-container/10"}`}>{t.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <section className="grid grid-cols-3 gap-3">
            <button onClick={() => setActiveTab("bonuses")} className="glass-card rounded-lg p-3 flex flex-col items-center gap-2 active:scale-95 transition-transform">
              <span className="material-symbols-outlined text-tertiary-fixed-dim text-xl">redeem</span>
              <span className="text-[9px] font-label uppercase tracking-widest text-on-surface-variant">Bonuses</span>
            </button>
            <button onClick={() => setActiveTab("stats")} className="glass-card rounded-lg p-3 flex flex-col items-center gap-2 active:scale-95 transition-transform">
              <span className="material-symbols-outlined text-primary-container text-xl">analytics</span>
              <span className="text-[9px] font-label uppercase tracking-widest text-on-surface-variant">Analytics</span>
            </button>
            <button onClick={() => setActiveTab("history")} className="glass-card rounded-lg p-3 flex flex-col items-center gap-2 active:scale-95 transition-transform">
              <span className="material-symbols-outlined text-secondary-container text-xl">history</span>
              <span className="text-[9px] font-label uppercase tracking-widest text-on-surface-variant">History</span>
            </button>
          </section>
        </>
      )}

      {/* TAB: History */}
      {activeTab === "history" && (
        <section className="space-y-4">
          <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
            {["all", "deposit", "withdraw", "bonus"].map((f) => (
              <button key={f} onClick={() => setTxnFilter(f)} className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest whitespace-nowrap border transition-all ${txnFilter === f ? "bg-primary-container/20 text-primary-container border-primary-container/40" : "bg-surface-container-high border-outline-variant/20 text-on-surface-variant"}`}>{f}</button>
            ))}
          </div>
          {filteredTxns.length === 0 ? (
            <div className="glass-card rounded-lg p-8 text-center">
              <span className="material-symbols-outlined text-on-surface-variant/30 text-4xl mb-2 block">receipt_long</span>
              <p className="text-xs text-on-surface-variant">No {txnFilter === "all" ? "" : txnFilter} transactions found.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredTxns.map((t) => (
                <div key={t.id} className="glass-card rounded-lg p-4 flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${t.type === "deposit" ? "bg-primary-container/10" : t.type === "withdraw" ? "bg-secondary-container/10" : "bg-tertiary-container/10"}`}>
                    <span className={`material-symbols-outlined text-xl ${t.type === "deposit" ? "text-primary-container" : t.type === "withdraw" ? "text-secondary-container" : "text-tertiary-fixed-dim"}`}>
                      {t.type === "deposit" ? "south_west" : t.type === "withdraw" ? "north_east" : "military_tech"}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <p className="text-xs font-bold capitalize">{t.type}</p>
                      <p className={`text-sm font-headline font-bold ${t.type === "withdraw" ? "text-secondary-container" : "text-primary-container"}`}>{t.type === "withdraw" ? "-" : "+"}${t.amount.toFixed(2)}</p>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <p className="text-[10px] text-on-surface-variant truncate mr-2">{t.method.toUpperCase()} • {t.id}</p>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase shrink-0 ${t.status === "success" ? "text-primary-container bg-primary-container/5" : t.status === "pending" ? "text-secondary-fixed-dim bg-secondary-container/10" : "text-error bg-error-container/10"}`}>{t.status}</span>
                    </div>
                    <p className="text-[9px] text-on-surface-variant/60 mt-1">{new Date(t.date).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* TAB: Bonuses */}
      {activeTab === "bonuses" && (
        <section className="space-y-4">
          <div className="glass-card rounded-lg p-4 flex items-center gap-3 border-l-4 border-tertiary-fixed-dim">
            <span className="material-symbols-outlined text-tertiary-fixed-dim text-2xl">redeem</span>
            <div>
              <p className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant">Bonus Balance</p>
              <p className="text-xl font-headline font-bold text-tertiary-fixed-dim">${wallet.bonusBalance.toFixed(2)}</p>
            </div>
          </div>
          <h3 className="font-headline font-extrabold text-sm uppercase tracking-[0.15em] text-primary-container">Available Offers</h3>
          {BONUS_OFFERS.map((bonus) => (
            <div key={bonus.id} className="glass-card rounded-lg p-4 border-l-2 border-primary-container/30">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="text-xs font-bold font-headline">{bonus.title}</p>
                  <p className="text-[10px] text-on-surface-variant mt-0.5">{bonus.desc}</p>
                </div>
                <span className="text-[10px] font-black text-primary-container px-2 py-0.5 rounded bg-primary-container/10 border border-primary-container/20">{bonus.code}</span>
              </div>
              <div className="flex items-center justify-between mt-3">
                <div className="flex gap-4">
                  {bonus.minDeposit > 0 && <p className="text-[9px] text-on-surface-variant">Min: ${bonus.minDeposit}</p>}
                  <p className="text-[9px] text-on-surface-variant">Max: ${bonus.maxBonus}</p>
                </div>
                {bonus.minDeposit === 0 ? (
                  <button onClick={() => setShowBonusModal(bonus)} className="px-3 py-1.5 bg-primary-container/20 text-primary-container text-[10px] font-bold uppercase tracking-wider rounded border border-primary-container/30 active:scale-95 transition-transform">Claim Free</button>
                ) : (
                  <button onClick={() => { setPromoCode(bonus.code); setShowDeposit(true); }} className="px-3 py-1.5 bg-surface-container-high text-on-surface text-[10px] font-bold uppercase tracking-wider rounded border border-outline-variant/30 active:scale-95 transition-transform">Use Code</button>
                )}
              </div>
            </div>
          ))}
        </section>
      )}

      {/* TAB: Statistics */}
      {activeTab === "stats" && (
        <section className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Total Deposited", value: `$${wallet.totalDeposited.toFixed(2)}`, color: "text-on-surface" },
              { label: "Total Withdrawn", value: `$${wallet.totalWithdrawn.toFixed(2)}`, color: "text-primary-container" },
              { label: "Total Won", value: `$${wallet.totalWon.toFixed(2)}`, color: "text-tertiary-fixed-dim" },
              { label: "Total Lost", value: `$${wallet.totalLost.toFixed(2)}`, color: "text-error" },
            ].map((s, i) => (
              <div key={i} className="glass-card rounded-lg p-4">
                <p className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant">{s.label}</p>
                <p className={`text-xl font-headline font-bold mt-1 ${s.color}`}>{s.value}</p>
              </div>
            ))}
          </div>
          <div className="glass-card rounded-lg p-4 space-y-3">
            <h4 className="font-headline font-bold text-xs uppercase tracking-widest text-on-surface">Account Summary</h4>
            <div className="space-y-2">
              {[
                { label: "Net Profit/Loss", value: `$${(wallet.totalWon - wallet.totalLost).toFixed(2)}`, color: wallet.totalWon >= wallet.totalLost ? "text-primary-container" : "text-error" },
                { label: "Win Rate", value: `${winRate}%`, color: "text-tertiary-fixed-dim" },
                { label: "Bonus Earned", value: `$${wallet.bonusBalance.toFixed(2)}`, color: "text-tertiary-fixed-dim" },
                { label: "Current Balance", value: `$${wallet.balance.toFixed(2)}`, color: "text-primary-container" },
                { label: "Level", value: `Level ${level}`, color: "text-on-surface" },
                { label: "Total XP", value: `${wallet.xp} XP`, color: "text-on-surface" },
                { label: "Total Transactions", value: txns.length, color: "text-on-surface" },
                { label: "Member Since", value: user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Today", color: "text-on-surface-variant" },
              ].map((item, i) => (
                <div key={i} className="flex justify-between items-center py-2 border-b border-outline-variant/10 last:border-0">
                  <span className="text-[11px] text-on-surface-variant">{item.label}</span>
                  <span className={`text-xs font-headline font-bold ${item.color}`}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="glass-card rounded-lg p-4 space-y-3">
            <h4 className="font-headline font-bold text-xs uppercase tracking-widest text-on-surface">Activity Chart</h4>
            <div className="flex items-end gap-1 h-24">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => {
                const dayTxns = txns.filter((t) => new Date(t.date).getDay() === (i + 1) % 7);
                const total = dayTxns.reduce((s, t) => s + t.amount, 0);
                const maxH = 80;
                const h = txns.length > 0 ? Math.max(4, (total / Math.max(1, ...txns.map((t) => t.amount))) * maxH) : 4;
                return (
                  <div key={day} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full bg-primary-container/20 rounded-t transition-all duration-500" style={{ height: `${Math.min(h, maxH)}px` }} />
                    <span className="text-[8px] text-on-surface-variant">{day}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* DEPOSIT MODAL */}
      {showDeposit && (
        <div className="fixed inset-0 z-[70] flex items-end justify-center" onClick={() => !depositSuccess && setShowDeposit(false)}>
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <div className="relative w-full max-w-[460px] bg-[#0A0A0F] rounded-t-2xl p-5 pb-8 space-y-5 border-t border-primary-container/20 max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            {depositSuccess ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-primary-container/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary-container text-3xl">check_circle</span>
                </div>
                <p className="font-headline font-bold text-lg text-primary-container">Deposit Successful!</p>
                <p className="text-xs text-on-surface-variant">Your balance has been updated.</p>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center">
                  <h3 className="font-headline font-extrabold text-lg uppercase tracking-tight text-on-surface">Deposit Funds</h3>
                  <button onClick={() => setShowDeposit(false)} className="text-on-surface-variant p-1"><span className="material-symbols-outlined">close</span></button>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {[50, 100, 500, 1000].map((amt) => (
                    <button key={amt} onClick={() => setDepositAmt(String(amt))} className={`py-2.5 rounded text-xs font-bold font-headline border transition-all active:scale-95 ${depositAmt === String(amt) ? "bg-primary-container/20 text-primary-container border-primary-container/40" : "bg-surface-container-high border-outline-variant/20 text-on-surface"}`}>${amt}</button>
                  ))}
                </div>
                <div className="space-y-2">
                  <label className="font-headline text-[10px] font-bold uppercase tracking-[0.2em] text-primary-container">Amount ($)</label>
                  <input type="number" value={depositAmt} onChange={(e) => setDepositAmt(e.target.value)} placeholder="Enter amount" min="1" max="100000" className="w-full bg-surface-container-lowest/60 px-4 py-3 rounded text-sm font-headline text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-1 focus:ring-primary-container/40 border border-outline-variant/20" />
                </div>
                <div className="space-y-2">
                  <label className="font-headline text-[10px] font-bold uppercase tracking-[0.2em] text-primary-container">Payment Method</label>
                  <div className="grid grid-cols-2 gap-2">
                    {PAYMENT_METHODS.map((m) => (
                      <button key={m.id} onClick={() => setDepositMethod(m.id)} className={`flex items-center gap-2 p-3 rounded text-xs font-bold border transition-all ${depositMethod === m.id ? "border-primary-container/40 bg-primary-container/10" : "border-outline-variant/20 bg-surface-container-high"}`}>
                        <span className="material-symbols-outlined text-lg" style={{ color: m.color }}>{m.icon}</span>
                        <span>{m.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="font-headline text-[10px] font-bold uppercase tracking-[0.2em] text-primary-container">Transaction Reference</label>
                  <input type="text" value={depositRef} onChange={(e) => setDepositRef(e.target.value)} placeholder="Enter transaction ID / reference" className="w-full bg-surface-container-lowest/60 px-4 py-3 rounded text-sm font-headline text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-1 focus:ring-primary-container/40 border border-outline-variant/20" />
                </div>
                <div className="space-y-2">
                  <label className="font-headline text-[10px] font-bold uppercase tracking-[0.2em] text-primary-container">Promo Code (Optional)</label>
                  <input type="text" value={promoCode} onChange={(e) => setPromoCode(e.target.value)} placeholder="Enter promo code" className="w-full bg-surface-container-lowest/60 px-4 py-3 rounded text-sm font-headline uppercase text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-1 focus:ring-primary-container/40 border border-outline-variant/20" />
                  {promoCode && BONUS_OFFERS.find((b) => b.code === promoCode.toUpperCase().trim()) && (
                    <p className="text-[10px] text-tertiary-fixed-dim flex items-center gap-1"><span className="material-symbols-outlined text-sm">check_circle</span>Promo code valid! Bonus will be applied.</p>
                  )}
                </div>
                <button onClick={handleDeposit} disabled={!depositAmt || parseFloat(depositAmt) < 1} className="w-full py-3.5 bg-[linear-gradient(90deg,#00F5FF_0%,#FF2D78_100%)] font-headline text-xs font-black uppercase tracking-[0.18em] text-on-primary rounded-lg shadow-[0_0_20px_rgba(0,245,255,0.3)] active:scale-[0.98] transition-all disabled:opacity-40 disabled:active:scale-100">
                  DEPOSIT ${depositAmt || "0.00"}
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* WITHDRAW MODAL */}
      {showWithdraw && (
        <div className="fixed inset-0 z-[70] flex items-end justify-center" onClick={() => !withdrawSuccess && setShowWithdraw(false)}>
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <div className="relative w-full max-w-[460px] bg-[#0A0A0F] rounded-t-2xl p-5 pb-8 space-y-5 border-t border-primary-container/20 max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            {withdrawSuccess ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-primary-container/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary-container text-3xl">check_circle</span>
                </div>
                <p className="font-headline font-bold text-lg text-primary-container">Withdrawal Requested!</p>
                <p className="text-xs text-on-surface-variant">Your request is being processed.</p>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center">
                  <h3 className="font-headline font-extrabold text-lg uppercase tracking-tight text-on-surface">Withdraw Funds</h3>
                  <button onClick={() => setShowWithdraw(false)} className="text-on-surface-variant p-1"><span className="material-symbols-outlined">close</span></button>
                </div>
                <div className="bg-surface-container-lowest/50 rounded-lg p-3 border border-primary-container/20">
                  <p className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant">Available Balance</p>
                  <p className="text-xl font-headline font-bold text-primary-container">${wallet.balance.toFixed(2)}</p>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {[50, 100, 500, 1000].map((amt) => (
                    <button key={amt} onClick={() => setWithdrawAmt(String(Math.min(amt, wallet.balance)))} disabled={wallet.balance < amt} className={`py-2.5 rounded text-xs font-bold font-headline border transition-all active:scale-95 disabled:opacity-30 ${withdrawAmt === String(amt) ? "bg-primary-container/20 text-primary-container border-primary-container/40" : "bg-surface-container-high border-outline-variant/20 text-on-surface"}`}>${amt}</button>
                  ))}
                </div>
                <div className="space-y-2">
                  <label className="font-headline text-[10px] font-bold uppercase tracking-[0.2em] text-primary-container">Amount ($)</label>
                  <input type="number" value={withdrawAmt} onChange={(e) => setWithdrawAmt(e.target.value)} placeholder="Enter amount" min="1" max={wallet.balance} className="w-full bg-surface-container-lowest/60 px-4 py-3 rounded text-sm font-headline text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-1 focus:ring-primary-container/40 border border-outline-variant/20" />
                  {parseFloat(withdrawAmt) > wallet.balance && (
                    <p className="text-[10px] text-error flex items-center gap-1"><span className="material-symbols-outlined text-sm">error</span>Insufficient balance</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="font-headline text-[10px] font-bold uppercase tracking-[0.2em] text-primary-container">Withdraw To</label>
                  <div className="grid grid-cols-2 gap-2">
                    {PAYMENT_METHODS.map((m) => (
                      <button key={m.id} onClick={() => setWithdrawMethod(m.id)} className={`flex items-center gap-2 p-3 rounded text-xs font-bold border transition-all ${withdrawMethod === m.id ? "border-primary-container/40 bg-primary-container/10" : "border-outline-variant/20 bg-surface-container-high"}`}>
                        <span className="material-symbols-outlined text-lg" style={{ color: m.color }}>{m.icon}</span>
                        <span>{m.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="font-headline text-[10px] font-bold uppercase tracking-[0.2em] text-primary-container">Account Number</label>
                  <input type="text" value={withdrawAccount} onChange={(e) => setWithdrawAccount(e.target.value)} placeholder="Enter your account number" className="w-full bg-surface-container-lowest/60 px-4 py-3 rounded text-sm font-headline text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-1 focus:ring-primary-container/40 border border-outline-variant/20" />
                </div>
                <button onClick={handleWithdraw} disabled={!withdrawAmt || parseFloat(withdrawAmt) < 1 || parseFloat(withdrawAmt) > wallet.balance || !withdrawAccount} className="w-full py-3.5 bg-[linear-gradient(90deg,#00F5FF_0%,#FF2D78_100%)] font-headline text-xs font-black uppercase tracking-[0.18em] text-on-primary rounded-lg shadow-[0_0_20px_rgba(0,245,255,0.3)] active:scale-[0.98] transition-all disabled:opacity-40 disabled:active:scale-100">
                  WITHDRAW ${withdrawAmt || "0.00"}
                </button>
                <p className="text-[9px] text-center text-on-surface-variant/50">Withdrawals are processed within 1-24 hours. Minimum withdrawal: $1.00</p>
              </>
            )}
          </div>
        </div>
      )}

      {/* BONUS CLAIM MODAL */}
      {showBonusModal && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center" onClick={() => setShowBonusModal(null)}>
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <div className="relative w-[90%] max-w-[380px] bg-[#0A0A0F] rounded-xl p-5 space-y-4 border border-primary-container/20" onClick={(e) => e.stopPropagation()}>
            <div className="text-center space-y-2">
              <span className="material-symbols-outlined text-tertiary-fixed-dim text-4xl">redeem</span>
              <h3 className="font-headline font-extrabold text-lg text-on-surface">{showBonusModal.title}</h3>
              <p className="text-xs text-on-surface-variant">{showBonusModal.desc}</p>
              <p className="text-2xl font-headline font-black text-primary-container">${showBonusModal.maxBonus}.00</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => setShowBonusModal(null)} className="py-2.5 bg-surface-container-high text-on-surface font-headline font-bold text-xs uppercase tracking-widest rounded border border-outline-variant">Cancel</button>
              <button onClick={() => handleClaimBonus(showBonusModal)} className="py-2.5 bg-primary-container text-on-primary font-headline font-bold text-xs uppercase tracking-widest rounded shadow-[0_0_15px_rgba(0,245,255,0.3)]">Claim Now</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default WalletPage;
