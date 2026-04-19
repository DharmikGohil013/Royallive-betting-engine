import { useState, useEffect, useCallback, useRef } from "react";
import { getBanners } from "../../services/api";

const BannerCarousel = () => {
  const [banners, setBanners] = useState([]);
  const [current, setCurrent] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    getBanners()
      .then((data) => setBanners(data.banners || []))
      .catch(() => {});
  }, []);

  const startAutoSlide = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 4000);
  }, [banners.length]);

  useEffect(() => {
    if (banners.length > 1) startAutoSlide();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [banners.length, startAutoSlide]);

  const goTo = (idx) => {
    setCurrent(idx);
    startAutoSlide();
  };

  if (banners.length === 0) return null;

  return (
    <section className="relative w-full overflow-hidden">
      <div
        className="flex transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {banners.map((b) => (
          <div key={b._id} className="w-full flex-shrink-0 relative">
            <div className="aspect-[16/7] sm:aspect-[16/6]">
              <img
                src={b.imageUrl}
                alt={b.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0F] via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <h3 className="font-headline font-bold text-base text-on-surface drop-shadow-lg">{b.title}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Dots */}
      {banners.length > 1 && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`w-2 h-2 rounded-full transition-all ${
                i === current
                  ? "bg-[#00F5FF] w-5 shadow-[0_0_6px_rgba(0,245,255,0.5)]"
                  : "bg-white/30 hover:bg-white/50"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default BannerCarousel;
