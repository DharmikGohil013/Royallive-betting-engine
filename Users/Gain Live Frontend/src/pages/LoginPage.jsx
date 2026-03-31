import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ accessId: "", password: "", rememberMe: false });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const onChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      setSubmitting(true);
      const response = await fetch("/api/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          accessId: form.accessId,
          password: form.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Authentication failed");
        return;
      }

      localStorage.setItem("gain-live-user-token", data.token);
      localStorage.setItem("gain-live-user", JSON.stringify(data.user));
      localStorage.setItem("gain-live-remember-me", form.rememberMe ? "true" : "false");
      navigate("/");
    } catch {
      setError("Unable to connect to server");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative space-y-8 overflow-hidden pb-4">
      <div className="pointer-events-none absolute -right-10 -top-14 h-60 w-60 rounded-full bg-primary-container/10 blur-[90px]" />
      <div className="pointer-events-none absolute -bottom-16 -left-16 h-72 w-72 rounded-full bg-secondary-container/15 blur-[110px]" />

      <section className="relative z-10 rounded-xl border border-primary-container/15 bg-surface-container/60 p-6 shadow-[0_24px_40px_rgba(0,0,0,0.35)] backdrop-blur-2xl sm:p-8">
        <div className="mb-8">
          <h2 className="font-headline text-3xl font-black uppercase tracking-tight text-on-surface">Initialize</h2>
          <p className="mt-2 text-sm font-medium text-on-surface-variant">Enter your credentials to access the grid.</p>
        </div>

        <form className="space-y-6" onSubmit={onSubmit}>
          <div className="space-y-2">
            <label className="font-headline text-[10px] font-bold uppercase tracking-[0.2em] text-primary-container" htmlFor="accessId">
              Access ID
            </label>
            <div className="relative bg-surface-container-lowest/60 px-3 py-2.5">
              <span className="pointer-events-none absolute left-0 top-0 h-2 w-2 border-l-2 border-t-2 border-primary-container" />
              <span className="pointer-events-none absolute bottom-0 right-0 h-2 w-2 border-b-2 border-r-2 border-primary-container" />
              <input
                id="accessId"
                name="accessId"
                type="text"
                value={form.accessId}
                onChange={onChange}
                className="w-full border-0 bg-transparent px-1 py-1 font-headline text-sm uppercase tracking-wider text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-0"
                placeholder="MOBILE OR EMAIL"
                autoComplete="username"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="font-headline text-[10px] font-bold uppercase tracking-[0.2em] text-primary-container" htmlFor="password">
              Security Key
            </label>
            <div className="relative bg-surface-container-lowest/60 px-3 py-2.5">
              <span className="pointer-events-none absolute left-0 top-0 h-2 w-2 border-l-2 border-t-2 border-primary-container" />
              <span className="pointer-events-none absolute bottom-0 right-0 h-2 w-2 border-b-2 border-r-2 border-primary-container" />
              <input
                id="password"
                name="password"
                type="password"
                value={form.password}
                onChange={onChange}
                className="w-full border-0 bg-transparent px-1 py-1 font-headline text-sm tracking-wider text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-0"
                placeholder="••••••••••••"
                autoComplete="current-password"
                required
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest">
            <label className="group flex cursor-pointer items-center gap-2">
              <span className="flex h-4 w-4 items-center justify-center border border-primary-container/30 bg-surface-container-low transition-transform group-active:scale-90">
                {form.rememberMe && <span className="h-2 w-2 bg-primary-container" />}
              </span>
              <input
                name="rememberMe"
                type="checkbox"
                checked={form.rememberMe}
                onChange={onChange}
                className="sr-only"
              />
              <span className="font-headline text-on-surface-variant transition-colors group-hover:text-primary-container">Remember Me</span>
            </label>

            <button type="button" className="font-headline text-secondary-fixed-dim transition-colors hover:text-secondary-container">
              Forgot Key?
            </button>
          </div>

          {error && <p className="rounded-sm border border-error/40 bg-error-container/35 px-3 py-2 text-xs text-on-error-container">{error}</p>}

          <button
            type="submit"
            className="w-full rounded-sm bg-[linear-gradient(90deg,#00F5FF_0%,#FF2D78_100%)] py-4 font-headline text-sm font-black uppercase tracking-[0.2em] text-on-primary shadow-[0_0_20px_rgba(0,245,255,0.3)] transition-all active:scale-[0.98]"
            disabled={submitting}
          >
            {submitting ? "LOGGING IN..." : "LOGIN"}
          </button>
        </form>

        <div className="mt-8 border-t border-outline-variant/30 pt-6 text-center">
          <p className="text-xs font-medium text-on-surface-variant/70">
            New pilot?{" "}
            <Link to="/register" className="font-bold text-primary-container">
              REQUEST ACCESS
            </Link>
          </p>
        </div>
      </section>

      <section className="group relative z-10 overflow-hidden rounded-lg border border-primary-container/15 bg-surface-container transition-all duration-300 hover:border-primary-container/40">
        <div className="flex items-center">
          <div className="h-24 w-1/3 overflow-hidden">
            <img
              src="/images/bg.jpg"
              alt="Promotional"
              className="h-full w-full object-cover grayscale transition-all duration-500 group-hover:grayscale-0"
            />
          </div>
          <div className="w-2/3 p-4">
            <p className="mb-1 font-headline text-[10px] font-black uppercase tracking-widest text-secondary-fixed-dim">Top Bonus Offer</p>
            <h3 className="font-headline text-lg font-bold uppercase leading-tight text-on-surface">200% Kinetic Boost</h3>
            <p className="mt-1 flex items-center text-[10px] font-bold tracking-tight text-primary-container">
              REDEEM ON FIRST DEPOSIT
              <span className="material-symbols-outlined ml-1 text-xs">bolt</span>
            </p>
          </div>
        </div>
        <div className="pointer-events-none absolute inset-0 h-1/2 w-full -translate-y-full bg-gradient-to-b from-transparent via-primary-container/5 to-transparent transition-transform duration-1000 group-hover:translate-y-full" />
      </section>

      <footer className="z-10 space-y-4 p-2 text-center">
        <div className="flex justify-center gap-6 opacity-35">
          <span className="material-symbols-outlined text-xl">shield</span>
          <span className="material-symbols-outlined text-xl">verified_user</span>
          <span className="material-symbols-outlined text-xl">lock</span>
        </div>
        <p className="font-headline text-[10px] uppercase tracking-[0.3em] text-on-surface-variant/40">Secure Encryption Active</p>
      </footer>
    </div>
  );
};

export default LoginPage;
