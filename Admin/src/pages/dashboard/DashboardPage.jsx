import { useState, useEffect } from "react";
import { statsCards as fallbackStats } from "../../data/dashboardData";
import { getDashboardStats } from "../../services/api";
import StatsCard from "../../components/dashboard/StatsCard";
import WeeklyChart from "../../components/dashboard/WeeklyChart";
import AlertsPanel from "../../components/dashboard/AlertsPanel";
import TransactionsTable from "../../components/dashboard/TransactionsTable";
import RevenueChart from "../../components/dashboard/RevenueChart";
import MonthlyProfitChart from "../../components/dashboard/MonthlyProfitChart";

function formatBDT(n) {
  if (n >= 100000) return `৳${(n / 100000).toFixed(1)}L`;
  if (n >= 1000) return `৳${(n / 1000).toFixed(0)}K`;
  return `৳${n}`;
}

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [statsCards, setStatsCards] = useState(fallbackStats);

  useEffect(() => {
    getDashboardStats()
      .then((data) => {
        if (data.stats) {
          setStats(data.stats);
          setStatsCards([
            { id: "total-users", icon: "group", iconColor: "text-amber-500", iconBg: "bg-amber-500/10", trendIcon: "trending_up", trendValue: `+${data.stats.todayNewUsers} today`, trendColor: "text-secondary", label: "Total Users", value: data.stats.totalUsers.toLocaleString() },
            { id: "today-deposit", icon: "account_balance", iconColor: "text-secondary", iconBg: "bg-secondary/10", trendIcon: "arrow_upward", trendValue: formatBDT(data.stats.todayDeposits), trendColor: "text-secondary", label: "Today's Deposit", value: formatBDT(data.stats.todayDeposits) },
            { id: "today-withdraw", icon: "payments", iconColor: "text-error", iconBg: "bg-error/10", trendIcon: "arrow_downward", trendValue: `${data.stats.pendingWithdrawals} pending`, trendColor: "text-error", label: "Today's Withdraw", value: formatBDT(data.stats.todayWithdrawals) },
            { id: "total-profit", icon: "insights", iconColor: "text-primary", iconBg: "bg-primary/10", trendIcon: "add_circle", trendValue: `${data.stats.activeBets} bets`, trendColor: "text-secondary", label: "Total Profit", value: formatBDT(data.stats.totalProfit) },
          ]);
        }
      })
      .catch((err) => console.error(err));
  }, []);
  return (
    <>
      {/* Header Section */}
      <div className="mb-6 sm:mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-100 mb-1 sm:mb-2">
            Dashboard
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm">
            Welcome, view your cricket operations report for today.
          </p>
        </div>
        <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
          <button
            id="btn-today-report"
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-surface-container hover:bg-surface-container-high rounded-lg sm:rounded-xl text-xs sm:text-sm transition-all border border-outline-variant/10 text-slate-300"
          >
            <span className="material-symbols-outlined text-sm">calendar_today</span>
            <span className="hidden xs:inline">Today's</span> Report
          </button>
          <button
            id="btn-export"
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 sm:px-6 py-2 bg-gradient-to-br from-primary to-primary-container text-on-primary font-bold rounded-lg sm:rounded-xl text-xs sm:text-sm transition-all shadow-lg shadow-amber-500/10 active:scale-95 hover:shadow-amber-500/20"
          >
            <span className="material-symbols-outlined text-sm">download</span>
            Export
          </button>
        </div>
      </div>

      {/* Stats Grid — 2 cols on mobile, 4 on lg */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-10">
        {statsCards.map((card, i) => (
          <StatsCard key={card.id} {...card} delay={i * 100} />
        ))}
      </div>

      {/* Bento Grid: Charts & Activity — all full-width on mobile */}
      <div className="grid grid-cols-12 gap-3 sm:gap-4 lg:gap-6">
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
      <footer className="mt-10 sm:mt-16 text-center text-slate-600 text-[10px] uppercase tracking-widest font-bold pb-4">
        © 2026 Gain Live Dashboard Pro • Design & Development Team
      </footer>
    </>
  );
}
