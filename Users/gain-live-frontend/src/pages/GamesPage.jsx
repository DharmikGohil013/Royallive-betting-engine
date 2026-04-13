import { useState, useEffect } from "react";
import { getFeaturedGames } from "../services/api";
import { featuredGames as staticGames } from "../data/homeData";

const categories = ["All Games", "Slots", "Live Casino", "Sports", "Crash Games", "Table Games"];

const GamesPage = () => {
  const [activeCategory, setActiveCategory] = useState("All Games");
  const [games, setGames] = useState([]);

  useEffect(() => {
    getFeaturedGames()
      .then((data) => {
        const apiGames = data.games || data || [];
        if (apiGames.length) {
          setGames(
            apiGames.map((g) => ({
              title: g.name || g.title,
              img: g.image || g.img || staticGames[0]?.img,
              alt: g.description || g.name,
              badge: g.category || g.badge || "",
              players: Math.floor(Math.random() * 3000) + 100,
            }))
          );
        } else {
          setGames(fallbackGames);
        }
      })
      .catch(() => setGames(fallbackGames));
  }, []);

  return (
    <main className="pt-20 pb-24 px-4">
      {/* Filter Bar */}
      <section className="mb-6 -mx-4">
        <div className="flex overflow-x-auto hide-scrollbar px-4 gap-2 py-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={
                activeCategory === cat
                  ? "flex-none px-6 py-2 rounded-full border border-[#00F5FF] bg-[#00F5FF]/10 text-[#00F5FF] text-xs font-bold uppercase tracking-widest relative"
                  : "flex-none px-6 py-2 rounded-full border border-outline-variant text-on-surface-variant text-xs font-bold uppercase tracking-widest hover:bg-[#00F5FF]/5 transition-colors"
              }
            >
              {cat}
              {activeCategory === cat && (
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-[2px] bg-[#00F5FF] shadow-[0_0_8px_#00F5FF]" />
              )}
            </button>
          ))}
        </div>
      </section>

      {/* Game Grid */}
      <section className="grid grid-cols-2 gap-4">
        {games.map((game, index) => (
          <div key={index} className="group relative rounded-lg overflow-hidden glass-card border-l-2 border-l-[#00F5FF]/40">
            <div className="aspect-[3/4] relative">
              <img
                alt={game.alt || game.title}
                className="w-full h-full object-cover opacity-80 group-hover:opacity-40 transition-opacity duration-300"
                src={game.img}
              />
              {game.badge && (
                <div className={`absolute top-2 right-2 px-2 py-0.5 text-[10px] font-black rounded-sm ${
                  game.badge === "HOT" || game.badge === "Hot"
                    ? "bg-secondary-container shadow-[0_0_10px_#FF2D78]"
                    : "bg-primary-container text-[#003739] shadow-[0_0_10px_#00F5FF]"
                }`}>
                  {game.badge.toUpperCase()}
                </div>
              )}
              <div className="absolute bottom-2 left-2 flex items-center gap-1 text-[10px] text-[#00F5FF]">
                <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>person</span>
                {game.players >= 1000 ? `${(game.players / 1000).toFixed(1)}k` : game.players}
              </div>
              {/* Play Overlay */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-active:opacity-100 transition-opacity bg-background/40 backdrop-blur-sm">
                <button className="bg-[#00F5FF] text-[#003739] px-4 py-2 rounded-sm font-headline font-extrabold text-xs shadow-[0_0_20px_#00F5FF]">
                  PLAY NOW
                </button>
              </div>
            </div>
            <div className="p-3">
              <h3 className="font-headline text-sm font-bold truncate uppercase tracking-tight">{game.title}</h3>
            </div>
          </div>
        ))}
      </section>
    </main>
  );
};

