import { useState } from "react";

const Header = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <header className="bg-[#0A0A0F]/80 backdrop-blur-xl border-b border-[#00F5FF]/10 fixed top-0 w-full z-50 shadow-[0_4px_20px_-5px_rgba(0,245,255,0.2)]">
      <div className="flex justify-between items-center px-4 h-16 w-full">
        <div className="flex items-center gap-3">
          <span
            className="material-symbols-outlined text-[#00F5FF] active:scale-95 transition-transform cursor-pointer"
            onClick={() => setDrawerOpen(!drawerOpen)}
          >
            menu
          </span>
          <img
            src="/logos/gain-live-logo-banner-7.png"
            alt="Gain Live"
            className="h-8 w-auto object-contain"
          />
        </div>
        <button className="bg-primary-container text-on-primary-container px-4 py-1.5 rounded-sm font-['Space_Grotesk'] font-bold text-xs tracking-wider active:scale-95 transition-transform hover:bg-primary-container/90">
          DEPOSIT
        </button>
      </div>
    </header>
  );
};

export default Header;
