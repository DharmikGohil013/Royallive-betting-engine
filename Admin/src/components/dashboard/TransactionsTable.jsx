import { transactionsData } from "../../data/dashboardData";

export default function TransactionsTable() {
  return (
    <div
      id="transactions-table"
      className="col-span-12 lg:col-span-8 surface-container rounded-3xl p-8 border-none animate-fade-in-up opacity-0"
      style={{ animationDelay: "700ms", animationFillMode: "forwards" }}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h4 className="text-lg font-bold text-slate-100 bengali-leading">
          সাম্প্রতিক লেনদেন
        </h4>
        <button
          id="btn-view-all-transactions"
          className="text-amber-500 text-xs font-bold flex items-center gap-1 hover:underline"
        >
          সব দেখুন
          <span className="material-symbols-outlined text-xs">chevron_right</span>
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-slate-500 text-[10px] uppercase tracking-widest border-b border-slate-800/50">
              <th className="pb-4 font-black">ব্যবহারকারী</th>
              <th className="pb-4 font-black">পরিমাণ</th>
              <th className="pb-4 font-black text-center">ধরন</th>
              <th className="pb-4 font-black">সময়</th>
              <th className="pb-4 font-black text-right">স্ট্যাটাস</th>
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
    </div>
  );
}