const fallbackGames = [
  { title: "CYBER SLOTS 3000", badge: "HOT", players: 1200, img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBN-KqbA5gh-KY6Kp2cZ_EyrBm9mJKYV6_F0-cfKOBZznKWOAum3dZxIshMIqMKx6LTNc-6-vlMJIhnFxrf1f4ST5RXyNS_pWWhLhxqoFDiMP2i2wiueJyZ2qD7E1_F4IeMI0EvxX3MT8y0boz8wHq9PojNl6MxVQLr_RnIdVpV3qo-7RR1Q2feaTiWQzwcJ1LnJ3aiFlo1VYwOAjEFwrHLoe2Fiu-UdMVaI5xUBCXxa1URbTEVGRF_SobDjOn4hjM7l9z0zzLS9aI", alt: "futuristic slot machine" },
  { title: "NEON ROULETTE", badge: "LIVE", players: 840, img: "https://lh3.googleusercontent.com/aida-public/AB6AXuC4vnVPNg4J8rxe7Xj3w8g06PMVf93kUpmlUYnINBM409u7FZFYgZn01XbQiMrH0djnIFZTZcLex0vpwVCfkSwcqVYZ00Xjk81BilLapxHcaHGHkF3gb4WX_gzstZriipqa0fRLIUJdTvN4DfMkSRmMiiH-9RLdFWQJPb9moL5QXfvzzNzSzFkPMW0jGWHhoEsB7Chutde0MHRNJhwjqIr4-3dk31w9uYX2YKvU_4xmVkMYOTLQSeJJpMR7xPWromdqpdgViZa9Dq4", alt: "neon roulette" },
  { title: "VOID CRASH X", badge: "HOT", players: 2400, img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCBByAcI2CQL2uhTgWK9861KQhGUUKp2kjkw6b4DLDU3-Ygl7k3J_e4ztmG4I-8qVAjwHpIsgQryNaKLZhZebI5Oy3COR4rmOFa3PR7tys4iaYR6ZSnCM5ETAWAtFRAACGvyLxQ9G8hkaoGuIISY7FDC7hRfzy0OOzi7Pq3ocxKQvYnBijHosVbtoXo_LyfUFxoz-3Uzu1OdIbGuLRUah8S3EtRiZuauM4efNge7Z3a8vbG7EQgEVIawg2v59v3qC4t8LhBofM9mgs", alt: "crash game" },
  { title: "CYBER BILLIARDS", badge: "", players: 430, img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDtQGflFBeMO8F66FQd-R2tigK1YXM5iMKqWy3HvdKTWMoAVoJm6bRXQ0kQq1QYgvms3Fj1RAMZk0q-DFokwhvezZVt-aPh64vG9CvDOc7-jLl_RRUtuR0flWCxvNrgMKLIg51KmZ9ptmtps4uiMi_6jCye5c7jC6Xj7vZp0Ivi-7BnIxOu8Q-fjuhDa9QF_-YZagkb0YgRSjd3l6SWY3UIDKtb3DrP9TXxdaULrbN-VXRLl-yXO_RnQNogB2iBhwydwXRaWo3IZ80", alt: "billiards" },
  { title: "CRYSTAL MINE", badge: "LIVE", players: 1700, img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBmU1Q9TuT_9FzxJuNIzKFpBYS-f5gmTKy4t3r71CRjM_cTuPR7SgTKI1I5UL18NWol4D06oc2Z3plVdqsY5sf3C2FUe93kFyrNvFmh-GoQLZGP57ipaJIrqJuPLr1kNHrkk0F2UUVW9xJiS-t3YYva66EeWJyO9_FFw1RkyjyrHatccf2kTwjP9No1EDYgQStNDen5iN3K69C8eGCTIHrwf1nl0McuHVdCw0UtODOwIsvVs7BXEiIW51j_XDESgnbXUehe80ICgT4", alt: "crystal mine" },
  { title: "PRO ARENA BATTLE", badge: "", players: 3200, img: "https://lh3.googleusercontent.com/aida-public/AB6AXuD0HMTizDK9ISPSyutrdoqVCnC_HaEvUylavIh3yrrX_XPOAFEajMKatQEnfIgWRi-ruR_VTbSIFOV_C5yD0VKeW0rFEr9QzYQpMKZZ_xWY-diS7xNfVKksdJDwVmKGwPHGrl-pVBuT60bvhzRBOFJynBnKH7TKysrMVJgn4CfbspksX1fpM3Ym7hiOMixp1z1wrLg8pwFQ6n0lFb5sC3op-YMeyZ3FuzNIAcFqB9xpFN-5MG8mqqW1jDqejnDnapXhvzFiSJS_Udo", alt: "arena battle" },
  { title: "HYPER DICE", badge: "", players: 110, img: "", alt: "dice game" },
  { title: "STARBURST Z", badge: "", players: 95, img: "", alt: "starburst" },
  { title: "EMPIRE GOLD", badge: "", players: 2100, img: "", alt: "empire gold" },
  { title: "CYBER POKER", badge: "", players: 540, img: "", alt: "poker" },
  { title: "GLITCH GEMS", badge: "", players: 880, img: "", alt: "gems" },
  { title: "VOLTAGE SPIN", badge: "", players: 1400, img: "", alt: "spin" },
];

export default GamesPage;
