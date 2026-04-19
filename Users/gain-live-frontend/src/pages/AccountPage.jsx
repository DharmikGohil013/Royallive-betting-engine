import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../contexts/AuthContext";
import { getProfile, updateProfile, changePassword, getTransactions } from "../services/api";

const AccountPage = () => {
  const { user, setUser, isAuthenticated } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);

  // Edit form
  const [editForm, setEditForm] = useState({ email: "", dateOfBirth: "", address: "", city: "", country: "" });

  // Password
  const [pwForm, setPwForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [pwLoading, setPwLoading] = useState(false);
  const [showPw, setShowPw] = useState({ current: false, new: false, confirm: false });

  // Activity
  const [recentTxns, setRecentTxns] = useState([]);
  const [txnLoading, setTxnLoading] = useState(false);

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getProfile();
      setProfile(data.user);
      setEditForm({
        email: data.user.email || "",
        dateOfBirth: data.user.dateOfBirth ? data.user.dateOfBirth.substring(0, 10) : "",
        address: data.user.address || "",
        city: data.user.city || "",
        country: data.user.country || "",
      });
    } catch {
      setMsg({ type: "error", text: "Failed to load profile" });
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchActivity = useCallback(async () => {
    try {
      setTxnLoading(true);
      const data = await getTransactions({ limit: 10 });
      setRecentTxns(data.transactions || []);
    } catch {} finally {
      setTxnLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchProfile();
      fetchActivity();
    }
  }, [isAuthenticated, fetchProfile, fetchActivity]);

  const handleSave = async () => {
    try {
      setSaving(true);
      setMsg(null);
      const data = await updateProfile(editForm);
      setProfile(data.user);
      const stored = JSON.parse(localStorage.getItem("gain-live-user") || "{}");
      const updated = { ...stored, ...data.user };
      localStorage.setItem("gain-live-user", JSON.stringify(updated));
      setUser(updated);
      setEditing(false);
      setMsg({ type: "success", text: "Profile updated successfully" });
      setTimeout(() => setMsg(null), 3000);
    } catch (err) {
      setMsg({ type: "error", text: err.message || "Failed to update" });
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      setMsg({ type: "error", text: "New passwords don't match" });
      return;
    }
    if (pwForm.newPassword.length < 6) {
      setMsg({ type: "error", text: "Password must be at least 6 characters" });
      return;
    }
    try {
      setPwLoading(true);
      setMsg(null);
      await changePassword(pwForm.currentPassword, pwForm.newPassword);
      setPwForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setMsg({ type: "success", text: "Password changed successfully" });
      setTimeout(() => setMsg(null), 3000);
    } catch (err) {
      setMsg({ type: "error", text: err.message || "Failed to change password" });
    } finally {
      setPwLoading(false);
    }
  };

  const p = profile || user || {};
  const memberSince = p.createdAt ? new Date(p.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "â€”";
  const lastLogin = p.lastLogin ? new Date(p.lastLogin).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : "â€”";

  const tabs = [
    { key: "profile", label: "Profile", icon: "person" },
    { key: "security", label: "Security", icon: "lock" },
    { key: "stats", label: "Stats", icon: "analytics" },
    { key: "activity", label: "Activity", icon: "history" },
  ];

  if (!isAuthenticated) {
    return (
      <main className="pt-24 pb-28 px-4 max-w-md mx-auto text-center space-y-4">
        <span className="material-symbols-outlined text-on-surface-variant/30 text-6xl block">lock</span>
        <p className="text-on-surface-variant text-sm">Please login to view your account</p>
      </main>
    );
  }

  return (
    <main className="pt-24 pb-28 px-4 max-w-md mx-auto space-y-5">
      {/* Message Toast */}
      {msg && (
        <div className={`fixed top-20 left-1/2 -translate-x-1/2 z-[80] max-w-[360px] w-[90%] px-4 py-3 rounded-lg text-xs font-bold flex items-center gap-2 shadow-lg border ${msg.type === "success" ? "bg-primary-container/20 border-primary-container/30 text-primary-container" : "bg-error/20 border-error/30 text-error"}`}>
          <span className="material-symbols-outlined text-sm">{msg.type === "success" ? "check_circle" : "error"}</span>
          {msg.text}
        </div>
      )}

      {/* Profile Header Card */}
      <section className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-container to-secondary-container rounded-xl blur opacity-20" />
        <div className="relative glass-card rounded-xl p-5 overflow-hidden">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-full border-2 border-[#00F5FF] p-0.5 shadow-[0_0_20px_rgba(0,245,255,0.4)]">
                <div className="w-full h-full rounded-full bg-surface-container-high flex items-center justify-center">
                  <span className="material-symbols-outlined text-[#00F5FF] text-3xl">person</span>
                </div>
              </div>
              <div className="absolute -bottom-1 right-0 bg-primary-container text-on-primary-container text-[8px] font-black px-1.5 py-0.5 rounded-sm border border-background shadow-lg">
                {p.status === "active" ? "ACTIVE" : (p.status || "").toUpperCase()}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-headline font-extrabold text-xl text-primary-container tracking-tight truncate">
                {(p.username || "USER").toUpperCase()}
              </h2>
              <p className="text-[11px] text-on-surface-variant truncate">{p.mobile || "â€”"}</p>
              <p className="text-[10px] text-on-surface-variant/60 truncate">{p.email || "No email set"}</p>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="material-symbols-outlined text-tertiary-fixed-dim text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>military_tech</span>
                <span className="text-[9px] font-label font-bold uppercase tracking-widest text-tertiary-fixed-dim">
                  {(p.totalBets || 0) >= 100 ? "VIP ELITE" : (p.totalBets || 0) >= 20 ? "VIP MEMBER" : "MEMBER"}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Stats Row */}
          <div className="grid grid-cols-3 gap-2 mt-4">
            <div className="bg-surface-container-lowest/50 rounded-lg p-3 text-center">
              <p className="text-lg font-headline font-black text-primary-container">৳{(p.balance || 0).toLocaleString()}</p>
              <p className="text-[8px] font-label uppercase tracking-widest text-on-surface-variant">Balance</p>
            </div>
            <div className="bg-surface-container-lowest/50 rounded-lg p-3 text-center">
              <p className="text-lg font-headline font-black text-on-surface">{p.totalBets || 0}</p>
              <p className="text-[8px] font-label uppercase tracking-widest text-on-surface-variant">Total Bets</p>
            </div>
            <div className="bg-surface-container-lowest/50 rounded-lg p-3 text-center">
              <p className="text-lg font-headline font-black text-tertiary-fixed-dim">{p.totalWins || 0}</p>
              <p className="text-[8px] font-label uppercase tracking-widest text-on-surface-variant">Wins</p>
            </div>
          </div>

          {/* Member Info */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-outline-variant/10">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-on-surface-variant/40 text-sm">calendar_month</span>
              <span className="text-[10px] text-on-surface-variant">Member since {memberSince}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-[9px] text-on-surface-variant/40">Last login: {lastLogin}</span>
            </div>
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

      {/* TAB: Profile */}
      {activeTab === "profile" && (
        <section className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-headline font-extrabold text-sm uppercase tracking-[0.15em] text-primary-container">Personal Details</h3>
            {!editing ? (
              <button onClick={() => setEditing(true)} className="flex items-center gap-1 px-3 py-1.5 bg-primary-container/10 text-primary-container text-[10px] font-bold uppercase tracking-wider rounded border border-primary-container/20 active:scale-95 transition-transform">
                <span className="material-symbols-outlined text-sm">edit</span>
                Edit
              </button>
            ) : (
              <div className="flex gap-2">
                <button onClick={() => { setEditing(false); setEditForm({ email: p.email || "", dateOfBirth: p.dateOfBirth ? p.dateOfBirth.substring(0, 10) : "", address: p.address || "", city: p.city || "", country: p.country || "" }); }} className="px-3 py-1.5 bg-surface-container-high text-on-surface text-[10px] font-bold uppercase rounded border border-outline-variant/20 active:scale-95 transition-transform">
                  Cancel
                </button>
                <button onClick={handleSave} disabled={saving} className="px-3 py-1.5 bg-primary-container text-on-primary text-[10px] font-bold uppercase rounded active:scale-95 transition-transform disabled:opacity-40">
                  {saving ? "Saving..." : "Save"}
                </button>
              </div>
            )}
          </div>

          <div className="glass-card rounded-lg overflow-hidden divide-y divide-outline-variant/10">
            {/* Username - read only */}
            <div className="px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary-container/60 text-lg">person</span>
                <div>
                  <p className="text-[9px] font-label uppercase tracking-widest text-on-surface-variant/60">Username</p>
                  <p className="text-sm font-headline font-bold text-on-surface">{p.username || "â€”"}</p>
                </div>
              </div>
              <span className="material-symbols-outlined text-on-surface-variant/20 text-sm">lock</span>
            </div>

            {/* Mobile - read only */}
            <div className="px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary-container/60 text-lg">phone</span>
                <div>
                  <p className="text-[9px] font-label uppercase tracking-widest text-on-surface-variant/60">Mobile</p>
                  <p className="text-sm font-headline font-bold text-on-surface">{p.mobile || "â€”"}</p>
                </div>
              </div>
              <span className="material-symbols-outlined text-on-surface-variant/20 text-sm">lock</span>
            </div>

            {/* Email - editable */}
            <div className="px-4 py-3">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary-container/60 text-lg">mail</span>
                <div className="flex-1">
                  <p className="text-[9px] font-label uppercase tracking-widest text-on-surface-variant/60">Email</p>
                  {editing ? (
                    <input type="email" value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} placeholder="Enter email" className="w-full bg-surface-container-lowest/60 px-3 py-1.5 rounded text-sm font-headline text-on-surface mt-1 focus:outline-none focus:ring-1 focus:ring-primary-container/40 border border-outline-variant/20" />
                  ) : (
                    <p className="text-sm font-headline font-bold text-on-surface">{p.email || "Not set"}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Date of Birth - editable */}
            <div className="px-4 py-3">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary-container/60 text-lg">cake</span>
                <div className="flex-1">
                  <p className="text-[9px] font-label uppercase tracking-widest text-on-surface-variant/60">Date of Birth</p>
                  {editing ? (
                    <input type="date" value={editForm.dateOfBirth} onChange={(e) => setEditForm({ ...editForm, dateOfBirth: e.target.value })} className="w-full bg-surface-container-lowest/60 px-3 py-1.5 rounded text-sm font-headline text-on-surface mt-1 focus:outline-none focus:ring-1 focus:ring-primary-container/40 border border-outline-variant/20" />
                  ) : (
                    <p className="text-sm font-headline font-bold text-on-surface">
                      {p.dateOfBirth ? new Date(p.dateOfBirth).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "Not set"}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Address - editable */}
            <div className="px-4 py-3">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary-container/60 text-lg">home</span>
                <div className="flex-1">
                  <p className="text-[9px] font-label uppercase tracking-widest text-on-surface-variant/60">Address</p>
                  {editing ? (
                    <input type="text" value={editForm.address} onChange={(e) => setEditForm({ ...editForm, address: e.target.value })} placeholder="Enter address" className="w-full bg-surface-container-lowest/60 px-3 py-1.5 rounded text-sm font-headline text-on-surface mt-1 focus:outline-none focus:ring-1 focus:ring-primary-container/40 border border-outline-variant/20" />
                  ) : (
                    <p className="text-sm font-headline font-bold text-on-surface">{p.address || "Not set"}</p>
                  )}
                </div>
              </div>
            </div>

            {/* City - editable */}
            <div className="px-4 py-3">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary-container/60 text-lg">location_city</span>
                <div className="flex-1">
                  <p className="text-[9px] font-label uppercase tracking-widest text-on-surface-variant/60">City</p>
                  {editing ? (
                    <input type="text" value={editForm.city} onChange={(e) => setEditForm({ ...editForm, city: e.target.value })} placeholder="Enter city" className="w-full bg-surface-container-lowest/60 px-3 py-1.5 rounded text-sm font-headline text-on-surface mt-1 focus:outline-none focus:ring-1 focus:ring-primary-container/40 border border-outline-variant/20" />
                  ) : (
                    <p className="text-sm font-headline font-bold text-on-surface">{p.city || "Not set"}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Country - editable */}
            <div className="px-4 py-3">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary-container/60 text-lg">public</span>
                <div className="flex-1">
                  <p className="text-[9px] font-label uppercase tracking-widest text-on-surface-variant/60">Country</p>
                  {editing ? (
                    <input type="text" value={editForm.country} onChange={(e) => setEditForm({ ...editForm, country: e.target.value })} placeholder="Enter country" className="w-full bg-surface-container-lowest/60 px-3 py-1.5 rounded text-sm font-headline text-on-surface mt-1 focus:outline-none focus:ring-1 focus:ring-primary-container/40 border border-outline-variant/20" />
                  ) : (
                    <p className="text-sm font-headline font-bold text-on-surface">{p.country || "Not set"}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Referral Code - read only */}
            <div className="px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary-container/60 text-lg">share</span>
                <div>
                  <p className="text-[9px] font-label uppercase tracking-widest text-on-surface-variant/60">My Referral Code</p>
                  <p className="text-sm font-headline font-bold text-tertiary-fixed-dim">{p.myReferralCode || "â€”"}</p>
                </div>
              </div>
              <button onClick={() => { navigator.clipboard.writeText(p.myReferralCode || ""); setMsg({ type: "success", text: "Copied!" }); setTimeout(() => setMsg(null), 1500); }} className="p-1.5 hover:bg-primary-container/10 rounded transition-colors">
                <span className="material-symbols-outlined text-primary-container/60 text-lg">content_copy</span>
              </button>
            </div>

            {/* Currency */}
            <div className="px-4 py-3 flex items-center gap-3">
              <span className="material-symbols-outlined text-primary-container/60 text-lg">payments</span>
              <div>
                <p className="text-[9px] font-label uppercase tracking-widest text-on-surface-variant/60">Currency</p>
                <p className="text-sm font-headline font-bold text-on-surface">{p.currency || "BDT"} (৳)</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* TAB: Security */}
      {activeTab === "security" && (
        <section className="space-y-4">
          <h3 className="font-headline font-extrabold text-sm uppercase tracking-[0.15em] text-primary-container">Change Password</h3>
          <div className="glass-card rounded-lg p-4 space-y-4">
            {[
              { key: "currentPassword", label: "Current Password", placeholder: "Enter current password", toggle: "current" },
              { key: "newPassword", label: "New Password", placeholder: "Enter new password", toggle: "new" },
              { key: "confirmPassword", label: "Confirm Password", placeholder: "Confirm new password", toggle: "confirm" },
            ].map((field) => (
              <div key={field.key} className="space-y-1">
                <label className="font-headline text-[10px] font-bold uppercase tracking-[0.2em] text-primary-container">{field.label}</label>
                <div className="relative">
                  <input
                    type={showPw[field.toggle] ? "text" : "password"}
                    value={pwForm[field.key]}
                    onChange={(e) => setPwForm({ ...pwForm, [field.key]: e.target.value })}
                    placeholder={field.placeholder}
                    className="w-full bg-surface-container-lowest/60 px-4 py-3 rounded text-sm font-headline text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-1 focus:ring-primary-container/40 border border-outline-variant/20 pr-10"
                  />
                  <button type="button" onClick={() => setShowPw((prev) => ({ ...prev, [field.toggle]: !prev[field.toggle] }))} className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-on-surface-variant/40">
                    <span className="material-symbols-outlined text-lg">{showPw[field.toggle] ? "visibility_off" : "visibility"}</span>
                  </button>
                </div>
              </div>
            ))}
            <button
              onClick={handleChangePassword}
              disabled={pwLoading || !pwForm.currentPassword || !pwForm.newPassword || !pwForm.confirmPassword}
              className="w-full py-3 bg-primary-container text-on-primary font-headline text-xs font-black uppercase tracking-[0.18em] rounded-lg active:scale-[0.98] transition-all disabled:opacity-40"
            >
              {pwLoading ? "Changing..." : "Change Password"}
            </button>
          </div>

          <h3 className="font-headline font-extrabold text-sm uppercase tracking-[0.15em] text-primary-container mt-6">Account Info</h3>
          <div className="glass-card rounded-lg overflow-hidden divide-y divide-outline-variant/10">
            <div className="px-4 py-3 flex justify-between items-center">
              <span className="text-[11px] text-on-surface-variant">Account Status</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${p.status === "active" ? "text-primary-container bg-primary-container/10" : "text-error bg-error/10"}`}>{p.status || "active"}</span>
            </div>
            <div className="px-4 py-3 flex justify-between items-center">
              <span className="text-[11px] text-on-surface-variant">Login Count</span>
              <span className="text-xs font-headline font-bold text-on-surface">{p.loginCount || 0}</span>
            </div>
            <div className="px-4 py-3 flex justify-between items-center">
              <span className="text-[11px] text-on-surface-variant">Last Login</span>
              <span className="text-xs font-headline font-bold text-on-surface">{lastLogin}</span>
            </div>
            <div className="px-4 py-3 flex justify-between items-center">
              <span className="text-[11px] text-on-surface-variant">Member Since</span>
              <span className="text-xs font-headline font-bold text-on-surface">{memberSince}</span>
            </div>
          </div>
        </section>
      )}

      {/* TAB: Stats */}
      {activeTab === "stats" && (
        <section className="space-y-4">
          <h3 className="font-headline font-extrabold text-sm uppercase tracking-[0.15em] text-primary-container">Financial Overview</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Balance", value: `৳${(p.balance || 0).toLocaleString()}`, color: "text-primary-container", icon: "account_balance_wallet" },
              { label: "Total Deposits", value: `৳${(p.totalDeposits || 0).toLocaleString()}`, color: "text-on-surface", icon: "south_west" },
              { label: "Total Withdrawals", value: `৳${(p.totalWithdrawals || 0).toLocaleString()}`, color: "text-secondary-container", icon: "north_east" },
              { label: "Total Winnings", value: `৳${(p.totalWinnings || 0).toLocaleString()}`, color: "text-tertiary-fixed-dim", icon: "emoji_events" },
            ].map((s, i) => (
              <div key={i} className="glass-card rounded-lg p-4">
                <div className="flex items-center gap-1.5 mb-2">
                  <span className={`material-symbols-outlined text-sm ${s.color}`}>{s.icon}</span>
                  <p className="text-[9px] font-label uppercase tracking-widest text-on-surface-variant">{s.label}</p>
                </div>
                <p className={`text-xl font-headline font-bold ${s.color}`}>{s.value}</p>
              </div>
            ))}
          </div>

          <h3 className="font-headline font-extrabold text-sm uppercase tracking-[0.15em] text-primary-container">Gaming Stats</h3>
          <div className="glass-card rounded-lg overflow-hidden divide-y divide-outline-variant/10">
            {[
              { label: "Total Bets", value: p.totalBets || 0, color: "text-on-surface" },
              { label: "Total Wins", value: p.totalWins || 0, color: "text-primary-container" },
              { label: "Total Losses", value: p.totalLosses || 0, color: "text-error" },
              { label: "Win Rate", value: (p.totalWins || 0) + (p.totalLosses || 0) > 0 ? (((p.totalWins || 0) / ((p.totalWins || 0) + (p.totalLosses || 0))) * 100).toFixed(1) + "%" : "0.0%", color: "text-tertiary-fixed-dim" },
              { label: "Total Referrals", value: p.totalReferrals || 0, color: "text-on-surface" },
              { label: "Referral Earnings", value: `৳${(p.referralEarnings || 0).toLocaleString()}`, color: "text-tertiary-fixed-dim" },
            ].map((item, i) => (
              <div key={i} className="px-4 py-3 flex justify-between items-center">
                <span className="text-[11px] text-on-surface-variant">{item.label}</span>
                <span className={`text-sm font-headline font-bold ${item.color}`}>{item.value}</span>
              </div>
            ))}
          </div>

          {/* Net P/L */}
          <div className="glass-card rounded-lg p-4 border-l-4 border-primary-container">
            <p className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant mb-1">Net Profit / Loss</p>
            {(() => {
              const net = (p.totalWinnings || 0) - ((p.totalDeposits || 0) - (p.totalWithdrawals || 0));
              return (
                <p className={`text-2xl font-headline font-black ${net >= 0 ? "text-primary-container" : "text-error"}`}>
                  {net >= 0 ? "+" : ""}৳{net.toLocaleString()}
                </p>
              );
            })()}
          </div>
        </section>
      )}

      {/* TAB: Activity */}
      {activeTab === "activity" && (
        <section className="space-y-4">
          <h3 className="font-headline font-extrabold text-sm uppercase tracking-[0.15em] text-primary-container">Recent Transactions</h3>
          {txnLoading ? (
            <div className="glass-card rounded-lg p-8 text-center">
              <div className="w-6 h-6 border-2 border-primary-container border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <p className="text-xs text-on-surface-variant">Loading...</p>
            </div>
          ) : recentTxns.length === 0 ? (
            <div className="glass-card rounded-lg p-8 text-center">
              <span className="material-symbols-outlined text-on-surface-variant/30 text-4xl mb-2 block">receipt_long</span>
              <p className="text-xs text-on-surface-variant">No transactions yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {recentTxns.map((t) => (
                <div key={t._id} className="glass-card rounded-lg p-4 flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${t.type === "deposit" ? "bg-primary-container/10" : "bg-secondary-container/10"}`}>
                    <span className={`material-symbols-outlined text-xl ${t.type === "deposit" ? "text-primary-container" : "text-secondary-container"}`}>
                      {t.type === "deposit" ? "south_west" : "north_east"}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <p className="text-xs font-bold capitalize">{t.type}</p>
                      <p className={`text-sm font-headline font-bold ${t.type === "withdraw" ? "text-secondary-container" : "text-primary-container"}`}>
                        {t.type === "withdraw" ? "-" : "+"}৳{(t.amount || 0).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <p className="text-[10px] text-on-surface-variant truncate mr-2">{(t.paymentMethod || "").toUpperCase()}</p>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase shrink-0 ${t.status === "approved" || t.status === "completed" ? "text-primary-container bg-primary-container/5" : t.status === "pending" ? "text-secondary-fixed-dim bg-secondary-container/10" : "text-error bg-error-container/10"}`}>{t.status}</span>
                    </div>
                    <p className="text-[9px] text-on-surface-variant/60 mt-1">{new Date(t.createdAt).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
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

export default AccountPage;
