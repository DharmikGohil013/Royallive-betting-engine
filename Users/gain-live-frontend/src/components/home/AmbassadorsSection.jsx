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
    <section className="px-4 py-8">
      <div className="flex items-center gap-2 mb-5">
        <span className="material-symbols-outlined text-tertiary-fixed-dim text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
          star
        </span>
        <h2 className="font-headline font-bold text-base text-on-surface tracking-wide uppercase">
          Brand Ambassadors
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {ambassadors.map((a) => (
          <div
            key={a._id}
            className="bg-surface-container rounded-xl p-4 flex items-center gap-3 border border-tertiary-fixed-dim/10 hover:border-tertiary-fixed-dim/25 transition-all group"
          >
            <div className="w-12 h-12 rounded-full overflow-hidden bg-surface-container-high shrink-0 border-2 border-tertiary-fixed-dim/30 flex items-center justify-center">
              {a.imageUrl ? (
                <img
                  src={a.imageUrl}
                  alt={a.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="material-symbols-outlined text-xl text-slate-500">person</span>
              )}
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-on-surface truncate">{a.name}</h3>
              <p className="text-[10px] text-tertiary-fixed-dim font-medium uppercase tracking-wider">{a.role}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AmbassadorsSection;
