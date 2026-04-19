import { useState, useEffect } from "react";
import { getNews } from "../../services/api";

const catColors = {
  general: "bg-[#00F5FF]/15 text-[#00F5FF] border-[#00F5FF]/20",
  update: "bg-emerald-400/15 text-emerald-400 border-emerald-400/20",
  maintenance: "bg-amber-400/15 text-amber-400 border-amber-400/20",
  promotion: "bg-purple-400/15 text-purple-400 border-purple-400/20",
  alert: "bg-red-400/15 text-red-400 border-red-400/20",
};

const catIcons = {
  general: "public",
  update: "system_update",
  maintenance: "engineering",
  promotion: "local_offer",
  alert: "warning",
};

const NewsSection = () => {
  const [news, setNews] = useState([]);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    getNews()
      .then((data) => setNews((data.news || data || []).slice(0, 6)))
      .catch(() => {});
  }, []);

  if (news.length === 0) return null;

  const pinned = news.filter((n) => n.isPinned);
  const regular = news.filter((n) => !n.isPinned);

  return (
    <section className="px-4 py-10">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-lg bg-[#00F5FF]/10 flex items-center justify-center border border-[#00F5FF]/20">
          <span className="material-symbols-outlined text-[#00F5FF] text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
            newspaper
          </span>
        </div>
        <div>
          <h2 className="font-headline font-black text-base text-on-surface tracking-wide uppercase leading-none">
            Latest News
          </h2>
          <p className="text-[9px] text-on-surface-variant/50 uppercase tracking-widest mt-0.5">Press Room</p>
        </div>
        <div className="flex-1 h-[1px] bg-gradient-to-r from-[#00F5FF]/20 to-transparent ml-3" />
      </div>

      {/* Pinned News - Featured Card */}
      {pinned.length > 0 && (
        <div className="mb-4 space-y-3">
          {pinned.map((item) => (
            <article
              key={item._id}
              className="relative bg-gradient-to-br from-surface-container to-surface-container-high rounded-2xl overflow-hidden border border-amber-500/15 cursor-pointer group"
              onClick={() => setExpanded(expanded === item._id ? null : item._id)}
            >
              {/* Pinned ribbon */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-amber-500 via-amber-400 to-transparent" />

              <div className="p-4">
                <div className="flex items-center gap-2 mb-2.5">
                  <span className="material-symbols-outlined text-amber-500 text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                    push_pin
                  </span>
                  <span className="text-[8px] font-black text-amber-500 uppercase tracking-[0.15em]">Pinned</span>
                  <span className={`text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${catColors[item.category] || catColors.general}`}>
                    {item.category}
                  </span>
                  <span className="text-[10px] text-on-surface-variant/40 ml-auto font-mono">
                    {new Date(item.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-on-surface leading-snug mb-1">{item.title}</h3>

                {expanded === item._id && (
                  <div className="mt-3 pt-3 border-t border-white/5">
                    <p className="text-xs text-on-surface-variant/70 leading-relaxed">{item.content}</p>
                  </div>
                )}

                <div className="flex items-center justify-end mt-2">
                  <span className="material-symbols-outlined text-on-surface-variant/30 text-base group-hover:text-[#00F5FF]/50 transition-colors">
                    {expanded === item._id ? "expand_less" : "expand_more"}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Regular News - Compact List */}
      <div className="space-y-2">
        {regular.map((item) => (
          <article
            key={item._id}
            className="bg-surface-container/80 rounded-xl p-3.5 border border-white/[0.03] hover:border-[#00F5FF]/10 transition-all cursor-pointer group"
            onClick={() => setExpanded(expanded === item._id ? null : item._id)}
          >
            <div className="flex items-center gap-3">
              {/* Category icon */}
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${(catColors[item.category] || catColors.general).split(" ")[0]}`}>
                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1", color: "currentColor" }}>
                  {catIcons[item.category] || "article"}
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className={`text-[7px] font-bold uppercase tracking-wider px-1.5 py-[1px] rounded ${catColors[item.category] || catColors.general}`}>
                    {item.category}
                  </span>
                  <span className="text-[9px] text-on-surface-variant/35 font-mono ml-auto">
                    {new Date(item.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}
                  </span>
                </div>
                <h3 className="text-[13px] font-semibold text-on-surface leading-tight truncate group-hover:text-[#00F5FF]/90 transition-colors">{item.title}</h3>
              </div>

              <span className="material-symbols-outlined text-on-surface-variant/25 text-base shrink-0 group-hover:text-[#00F5FF]/40 transition-colors">
                {expanded === item._id ? "expand_less" : "expand_more"}
              </span>
            </div>

            {expanded === item._id && (
              <div className="mt-3 pt-3 border-t border-white/5 ml-11">
                <p className="text-xs text-on-surface-variant/60 leading-relaxed">{item.content}</p>
              </div>
            )}
          </article>
        ))}
      </div>
    </section>
  );
};

export default NewsSection;
