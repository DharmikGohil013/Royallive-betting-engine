const ambassadors = [
  {
    name: "Alex Storm",
    role: "Pro Poker Champion",
    img: "https://img.icons8.com/fluency/96/000000/user-male-circle.png",
  },
  {
    name: "Sarah Blitz",
    role: "Sports Analyst",
    img: "https://img.icons8.com/fluency/96/000000/user-female-circle.png",
  },
  {
    name: "Mike Thunder",
    role: "Esports Legend",
    img: "https://img.icons8.com/fluency/96/000000/user-male-circle--v1.png",
  },
  {
    name: "Luna Star",
    role: "Casino Streamer",
    img: "https://img.icons8.com/fluency/96/000000/user-female-circle--v1.png",
  },
];

const AmbassadorsSection = () => {
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
            key={a.name}
            className="bg-surface-container rounded-xl p-4 flex items-center gap-3 border border-tertiary-fixed-dim/10 hover:border-tertiary-fixed-dim/25 transition-all group"
          >
            <div className="w-12 h-12 rounded-full overflow-hidden bg-surface-container-high shrink-0 border-2 border-tertiary-fixed-dim/30">
              <img
                src={a.img}
                alt={a.name}
                className="w-full h-full object-cover"
              />
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
