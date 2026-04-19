import { useState, useEffect, useCallback } from "react";
import {
  getUsers,
  updateUserStatus,
  updateUserBalance,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getUserTransactions,
} from "../../services/api";

/* ───── helpers ───── */
const fmt = (n) => (n != null ? Number(n).toLocaleString() : "0");
const fmtBDT = (n) => (n != null ? `৳${Number(n).toLocaleString()}` : "৳0");

function timeAgo(dateStr) {
  if (!dateStr) return "Never";
  const s = Math.floor((Date.now() - new Date(dateStr)) / 1000);
  if (s < 60) return "Just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  if (s < 2592000) return `${Math.floor(s / 86400)}d ago`;
  return new Date(dateStr).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function StatusBadge({ status }) {
  const map = {
    active: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
    suspended: "bg-amber-500/15 text-amber-400 border-amber-500/20",
    banned: "bg-red-500/15 text-red-400 border-red-500/20",
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full border ${map[status] || map.active}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${status === "active" ? "bg-emerald-400" : status === "suspended" ? "bg-amber-400" : "bg-red-400"}`} />
      {status}
    </span>
  );
}

/* ───── Modal Shell ───── */
function Modal({ open, onClose, children, size = "md" }) {
  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);
  if (!open) return null;
  const w = size === "lg" ? "max-w-2xl" : "max-w-md";
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div
        className={`relative w-full ${w} bg-surface-container rounded-t-2xl sm:rounded-2xl p-5 sm:p-6 max-h-[90vh] overflow-y-auto`}
        style={{ animation: "slideUp .2s ease-out" }}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════ */
export default function UserManagementPage() {
  /* ─── core state ─── */
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({ total: 0, active: 0, todayNew: 0, blocked: 0 });
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const limit = 15;

  /* ─── form modal ─── */
  const [showUserForm, setShowUserForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ username: "", mobile: "", email: "", password: "", balance: 1000, status: "active" });
  const [formLoading, setFormLoading] = useState(false);

  /* ─── balance modal ─── */
  const [showBalanceModal, setShowBalanceModal] = useState(false);
  const [balanceType, setBalanceType] = useState("add");
  const [balanceAmount, setBalanceAmount] = useState("");
  const [balanceNote, setBalanceNote] = useState("");
  const [balanceLoading, setBalanceLoading] = useState(false);

  /* ─── delete modal ─── */
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  /* ─── txn modal ─── */
  const [showTxns, setShowTxns] = useState(false);
  const [txns, setTxns] = useState([]);
  const [txnLoading, setTxnLoading] = useState(false);

  /* ─── debounced search ─── */
  useEffect(() => {
    const t = setTimeout(() => { setDebouncedSearch(search); setPage(1); }, 400);
    return () => clearTimeout(t);
  }, [search]);

  /* ─── load users ─── */
  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit };
      if (statusFilter) params.status = statusFilter;
      if (debouncedSearch) params.search = debouncedSearch;
      const data = await getUsers(params);
      setUsers(data.users || []);
      setTotal(data.total || 0);
      if (data.stats) setStats(data.stats);
    } catch (err) { console.error("Failed to load users:", err); }
    setLoading(false);
  }, [page, statusFilter, debouncedSearch]);

  useEffect(() => { loadUsers(); }, [loadUsers]);

  /* ─── select user ─── */
  async function selectUser(u) {
    try {
      const data = await getUserById(u._id);
      setSelectedUser(data.user || u);
    } catch { setSelectedUser(u); }
    setDetailOpen(true);
  }

  /* ─── toggle block ─── */
  async function toggleBlock(user) {
    const newStatus = user.status === "active" ? "suspended" : "active";
    try {
      await updateUserStatus(user._id, newStatus);
      if (selectedUser?._id === user._id) setSelectedUser({ ...selectedUser, status: newStatus });
      loadUsers();
    } catch (err) { console.error("Failed to toggle block:", err); }
  }

  /* ─── balance adjustment ─── */
  function openBalanceModal(type) {
    setBalanceType(type);
    setBalanceAmount("");
    setBalanceNote("");
    setShowBalanceModal(true);
  }

  async function handleBalanceSubmit(e) {
    e.preventDefault();
    if (!selectedUser || !balanceAmount) return;
    if (Number(balanceAmount) <= 0) return alert("Amount must be positive");
    setBalanceLoading(true);
    try {
      await updateUserBalance(selectedUser._id, Number(balanceAmount), balanceType, balanceNote || `Manual ${balanceType} by admin`);
      setShowBalanceModal(false);
      loadUsers();
      const data = await getUserById(selectedUser._id);
      setSelectedUser(data.user || selectedUser);
    } catch (err) { alert(err.message); }
    setBalanceLoading(false);
  }

  /* ─── create / edit ─── */
  function openCreateModal() {
    setEditMode(false);
    setFormData({ username: "", mobile: "", email: "", password: "", balance: 1000, status: "active" });
    setShowUserForm(true);
  }

  function openEditModal(user) {
    setEditMode(true);
    setFormData({ username: user.username || "", mobile: user.mobile || "", email: user.email || "", password: "", balance: user.balance || 0, status: user.status || "active", _id: user._id });
    setShowUserForm(true);
  }

  async function handleSaveUser(e) {
    e.preventDefault();
    if (!formData.username?.trim()) return alert("Username is required");
    if (!formData.mobile?.trim()) return alert("Mobile number is required");
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) return alert("Invalid email format");
    if (!editMode && (!formData.password || formData.password.length < 6)) return alert("Password must be at least 6 characters");
    if (Number(formData.balance) < 0) return alert("Balance cannot be negative");
    setFormLoading(true);
    try {
      if (editMode) {
        await updateUser(formData._id, { username: formData.username, mobile: formData.mobile, email: formData.email, status: formData.status, balance: Number(formData.balance) });
      } else {
        await createUser({ username: formData.username, mobile: formData.mobile, email: formData.email, password: formData.password, balance: Number(formData.balance) });
      }
      setShowUserForm(false);
      loadUsers();
    } catch (err) { alert(err.message || "Failed to save user"); }
    setFormLoading(false);
  }

  /* ─── delete ─── */
  function confirmDelete(user) { setDeleteTarget(user); setShowDeleteConfirm(true); }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await deleteUser(deleteTarget._id);
      if (selectedUser?._id === deleteTarget._id) setSelectedUser(null);
      setShowDeleteConfirm(false);
      setDeleteTarget(null);
      loadUsers();
    } catch (err) { alert(err.message || "Failed to delete"); }
    setDeleteLoading(false);
  }

  /* ─── transactions ─── */
  async function loadTransactions() {
    if (!selectedUser) return;
    setTxnLoading(true);
    setShowTxns(true);
    try {
      const data = await getUserTransactions(selectedUser._id, { limit: 50 });
      setTxns(data.transactions || []);
    } catch { setTxns([]); }
    setTxnLoading(false);
  }

  const totalPages = Math.ceil(total / limit);

  /* ─── Detail Content (shared sidebar + mobile modal) ─── */
  function DetailContent() {
    if (!selectedUser) return (
      <div className="flex flex-col items-center justify-center py-16 text-slate-500">
        <span className="material-symbols-outlined text-5xl mb-3 opacity-30">person_search</span>
        <p className="text-sm font-medium">Select a user to view details</p>
      </div>
    );
    const u = selectedUser;
    return (
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="relative shrink-0">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center text-lg font-black text-primary uppercase">
                {u.username?.[0] || "?"}
              </div>
              {u.status === "active" && <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-surface-container" />}
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-slate-100 text-sm truncate">{u.username || "N/A"}</h3>
              <p className="text-[11px] text-slate-500">{u.mobile}</p>
              {u.email && <p className="text-[11px] text-slate-500 truncate">{u.email}</p>}
            </div>
          </div>
          <StatusBadge status={u.status} />
        </div>

        {/* Balance */}
        <div className="p-4 bg-gradient-to-r from-primary/10 to-transparent rounded-xl border border-primary/10">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Balance</p>
          <p className="text-2xl font-black text-primary tracking-tight">{fmtBDT(u.balance)}</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: "Deposits", value: fmtBDT(u.totalDeposits), color: "text-emerald-400" },
            { label: "Withdrawals", value: fmtBDT(u.totalWithdrawals), color: "text-red-400" },
            { label: "Total Bets", value: fmt(u.totalBets), color: "text-primary" },
            { label: "Winnings", value: fmtBDT(u.totalWinnings), color: "text-amber-400" },
            { label: "Wins", value: fmt(u.totalWins), color: "text-emerald-400" },
            { label: "Losses", value: fmt(u.totalLosses), color: "text-red-400" },
            { label: "Referrals", value: fmt(u.totalReferrals), color: "text-blue-400" },
            { label: "Ref. Earnings", value: fmtBDT(u.referralEarnings), color: "text-purple-400" },
          ].map((s) => (
            <div key={s.label} className="p-2.5 bg-white/[0.03] rounded-lg border border-white/5">
              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">{s.label}</p>
              <p className={`text-sm font-bold ${s.color} mt-0.5`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Info Rows */}
        <div className="space-y-1 text-xs">
          {[
            { icon: "badge", label: "Role", value: u.role === "admin" ? "Admin" : "User" },
            { icon: "login", label: "Logins", value: fmt(u.loginCount) },
            { icon: "schedule", label: "Last Login", value: timeAgo(u.lastLogin) },
            { icon: "calendar_today", label: "Joined", value: u.createdAt ? new Date(u.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "N/A" },
            { icon: "share", label: "Referral Code", value: u.myReferralCode || "—" },
            { icon: "location_on", label: "Location", value: [u.city, u.country].filter(Boolean).join(", ") || "—" },
          ].map((r) => (
            <div key={r.label} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
              <div className="flex items-center gap-2 text-slate-500">
                <span className="material-symbols-outlined text-sm">{r.icon}</span>
                {r.label}
              </div>
              <span className="text-slate-200 font-medium">{r.value}</span>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="space-y-2 pt-2">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Actions</p>
          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => openBalanceModal("add")} className="flex items-center justify-center gap-1.5 py-2.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-lg text-xs font-bold border border-emerald-500/15 transition-colors">
              <span className="material-symbols-outlined text-base">add_circle</span>Add
            </button>
            <button onClick={() => openBalanceModal("deduct")} className="flex items-center justify-center gap-1.5 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-xs font-bold border border-red-500/15 transition-colors">
              <span className="material-symbols-outlined text-base">remove_circle</span>Deduct
            </button>
          </div>
          <button onClick={loadTransactions} className="w-full flex items-center justify-center gap-2 py-2.5 bg-white/5 hover:bg-white/10 text-slate-300 rounded-lg text-xs font-bold border border-white/5 transition-colors">
            <span className="material-symbols-outlined text-base">receipt_long</span>Transaction History
          </button>
          <div className="flex gap-2 pt-1">
            <button onClick={() => openEditModal(u)} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg text-xs font-bold border border-primary/15 transition-colors">
              <span className="material-symbols-outlined text-base">edit</span>Edit
            </button>
            <button onClick={() => toggleBlock(u)} className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-bold border transition-colors ${u.status === "active" ? "bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border-amber-500/15" : "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/15"}`}>
              <span className="material-symbols-outlined text-base">{u.status === "active" ? "block" : "lock_open"}</span>
              {u.status === "active" ? "Block" : "Unblock"}
            </button>
            <button onClick={() => confirmDelete(u)} className="py-2.5 px-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg border border-red-500/15 transition-colors">
              <span className="material-symbols-outlined text-base">delete</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ═══════════════════ RENDER ═══════════════════ */
  return (
    <div className="font-body">
      <style>{`@keyframes slideUp{from{transform:translateY(16px);opacity:0}to{transform:translateY(0);opacity:1}}`}</style>

      {/* ─── Create / Edit User Modal ─── */}
      <Modal open={showUserForm} onClose={() => setShowUserForm(false)}>
        <h2 className="text-lg font-black text-slate-100 mb-5">{editMode ? "Edit User" : "Create New User"}</h2>
        <form onSubmit={handleSaveUser} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Username *</label>
              <input className="w-full bg-surface-container-high border border-outline-variant/20 rounded-lg px-3.5 py-2.5 text-sm text-on-surface mt-1 focus:ring-1 focus:ring-primary/50 transition" value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} required placeholder="john_doe" />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Mobile *</label>
              <input className="w-full bg-surface-container-high border border-outline-variant/20 rounded-lg px-3.5 py-2.5 text-sm text-on-surface mt-1 focus:ring-1 focus:ring-primary/50 transition" value={formData.mobile} onChange={(e) => setFormData({ ...formData, mobile: e.target.value })} required placeholder="01XXXXXXXXX" />
            </div>
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Email</label>
            <input type="email" className="w-full bg-surface-container-high border border-outline-variant/20 rounded-lg px-3.5 py-2.5 text-sm text-on-surface mt-1 focus:ring-1 focus:ring-primary/50 transition" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="user@example.com" />
          </div>
          {!editMode && (
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Password *</label>
              <input type="password" className="w-full bg-surface-container-high border border-outline-variant/20 rounded-lg px-3.5 py-2.5 text-sm text-on-surface mt-1 focus:ring-1 focus:ring-primary/50 transition" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required placeholder="Min 6 characters" />
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Balance (৳)</label>
              <input type="number" className="w-full bg-surface-container-high border border-outline-variant/20 rounded-lg px-3.5 py-2.5 text-sm text-on-surface mt-1 focus:ring-1 focus:ring-primary/50 transition" value={formData.balance} onChange={(e) => setFormData({ ...formData, balance: e.target.value })} />
            </div>
            {editMode && (
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Status</label>
                <select className="w-full bg-surface-container-high border border-outline-variant/20 rounded-lg px-3.5 py-2.5 text-sm text-on-surface mt-1 focus:ring-1 focus:ring-primary/50 transition" value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
                  <option value="active">Active</option>
                  <option value="suspended">Suspended</option>
                  <option value="banned">Banned</option>
                </select>
              </div>
            )}
          </div>
          <div className="flex gap-3 pt-3">
            <button type="button" onClick={() => setShowUserForm(false)} className="flex-1 py-2.5 rounded-lg border border-white/10 text-sm font-bold text-slate-400 hover:bg-white/5 transition-colors">Cancel</button>
            <button type="submit" disabled={formLoading} className="flex-1 py-2.5 rounded-lg bg-primary text-on-primary text-sm font-bold disabled:opacity-50 hover:brightness-110 transition-all">
              {formLoading ? "Saving..." : editMode ? "Save Changes" : "Create User"}
            </button>
          </div>
        </form>
      </Modal>

      {/* ─── Balance Adjustment Modal ─── */}
      <Modal open={showBalanceModal} onClose={() => setShowBalanceModal(false)}>
        <h2 className="text-lg font-black text-slate-100 mb-1">{balanceType === "add" ? "Add Balance" : "Deduct Balance"}</h2>
        <p className="text-xs text-slate-500 mb-5">User: <span className="text-slate-300 font-bold">{selectedUser?.username}</span></p>
        <form onSubmit={handleBalanceSubmit} className="space-y-4">
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Amount (৳) *</label>
            <input type="number" min="1" step="1" className="w-full bg-surface-container-high border border-outline-variant/20 rounded-lg px-3.5 py-3 text-lg font-bold text-on-surface mt-1 focus:ring-1 focus:ring-primary/50 transition" value={balanceAmount} onChange={(e) => setBalanceAmount(e.target.value)} required placeholder="0" autoFocus />
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Note (optional)</label>
            <input className="w-full bg-surface-container-high border border-outline-variant/20 rounded-lg px-3.5 py-2.5 text-sm text-on-surface mt-1 focus:ring-1 focus:ring-primary/50 transition" value={balanceNote} onChange={(e) => setBalanceNote(e.target.value)} placeholder="Reason for adjustment..." />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setShowBalanceModal(false)} className="flex-1 py-2.5 rounded-lg border border-white/10 text-sm font-bold text-slate-400 hover:bg-white/5 transition-colors">Cancel</button>
            <button type="submit" disabled={balanceLoading} className={`flex-1 py-2.5 rounded-lg text-sm font-bold text-white disabled:opacity-50 transition-all ${balanceType === "add" ? "bg-emerald-600 hover:bg-emerald-500" : "bg-red-600 hover:bg-red-500"}`}>
              {balanceLoading ? "Processing..." : balanceType === "add" ? `Add ৳${balanceAmount || 0}` : `Deduct ৳${balanceAmount || 0}`}
            </button>
          </div>
        </form>
      </Modal>

      {/* ─── Delete Confirmation ─── */}
      <Modal open={showDeleteConfirm} onClose={() => setShowDeleteConfirm(false)}>
        <div className="text-center py-2">
          <div className="w-14 h-14 rounded-full bg-red-500/15 flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-red-400 text-3xl">warning</span>
          </div>
          <h2 className="text-lg font-black text-slate-100 mb-2">Delete User?</h2>
          <p className="text-sm text-slate-400 mb-6">
            This will permanently delete <span className="text-slate-200 font-bold">{deleteTarget?.username}</span> and all their data. This cannot be undone.
          </p>
          <div className="flex gap-3">
            <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 py-2.5 rounded-lg border border-white/10 text-sm font-bold text-slate-400 hover:bg-white/5 transition-colors">Cancel</button>
            <button onClick={handleDelete} disabled={deleteLoading} className="flex-1 py-2.5 rounded-lg bg-red-600 text-white text-sm font-bold disabled:opacity-50 hover:bg-red-500 transition-all">
              {deleteLoading ? "Deleting..." : "Yes, Delete"}
            </button>
          </div>
        </div>
      </Modal>

      {/* ─── Transaction History Modal ─── */}
      <Modal open={showTxns} onClose={() => setShowTxns(false)} size="lg">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-black text-slate-100">Transactions — {selectedUser?.username}</h2>
          <button onClick={() => setShowTxns(false)} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
            <span className="material-symbols-outlined text-slate-400">close</span>
          </button>
        </div>
        {txnLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          </div>
        ) : txns.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <span className="material-symbols-outlined text-4xl mb-2 block opacity-30">receipt_long</span>
            <p className="text-sm">No transactions found</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-[60vh] overflow-y-auto">
            {txns.map((tx) => (
              <div key={tx._id} className="flex items-center justify-between p-3 bg-white/[0.03] rounded-lg border border-white/5">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${tx.type === "deposit" ? "bg-emerald-500/15 text-emerald-400" : tx.type === "withdrawal" ? "bg-red-500/15 text-red-400" : "bg-primary/15 text-primary"}`}>
                    <span className="material-symbols-outlined text-base">{tx.type === "deposit" ? "south_west" : tx.type === "withdrawal" ? "north_east" : "swap_horiz"}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-200 capitalize truncate">{tx.type}</p>
                    <p className="text-[10px] text-slate-500 truncate">{tx.note || tx.description || "—"} · {timeAgo(tx.createdAt)}</p>
                  </div>
                </div>
                <div className="text-right shrink-0 pl-3">
                  <p className={`text-sm font-bold ${tx.type === "deposit" ? "text-emerald-400" : "text-red-400"}`}>
                    {tx.type === "deposit" ? "+" : "-"}{fmtBDT(tx.amount)}
                  </p>
                  <span className={`text-[9px] font-bold uppercase ${tx.status === "completed" ? "text-emerald-400" : tx.status === "pending" ? "text-amber-400" : "text-red-400"}`}>{tx.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Modal>

      {/* ─── Mobile Detail Drawer (hidden on lg+) ─── */}
      <div className="lg:hidden">
        <Modal open={detailOpen && !!selectedUser} onClose={() => setDetailOpen(false)}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-black text-slate-100 uppercase tracking-tight">User Details</h2>
            <button onClick={() => setDetailOpen(false)} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
              <span className="material-symbols-outlined text-slate-400">close</span>
            </button>
          </div>
          <DetailContent />
        </Modal>
      </div>

      {/* ═══════════════════ PAGE CONTENT ═══════════════════ */}

      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl font-black text-slate-100 tracking-tight font-headline">User Management</h1>
        <p className="text-slate-500 mt-1 text-xs sm:text-sm">Manage platform users, balances & access.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
        {[
          { label: "Total Users", value: fmt(stats.total), icon: "group", color: "text-primary", bg: "bg-primary/10 border-primary/15" },
          { label: "Active", value: fmt(stats.active), icon: "check_circle", color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/15" },
          { label: "New Today", value: fmt(stats.todayNew), icon: "person_add", color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/15" },
          { label: "Blocked", value: fmt(stats.blocked), icon: "block", color: "text-red-400", bg: "bg-red-500/10 border-red-500/15" },
        ].map((s) => (
          <div key={s.label} className={`p-4 sm:p-5 rounded-xl border ${s.bg}`}>
            <div className="flex items-center justify-between mb-2">
              <span className={`material-symbols-outlined text-lg ${s.color}`}>{s.icon}</span>
            </div>
            <p className="text-xl sm:text-2xl font-black text-slate-100">{s.value}</p>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-lg">search</span>
          <input
            className="w-full bg-surface-container border border-outline-variant/20 rounded-lg text-sm pl-10 pr-10 py-2.5 text-slate-200 focus:ring-1 focus:ring-primary/50 placeholder:text-slate-600 transition"
            type="text"
            placeholder="Search by username or mobile..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
              <span className="material-symbols-outlined text-base">close</span>
            </button>
          )}
        </div>
        <select
          className="bg-surface-container border border-outline-variant/20 rounded-lg text-sm px-4 py-2.5 text-slate-200 focus:ring-1 focus:ring-primary/50 sm:min-w-[140px] transition"
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
          <option value="banned">Banned</option>
        </select>
        <button onClick={openCreateModal} className="bg-primary text-on-primary font-bold px-5 py-2.5 rounded-lg flex items-center justify-center gap-2 hover:brightness-110 active:scale-[0.97] transition-all text-sm whitespace-nowrap">
          <span className="material-symbols-outlined text-lg">person_add</span>
          Add User
        </button>
      </div>

      {/* Main Layout */}
      <div className="flex gap-6 items-start">
        {/* Table + Cards */}
        <div className="flex-1 min-w-0">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-10 h-10 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-20 bg-surface-container rounded-2xl border border-white/5">
              <span className="material-symbols-outlined text-5xl text-slate-600 mb-3 block">person_off</span>
              <p className="text-slate-400 font-bold">No users found</p>
              <p className="text-slate-600 text-sm mt-1">Try adjusting your search or filters</p>
            </div>
          ) : (
            <>
              {/* ── Desktop Table ── */}
              <div className="hidden lg:block bg-surface-container rounded-2xl overflow-hidden border border-white/5">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-white/[0.02] text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                        <th className="px-5 py-3.5">User</th>
                        <th className="px-5 py-3.5">Balance</th>
                        <th className="px-5 py-3.5">Deposits / Withdrawals</th>
                        <th className="px-5 py-3.5">Status</th>
                        <th className="px-5 py-3.5">Last Login</th>
                        <th className="px-5 py-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.03]">
                      {users.map((u) => (
                        <tr
                          key={u._id}
                          className={`hover:bg-white/[0.03] transition-colors cursor-pointer ${selectedUser?._id === u._id ? "bg-primary/[0.04]" : ""}`}
                          onClick={() => selectUser(u)}
                        >
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/15 flex items-center justify-center text-xs font-black text-primary uppercase shrink-0">
                                {u.username?.[0] || "?"}
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm font-bold text-slate-200 truncate">{u.username}</p>
                                <p className="text-[11px] text-slate-500">{u.mobile}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-4 font-bold text-slate-100 text-sm">{fmtBDT(u.balance)}</td>
                          <td className="px-5 py-4">
                            <div className="flex flex-col text-[11px]">
                              <span className="text-emerald-400">↓ {fmtBDT(u.totalDeposits)}</span>
                              <span className="text-red-400">↑ {fmtBDT(u.totalWithdrawals)}</span>
                            </div>
                          </td>
                          <td className="px-5 py-4"><StatusBadge status={u.status} /></td>
                          <td className="px-5 py-4 text-xs text-slate-500">{timeAgo(u.lastLogin)}</td>
                          <td className="px-5 py-4">
                            <div className="flex justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                              <button className="p-1.5 hover:bg-white/10 text-slate-400 hover:text-slate-200 rounded-lg transition-colors" title="Edit" onClick={() => openEditModal(u)}>
                                <span className="material-symbols-outlined text-base">edit</span>
                              </button>
                              <button className={`p-1.5 rounded-lg transition-colors ${u.status === "active" ? "hover:bg-amber-500/20 text-amber-400/60 hover:text-amber-400" : "hover:bg-emerald-500/20 text-emerald-400/60 hover:text-emerald-400"}`} title={u.status === "active" ? "Block" : "Unblock"} onClick={() => toggleBlock(u)}>
                                <span className="material-symbols-outlined text-base">{u.status === "active" ? "block" : "lock_open"}</span>
                              </button>
                              <button className="p-1.5 hover:bg-red-500/20 text-red-400/50 hover:text-red-400 rounded-lg transition-colors" title="Delete" onClick={() => confirmDelete(u)}>
                                <span className="material-symbols-outlined text-base">delete</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="px-5 py-3.5 bg-white/[0.02] flex items-center justify-between border-t border-white/5">
                  <span className="text-[11px] text-slate-500">
                    {fmt((page - 1) * limit + 1)} – {fmt(Math.min(page * limit, total))} of {fmt(total)}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="px-3 py-1.5 rounded-lg bg-white/5 text-slate-400 hover:text-slate-200 text-xs font-bold disabled:opacity-30 transition-colors">Prev</button>
                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                      let p;
                      if (totalPages <= 5) p = i + 1;
                      else if (page <= 3) p = i + 1;
                      else if (page >= totalPages - 2) p = totalPages - 4 + i;
                      else p = page - 2 + i;
                      return (
                        <button key={p} onClick={() => setPage(p)} className={`w-8 h-8 rounded-lg text-xs font-bold transition-colors ${page === p ? "bg-primary text-on-primary" : "bg-white/5 text-slate-400 hover:text-slate-200"}`}>{p}</button>
                      );
                    })}
                    <button disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)} className="px-3 py-1.5 rounded-lg bg-white/5 text-slate-400 hover:text-slate-200 text-xs font-bold disabled:opacity-30 transition-colors">Next</button>
                  </div>
                </div>
              </div>

              {/* ── Mobile Cards ── */}
              <div className="lg:hidden space-y-2.5">
                {users.map((u) => (
                  <div
                    key={u._id}
                    className="bg-surface-container rounded-xl p-4 border border-white/5 active:bg-white/[0.05] transition-colors cursor-pointer"
                    onClick={() => selectUser(u)}
                  >
                    <div className="flex items-center justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/15 flex items-center justify-center text-sm font-black text-primary uppercase shrink-0">
                          {u.username?.[0] || "?"}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-slate-200 truncate">{u.username}</p>
                          <p className="text-[11px] text-slate-500">{u.mobile}</p>
                        </div>
                      </div>
                      <StatusBadge status={u.status} />
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-base font-black text-primary">{fmtBDT(u.balance)}</p>
                      <div className="flex items-center gap-3 text-[11px]">
                        <span className="text-emerald-400">↓ {fmtBDT(u.totalDeposits)}</span>
                        <span className="text-red-400">↑ {fmtBDT(u.totalWithdrawals)}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-2.5 pt-2.5 border-t border-white/5">
                      <span className="text-[10px] text-slate-500">{timeAgo(u.lastLogin)}</span>
                      <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                        <button className="p-1.5 hover:bg-white/10 text-slate-400 rounded-lg" onClick={() => openEditModal(u)}>
                          <span className="material-symbols-outlined text-base">edit</span>
                        </button>
                        <button className={`p-1.5 rounded-lg ${u.status === "active" ? "text-amber-400/60 hover:text-amber-400" : "text-emerald-400/60 hover:text-emerald-400"}`} onClick={() => toggleBlock(u)}>
                          <span className="material-symbols-outlined text-base">{u.status === "active" ? "block" : "lock_open"}</span>
                        </button>
                        <button className="p-1.5 text-red-400/50 hover:text-red-400 rounded-lg" onClick={() => confirmDelete(u)}>
                          <span className="material-symbols-outlined text-base">delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Mobile Pagination */}
                <div className="flex items-center justify-between pt-3">
                  <span className="text-[11px] text-slate-500">{fmt((page - 1) * limit + 1)}–{fmt(Math.min(page * limit, total))} of {fmt(total)}</span>
                  <div className="flex gap-2">
                    <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="px-4 py-2 rounded-lg bg-surface-container border border-white/5 text-xs font-bold text-slate-400 disabled:opacity-30 transition-colors">Prev</button>
                    <button disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)} className="px-4 py-2 rounded-lg bg-primary text-on-primary text-xs font-bold disabled:opacity-30 transition-colors">Next</button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Desktop Sidebar Detail */}
        <aside className="hidden lg:block w-[340px] xl:w-[380px] shrink-0 bg-surface-container rounded-2xl p-5 border border-white/5 sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto">
          <DetailContent />
        </aside>
      </div>
    </div>
  );
}