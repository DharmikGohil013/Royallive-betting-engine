import { Link, useLocation } from "react-router-dom";

const menuSections = [
  {
    items: [
      { icon: "home", label: "Home", path: "/" },
      { icon: "sports_esports", label: "Games", path: "/games" },
      { icon: "sports_soccer", label: "Sports", path: "/sports" },
      { icon: "sports_cricket", label: "Cricket", path: "/cricket" },
      { icon: "casino", label: "Live Casino", path: "/live-casino" },
    ],
  },
  {
    items: [
      { icon: "account_balance_wallet", label: "Wallet", path: "/wallet", filled: true },
      { icon: "celebration", label: "Promotions", path: "/promotions" },
      { icon: "group_add", label: "Referrals", path: "/referrals" },
    ],
  },
  {
    items: [
      { icon: "history", label: "History", path: "/history" },
      { icon: "settings", label: "Settings", path: "/settings" },
      { icon: "verified_user", label: "Responsible Gaming", path: "/responsible-gaming" },
      { icon: "info", label: "About", path: "/about" },
    ],
  },
];

const NavigationDrawer = ({ isOpen, onClose }) => {
  const location = useLocation();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60]" onClick={onClose}>
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Drawer */}
      <aside
        className="relative bg-[#0A0A0F] h-full w-[80%] max-w-[320px] shadow-[20px_0_50px_rgba(0,0,0,0.8)] flex flex-col border-r border-[#00F5FF]/10 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* User Section */}
        <div className="p-6 pt-10 flex flex-col items-start gap-4 bg-gradient-to-b from-[#00F5FF]/5 to-transparent">
          <div className="relative">
            <div className="w-16 h-16 rounded-full border-2 border-[#00F5FF] p-0.5 shadow-[0_0_15px_rgba(0,245,255,0.4)]">
              <div className="w-full h-full rounded-full bg-surface-container-high flex items-center justify-center">
                <span className="material-symbols-outlined text-[#00F5FF] text-2xl">person</span>
              </div>
            </div>
            <div className="absolute -bottom-1 -left-1 bg-primary-container text-on-primary-container text-[8px] font-black px-1.5 py-0.5 rounded-sm tracking-tighter border border-on-primary/20">
              LVL 4
            </div>
          </div>
          <div className="space-y-0.5">
            <h2 className="font-headline font-bold text-lg text-[#E4E1E9] leading-tight">GUEST USER</h2>
            <div className="flex items-center gap-1.5 py-0.5 px-2 bg-tertiary-container/10 border border-tertiary-container/30 rounded-full">
              <span className="material-symbols-outlined text-tertiary-fixed-dim text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
              <span className="text-tertiary-fixed-dim font-headline font-bold text-[10px] tracking-widest">VIP ELITE MEMBER</span>
            </div>
            <div className="mt-2 text-primary-fixed-dim font-headline font-bold text-sm">$12,450.00</div>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1 divide-y divide-[#00F5FF]/5">
          {menuSections.map((section, si) => (
            <div key={si} className={si > 0 ? "py-2 space-y-1" : "pb-2 space-y-1"}>
              {section.items.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={onClose}
                    className={
                      isActive
                        ? "bg-[#00F5FF]/10 text-[#00F5FF] border-l-4 border-[#00F5FF] flex items-center gap-4 px-4 py-3 transition-all duration-200 rounded-r-lg group"
                        : "flex items-center gap-4 px-4 py-3 text-[#E4E1E9] opacity-70 hover:bg-[#00F5FF]/5 transition-all duration-200 rounded-lg group"
                    }
                  >
                    <span
                      className="material-symbols-outlined text-[#00F5FF] group-hover:scale-110 transition-transform"
                      style={item.filled ? { fontVariationSettings: "'FILL' 1" } : undefined}
                    >
                      {item.icon}
                    </span>
                    <span className="font-headline font-bold text-sm tracking-wide">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          ))}
          <div className="pt-2">
            <Link
              to="/login"
              onClick={onClose}
              className="flex items-center gap-4 px-4 py-3 text-secondary-container hover:bg-secondary-container/10 transition-all duration-200 rounded-lg group"
            >
              <span className="material-symbols-outlined">logout</span>
              <span className="font-headline font-bold text-sm tracking-widest">LOGOUT</span>
            </Link>
          </div>
        </nav>

        {/* Footer */}
        <footer className="p-6 bg-surface-container-lowest border-t border-[#00F5FF]/5">
          <div className="flex justify-between items-center">
            <div className="flex gap-4">
              <a className="text-[#E4E1E9]/40 hover:text-[#00F5FF] transition-colors" href="#">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.11.02-1.93 1.23-5.46 3.62-.51.35-.98.53-1.39.52-.46-.01-1.33-.26-1.98-.48-.8-.27-1.43-.42-1.37-.89.03-.25.38-.51 1.03-.78 4.04-1.75 6.73-2.91 8.07-3.47 3.83-1.59 4.63-1.87 5.15-1.88.11 0 .37.03.53.17.14.12.18.28.19.45z" /></svg>
              </a>
              <a className="text-[#E4E1E9]/40 hover:text-[#00F5FF] transition-colors" href="#">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8A3.6 3.6 0 0 0 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6A3.6 3.6 0 0 0 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8 1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3z" /></svg>
              </a>
              <a className="text-[#E4E1E9]/40 hover:text-[#00F5FF] transition-colors" href="#">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
              </a>
            </div>
            <span className="font-body text-[10px] text-[#E4E1E9]/30 tracking-widest font-medium uppercase">v2.4.1</span>
          </div>
        </footer>
      </aside>
    </div>
  );
};

export default NavigationDrawer;
