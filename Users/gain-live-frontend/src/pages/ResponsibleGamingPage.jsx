import { useState } from "react";
import { Link } from "react-router-dom";

const sections = [
  {
    icon: "shield",
    title: "Our Commitment",
    content:
      "At Royal Live, we are committed to providing a safe, fair, and responsible gaming environment. We believe gaming should be an enjoyable form of entertainment, not a way to make money. We provide tools and resources to help you stay in control.",
  },
  {
    icon: "self_improvement",
    title: "Know Your Limits",
    content:
      "Set personal limits before you start playing. Decide on a budget and time frame and stick to it. Never chase losses or bet more than you can afford to lose. Remember, the odds are designed to favor the house in the long run.",
    tips: [
      "Set a daily, weekly, or monthly deposit limit",
      "Never gamble with money meant for essentials (rent, bills, food)",
      "Take regular breaks — set a timer if needed",
      "Don't gamble when you're upset, stressed, or under the influence",
      "Treat gambling as entertainment, not income",
    ],
  },
  {
    icon: "tune",
    title: "Self-Assessment",
    questions: [
      "Do you spend more time or money on gambling than you intended?",
      "Have you tried to cut back on gambling but couldn't?",
      "Do you feel restless or irritable when trying to stop gambling?",
      "Do you gamble to escape problems or relieve negative feelings?",
      "Have you lied to family or friends about your gambling?",
      "Have you borrowed money or sold anything to finance gambling?",
      "Has gambling caused relationship, work, or financial problems?",
      "Do you feel the need to bet more to get the same level of excitement?",
    ],
  },
  {
    icon: "lock",
    title: "Account Controls",
    content: "We provide several tools to help you manage your gaming activity:",
    controls: [
      {
        name: "Deposit Limits",
        desc: "Set daily, weekly, or monthly caps on how much you can deposit. Limits take effect immediately when lowered, and require a 24-hour cooling period when raised.",
        icon: "savings",
      },
      {
        name: "Session Time Limits",
        desc: "Set a maximum session duration. You'll receive a notification when your time is up and be automatically logged out.",
        icon: "timer",
      },
      {
        name: "Loss Limits",
        desc: "Set a maximum amount you're willing to lose in a given period. Once reached, you won't be able to place new bets.",
        icon: "trending_down",
      },
      {
        name: "Cool-Off Period",
        desc: "Take a short break from gaming. Choose 24 hours, 7 days, or 30 days. During this period, you cannot log in or place bets.",
        icon: "ac_unit",
      },
      {
        name: "Self-Exclusion",
        desc: "Exclude yourself from the platform for 6 months, 1 year, or permanently. This is irreversible for the chosen duration.",
        icon: "block",
      },
      {
        name: "Reality Checks",
        desc: "Receive periodic pop-up reminders showing how long you've been playing and your net win/loss during the session.",
        icon: "notifications_active",
      },
    ],
  },
  {
    icon: "family_restroom",
    title: "Protecting Minors",
    content:
      "Gambling is strictly for individuals aged 18 and above (or the legal age in your jurisdiction). We enforce strict age verification during registration. If you suspect a minor is using our platform, please contact our support team immediately.",
    measures: [
      "Mandatory age verification during signup",
      "ID document verification for withdrawals",
      "Parental control software recommendations",
      "Immediate account suspension upon detection of underage use",
    ],
  },
  {
    icon: "support_agent",
    title: "Getting Help",
    content:
      "If you or someone you know is struggling with gambling, professional help is available. You are not alone, and reaching out is a sign of strength.",
    resources: [
      { name: "Gamblers Anonymous", desc: "Free peer support meetings worldwide", url: "#" },
      { name: "National Council on Problem Gambling", desc: "24/7 confidential helpline", url: "#" },
      { name: "GamCare", desc: "Free advice, support, and counselling", url: "#" },
      { name: "BeGambleAware", desc: "Tools and support for safer gambling", url: "#" },
    ],
  },
];

