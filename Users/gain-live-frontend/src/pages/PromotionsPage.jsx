import { useState, useEffect } from "react";
import { getPromotions } from "../services/api";

const API_BASE = import.meta.env.VITE_API_URL ?? "";
const resolveUrl = (path) => (path?.startsWith("/") ? `${API_BASE}${path}` : path);

const PromotionsPage = () => {
  const [promos, setPromos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPromotions()
      .then((d) => setPromos(d.promotions || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <main className="pt-20 pb-32 px-4 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-primary-container border-t-transparent rounded-full" />
      </main>
    );
  }

  return (
    <main className="pt-20 pb-32 px-4">
      <header className="mb-6">
        <h1 className="font-headline font-black text-2xl uppercase tracking-tight">
          <span className="text-primary-container">Promotions</span> & Offers
        </h1>
        <p className="text-on-surface-variant text-xs mt-1">Exclusive deals and bonuses for you</p>
      </header>

      {promos.length === 0 ? (
        <div className="text-center py-16">
          <span className="material-symbols-outlined text-4xl text-on-surface-variant/30 mb-2">
            local_offer
          </span>
          <p className="text-on-surface-variant text-sm">No active promotions at the moment</p>
        </div>
      ) : (
        <div className="space-y-4">
          {promos.map((promo) => (
            <div
              key={promo._id}
              className="bg-surface-container border border-outline-variant/10 rounded-xl overflow-hidden"
            >
              {promo.image && (
                <div className="h-40 overflow-hidden">
                  <img
                    src={resolveUrl(promo.image)}
                    alt={promo.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[9px] font-bold uppercase tracking-widest bg-primary-container/10 text-primary-container px-2 py-0.5 rounded">
                    {promo.type || "promotion"}
                  </span>
                  {promo.brandName && (
                    <span className="text-[9px] font-bold uppercase tracking-widest text-on-surface-variant">
                      by {promo.brandName}
                    </span>
                  )}
                </div>
                <h3 className="font-headline font-black text-lg text-on-surface mb-1">{promo.title}</h3>
                <p className="text-xs text-on-surface-variant leading-relaxed mb-3">{promo.description}</p>
                {promo.endDate && (
                  <p className="text-[10px] text-on-surface-variant">
                    Expires: {new Date(promo.endDate).toLocaleDateString()}
                  </p>
                )}
                {promo.link && (
                  <a
                    href={promo.link}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-block px-4 py-2 bg-primary-container text-on-primary-container text-xs font-bold uppercase tracking-widest rounded-sm"
                  >
                    Learn More
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
};

export default PromotionsPage;
