import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/layout/Sidebar";
import TopNav from "./components/layout/TopNav";
import DashboardPage from "./pages/dashboard/DashboardPage";

export default function App() {
  return (
    <div className="min-h-screen bg-surface-dim">
      {/* Sidebar */}
      <Sidebar />

      {/* Top Navigation */}
      <TopNav />

      {/* Main Content */}
      <main className="ml-72 pt-28 px-8 pb-12 min-h-screen bg-surface-dim">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          {/* Placeholder routes for other pages */}
          <Route path="/users" element={<PlaceholderPage title="ব্যবহারকারী" icon="group" />} />
          <Route path="/payments" element={<PlaceholderPage title="পেমেন্ট" icon="payments" />} />
          <Route path="/analytics" element={<PlaceholderPage title="বিশ্লেষণ" icon="analytics" />} />
          <Route path="/cricket" element={<PlaceholderPage title="ক্রিকেট আপডেট" icon="sports_cricket" />} />
          <Route path="/games" element={<PlaceholderPage title="গেম ব্যবস্থাপনা" icon="sports_esports" />} />
          <Route path="/game-logic" element={<PlaceholderPage title="গেম লজিক" icon="psychology" />} />
          <Route path="/news" element={<PlaceholderPage title="নিউজ" icon="newspaper" />} />
          <Route path="/payment-methods" element={<PlaceholderPage title="পেমেন্ট পদ্ধতি" icon="account_balance_wallet" />} />
          <Route path="/notifications" element={<PlaceholderPage title="নোটিফিকেশন" icon="notifications" />} />
          <Route path="/settings" element={<PlaceholderPage title="সেটিংস" icon="settings" />} />
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
        <h2 className="text-2xl font-black text-slate-100 mb-2 bengali-leading">{title}</h2>
        <p className="text-slate-500 text-sm">এই পেজটি শীঘ্রই আসছে...</p>
      </div>
    </div>
  );
}
