import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../contexts/AuthContext";
import { getWallet as fetchWalletApi, requestDeposit, requestWithdraw, getTransactions, getPaymentMethods } from "../services/api";

const BONUS_OFFERS = [
  { id: 1, title: "Welcome Bonus", desc: "200% on first deposit up to ৳5,000", code: "WELCOME200", minDeposit: 500, maxBonus: 5000 },
  { id: 2, title: "Reload Bonus", desc: "50% on every deposit up to ৳1,000", code: "RELOAD50", minDeposit: 200, maxBonus: 1000 },
  { id: 3, title: "Weekend Special", desc: "100% bonus up to ৳2,500 on weekends", code: "WEEKEND100", minDeposit: 300, maxBonus: 2500 },
  { id: 4, title: "VIP Cashback", desc: "10% cashback on net losses", code: "VIPCASH10", minDeposit: 1000, maxBonus: 10000 },
  { id: 5, title: "Refer & Earn", desc: "Free ৳250 for each friend who joins", code: "REFER25", minDeposit: 0, maxBonus: 250 },
];

const FALLBACK_METHODS = [
  { id: "bkash", name: "bKash", icon: "phone_android", color: "#E2136E" },
  { id: "nagad", name: "Nagad", icon: "phone_android", color: "#F6A31B" },
  { id: "rocket", name: "Rocket", icon: "phone_android", color: "#8B2F8B" },
  { id: "bank", name: "Bank Transfer", icon: "account_balance", color: "#00F5FF" },
  { id: "crypto", name: "Crypto (USDT)", icon: "currency_bitcoin", color: "#26A17B" },
];

