import { useState, useEffect, useCallback } from "react";
import { getUsers, updateUserStatus, updateUserBalance, getUserById, createUser, updateUser, deleteUser } from "../../services/api";

const fallbackStats = [
  { id: "total", title: "Total Users", value: "0", accent: "border-primary" },
  { id: "active-now", title: "Active Now", value: "0", accent: "border-secondary" },
  { id: "today-new", title: "New Today", value: "0", accent: "border-amber-500" },
  { id: "blocked", title: "Blocked Users", value: "0", accent: "border-error" },
];

function fmt(n) {
  return n != null ? Number(n).toLocaleString() : "0";
}

function fmtBDT(n) {
  return n != null ? `BDT ${Number(n).toLocaleString()}` : "BDT 0";
}

export default function UserManagementPage() {
  const [users, setUsers] = useState([]);
  const [userStats, setUserStats] = useState(fallbackStats);
  const [selectedUser, setSelectedUser] = useState(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const limit = 10;

  const loadUsers = useCallback(async () => {
    try {
      const params = { page, limit };
      if (statusFilter) params.status = statusFilter;
      if (search) params.search = search;
      const data = await getUsers(params);
      setUsers(data.users || []);
      setTotal(data.total || 0);
      if (data.stats) {
        setUserStats([
          { id: "total", title: "Total Users", value: fmt(data.stats.total), accent: "border-primary" },
          { id: "active", title: "Active Users", value: fmt(data.stats.active), accent: "border-secondary" },
          { id: "today-new", title: "New Today", value: fmt(data.stats.todayNew), accent: "border-amber-500" },
          { id: "blocked", title: "Blocked Users", value: fmt(data.stats.blocked), accent: "border-error" },
        ]);
      }
      if (data.users?.length && !selectedUser) {
        selectUser(data.users[0]);
      }
    } catch { /* keep fallback */ }
  }, [page, statusFilter, search]);

  useEffect(() => { loadUsers(); }, [loadUsers]);

  async function selectUser(u) {
    try {
      const data = await getUserById(u._id);
      setSelectedUser(data.user || u);
    } catch {
      setSelectedUser(u);
    }
  }

  async function toggleBlock(user) {
    const newStatus = user.status === "active" ? "suspended" : "active";
    try {
      await updateUserStatus(user._id, newStatus);
      loadUsers();
    } catch { /* silent */ }
  }

  async function adjustBalance(type) {
    if (!selectedUser) return;
    const raw = prompt(`Enter amount to ${type === "add" ? "add" : "deduct"}:`);
    const amount = Number(raw);
    if (!amount || amount <= 0) return;
    try {
      await updateUserBalance(selectedUser._id, amount, type, `Manual ${type} by admin`);
      loadUsers();
      selectUser(selectedUser);
    } catch (err) { alert(err.message); }
  }

  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ username: "", mobile: "", password: "", balance: 1000, status: "active" });

  function openCreateModal() {
    setEditMode(false);
    setFormData({ username: "", mobile: "", password: "", balance: 1000, status: "active" });
    setShowModal(true);
  }

  function openEditModal(user) {
    setEditMode(true);
    setFormData({ username: user.username || "", mobile: user.mobile || "", password: "", balance: user.balance || 0, status: user.status || "active", _id: user._id });
    setShowModal(true);
  }

  async function handleSaveUser(e) {
    e.preventDefault();
    try {
      if (editMode) {
        await updateUser(formData._id, { username: formData.username, mobile: formData.mobile, status: formData.status, balance: Number(formData.balance) });
      } else {
        await createUser({ username: formData.username, mobile: formData.mobile, password: formData.password, balance: Number(formData.balance) });
      }
      setShowModal(false);
      loadUsers();
    } catch (err) { alert(err.message || "Failed to save user"); }
  }

  async function handleDeleteUser(id) {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      await deleteUser(id);
      if (selectedUser?._id === id) setSelectedUser(null);
      loadUsers();
    } catch (err) { alert(err.message || "Failed to delete user"); }
  }

  return (
    <div className="font-body">
      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-surface-container rounded-xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-black text-slate-100 mb-4">{editMode ? "Edit User" : "Create New User"}</h2>
            <form onSubmit={handleSaveUser} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase">Username</label>
                <input className="w-full bg-surface-container-high border border-outline-variant/20 rounded-lg px-4 py-2.5 text-sm text-on-surface mt-1" value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} required />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase">Mobile</label>
                <input className="w-full bg-surface-container-high border border-outline-variant/20 rounded-lg px-4 py-2.5 text-sm text-on-surface mt-1" value={formData.mobile} onChange={e => setFormData({...formData, mobile: e.target.value})} required />
              </div>
              {!editMode && (
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">Password</label>
                  <input type="password" className="w-full bg-surface-container-high border border-outline-variant/20 rounded-lg px-4 py-2.5 text-sm text-on-surface mt-1" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required />
                </div>
              )}
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase">Balance (BDT)</label>
                <input type="number" className="w-full bg-surface-container-high border border-outline-variant/20 rounded-lg px-4 py-2.5 text-sm text-on-surface mt-1" value={formData.balance} onChange={e => setFormData({...formData, balance: e.target.value})} />
              </div>
              {editMode && (
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">Status</label>
                  <select className="w-full bg-surface-container-high border border-outline-variant/20 rounded-lg px-4 py-2.5 text-sm text-on-surface mt-1" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                    <option value="active">Active</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
              )}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2.5 rounded-lg border border-outline-variant/20 text-sm font-bold text-slate-400">Cancel</button>
                <button type="submit" className="flex-1 py-2.5 rounded-lg bg-primary text-on-primary text-sm font-bold">{editMode ? "Save Changes" : "Create User"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="absolute top-20 right-6 sm:right-12 h-40 w-40 rounded-full bg-primary/5 blur-3xl pointer-events-none" />

      <div className="mb-8 sm:mb-10 flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight font-headline">
            User Management
          </h1>
          <p className="text-slate-400 mt-2 text-sm sm:text-base">
            Manage all registered users on your platform.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:flex gap-3 sm:gap-4 w-full xl:w-auto">
          <label className="flex flex-col gap-1.5">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider pl-1">
              Search
            </span>
            <input
              className="bg-surface-container border border-outline-variant/20 rounded-lg text-sm px-4 py-2.5 text-slate-200 focus:ring-1 focus:ring-primary/50 min-w-[150px]"
              type="text"
              placeholder="Username or mobile..."
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider pl-1">
              Status
            </span>
            <select
              className="bg-surface-container border border-outline-variant/20 rounded-lg text-sm px-4 py-2.5 text-slate-200 focus:ring-1 focus:ring-primary/50 min-w-[150px]"
              value={statusFilter}
              onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="suspended">Blocked</option>
            </select>
          </label>

          <button onClick={openCreateModal} className="sm:col-span-2 xl:col-span-1 xl:self-end bg-gradient-to-tr from-primary to-primary-container text-on-primary font-bold px-6 py-2.5 rounded-lg flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-primary/20 whitespace-nowrap">
            <span className="material-symbols-outlined text-lg">person_add</span>
            New User
          </button>
        </div>
      </div>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-10">
        {userStats.map((card) => (
          <article
            key={card.id}
            className={`bg-surface-container-low p-5 sm:p-6 rounded-xl border-l-4 ${card.accent} shadow-sm shadow-black/20`}
          >
            <p className="text-slate-500 text-[11px] font-bold uppercase mb-1 tracking-wide">
              {card.title}
            </p>
            <p className="text-2xl font-black text-slate-100">{card.value}</p>
          </article>
        ))}
      </section>

      <div className="flex flex-col 2xl:flex-row gap-6 xl:gap-8 items-start">
        <section className="w-full 2xl:w-2/3 bg-surface-container rounded-2xl overflow-hidden shadow-2xl shadow-black/30 border border-white/5">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full min-w-[760px] text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-high/50 text-slate-400 text-[11px] font-bold uppercase tracking-widest">
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Name & Mobile</th>
                  <th className="px-6 py-4">Balance</th>
                  <th className="px-6 py-4">Transactions</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/5">
                {users.map((user) => {
                  const blocked = user.status !== "active";
                  return (
                  <tr key={user._id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-5 font-headline text-primary font-bold">#{String(user._id).slice(-5)}</td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <span className="text-slate-200 font-bold">{user.username || user.mobile}</span>
                        <span className="text-slate-500 text-xs">{user.mobile}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 font-black text-slate-100">{fmtBDT(user.balance)}</td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col text-[11px]">
                        <span className="text-secondary">↓ {fmtBDT(user.totalDeposits)}</span>
                        <span className="text-error">↑ {fmtBDT(user.totalWithdrawals)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex justify-center">
                        <span
                          className={
                            blocked
                              ? "px-3 py-1 bg-error/10 text-error text-[10px] font-bold rounded-full uppercase"
                              : "px-3 py-1 bg-secondary/10 text-secondary text-[10px] font-bold rounded-full uppercase"
                          }
                        >
                          {user.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 hover:bg-primary/20 text-primary rounded-lg" title="View" onClick={() => selectUser(user)}>
                          <span className="material-symbols-outlined text-lg">visibility</span>
                        </button>
                        <button className="p-2 hover:bg-white/10 text-slate-300 rounded-lg" title="Edit" onClick={() => openEditModal(user)}>
                          <span className="material-symbols-outlined text-lg">edit</span>
                        </button>
                        <button
                          className={
                            blocked
                              ? "p-2 hover:bg-secondary/20 text-secondary rounded-lg"
                              : "p-2 hover:bg-error/20 text-error rounded-lg"
                          }
                          title={blocked ? "Unblock" : "Block"}
                          onClick={() => toggleBlock(user)}
                        >
                          <span className="material-symbols-outlined text-lg">
                            {blocked ? "lock_open" : "block"}
                          </span>
                        </button>
                        <button className="p-2 hover:bg-error/20 text-error/60 rounded-lg" title="Delete" onClick={() => handleDeleteUser(user._id)}>
                          <span className="material-symbols-outlined text-lg">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="px-6 sm:px-8 py-5 bg-surface-container-low/60 flex flex-col sm:flex-row gap-3 sm:gap-0 justify-between sm:items-center">
            <span className="text-xs text-slate-500 font-medium tracking-wide">
              Showing {(page - 1) * limit + 1}-{Math.min(page * limit, total)} of {fmt(total)} users
            </span>
            <div className="flex gap-2">
              <button disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))} className="px-4 py-2 bg-surface-container-high rounded text-slate-400 hover:text-slate-100 transition-all text-xs font-bold uppercase disabled:opacity-40">
                Previous
              </button>
              <button disabled={page * limit >= total} onClick={() => setPage((p) => p + 1)} className="px-4 py-2 bg-primary text-on-primary rounded font-bold transition-all text-xs uppercase disabled:opacity-40">
                Next
              </button>
            </div>
          </div>
        </section>

        <aside className="w-full 2xl:w-1/3 bg-surface-container rounded-2xl p-6 sm:p-8 border border-white/5 relative overflow-hidden shadow-2xl shadow-black/20">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -mr-16 -mt-16 blur-3xl" />

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-8 gap-3">
              <h2 className="text-lg sm:text-xl font-black text-slate-100 font-headline uppercase tracking-tight">
                User Details
              </h2>
              {selectedUser && (
              <span className={`px-3 py-1 text-[10px] font-bold rounded-full whitespace-nowrap ${selectedUser.status === "active" ? "bg-secondary/20 text-secondary" : "bg-error/20 text-error"}`}>
                {selectedUser.status || "N/A"}
              </span>
              )}
            </div>

            <div className="flex items-center gap-5 sm:gap-6 mb-8 sm:mb-10">
              <div className="relative shrink-0">
                <div className="w-20 h-20 rounded-2xl border-2 border-primary/20 p-1 bg-surface-container-high overflow-hidden">
                  <img
                    src="/logos/gain-live-logo-banner-7.png"
                    alt="User Profile"
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>
                {selectedUser?.status === "active" && (
                <div className="absolute -bottom-2 -right-2 bg-secondary w-6 h-6 rounded-full border-4 border-surface-container flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full live-pulse" />
                </div>
                )}
              </div>

              <div>
                <h4 className="text-base sm:text-lg font-bold text-slate-100">{selectedUser?.username || selectedUser?.mobile || "Select a user"}</h4>
                <p className="text-slate-400 text-sm">Joined: {selectedUser?.createdAt ? new Date(selectedUser.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) : "N/A"}</p>
                <div className="flex items-center gap-1.5 mt-2">
                  <span
                    className="material-symbols-outlined text-sm text-primary"
                    style={{ fontVariationSettings: "'FILL' 1, 'wght' 300" }}
                  >
                    star
                  </span>
                  <span className="text-xs font-bold text-primary uppercase">{selectedUser?.role === "admin" ? "Admin" : "Member"}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4 sm:space-y-6 mb-8 sm:mb-10">
              <div className="p-5 bg-surface-container-low rounded-xl">
                <p className="text-[10px] font-bold text-slate-500 uppercase mb-2">Current Balance</p>
                <div className="flex justify-between items-center gap-3">
                  <p className="text-2xl sm:text-3xl font-black text-primary font-headline tracking-tight">
                    {fmtBDT(selectedUser?.balance)}
                  </p>
                  <span className="material-symbols-outlined text-slate-600">account_balance_wallet</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                  <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Total Deposit</p>
                  <p className="text-lg font-bold text-secondary">{fmtBDT(selectedUser?.totalDeposits)}</p>
                </div>
                <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                  <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Total Withdraw</p>
                  <p className="text-lg font-bold text-error">{fmtBDT(selectedUser?.totalWithdrawals)}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                Balance Adjustment
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button onClick={() => adjustBalance("add")} className="flex items-center justify-center gap-2 py-3 bg-secondary/10 hover:bg-secondary/20 text-secondary rounded-xl transition-all font-bold border border-secondary/20">
                  <span className="material-symbols-outlined text-lg">add_circle</span>
                  Add Balance
                </button>
                <button onClick={() => adjustBalance("deduct")} className="flex items-center justify-center gap-2 py-3 bg-error/10 hover:bg-error/20 text-error rounded-xl transition-all font-bold border border-error/20">
                  <span className="material-symbols-outlined text-lg">remove_circle</span>
                  Deduct Balance
                </button>
              </div>

              <button className="w-full flex items-center justify-center gap-2 py-4 bg-surface-container-high hover:bg-surface-container-highest text-slate-200 rounded-xl transition-all font-bold">
                <span className="material-symbols-outlined text-lg">history</span>
                View Transaction History
              </button>
            </div>

            <div className="mt-8 pt-8 border-t border-white/5 flex gap-3 sm:gap-4">
              <button onClick={() => selectedUser && openEditModal(selectedUser)} className="flex-1 py-3 text-slate-400 hover:text-slate-100 font-bold transition-all text-sm uppercase flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-lg">edit</span>
                Edit Profile
              </button>
              <button onClick={() => selectedUser && handleDeleteUser(selectedUser._id)} className="px-4 py-3 text-error/70 hover:text-error transition-all rounded-lg hover:bg-error/10">
                <span className="material-symbols-outlined text-lg">delete</span>
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}