import { useState } from "react";
import { submitHelpRequest } from "../services/api";

const CONTACT_BG = {
  "primary-container": "bg-primary-container/10",
  "secondary": "bg-secondary/10",
  "tertiary-fixed-dim": "bg-tertiary-fixed-dim/10",
};
const CONTACT_TEXT = {
  "primary-container": "text-primary-container",
  "secondary": "text-secondary",
  "tertiary-fixed-dim": "text-tertiary-fixed-dim",
};

const contactMethods = [
  { icon: "mail", label: "Email Us", value: "support@gainlive.com", desc: "Get a response within 24 hours", color: "primary-container" },
  { icon: "chat", label: "Live Chat", value: "Available 24/7", desc: "Instant support from our team", color: "secondary" },
  { icon: "call", label: "Phone", value: "+91 XXX XXX XXXX", desc: "Mon-Sat, 10AM - 8PM IST", color: "tertiary-fixed-dim" },
];

const ContactUsPage = () => {
  const [form, setForm] = useState({ subject: "", message: "", category: "general" });
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.subject.trim() || !form.message.trim()) return;
    setSubmitting(true);
    try {
      await submitHelpRequest(form.subject, form.message, form.category);
      setToast("Message sent successfully! We'll get back to you soon.");
      setForm({ subject: "", message: "", category: "general" });
    } catch (err) {
      console.error("Failed to submit help request:", err);
      setToast("Failed to send message. Please try again.");
    } finally {
      setSubmitting(false);
      setTimeout(() => setToast(null), 4000);
    }
  };

  return (
    <main className="pt-[120px] pb-32 px-4 max-w-4xl mx-auto">
      {/* Toast */}
      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-surface-container-high text-on-surface px-6 py-3 rounded-xl shadow-2xl border border-primary-container/20 text-sm font-bold animate-pulse">
          {toast}
        </div>
      )}

      {/* Header */}
      <header className="relative mb-8 p-6 glass-card border border-outline-variant/20 rounded-xl overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-container/5 rounded-full blur-[80px] -mr-32 -mt-32" />
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-16 h-16 flex items-center justify-center bg-surface-container-high rounded-lg border border-primary-container/30 shadow-[0_0_30px_-5px_rgba(0,245,255,0.2)]">
            <span className="material-symbols-outlined text-3xl text-primary-container" style={{ fontVariationSettings: "'FILL' 1" }}>contact_support</span>
          </div>
          <div>
            <h2 className="font-headline font-black text-2xl text-on-background uppercase tracking-tight mb-1">
              Contact <span className="text-primary-container">Us</span>
            </h2>
            <p className="text-on-surface-variant text-xs leading-relaxed">
              Have a question or need help? Reach out to our support team.
            </p>
          </div>
        </div>
      </header>

      {/* Contact Methods */}
      <section className="grid grid-cols-1 gap-3 mb-8">
        {contactMethods.map((m) => (
          <div key={m.label} className="glass-card border border-outline-variant/10 rounded-xl p-4 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-lg ${CONTACT_BG[m.color] || "bg-primary-container/10"} flex items-center justify-center flex-shrink-0`}>
              <span className={`material-symbols-outlined text-xl ${CONTACT_TEXT[m.color] || "text-primary-container"}`} style={{ fontVariationSettings: "'FILL' 1" }}>{m.icon}</span>
            </div>
            <div className="min-w-0">
              <p className="text-xs text-on-surface-variant font-bold uppercase tracking-widest">{m.label}</p>
              <p className="text-sm font-bold text-on-surface">{m.value}</p>
              <p className="text-[10px] text-on-surface-variant">{m.desc}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Contact Form */}
      <section className="glass-card border border-outline-variant/10 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-primary-container" />
          <h3 className="font-headline font-black text-lg text-on-background uppercase tracking-tight">Send us a Message</h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-2 block">Category</label>
            <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className="w-full bg-surface-container-high text-on-surface text-sm px-4 py-3 rounded-lg border border-outline-variant/20 focus:border-primary-container/50 focus:outline-none">
              <option value="general">General Inquiry</option>
              <option value="account">Account Issue</option>
              <option value="payment">Payment Support</option>
              <option value="technical">Technical Problem</option>
              <option value="feedback">Feedback</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-2 block">Subject</label>
            <input type="text" value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} placeholder="What's this about?" className="w-full bg-surface-container-high text-on-surface text-sm px-4 py-3 rounded-lg border border-outline-variant/20 focus:border-primary-container/50 focus:outline-none placeholder:text-on-surface-variant/40" />
          </div>

          <div>
            <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-2 block">Message</label>
            <textarea value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} rows={5} placeholder="Tell us how we can help..." className="w-full bg-surface-container-high text-on-surface text-sm px-4 py-3 rounded-lg border border-outline-variant/20 focus:border-primary-container/50 focus:outline-none resize-none placeholder:text-on-surface-variant/40" />
          </div>

          <button type="submit" disabled={submitting || !form.subject.trim() || !form.message.trim()} className="w-full py-3 rounded-lg bg-gradient-to-r from-primary-container to-primary text-on-primary-container font-bold text-sm shadow-[0_0_30px_-5px_rgba(0,245,255,0.3)] hover:shadow-[0_0_40px_-5px_rgba(0,245,255,0.5)] transition-all disabled:opacity-50 disabled:pointer-events-none">
            {submitting ? "Sending..." : "Send Message"}
          </button>
        </form>
      </section>

      {/* Office Info */}
      <section className="mt-8 glass-card border border-outline-variant/10 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
          <h3 className="font-headline font-black text-sm text-on-background uppercase tracking-tight">Our Office</h3>
        </div>
        <div className="flex items-start gap-3">
          <span className="material-symbols-outlined text-primary-container text-lg mt-0.5">location_on</span>
          <div>
            <p className="text-sm text-on-surface font-bold">Gain Live Headquarters</p>
            <p className="text-xs text-on-surface-variant leading-relaxed mt-1">
              Available online 24/7 for your convenience.<br />
              Our dedicated support team is always ready to assist you.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ContactUsPage;
