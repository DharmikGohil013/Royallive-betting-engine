import { NavLink } from "react-router-dom";
import { sidebarNav } from "../../data/dashboardData";

const ADMIN_PROFILE_IMG =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBUbLR-LZQBWrDCd6JeKvCowKmTiu8OSvEhwpPM1JZbXtSv6x6KUR4RbLr8iqYsdNrQuMnAFYb6OFfQAhsJ8twJn1dvT0Lwz9GPMphoNyLH-wJyZf-T3J1dfDP-Dd-5_w7SNS2b50v1Hx3jlMhyMEFXwOD3mjwIUcYOw0tBcOSdCS90I80FFQEnYGuZqVc4ES_Xb7BPnyapZPHOPXv5jW2gI347Gqs9p7ffsHkOsX8iq1N-4UWtmTQeyW2ylyivSAIDmN5_ScZdGw";

export default function Sidebar() {
  return (
    <aside
      id="sidebar"
      className="bg-surface-container-low h-screen w-72 fixed left-0 top-0 overflow-y-auto border-none shadow-2xl shadow-black/40 flex flex-col py-6 z-50 custom-scrollbar"
    >
      {/* Brand */}
      <div className="px-8 mb-10">
        <h1 className="text-2xl font-black tracking-tight text-amber-500 uppercase">
          GAIN LIVE
        </h1>
        <p className="text-xs text-slate-500 tracking-[0.2em] mt-1 uppercase font-bold">
          Admin Panel
        </p>
      </div>

      {/* Admin Profile */}
      <div className="px-6 mb-8 flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-surface-container-high overflow-hidden">
          <img
            alt="অ্যাডমিন প্রোফাইল ছবি"
            className="w-full h-full object-cover"
            src={ADMIN_PROFILE_IMG}
          />
        </div>
        <div>
          <p className="text-slate-100 font-bold text-sm">অ্যাডমিন</p>
          <p className="text-slate-500 text-xs">ক্রিকেট অপারেশনস</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1">
        {sidebarNav.map((item, idx) => {
          if (item.type === "section") {
            return (
              <div key={`section-${idx}`} className="pt-4 pb-2 px-4">
                <p className="text-[10px] font-bold text-slate-600 tracking-widest uppercase">
                  {item.label}
                </p>
              </div>
            );
          }

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                isActive
                  ? "bg-amber-500/10 text-[#f59e0b] font-bold border-r-4 border-[#f59e0b] flex items-center gap-3 px-4 py-3 rounded-l-lg transition-all duration-200"
                  : "text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-all duration-200 flex items-center gap-3 px-4 py-3 rounded-lg active:scale-95"
              }
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span className="text-sm">{item.label}</span>
            </NavLink>
          );
        })}

        {/* Logout */}
        <button className="text-slate-400 hover:text-red-400 hover:bg-red-500/5 transition-all duration-200 flex items-center gap-3 px-4 py-3 rounded-lg active:scale-95 mt-10 w-full">
          <span className="material-symbols-outlined">logout</span>
          <span className="text-sm">লগআউট</span>
        </button>
      </nav>
    </aside>
  );
}
