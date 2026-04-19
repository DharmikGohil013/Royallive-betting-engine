import { useState, useEffect } from "react";
import { getCookiePolicy } from "../services/api";

const DEFAULT_SECTIONS = [
  {
    icon: "cookie",
    title: "What Are Cookies?",
    content:
      "Cookies are small text files placed on your device when you visit our website. They help us provide you with a better experience by remembering your preferences, keeping you signed in, and understanding how you use our platform.",
  },
  {
    icon: "tune",
    title: "Essential Cookies",
    content:
      "These cookies are necessary for the website to function and cannot be disabled. They include session cookies for authentication, security tokens to protect your account, and preference cookies that remember your settings like language and theme.",
  },
  {
    icon: "analytics",
    title: "Analytics Cookies",
    content:
      "We use analytics cookies to understand how visitors interact with our platform. This data helps us improve performance, fix bugs, and enhance user experience. All analytics data is anonymized and never sold to third parties.",
  },
  {
    icon: "ads_click",
    title: "Marketing Cookies",
    content:
      "Marketing cookies track your activity across websites to deliver relevant advertisements. These cookies are only set with your explicit consent. You can opt out at any time through your browser settings or our cookie preferences panel.",
  },
  {
    icon: "security",
    title: "Security Cookies",
    content:
      "These cookies help us detect and prevent fraudulent activity, protect against unauthorized access, and ensure the integrity of your transactions. They are critical for maintaining a safe and secure gaming environment.",
  },
  {
    icon: "manage_accounts",
    title: "Managing Your Cookies",
    content:
      "You can control and delete cookies through your browser settings. Note that disabling certain cookies may affect the functionality of our platform. Essential cookies cannot be disabled as they are required for the site to operate.",
  },
  {
    icon: "update",
    title: "Cookie Policy Updates",
    content:
      "We may update this Cookie Policy from time to time to reflect changes in our practices or for operational, legal, or regulatory reasons. We will notify you of any significant changes through our platform.",
  },
];

const CookiePolicyPage = () => {
  const [cookieSections, setCookieSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    getCookiePolicy()
      .then((data) => {
        if (data.sections && data.sections.length > 0) {
          setCookieSections(data.sections);
        } else {
          setCookieSections(DEFAULT_SECTIONS);
        }
        if (data.updatedAt) setLastUpdated(data.updatedAt);
      })
      .catch(() => {
        setCookieSections(DEFAULT_SECTIONS);
      })
      .finally(() => setLoading(false));
  }, []);
  return (
    <main className="pt-[120px] pb-32 px-4 max-w-4xl mx-auto">
      {/* Header */}
      <header className="relative mb-8 p-6 glass-card border border-outline-variant/20 rounded-xl overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-tertiary-fixed-dim/5 rounded-full blur-[80px] -mr-32 -mt-32" />
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-16 h-16 flex items-center justify-center bg-surface-container-high rounded-lg border border-tertiary-fixed-dim/30 shadow-[0_0_30px_-5px_rgba(224,3,99,0.15)]">
            <span className="material-symbols-outlined text-3xl text-tertiary-fixed-dim" style={{ fontVariationSettings: "'FILL' 1" }}>cookie</span>
          </div>
          <div>
            <h2 className="font-headline font-black text-2xl text-on-background uppercase tracking-tight mb-1">
              Cookie <span className="text-tertiary-fixed-dim">Policy</span>
            </h2>
            <p className="text-on-surface-variant text-xs leading-relaxed">
              Learn how we use cookies to enhance your experience.
            </p>
          </div>
        </div>
      </header>

      {/* Intro */}
      <div className="glass-card border border-outline-variant/10 rounded-xl p-5 mb-6">
        <p className="text-sm text-on-surface-variant leading-relaxed">
          This Cookie Policy explains how <span className="text-primary-container font-bold">Gain Live</span> uses cookies and similar technologies when you visit our platform. By continuing to use our website, you consent to the use of cookies as described in this policy.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin w-8 h-8 border-2 border-tertiary-fixed-dim border-t-transparent rounded-full" />
        </div>
      ) : (
        <>
          {/* Sections */}
          <div className="space-y-4">
            {cookieSections.map((s, i) => (
              <section key={i} className="glass-card border border-outline-variant/10 rounded-xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center border border-primary-container/20">
                    <span className="material-symbols-outlined text-lg text-primary-container" style={{ fontVariationSettings: "'FILL' 1" }}>{s.icon}</span>
                  </div>
                  <h3 className="font-headline font-black text-sm text-on-background uppercase tracking-tight">{s.title}</h3>
                </div>
                <p className="text-xs text-on-surface-variant leading-relaxed pl-[52px]">{s.content}</p>
              </section>
            ))}
          </div>

          {/* Last Updated */}
          <div className="mt-8 text-center">
            <p className="text-[10px] text-on-surface-variant/50 uppercase tracking-widest">
              Last updated: {lastUpdated ? new Date(lastUpdated).toLocaleDateString("en-US", { month: "long", year: "numeric" }) : "January 2025"}
            </p>
          </div>
        </>
      )}
    </main>
  );
};

export default CookiePolicyPage;
