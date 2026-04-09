import { useState, useCallback } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/layout/Sidebar";
import TopNav from "./components/layout/TopNav";
import DashboardPage from "./pages/dashboard/DashboardPage";
import LoginPage from "./pages/LoginPage";
import UserManagementPage from "./pages/users/UserManagementPage";
import AnalyticsPage from "./pages/analytics/AnalyticsPage";
import CricketUpdatesPage from "./pages/cricket/CricketUpdatesPage";
import GameManagementPage from "./pages/games/GameManagementPage";
import GameLogicPage from "./pages/game-logic/GameLogicPage";
import AboutManagementPage from "./pages/about/AboutManagementPage";
import SettingsPage from "./pages/settings/SettingsPage";
import DataManagementPage from "./pages/data/DataManagementPage";
import NotificationsPage from "./pages/notifications/NotificationsPage";
import GameStatisticsPage from "./pages/game-stats/GameStatisticsPage";
import PaymentMethodsPage from "./pages/payment-methods/PaymentMethodsPage";
import PolicyPage from "./pages/policy/PolicyPage";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => sessionStorage.getItem("gain-live-admin-auth") === "true"
  );
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev);
  }, []);

  const closeSidebar = useCallback(() => {
    setSidebarOpen(false);
  }, []);

  const handleLoginSuccess = useCallback(() => {
    sessionStorage.setItem("gain-live-admin-auth", "true");
    setIsAuthenticated(true);
  }, []);

  const handleLogout = useCallback(() => {
    sessionStorage.removeItem("gain-live-admin-auth");
    setIsAuthenticated(false);
    setSidebarOpen(false);
  }, []);

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage onLoginSuccess={handleLoginSuccess} />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <div className="min-h-screen bg-surface-dim">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} onLogout={handleLogout} />

      {/* Top Navigation */}
      <TopNav onMenuToggle={toggleSidebar} />

      {/* Main Content — responsive left margin */}
      <main className="lg:ml-72 pt-24 sm:pt-28 px-4 sm:px-6 lg:px-8 pb-12 min-h-screen bg-surface-dim">
        <Routes>
          <Route path="/login" element={<Navigate to="/" replace />} />
          <Route path="/" element={<DashboardPage />} />
          <Route path="/users" element={<UserManagementPage />} />
          {/* Placeholder routes for other pages */}
          <Route path="/payments" element={<PlaceholderPage title="Payments" icon="payments" />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/cricket" element={<CricketUpdatesPage />} />
          <Route path="/games" element={<GameManagementPage />} />
          <Route path="/game-logic" element={<GameLogicPage />} />
          <Route path="/news" element={<PlaceholderPage title="News" icon="newspaper" />} />
          <Route path="/about" element={<AboutManagementPage />} />
          <Route path="/policy" element={<PolicyPage />} />
          <Route path="/payment-methods" element={<PaymentMethodsPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
              <Route path="statistics" element={<GameStatisticsPage />} />
          <Route path="/data" element={<DataManagementPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </main>
    </div>
  );
}

// Placeholder for other pages — will be replaced later
function PlaceholderPage({ title, icon }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
      <div className="w-24 h-24 rounded-3xl bg-surface-container flex items-center justify-center">
        <span className="material-symbols-outlined text-5xl text-amber-500/40">{icon}</span>
      </div>
      <div className="text-center">
        <h2 className="text-2xl font-black text-slate-100 mb-2">{title}</h2>
        <p className="text-slate-500 text-sm">This page is coming soon...</p>
      </div>
    </div>
  );
}
