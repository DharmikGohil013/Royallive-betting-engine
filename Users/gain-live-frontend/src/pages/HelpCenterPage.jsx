import { useState, useEffect } from "react";
import { getFAQ, submitHelpRequest, getMyHelpRequests, isLoggedIn } from "../services/api";

const HelpCenterPage = () => {
  const [tab, setTab] = useState("faq");
  const [faqs, setFaqs] = useState([]);
  const [openFaq, setOpenFaq] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [form, setForm] = useState({ subject: "", message: "", category: "general" });
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  const loggedIn = isLoggedIn();

  useEffect(() => {
    getFAQ().then((d) => setFaqs(d.faqs || [])).catch(() => {});
    if (loggedIn) {
      getMyHelpRequests().then((d) => setTickets(d.requests || [])).catch(() => {});
    }
  }, [loggedIn]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.subject.trim() || !form.message.trim()) return;
    setSubmitting(true);
    try {
      await submitHelpRequest(form.subject, form.message, form.category);
      setToast("Ticket submitted successfully!");
      setForm({ subject: "", message: "", category: "general" });
      const d = await getMyHelpRequests();
      setTickets(d.requests || []);
    } catch (err) {
      setToast(err.message || "Failed to submit");
    } finally {
      setSubmitting(false);
      setTimeout(() => setToast(null), 3000);
    }
  };

  const statusColor = (s) => {
    if (s === "resolved" || s === "closed") return "text-green-400";
    if (s === "in-progress") return "text-yellow-400";
    return "text-primary-container";
  };

  return (
    <main className="pt-20 pb-32 px-4">
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-primary-container text-on-primary-container px-4 py-2 rounded-lg text-xs font-bold shadow-lg">
          {toast}
        </div>
      )}

      <header className="mb-6">
        <h1 className="font-headline font-black text-2xl uppercase tracking-tight">
          Help <span className="text-primary-container">Center</span>
        </h1>
        <p className="text-on-surface-variant text-xs mt-1">Find answers or submit a support ticket</p>
        <a href="mailto:gainlive@royallive.live" className="inline-flex items-center gap-2 mt-3 px-4 py-2 bg-primary-container/10 border border-primary-container/20 rounded-lg hover:bg-primary-container/20 transition-colors">
          <span className="material-symbols-outlined text-primary-container text-sm">mail</span>
          <span className="text-xs font-bold text-primary-container">gainlive@royallive.live</span>
        </a>
      </header>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {[
          { key: "faq", label: "FAQ" },
          ...(loggedIn ? [{ key: "ticket", label: "Submit Ticket" }, { key: "history", label: "My Tickets" }] : []),
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest border rounded-sm transition-colors ${
              tab === t.key
                ? "bg-primary-container text-on-primary-container border-primary-container/50"
                : "bg-surface-container-high text-on-surface-variant border-outline-variant/30"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* FAQ */}
      {tab === "faq" && (
        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <div key={i} className="border border-outline-variant/10 rounded-lg overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between p-4 text-left"
              >
                <span className="text-sm font-semibold text-on-surface">{faq.question}</span>
                <span className="material-symbols-outlined text-primary-container text-lg">
                  {openFaq === i ? "expand_less" : "expand_more"}
                </span>
              </button>
              {openFaq === i && (
                <div className="px-4 pb-4 text-xs text-on-surface-variant leading-relaxed">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Submit Ticket */}
      {tab === "ticket" && loggedIn && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1">Category</label>
            <select
              value={form.category}
              onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
              className="w-full bg-surface-container border border-outline-variant/20 rounded-lg px-3 py-2 text-sm text-on-surface"
            >
              <option value="account">Account</option>
              <option value="payment">Payment</option>
              <option value="betting">Betting</option>
              <option value="technical">Technical</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1">Subject</label>
            <input
              value={form.subject}
              onChange={(e) => setForm((p) => ({ ...p, subject: e.target.value }))}
              className="w-full bg-surface-container border border-outline-variant/20 rounded-lg px-3 py-2 text-sm text-on-surface"
              placeholder="Brief description"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1">Message</label>
            <textarea
              value={form.message}
              onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
              className="w-full bg-surface-container border border-outline-variant/20 rounded-lg px-3 py-2 text-sm text-on-surface min-h-[120px] resize-none"
              placeholder="Describe your issue..."
              required
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-primary-container text-on-primary-container font-headline font-black text-sm uppercase tracking-widest disabled:opacity-50"
          >
            {submitting ? "Submitting..." : "Submit Ticket"}
          </button>
        </form>
      )}

      {/* Ticket History */}
      {tab === "history" && loggedIn && (
        <div className="space-y-3">
          {tickets.length === 0 && (
            <p className="text-center text-on-surface-variant text-xs py-8">No tickets yet</p>
          )}
          {tickets.map((t) => (
            <div key={t._id} className="border border-outline-variant/10 rounded-lg p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-on-surface">{t.subject}</span>
                <span className={`text-[10px] font-bold uppercase ${statusColor(t.status)}`}>{t.status}</span>
              </div>
              <p className="text-xs text-on-surface-variant">{t.message}</p>
              {t.adminReply && (
                <div className="bg-surface-container-high p-3 rounded-lg mt-2">
                  <p className="text-[10px] font-bold text-primary-container mb-1">Admin Reply:</p>
                  <p className="text-xs text-on-surface">{t.adminReply}</p>
                </div>
              )}
              <p className="text-[10px] text-on-surface-variant">
                {new Date(t.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
};

export default HelpCenterPage;
