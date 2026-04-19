import { useState, useEffect } from "react";
import { getPaymentMethods, createPaymentMethod, updatePaymentMethod, deletePaymentMethod } from "../../services/api";

const ALL_PAYMENT_METHODS = [
  // Mobile Banking
  { name: "bKash", type: "mobile", icon: "account_balance_wallet", color: "#D8126B" },
  { name: "Nagad", type: "mobile", icon: "payments", color: "#F7941D" },
  { name: "Rocket", type: "mobile", icon: "rocket_launch", color: "#8E24AA" },
  { name: "Upay", type: "mobile", icon: "contactless", color: "#00BCD4" },
  { name: "SureCash", type: "mobile", icon: "phone_android", color: "#E91E63" },
  { name: "mCash", type: "mobile", icon: "smartphone", color: "#4CAF50" },
  { name: "MYCash", type: "mobile", icon: "mobile_friendly", color: "#FF5722" },
  { name: "OK Wallet", type: "mobile", icon: "wallet", color: "#009688" },
  { name: "Tap", type: "mobile", icon: "tap_and_play", color: "#3F51B5" },
  { name: "Cellfin", type: "mobile", icon: "cell_tower", color: "#607D8B" },
  { name: "GCash", type: "mobile", icon: "account_balance_wallet", color: "#0050AE" },
  { name: "GrabPay", type: "mobile", icon: "payments", color: "#00B14F" },
  { name: "Dana", type: "mobile", icon: "wallet", color: "#108EE9" },
  { name: "OVO", type: "mobile", icon: "contactless", color: "#4C3494" },
  { name: "GoPay", type: "mobile", icon: "phone_android", color: "#00AED6" },
  { name: "M-Pesa", type: "mobile", icon: "smartphone", color: "#4CAF50" },
  { name: "Easypaisa", type: "mobile", icon: "payments", color: "#00A651" },
  { name: "JazzCash", type: "mobile", icon: "account_balance_wallet", color: "#ED1C24" },
  { name: "Wave", type: "mobile", icon: "waves", color: "#1A237E" },
  { name: "Orange Money", type: "mobile", icon: "monetization_on", color: "#FF6600" },
  { name: "MTN MoMo", type: "mobile", icon: "phone_android", color: "#FFCC00" },
  { name: "Paytm", type: "mobile", icon: "account_balance_wallet", color: "#00B9F5" },
  { name: "PhonePe", type: "mobile", icon: "phone_iphone", color: "#5F259F" },
  { name: "Google Pay", type: "mobile", icon: "g_mobiledata", color: "#4285F4" },
  { name: "Apple Pay", type: "mobile", icon: "phone_iphone", color: "#333333" },
  { name: "Samsung Pay", type: "mobile", icon: "smartphone", color: "#1428A0" },
  // Bank Transfer
  { name: "Bank Transfer", type: "bank", icon: "account_balance", color: "#1976D2" },
  { name: "Wire Transfer", type: "bank", icon: "swap_horiz", color: "#0D47A1" },
  { name: "SWIFT", type: "bank", icon: "public", color: "#004D40" },
  { name: "SEPA", type: "bank", icon: "euro", color: "#1565C0" },
  { name: "ACH Transfer", type: "bank", icon: "account_balance", color: "#283593" },
  { name: "IMPS", type: "bank", icon: "flash_on", color: "#E65100" },
  { name: "NEFT", type: "bank", icon: "sync_alt", color: "#BF360C" },
  { name: "UPI", type: "bank", icon: "qr_code", color: "#00695C" },
  // Cards
  { name: "Visa", type: "card", icon: "credit_card", color: "#1A1F71" },
  { name: "Mastercard", type: "card", icon: "credit_card", color: "#EB001B" },
  { name: "American Express", type: "card", icon: "credit_card", color: "#006FCF" },
  { name: "Discover", type: "card", icon: "credit_card", color: "#FF6600" },
  { name: "UnionPay", type: "card", icon: "credit_card", color: "#D50032" },
  { name: "JCB", type: "card", icon: "credit_card", color: "#0E4C96" },
  { name: "Diners Club", type: "card", icon: "credit_card", color: "#004A97" },
  { name: "RuPay", type: "card", icon: "credit_card", color: "#F37021" },
  // Crypto
  { name: "USDT (Tether)", type: "crypto", icon: "currency_bitcoin", color: "#26A17B" },
  { name: "Bitcoin", type: "crypto", icon: "currency_bitcoin", color: "#F7931A" },
  { name: "Ethereum", type: "crypto", icon: "diamond", color: "#627EEA" },
  { name: "BNB", type: "crypto", icon: "hexagon", color: "#F3BA2F" },
  { name: "USDC", type: "crypto", icon: "paid", color: "#2775CA" },
  { name: "Litecoin", type: "crypto", icon: "toll", color: "#BFBBBB" },
  { name: "Ripple (XRP)", type: "crypto", icon: "sync", color: "#0085C0" },
  { name: "Dogecoin", type: "crypto", icon: "pets", color: "#C3A634" },
  { name: "Solana", type: "crypto", icon: "bolt", color: "#9945FF" },
  { name: "TRON (TRX)", type: "crypto", icon: "token", color: "#FF0013" },
  // E-Wallets & Online
  { name: "PayPal", type: "other", icon: "account_balance_wallet", color: "#003087" },
  { name: "Skrill", type: "other", icon: "wallet", color: "#872C8D" },
  { name: "Neteller", type: "other", icon: "account_balance_wallet", color: "#83C43E" },
  { name: "Perfect Money", type: "other", icon: "paid", color: "#F44336" },
  { name: "WebMoney", type: "other", icon: "language", color: "#036CB5" },
  { name: "Payeer", type: "other", icon: "payments", color: "#0068FF" },
  { name: "AstroPay", type: "other", icon: "star", color: "#3E47F9" },
  { name: "Paysafecard", type: "other", icon: "local_atm", color: "#00548F" },
  { name: "ecoPayz", type: "other", icon: "eco", color: "#018FE2" },
  { name: "Alipay", type: "other", icon: "account_balance_wallet", color: "#1677FF" },
  { name: "WeChat Pay", type: "other", icon: "chat", color: "#07C160" },
  { name: "Stripe", type: "other", icon: "credit_score", color: "#635BFF" },
  { name: "Venmo", type: "other", icon: "payments", color: "#3D95CE" },
  { name: "Zelle", type: "other", icon: "swap_horiz", color: "#6D1ED4" },
  { name: "Cash App", type: "other", icon: "attach_money", color: "#00D632" },
  { name: "Wise", type: "other", icon: "public", color: "#9FE870" },
  { name: "Revolut", type: "other", icon: "autorenew", color: "#0075EB" },
  { name: "Klarna", type: "other", icon: "shopping_bag", color: "#FFB3C7" },
  { name: "Afterpay", type: "other", icon: "schedule", color: "#B2FCE4" },
];

