import { useState, useEffect } from "react";
import { getAmbassadors } from "../../services/api";

const AmbassadorsSection = () => {
  const [ambassadors, setAmbassadors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAmbassadors()
      .then((data) => setAmbassadors(data.ambassadors || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return null;
  if (ambassadors.length === 0) return null;

  return (
    <section className="px-4 py-10 pb-14">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-lg bg-tertiary-fixed-dim/10 flex items-center justify-center border border-tertiary-fixed-dim/20">
          <span className="material-symbols-outlined text-tertiary-fixed-dim text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
            star
          </span>
        </div>
        <div>
          <h2 className="font-headline font-black text-base text-on-surface tracking-wide uppercase leading-none">
            Brand Ambassadors
          </h2>
          <p className="text-[9px] text-on-surface-variant/50 uppercase tracking-widest mt-0.5">Our Champions</p>
        </div>
        <div className="flex-1 h-[1px] bg-gradient-to-r from-tertiary-fixed-dim/20 to-transparent ml-3" />
      </div>

      {/* Ambassadors Grid */}
      <div className="grid grid-cols-2 gap-3">
        {ambassadors.map((a) => (
          <div
            key={a._id}
            className="relative bg-surface-container/80 rounded-xl overflow-hidden border border-white/[0.03] hover:border-tertiary-fixed-dim/15 transition-all group"
          >
            {/* Top accent line */}
            <div className="h-[2px] bg-gradient-to-r from-tertiary-fixed-dim/30 via-tertiary-fixed-dim/10 to-transparent" />

            <div className="p-3.5 flex items-center gap-3">
              {/* Avatar */}
              <div className="relative shrink-0">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-surface-container-high border-2 border-tertiary-fixed-dim/20 group-hover:border-tertiary-fixed-dim/40 transition-all flex items-center justify-center">
                  {a.imageUrl ? (
                    <img
                      src={a.imageUrl}
                      alt={a.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="material-symbols-outlined text-xl text-slate-500" style={{ fontVariationSettings: "'FILL' 1" }}>person</span>
                  )}
                </div>
                {/* Online dot */}
                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-surface-container flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-emerald-400" />
                </div>
              </div>

              {/* Info */}
              <div className="min-w-0 flex-1">
                <h3 className="text-[13px] font-bold text-on-surface truncate leading-tight">{a.name}</h3>
                <p className="text-[9px] text-tertiary-fixed-dim font-bold uppercase tracking-[0.12em] mt-0.5">{a.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AmbassadorsSection;
