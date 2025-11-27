import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHeart, FaShieldAlt, FaHospital, FaUserMd, FaPhone, FaCheckCircle, FaStar, FaSearch, FaFilter, FaUser, FaUsers, FaPlus, FaMinus, FaMoneyBillWave, FaChartBar, FaAward, FaArrowRight, FaHeartbeat, FaPiggyBank } from 'react-icons/fa';
import HealthInsuranceService from '../services/healthInsuranceService';
import HeaderNav from '../components/HeaderNav';
import Footer from '../components/Footer';
import PlanDetailsModal from '../components/PlanDetailsModal';
import healthInsuranceImage from '../assets/health-insurance.jpg';
import coverImage from '../assets/cover.jpg';


const HealthInsurance = () => {
  const navigate = useNavigate();
  const [policies, setPolicies] = useState([]);
  const [filteredPolicies, setFilteredPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedCoverage, setSelectedCoverage] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  // Self/Family selection state
  const [policyType, setPolicyType] = useState('self');
  const [selfDetails, setSelfDetails] = useState({
    name: '',
    age: '',
    mobile: '',
    email: '',
    coverageAmount: '',
    medicalHistory: ''
  });
  const [familyMembers, setFamilyMembers] = useState([
    { name: '', age: '', relationship: '', mobile: '' }
  ]);
  const [showPlanDetails, setShowPlanDetails] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState(null);

  const policyTypes = ['All', 'Individual', 'Family', 'Group', 'Senior Citizen', 'Maternity', 'Critical Illness'];
  const coverageRanges = ['All', '0-5L', '5L-10L', '10L-25L', '25L-50L', '50L+'];

  useEffect(() => {
    fetchPolicies();
  }, []);

  useEffect(() => {
    if (policies.length > 0 || searchTerm || selectedType || selectedCoverage) {
      filterPolicies();
    } else {
      setFilteredPolicies(policies);
    }
  }, [policies, searchTerm, selectedType, selectedCoverage]);

  const fetchPolicies = async () => {
    try {
      setLoading(true);
      const response = await HealthInsuranceService.getAllPolicies();
      console.log('API Response:', response);
      
      // Extract policies from response - handle different response structures
      let policiesData = [];
      if (response) {
        // Standard structure: { data: { policies: [...] } }
        if (response.data?.policies && Array.isArray(response.data.policies)) {
          policiesData = response.data.policies;
        }
        // Alternative: { data: [...] } (array directly)
        else if (Array.isArray(response.data)) {
          policiesData = response.data;
        }
        // Alternative: { policies: [...] }
        else if (Array.isArray(response.policies)) {
          policiesData = response.policies;
        }
        // Direct array response
        else if (Array.isArray(response)) {
          policiesData = response;
        }
      }
      
      console.log('Policies data:', policiesData);
      console.log('Number of policies:', policiesData.length);
      setPolicies(policiesData);
      // Initialize filteredPolicies with all policies
      setFilteredPolicies(policiesData);
    } catch (error) {
      console.error('Error fetching health insurance policies:', error);
      setPolicies([]);
      setFilteredPolicies([]);
    } finally {
      setLoading(false);
    }
  };

  const filterPolicies = () => {
    let filtered = policies;

    if (searchTerm) {
      filtered = filtered.filter(policy =>
        policy.policyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        policy.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        policy.provider?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedType && selectedType !== 'All') {
      filtered = filtered.filter(policy => policy.policyType === selectedType);
    }

    if (selectedCoverage && selectedCoverage !== 'All') {
      filtered = filtered.filter(policy => {
        const coverage = policy.coverageAmount;
        switch (selectedCoverage) {
          case '0-5L':
            return coverage >= 0 && coverage <= 500000;
          case '5L-10L':
            return coverage > 500000 && coverage <= 1000000;
          case '10L-25L':
            return coverage > 1000000 && coverage <= 2500000;
          case '25L-50L':
            return coverage > 2500000 && coverage <= 5000000;
          case '50L+':
            return coverage > 5000000;
          default:
            return true;
        }
      });
    }

    setFilteredPolicies(filtered);
  };

  const handleInquiry = async (policyId) => {
    try {
      await HealthInsuranceService.incrementInquiry(policyId);
      alert('Thank you for your interest! We will contact you soon.');
    } catch (error) {
      console.error('Error submitting inquiry:', error);
      alert('Error submitting inquiry. Please try again.');
    }
  };

  const handleViewDetails = (policy) => {
    setSelectedPolicy(policy);
    setShowPlanDetails(true);
  };

  const getCoverageRange = (amount) => {
    if (amount >= 0 && amount <= 500000) return '0-5L';
    if (amount > 500000 && amount <= 1000000) return '5L-10L';
    if (amount > 1000000 && amount <= 2500000) return '10L-25L';
    if (amount > 2500000 && amount <= 5000000) return '25L-50L';
    return '50L+';
  };

  // Handle self details form
  const handleSelfDetailsChange = (field, value) => {
    setSelfDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle family member changes
  const handleFamilyMemberChange = (index, field, value) => {
    setFamilyMembers(prev => prev.map((member, i) => 
      i === index ? { ...member, [field]: value } : member
    ));
  };

  // Add new family member
  const addFamilyMember = () => {
    setFamilyMembers(prev => [...prev, { name: '', age: '', relationship: '', mobile: '' }]);
  };

  // Remove family member
  const removeFamilyMember = (index) => {
    if (familyMembers.length > 1) {
      setFamilyMembers(prev => prev.filter((_, i) => i !== index));
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <FaStar
        key={index}
        className={`h-4 w-4 ${index < rating ? 'text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Navigation */}
      <HeaderNav />
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden" style={{ backgroundImage: `url(${coverImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30"></div>
        <div className="relative z-10 container mx-auto px-4">
          <div className="text-center text-white max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-green-200 bg-clip-text text-transparent">
              Health Insurance
            </h1>
            <p className="text-lg md:text-xl text-gray-200 mb-8 leading-relaxed">
              Comprehensive health coverage for you and your family
            </p>
            <nav className="flex flex-wrap justify-center items-center space-x-2 md:space-x-3 text-sm md:text-base bg-white/10 backdrop-blur-sm rounded-full px-4 md:px-6 py-2 md:py-3 inline-flex">
              <a href="/" className="hover:text-green-300 transition-colors">Home</a>
              <span className="text-gray-400">/</span>
              <a href="/services" className="hover:text-green-300 transition-colors">Services</a>
              <span className="text-gray-400">/</span>
              <span className="text-green-300 font-medium">Health Insurance</span>
            </nav>
          </div>
        </div>
      </section>

      {/* About Health Insurance Section */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Image Section */}
            <div className="order-2 md:order-1">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src={healthInsuranceImage}
                  alt="Health Insurance Coverage" 
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
                    Health Insurance Policy
                  </h2>
                  <div className="w-20 h-1 bg-gradient-to-r from-[#53755d] to-[#6b8a6f] rounded-full mb-6"></div>
                </div>
                
                <div className="space-y-4 text-gray-700 leading-relaxed">
                  <p className="text-base md:text-lg">
                    Health insurance plans <span className="font-semibold text-gray-900">reimburse insured customers for their medical expenses</span>, including treatments, surgeries, hospitalization and the like which arise from injuries/illnesses, or directly pay out a certain pre-determined sum to the customer. A health insurance policy offers coverage for any future medical expenses of the customer.
                  </p>
                  
                  <p className="text-base md:text-lg">
                    This is an <span className="font-semibold text-gray-900">agreement between the insurance company and the customer</span> where the former agrees to guarantee payment/compensation for medical costs in case the latter is injured/ill in the future, leading to hospitalization. In most cases, insurance companies have tie-ups with a network of hospitals, thereby ensuring <span className="font-semibold text-gray-900">cashless treatment for patients</span> there.
                  </p>
                </div>
                
                {/* Get Plan Button */}
                <div className="pt-6">
                  <button
                    onClick={() => navigate('/health-insurance-details')}
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
            {/* Mutual Fund Card */}
            <div 
              onClick={() => navigate('/mutual-funds')}
              className="group bg-white rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer border border-gray-100"
            >
              <div className="flex flex-col h-full">
                {/* Icon */}
                <div className="mb-6">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-[#53755d] to-[#6b8a6f] rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <FaChartBar className="w-8 h-8 md:w-10 md:h-10 text-white" />
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 group-hover:text-[#53755d] transition-colors">
                  Mutual Funds
                </h3>

                {/* Description */}
                <p className="text-gray-600 text-sm md:text-base mb-6 flex-grow leading-relaxed">
                  Invest in professionally managed portfolios with diversified assets. Build wealth over time with equity, debt, and hybrid mutual fund schemes tailored to your financial goals.
                </p>

                {/* Features */}
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center text-sm text-gray-700">
                    <FaStar className="w-4 h-4 text-[#53755d] mr-2 flex-shrink-0" />
                    <span>Diversified portfolio management</span>
                  </li>
                  <li className="flex items-center text-sm text-gray-700">
                    <FaStar className="w-4 h-4 text-[#53755d] mr-2 flex-shrink-0" />
                    <span>SIP and lump sum investment options</span>
                  </li>
                  <li className="flex items-center text-sm text-gray-700">
                    <FaStar className="w-4 h-4 text-[#53755d] mr-2 flex-shrink-0" />
                    <span>Tax-saving ELSS funds available</span>
                  </li>
                </ul>

                {/* CTA Button */}
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate('/mutual-funds');
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
      <Footer />
    </div>
  );
};

export default HealthInsurance;