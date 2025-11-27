import React from 'react';
import { 
  FaChartLine, 
  FaTimes, 
  FaStar, 
  FaBuilding, 
  FaUser, 
  FaCalendarAlt,
  FaFileAlt,
  FaDownload,
  FaInfoCircle,
  FaExclamationTriangle,
  FaCheckCircle,
  FaRupeeSign,
  FaPercent,
  FaChartBar,
  FaLayerGroup
} from 'react-icons/fa';

const FundDetails = React.memo(({ 
  selectedFund, 
  showFundModal, 
  onClose, 
  onInvestNow 
}) => {
  if (!showFundModal || !selectedFund) return null;

  // Helper function to get risk color
  const getRiskColor = (riskLevel) => {
    const risk = riskLevel || selectedFund.riskometer || selectedFund.riskLevel;
    switch (risk) {
      case 'Very Low':
      case 'Low':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Moderate':
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'High':
      case 'Very High':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Get fund name (support both legacy and new fields)
  const fundName = selectedFund.schemeName || selectedFund.name || 'N/A';
  const amcName = selectedFund.amcName || 'N/A';
  const category = selectedFund.category || 'N/A';
  const subcategory = selectedFund.subcategory || '';
  const riskLevel = selectedFund.riskometer || selectedFund.riskLevel || 'N/A';
  const fundManager = selectedFund.fundManager || 'N/A';
  const benchmarkIndex = selectedFund.benchmarkIndex || 'N/A';
  const fundObjective = selectedFund.fundObjective || selectedFund.description || 'No description available.';
  const nav = selectedFund.nav || 0;
  const minInvestment = selectedFund.minInvestment || 0;
  const sipAmount = selectedFund.sipAmount || 0;
  const expenseRatio = selectedFund.expenseRatio || 0;
  const exitLoad = selectedFund.exitLoad || 'N/A';
  const returns = selectedFund.returns || 0;
  const aum = selectedFund.aum || 0;
  const rating = selectedFund.rating || 0;
  const launchDate = selectedFund.launchDate ? new Date(selectedFund.launchDate).toLocaleDateString('en-IN', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  }) : 'N/A';
  const documents = selectedFund.documents || {};

  // Format currency
  const formatCurrency = (amount) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(2)} Cr`;
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(2)} L`;
    } else {
      return `₹${amount.toLocaleString('en-IN')}`;
    }
  };

  // Handle backdrop click
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-xl sm:rounded-2xl max-w-6xl w-full max-h-[95vh] overflow-y-auto my-4 shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-[#53755d] to-[#6b8a6f] text-white p-4 sm:p-6 rounded-t-xl sm:rounded-t-2xl z-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/20 rounded-lg sm:rounded-xl flex items-center justify-center text-xl sm:text-3xl flex-shrink-0">
                <FaChartLine />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-lg sm:text-2xl font-bold truncate">{fundName}</h2>
                <p className="text-sm sm:text-base text-white/80 mt-1">
                  {category}{subcategory ? ` • ${subcategory}` : ''} Fund
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center">
                    <FaStar className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-300 mr-1" />
                    <span className="text-sm sm:text-base">{rating > 0 ? rating.toFixed(1) : 'N/A'}</span>
                  </div>
                  <span className="text-white/60">•</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getRiskColor(riskLevel)}`}>
                    {riskLevel} Risk
                  </span>
                </div>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center hover:bg-white/30 transition-colors flex-shrink-0"
              aria-label="Close"
            >
              <FaTimes className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div className="text-center p-3 sm:p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
              <div className="flex items-center justify-center mb-1">
                <FaRupeeSign className="h-4 w-4 text-[#53755d] mr-1" />
                <div className="text-lg sm:text-2xl font-bold text-[#53755d]">
                  {minInvestment >= 1000 ? formatCurrency(minInvestment) : `₹${minInvestment.toLocaleString('en-IN')}`}
                </div>
              </div>
              <div className="text-xs sm:text-sm text-gray-600 font-medium">Min Investment</div>
            </div>
            <div className="text-center p-3 sm:p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
              <div className="flex items-center justify-center mb-1">
                <FaPercent className="h-4 w-4 text-blue-600 mr-1" />
                <div className="text-lg sm:text-2xl font-bold text-blue-600">{expenseRatio}%</div>
              </div>
              <div className="text-xs sm:text-sm text-gray-600 font-medium">Expense Ratio</div>
            </div>
            <div className="text-center p-3 sm:p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200">
              <div className="flex items-center justify-center mb-1">
                <FaChartBar className="h-4 w-4 text-purple-600 mr-1" />
                <div className="text-lg sm:text-2xl font-bold text-purple-600">{returns > 0 ? `${returns}%` : 'N/A'}</div>
              </div>
              <div className="text-xs sm:text-sm text-gray-600 font-medium">Expected Returns</div>
            </div>
            <div className="text-center p-3 sm:p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl border border-orange-200">
              <div className="flex items-center justify-center mb-1">
                <FaStar className="h-4 w-4 text-orange-600 mr-1" />
                <div className="text-lg sm:text-2xl font-bold text-orange-600">{rating > 0 ? rating.toFixed(1) : 'N/A'}</div>
              </div>
              <div className="text-xs sm:text-sm text-gray-600 font-medium">Rating</div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
            {/* Fund Information */}
            <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 sm:p-6 border border-gray-200 shadow-sm">
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 flex items-center">
                <FaInfoCircle className="h-5 w-5 text-[#53755d] mr-2" />
                Fund Information
              </h3>
              <div className="space-y-3 text-sm sm:text-base">
                <div className="flex flex-col sm:flex-row sm:justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-600 font-medium mb-1 sm:mb-0">AMC Name:</span>
                  <span className="font-semibold text-gray-900 text-right">{amcName}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-600 font-medium mb-1 sm:mb-0">Category:</span>
                  <span className="font-semibold text-gray-900 text-right">{category}</span>
                </div>
                {subcategory && (
                  <div className="flex flex-col sm:flex-row sm:justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600 font-medium mb-1 sm:mb-0">Subcategory:</span>
                    <span className="font-semibold text-gray-900 text-right">{subcategory}</span>
                  </div>
                )}
                <div className="flex flex-col sm:flex-row sm:justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-600 font-medium mb-1 sm:mb-0">Risk Level:</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border inline-block ${getRiskColor(riskLevel)}`}>
                    {riskLevel}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-600 font-medium mb-1 sm:mb-0">Fund Manager:</span>
                  <span className="font-semibold text-gray-900 text-right">{fundManager}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-600 font-medium mb-1 sm:mb-0">Benchmark Index:</span>
                  <span className="font-semibold text-gray-900 text-right">{benchmarkIndex}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between py-2">
                  <span className="text-gray-600 font-medium mb-1 sm:mb-0">Launch Date:</span>
                  <span className="font-semibold text-gray-900 text-right">{launchDate}</span>
                </div>
              </div>
            </div>

            {/* Investment Details */}
            <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 sm:p-6 border border-gray-200 shadow-sm">
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 flex items-center">
                <FaLayerGroup className="h-5 w-5 text-[#53755d] mr-2" />
                Investment Details
              </h3>
              <div className="space-y-3 text-sm sm:text-base">
                <div className="flex flex-col sm:flex-row sm:justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-600 font-medium mb-1 sm:mb-0">Current NAV:</span>
                  <span className="font-semibold text-gray-900 text-right">₹{nav.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                {aum > 0 && (
                  <div className="flex flex-col sm:flex-row sm:justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600 font-medium mb-1 sm:mb-0">Assets Under Management:</span>
                    <span className="font-semibold text-gray-900 text-right">{formatCurrency(aum)}</span>
                  </div>
                )}
                <div className="flex flex-col sm:flex-row sm:justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-600 font-medium mb-1 sm:mb-0">Minimum Investment:</span>
                  <span className="font-semibold text-gray-900 text-right">
                    {minInvestment >= 1000 ? formatCurrency(minInvestment) : `₹${minInvestment.toLocaleString('en-IN')}`}
                  </span>
                </div>
                {sipAmount > 0 && (
                  <div className="flex flex-col sm:flex-row sm:justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600 font-medium mb-1 sm:mb-0">SIP Amount:</span>
                    <span className="font-semibold text-gray-900 text-right">₹{sipAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex flex-col sm:flex-row sm:justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-600 font-medium mb-1 sm:mb-0">Expense Ratio:</span>
                  <span className="font-semibold text-gray-900 text-right">{expenseRatio}%</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-600 font-medium mb-1 sm:mb-0">Exit Load:</span>
                  <span className="font-semibold text-gray-900 text-right">{exitLoad}</span>
                </div>
                {returns > 0 && (
                  <div className="flex flex-col sm:flex-row sm:justify-between py-2">
                    <span className="text-gray-600 font-medium mb-1 sm:mb-0">Expected Returns:</span>
                    <span className="font-semibold text-green-600 text-right">{returns}% p.a.</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Fund Objective */}
          <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-4 sm:p-6 border border-blue-200 shadow-sm">
            <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 flex items-center">
              <FaFileAlt className="h-5 w-5 text-[#53755d] mr-2" />
              Fund Objective
            </h3>
            <p className="text-gray-700 leading-relaxed text-sm sm:text-base">{fundObjective}</p>
          </div>

          {/* Documents Section */}
          {(documents.sid || documents.kim || documents.sai) && (
            <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 sm:p-6 border border-gray-200 shadow-sm">
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 flex items-center">
                <FaDownload className="h-5 w-5 text-[#53755d] mr-2" />
                Fund Documents
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {documents.sid && (
                  <a 
                    href={documents.sid} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center space-x-2 p-3 bg-white border-2 border-[#53755d] rounded-lg hover:bg-[#53755d] hover:text-white transition-colors text-sm sm:text-base font-medium"
                  >
                    <FaFileAlt className="h-4 w-4" />
                    <span>SID</span>
                  </a>
                )}
                {documents.kim && (
                  <a 
                    href={documents.kim} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center space-x-2 p-3 bg-white border-2 border-[#53755d] rounded-lg hover:bg-[#53755d] hover:text-white transition-colors text-sm sm:text-base font-medium"
                  >
                    <FaFileAlt className="h-4 w-4" />
                    <span>KIM</span>
                  </a>
                )}
                {documents.sai && (
                  <a 
                    href={documents.sai} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center space-x-2 p-3 bg-white border-2 border-[#53755d] rounded-lg hover:bg-[#53755d] hover:text-white transition-colors text-sm sm:text-base font-medium"
                  >
                    <FaFileAlt className="h-4 w-4" />
                    <span>SAI</span>
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Important Notice */}
          <div className="bg-yellow-50 border-l-4 border-yellow-400 rounded-lg p-4">
            <div className="flex items-start">
              <FaExclamationTriangle className="h-5 w-5 text-yellow-600 mr-3 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-yellow-800">
                <p className="font-semibold mb-1">Important Notice</p>
                <p>Mutual fund investments are subject to market risks. Please read all scheme related documents carefully before investing. Past performance is not indicative of future results.</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2">
            <button 
              onClick={() => onInvestNow(selectedFund)}
              className="flex-1 bg-gradient-to-r from-[#53755d] to-[#6b8a6f] text-white py-3 px-6 rounded-xl font-semibold hover:from-[#3e5d49] hover:to-[#53755d] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center space-x-2 text-sm sm:text-base"
            >
              <FaCheckCircle className="h-5 w-5" />
              <span>Invest Now</span>
            </button>
            <button 
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:bg-gray-300 transition-colors duration-300 text-sm sm:text-base"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

FundDetails.displayName = 'FundDetails';

export default FundDetails;




