import { Link } from "react-router-dom";

const AuthLayout = ({ title, children }) => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#060b1f] text-on-surface">
      <div className="pointer-events-none absolute inset-0">
        <img src="/images/bg.jpg" alt="" className="h-full w-full object-cover opacity-35" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#060b1f]/75 via-[#040812]/82 to-[#060b1f]" />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_18%,rgba(0,245,255,0.18),transparent_40%),radial-gradient(circle_at_88%_10%,rgba(255,45,120,0.12),transparent_38%)]" />

      <header className="relative z-20 flex h-14 items-center justify-between border-b border-primary-container/10 bg-[#0A0A0F]/80 px-3 backdrop-blur-xl shadow-[0_4px_20px_-5px_rgba(0,245,255,0.2)] sm:h-16 sm:px-4">
        <Link
          to="/"
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-primary-container transition hover:bg-primary-container/10 sm:h-9 sm:w-9"
          aria-label="Back to home"
        >
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
        </Link>

        <img
          src="/logos/gain-live-logo-banner-7.png"
          alt="Gain Live"
          className="h-6 w-auto object-contain sm:h-7"
        />

        <span className="rounded-sm bg-primary-container px-2.5 py-1 text-[10px] font-bold tracking-[0.14em] text-on-primary-container sm:px-3 sm:py-1.5 sm:text-[11px]">
          SECURE
        </span>
      </header>

      <main className="relative z-20 mx-auto w-full max-w-[430px] px-3 pb-8 pt-6 sm:px-5 sm:pt-7">
        <div className="md:origin-top md:scale-[0.95]">
          <div className="mb-4">
            <p className="text-[10px] uppercase tracking-[0.24em] text-primary-container/80 sm:text-[11px] sm:tracking-[0.28em]">Gain Live Protocol</p>
            <h1 className="mt-1.5 font-headline text-xl font-bold text-on-surface sm:mt-2 sm:text-2xl">{title}</h1>
          </div>
          {children}
        </div>
      </main>
    </div>
  );
};

export default AuthLayout;
