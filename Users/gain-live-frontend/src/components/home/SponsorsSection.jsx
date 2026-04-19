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
    <section className="px-4 py-8">
      <div className="flex items-center gap-2 mb-5">
        <span className="material-symbols-outlined text-[#00F5FF] text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
          handshake
        </span>
        <h2 className="font-headline font-bold text-base text-on-surface tracking-wide uppercase">
          Our Sponsors
        </h2>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {sponsors.map((s) => (
          <div
            key={s._id}
            className="bg-surface-container rounded-xl p-4 flex flex-col items-center gap-2 border border-[#00F5FF]/5 hover:border-[#00F5FF]/20 transition-all group"
          >
            <img
              src={s.logoUrl}
              alt={s.name}
              className="w-10 h-10 object-contain opacity-70 group-hover:opacity-100 transition-opacity"
            />
            <span className="text-[9px] font-bold text-on-surface-variant/60 uppercase tracking-wider text-center leading-tight">
              {s.name}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SponsorsSection;
