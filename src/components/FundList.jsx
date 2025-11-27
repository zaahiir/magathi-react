import React from 'react';
import MutualFundCard from './MutualFundCard';

const FundList = React.memo(({
  funds,
  viewMode,
  selectedFund,
  watchlist,
  compareFunds,
  investmentAmount,
  investmentPeriod,
  onToggleWatchlist,
  onToggleComparison,
  onViewDetails,
  onInvestNow,
  onSelectFund
}) => {
  return (
    <div className={viewMode === 'grid' ? 'grid grid-cols-1 lg:grid-cols-2 gap-6' : 'space-y-4'}>
      {funds.map((fund) => (
        <MutualFundCard
          key={fund._id}
          fund={fund}
          viewMode={viewMode}
          selectedFund={selectedFund}
          watchlist={watchlist}
          compareFunds={compareFunds}
          investmentAmount={investmentAmount}
          investmentPeriod={investmentPeriod}
          onToggleWatchlist={onToggleWatchlist}
          onToggleComparison={onToggleComparison}
          onViewDetails={onViewDetails}
          onInvestNow={onInvestNow}
          onSelectFund={onSelectFund}
        />
      ))}
    </div>
  );
});

FundList.displayName = 'FundList';

export default FundList;