const WalletPage = () => {
  const { user, setUser } = useAuth();

  // Wallet data from API
  const [walletData, setWalletData] = useState({
    balance: 0, totalDeposits: 0, totalWithdrawals: 0,
    totalBets: 0, totalWinnings: 0, totalWins: 0, totalLosses: 0,
    pendingCount: 0, currency: "BDT",
  });
  const [txns, setTxns] = useState([]);
  const [allTxns, setAllTxns] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState(FALLBACK_METHODS);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [msg, setMsg] = useState(null);

  // UI state
  const [activeTab, setActiveTab] = useState("overview");
  const [showDeposit, setShowDeposit] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);

  // Deposit form
  const [depositAmt, setDepositAmt] = useState("");
  const [depositMethod, setDepositMethod] = useState("");
  const [depositRef, setDepositRef] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [depositLoading, setDepositLoading] = useState(false);
  const [depositSuccess, setDepositSuccess] = useState(false);

  // Withdraw form
  const [withdrawAmt, setWithdrawAmt] = useState("");
  const [withdrawMethod, setWithdrawMethod] = useState("");
  const [withdrawAccount, setWithdrawAccount] = useState("");
  const [withdrawLoading, setWithdrawLoading] = useState(false);
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);

  // History filter & pagination
  const [txnFilter, setTxnFilter] = useState("all");
  const [txnPage, setTxnPage] = useState(1);
  const [txnTotal, setTxnTotal] = useState(0);
  const [txnPages, setTxnPages] = useState(1);
  const [historyLoading, setHistoryLoading] = useState(false);

  const displayName = (user?.username || "USER").toUpperCase();

  const winRate = (walletData.totalWins + walletData.totalLosses) > 0
    ? ((walletData.totalWins / (walletData.totalWins + walletData.totalLosses)) * 100).toFixed(1)
    : "0.0";

  // Fetch wallet data
  const loadWallet = useCallback(async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      else setRefreshing(true);
      const data = await fetchWalletApi();
      setWalletData({
        balance: data.balance || 0,
        totalDeposits: data.totalDeposits || 0,
        totalWithdrawals: data.totalWithdrawals || 0,
        totalBets: data.totalBets || 0,
        totalWinnings: data.totalWinnings || 0,
        totalWins: data.totalWins || 0,
        totalLosses: data.totalLosses || 0,
        pendingCount: data.pendingCount || 0,
        currency: data.currency || "BDT",
      });
      setTxns(data.transactions || []);
      // Update auth context balance
      const stored = JSON.parse(localStorage.getItem("gain-live-user") || "{}");
      stored.balance = data.balance || 0;
      localStorage.setItem("gain-live-user", JSON.stringify(stored));
      setUser((prev) => prev ? { ...prev, balance: data.balance || 0 } : prev);
    } catch {
      if (!silent) setMsg({ type: "error", text: "Failed to load wallet data" });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [setUser]);

  // Fetch payment methods
  const loadPaymentMethods = useCallback(async () => {
    try {
      const data = await getPaymentMethods();
      if (data.methods && data.methods.length > 0) {
        setPaymentMethods(data.methods.map((m) => ({
          id: m.slug || m._id, name: m.name, icon: m.icon || "payments",
          color: m.color || "#00F5FF", minAmount: m.minAmount, maxAmount: m.maxAmount,
          processingTime: m.processingTime, fee: m.fee,
        })));
      }
    } catch {
      // Use fallback methods
    }
  }, []);

  // Fetch full history
  const loadHistory = useCallback(async (page = 1, type = "") => {
    try {
      setHistoryLoading(true);
      const params = { page, limit: 15 };
      if (type && type !== "all") params.type = type;
      const data = await getTransactions(params);
      setAllTxns(data.transactions || []);
      setTxnTotal(data.total || 0);
      setTxnPages(data.totalPages || 1);
      setTxnPage(data.page || 1);
    } catch {} finally {
      setHistoryLoading(false);
    }
  }, []);

  useEffect(() => {
    loadWallet();
    loadPaymentMethods();
  }, [loadWallet, loadPaymentMethods]);

  useEffect(() => {
    if (activeTab === "history") loadHistory(1, txnFilter);
  }, [activeTab, txnFilter, loadHistory]);

  // Deposit handler
  const handleDeposit = async () => {
    const amount = parseFloat(depositAmt);
    if (!amount || amount < 100) {
      setMsg({ type: "error", text: "Minimum deposit is ৳100" });
      return;
    }
    if (amount > 500000) {
      setMsg({ type: "error", text: "Maximum deposit is ৳500,000" });
      return;
    }
    if (!depositMethod) {
      setMsg({ type: "error", text: "Select a payment method" });
      return;
    }
    try {
      setDepositLoading(true);
      await requestDeposit(amount, depositMethod, depositRef);
      setDepositSuccess(true);
      setMsg({ type: "success", text: "Deposit request submitted! Awaiting approval." });
      setTimeout(() => {
        setShowDeposit(false);
        setDepositAmt(""); setDepositRef(""); setPromoCode(""); setDepositSuccess(false);
        loadWallet(true);
      }, 2500);
    } catch (err) {
      setMsg({ type: "error", text: err.message || "Deposit failed" });
    } finally {
      setDepositLoading(false);
    }
  };

  // Withdraw handler
  const handleWithdraw = async () => {
    const amount = parseFloat(withdrawAmt);
    if (!amount || amount < 100) {
      setMsg({ type: "error", text: "Minimum withdrawal is ৳100" });
      return;
    }
    if (amount > walletData.balance) {
      setMsg({ type: "error", text: "Insufficient balance" });
      return;
    }
    if (!withdrawMethod) {
      setMsg({ type: "error", text: "Select a withdrawal method" });
      return;
    }
    if (!withdrawAccount.trim()) {
      setMsg({ type: "error", text: "Enter your account number" });
      return;
    }
    try {
      setWithdrawLoading(true);
      await requestWithdraw(amount, withdrawMethod, withdrawAccount);
      setWithdrawSuccess(true);
      setMsg({ type: "success", text: "Withdrawal request submitted! Processing within 1-24 hours." });
      setTimeout(() => {
        setShowWithdraw(false);
        setWithdrawAmt(""); setWithdrawAccount(""); setWithdrawSuccess(false);
        loadWallet(true);
      }, 2500);
    } catch (err) {
      setMsg({ type: "error", text: err.message || "Withdrawal failed" });
    } finally {
      setWithdrawLoading(false);
    }
  };

  const tabs = [
    { key: "overview", label: "Overview", icon: "dashboard" },
    { key: "history", label: "History", icon: "history" },
    { key: "bonuses", label: "Bonuses", icon: "redeem" },
    { key: "stats", label: "Stats", icon: "analytics" },
  ];

  return (
    <main className="pt-24 pb-28 px-4 max-w-md mx-auto space-y-6">
      {/* Message Toast */}
      {msg && (
        <div className={`fixed top-20 left-1/2 -translate-x-1/2 z-[80] max-w-[360px] w-[90%] px-4 py-3 rounded-lg text-xs font-bold flex items-center gap-2 shadow-lg border ${msg.type === "success" ? "bg-primary-container/20 border-primary-container/30 text-primary-container" : "bg-error/20 border-error/30 text-error"}`}>
          <span className="material-symbols-outlined text-sm">{msg.type === "success" ? "check_circle" : "error"}</span>
          {msg.text}
          <button onClick={() => setMsg(null)} className="ml-auto"><span className="material-symbols-outlined text-sm">close</span></button>
        </div>
      )}

      {/* Wallet Card */}
      <section className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-container to-secondary-container rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-1000" />
        <div className="relative glass-card rounded-xl p-5 overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-primary-container/10 border border-primary-container/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-[#00F5FF] text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>account_balance_wallet</span>
              </div>
              <div>
                <h2 className="font-headline font-extrabold text-lg text-primary-container tracking-tight">{displayName}</h2>
                <span className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant">
                  {walletData.totalBets >= 100 ? "VIP ELITE" : walletData.totalBets >= 20 ? "VIP MEMBER" : "MEMBER"}
                </span>
              </div>
            </div>
            <button
              onClick={() => loadWallet(true)}
              disabled={refreshing}
              className={`p-2 rounded-lg bg-surface-container-high border border-outline-variant/20 active:scale-90 transition-all ${refreshing ? "animate-spin" : ""}`}
            >
              <span className="material-symbols-outlined text-primary-container text-lg">refresh</span>
            </button>
          </div>

          {/* Balance Display */}
          <div className="bg-surface-container-lowest/50 rounded-lg p-4 border-l-4 border-primary-container">
            <div className="flex justify-between items-end">
              <div>
                <p className="text-[10px] font-label uppercase tracking-[0.2em] text-on-surface-variant mb-1">Available Balance</p>
                <p className="text-3xl font-headline font-black text-primary-container tracking-tighter">
                  ৳{walletData.balance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                {walletData.pendingCount > 0 && (
                  <p className="text-[10px] text-tertiary-fixed-dim mt-1 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[10px]">schedule</span>
                    {walletData.pendingCount} pending transaction{walletData.pendingCount > 1 ? "s" : ""}
                  </p>
                )}
              </div>
              <div className="text-right">
                <p className="text-[9px] font-label uppercase tracking-widest text-on-surface-variant">Currency</p>
                <p className="text-xs font-headline font-bold text-on-surface">{walletData.currency}</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-3 mt-4">
            <button onClick={() => { setShowDeposit(true); setDepositMethod(paymentMethods[0]?.id || ""); }} className="flex items-center justify-center gap-2 py-3 bg-primary-container text-on-primary font-headline font-bold text-xs uppercase tracking-widest rounded-lg shadow-[0_0_15px_rgba(0,245,255,0.3)] active:scale-95 transition-transform">
              <span className="material-symbols-outlined text-sm">payments</span>
              DEPOSIT
            </button>
            <button onClick={() => { setShowWithdraw(true); setWithdrawMethod(paymentMethods[0]?.id || ""); }} className="flex items-center justify-center gap-2 py-3 bg-surface-container-high text-on-surface font-headline font-bold text-xs uppercase tracking-widest rounded-lg border border-outline-variant active:scale-95 transition-transform">
              <span className="material-symbols-outlined text-sm">north_east</span>
              WITHDRAW
            </button>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <nav className="flex border-b border-outline-variant/30 overflow-x-auto hide-scrollbar">
        {tabs.map((t) => (
          <button key={t.key} onClick={() => setActiveTab(t.key)} className={`flex items-center gap-1.5 px-4 py-3 font-headline font-bold text-[10px] uppercase tracking-widest whitespace-nowrap transition-colors ${activeTab === t.key ? "text-primary-container border-b-2 border-primary-container" : "text-on-surface-variant/60"}`}>
            <span className="material-symbols-outlined text-sm">{t.icon}</span>
            {t.label}
          </button>
        ))}
      </nav>

      {/* TAB: Overview */}
      {activeTab === "overview" && (
        <>
          {/* Stats Grid */}
          <section className="grid grid-cols-2 gap-3">
            <div className="col-span-2 glass-card rounded-lg p-4 flex justify-between items-center">
              <div>
                <p className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant">Win Rate</p>
                <p className="text-2xl font-headline font-bold text-tertiary-fixed-dim">{winRate}%</p>
              </div>
              <div className="w-24 h-1 bg-surface-container-highest rounded-full overflow-hidden">
                <div className="h-full bg-tertiary-fixed-dim shadow-[0_0_8px_rgba(255,184,0,0.5)]" style={{ width: `${Math.min(parseFloat(winRate), 100)}%` }} />
              </div>
            </div>
            <div className="glass-card rounded-lg p-4">
              <p className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant">Total Deposited</p>
              <p className="text-xl font-headline font-bold text-on-surface mt-1">৳{walletData.totalDeposits.toLocaleString()}</p>
            </div>
            <div className="glass-card rounded-lg p-4">
              <p className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant">Total Withdrawn</p>
              <p className="text-xl font-headline font-bold text-primary-container mt-1">৳{walletData.totalWithdrawals.toLocaleString()}</p>
            </div>
          </section>

          {/* Recent Transactions */}
          <section className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-headline font-extrabold text-sm uppercase tracking-[0.15em] text-primary-container">Recent Transactions</h3>
              <button onClick={() => setActiveTab("history")} className="text-[10px] font-label font-medium text-primary-container">VIEW ALL â†’</button>
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
                      <tr key={t._id}>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <span className={`material-symbols-outlined text-lg ${t.type === "deposit" ? "text-primary-container" : "text-secondary-container"}`}>
                              {t.type === "deposit" ? "south_west" : "north_east"}
                            </span>
                            <div>
                              <span className="capitalize">{t.type}</span>
                              <p className="text-[9px] text-on-surface-variant">{new Date(t.createdAt).toLocaleDateString()}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 font-headline font-bold">৳{(t.amount || 0).toLocaleString()}</td>
                        <td className="px-4 py-4 text-right">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${t.status === "approved" || t.status === "completed" ? "text-primary-container bg-primary-container/5" : t.status === "pending" ? "text-secondary-fixed-dim bg-secondary-container/10" : "text-error bg-error-container/10"}`}>{t.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {/* Quick Links */}
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
            {["all", "deposit", "withdraw"].map((f) => (
              <button key={f} onClick={() => { setTxnFilter(f); setTxnPage(1); }} className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest whitespace-nowrap border transition-all ${txnFilter === f ? "bg-primary-container/20 text-primary-container border-primary-container/40" : "bg-surface-container-high border-outline-variant/20 text-on-surface-variant"}`}>{f}</button>
            ))}
          </div>
          {historyLoading ? (
            <div className="glass-card rounded-lg p-8 text-center">
              <div className="w-6 h-6 border-2 border-primary-container border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <p className="text-xs text-on-surface-variant">Loading transactions...</p>
            </div>
          ) : allTxns.length === 0 ? (
            <div className="glass-card rounded-lg p-8 text-center">
              <span className="material-symbols-outlined text-on-surface-variant/30 text-4xl mb-2 block">receipt_long</span>
              <p className="text-xs text-on-surface-variant">No {txnFilter === "all" ? "" : txnFilter} transactions found.</p>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                {allTxns.map((t) => (
                  <div key={t._id} className="glass-card rounded-lg p-4 flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${t.type === "deposit" ? "bg-primary-container/10" : "bg-secondary-container/10"}`}>
                      <span className={`material-symbols-outlined text-xl ${t.type === "deposit" ? "text-primary-container" : "text-secondary-container"}`}>
                        {t.type === "deposit" ? "south_west" : "north_east"}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <p className="text-xs font-bold capitalize">{t.type}</p>
                        <p className={`text-sm font-headline font-bold ${t.type === "withdraw" ? "text-secondary-container" : "text-primary-container"}`}>{t.type === "withdraw" ? "-" : "+"}৳{(t.amount || 0).toLocaleString()}</p>
                      </div>
                      <div className="flex justify-between items-center mt-1">
                        <p className="text-[10px] text-on-surface-variant truncate mr-2">{(t.paymentMethod || "").toUpperCase()}{t.reference ? ` â€¢ ${t.reference}` : ""}</p>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase shrink-0 ${t.status === "approved" || t.status === "completed" ? "text-primary-container bg-primary-container/5" : t.status === "pending" ? "text-secondary-fixed-dim bg-secondary-container/10" : "text-error bg-error-container/10"}`}>{t.status}</span>
                      </div>
                      <p className="text-[9px] text-on-surface-variant/60 mt-1">{new Date(t.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
              {/* Pagination */}
              {txnPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-2">
                  <button disabled={txnPage <= 1} onClick={() => { setTxnPage((p) => p - 1); loadHistory(txnPage - 1, txnFilter); }} className="px-3 py-1.5 rounded text-xs font-bold border border-outline-variant/20 bg-surface-container-high disabled:opacity-30 active:scale-95 transition-transform">Prev</button>
                  <span className="text-[10px] text-on-surface-variant font-headline">Page {txnPage} of {txnPages} ({txnTotal} total)</span>
                  <button disabled={txnPage >= txnPages} onClick={() => { setTxnPage((p) => p + 1); loadHistory(txnPage + 1, txnFilter); }} className="px-3 py-1.5 rounded text-xs font-bold border border-outline-variant/20 bg-surface-container-high disabled:opacity-30 active:scale-95 transition-transform">Next</button>
                </div>
              )}
            </>
          )}
        </section>
      )}

      {/* TAB: Bonuses */}
      {activeTab === "bonuses" && (
        <section className="space-y-4">
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
                  {bonus.minDeposit > 0 && <p className="text-[9px] text-on-surface-variant">Min: ৳{bonus.minDeposit}</p>}
                  <p className="text-[9px] text-on-surface-variant">Max: ৳{bonus.maxBonus}</p>
                </div>
                <button onClick={() => { setPromoCode(bonus.code); setDepositMethod(paymentMethods[0]?.id || ""); setShowDeposit(true); }} className="px-3 py-1.5 bg-surface-container-high text-on-surface text-[10px] font-bold uppercase tracking-wider rounded border border-outline-variant/30 active:scale-95 transition-transform">Use Code</button>
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
              { label: "Total Deposited", value: `৳${walletData.totalDeposits.toLocaleString()}`, color: "text-on-surface" },
              { label: "Total Withdrawn", value: `৳${walletData.totalWithdrawals.toLocaleString()}`, color: "text-primary-container" },
              { label: "Total Won", value: `৳${walletData.totalWinnings.toLocaleString()}`, color: "text-tertiary-fixed-dim" },
              { label: "Total Lost", value: `৳${walletData.totalLosses.toLocaleString()}`, color: "text-error" },
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
                { label: "Net Profit/Loss", value: `৳${(walletData.totalWinnings - (walletData.totalDeposits - walletData.totalWithdrawals)).toLocaleString()}`, color: walletData.totalWinnings >= (walletData.totalDeposits - walletData.totalWithdrawals) ? "text-primary-container" : "text-error" },
                { label: "Win Rate", value: `${winRate}%`, color: "text-tertiary-fixed-dim" },
                { label: "Total Bets", value: walletData.totalBets, color: "text-on-surface" },
                { label: "Total Wins", value: walletData.totalWins, color: "text-primary-container" },
                { label: "Total Losses", value: walletData.totalLosses, color: "text-error" },
                { label: "Current Balance", value: `৳${walletData.balance.toLocaleString()}`, color: "text-primary-container" },
                { label: "Pending Transactions", value: walletData.pendingCount, color: walletData.pendingCount > 0 ? "text-tertiary-fixed-dim" : "text-on-surface" },
                { label: "Member Since", value: user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "â€”", color: "text-on-surface-variant" },
              ].map((item, i) => (
                <div key={i} className="flex justify-between items-center py-2 border-b border-outline-variant/10 last:border-0">
                  <span className="text-[11px] text-on-surface-variant">{item.label}</span>
                  <span className={`text-xs font-headline font-bold ${item.color}`}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* DEPOSIT MODAL */}
      {showDeposit && (
        <div className="fixed inset-0 z-[70] flex items-end justify-center" onClick={() => !depositLoading && !depositSuccess && setShowDeposit(false)}>
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <div className="relative w-full max-w-[460px] bg-[#0A0A0F] rounded-t-2xl p-5 pb-8 space-y-5 border-t border-primary-container/20 max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            {depositSuccess ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-primary-container/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary-container text-3xl">check_circle</span>
                </div>
                <p className="font-headline font-bold text-lg text-primary-container">Deposit Request Submitted!</p>
                <p className="text-xs text-on-surface-variant">Your deposit is pending admin approval.</p>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center">
                  <h3 className="font-headline font-extrabold text-lg uppercase tracking-tight text-on-surface">Deposit Funds</h3>
                  <button onClick={() => setShowDeposit(false)} className="text-on-surface-variant p-1"><span className="material-symbols-outlined">close</span></button>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {[500, 1000, 5000, 10000].map((amt) => (
                    <button key={amt} onClick={() => setDepositAmt(String(amt))} className={`py-2.5 rounded text-xs font-bold font-headline border transition-all active:scale-95 ${depositAmt === String(amt) ? "bg-primary-container/20 text-primary-container border-primary-container/40" : "bg-surface-container-high border-outline-variant/20 text-on-surface"}`}>৳{amt.toLocaleString()}</button>
                  ))}
                </div>
                <div className="space-y-2">
                  <label className="font-headline text-[10px] font-bold uppercase tracking-[0.2em] text-primary-container">Amount (৳)</label>
                  <input type="number" value={depositAmt} onChange={(e) => setDepositAmt(e.target.value)} placeholder="Min ৳100" min="100" max="500000" className="w-full bg-surface-container-lowest/60 px-4 py-3 rounded text-sm font-headline text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-1 focus:ring-primary-container/40 border border-outline-variant/20" />
                </div>
                <div className="space-y-2">
                  <label className="font-headline text-[10px] font-bold uppercase tracking-[0.2em] text-primary-container">Payment Method</label>
                  <div className="grid grid-cols-2 gap-2">
                    {paymentMethods.map((m) => (
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
                    <p className="text-[10px] text-tertiary-fixed-dim flex items-center gap-1"><span className="material-symbols-outlined text-sm">check_circle</span>Promo code valid!</p>
                  )}
                </div>
                <button onClick={handleDeposit} disabled={depositLoading || !depositAmt || parseFloat(depositAmt) < 100} className="w-full py-3.5 bg-[linear-gradient(90deg,#00F5FF_0%,#FF2D78_100%)] font-headline text-xs font-black uppercase tracking-[0.18em] text-on-primary rounded-lg shadow-[0_0_20px_rgba(0,245,255,0.3)] active:scale-[0.98] transition-all disabled:opacity-40 disabled:active:scale-100">
                  {depositLoading ? "Processing..." : `DEPOSIT ৳${depositAmt || "0"}`}
                </button>
                <p className="text-[9px] text-center text-on-surface-variant/50">Deposits are credited after admin approval. Min ৳100, Max ৳500,000</p>
              </>
            )}
          </div>
        </div>
      )}

      {/* WITHDRAW MODAL */}
      {showWithdraw && (
        <div className="fixed inset-0 z-[70] flex items-end justify-center" onClick={() => !withdrawLoading && !withdrawSuccess && setShowWithdraw(false)}>
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <div className="relative w-full max-w-[460px] bg-[#0A0A0F] rounded-t-2xl p-5 pb-8 space-y-5 border-t border-primary-container/20 max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            {withdrawSuccess ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-primary-container/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary-container text-3xl">check_circle</span>
                </div>
                <p className="font-headline font-bold text-lg text-primary-container">Withdrawal Requested!</p>
                <p className="text-xs text-on-surface-variant">Processing within 1-24 hours.</p>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center">
                  <h3 className="font-headline font-extrabold text-lg uppercase tracking-tight text-on-surface">Withdraw Funds</h3>
                  <button onClick={() => setShowWithdraw(false)} className="text-on-surface-variant p-1"><span className="material-symbols-outlined">close</span></button>
                </div>
                <div className="bg-surface-container-lowest/50 rounded-lg p-3 border border-primary-container/20">
                  <p className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant">Available Balance</p>
                  <p className="text-xl font-headline font-bold text-primary-container">৳{walletData.balance.toLocaleString()}</p>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {[500, 1000, 5000, 10000].map((amt) => (
                    <button key={amt} onClick={() => setWithdrawAmt(String(Math.min(amt, walletData.balance)))} disabled={walletData.balance < 100} className={`py-2.5 rounded text-xs font-bold font-headline border transition-all active:scale-95 disabled:opacity-30 ${withdrawAmt === String(amt) ? "bg-primary-container/20 text-primary-container border-primary-container/40" : "bg-surface-container-high border-outline-variant/20 text-on-surface"}`}>৳{amt.toLocaleString()}</button>
                  ))}
                </div>
                <div className="space-y-2">
                  <label className="font-headline text-[10px] font-bold uppercase tracking-[0.2em] text-primary-container">Amount (৳)</label>
                  <input type="number" value={withdrawAmt} onChange={(e) => setWithdrawAmt(e.target.value)} placeholder="Min ৳100" min="100" max={walletData.balance} className="w-full bg-surface-container-lowest/60 px-4 py-3 rounded text-sm font-headline text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-1 focus:ring-primary-container/40 border border-outline-variant/20" />
                  {parseFloat(withdrawAmt) > walletData.balance && (
                    <p className="text-[10px] text-error flex items-center gap-1"><span className="material-symbols-outlined text-sm">error</span>Insufficient balance</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="font-headline text-[10px] font-bold uppercase tracking-[0.2em] text-primary-container">Withdraw To</label>
                  <div className="grid grid-cols-2 gap-2">
                    {paymentMethods.map((m) => (
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
                <button onClick={handleWithdraw} disabled={withdrawLoading || !withdrawAmt || parseFloat(withdrawAmt) < 100 || parseFloat(withdrawAmt) > walletData.balance || !withdrawAccount.trim()} className="w-full py-3.5 bg-[linear-gradient(90deg,#00F5FF_0%,#FF2D78_100%)] font-headline text-xs font-black uppercase tracking-[0.18em] text-on-primary rounded-lg shadow-[0_0_20px_rgba(0,245,255,0.3)] active:scale-[0.98] transition-all disabled:opacity-40 disabled:active:scale-100">
                  {withdrawLoading ? "Processing..." : `WITHDRAW ৳${withdrawAmt || "0"}`}
                </button>
                <p className="text-[9px] text-center text-on-surface-variant/50">Withdrawals processed within 1-24 hours. Min ৳100</p>
              </>
            )}
          </div>
        </div>
      )}

      {/* Loading overlay */}
      {loading && (
        <div className="fixed inset-0 z-50 bg-surface/80 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-primary-container border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </main>
  );
};

export default WalletPage;
