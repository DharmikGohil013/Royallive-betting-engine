const PromotionsStrip = () => {
  return (
    <section className="px-4 py-8">
      <div className="bg-gradient-to-r from-surface-container-high to-surface-container flex items-center p-4 rounded-lg border-l-4 border-secondary-container">
        <div className="flex-1">
          <h3 className="font-headline font-bold text-lg leading-tight uppercase">
            Double Down Bonus
          </h3>
          <p className="text-xs text-on-surface-variant font-medium">
            Get 100% matched deposit on all Sports
          </p>
        </div>
        <span className="material-symbols-outlined text-secondary-container text-3xl">
          celebration
        </span>
      </div>
    </section>
  );
};

export default PromotionsStrip;
