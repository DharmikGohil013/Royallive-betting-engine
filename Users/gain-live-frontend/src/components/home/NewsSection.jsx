import { useState, useEffect } from "react";
import { getNews } from "../../services/api";

const catColors = {
  general: "bg-[#00F5FF]/10 text-[#00F5FF]",
  update: "bg-emerald-400/10 text-emerald-400",
  maintenance: "bg-amber-400/10 text-amber-400",
  promotion: "bg-purple-400/10 text-purple-400",
  alert: "bg-red-400/10 text-red-400",
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

  return (
    <section className="px-4 py-8">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#00F5FF] text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
            newspaper
          </span>
          <h2 className="font-headline font-bold text-base text-on-surface tracking-wide uppercase">
            Latest News
          </h2>
        </div>
      </div>

      <div className="space-y-3">
        {news.map((item) => (
          <article
            key={item._id}
            className="bg-surface-container rounded-xl p-4 border border-[#00F5FF]/5 hover:border-[#00F5FF]/15 transition-all cursor-pointer"
            onClick={() => setExpanded(expanded === item._id ? null : item._id)}
          >
            <div className="flex items-start gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  {item.isPinned && (
                    <span className="material-symbols-outlined text-amber-500 text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>
                      push_pin
                    </span>
                  )}
                  <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${catColors[item.category] || catColors.general}`}>
                    {item.category}
                  </span>
                  <span className="text-[10px] text-on-surface-variant/50 ml-auto">
                    {new Date(item.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-on-surface leading-tight">{item.title}</h3>
                {expanded === item._id && (
                  <p className="text-xs text-on-surface-variant/70 mt-2 leading-relaxed">{item.content}</p>
                )}
              </div>
              <span className="material-symbols-outlined text-on-surface-variant/40 text-lg mt-1 shrink-0">
                {expanded === item._id ? "expand_less" : "expand_more"}
              </span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default NewsSection;
