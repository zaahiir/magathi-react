import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaPhone,
  FaEnvelope,
  FaBuilding,
  FaCalculator,
  FaNewspaper,
  FaChartBar,
  FaStar
} from 'react-icons/fa';
import HeaderNav from '../components/HeaderNav';
import Footer from '../components/Footer';
import FundFilters from '../components/FundFilters';
import FundList from '../components/FundList';
import PlanService from '../services/planService';
import coverImage from '../assets/cover.jpg';

const MutualFundPlanDetails = () => {
  const navigate = useNavigate();
  const [mutualFunds, setMutualFunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterRisk, setFilterRisk] = useState('All');
  const [sortBy, setSortBy] = useState('returns');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedFund, setSelectedFund] = useState(null);
  const [watchlist, setWatchlist] = useState([]);
  const [compareFunds, setCompareFunds] = useState([]);
  const [showComparison, setShowComparison] = useState(false);
  const [investmentAmount, setInvestmentAmount] = useState(10000);
  const [investmentPeriod, setInvestmentPeriod] = useState(12);
  const [categories, setCategories] = useState([]);
  const [riskLevels, setRiskLevels] = useState([]);
  const [showNews, setShowNews] = useState(false);

  // Market news data
  const marketNews = [
    {
      id: 1,
      title: "Equity Markets Show Strong Recovery in Q4",
      summary: "Indian equity markets have shown remarkable recovery with Nifty 50 gaining 8.5% this quarter.",
      time: "2 hours ago",
      category: "Market Update"
    },
    {
      id: 2,
      title: "RBI Maintains Repo Rate at 6.5%",
      summary: "Reserve Bank of India keeps policy rates unchanged, providing stability to debt funds.",
      time: "4 hours ago",
      category: "Policy Update"
    },
    {
      id: 3,
      title: "New Tax Benefits for Mutual Fund Investors",
      summary: "Government announces additional tax deductions for ELSS investments up to ₹2 lakhs.",
      time: "6 hours ago",
      category: "Tax Update"
    }
  ];

  // Fetch plans from backend
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const filters = {
          category: filterCategory !== 'All' ? filterCategory : undefined,
          riskLevel: filterRisk !== 'All' ? filterRisk : undefined,
          search: searchTerm || undefined,
          sortBy: sortBy
        };
        
        const plansResponse = await PlanService.getAllPlans(filters);
        setMutualFunds(plansResponse.data || []);
        
        const [categoriesResponse, riskLevelsResponse] = await Promise.all([
          PlanService.getPlanCategories(),
          PlanService.getPlanRiskLevels()
        ]);
        
        setCategories(categoriesResponse.data || []);
        setRiskLevels(riskLevelsResponse.data || []);
        
      } catch (error) {
        console.error('Error fetching plans:', error);
        setError('Failed to load plans. Please try again later.');
        setMutualFunds([]);
        setCategories(['Equity', 'Debt', 'Hybrid', 'Large Cap', 'Small Cap', 'Liquid']);
        setRiskLevels(['Very Low', 'Low', 'Medium', 'High', 'Very High']);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, [filterCategory, filterRisk, searchTerm, sortBy]);

  // Filter and sort funds
  const filteredAndSortedFunds = mutualFunds
    .filter(fund => {
      const matchesSearch = fund.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           fund.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory === 'All' || fund.category === filterCategory;
      const matchesRisk = filterRisk === 'All' || fund.riskLevel === filterRisk;
      return matchesSearch && matchesCategory && matchesRisk;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'returns':
          return b.returns - a.returns;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'rating':
          return b.rating - a.rating;
        case 'aum':
          return b.aum - a.aum;
        case 'expense':
          return a.expenseRatio - b.expenseRatio;
        default:
          return 0;
      }
    });

  const toggleWatchlist = (fundId) => {
    setWatchlist(prev => 
      prev.includes(fundId) 
        ? prev.filter(id => id !== fundId)
        : [...prev, fundId]
    );
  };

  const toggleComparison = (fundId) => {
    if (compareFunds.includes(fundId)) {
      setCompareFunds(prev => prev.filter(id => id !== fundId));
    } else if (compareFunds.length < 3) {
      setCompareFunds(prev => [...prev, fundId]);
    }
  };

  const getRiskColor = (riskLevel) => {
    switch (riskLevel) {
      case 'Very Low':
        return 'bg-green-100 text-green-800';
      case 'Low':
        return 'bg-blue-100 text-blue-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'High':
        return 'bg-orange-100 text-orange-800';
      case 'Very High':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleViewDetails = (fund) => {
    navigate(`/fund-details/${fund._id}`);
  };

  const handleInvestNow = (fund) => {
    navigate(`/invest/${fund._id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Header Navigation */}
      <HeaderNav />

      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden" style={{ backgroundImage: `url(${coverImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30"></div>
        <div className="relative z-10 container mx-auto px-4">
          <div className="text-center text-white max-w-4xl mx-auto">
            <h1 className="mt-5 text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-green-200 bg-clip-text text-transparent">
              Mutual Funds Plan Details
            </h1>
            {/* <p className="text-lg md:text-xl text-gray-200 mb-8 leading-relaxed">
              Professional wealth management with government-regulated transparency and compliance
            </p> */}
            <nav className="flex flex-wrap justify-center items-center space-x-2 md:space-x-3 text-sm md:text-base bg-white/10 backdrop-blur-sm rounded-full px-4 md:px-6 py-2 md:py-3 inline-flex">
              <a href="/" className="hover:text-green-300 transition-colors">Home</a>
              <span className="text-gray-400">/</span>
              <a href="/services" className="hover:text-green-300 transition-colors">Services</a>
              <span className="text-gray-400">/</span>
              <span className="text-green-300 font-medium">Mutual Funds Plan Details</span>
            </nav>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8 md:gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Search and Filter Controls */}
              <FundFilters
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                filterCategory={filterCategory}
                setFilterCategory={setFilterCategory}
                filterRisk={filterRisk}
                setFilterRisk={setFilterRisk}
                sortBy={sortBy}
                setSortBy={setSortBy}
                viewMode={viewMode}
                setViewMode={setViewMode}
                categories={categories}
                riskLevels={riskLevels}
                filteredCount={filteredAndSortedFunds.length}
                totalCount={mutualFunds.length}
                watchlistCount={watchlist.length}
              />

            

              {/* Market News Panel */}
              {showNews && (
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <FaNewspaper className="h-5 w-5 mr-2 text-[#53755d]" />
                    Market News & Updates
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {marketNews.map(news => (
                      <div key={news.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-xs text-[#53755d] bg-[#53755d]/10 px-2 py-1 rounded-full">
                            {news.category}
                          </span>
                          <span className="text-xs text-gray-500">{news.time}</span>
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2">{news.title}</h3>
                        <p className="text-sm text-gray-600">{news.summary}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Fund Comparison Panel */}
              {showComparison && (
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <FaChartBar className="h-5 w-5 mr-2 text-[#53755d]" />
                    Fund Comparison
                    {compareFunds.length > 0 && (
                      <span className="ml-2 text-sm text-gray-500">({compareFunds.length}/3 selected)</span>
                    )}
                  </h2>
                  {compareFunds.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">Select up to 3 funds to compare</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-2">Fund Name</th>
                            <th className="text-left py-2">Category</th>
                            <th className="text-left py-2">Returns</th>
                            <th className="text-left py-2">Risk</th>
                            <th className="text-left py-2">Rating</th>
                            <th className="text-left py-2">Expense Ratio</th>
                            <th className="text-left py-2">Min Investment</th>
                          </tr>
                        </thead>
                        <tbody>
                          {compareFunds.map(fundId => {
                            const fund = mutualFunds.find(f => f._id === fundId);
                            return (
                              <tr key={fundId} className="border-b">
                                <td className="py-2 font-medium">{fund?.name}</td>
                                <td className="py-2">{fund?.category}</td>
                                <td className="py-2 text-green-600 font-semibold">{fund?.returns}%</td>
                                <td className="py-2">
                                  <span className={`px-2 py-1 rounded-full text-xs ${getRiskColor(fund?.riskLevel)}`}>
                                    {fund?.riskLevel}
                                  </span>
                                </td>
                                <td className="py-2 flex items-center">
                                  <FaStar className="h-4 w-4 text-yellow-400 mr-1" />
                                  {fund?.rating}
                                </td>
                                <td className="py-2">{fund?.expenseRatio}%</td>
                                <td className="py-2">₹{fund?.minInvestment?.toLocaleString()}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* Loading State */}
              {loading && (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#53755d]"></div>
                  <span className="ml-3 text-gray-600">Loading plans...</span>
                </div>
              )}

              {/* Error State */}
              {error && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-yellow-800">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Mutual Funds Grid/List */}
              {!loading && (
                <FundList
                  funds={filteredAndSortedFunds}
                  viewMode={viewMode}
                  selectedFund={selectedFund}
                  watchlist={watchlist}
                  compareFunds={compareFunds}
                  investmentAmount={investmentAmount}
                  investmentPeriod={investmentPeriod}
                  onToggleWatchlist={toggleWatchlist}
                  onToggleComparison={toggleComparison}
                  onViewDetails={handleViewDetails}
                  onInvestNow={handleInvestNow}
                  onSelectFund={setSelectedFund}
                />
              )}
            </div>

            {/* Right Sidebar */}
            <div className="lg:col-span-1">
              <div className="space-y-6">
                {/* Quick Actions */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h4 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h4>
                  <div className="space-y-3">
                    <button
                      onClick={() => setShowNews(!showNews)}
                      className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                        showNews ? 'bg-[#53755d] text-white' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <FaNewspaper className="h-5 w-5" />
                      <span>Market News</span>
                    </button>
                    <button
                      onClick={() => setShowComparison(!showComparison)}
                      className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                        showComparison ? 'bg-[#53755d] text-white' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <FaChartBar className="h-5 w-5" />
                      <span>Compare Funds</span>
                    </button>
                    <button
                      onClick={() => setSelectedFund(null)}
                      className="w-full flex items-center space-x-3 p-3 rounded-lg bg-gray-50 text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <FaCalculator className="h-5 w-5" />
                      <span>Reset Calculator</span>
                    </button>
                  </div>
                </div>

                {/* Quick Contact */}
                <div className="bg-gradient-to-br from-[#53755d] to-[#6b8a6f] rounded-2xl p-6 text-white">
                  <h4 className="text-lg font-bold mb-4">Need Help Choosing?</h4>
                  <p className="text-white/80 text-sm mb-6">
                    Our financial experts are here to help you choose the right plan for your needs.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <FaPhone className="text-sm" />
                      <span className="text-sm">+91 98765 43210</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <FaEnvelope className="text-sm" />
                      <span className="text-sm">info@magathi.com</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <FaBuilding className="text-sm" />
                      <span className="text-sm">SEBI Reg. No: INH000012345</span>
                    </div>
                  </div>
                  <button className="w-full mt-6 bg-white text-[#53755d] py-3 px-4 rounded-xl font-semibold hover:bg-gray-100 transition-colors duration-300">
                    Get Expert Consultation
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default MutualFundPlanDetails;

