import { useState, useEffect } from "react";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";

const FloatingChat = () => {
  const [open, setOpen] = useState(false);
  const [faqs, setFaqs] = useState([]);
  const [activeFaq, setActiveFaq] = useState(null);

  useEffect(() => {
    if (open && faqs.length === 0) {
      fetch(`${API_BASE}/api/user/support/faq`)
        .then((r) => r.json())
        .then((d) => setFaqs(d.faqs || []))
        .catch(() => {});
    }
  }, [open, faqs.length]);

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="fixed right-6 bottom-24 z-40 bg-surface-container-highest w-14 h-14 rounded-full flex items-center justify-center shadow-2xl border border-primary-container/20 group md:right-[calc(50%-230px+1rem)]"
      >
        <span className="material-symbols-outlined text-primary-container text-2xl">
          {open ? "close" : "forum"}
        </span>
        {!open && (
          <span className="absolute top-3 right-3 w-3 h-3 bg-primary-container rounded-full border-2 border-surface-container-highest shadow-[0_0_8px_rgba(0,245,255,0.8)] animate-pulse"></span>
        )}
      </button>

      {open && (
        <div className="fixed right-4 bottom-40 z-50 w-[320px] max-h-[420px] bg-surface-container border border-primary-container/20 rounded-xl shadow-2xl overflow-hidden flex flex-col md:right-[calc(50%-230px)]">
          <div className="bg-surface-container-high px-4 py-3 border-b border-outline-variant/10 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary-container text-lg">support_agent</span>
            <span className="font-headline font-bold text-sm text-on-surface">Support Bot</span>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            <div className="bg-surface-container-high rounded-lg p-3 text-xs text-on-surface-variant">
              Hi! How can I help you today? Check our FAQs below or visit the Help Center for more.
            </div>

            {faqs.map((faq, i) => (
              <div key={i}>
                <button
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  className="w-full text-left bg-primary-container/10 rounded-lg px-3 py-2 text-xs font-semibold text-primary-container hover:bg-primary-container/20 transition-colors"
                >
                  {faq.question}
                </button>
                {activeFaq === i && (
                  <div className="mt-1 bg-surface-container-high rounded-lg p-3 text-xs text-on-surface-variant leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="border-t border-outline-variant/10 p-3">
            <a
              href="/help"
              className="block text-center bg-primary-container text-on-primary-container text-xs font-bold uppercase tracking-widest py-2 rounded-lg"
            >
              Open Help Center
            </a>
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingChat;
