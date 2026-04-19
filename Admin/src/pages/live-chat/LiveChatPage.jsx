import { useState, useEffect, useRef, useCallback } from "react";
import { getChatConversations, getChatMessages, sendChatMessage } from "../../services/api";

export default function LiveChatPage() {
  const [conversations, setConversations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [msgLoading, setMsgLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [search, setSearch] = useState("");
  const scrollRef = useRef(null);
  const pollRef = useRef(null);

  // Load conversations
  const loadConversations = useCallback(async () => {
    try {
      const data = await getChatConversations();
      setConversations(data.conversations || []);
    } catch (err) {
      console.error("Failed to load conversations:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadConversations();
    const interval = setInterval(loadConversations, 8000);
    return () => clearInterval(interval);
  }, [loadConversations]);

  // Load messages for selected user
  const loadMessages = useCallback(async (userId) => {
    if (!userId) return;
    setMsgLoading(true);
    try {
      const data = await getChatMessages(userId);
      setMessages(data.messages || []);
    } catch (err) {
      console.error("Failed to load messages:", err);
    } finally {
      setMsgLoading(false);
    }
  }, []);

  // Poll messages when user selected
  useEffect(() => {
    if (!selectedUser) return;
    loadMessages(selectedUser.userId);
    pollRef.current = setInterval(() => loadMessages(selectedUser.userId), 4000);
    return () => clearInterval(pollRef.current);
  }, [selectedUser, loadMessages]);

  // Auto scroll
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !selectedUser || sending) return;
    const text = input.trim();
    setInput("");
    setSending(true);
    try {
      await sendChatMessage(selectedUser.userId, text);
      await loadMessages(selectedUser.userId);
      loadConversations();
    } catch (err) {
      console.error("Failed to send:", err);
    } finally {
      setSending(false);
    }
  };

  const selectConversation = (conv) => {
    setSelectedUser(conv);
    setMessages([]);
  };

  const fmt = (d) => {
    const date = new Date(d);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    if (isToday) return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    return date.toLocaleDateString([], { month: "short", day: "numeric" }) + " " + date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const filtered = conversations.filter((c) => {
    if (!search) return true;
    const s = search.toLowerCase();
    const u = c.user;
    return (u?.username || "").toLowerCase().includes(s) || (u?.mobile || "").includes(s) || (u?.email || "").toLowerCase().includes(s);
  });

  const totalUnread = conversations.reduce((sum, c) => sum + (c.unreadCount || 0), 0);

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-4">
      {/* Left Panel - Conversations List */}
      <div className={`${selectedUser ? "hidden lg:flex" : "flex"} flex-col w-full lg:w-96 bg-surface-container rounded-2xl border border-white/5 overflow-hidden`}>
        {/* Header */}
        <div className="p-4 border-b border-white/5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-amber-500" style={{ fontVariationSettings: "'FILL' 1" }}>chat</span>
              <h2 className="text-lg font-black text-slate-100 uppercase tracking-tight">Live Chat</h2>
            </div>
            {totalUnread > 0 && (
              <span className="px-2 py-0.5 bg-amber-500/20 text-amber-500 text-xs font-bold rounded-full">{totalUnread}</span>
            )}
          </div>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-lg">search</span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search users..."
              className="w-full bg-surface-dim text-slate-200 text-sm pl-10 pr-4 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500/30 placeholder:text-slate-600"
            />
          </div>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-40">
              <div className="w-6 h-6 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 gap-2">
              <span className="material-symbols-outlined text-3xl text-slate-600">forum</span>
              <p className="text-sm text-slate-500">{search ? "No matching conversations" : "No conversations yet"}</p>
            </div>
          ) : (
            filtered.map((conv) => (
              <button
                key={conv.userId}
                onClick={() => selectConversation(conv)}
                className={`w-full flex items-center gap-3 p-4 text-left hover:bg-white/5 transition-colors border-b border-white/[0.03] ${
                  selectedUser?.userId === conv.userId ? "bg-white/5 border-l-2 border-l-amber-500" : ""
                }`}
              >
                <div className="relative flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500/20 to-amber-600/10 flex items-center justify-center text-amber-500 text-sm font-bold uppercase">
                    {(conv.user?.username || "U")[0]}
                  </div>
                  {conv.unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 text-black text-[10px] font-bold rounded-full flex items-center justify-center">{conv.unreadCount}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold text-slate-200 truncate">{conv.user?.username || "User"}</p>
                    <span className="text-[10px] text-slate-500 flex-shrink-0 ml-2">{fmt(conv.lastTime)}</span>
                  </div>
                  <p className="text-xs text-slate-500 truncate mt-0.5">
                    {conv.lastSender === "admin" && <span className="text-amber-500/70">You: </span>}
                    {conv.lastMessage}
                  </p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Right Panel - Chat Window */}
      <div className={`${selectedUser ? "flex" : "hidden lg:flex"} flex-col flex-1 bg-surface-container rounded-2xl border border-white/5 overflow-hidden`}>
        {selectedUser ? (
          <>
            {/* Chat Header */}
            <div className="flex items-center gap-3 p-4 border-b border-white/5">
              <button onClick={() => setSelectedUser(null)} className="lg:hidden mr-1">
                <span className="material-symbols-outlined text-slate-400">arrow_back</span>
              </button>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500/20 to-amber-600/10 flex items-center justify-center text-amber-500 text-sm font-bold uppercase">
                {(selectedUser.user?.username || "U")[0]}
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-bold text-slate-200">{selectedUser.user?.username || "User"}</h3>
                <p className="text-[10px] text-slate-500">
                  {selectedUser.user?.mobile || selectedUser.user?.email || ""}
                  {selectedUser.user?.status && (
                    <span className={`ml-2 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${
                      selectedUser.user.status === "active" ? "bg-green-500/20 text-green-500" : "bg-red-500/20 text-red-500"
                    }`}>{selectedUser.user.status}</span>
                  )}
                </p>
              </div>
              <span className="text-xs text-slate-600">{selectedUser.totalMessages} msgs</span>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {msgLoading && messages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <div className="w-6 h-6 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
                </div>
              ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-2">
                  <span className="material-symbols-outlined text-4xl text-slate-700">chat_bubble_outline</span>
                  <p className="text-sm text-slate-600">No messages yet</p>
                </div>
              ) : (
                messages.map((msg) => (
                  <div key={msg._id} className={`flex ${msg.sender === "admin" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[75%]`}>
                      <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                        msg.sender === "admin"
                          ? "bg-amber-500 text-black rounded-br-md"
                          : "bg-surface-dim text-slate-200 rounded-bl-md border border-white/5"
                      }`}>
                        {msg.message}
                      </div>
                      <div className={`flex items-center gap-1 mt-1 ${msg.sender === "admin" ? "justify-end" : ""}`}>
                        <span className="text-[10px] text-slate-600">{fmt(msg.createdAt)}</span>
                        {msg.sender === "admin" && (
                          <span className="material-symbols-outlined text-[11px] text-slate-600" style={{ fontVariationSettings: "'FILL' 1" }}>
                            {msg.read ? "done_all" : "done"}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
              <div ref={scrollRef} />
            </div>

            {/* Input Area */}
            <div className="p-3 border-t border-white/5">
              <div className="flex items-center gap-2 bg-surface-dim rounded-xl p-1.5">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                  placeholder="Type your reply..."
                  className="flex-1 bg-transparent text-slate-200 text-sm px-3 py-2 focus:outline-none placeholder:text-slate-600"
                  disabled={sending}
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || sending}
                  className="w-10 h-10 rounded-lg bg-amber-500 flex items-center justify-center text-black disabled:opacity-30 disabled:cursor-not-allowed transition-all hover:bg-amber-400"
                >
                  <span className="material-symbols-outlined text-lg">{sending ? "hourglass_empty" : "send"}</span>
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center gap-3">
            <div className="w-20 h-20 rounded-3xl bg-surface-dim flex items-center justify-center">
              <span className="material-symbols-outlined text-4xl text-slate-600">forum</span>
            </div>
            <h3 className="text-lg font-bold text-slate-400">Select a Conversation</h3>
            <p className="text-sm text-slate-600 text-center max-w-xs">Choose a user from the left panel to view and reply to their messages</p>
          </div>
        )}
      </div>
    </div>
  );
}
