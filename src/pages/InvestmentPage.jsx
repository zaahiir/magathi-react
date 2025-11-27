import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  FaChartLine, 
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
  FaLayerGroup,
  FaArrowLeft,
  FaPhone,
  FaEnvelope,
  FaCalculator,
  FaMoneyBillWave,
  FaArrowUp,
  FaPiggyBank,
  FaSyncAlt
} from 'react-icons/fa';
import HeaderNav from '../components/HeaderNav';
import Footer from '../components/Footer';
import PlanService from '../services/planService';
import coverImage from '../assets/cover.jpg';

// SIP Calculator Function
const calculateSIP = (monthlyAmount, years, annualRate) => {
  const monthlyRate = annualRate / 12 / 100;
  const months = years * 12;
  let futureValue = 0;
  let totalInvested = 0;
  
  for (let i = 0; i < months; i++) {
    totalInvested += monthlyAmount;
    futureValue += monthlyAmount;
    futureValue *= (1 + monthlyRate);
  }
  
  return {
    totalInvested: Math.round(totalInvested),
    futureValue: Math.round(futureValue),
    returns: Math.round(futureValue - totalInvested),
    monthlyAmount,
    years,
    annualRate
  };
};

// Lumpsum Calculator Function
const calculateLumpsum = (amount, years, annualRate) => {
  const futureValue = Math.round(amount * Math.pow(1 + annualRate / 100, years));
  const returns = futureValue - amount;
  
  return {
    totalInvested: amount,
    futureValue,
    returns,
    amount,
    years,
    annualRate
  };
};

const InvestmentPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [fund, setFund] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Calculator states
  const [investmentType, setInvestmentType] = useState('sip'); // 'sip' or 'lumpsum'
  const [sipAmount, setSipAmount] = useState(5000);
  const [lumpsumAmount, setLumpsumAmount] = useState(100000);
  const [investmentYears, setInvestmentYears] = useState(10);
  const [expectedReturns, setExpectedReturns] = useState(12);
  const [sipResult, setSipResult] = useState(null);
  const [lumpsumResult, setLumpsumResult] = useState(null);

  useEffect(() => {
    const fetchFundDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await PlanService.getPlanById(id);
        
        if (response.success && response.data) {
          const fundData = response.data;
          setFund(fundData);
          // Set expected returns from fund data
          if (fundData.returns && fundData.returns > 0) {
            setExpectedReturns(fundData.returns);
          }
          // Set default SIP amount to fund's minimum SIP if available
          if (fundData.sipAmount && fundData.sipAmount > 0) {
            setSipAmount(fundData.sipAmount);
          }
          // Set default lumpsum to fund's minimum investment
          if (fundData.minInvestment && fundData.minInvestment > 0) {
            setLumpsumAmount(fundData.minInvestment);
          }
        } else {
          setError(response.message || 'Fund not found');
        }
      } catch (error) {
        console.error('Error fetching fund details:', error);
        setError('Failed to load fund details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchFundDetails();
    }
  }, [id]);

  // Calculate results when inputs change
  useEffect(() => {
    if (investmentType === 'sip' && sipAmount > 0 && investmentYears > 0 && expectedReturns > 0) {
      const result = calculateSIP(sipAmount, investmentYears, expectedReturns);
      setSipResult(result);
    } else if (investmentType === 'lumpsum' && lumpsumAmount > 0 && investmentYears > 0 && expectedReturns > 0) {
      const result = calculateLumpsum(lumpsumAmount, investmentYears, expectedReturns);
      setLumpsumResult(result);
    }
  }, [investmentType, sipAmount, lumpsumAmount, investmentYears, expectedReturns]);

  // Helper function to get risk color
  const getRiskColor = (riskLevel) => {
    const risk = riskLevel || fund?.riskometer || fund?.riskLevel;
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

  // Format currency
  const formatCurrency = (amount) => {
    if (!amount) return '₹0';
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(2)} Cr`;
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(2)} L`;
    } else {
      return `₹${amount.toLocaleString('en-IN')}`;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <HeaderNav />
        <div className="flex justify-center items-center py-32">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#53755d] mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Loading investment details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !fund) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <HeaderNav />
        <div className="flex justify-center items-center py-32">
          <div className="text-center max-w-md mx-auto px-4">
            <div className="text-6xl mb-4">😕</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Fund Not Found</h2>
            <p className="text-gray-600 mb-6">{error || 'The fund you are looking for does not exist.'}</p>
            <button
              onClick={() => navigate('/mutual-fund-plan-details')}
              className="bg-[#53755d] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#3e5d49] transition-colors"
            >
              Back to Funds
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Get fund data with fallbacks
  const fundName = fund.schemeName || fund.name || 'N/A';
  const amcName = fund.amcName || 'N/A';
  const category = fund.category || 'N/A';
  const subcategory = fund.subcategory || '';
  const riskLevel = fund.riskometer || fund.riskLevel || 'N/A';
  const fundManager = fund.fundManager || 'N/A';
  const benchmarkIndex = fund.benchmarkIndex || 'N/A';
  const nav = fund.nav || 0;
  const minInvestment = fund.minInvestment || 0;
  const sipAmountMin = fund.sipAmount || 0;
  const expenseRatio = fund.expenseRatio || 0;
  const exitLoad = fund.exitLoad || 'N/A';
  const returns = fund.returns || 0;
  const aum = fund.aum || 0;
  const rating = fund.rating || 0;
  const documents = fund.documents || {};

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <HeaderNav />

      {/* Hero Section */}
      <section className="relative py-12 sm:py-16 overflow-hidden" style={{ backgroundImage: `url(${coverImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30"></div>
        <div className="relative z-10 container mx-auto px-4">
          <button
            onClick={() => navigate(`/fund-details/${id}`)}
            className="flex items-center space-x-2 text-white/80 hover:text-white mb-6 transition-colors"
          >
            <FaArrowLeft className="h-4 w-4" />
            <span>Back to Fund Details</span>
          </button>
          <div className="text-white max-w-4xl">
            <div className="flex items-start space-x-4 mb-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/20 rounded-xl flex items-center justify-center text-3xl sm:text-4xl flex-shrink-0">
                <FaCalculator />
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-2">Invest in {fundName}</h1>
                <p className="text-base sm:text-lg text-white/80">
                  {category}{subcategory ? ` • ${subcategory}` : ''} Fund
                </p>
                <div className="flex flex-wrap items-center gap-3 mt-3">
                  <div className="flex items-center">
                    <FaStar className="h-4 w-4 text-yellow-300 mr-1" />
                    <span className="text-sm sm:text-base">{rating > 0 ? rating.toFixed(1) : 'N/A'}</span>
                  </div>
                  <span className="text-white/60">•</span>
                  <span className={`px-3 py-1 rounded-full text-xs sm:text-sm font-medium border ${getRiskColor(riskLevel)}`}>
                    {riskLevel} Risk
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8 sm:py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
              {/* Left Column - Fund Details */}
              <div className="lg:col-span-1 space-y-6">
                {/* Fund Summary Card */}
                <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200 shadow-sm">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                    <FaInfoCircle className="h-5 w-5 text-[#53755d] mr-2" />
                    Fund Summary
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span className="text-gray-600">AMC:</span>
                      <span className="font-semibold text-gray-900">{amcName}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span className="text-gray-600">Category:</span>
                      <span className="font-semibold text-gray-900">{category}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span className="text-gray-600">Current NAV:</span>
                      <span className="font-semibold text-gray-900">₹{nav.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span className="text-gray-600">Min Investment:</span>
                      <span className="font-semibold text-gray-900">{formatCurrency(minInvestment)}</span>
                    </div>
                    {sipAmountMin > 0 && (
                      <div className="flex justify-between py-2 border-b border-gray-200">
                        <span className="text-gray-600">Min SIP:</span>
                        <span className="font-semibold text-gray-900">₹{sipAmountMin.toLocaleString('en-IN')}</span>
                      </div>
                    )}
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span className="text-gray-600">Expense Ratio:</span>
                      <span className="font-semibold text-gray-900">{expenseRatio}%</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-gray-600">Exit Load:</span>
                      <span className="font-semibold text-gray-900">{exitLoad}</span>
                    </div>
                  </div>
                </div>

                {/* Contact Card */}
                <div className="bg-gradient-to-br from-[#53755d] to-[#6b8a6f] rounded-xl p-4 sm:p-6 text-white">
                  <h3 className="text-lg font-bold mb-4">Need Assistance?</h3>
                  <p className="text-white/90 text-sm mb-4">
                    Our financial experts are here to help you with your investment.
                  </p>
                  <div className="space-y-2 mb-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <FaPhone className="h-4 w-4" />
                      <span>+91 98765 43210</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FaEnvelope className="h-4 w-4" />
                      <span>info@magathi.com</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Calculator */}
              <div className="lg:col-span-2 space-y-6">
                {/* Investment Type Tabs */}
                <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200 shadow-sm">
                  <div className="flex space-x-2 mb-6">
                    <button
                      onClick={() => setInvestmentType('sip')}
                      className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
                        investmentType === 'sip'
                          ? 'bg-[#53755d] text-white shadow-lg'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <FaSyncAlt className="inline-block mr-2" />
                      SIP Investment
                    </button>
                    <button
                      onClick={() => setInvestmentType('lumpsum')}
                      className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
                        investmentType === 'lumpsum'
                          ? 'bg-[#53755d] text-white shadow-lg'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <FaMoneyBillWave className="inline-block mr-2" />
                      Lumpsum Investment
                    </button>
                  </div>

                  {/* SIP Calculator */}
                  {investmentType === 'sip' && (
                    <div className="space-y-6">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Monthly SIP Amount (₹)
                          </label>
                          <input
                            type="number"
                            value={sipAmount}
                            onChange={(e) => setSipAmount(Math.max(sipAmountMin || 100, Number(e.target.value)))}
                            min={sipAmountMin || 100}
                            step="100"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#53755d] focus:border-transparent text-lg"
                          />
                          {sipAmountMin > 0 && (
                            <p className="text-xs text-gray-500 mt-1">Minimum: ₹{sipAmountMin.toLocaleString('en-IN')}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Investment Period (Years)
                          </label>
                          <input
                            type="number"
                            value={investmentYears}
                            onChange={(e) => setInvestmentYears(Math.max(1, Math.min(50, Number(e.target.value))))}
                            min="1"
                            max="50"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#53755d] focus:border-transparent text-lg"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Expected Annual Returns (%)
                          </label>
                          <input
                            type="number"
                            value={expectedReturns}
                            onChange={(e) => setExpectedReturns(Math.max(0, Math.min(30, Number(e.target.value))))}
                            min="0"
                            max="30"
                            step="0.1"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#53755d] focus:border-transparent text-lg"
                          />
                          <p className="text-xs text-gray-500 mt-1">Fund's expected return: {returns > 0 ? `${returns}%` : 'N/A'}</p>
                        </div>
                      </div>

                      {/* SIP Results */}
                      {sipResult && (
                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200">
                          <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                            <FaArrowUp className="h-5 w-5 text-green-600 mr-2" />
                            Investment Projection
                          </h4>
                          <div className="grid sm:grid-cols-3 gap-4 mb-4">
                            <div className="bg-white rounded-lg p-4 text-center">
                              <div className="text-xs text-gray-600 mb-1">Total Invested</div>
                              <div className="text-2xl font-bold text-gray-900">{formatCurrency(sipResult.totalInvested)}</div>
                            </div>
                            <div className="bg-white rounded-lg p-4 text-center">
                              <div className="text-xs text-gray-600 mb-1">Est. Returns</div>
                              <div className="text-2xl font-bold text-green-600">{formatCurrency(sipResult.returns)}</div>
                            </div>
                            <div className="bg-white rounded-lg p-4 text-center">
                              <div className="text-xs text-gray-600 mb-1">Maturity Value</div>
                              <div className="text-2xl font-bold text-[#53755d]">{formatCurrency(sipResult.futureValue)}</div>
                            </div>
                          </div>
                          <div className="bg-white rounded-lg p-4">
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-gray-600">Monthly Investment:</span>
                              <span className="font-semibold">₹{sipResult.monthlyAmount.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm mt-2">
                              <span className="text-gray-600">Investment Period:</span>
                              <span className="font-semibold">{sipResult.years} Years</span>
                            </div>
                            <div className="flex justify-between items-center text-sm mt-2">
                              <span className="text-gray-600">Expected Returns:</span>
                              <span className="font-semibold">{sipResult.annualRate}% p.a.</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Lumpsum Calculator */}
                  {investmentType === 'lumpsum' && (
                    <div className="space-y-6">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Investment Amount (₹)
                          </label>
                          <input
                            type="number"
                            value={lumpsumAmount}
                            onChange={(e) => setLumpsumAmount(Math.max(minInvestment || 1000, Number(e.target.value)))}
                            min={minInvestment || 1000}
                            step="1000"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#53755d] focus:border-transparent text-lg"
                          />
                          {minInvestment > 0 && (
                            <p className="text-xs text-gray-500 mt-1">Minimum: {formatCurrency(minInvestment)}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Investment Period (Years)
                          </label>
                          <input
                            type="number"
                            value={investmentYears}
                            onChange={(e) => setInvestmentYears(Math.max(1, Math.min(50, Number(e.target.value))))}
                            min="1"
                            max="50"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#53755d] focus:border-transparent text-lg"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Expected Annual Returns (%)
                          </label>
                          <input
                            type="number"
                            value={expectedReturns}
                            onChange={(e) => setExpectedReturns(Math.max(0, Math.min(30, Number(e.target.value))))}
                            min="0"
                            max="30"
                            step="0.1"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#53755d] focus:border-transparent text-lg"
                          />
                          <p className="text-xs text-gray-500 mt-1">Fund's expected return: {returns > 0 ? `${returns}%` : 'N/A'}</p>
                        </div>
                      </div>

                      {/* Lumpsum Results */}
                      {lumpsumResult && (
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200">
                          <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                            <FaChartBar className="h-5 w-5 text-blue-600 mr-2" />
                            Investment Projection
                          </h4>
                          <div className="grid sm:grid-cols-3 gap-4 mb-4">
                            <div className="bg-white rounded-lg p-4 text-center">
                              <div className="text-xs text-gray-600 mb-1">Total Invested</div>
                              <div className="text-2xl font-bold text-gray-900">{formatCurrency(lumpsumResult.totalInvested)}</div>
                            </div>
                            <div className="bg-white rounded-lg p-4 text-center">
                              <div className="text-xs text-gray-600 mb-1">Est. Returns</div>
                              <div className="text-2xl font-bold text-green-600">{formatCurrency(lumpsumResult.returns)}</div>
                            </div>
                            <div className="bg-white rounded-lg p-4 text-center">
                              <div className="text-xs text-gray-600 mb-1">Maturity Value</div>
                              <div className="text-2xl font-bold text-[#53755d]">{formatCurrency(lumpsumResult.futureValue)}</div>
                            </div>
                          </div>
                          <div className="bg-white rounded-lg p-4">
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-gray-600">Investment Amount:</span>
                              <span className="font-semibold">{formatCurrency(lumpsumResult.amount)}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm mt-2">
                              <span className="text-gray-600">Investment Period:</span>
                              <span className="font-semibold">{lumpsumResult.years} Years</span>
                            </div>
                            <div className="flex justify-between items-center text-sm mt-2">
                              <span className="text-gray-600">Expected Returns:</span>
                              <span className="font-semibold">{lumpsumResult.annualRate}% p.a.</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="mt-6 flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => {
                        // Here you would integrate with payment/investment API
                        alert(`Proceeding with ${investmentType === 'sip' ? 'SIP' : 'Lumpsum'} investment of ${investmentType === 'sip' ? formatCurrency(sipAmount) : formatCurrency(lumpsumAmount)}`);
                      }}
                      className="flex-1 bg-gradient-to-r from-[#53755d] to-[#6b8a6f] text-white py-3 px-6 rounded-xl font-semibold hover:from-[#3e5d49] hover:to-[#53755d] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center space-x-2"
                    >
                      <FaCheckCircle className="h-5 w-5" />
                      <span>Proceed to Invest</span>
                    </button>
                    <button
                      onClick={() => navigate(`/fund-details/${id}`)}
                      className="flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:bg-gray-300 transition-colors duration-300"
                    >
                      Cancel
                    </button>
                  </div>
                </div>

                {/* Important Notice */}
                <div className="bg-yellow-50 border-l-4 border-yellow-400 rounded-lg p-4">
                  <div className="flex items-start">
                    <FaExclamationTriangle className="h-5 w-5 text-yellow-600 mr-3 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-yellow-800">
                      <p className="font-semibold mb-1">Important Notice</p>
                      <p>Mutual fund investments are subject to market risks. Please read all scheme related documents carefully before investing. Past performance is not indicative of future results. The calculator provides estimates based on assumed returns and may not reflect actual performance.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default InvestmentPage;

