import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    mobile: "",
    email: "",
    username: "",
    password: "",
    referralCode: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const onChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      setSubmitting(true);
      const response = await fetch("/api/user/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Registration failed");
        return;
      }

      localStorage.setItem("gain-live-user-token", data.token);
      localStorage.setItem("gain-live-user", JSON.stringify(data.user));
      navigate("/");
    } catch {
      setError("Unable to connect to server");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <section className="neon-glow-border rounded-2xl bg-[#0a1228]/70 p-4 backdrop-blur-2xl sm:p-5">
        <div className="mb-4">
          <p className="text-[10px] uppercase tracking-[0.2em] text-cyan-200/70 sm:text-[11px] sm:tracking-[0.22em]">Access Node</p>
          <h2 className="mt-1.5 text-xl font-black tracking-tight text-white sm:mt-2 sm:text-2xl">Create Account</h2>
        </div>

        <form className="space-y-3.5 sm:space-y-4" onSubmit={onSubmit}>
          <label className="block text-xs font-semibold uppercase tracking-[0.22em] text-cyan-100/70" htmlFor="mobile">
            Mobile Number
          </label>
          <div className="input-bracket">
            <input
              id="mobile"
              name="mobile"
              type="tel"
              value={form.mobile}
              onChange={onChange}
              className="bracket-input"
              placeholder="e.g. 9876543210"
              required
            />
          </div>

          <label className="block text-xs font-semibold uppercase tracking-[0.22em] text-cyan-100/70" htmlFor="email">
            Email
          </label>
          <div className="input-bracket">
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={onChange}
              className="bracket-input"
              placeholder="e.g. you@example.com"
              autoComplete="email"
              required
            />
          </div>

          <label className="block text-xs font-semibold uppercase tracking-[0.22em] text-cyan-100/70" htmlFor="username">
            Username
          </label>
          <div className="input-bracket">
            <input
              id="username"
              name="username"
              type="text"
              value={form.username}
              onChange={onChange}
              className="bracket-input"
              placeholder="Choose username"
              required
            />
          </div>

          <label className="block text-xs font-semibold uppercase tracking-[0.22em] text-cyan-100/70" htmlFor="password">
            Password
          </label>
          <div className="input-bracket flex items-center gap-2">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={onChange}
              className="bracket-input"
              placeholder="At least 6 characters"
              required
            />
            <button
              type="button"
              className="mr-2 shrink-0 text-cyan-200/80 transition-colors hover:text-cyan-100"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              <span className="material-symbols-outlined text-[20px]">
                {showPassword ? "visibility_off" : "visibility"}
              </span>
            </button>
          </div>

          <label className="block text-xs font-semibold uppercase tracking-[0.22em] text-cyan-100/70" htmlFor="referralCode">
            Referral Code (optional)
          </label>
          <div className="input-bracket">
            <input
              id="referralCode"
              name="referralCode"
              type="text"
              value={form.referralCode}
              onChange={onChange}
              className="bracket-input"
              placeholder="Enter code if available"
            />
          </div>

          {error && <p className="rounded-md border border-red-400/40 bg-red-500/10 px-3 py-2 text-xs text-red-200">{error}</p>}

          <button type="submit" className="neon-gradient-btn w-full py-3 text-[11px]" disabled={submitting}>
            {submitting ? "CREATING NODE..." : "ACTIVATE NODE"}
          </button>
        </form>

        <div className="my-4 flex items-center gap-3 text-[10px] uppercase tracking-[0.2em] text-cyan-100/55 sm:text-[11px] sm:tracking-[0.22em]">
          <span className="h-px flex-1 bg-cyan-200/20" />
          quick signup
          <span className="h-px flex-1 bg-cyan-200/20" />
        </div>

        <div className="grid grid-cols-1 gap-3">
          <button type="button" className="rounded-lg border border-cyan-300/25 bg-slate-950/50 px-3.5 py-2 text-xs font-semibold text-cyan-50 transition hover:border-cyan-200/50 sm:text-sm">
            Google
          </button>
        </div>

        <p className="mt-4 text-center text-xs text-slate-300/80 sm:text-sm">
          Existing account?{" "}
          <Link to="/login" className="font-semibold text-cyan-200 hover:text-cyan-100">
            Login now
          </Link>
        </p>
      </section>

    </div>
  );
};

export default RegisterPage;
