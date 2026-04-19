import { useState, useEffect } from "react";
import { getPolicies } from "../services/api";

const PrivacyPolicyPage = () => {
  const [policies, setPolicies] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPolicies()
      .then((d) => setPolicies(d.policies || {}))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const entries = Object.entries(policies);
  const colors = ["primary-container", "tertiary-fixed-dim"];

  return (
    <main className="pt-[120px] pb-32 px-4 max-w-4xl mx-auto">
      {/* Intro Banner */}
      <header className="relative mb-8 p-6 glass-card border border-outline-variant/20 rounded-xl overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-container/5 rounded-full blur-[80px] -mr-32 -mt-32" />
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-16 h-16 flex items-center justify-center bg-surface-container-high rounded-lg border border-primary-container/30 shadow-[0_0_30px_-5px_rgba(0,245,255,0.2)]">
            <span className="material-symbols-outlined text-3xl text-primary-container" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
          </div>
          <div>
            <h2 className="font-headline font-black text-2xl text-on-background uppercase tracking-tight mb-1">
              Your privacy is our <span className="text-primary-container">priority</span>
            </h2>
            <p className="text-on-surface-variant text-xs font-light leading-relaxed">
              Review how we safeguard your digital signature and data streams.
            </p>
          </div>
        </div>
      </header>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin w-8 h-8 border-2 border-primary-container border-t-transparent rounded-full" />
        </div>
      ) : entries.length === 0 ? (
        <div className="text-center py-16">
          <span className="material-symbols-outlined text-4xl text-on-surface-variant/30 mb-2">description</span>
          <p className="text-on-surface-variant text-sm">No policy content available yet.</p>
        </div>
      ) : (
        <>
          {/* Section Chips */}
          <div className="flex overflow-x-auto gap-2 pb-4 mb-6 hide-scrollbar">
            {entries.map(([key], i) => (
              <button
                key={key}
                className={`whitespace-nowrap px-4 py-2 text-[10px] font-bold uppercase tracking-widest border rounded-sm ${
                  i === 0
                    ? "bg-primary-container text-on-primary-container border-primary-container/50"
                    : "bg-surface-container-high text-on-surface-variant border-outline-variant/30 hover:border-primary-container/50 transition-colors"
                }`}
              >
                {key.replace(/_/g, " ")}
              </button>
            ))}
          </div>

          {/* Content Sections */}
          <div className="space-y-4">
            {entries.map(([key, val], i) => {
              const num = String(i + 1).padStart(2, "0");
              const color = colors[i % 2];
              return (
                <section
                  key={key}
                  className={`glass-card border-l-4 border-l-${color} border-y border-r border-outline-variant/10 p-6 rounded-r-xl relative`}
                >
                  <span className={`absolute top-3 right-4 font-headline font-black text-4xl opacity-5 text-${color} select-none`}>{num}</span>
                  <div className="flex items-start gap-3 mb-4">
                    <div className={`mt-1 w-2 h-6 bg-${color}`} />
                    <h3 className={`font-headline font-bold text-lg text-${color} uppercase tracking-widest`}>
                      {key.replace(/_/g, " ")}
                    </h3>
                  </div>
                  {val.description && (
                    <p className="text-on-surface-variant/60 text-[10px] uppercase tracking-widest mb-3">{val.description}</p>
                  )}
                  <div className="text-on-surface-variant leading-relaxed font-light text-sm whitespace-pre-line">
                    {val.content}
                  </div>
                  {val.updatedAt && (
                    <p className="text-[9px] text-on-surface-variant/40 mt-4 uppercase tracking-widest">
                      Last updated: {new Date(val.updatedAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                    </p>
                  )}
                </section>
              );
            })}
          </div>
        </>
      )}

      {/* Decorative */}
      <div className="mt-12 flex justify-center opacity-20">
        <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-[#00F5FF] to-transparent" />
        <div className="mx-4 transform rotate-45 border border-[#00F5FF] w-2 h-2" />
        <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-[#00F5FF] to-transparent" />
      </div>

      {/* Bottom Acceptance */}
      <div className="mt-8 p-4 border-t border-[#00F5FF]/10 flex flex-col items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary-container text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
          <p className="text-[10px] uppercase font-semibold tracking-tighter text-on-surface-variant">
            By continuing, you acknowledge our data handling standards.
          </p>
        </div>
        <button className="w-full px-10 py-3 bg-primary-container text-on-primary-container font-headline font-black text-sm uppercase tracking-widest active:scale-95 transition-all shadow-[0_0_20px_-5px_rgba(0,245,255,0.4)]">
          I Understand
        </button>
      </div>
    </main>
  );
};

export default PrivacyPolicyPage;
