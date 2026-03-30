import { useState, useCallback } from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/layout/Sidebar";
import TopNav from "./components/layout/TopNav";
import DashboardPage from "./pages/dashboard/DashboardPage";

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev);
  }, []);

  const closeSidebar = useCallback(() => {
    setSidebarOpen(false);
  }, []);

  return (
    <div className="min-h-screen bg-surface-dim">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />

      {/* Top Navigation */}
      <TopNav onMenuToggle={toggleSidebar} />

      {/* Main Content — responsive left margin */}
      <main className="lg:ml-72 pt-24 sm:pt-28 px-4 sm:px-6 lg:px-8 pb-12 min-h-screen bg-surface-dim">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          {/* Placeholder routes for other pages */}
          <Route path="/users" element={<PlaceholderPage title="Users" icon="group" />} />
          <Route path="/payments" element={<PlaceholderPage title="Payments" icon="payments" />} />
          <Route path="/analytics" element={<PlaceholderPage title="Analytics" icon="analytics" />} />
          <Route path="/cricket" element={<PlaceholderPage title="Cricket Updates" icon="sports_cricket" />} />
          <Route path="/games" element={<PlaceholderPage title="Game Management" icon="sports_esports" />} />
          <Route path="/game-logic" element={<PlaceholderPage title="Game Logic" icon="psychology" />} />
          <Route path="/news" element={<PlaceholderPage title="News" icon="newspaper" />} />
          <Route path="/payment-methods" element={<PlaceholderPage title="Payment Methods" icon="account_balance_wallet" />} />
          <Route path="/notifications" element={<PlaceholderPage title="Notifications" icon="notifications" />} />
          <Route path="/settings" element={<PlaceholderPage title="Settings" icon="settings" />} />
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
