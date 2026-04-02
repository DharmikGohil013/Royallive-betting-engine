import { NavLink, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { sidebarNav } from "../../data/dashboardData";

const ADMIN_PROFILE_IMG =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBUbLR-LZQBWrDCd6JeKvCowKmTiu8OSvEhwpPM1JZbXtSv6x6KUR4RbLr8iqYsdNrQuMnAFYb6OFfQAhsJ8twJn1dvT0Lwz9GPMphoNyLH-wJyZf-T3J1dfDP-Dd-5_w7SNS2b50v1Hx3jlMhyMEFXwOD3mjwIUcYOw0tBcOSdCS90I80FFQEnYGuZqVc4ES_Xb7BPnyapZPHOPXv5jW2gI347Gqs9p7ffsHkOsX8iq1N-4UWtmTQeyW2ylyivSAIDmN5_ScZdGw";

export default function Sidebar({ isOpen, onClose, onLogout }) {
  const location = useLocation();

  // Close sidebar on route change (mobile)
  useEffect(() => {
    onClose();
  }, [location.pathname, onClose]);

  // Lock body scroll when sidebar is open on mobile
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      {/* Backdrop overlay — mobile only */}
      <div
        className={`fixed inset-0 bg-black/60 z-40 lg:hidden transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <aside
        id="sidebar"
        className={`
          bg-surface-container-low h-screen w-72 fixed left-0 top-0
          overflow-y-auto border-none shadow-2xl shadow-black/40
          flex flex-col py-6 z-50 custom-scrollbar
          transition-transform duration-300 ease-in-out
          lg:translate-x-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Close button — mobile only */}
        <button
          onClick={onClose}
          className="lg:hidden absolute top-4 right-4 p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/10 transition-all"
          aria-label="Close sidebar"
        >
          <span className="material-symbols-outlined">close</span>
        </button>

        {/* Brand */}
        <div className="px-6 mb-10">
          <img
            src="/logos/gain-live-logo-banner-7.png"
            alt="Gain Live"
            className="h-14 w-auto object-contain"
          />
          <p className="text-xs text-slate-500 tracking-[0.2em] mt-2 uppercase font-bold px-2">
            Admin Panel
          </p>
        </div>

        {/* Admin Profile */}
        <div className="px-6 mb-8 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-surface-container-high overflow-hidden shrink-0">
            <img
              alt="Admin profile picture"
              className="w-full h-full object-cover"
              src={ADMIN_PROFILE_IMG}
            />
          </div>
          <div>
            <p className="text-slate-100 font-bold text-sm">Admin</p>
            <img
              src="/logos/gain-live-logo-banner-7.png"
              alt="Gain Live Logo"
              className="h-4 w-auto object-contain mt-1 opacity-90"
            />
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
          <button
            onClick={onLogout}
            className="text-slate-400 hover:text-red-400 hover:bg-red-500/5 transition-all duration-200 flex items-center gap-3 px-4 py-3 rounded-lg active:scale-95 mt-10 w-full"
          >
            <span className="material-symbols-outlined">logout</span>
            <span className="text-sm">Logout</span>
          </button>
        </nav>
      </aside>
    </>
  );
}
