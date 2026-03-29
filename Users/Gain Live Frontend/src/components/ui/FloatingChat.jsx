const FloatingChat = () => {
  return (
    <button className="fixed right-6 bottom-24 z-40 bg-surface-container-highest w-14 h-14 rounded-full flex items-center justify-center shadow-2xl border border-primary-container/20 group">
      <span className="material-symbols-outlined text-primary-container text-2xl">forum</span>
      <span className="absolute top-3 right-3 w-3 h-3 bg-primary-container rounded-full border-2 border-surface-container-highest shadow-[0_0_8px_rgba(0,245,255,0.8)] animate-pulse"></span>
    </button>
  );
};

export default FloatingChat;
