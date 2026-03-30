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
    <div className="space-y-5">
      <section className="neon-glow-border rounded-3xl bg-[#0a1228]/70 p-5 backdrop-blur-2xl sm:p-6">
        <div className="mb-5">
          <p className="text-[11px] uppercase tracking-[0.22em] text-cyan-200/70">Initialize Sequence</p>
          <h2 className="mt-2 text-2xl font-black tracking-tight text-white">User Login</h2>
        </div>

        <form className="space-y-4" onSubmit={onSubmit}>
          <label className="block text-xs font-semibold uppercase tracking-[0.22em] text-cyan-100/70" htmlFor="accessId">
            Access ID
          </label>
          <div className="input-bracket">
            <input
              id="accessId"
              name="accessId"
              type="text"
              value={form.accessId}
              onChange={onChange}
              className="bracket-input"
              placeholder="Mobile Number or Username"
              autoComplete="username"
              required
            />
          </div>

          <label className="mt-4 block text-xs font-semibold uppercase tracking-[0.22em] text-cyan-100/70" htmlFor="password">
            Security Key
          </label>
          <div className="input-bracket">
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={onChange}
              className="bracket-input"
              placeholder="Enter your password"
              autoComplete="current-password"
              required
            />
          </div>

          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 text-cyan-100/85">
              <input
                name="rememberMe"
                type="checkbox"
                checked={form.rememberMe}
                onChange={onChange}
                className="h-4 w-4 accent-cyan-400"
              />
              Remember Me
            </label>
            <button type="button" className="text-pink-300 transition hover:text-pink-200">
              Forgot Key?
            </button>
          </div>

          {error && <p className="rounded-md border border-red-400/40 bg-red-500/10 px-3 py-2 text-xs text-red-200">{error}</p>}

          <button type="submit" className="neon-gradient-btn mt-2 w-full" disabled={submitting}>
            {submitting ? "INITIALIZING..." : "INITIALIZE"}
          </button>
        </form>

        <div className="my-5 flex items-center gap-3 text-[11px] uppercase tracking-[0.22em] text-cyan-100/55">
          <span className="h-px flex-1 bg-cyan-200/20" />
          or continue with
          <span className="h-px flex-1 bg-cyan-200/20" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button type="button" className="rounded-xl border border-cyan-300/25 bg-slate-950/50 px-4 py-2.5 text-sm font-semibold text-cyan-50 transition hover:border-cyan-200/50">
            Google
          </button>
          <button type="button" className="rounded-xl border border-pink-300/30 bg-slate-950/50 px-4 py-2.5 text-sm font-semibold text-pink-100 transition hover:border-pink-200/60">
            Telegram
          </button>
        </div>

        <p className="mt-5 text-center text-sm text-slate-300/80">
          New user?{" "}
          <Link to="/register" className="font-semibold text-cyan-200 hover:text-cyan-100">
            Register here
          </Link>
        </p>
      </section>

      <section className="rounded-2xl border border-cyan-400/20 bg-[#0d1a33]/70 p-4 backdrop-blur-xl">
        <p className="text-[11px] uppercase tracking-[0.25em] text-cyan-200/70">Live Promotion</p>
        <h3 className="mt-2 text-lg font-extrabold text-white">Welcome Bonus: 100% Match</h3>
        <p className="mt-1 text-sm text-slate-300/85">Authenticate and unlock instant onboarding rewards for your first play.</p>
      </section>

      <footer className="grid grid-cols-3 gap-2 text-center text-[11px] text-slate-300/70">
        <div className="rounded-xl border border-cyan-300/15 bg-slate-950/50 px-2 py-2">SSL Shield</div>
        <div className="rounded-xl border border-cyan-300/15 bg-slate-950/50 px-2 py-2">Encrypted API</div>
        <div className="rounded-xl border border-cyan-300/15 bg-slate-950/50 px-2 py-2">Fraud Guard</div>
      </footer>
    </div>
  );
};

export default LoginPage;
