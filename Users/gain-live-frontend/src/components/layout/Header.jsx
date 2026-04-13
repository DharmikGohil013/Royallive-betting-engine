import { useState } from "react";
import { Link } from "react-router-dom";
import NavigationDrawer from "./NavigationDrawer";

const Header = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

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
          <Link
            to="/login"
            className="bg-primary-container text-on-primary-container px-4 py-1.5 font-headline font-bold text-sm tracking-widest hover:brightness-110 active:scale-95 transition-all"
          >
            LOGIN
          </Link>
        </div>
      </header>
      <NavigationDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
};

export default Header;
