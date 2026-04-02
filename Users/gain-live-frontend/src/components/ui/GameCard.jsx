const GameCard = ({ game }) => {
  return (
    <div className="bg-surface-container-low aspect-[3/4] rounded-sm overflow-hidden relative group">
      <img
        className="w-full h-full object-cover"
        alt={game.alt}
        src={game.img}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
      <div className="absolute bottom-2 left-2 right-2 flex flex-col">
        <span className={`text-[8px] font-bold uppercase tracking-widest ${game.badgeColor}`}>
          {game.badge}
        </span>
        <span className="text-xs font-bold font-headline uppercase">{game.title}</span>
      </div>
    </div>
  );
};

export default GameCard;
