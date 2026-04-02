const userStats = [
  {
    id: "total",
    title: "Total Users",
    value: "12,450",
    accent: "border-primary",
  },
  {
    id: "active-now",
    title: "Active Now",
    value: "1,208",
    accent: "border-secondary",
  },
  {
    id: "today-new",
    title: "New Today",
    value: "452",
    accent: "border-amber-500",
  },
  {
    id: "blocked",
    title: "Blocked Users",
    value: "89",
    accent: "border-error",
  },
];

const users = [
  {
    id: "#88904",
    name: "Tanvir Ahmed",
    phone: "01700000000",
    balance: "BDT 4,500",
    deposit: "↓ BDT 10,000 (Deposit)",
    withdraw: "↑ BDT 5,500 (Withdraw)",
    status: "Active",
    blocked: false,
  },
  {
    id: "#88905",
    name: "Rakibul Islam",
    phone: "01900000000",
    balance: "BDT 12,800",
    deposit: "↓ BDT 20,000",
    withdraw: "↑ BDT 7,200",
    status: "Active",
    blocked: false,
  },
  {
    id: "#88906",
    name: "Kamrul Hasan",
    phone: "01600000000",
    balance: "BDT 0.00",
    deposit: "↓ BDT 100",
    withdraw: "↑ BDT 100",
    status: "Blocked",
    blocked: true,
  },
];

const selectedUser = {
  name: "Tanvir Ahmed",
  joinedAt: "20 January, 2024",
  badge: "VIP Member",
  balance: "BDT 4,500.00",
  totalDeposit: "BDT 10,000",
  totalWithdraw: "BDT 5,500",
};

export default function UserManagementPage() {
  return (
    <div className="font-body">
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
              Status
            </span>
            <select className="bg-surface-container border border-outline-variant/20 rounded-lg text-sm px-4 py-2.5 text-slate-200 focus:ring-1 focus:ring-primary/50 min-w-[150px]">
              <option>All Status</option>
              <option>Active</option>
              <option>Blocked</option>
            </select>
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider pl-1">
              Date
            </span>
            <input
              className="bg-surface-container border border-outline-variant/20 rounded-lg text-sm px-4 py-2.5 text-slate-200 focus:ring-1 focus:ring-primary/50"
              type="text"
              placeholder="dd-mm-yyyy"
            />
          </label>

          <button className="sm:col-span-2 xl:col-span-1 xl:self-end bg-gradient-to-tr from-primary to-primary-container text-on-primary font-bold px-6 py-2.5 rounded-lg flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-primary/20 whitespace-nowrap">
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
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-5 font-headline text-primary font-bold">{user.id}</td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <span className="text-slate-200 font-bold">{user.name}</span>
                        <span className="text-slate-500 text-xs">{user.phone}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 font-black text-slate-100">{user.balance}</td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col text-[11px]">
                        <span className="text-secondary">{user.deposit}</span>
                        <span className="text-error">{user.withdraw}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex justify-center">
                        <span
                          className={
                            user.blocked
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
                        <button className="p-2 hover:bg-primary/20 text-primary rounded-lg" title="View">
                          <span className="material-symbols-outlined text-lg">visibility</span>
                        </button>
                        <button className="p-2 hover:bg-white/10 text-slate-300 rounded-lg" title="Edit">
                          <span className="material-symbols-outlined text-lg">edit</span>
                        </button>
                        <button
                          className={
                            user.blocked
                              ? "p-2 hover:bg-secondary/20 text-secondary rounded-lg"
                              : "p-2 hover:bg-error/20 text-error rounded-lg"
                          }
                          title={user.blocked ? "Unblock" : "Block"}
                        >
                          <span className="material-symbols-outlined text-lg">
                            {user.blocked ? "lock_open" : "block"}
                          </span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-6 sm:px-8 py-5 bg-surface-container-low/60 flex flex-col sm:flex-row gap-3 sm:gap-0 justify-between sm:items-center">
            <span className="text-xs text-slate-500 font-medium tracking-wide">
              Showing 1-10 of 12,450 users
            </span>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-surface-container-high rounded text-slate-400 hover:text-slate-100 transition-all text-xs font-bold uppercase">
                Previous
              </button>
              <button className="px-4 py-2 bg-primary text-on-primary rounded font-bold transition-all text-xs uppercase">
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
              <span className="px-3 py-1 bg-secondary/20 text-secondary text-[10px] font-bold rounded-full whitespace-nowrap">
                Active
              </span>
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
                <div className="absolute -bottom-2 -right-2 bg-secondary w-6 h-6 rounded-full border-4 border-surface-container flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full live-pulse" />
                </div>
              </div>

              <div>
                <h4 className="text-base sm:text-lg font-bold text-slate-100">{selectedUser.name}</h4>
                <p className="text-slate-400 text-sm">Joined: {selectedUser.joinedAt}</p>
                <div className="flex items-center gap-1.5 mt-2">
                  <span
                    className="material-symbols-outlined text-sm text-primary"
                    style={{ fontVariationSettings: "'FILL' 1, 'wght' 300" }}
                  >
                    star
                  </span>
                  <span className="text-xs font-bold text-primary uppercase">{selectedUser.badge}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4 sm:space-y-6 mb-8 sm:mb-10">
              <div className="p-5 bg-surface-container-low rounded-xl">
                <p className="text-[10px] font-bold text-slate-500 uppercase mb-2">Current Balance</p>
                <div className="flex justify-between items-center gap-3">
                  <p className="text-2xl sm:text-3xl font-black text-primary font-headline tracking-tight">
                    {selectedUser.balance}
                  </p>
                  <span className="material-symbols-outlined text-slate-600">account_balance_wallet</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                  <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Total Deposit</p>
                  <p className="text-lg font-bold text-secondary">{selectedUser.totalDeposit}</p>
                </div>
                <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                  <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Total Withdraw</p>
                  <p className="text-lg font-bold text-error">{selectedUser.totalWithdraw}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                Balance Adjustment
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button className="flex items-center justify-center gap-2 py-3 bg-secondary/10 hover:bg-secondary/20 text-secondary rounded-xl transition-all font-bold border border-secondary/20">
                  <span className="material-symbols-outlined text-lg">add_circle</span>
                  Add Balance
                </button>
                <button className="flex items-center justify-center gap-2 py-3 bg-error/10 hover:bg-error/20 text-error rounded-xl transition-all font-bold border border-error/20">
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
              <button className="flex-1 py-3 text-slate-400 hover:text-slate-100 font-bold transition-all text-sm uppercase flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-lg">edit</span>
                Edit Profile
              </button>
              <button className="px-4 py-3 text-error/70 hover:text-error transition-all rounded-lg hover:bg-error/10">
                <span className="material-symbols-outlined text-lg">delete</span>
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}