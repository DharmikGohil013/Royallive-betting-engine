export default function TopNav() {
  return (
    <header
      id="top-nav"
      className="fixed top-0 right-0 w-[calc(100%-18rem)] z-40 bg-[#10141a]/70 backdrop-blur-xl shadow-sm shadow-black/20 flex justify-between items-center px-8 h-20"
    >
      {/* Search */}
      <div className="flex items-center gap-4 w-1/3">
        <div className="relative w-full max-w-sm">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-lg">
            search
          </span>
          <input
            id="search-input"
            className="bg-surface-container-low border-none rounded-xl py-2.5 pl-11 pr-4 text-sm text-slate-200 focus:ring-1 focus:ring-amber-500/50 w-full transition-all placeholder:text-slate-600"
            placeholder="অনুসন্ধান করুন..."
            type="text"
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <button
            id="btn-notifications"
            className="relative hover:bg-white/5 p-2 rounded-lg transition-all text-slate-400 hover:text-amber-400"
          >
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-2 right-2 w-2 h-2 bg-secondary rounded-full border-2 border-[#10141a] live-pulse"></span>
          </button>
          <button
            id="btn-settings"
            className="hover:bg-white/5 p-2 rounded-lg transition-all text-slate-400 hover:text-amber-400"
          >
            <span className="material-symbols-outlined">settings</span>
          </button>
        </div>

        {/* Divider - using spacing instead of line per design system */}
        <div className="h-8 w-[1px] bg-slate-800/50"></div>

        {/* Profile */}
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-slate-100 text-xs font-bold">অ্যাডমিন প্রোফাইল</p>
            <p className="text-slate-500 text-[10px]">অ্যাক্টিভ সেশন</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-500 font-bold border border-amber-500/30">
            A
          </div>
        </div>
      </div>
    </header>
  );
}
