import { Link } from "react-router-dom";

const AuthLayout = ({ title, children }) => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_12%_22%,rgba(0,245,255,0.2),transparent_42%),radial-gradient(circle_at_88%_10%,rgba(255,45,120,0.18),transparent_45%),linear-gradient(180deg,#060b1e_0%,#040615_55%,#070817_100%)] px-4 py-6 sm:px-6">
      <div className="pointer-events-none absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:22px_22px]" />

      <header className="relative z-10 mx-auto flex w-full max-w-[460px] items-center justify-between rounded-2xl border border-cyan-300/20 bg-slate-950/55 px-4 py-3 backdrop-blur-xl">
        <Link
          to="/"
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-cyan-300/30 text-cyan-200 transition hover:border-cyan-300/60 hover:text-cyan-100"
          aria-label="Back to home"
        >
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
        </Link>

        <img
          src="/logos/gain-live-logo-banner-7.png"
          alt="Gain Live"
          className="h-7 w-auto object-contain sm:h-8"
        />

        <span className="rounded-full border border-cyan-300/20 bg-cyan-400/10 px-2.5 py-1 text-[10px] font-semibold tracking-[0.22em] text-cyan-100/90">
          SECURE
        </span>
      </header>

      <main className="relative z-10 mx-auto mt-8 w-full max-w-[460px]">
        <div className="mb-5">
          <p className="text-[11px] uppercase tracking-[0.28em] text-cyan-200/80">Gain Live Protocol</p>
          <h1 className="mt-2 font-headline text-2xl font-bold text-slate-100 sm:text-3xl">{title}</h1>
        </div>
        {children}
      </main>
    </div>
  );
};

export default AuthLayout;
