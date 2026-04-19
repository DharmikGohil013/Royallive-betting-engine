import { heroImage } from "../../data/homeData";

const HeroSection = () => {
  return (
    <section className="relative w-full min-h-[350px] h-[60vh] sm:h-[70vh] md:h-[618px] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0F] via-transparent to-transparent z-10"></div>
        <div className="absolute inset-0 bg-black/40 z-10"></div>
        <img
          className="w-full h-full object-cover scale-110"
          alt="Futuristic neon sports stadium at night"
          src={heroImage}
          loading="lazy"
        />
      </div>
      <div className="relative z-20 px-4 sm:px-6 flex flex-col items-center text-center">
        <h1 className="font-headline font-black text-3xl sm:text-5xl md:text-7xl tracking-tighter leading-none mb-6 text-on-surface">
          PLAY. WIN.
          <br />
          <span className="text-primary-container neon-glow-primary">REPEAT.</span>
        </h1>
        <div className="flex flex-col gap-4 w-full max-w-xs">
          <button className="bg-primary-container text-on-primary-container font-headline font-extrabold py-4 rounded-sm tracking-widest shadow-[0_0_20px_rgba(0,245,255,0.4)] hover:brightness-110 transition-all active:scale-95">
            JOIN NOW
          </button>
          <button className="border-2 border-secondary-container text-secondary-container font-headline font-extrabold py-4 rounded-sm tracking-widest hover:bg-secondary-container/10 transition-all active:scale-95">
            EXPLORE GAMES
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
