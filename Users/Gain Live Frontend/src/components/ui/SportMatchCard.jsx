const SportMatchCard = ({ match }) => {
  return (
    <div className="flex-none w-80 glass-card p-4 rounded-xl">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary-container text-sm">
            {match.icon}
          </span>
          <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
            {match.sport} • {match.league}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
          <span className="text-[10px] font-bold text-red-500 uppercase">{match.liveTime}</span>
        </div>
      </div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex flex-col gap-2 flex-1">
          {match.teams.map((team, index) => (
            <div key={index} className="flex justify-between items-center">
              <span
                className={`font-headline font-bold text-sm tracking-tight ${
                  !team.isHome ? "text-on-surface-variant" : ""
                }`}
              >
                {team.name}
              </span>
              <span
                className={`font-headline font-black text-lg ${
                  team.isHome ? "text-primary-container" : "text-on-surface-variant"
                }`}
              >
                {team.score}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className={`grid grid-cols-${match.gridCols} gap-2`}>
        {match.odds.map((odd, index) => (
          <button
            key={index}
            className="bg-surface-container-highest/50 hover:bg-primary-container hover:text-on-primary-container transition-all p-2 rounded-lg border border-white/5 flex flex-col items-center"
          >
            <span className="text-[8px] uppercase font-bold text-on-surface-variant mb-1">
              {odd.label}
            </span>
            <span className="font-headline font-black text-sm">{odd.value}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SportMatchCard;
