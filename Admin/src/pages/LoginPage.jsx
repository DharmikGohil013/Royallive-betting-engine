import { useState } from "react";
import { adminLogin } from "../services/api";

export default function LoginPage({ onLoginSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await adminLogin(username, password);
      onLoginSuccess();
    } catch (err) {
      setError(err.message || "Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-surface-dim text-on-surface antialiased min-h-screen flex flex-col items-center justify-center cricket-mesh relative overflow-hidden px-4">
      <div className="absolute -top-24 -right-24 opacity-5 rotate-12 pointer-events-none">
        <span className="material-symbols-outlined text-[320px] text-primary">sports_cricket</span>
      </div>
      <div className="absolute -bottom-24 -left-24 opacity-5 -rotate-12 pointer-events-none">
        <span className="material-symbols-outlined text-[320px] text-primary">stadium</span>
      </div>

      <main className="relative z-10 w-full max-w-[440px]">
        <div className="flex flex-col items-center mb-10">
          <img
            src="/logos/gain-live-logo-banner-7.png"
            alt="Gain Live"
            className="h-20 w-auto object-contain"
          />
        </div>

        <div className="bg-surface-container/70 backdrop-blur-xl rounded-xl p-6 sm:p-8 shadow-2xl shadow-black/60 border border-outline-variant/5">
          <div className="mb-8">
            <h2 className="text-xl font-bold text-on-surface mb-2">Admin Login</h2>
            <p className="text-on-surface-variant text-sm leading-relaxed">
              Please log in to access your account.
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-sm font-medium text-on-surface-variant block ml-1" htmlFor="username">
                Username
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-outline text-xl group-focus-within:text-primary transition-colors">
                    person
                  </span>
                </div>
                <input
                  className="w-full bg-surface-container-low border-none focus:ring-2 focus:ring-primary/20 rounded-lg py-3.5 pl-12 pr-4 text-on-surface placeholder-outline/50 transition-all h-[52px]"
                  id="username"
                  name="username"
                  placeholder="Enter your username"
                  type="text"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  autoComplete="username"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-on-surface-variant block ml-1" htmlFor="password">
                Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-outline text-xl group-focus-within:text-primary transition-colors">
                    lock
                  </span>
                </div>
                <input
                  className="w-full bg-surface-container-low border-none focus:ring-2 focus:ring-primary/20 rounded-lg py-3.5 pl-12 pr-12 text-on-surface placeholder-outline/50 transition-all h-[52px]"
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="current-password"
                />
                <button
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-outline hover:text-primary transition-colors"
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  <span className="material-symbols-outlined text-xl">
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </div>

            {error ? (
              <p className="text-xs text-error bg-error/10 border border-error/20 rounded-lg px-3 py-2">
                {error}
              </p>
            ) : null}

            <button
              className="w-full gold-gradient text-on-primary font-bold py-4 rounded-lg shadow-lg shadow-primary/10 hover:brightness-110 active:scale-[0.98] transition-all duration-200 text-lg flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </button>
          </form>
        </div>

        <footer className="mt-10 text-center">
          <p className="text-on-surface-variant/40 text-xs font-headline tracking-wider">
            © 2026 GAIN LIVE ADMIN PANEL • ALL RIGHTS RESERVED
          </p>
        </footer>
      </main>

      <div className="fixed bottom-0 right-0 w-96 h-96 opacity-10 blur-3xl pointer-events-none translate-x-1/4 translate-y-1/4">
        <div className="w-full h-full bg-primary rounded-full"></div>
      </div>
    </div>
  );
}