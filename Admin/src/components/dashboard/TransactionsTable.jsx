import { transactionsData } from "../../data/dashboardData";

export default function TransactionsTable() {
  return (
    <div
      id="transactions-table"
      className="col-span-12 lg:col-span-8 surface-container rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border-none animate-fade-in-up opacity-0"
      style={{ animationDelay: "700ms", animationFillMode: "forwards" }}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-4 sm:mb-8">
        <h4 className="text-base sm:text-lg font-bold text-slate-100">
          Recent Transactions
        </h4>
        <button
          id="btn-view-all-transactions"
          className="text-amber-500 text-xs font-bold flex items-center gap-1 hover:underline"
        >
          View All
          <span className="material-symbols-outlined text-xs">chevron_right</span>
        </button>
      </div>

      {/* Table — Desktop */}
      <div className="overflow-x-auto hidden sm:block">
        <table className="w-full text-left min-w-[600px]">
          <thead>
            <tr className="text-slate-500 text-[10px] uppercase tracking-widest border-b border-slate-800/50">
              <th className="pb-4 font-black">User</th>
              <th className="pb-4 font-black">Amount</th>
              <th className="pb-4 font-black text-center">Type</th>
              <th className="pb-4 font-black">Time</th>
              <th className="pb-4 font-black text-right">Status</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {transactionsData.map((tx) => (
              <tr
                key={tx.id}
                className="group hover:bg-white/5 transition-all"
              >
                <td className="py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center text-[10px] font-bold text-slate-300">
                      {tx.initials}
                    </div>
                    <span className="text-slate-100 font-bold">{tx.name}</span>
                  </div>
                </td>
                <td className="py-4 text-slate-300 font-body">{tx.amount}</td>
                <td className="py-4 text-center">
                  <span
                    className={`px-2 py-1 rounded-md ${tx.typeBg} ${tx.typeColor} text-[10px] font-bold`}
                  >
                    {tx.type}
                  </span>
                </td>
                <td className="py-4 text-slate-500 text-xs">{tx.time}</td>
                <td className="py-4 text-right">
                  <span
                    className={`px-2 py-1 rounded-full ${tx.statusBg} ${tx.statusColor} text-[10px] font-bold uppercase`}
                  >
                    {tx.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Card Layout — Mobile */}
      <div className="sm:hidden space-y-3">
        {transactionsData.map((tx) => (
          <div
            key={tx.id}
            className="flex items-center gap-3 p-3 rounded-xl bg-surface-container-low"
          >
            <div className="w-9 h-9 rounded-full bg-surface-container-highest flex items-center justify-center text-[10px] font-bold text-slate-300 shrink-0">
              {tx.initials}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start mb-1">
                <span className="text-slate-100 font-bold text-xs truncate mr-2">{tx.name}</span>
                <span
                  className={`px-2 py-0.5 rounded-full ${tx.statusBg} ${tx.statusColor} text-[9px] font-bold uppercase shrink-0`}
                >
                  {tx.status}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-300 text-xs font-body">{tx.amount}</span>
                <span
                  className={`px-1.5 py-0.5 rounded-md ${tx.typeBg} ${tx.typeColor} text-[9px] font-bold`}
                >
                  {tx.type}
                </span>
              </div>
              <p className="text-[10px] text-slate-500 mt-1">{tx.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