const ResponsibleGamingPage = () => {
  const [openSection, setOpenSection] = useState(0);
  const [answers, setAnswers] = useState({});

  const yesCount = Object.values(answers).filter(Boolean).length;

  return (
    <main className="pt-[120px] pb-28 px-4 max-w-md mx-auto space-y-6">
      {/* Hero */}
      <section className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-container to-tertiary-fixed-dim rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-1000" />
        <div className="relative glass-card rounded-xl p-6 text-center space-y-4 overflow-hidden">
          <div className="mx-auto w-16 h-16 rounded-full bg-primary-container/10 border border-primary-container/30 flex items-center justify-center">
            <span className="material-symbols-outlined text-primary-container text-3xl">verified_user</span>
          </div>
          <h1 className="font-headline font-black text-2xl uppercase tracking-tight text-on-surface">
            Responsible Gaming
          </h1>
          <p className="text-xs text-on-surface-variant leading-relaxed max-w-xs mx-auto">
            Your safety and well-being are our top priority. We provide tools and resources to ensure gaming remains a fun and controlled experience.
          </p>
          <div className="flex justify-center gap-6 pt-2">
            {[
              { icon: "shield", label: "Safe" },
              { icon: "lock", label: "Secure" },
              { icon: "favorite", label: "Care" },
            ].map((b) => (
              <div key={b.label} className="flex flex-col items-center gap-1">
                <span className="material-symbols-outlined text-primary-container text-xl">{b.icon}</span>
                <span className="text-[9px] font-label uppercase tracking-widest text-on-surface-variant">{b.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sections */}
      {sections.map((s, i) => (
        <section key={i} className="glass-card rounded-xl overflow-hidden">
          <button
            className="w-full flex items-center gap-4 p-4 text-left"
            onClick={() => setOpenSection(openSection === i ? -1 : i)}
          >
            <div className="w-10 h-10 shrink-0 rounded-lg bg-primary-container/10 border border-primary-container/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary-container">{s.icon}</span>
            </div>
            <h2 className="flex-1 font-headline font-bold text-sm uppercase tracking-widest text-on-surface">{s.title}</h2>
            <span className={`material-symbols-outlined text-on-surface-variant transition-transform ${openSection === i ? "rotate-180" : ""}`}>
              expand_more
            </span>
          </button>

          {openSection === i && (
            <div className="px-4 pb-5 space-y-4 border-t border-outline-variant/10 pt-4">
              {s.content && <p className="text-xs text-on-surface-variant leading-relaxed">{s.content}</p>}

              {/* Tips */}
              {s.tips && (
                <ul className="space-y-2">
                  {s.tips.map((tip, ti) => (
                    <li key={ti} className="flex items-start gap-3 text-xs text-on-surface-variant">
                      <span className="material-symbols-outlined text-primary-container text-sm mt-0.5 shrink-0">check_circle</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              )}

              {/* Self-Assessment */}
              {s.questions && (
                <div className="space-y-3">
                  <p className="text-xs text-on-surface-variant">
                    Answer these questions honestly to assess your gambling habits:
                  </p>
                  {s.questions.map((q, qi) => (
                    <div key={qi} className="flex items-start gap-3 p-3 bg-surface-container-lowest/50 rounded-lg">
                      <span className="text-[10px] font-bold text-primary-container shrink-0 mt-0.5">{qi + 1}.</span>
                      <div className="flex-1">
                        <p className="text-[11px] text-on-surface leading-relaxed mb-2">{q}</p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setAnswers((prev) => ({ ...prev, [qi]: true }))}
                            className={`px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider border transition-all ${
                              answers[qi] === true
                                ? "bg-error/20 text-error border-error/40"
                                : "bg-surface-container-high border-outline-variant/20 text-on-surface-variant"
                            }`}
                          >
                            Yes
                          </button>
                          <button
                            onClick={() => setAnswers((prev) => ({ ...prev, [qi]: false }))}
                            className={`px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider border transition-all ${
                              answers[qi] === false
                                ? "bg-primary-container/20 text-primary-container border-primary-container/40"
                                : "bg-surface-container-high border-outline-variant/20 text-on-surface-variant"
                            }`}
                          >
                            No
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {Object.keys(answers).length === s.questions.length && (
                    <div
                      className={`p-4 rounded-lg border ${
                        yesCount >= 4
                          ? "bg-error/10 border-error/30"
                          : yesCount >= 2
                          ? "bg-tertiary-container/10 border-tertiary-container/30"
                          : "bg-primary-container/10 border-primary-container/30"
                      }`}
                    >
                      <p className="text-xs font-bold mb-1">
                        {yesCount >= 4
                          ? "⚠️ High Risk — Please seek professional support"
                          : yesCount >= 2
                          ? "⚡ Moderate Risk — Consider setting limits"
                          : "✅ Low Risk — Keep playing responsibly"}
                      </p>
                      <p className="text-[10px] text-on-surface-variant">
                        You answered "Yes" to {yesCount} out of {s.questions.length} questions.
                        {yesCount >= 2 && " We recommend reviewing our account controls and speaking with a professional if needed."}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Controls */}
              {s.controls && (
                <div className="grid gap-3">
                  {s.controls.map((c, ci) => (
                    <div key={ci} className="flex items-start gap-3 p-3 bg-surface-container-lowest/50 rounded-lg border border-outline-variant/10">
                      <div className="w-8 h-8 shrink-0 rounded bg-primary-container/10 flex items-center justify-center">
                        <span className="material-symbols-outlined text-primary-container text-lg">{c.icon}</span>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-on-surface mb-0.5">{c.name}</p>
                        <p className="text-[10px] text-on-surface-variant leading-relaxed">{c.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Measures */}
              {s.measures && (
                <ul className="space-y-2">
                  {s.measures.map((m, mi) => (
                    <li key={mi} className="flex items-start gap-3 text-xs text-on-surface-variant">
                      <span className="material-symbols-outlined text-tertiary-fixed-dim text-sm mt-0.5 shrink-0">security</span>
                      {m}
                    </li>
                  ))}
                </ul>
              )}

              {/* Resources */}
              {s.resources && (
                <div className="grid gap-2">
                  {s.resources.map((r, ri) => (
                    <a
                      key={ri}
                      href={r.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 bg-surface-container-lowest/50 rounded-lg border border-outline-variant/10 hover:border-primary-container/30 transition-colors"
                    >
                      <span className="material-symbols-outlined text-primary-container text-lg shrink-0">open_in_new</span>
                      <div>
                        <p className="text-xs font-bold text-on-surface">{r.name}</p>
                        <p className="text-[10px] text-on-surface-variant">{r.desc}</p>
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </div>
          )}
        </section>
      ))}

      {/* Quick Actions */}
      <section className="glass-card rounded-xl p-5 space-y-4">
        <h3 className="font-headline font-extrabold text-sm uppercase tracking-[0.15em] text-primary-container">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-3">
          <Link
            to="/help"
            className="flex flex-col items-center gap-2 p-4 bg-surface-container-lowest/50 rounded-lg border border-outline-variant/10 hover:border-primary-container/30 transition-colors"
          >
            <span className="material-symbols-outlined text-primary-container text-xl">support_agent</span>
            <span className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant">Get Help</span>
          </Link>
          <Link
            to="/account"
            className="flex flex-col items-center gap-2 p-4 bg-surface-container-lowest/50 rounded-lg border border-outline-variant/10 hover:border-primary-container/30 transition-colors"
          >
            <span className="material-symbols-outlined text-primary-container text-xl">tune</span>
            <span className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant">Set Limits</span>
          </Link>
          <Link
            to="/privacy"
            className="flex flex-col items-center gap-2 p-4 bg-surface-container-lowest/50 rounded-lg border border-outline-variant/10 hover:border-primary-container/30 transition-colors"
          >
            <span className="material-symbols-outlined text-primary-container text-xl">policy</span>
            <span className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant">Policies</span>
          </Link>
          <Link
            to="/about"
            className="flex flex-col items-center gap-2 p-4 bg-surface-container-lowest/50 rounded-lg border border-outline-variant/10 hover:border-primary-container/30 transition-colors"
          >
            <span className="material-symbols-outlined text-primary-container text-xl">info</span>
            <span className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant">About Us</span>
          </Link>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="text-center space-y-3 py-4">
        <div className="flex justify-center gap-4 opacity-30">
          <span className="material-symbols-outlined text-lg">shield</span>
          <span className="material-symbols-outlined text-lg">verified_user</span>
          <span className="material-symbols-outlined text-lg">favorite</span>
        </div>
        <p className="text-[9px] uppercase tracking-[0.2em] text-on-surface-variant/40 leading-relaxed max-w-xs mx-auto">
          Gambling can be addictive. Please play responsibly. If you need help, contact our support team 24/7.
        </p>
        <a href="mailto:gainlive@royallive.live" className="inline-flex items-center gap-1.5 text-[10px] text-primary-container/60 hover:text-primary-container transition-colors">
          <span className="material-symbols-outlined text-xs">mail</span>
          gainlive@royallive.live
        </a>
      </section>
    </main>
  );
};

export default ResponsibleGamingPage;
