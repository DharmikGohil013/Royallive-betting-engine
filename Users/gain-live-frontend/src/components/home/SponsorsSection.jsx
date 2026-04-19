import { useState, useEffect } from "react";
import { getSponsors } from "../../services/api";

const SponsorsSection = () => {
  const [sponsors, setSponsors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSponsors()
      .then((data) => setSponsors(data.sponsors || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return null;
  if (sponsors.length === 0) return null;

  return (
    <section className="px-4 py-10">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-lg bg-[#00F5FF]/10 flex items-center justify-center border border-[#00F5FF]/20">
          <span className="material-symbols-outlined text-[#00F5FF] text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
            handshake
          </span>
        </div>
        <div>
          <h2 className="font-headline font-black text-base text-on-surface tracking-wide uppercase leading-none">
            Our Sponsors
          </h2>
          <p className="text-[9px] text-on-surface-variant/50 uppercase tracking-widest mt-0.5">Trusted Partners</p>
        </div>
        <div className="flex-1 h-[1px] bg-gradient-to-r from-[#00F5FF]/20 to-transparent ml-3" />
      </div>

      {/* Sponsors Grid */}
      <div className="grid grid-cols-3 gap-2.5">
        {sponsors.map((s) => (
          <div
            key={s._id}
            className="relative bg-surface-container/80 rounded-xl p-3 flex flex-col items-center gap-2.5 border border-white/[0.03] hover:border-[#00F5FF]/15 transition-all group overflow-hidden"
          >
            {/* Glow effect on hover */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#00F5FF]/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="relative w-11 h-11 rounded-lg bg-surface-container-high/80 flex items-center justify-center border border-white/5 group-hover:border-[#00F5FF]/15 transition-all">
              <img
                src={s.logoUrl}
                alt={s.name}
                className="w-8 h-8 object-contain opacity-60 group-hover:opacity-100 transition-opacity"
              />
            </div>
            <span className="relative text-[8px] font-bold text-on-surface-variant/50 group-hover:text-on-surface-variant/80 uppercase tracking-wider text-center leading-tight transition-colors">
              {s.name}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SponsorsSection;
