import { statsCards } from "../../data/dashboardData";
import StatsCard from "../../components/dashboard/StatsCard";
import WeeklyChart from "../../components/dashboard/WeeklyChart";
import AlertsPanel from "../../components/dashboard/AlertsPanel";
import TransactionsTable from "../../components/dashboard/TransactionsTable";
import RevenueChart from "../../components/dashboard/RevenueChart";
import MonthlyProfitChart from "../../components/dashboard/MonthlyProfitChart";

export default function DashboardPage() {
  return (
    <>
      {/* Header Section */}
      <div className="mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-100 mb-2 bengali-leading">
            Dashboard
          </h2>
          <p className="text-slate-500 text-sm">
            Welcome, view your cricket operations report for today.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            id="btn-today-report"
            className="flex items-center gap-2 px-4 py-2 bg-surface-container hover:bg-surface-container-high rounded-xl text-sm transition-all border border-outline-variant/10 text-slate-300"
          >
            <span className="material-symbols-outlined text-sm">calendar_today</span>
            Today's Report
          </button>
          <button
            id="btn-export"
            className="flex items-center gap-2 px-6 py-2 bg-gradient-to-br from-primary to-primary-container text-on-primary font-bold rounded-xl text-sm transition-all shadow-lg shadow-amber-500/10 active:scale-95 hover:shadow-amber-500/20"
          >
            <span className="material-symbols-outlined text-sm">download</span>
            Export
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {statsCards.map((card, i) => (
          <StatsCard key={card.id} {...card} delay={i * 100} />
        ))}
      </div>

      {/* Bento Grid: Charts & Activity */}
      <div className="grid grid-cols-12 gap-6">
        {/* Weekly Deposits vs Withdrawals */}
        <WeeklyChart />

        {/* Alerts Panel */}
        <AlertsPanel />

        {/* Recent Transactions */}
        <TransactionsTable />

        {/* Revenue by Game */}
        <RevenueChart />

        {/* Monthly Profit/Loss */}
        <MonthlyProfitChart />
      </div>

      {/* Footer */}
      <footer className="mt-16 text-center text-slate-600 text-[10px] uppercase tracking-widest font-bold">
        © 2024 Gain Live Dashboard Pro • Design & Development Team
      </footer>
    </>
  );
}
