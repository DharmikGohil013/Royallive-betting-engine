import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import NavigationDrawer from "./NavigationDrawer";

const Header = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { user, isAuthenticated } = useAuth();

  const balance = user?.balance ?? 0;

  return (
    <>
      <header className="bg-[#0A0A0F]/80 backdrop-blur-xl text-[#00F5FF] fixed top-0 left-0 w-full z-50 border-b border-[#00F5FF]/10 shadow-[0_4px_20px_-5px_rgba(0,245,255,0.2)] md:left-1/2 md:-translate-x-1/2 md:max-w-[460px]">
        <div className="flex justify-between items-center px-4 h-16 w-full">
          <div className="flex items-center gap-3">
            <button
              className="material-symbols-outlined hover:bg-[#00F5FF]/10 transition-all duration-200 active:scale-95 p-2 rounded-lg"
              onClick={() => setDrawerOpen(true)}
            >
              menu
            </button>
            <img
              src="/logos/gain-live-logo-banner-7.png"
              alt="Gain Live"
              className="h-8 w-auto object-contain"
            />
          </div>
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              {/* Balance Bar */}
              <Link
                to="/wallet"
                className="flex items-center gap-1.5 bg-[#00F5FF]/5 border border-[#00F5FF]/20 px-2.5 py-1.5 rounded-lg hover:border-[#00F5FF]/40 transition-all group"
              >
                <span className="material-symbols-outlined text-[#00F5FF] text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>account_balance_wallet</span>
                <span className="font-headline font-black text-xs text-[#00F5FF] tracking-tight">
                  ৳{balance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                <span className="material-symbols-outlined text-[#00F5FF]/50 text-xs group-hover:text-[#00F5FF] transition-colors">add_circle</span>
              </Link>
              {/* Profile */}
              <Link
                to="/account"
                className="flex items-center justify-center bg-surface-container-high/80 border border-primary-container/20 p-2 rounded-lg hover:border-primary-container/40 transition-all"
              >
                <span className="material-symbols-outlined text-[#00F5FF] text-lg">person</span>
              </Link>
            </div>
          ) : (
            <Link
              to="/login"
              className="bg-primary-container text-on-primary-container px-4 py-1.5 font-headline font-bold text-sm tracking-widest hover:brightness-110 active:scale-95 transition-all"
            >
              LOGIN
            </Link>
          )}
        </div>
        {/* Balance Ticker Strip */}
        {isAuthenticated && (
          <div className="flex items-center justify-between px-4 py-1 bg-gradient-to-r from-[#00F5FF]/5 via-transparent to-[#E00363]/5 border-t border-[#00F5FF]/5">
            <div className="flex items-center gap-3">
              <span className="text-[9px] font-label uppercase tracking-[0.15em] text-[#E4E1E9]/40">Balance</span>
              <span className="text-[10px] font-headline font-bold text-[#00F5FF]">
                ৳{balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/wallet" className="text-[9px] font-label font-bold uppercase tracking-[0.15em] text-[#00F5FF]/60 hover:text-[#00F5FF] transition-colors flex items-center gap-1">
                <span className="material-symbols-outlined text-[10px]">payments</span>
                Deposit
              </Link>
              <span className="text-[#E4E1E9]/10">|</span>
              <Link to="/wallet" className="text-[9px] font-label font-bold uppercase tracking-[0.15em] text-[#E4E1E9]/40 hover:text-[#E4E1E9] transition-colors flex items-center gap-1">
                <span className="material-symbols-outlined text-[10px]">north_east</span>
                Withdraw
              </Link>
            </div>
          </div>
        )}
      </header>
      <NavigationDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
};

export default Header;
