import { useState, useRef, useEffect } from "react";
import { isLoggedIn } from "../services/api";

const quickReplies = [
  "I need help with my account",
  "Payment issue",
  "How do I withdraw?",
  "Game not loading",
  "Bonus not credited",
];

const botResponses = {
  default: "Thanks for reaching out! Our support team is currently reviewing your message. A live agent will be with you shortly. In the meantime, you can check our Support Hub for quick answers.",
  account: "For account-related issues, please go to Account > Settings. If you're locked out, use the 'Forgot Password' option on the login page. Need more help? A live agent will assist you soon.",
  payment: "For payment queries, please ensure your payment method is verified. Deposits are usually instant, while withdrawals may take 24-48 hours. If the issue persists, a live agent will help you.",
  withdraw: "Withdrawals are processed within 24-48 hours. Make sure you've completed KYC verification and met any wagering requirements. Check Wallet > Withdraw for status updates.",
  game: "If a game isn't loading, try clearing your browser cache and refreshing. Make sure you have a stable internet connection. If the problem continues, our team will look into it.",
  bonus: "Bonuses are usually credited within a few minutes. Check Promotions > My Bonuses for status. Make sure you've met the minimum deposit requirement. We'll have an agent verify this for you.",
};

const getBot = (msg) => {
  const l = msg.toLowerCase();
  if (l.includes("account") || l.includes("login") || l.includes("password")) return botResponses.account;
  if (l.includes("payment") || l.includes("deposit")) return botResponses.payment;
  if (l.includes("withdraw") || l.includes("payout")) return botResponses.withdraw;
  if (l.includes("game") || l.includes("load") || l.includes("crash")) return botResponses.game;
  if (l.includes("bonus") || l.includes("promo") || l.includes("offer")) return botResponses.bonus;
  return botResponses.default;
};

const LiveChatPage = () => {
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hey there! 👋 Welcome to Gain Live Support. How can I help you today?", time: new Date() },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef(null);
  const loggedIn = isLoggedIn();

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const send = (text) => {
    if (!text.trim()) return;
    const userMsg = { from: "user", text: text.trim(), time: new Date() };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setMessages((m) => [...m, { from: "bot", text: getBot(text), time: new Date() }]);
      setTyping(false);
    }, 1200 + Math.random() * 800);
  };

  const fmt = (d) => new Date(d).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  if (!loggedIn) {
    return (
      <main className="pt-[120px] pb-32 px-4 max-w-4xl mx-auto">
        <div className="glass-card border border-outline-variant/10 rounded-xl p-8 text-center">
          <span className="material-symbols-outlined text-5xl text-on-surface-variant/30 mb-4">lock</span>
          <h2 className="font-headline font-black text-lg text-on-background uppercase mb-2">Login Required</h2>
          <p className="text-xs text-on-surface-variant">Please log in to access live chat support.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-[120px] pb-32 px-4 max-w-4xl mx-auto flex flex-col" style={{ minHeight: "calc(100vh - 6rem)" }}>
      {/* Header */}
      <header className="relative mb-4 p-4 glass-card border border-outline-variant/20 rounded-xl overflow-hidden">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-12 h-12 flex items-center justify-center bg-surface-container-high rounded-full border border-primary-container/30">
              <span className="material-symbols-outlined text-xl text-primary-container" style={{ fontVariationSettings: "'FILL' 1" }}>support_agent</span>
            </div>
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-primary-container rounded-full border-2 border-surface" />
          </div>
          <div>
            <h2 className="font-headline font-black text-base text-on-background uppercase tracking-tight">Live Support</h2>
            <p className="text-[10px] text-primary-container font-bold uppercase tracking-widest">● Online</p>
          </div>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-1" style={{ maxHeight: "calc(100vh - 20rem)" }}>
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[80%] ${m.from === "user" ? "order-1" : ""}`}>
              <div className={`px-4 py-3 rounded-2xl text-xs leading-relaxed ${
                m.from === "user"
                  ? "bg-gradient-to-r from-primary-container to-primary text-on-primary-container rounded-br-md"
                  : "glass-card border border-outline-variant/10 text-on-surface rounded-bl-md"
              }`}>
                {m.text}
              </div>
              <p className={`text-[9px] text-on-surface-variant/40 mt-1 ${m.from === "user" ? "text-right" : ""}`}>{fmt(m.time)}</p>
            </div>
          </div>
        ))}

        {typing && (
          <div className="flex justify-start">
            <div className="glass-card border border-outline-variant/10 rounded-2xl rounded-bl-md px-4 py-3">
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-primary-container/60 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-1.5 h-1.5 bg-primary-container/60 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-1.5 h-1.5 bg-primary-container/60 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Quick Replies */}
      {messages.length <= 2 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {quickReplies.map((q) => (
            <button key={q} onClick={() => send(q)} className="text-[10px] font-bold text-primary-container bg-primary-container/10 px-3 py-1.5 rounded-full border border-primary-container/20 hover:bg-primary-container/20 transition-colors">
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="glass-card border border-outline-variant/20 rounded-xl p-2 flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send(input)}
          placeholder="Type your message..."
          className="flex-1 bg-transparent text-on-surface text-sm px-3 py-2 focus:outline-none placeholder:text-on-surface-variant/40"
        />
        <button onClick={() => send(input)} disabled={!input.trim() || typing} className="w-10 h-10 rounded-lg bg-gradient-to-r from-primary-container to-primary flex items-center justify-center text-on-primary-container shadow-[0_0_20px_-5px_rgba(0,245,255,0.3)] disabled:opacity-40 disabled:pointer-events-none transition-all">
          <span className="material-symbols-outlined text-lg">send</span>
        </button>
      </div>
    </main>
  );
};

export default LiveChatPage;