const TYPE_LABELS = { mobile: "Mobile Banking", bank: "Bank Transfer", card: "Cards", crypto: "Cryptocurrency", other: "E-Wallets & Online" };
const TYPE_ORDER = ["mobile", "bank", "card", "crypto", "other"];

export default function PaymentMethodsPage() {
  const [methods, setMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [saving, setSaving] = useState(null);

  const loadMethods = async () => {
    try {
      setLoading(true);
      const res = await getPaymentMethods();
      setMethods(res.methods || []);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  useEffect(() => { loadMethods(); }, []);
  useEffect(() => { const handler = (e) => { if (e.key === 'Escape') setShowModal(false); }; window.addEventListener('keydown', handler); return () => window.removeEventListener('keydown', handler); }, [showModal]);


  const isAdded = (name) => methods.some(m => m.name.toLowerCase() === name.toLowerCase());

  const handleAdd = async (preset) => {
    if (isAdded(preset.name)) return;
    setSaving(preset.name);
    try {
      await createPaymentMethod({ name: preset.name, type: preset.type, icon: preset.icon, isActive: true });
      await loadMethods();
    } catch (err) { alert(err.message || "Failed to add"); }
    setSaving(null);
  };

  const handleToggle = async (method) => {
    setSaving(method.name);
    try {
      await updatePaymentMethod(method._id, { isActive: !method.isActive });
      await loadMethods();
    } catch (err) { console.error(err); } finally { setSaving(null); }
  };

  const handleDelete = async (method) => {
    if (!confirm(`Remove ${method.name}?`)) return;
    setSaving(method.name);
    try {
      await deletePaymentMethod(method._id);
      await loadMethods();
    } catch (err) { console.error(err); } finally { setSaving(null); }
  };

  const activeCount = methods.filter(m => m.isActive).length;
  const totalCount = methods.length;

  const filteredPresets = ALL_PAYMENT_METHODS.filter(p => {
    if (filterType !== "all" && p.type !== filterType) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const groupedPresets = TYPE_ORDER.reduce((acc, type) => {
    const items = filteredPresets.filter(p => p.type === type);
    if (items.length > 0) acc.push({ type, label: TYPE_LABELS[type], items });
    return acc;
  }, []);

  return (
    <div className="font-body">
      <div className="max-w-6xl mx-auto pb-16">
        {/* Header */}
        <section className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between mb-10">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-100 font-headline tracking-tight">
              Payment Methods
            </h1>
            <p className="text-slate-400 mt-2 text-sm sm:text-base">
              Manage which payment methods are available for users on the platform.
            </p>
          </div>
          <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-gradient-to-r from-primary to-primary-container text-on-primary px-6 py-3 rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all font-bold text-sm">
            <span className="material-symbols-outlined">add</span>
            Add Payment Method
          </button>
        </section>

        {/* Stats */}
        <section className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
          {[
            { label: "Active", value: activeCount, icon: "check_circle", cls: "bg-secondary/10 text-secondary" },
            { label: "Inactive", value: totalCount - activeCount, icon: "pause_circle", cls: "bg-amber-500/10 text-amber-400" },
            { label: "Total Added", value: totalCount, icon: "account_balance", cls: "bg-primary/10 text-primary" },
          ].map(s => (
            <article key={s.label} className="glass-card p-5 rounded-xl border-none flex items-center gap-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${s.cls}`}>
                <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>{s.icon}</span>
              </div>
              <div>
                <p className="text-slate-400 text-xs font-medium">{s.label}</p>
                <p className="text-2xl font-black text-on-surface">{String(s.value).padStart(2, "0")}</p>
              </div>
            </article>
          ))}
        </section>

        {/* Added Methods */}
        {loading ? (
          <div className="text-center py-16 text-slate-400">Loading...</div>
        ) : methods.length === 0 ? (
          <div className="text-center py-20">
            <span className="material-symbols-outlined text-6xl text-slate-600 mb-4 block">account_balance_wallet</span>
            <p className="text-slate-400 text-lg font-medium">No payment methods added yet</p>
            <p className="text-slate-500 text-sm mt-1">Click "Add Payment Method" to get started</p>
          </div>
        ) : (
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {methods.map((method) => {
              const preset = ALL_PAYMENT_METHODS.find(p => p.name.toLowerCase() === method.name.toLowerCase());
              const color = preset?.color || "#ffc174";
              const icon = preset?.icon || method.icon || "account_balance_wallet";
              const isSaving = saving === method.name;

              return (
                <article key={method._id} className="bg-surface-container rounded-xl overflow-hidden hover:shadow-2xl hover:shadow-black/40 transition-all duration-300">
                  <div className="h-1.5" style={{ background: `linear-gradient(to right, ${color}, ${color}99)` }} />
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${color}1A` }}>
                          <span className="material-symbols-outlined text-2xl" style={{ color }}>{icon}</span>
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-on-surface">{method.name}</h3>
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                            {TYPE_LABELS[method.type] || method.type}
                          </p>
                        </div>
                      </div>
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded ${method.isActive ? "bg-secondary/10 text-secondary" : "bg-amber-500/10 text-amber-400"}`}>
                        {method.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <button
                        disabled={isSaving}
                        onClick={() => handleToggle(method)}
                        className={`flex-1 py-2.5 rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50 ${
                          method.isActive
                            ? "bg-amber-500/10 text-amber-400 hover:bg-amber-500/20"
                            : "bg-secondary/10 text-secondary hover:bg-secondary/20"
                        }`}
                      >
                        <span className="material-symbols-outlined text-sm">{method.isActive ? "pause" : "play_arrow"}</span>
                        {method.isActive ? "Deactivate" : "Activate"}
                      </button>
                      <button
                        disabled={isSaving}
                        onClick={() => handleDelete(method)}
                        className="w-11 h-10 rounded-lg bg-surface-container-high text-error hover:bg-error/10 transition-all flex items-center justify-center disabled:opacity-50"
                      >
                        <span className="material-symbols-outlined text-lg">delete</span>
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </section>
        )}
      </div>

      {/* Add Payment Method Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-surface-container w-full max-w-3xl max-h-[85vh] rounded-2xl overflow-hidden shadow-2xl flex flex-col">
            <div className="px-6 py-5 bg-surface-container-high flex justify-between items-center shrink-0">
              <div>
                <h3 className="text-xl font-bold text-on-surface">Add Payment Method</h3>
                <p className="text-slate-400 text-sm mt-1">Choose from worldwide payment methods</p>
              </div>
              <button onClick={() => { setShowModal(false); setSearch(""); setFilterType("all"); }} className="text-slate-400 hover:text-on-surface transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="px-6 py-4 border-b border-white/5 shrink-0">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">search</span>
                  <input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search payment methods..."
                    className="w-full bg-surface-container-low border-none rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-primary/50 text-on-surface text-sm"
                  />
                </div>
                <div className="flex gap-2 flex-wrap">
                  {[{ key: "all", label: "All" }, ...TYPE_ORDER.map(t => ({ key: t, label: TYPE_LABELS[t] }))].map(f => (
                    <button
                      key={f.key}
                      onClick={() => setFilterType(f.key)}
                      className={`px-3 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                        filterType === f.key
                          ? "bg-primary text-on-primary"
                          : "bg-surface-container-low text-slate-400 hover:text-on-surface"
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="overflow-y-auto flex-1 px-6 py-4">
              {groupedPresets.length === 0 ? (
                <div className="text-center py-12 text-slate-400">No methods found</div>
              ) : (
                groupedPresets.map(group => (
                  <div key={group.type} className="mb-6 last:mb-0">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3 flex items-center gap-2">
                      <span className="w-6 h-px bg-slate-700" />
                      {group.label}
                      <span className="text-slate-600">({group.items.length})</span>
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {group.items.map(preset => {
                        const added = isAdded(preset.name);
                        const isSavingThis = saving === preset.name;
                        return (
                          <div
                            key={preset.name}
                            className={`flex items-center justify-between p-3 rounded-xl transition-all ${
                              added ? "bg-secondary/5 ring-1 ring-secondary/20" : "bg-surface-container-low hover:bg-surface-container-high"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${preset.color}1A` }}>
                                <span className="material-symbols-outlined text-lg" style={{ color: preset.color }}>{preset.icon}</span>
                              </div>
                              <span className="text-sm font-semibold text-on-surface">{preset.name}</span>
                            </div>
                            {added ? (
                              <span className="text-[10px] font-bold uppercase tracking-wider text-secondary bg-secondary/10 px-2 py-1 rounded">Added</span>
                            ) : (
                              <button
                                disabled={isSavingThis}
                                onClick={() => handleAdd(preset)}
                                className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-bold hover:bg-primary/20 transition-all disabled:opacity-50 flex items-center gap-1"
                              >
                                <span className="material-symbols-outlined text-sm">add</span>
                                {isSavingThis ? "Adding..." : "Add"}
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

