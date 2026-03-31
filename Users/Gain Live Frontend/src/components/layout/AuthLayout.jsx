import { Link } from "react-router-dom";

const AuthLayout = ({ title, children }) => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#060b1f] text-on-surface">
      <div className="pointer-events-none absolute inset-0">
        <img src="/images/bg.jpg" alt="" className="h-full w-full object-cover opacity-35" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#060b1f]/75 via-[#040812]/82 to-[#060b1f]" />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_18%,rgba(0,245,255,0.18),transparent_40%),radial-gradient(circle_at_88%_10%,rgba(255,45,120,0.12),transparent_38%)]" />

      <header className="relative z-20 flex h-16 items-center justify-between border-b border-primary-container/10 bg-[#0A0A0F]/80 px-4 backdrop-blur-xl shadow-[0_4px_20px_-5px_rgba(0,245,255,0.2)]">
        <Link
          to="/"
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-primary-container transition hover:bg-primary-container/10"
          aria-label="Back to home"
        >
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
        </Link>

        <img
          src="/logos/gain-live-logo-banner-7.png"
          alt="Gain Live"
          className="h-7 w-auto object-contain"
        />

        <span className="rounded-sm bg-primary-container px-3 py-1.5 text-[11px] font-bold tracking-[0.15em] text-on-primary-container">
          SECURE
        </span>
      </header>

      <main className="relative z-20 mx-auto w-full max-w-[460px] px-4 pb-10 pt-8 sm:px-6">
        <div className="mb-5">
          <p className="text-[11px] uppercase tracking-[0.28em] text-primary-container/80">Gain Live Protocol</p>
          <h1 className="mt-2 font-headline text-2xl font-bold text-on-surface sm:text-3xl">{title}</h1>
        </div>
        {children}
      </main>
    </div>
  );
};

export default AuthLayout;
