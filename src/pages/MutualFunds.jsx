
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaMoneyBillWave, 
  FaPhone,
  FaEnvelope,
  FaBuilding,
  FaUsers,
  FaAward,
  FaClock,
  FaCalculator,
  FaNewspaper,
  FaChartBar,
  FaStar,
  FaArrowRight,
  FaHeartbeat,
  FaShieldAlt,
  FaPiggyBank
} from 'react-icons/fa';
import HeaderNav from '../components/HeaderNav';
import Footer from '../components/Footer';
import FundFilters from '../components/FundFilters';
import FundList from '../components/FundList';
import PlanService from '../services/planService';
import mutualFundImage from '../assets/mutual-fund.jpg';
import coverImage from '../assets/cover.jpg';

const MutualFunds = () => {
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
  const [counterValues, setCounterValues] = useState({
    years: 0,
    assets: 0,
    investors: 0,
    compliance: 0
  });

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

  // Counter animation
  useEffect(() => {
    const targetValues = {
      years: 15,
      assets: 500,
      investors: 50,
      compliance: 100
    };

    const duration = 2;
    const steps = 60;
    const stepDuration = (duration * 1000) / steps;

    let currentStep = 0;
    const counterInterval = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;

      setCounterValues({
        years: Math.floor(targetValues.years * progress),
        assets: Math.floor(targetValues.assets * progress),
        investors: Math.floor(targetValues.investors * progress),
        compliance: Math.floor(targetValues.compliance * progress)
      });

      if (currentStep >= steps) {
        clearInterval(counterInterval);
        setCounterValues(targetValues);
      }
    }, stepDuration);

    return () => clearInterval(counterInterval);
  }, []);

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

  const calculateProjectedReturns = (fund, amount, period) => {
    const monthlyReturn = fund.returns / 12 / 100;
    const futureValue = amount * Math.pow(1 + monthlyReturn, period);
    return Math.round(futureValue);
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
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-green-200 bg-clip-text text-transparent">
              Mutual Funds
            </h1>
            <p className="text-lg md:text-xl text-gray-200 mb-8 leading-relaxed">
              Professional wealth management with government-regulated transparency and compliance
            </p>
            <nav className="flex flex-wrap justify-center items-center space-x-2 md:space-x-3 text-sm md:text-base bg-white/10 backdrop-blur-sm rounded-full px-4 md:px-6 py-2 md:py-3 inline-flex">
              <a href="/" className="hover:text-green-300 transition-colors">Home</a>
              <span className="text-gray-400">/</span>
              <a href="/services" className="hover:text-green-300 transition-colors">Services</a>
              <span className="text-gray-400">/</span>
              <span className="text-green-300 font-medium">Mutual Funds</span>
            </nav>
          </div>
        </div>
      </section>

      {/* About Mutual Funds Section */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Image Section */}
            <div className="order-2 md:order-1">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src={mutualFundImage} 
                  alt="Mutual Funds Investment" 
                  className="w-full h-auto object-cover"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=600&fit=crop';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
            </div>

            {/* Content Section */}
            <div className="order-1 md:order-2">
              <div className="space-y-6">
                <div>
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                    Mutual Funds
                  </h2>
                  <div className="w-20 h-1 bg-gradient-to-r from-[#53755d] to-[#6b8a6f] rounded-full mb-6"></div>
                </div>
                
                <div className="space-y-4 text-gray-700 leading-relaxed">
                  <p className="text-base md:text-lg">
                    Mutual funds are a type of <span className="font-semibold text-gray-900">certified managed combined investment schemes</span> that gathers money from many investors to buy securities. There is no such accurate definition of mutual funds, however the term is most commonly used for collective investment schemes that are regulated and available to the general public and open-ended in nature.
                  </p>
                  
                  <p className="text-base md:text-lg">
                    <span className="font-semibold text-gray-900">Hedge funds are not considered as any type of mutual funds.</span>
                  </p>
                  
                  <p className="text-base md:text-lg">
                    Mutual funds are identified by their principal investments. They are the <span className="font-semibold text-gray-900">4th largest category of funds</span> that are also known as:
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                    <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                      <FaMoneyBillWave className="h-5 w-5 text-[#53755d] mt-1 flex-shrink-0" />
                      <span className="text-sm md:text-base">Money Market Funds</span>
                    </div>
                    <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                      <FaChartBar className="h-5 w-5 text-[#53755d] mt-1 flex-shrink-0" />
                      <span className="text-sm md:text-base">Bond or Fixed Income Funds</span>
                    </div>
                    <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                      <FaStar className="h-5 w-5 text-[#53755d] mt-1 flex-shrink-0" />
                      <span className="text-sm md:text-base">Stock or Equity Funds</span>
                    </div>
                    <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                      <FaAward className="h-5 w-5 text-[#53755d] mt-1 flex-shrink-0" />
                      <span className="text-sm md:text-base">Hybrid Funds</span>
                    </div>
                  </div>
                  
                  <p className="text-base md:text-lg pt-2">
                    Funds are also categorized as <span className="font-semibold text-gray-900">index based</span> or <span className="font-semibold text-gray-900">actively managed</span>.
                  </p>
                </div>
                
                {/* Get Plan Button */}
                <div className="pt-6">
                  <button
                    onClick={() => navigate('/mutual-fund-plan-details')}
                    className="group inline-flex items-center space-x-3 bg-gradient-to-r from-[#53755d] to-[#6b8a6f] text-white px-8 py-4 rounded-xl font-semibold text-base md:text-lg hover:from-[#3e5d49] hover:to-[#53755d] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  >
                    <span>Get Plan</span>
                    <FaArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Other Products Section */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Explore Our Other Products
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-[#53755d] to-[#6b8a6f] rounded-full mx-auto mb-4"></div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover comprehensive financial solutions tailored to protect and grow your wealth
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {/* Health Insurance Policy Card */}
            <div 
              onClick={() => navigate('/health-insurance')}
              className="group bg-white rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer border border-gray-100"
            >
              <div className="flex flex-col h-full">
                {/* Icon */}
                <div className="mb-6">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-[#53755d] to-[#6b8a6f] rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <FaHeartbeat className="w-8 h-8 md:w-10 md:h-10 text-white" />
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 group-hover:text-[#53755d] transition-colors">
                  Health Insurance Policy
                </h3>

                {/* Description */}
                <p className="text-gray-600 text-sm md:text-base mb-6 flex-grow leading-relaxed">
                  Comprehensive health insurance coverage for medical and surgical expenses. Protect yourself and your family with flexible plans designed for your healthcare needs.
                </p>

                {/* Features */}
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center text-sm text-gray-700">
                    <FaStar className="w-4 h-4 text-[#53755d] mr-2 flex-shrink-0" />
                    <span>Cashless hospitalization</span>
                  </li>
                  <li className="flex items-center text-sm text-gray-700">
                    <FaStar className="w-4 h-4 text-[#53755d] mr-2 flex-shrink-0" />
                    <span>Pre & post hospitalization coverage</span>
                  </li>
                  <li className="flex items-center text-sm text-gray-700">
                    <FaStar className="w-4 h-4 text-[#53755d] mr-2 flex-shrink-0" />
                    <span>Family floater plans available</span>
                  </li>
                </ul>

                {/* CTA Button */}
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate('/health-insurance');
                  }}
                  className="w-full mt-auto bg-gradient-to-r from-[#53755d] to-[#6b8a6f] text-white py-3 px-6 rounded-xl font-semibold hover:from-[#3e5d49] hover:to-[#53755d] transition-all duration-300 flex items-center justify-center space-x-2 group-hover:shadow-lg"
                >
                  <span>View Plans</span>
                  <FaArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </button>
              </div>
            </div>

            {/* General Insurance Card */}
            <div 
              onClick={() => navigate('/general-insurance')}
              className="group bg-white rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer border border-gray-100"
            >
              <div className="flex flex-col h-full">
                {/* Icon */}
                <div className="mb-6">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-[#53755d] to-[#6b8a6f] rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <FaShieldAlt className="w-8 h-8 md:w-10 md:h-10 text-white" />
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 group-hover:text-[#53755d] transition-colors">
                  General Insurance
                </h3>

                {/* Description */}
                <p className="text-gray-600 text-sm md:text-base mb-6 flex-grow leading-relaxed">
                  Protect your assets, vehicles, and property with comprehensive general insurance solutions. Get coverage against unforeseen risks and damages.
                </p>

                {/* Features */}
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center text-sm text-gray-700">
                    <FaStar className="w-4 h-4 text-[#53755d] mr-2 flex-shrink-0" />
                    <span>Motor insurance</span>
                  </li>
                  <li className="flex items-center text-sm text-gray-700">
                    <FaStar className="w-4 h-4 text-[#53755d] mr-2 flex-shrink-0" />
                    <span>Home insurance</span>
                  </li>
                  <li className="flex items-center text-sm text-gray-700">
                    <FaStar className="w-4 h-4 text-[#53755d] mr-2 flex-shrink-0" />
                    <span>Travel insurance</span>
                  </li>
                </ul>

                {/* CTA Button */}
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate('/general-insurance');
                  }}
                  className="w-full mt-auto bg-gradient-to-r from-[#53755d] to-[#6b8a6f] text-white py-3 px-6 rounded-xl font-semibold hover:from-[#3e5d49] hover:to-[#53755d] transition-all duration-300 flex items-center justify-center space-x-2 group-hover:shadow-lg"
                >
                  <span>View Plans</span>
                  <FaArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </button>
              </div>
            </div>

            {/* Deposits Card */}
            <div 
              onClick={() => navigate('/deposits')}
              className="group bg-white rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer border border-gray-100 md:col-span-2 lg:col-span-1"
            >
              <div className="flex flex-col h-full">
                {/* Icon */}
                <div className="mb-6">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-[#53755d] to-[#6b8a6f] rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <FaPiggyBank className="w-8 h-8 md:w-10 md:h-10 text-white" />
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 group-hover:text-[#53755d] transition-colors">
                  Deposits
                </h3>

                {/* Description */}
                <p className="text-gray-600 text-sm md:text-base mb-6 flex-grow leading-relaxed">
                  Secure deposit schemes with competitive interest rates and flexible terms. Grow your savings with guaranteed returns and peace of mind.
                </p>

                {/* Features */}
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center text-sm text-gray-700">
                    <FaStar className="w-4 h-4 text-[#53755d] mr-2 flex-shrink-0" />
                    <span>Fixed deposits</span>
                  </li>
                  <li className="flex items-center text-sm text-gray-700">
                    <FaStar className="w-4 h-4 text-[#53755d] mr-2 flex-shrink-0" />
                    <span>Recurring deposits</span>
                  </li>
                  <li className="flex items-center text-sm text-gray-700">
                    <FaStar className="w-4 h-4 text-[#53755d] mr-2 flex-shrink-0" />
                    <span>Tax-saving deposits</span>
                  </li>
                </ul>

                {/* CTA Button */}
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate('/deposits');
                  }}
                  className="w-full mt-auto bg-gradient-to-r from-[#53755d] to-[#6b8a6f] text-white py-3 px-6 rounded-xl font-semibold hover:from-[#3e5d49] hover:to-[#53755d] transition-all duration-300 flex items-center justify-center space-x-2 group-hover:shadow-lg"
                >
                  <span>View Plans</span>
                  <FaArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </button>
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

export default MutualFunds;