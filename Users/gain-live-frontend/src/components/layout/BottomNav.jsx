import { useLocation, Link } from "react-router-dom";
import { navItems } from "../../data/homeData";

const BottomNav = () => {
  const location = useLocation();

  return (
    <nav className="bg-[#131318]/90 backdrop-blur-lg fixed bottom-0 left-0 w-full z-50 rounded-t-lg border-t-2 border-t-[#00F5FF]/20 shadow-[0_-10px_30px_-10px_rgba(0,245,255,0.15)] md:left-1/2 md:-translate-x-1/2 md:max-w-[460px]">
      <div className="flex justify-around items-center h-20 pb-safe w-full">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={
                isActive
                  ? "flex flex-col items-center justify-center text-[#00F5FF] border-t-2 border-[#00F5FF] -mt-[2px] pt-2 active:scale-90 transition-all duration-100"
                  : "flex flex-col items-center justify-center text-[#E4E1E9]/60 pt-2 hover:text-[#00F5FF] transition-colors active:scale-90 transition-all duration-100"
              }
            >
              <span className="material-symbols-outlined mb-1">{item.icon}</span>
              <span className="font-['Inter'] text-[10px] font-medium uppercase tracking-wider">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
