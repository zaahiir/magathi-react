import React from 'react';
import { FaStar, FaHeart, FaRegHeart, FaChartBar, FaEye } from 'react-icons/fa';

const MutualFundCard = React.memo(({ 
  fund, 
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
  const getRiskColor = (risk) => {
    switch (risk) {
      case 'Very High': return 'text-red-700 bg-red-100';
      case 'High': return 'text-red-600 bg-red-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'Low': return 'text-green-600 bg-green-100';
      case 'Very Low': return 'text-green-700 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const calculateProjectedReturns = (fund, amount, period) => {
    const monthlyReturn = fund.returns / 12 / 100;
    const futureValue = amount * Math.pow(1 + monthlyReturn, period);
    return Math.round(futureValue);
  };

  return (
    <div
      className={`bg-white rounded-2xl shadow-lg p-6 transition-all duration-200 hover:shadow-xl ${
        selectedFund?._id === fund._id ? 'ring-2 ring-[#53755d]' : ''
      } ${viewMode === 'list' ? 'flex items-center space-x-6' : ''}`}
    >
      {viewMode === 'grid' ? (
        <>
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900">{fund.name}</h3>
              <p className="text-sm text-gray-600">{fund.category} Fund</p>
              <div className="flex items-center mt-1">
                <FaStar className="h-4 w-4 text-yellow-400 mr-1" />
                <span className="text-sm text-gray-600">{fund.rating}</span>
                <span className="text-sm text-gray-400 ml-2">• {fund.fundManager}</span>
              </div>
            </div>
            <div className="flex flex-col items-end space-y-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(fund.riskLevel)}`}>
                {fund.riskLevel} Risk
              </span>
              <div className="flex space-x-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleWatchlist(fund._id);
                  }}
                  className="min-h-[44px] min-w-[44px] p-2 rounded-full hover:bg-gray-100 transition-colors flex items-center justify-center"
                  title={watchlist.includes(fund._id) ? 'Remove from watchlist' : 'Add to watchlist'}
                >
                  {watchlist.includes(fund._id) ? (
                    <FaHeart className="h-4 w-4 text-red-500" />
                  ) : (
                    <FaRegHeart className="h-4 w-4 text-gray-400" />
                  )}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleComparison(fund._id);
                  }}
                  className={`min-h-[44px] min-w-[44px] p-2 rounded-full transition-colors flex items-center justify-center ${
                    compareFunds.includes(fund._id) 
                      ? 'bg-[#53755d] text-white' 
                      : 'hover:bg-gray-100 text-gray-400'
                  }`}
                  title="Add to comparison"
                  disabled={!compareFunds.includes(fund._id) && compareFunds.length >= 3}
                >
                  <FaChartBar className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-3 mb-4">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Expected Returns</span>
              <span className="text-sm font-semibold text-green-600">{fund.returns}% p.a.</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Minimum Investment</span>
              <span className="text-sm font-semibold">₹{fund.minInvestment.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Current NAV</span>
              <span className="text-sm font-semibold">₹{fund.nav}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">AUM</span>
              <span className="text-sm font-semibold">₹{(fund.aum / 10000000).toFixed(1)} Cr</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Expense Ratio</span>
              <span className="text-sm font-semibold">{fund.expenseRatio}%</span>
            </div>
          </div>

          {/* Projected Returns */}
          {selectedFund?._id === fund._id && (
            <div className="bg-[#53755d] text-white rounded-lg p-4 mb-4">
              <h4 className="font-semibold mb-2">Projected Returns</h4>
              <div className="text-2xl font-bold">
                ₹{calculateProjectedReturns(fund, investmentAmount, investmentPeriod).toLocaleString()}
              </div>
              <div className="text-sm opacity-90">
                From ₹{investmentAmount.toLocaleString()} in {investmentPeriod} months
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onViewDetails(fund);
              }}
              className="flex-1 bg-[#53755d] text-white py-3 px-4 rounded-lg hover:bg-[#3e5d49] transition-colors text-base font-medium min-h-[44px] flex items-center justify-center"
            >
              View Details
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onInvestNow(fund);
              }}
              className="flex-1 border border-[#53755d] text-[#53755d] py-3 px-4 rounded-lg hover:bg-[#53755d] hover:text-white transition-colors text-base font-medium min-h-[44px] flex items-center justify-center"
            >
              Invest Now
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="flex-1">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{fund.name}</h3>
                <p className="text-sm text-gray-600">{fund.category} Fund • {fund.fundManager}</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(fund.riskLevel)}`}>
                  {fund.riskLevel} Risk
                </span>
                <div className="flex items-center">
                  <FaStar className="h-4 w-4 text-yellow-400 mr-1" />
                  <span className="text-sm">{fund.rating}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-6 text-sm">
            <div className="text-center">
              <div className="text-green-600 font-semibold">{fund.returns}%</div>
              <div className="text-gray-500">Returns</div>
            </div>
            <div className="text-center">
              <div className="font-semibold">₹{fund.minInvestment.toLocaleString()}</div>
              <div className="text-gray-500">Min Investment</div>
            </div>
            <div className="text-center">
              <div className="font-semibold">{fund.expenseRatio}%</div>
              <div className="text-gray-500">Expense Ratio</div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleWatchlist(fund._id);
                }}
                className="min-h-[44px] min-w-[44px] p-2 rounded-full hover:bg-gray-100 transition-colors flex items-center justify-center"
                title={watchlist.includes(fund._id) ? 'Remove from watchlist' : 'Add to watchlist'}
              >
                {watchlist.includes(fund._id) ? (
                  <FaHeart className="h-4 w-4 text-red-500" />
                ) : (
                  <FaRegHeart className="h-4 w-4 text-gray-400" />
                )}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleComparison(fund._id);
                }}
                className={`min-h-[44px] min-w-[44px] p-2 rounded-full transition-colors flex items-center justify-center ${
                  compareFunds.includes(fund._id) 
                    ? 'bg-[#53755d] text-white' 
                    : 'hover:bg-gray-100 text-gray-400'
                }`}
                title="Add to comparison"
                disabled={!compareFunds.includes(fund._id) && compareFunds.length >= 3}
              >
                <FaChartBar className="h-4 w-4" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onViewDetails(fund);
                }}
                className="min-h-[44px] min-w-[44px] p-2 rounded-full hover:bg-gray-100 transition-colors flex items-center justify-center"
                title="View Details"
              >
                <FaEye className="h-4 w-4 text-gray-400" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
});

MutualFundCard.displayName = 'MutualFundCard';

export default MutualFundCard;
