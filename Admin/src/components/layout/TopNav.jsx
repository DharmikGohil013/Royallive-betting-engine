export default function TopNav({ onMenuToggle }) {
  return (
    <header
      id="top-nav"
      className="fixed top-0 right-0 w-full lg:w-[calc(100%-18rem)] z-30 bg-[#10141a]/70 backdrop-blur-xl shadow-sm shadow-black/20 flex justify-between items-center px-4 sm:px-6 lg:px-8 h-16 sm:h-20"
    >
      {/* Left: Hamburger + Search */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {/* Hamburger — mobile/tablet only */}
        <button
          id="btn-menu-toggle"
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-white/5 transition-all shrink-0"
          aria-label="Toggle sidebar menu"
        >
          <span className="material-symbols-outlined">menu</span>
        </button>

        {/* Search */}
        <div className="relative w-full max-w-sm">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-lg">
            search
          </span>
          <input
            id="search-input"
            className="bg-surface-container-low border-none rounded-xl py-2 sm:py-2.5 pl-11 pr-4 text-sm text-slate-200 focus:ring-1 focus:ring-amber-500/50 w-full transition-all placeholder:text-slate-600"
            placeholder="Search..."
            type="text"
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3 sm:gap-6 shrink-0 ml-3">
        <div className="flex items-center gap-1 sm:gap-3">
          <button
            id="btn-notifications"
            className="relative hover:bg-white/5 p-2 rounded-lg transition-all text-slate-400 hover:text-amber-400"
          >
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-2 right-2 w-2 h-2 bg-secondary rounded-full border-2 border-[#10141a] live-pulse"></span>
          </button>
          <button
            id="btn-settings"
            className="hover:bg-white/5 p-2 rounded-lg transition-all text-slate-400 hover:text-amber-400 hidden sm:block"
          >
            <span className="material-symbols-outlined">settings</span>
          </button>
        </div>

        {/* Divider */}
        <div className="h-8 w-[1px] bg-slate-800/50 hidden sm:block"></div>

        {/* Profile */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="text-right hidden md:block">
            <p className="text-slate-100 text-xs font-bold">Admin Profile</p>
            <p className="text-slate-500 text-[10px]">Active Session</p>
          </div>
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-500 font-bold border border-amber-500/30 text-sm">
            A
          </div>
        </div>
      </div>
    </header>
  );
}
