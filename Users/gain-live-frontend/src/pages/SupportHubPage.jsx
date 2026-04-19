import { useState, useEffect } from "react";
import { getFAQ, getMyHelpRequests, isLoggedIn } from "../services/api";

const SUPPORT_COLORS = {
  "primary-container": "text-primary-container",
  "secondary": "text-secondary",
  "tertiary-fixed-dim": "text-tertiary-fixed-dim",
};

const quickLinks = [
  { icon: "account_circle", label: "Account Issues", desc: "Login, verification, profile", color: "primary-container" },
  { icon: "payments", label: "Payments & Withdrawals", desc: "Deposits, payouts, methods", color: "secondary" },
  { icon: "casino", label: "Games & Betting", desc: "Rules, odds, results", color: "tertiary-fixed-dim" },
  { icon: "security", label: "Security & Privacy", desc: "Safety, data protection", color: "primary-container" },
  { icon: "card_giftcard", label: "Bonuses & Promotions", desc: "Offers, wagering, claims", color: "secondary" },
  { icon: "gavel", label: "Rules & Policies", desc: "Terms, responsible gaming", color: "tertiary-fixed-dim" },
];

const SupportHubPage = () => {
  const [faqs, setFaqs] = useState([]);
  const [openFaq, setOpenFaq] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [search, setSearch] = useState("");
  const loggedIn = isLoggedIn();

  useEffect(() => {
    getFAQ().then((d) => setFaqs(d.faqs || [])).catch((err) => console.error(err));
    if (loggedIn) {
      getMyHelpRequests().then((d) => setTickets(d.requests || [])).catch((err) => console.error(err));
    }
  }, [loggedIn]);

  const filtered = faqs.filter(
    (f) => !search || f.question?.toLowerCase().includes(search.toLowerCase()) || f.answer?.toLowerCase().includes(search.toLowerCase())
  );

  const statusColor = (s) => {
    if (s === "resolved") return "text-primary-container";
    if (s === "in-progress") return "text-secondary";
    return "text-on-surface-variant";
  };

  return (
    <main className="pt-[120px] pb-32 px-4 max-w-4xl mx-auto">
      {/* Header */}
      <header className="relative mb-8 p-6 glass-card border border-outline-variant/20 rounded-xl overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-container/5 rounded-full blur-[80px] -mr-32 -mt-32" />
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-16 h-16 flex items-center justify-center bg-surface-container-high rounded-lg border border-primary-container/30 shadow-[0_0_30px_-5px_rgba(0,245,255,0.2)]">
            <span className="material-symbols-outlined text-3xl text-primary-container" style={{ fontVariationSettings: "'FILL' 1" }}>support_agent</span>
          </div>
          <div>
            <h2 className="font-headline font-black text-2xl text-on-background uppercase tracking-tight mb-1">
              Support <span className="text-primary-container">Hub</span>
            </h2>
            <p className="text-on-surface-variant text-xs leading-relaxed">
              Find answers, track tickets, and get help fast.
            </p>
          </div>
        </div>
      </header>

      {/* Search */}
      <div className="relative mb-6">
        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/40 text-lg">search</span>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search for help topics..."
          className="w-full bg-surface-container-high text-on-surface text-sm pl-12 pr-4 py-3.5 rounded-xl border border-outline-variant/20 focus:border-primary-container/50 focus:outline-none placeholder:text-on-surface-variant/40"
        />
      </div>

      {/* Quick Links */}
      <section className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-primary-container" />
          <h3 className="font-headline font-black text-sm text-on-background uppercase tracking-tight">Quick Help Topics</h3>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {quickLinks.map((q) => (
            <div key={q.label} className="glass-card border border-outline-variant/10 rounded-xl p-4 hover:border-primary-container/30 transition-colors cursor-pointer">
              <span className={`material-symbols-outlined text-xl ${SUPPORT_COLORS[q.color] || "text-primary-container"} mb-2 block`} style={{ fontVariationSettings: "'FILL' 1" }}>{q.icon}</span>
              <p className="text-xs font-bold text-on-surface">{q.label}</p>
              <p className="text-[10px] text-on-surface-variant mt-0.5">{q.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQs */}
      <section className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
          <h3 className="font-headline font-black text-sm text-on-background uppercase tracking-tight">
            Frequently Asked Questions
            {filtered.length > 0 && <span className="text-on-surface-variant font-normal ml-2">({filtered.length})</span>}
          </h3>
        </div>

        {filtered.length === 0 ? (
          <div className="glass-card border border-outline-variant/10 rounded-xl p-8 text-center">
            <span className="material-symbols-outlined text-3xl text-on-surface-variant/30 mb-2">help_center</span>
            <p className="text-xs text-on-surface-variant">{search ? "No results found" : "No FAQs available yet"}</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((faq, i) => (
              <div key={faq._id || i} className="glass-card border border-outline-variant/10 rounded-xl overflow-hidden">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between p-4 text-left">
                  <span className="text-xs font-bold text-on-surface pr-4">{faq.question}</span>
                  <span className={`material-symbols-outlined text-sm text-on-surface-variant transition-transform ${openFaq === i ? "rotate-180" : ""}`}>expand_more</span>
                </button>
                {openFaq === i && (
                  <div className="px-4 pb-4 border-t border-outline-variant/10 pt-3">
                    <p className="text-xs text-on-surface-variant leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* My Tickets */}
      {loggedIn && (
        <section>
          <div className="flex items-center gap-3 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-tertiary-fixed-dim" />
            <h3 className="font-headline font-black text-sm text-on-background uppercase tracking-tight">
              My Support Tickets
              {tickets.length > 0 && <span className="text-on-surface-variant font-normal ml-2">({tickets.length})</span>}
            </h3>
          </div>

          {tickets.length === 0 ? (
            <div className="glass-card border border-outline-variant/10 rounded-xl p-8 text-center">
              <span className="material-symbols-outlined text-3xl text-on-surface-variant/30 mb-2">confirmation_number</span>
              <p className="text-xs text-on-surface-variant">No support tickets yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {tickets.map((t) => (
                <div key={t._id} className="glass-card border border-outline-variant/10 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-bold text-on-surface truncate pr-4">{t.subject}</p>
                    <span className={`text-[10px] font-bold uppercase ${statusColor(t.status)}`}>{t.status}</span>
                  </div>
                  <p className="text-[10px] text-on-surface-variant line-clamp-2">{t.message}</p>
                  <p className="text-[10px] text-on-surface-variant/50 mt-2">{new Date(t.createdAt).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      )}
    </main>
  );
};

export default SupportHubPage;
