import { useState, useEffect } from "react";
import { getAboutInfo } from "../services/api";

const AboutPage = () => {
  const [about, setAbout] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAboutInfo()
      .then((d) => setAbout(d.about || {}))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const entries = Object.entries(about);
  const icons = ["rocket_launch", "category", "shield", "mail", "info", "star", "groups", "public"];

  return (
    <main className="pt-20 pb-32 px-4">
      <header className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <img
            src="/logos/gain-live-logo-blue-w-5.png"
            alt="Gain Live"
            className="h-16 w-auto object-contain"
          />
        </div>
        <h1 className="font-headline font-black text-2xl uppercase tracking-tight">
          About <span className="text-primary-container">Gain Live</span>
        </h1>
        <p className="text-on-surface-variant text-xs mt-2 leading-relaxed">
          The next generation of premium gaming and sportsbook experiences.
        </p>
      </header>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin w-8 h-8 border-2 border-primary-container border-t-transparent rounded-full" />
        </div>
      ) : entries.length === 0 ? (
        <div className="text-center py-16">
          <span className="material-symbols-outlined text-4xl text-on-surface-variant/30 mb-2">info</span>
          <p className="text-on-surface-variant text-sm">No about information available yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {entries.map(([key, val], i) => (
            <section key={key} className="bg-surface-container border border-outline-variant/10 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="material-symbols-outlined text-primary-container text-lg">{icons[i % icons.length]}</span>
                <h3 className="font-headline font-bold text-sm uppercase tracking-widest text-primary-container">
                  {key.replace(/_/g, " ")}
                </h3>
              </div>
              {val.description && (
                <p className="text-[10px] text-on-surface-variant/60 uppercase tracking-widest mb-2">{val.description}</p>
              )}
              <p className="text-xs text-on-surface-variant leading-relaxed whitespace-pre-line">
                {val.content}
              </p>
              {val.updatedAt && (
                <p className="text-[9px] text-on-surface-variant/40 mt-3 uppercase tracking-widest">
                  Last updated: {new Date(val.updatedAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                </p>
              )}
            </section>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="mt-8 text-center">
        <p className="text-[10px] text-on-surface-variant uppercase tracking-widest">
          &copy; 2026 Gain Live Systems. All Rights Reserved.
        </p>
      </div>
    </main>
  );
};

export default AboutPage;
