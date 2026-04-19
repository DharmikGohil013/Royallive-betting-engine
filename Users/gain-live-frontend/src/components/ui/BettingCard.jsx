const BettingCard = ({ card }) => {
  if (card.isLive) {
    return (
      <div className="bg-surface-container p-4 rounded-sm border-r-2 border-primary-container">
        <div className="flex justify-between items-start mb-4">
          <div className="flex flex-col">
            <span className="text-[8px] font-bold text-secondary-container flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-secondary-container rounded-full inline-block animate-pulse"></span>
              {card.status}
            </span>
            <div className="mt-1 flex flex-col">
              <span className="font-headline font-bold text-sm">{card.team1}</span>
              <span className="font-headline font-bold text-sm text-on-surface-variant">
                {card.team2}
              </span>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-xs font-black text-primary-container font-headline">
              {card.score}
            </span>
          </div>
        </div>
        <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${card.gridCols || 3}, minmax(0, 1fr))` }}>
          {card.odds.map((odd, index) => (
            <div
              key={index}
              className={`bg-surface-container-low p-2 text-center rounded-sm border ${
                odd.highlight
                  ? "border-primary-container/40"
                  : "border-outline-variant/20"
              }`}
            >
              <span className="block text-[8px] text-on-surface-variant uppercase font-bold">
                {odd.label}
              </span>
              <span
                className={`font-headline font-bold text-sm ${
                  odd.highlight ? "text-primary-container" : ""
                }`}
              >
                {odd.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface-container p-4 rounded-sm">
      <div className="flex justify-between items-start mb-4">
        <div className="flex flex-col">
          <span className="text-[8px] font-bold text-on-surface-variant flex items-center gap-1">
            <span className="material-symbols-outlined text-[10px]">schedule</span>
            {card.status}
          </span>
          <div className="mt-1 flex flex-col">
            <span className="font-headline font-bold text-sm">{card.team1}</span>
            <span className="font-headline font-bold text-sm text-on-surface-variant">
              {card.team2}
            </span>
          </div>
        </div>
      </div>
      <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${card.gridCols || 3}, minmax(0, 1fr))` }}>
        {card.odds.map((odd, index) => (
          <div
            key={index}
            className="bg-surface-container-low p-2 text-center rounded-sm border border-outline-variant/20"
          >
            <span className="block text-[8px] text-on-surface-variant uppercase font-bold">
              {odd.label}
            </span>
            <span className="font-headline font-bold text-sm">{odd.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BettingCard;
