import { useState, useRef, useEffect, useCallback } from "react";
import { isLoggedIn, getChatMessages, sendChatMessage } from "../services/api";

const quickReplies = [
  "I need help with my account",
  "Payment issue",
  "How do I withdraw?",
  "Game not loading",
  "Bonus not credited",
];

const LiveChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);
  const pollRef = useRef(null);
  const loggedIn = isLoggedIn();

  const loadMessages = useCallback(async () => {
    try {
      const data = await getChatMessages();
      setMessages(data.messages || []);
    } catch (err) {
      console.error("Failed to load messages:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!loggedIn) return;
    loadMessages();
    pollRef.current = setInterval(loadMessages, 5000);
    return () => clearInterval(pollRef.current);
  }, [loggedIn, loadMessages]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async (text) => {
    if (!text.trim() || sending) return;
    const trimmed = text.trim();
    setInput("");
    setSending(true);
    try {
      await sendChatMessage(trimmed);
      await loadMessages();
    } catch (err) {
      console.error("Failed to send:", err);
    } finally {
      setSending(false);
    }
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
    <main className="fixed inset-0 pt-[120px] pb-32 px-4 max-w-4xl mx-auto flex flex-col overflow-hidden">
      {/* Header */}
      <header className="relative mb-4 p-4 glass-card border border-outline-variant/20 rounded-xl overflow-hidden flex-shrink-0">
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
      <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-1 min-h-0">
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="w-6 h-6 border-2 border-primary-container/30 border-t-primary-container rounded-full animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 gap-2">
            <span className="material-symbols-outlined text-3xl text-on-surface-variant/20">chat_bubble_outline</span>
            <p className="text-xs text-on-surface-variant/50">Send a message to start the conversation</p>
          </div>
        ) : (
          messages.map((m) => (
            <div key={m._id} className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] ${m.sender === "user" ? "order-1" : ""}`}>
                <div className={`px-4 py-3 rounded-2xl text-xs leading-relaxed ${
                  m.sender === "user"
                    ? "bg-gradient-to-r from-primary-container to-primary text-on-primary-container rounded-br-md"
                    : "glass-card border border-outline-variant/10 text-on-surface rounded-bl-md"
                }`}>
                  {m.message}
                </div>
                <div className={`flex items-center gap-1 mt-1 ${m.sender === "user" ? "justify-end" : ""}`}>
                  <p className="text-[9px] text-on-surface-variant/40">{fmt(m.createdAt)}</p>
                  {m.sender === "user" && (
                    <span className="material-symbols-outlined text-[10px] text-on-surface-variant/30" style={{ fontVariationSettings: "'FILL' 1" }}>
                      {m.read ? "done_all" : "done"}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}

        {sending && (
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
      {messages.length === 0 && (
        <div className="flex flex-wrap gap-2 mb-3 flex-shrink-0">
          {quickReplies.map((q) => (
            <button key={q} onClick={() => send(q)} className="text-[10px] font-bold text-primary-container bg-primary-container/10 px-3 py-1.5 rounded-full border border-primary-container/20 hover:bg-primary-container/20 transition-colors">
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="glass-card border border-outline-variant/20 rounded-xl p-2 flex items-center gap-2 flex-shrink-0">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send(input)}
          placeholder="Type your message..."
          className="flex-1 bg-transparent text-on-surface text-sm px-3 py-2 focus:outline-none placeholder:text-on-surface-variant/40"
          disabled={sending}
        />
        <button onClick={() => send(input)} disabled={!input.trim() || sending} className="w-10 h-10 rounded-lg bg-gradient-to-r from-primary-container to-primary flex items-center justify-center text-on-primary-container shadow-[0_0_20px_-5px_rgba(0,245,255,0.3)] disabled:opacity-40 disabled:pointer-events-none transition-all">
          <span className="material-symbols-outlined text-lg">send</span>
        </button>
      </div>
    </main>
  );
};

export default LiveChatPage;
