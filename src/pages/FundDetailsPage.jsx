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
  FaEnvelope
} from 'react-icons/fa';
import HeaderNav from '../components/HeaderNav';
import Footer from '../components/Footer';
import PlanService from '../services/planService';
import coverImage from '../assets/cover.jpg';

const FundDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [fund, setFund] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFundDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await PlanService.getPlanById(id);
        
        if (response.success && response.data) {
          setFund(response.data);
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
    if (!amount) return 'N/A';
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(2)} Cr`;
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(2)} L`;
    } else {
      return `₹${amount.toLocaleString('en-IN')}`;
    }
  };

  const handleInvestNow = () => {
    navigate(`/invest/${id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <HeaderNav />
        <div className="flex justify-center items-center py-32">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#53755d] mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Loading fund details...</p>
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
  const fundObjective = fund.fundObjective || fund.description || 'No description available.';
  const nav = fund.nav || 0;
  const minInvestment = fund.minInvestment || 0;
  const sipAmount = fund.sipAmount || 0;
  const expenseRatio = fund.expenseRatio || 0;
  const exitLoad = fund.exitLoad || 'N/A';
  const returns = fund.returns || 0;
  const aum = fund.aum || 0;
  const rating = fund.rating || 0;
  const launchDate = fund.launchDate ? new Date(fund.launchDate).toLocaleDateString('en-IN', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  }) : 'N/A';
  const documents = fund.documents || {};

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <HeaderNav />

      {/* Hero Section */}
      <section className="relative py-16 sm:py-20 overflow-hidden" style={{ backgroundImage: `url(${coverImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30"></div>
        <div className="relative z-10 container mx-auto px-4">
          <button
            onClick={() => navigate('/mutual-fund-plan-details')}
            className="flex items-center space-x-2 text-white/80 hover:text-white mb-6 transition-colors"
          >
            <FaArrowLeft className="h-4 w-4" />
            <span>Back to Funds</span>
          </button>
          <div className="text-white max-w-4xl">
            <div className="flex items-start space-x-4 mb-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/20 rounded-xl flex items-center justify-center text-3xl sm:text-4xl flex-shrink-0">
                <FaChartLine />
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-2">{fundName}</h1>
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
            {/* Key Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
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
            <div className="grid md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
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
                  <div className="flex flex-col sm:flex-row sm:justify-between py-2">
                    <span className="text-gray-600 font-medium mb-1 sm:mb-0">Exit Load:</span>
                    <span className="font-semibold text-gray-900 text-right">{exitLoad}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Fund Objective */}
            <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-4 sm:p-6 border border-blue-200 shadow-sm mb-6 sm:mb-8">
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 flex items-center">
                <FaFileAlt className="h-5 w-5 text-[#53755d] mr-2" />
                Fund Objective
              </h3>
              <p className="text-gray-700 leading-relaxed text-sm sm:text-base">{fundObjective}</p>
            </div>

            {/* Documents Section */}
            {(documents.sid || documents.kim || documents.sai) && (
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 sm:p-6 border border-gray-200 shadow-sm mb-6 sm:mb-8">
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
            <div className="bg-yellow-50 border-l-4 border-yellow-400 rounded-lg p-4 mb-6 sm:mb-8">
              <div className="flex items-start">
                <FaExclamationTriangle className="h-5 w-5 text-yellow-600 mr-3 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-yellow-800">
                  <p className="font-semibold mb-1">Important Notice</p>
                  <p>Mutual fund investments are subject to market risks. Please read all scheme related documents carefully before investing. Past performance is not indicative of future results.</p>
                </div>
              </div>
            </div>

            {/* Contact Section */}
            <div className="bg-gradient-to-br from-[#53755d] to-[#6b8a6f] rounded-xl p-6 sm:p-8 text-white mb-6 sm:mb-8">
              <h3 className="text-xl sm:text-2xl font-bold mb-4">Need Help Choosing?</h3>
              <p className="text-white/90 mb-6 text-sm sm:text-base">
                Our financial experts are here to help you choose the right plan for your needs.
              </p>
              <div className="space-y-3 mb-6">
                <div className="flex items-center space-x-3">
                  <FaPhone className="text-sm" />
                  <span className="text-sm sm:text-base">+91 98765 43210</span>
                </div>
                <div className="flex items-center space-x-3">
                  <FaEnvelope className="text-sm" />
                  <span className="text-sm sm:text-base">info@magathi.com</span>
                </div>
              </div>
              <button 
                onClick={handleInvestNow}
                className="w-full sm:w-auto bg-white text-[#53755d] py-3 px-6 rounded-xl font-semibold hover:bg-gray-100 transition-colors duration-300 flex items-center justify-center space-x-2"
              >
                <FaCheckCircle className="h-5 w-5" />
                <span>Invest Now</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default FundDetailsPage;

