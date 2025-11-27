import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaUsers, FaPlus, FaMinus, FaHeart, FaShieldAlt, FaHospital, FaPhone, FaCheckCircle, FaStar, FaSearch, FaFilter } from 'react-icons/fa';
import HealthInsuranceService from '../services/healthInsuranceService';
import HeaderNav from '../components/HeaderNav';
import Footer from '../components/Footer';
import PlanDetailsModal from '../components/PlanDetailsModal';
import coverImage from '../assets/cover.jpg';

const HealthInsuranceDetails = () => {
  const navigate = useNavigate();
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

  // Policies state
  const [policies, setPolicies] = useState([]);
  const [filteredPolicies, setFilteredPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedCoverage, setSelectedCoverage] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showPlanDetails, setShowPlanDetails] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState(null);

  const policyTypes = ['All', 'Individual', 'Family', 'Group', 'Senior Citizen', 'Maternity', 'Critical Illness'];
  const coverageRanges = ['All', '0-5L', '5L-10L', '10L-25L', '25L-50L', '50L+'];

  useEffect(() => {
    fetchPolicies();
  }, []);

  useEffect(() => {
    filterPolicies();
  }, [policies, searchTerm, selectedType, selectedCoverage]);

  const fetchPolicies = async () => {
    try {
      setLoading(true);
      const response = await HealthInsuranceService.getAllPolicies();
      setPolicies(response.data.policies || []);
    } catch (error) {
      console.error('Error fetching health insurance policies:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterPolicies = () => {
    let filtered = policies;

    if (searchTerm) {
      filtered = filtered.filter(policy =>
        policy.policyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        policy.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        policy.provider?.name.toLowerCase().includes(searchTerm.toLowerCase())
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

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <FaStar
        key={index}
        className={`h-4 w-4 ${index < rating ? 'text-yellow-400' : 'text-gray-300'}`}
      />
    ));
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

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Form submitted:', { policyType, selfDetails, familyMembers });
    alert('Thank you for your interest! We will contact you soon with a personalized quote.');
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
              Health Insurance Details
            </h1>
            <p className="text-lg md:text-xl text-gray-200 mb-8 leading-relaxed">
              Get a personalized health insurance quote tailored to your needs
            </p>
            <nav className="flex flex-wrap justify-center items-center space-x-2 md:space-x-3 text-sm md:text-base bg-white/10 backdrop-blur-sm rounded-full px-4 md:px-6 py-2 md:py-3 inline-flex">
              <a href="/" className="hover:text-green-300 transition-colors">Home</a>
              <span className="text-gray-400">/</span>
              <a href="/services" className="hover:text-green-300 transition-colors">Services</a>
              <span className="text-gray-400">/</span>
              <a href="/health-insurance" className="hover:text-green-300 transition-colors">Health Insurance</a>
              <span className="text-gray-400">/</span>
              <span className="text-green-300 font-medium">Get Quote</span>
            </nav>
          </div>
        </div>
      </section>

      {/* Policy Type Selection & Form Section */}
      <div id="coverage-section" className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Policy Type Selection */}
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Coverage</h2>
              <p className="text-lg text-gray-600 mb-8">Select whether you need coverage for yourself or your family</p>
              
              <div className="flex justify-center">
                <div className="bg-gray-100 rounded-2xl p-2 inline-flex">
                  <button
                    onClick={() => setPolicyType('self')}
                    className={`flex items-center gap-3 px-8 py-4 rounded-xl font-semibold transition-all duration-300 ${
                      policyType === 'self'
                        ? 'bg-[#53755d] text-white shadow-lg'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <FaUser className="h-5 w-5" />
                    Self Coverage
                  </button>
                  <button
                    onClick={() => setPolicyType('family')}
                    className={`flex items-center gap-3 px-8 py-4 rounded-xl font-semibold transition-all duration-300 ${
                      policyType === 'family'
                        ? 'bg-[#53755d] text-white shadow-lg'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <FaUsers className="h-5 w-5" />
                    Family Coverage
                  </button>
                </div>
              </div>
            </div>

            {/* Dynamic Form Section */}
            <form onSubmit={handleSubmit} className="bg-gray-50 rounded-2xl p-8 shadow-sm">
              {policyType === 'self' ? (
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <FaUser className="h-6 w-6 text-[#53755d]" />
                    Personal Details
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                      <input
                        type="text"
                        value={selfDetails.name}
                        onChange={(e) => handleSelfDetailsChange('name', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#53755d] focus:border-transparent"
                        placeholder="Enter your full name"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Age</label>
                      <input
                        type="number"
                        value={selfDetails.age}
                        onChange={(e) => handleSelfDetailsChange('age', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#53755d] focus:border-transparent"
                        placeholder="Enter your age"
                        min="18"
                        max="80"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Mobile Number</label>
                      <input
                        type="tel"
                        value={selfDetails.mobile}
                        onChange={(e) => handleSelfDetailsChange('mobile', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#53755d] focus:border-transparent"
                        placeholder="Enter mobile number"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                      <input
                        type="email"
                        value={selfDetails.email}
                        onChange={(e) => handleSelfDetailsChange('email', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#53755d] focus:border-transparent"
                        placeholder="Enter email address"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Coverage Amount (₹)</label>
                      <select
                        value={selfDetails.coverageAmount}
                        onChange={(e) => handleSelfDetailsChange('coverageAmount', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#53755d] focus:border-transparent"
                      >
                        <option value="">Select coverage amount</option>
                        <option value="500000">₹5 Lakhs</option>
                        <option value="1000000">₹10 Lakhs</option>
                        <option value="2500000">₹25 Lakhs</option>
                        <option value="5000000">₹50 Lakhs</option>
                        <option value="10000000">₹1 Crore</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Medical History</label>
                      <select
                        value={selfDetails.medicalHistory}
                        onChange={(e) => handleSelfDetailsChange('medicalHistory', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#53755d] focus:border-transparent"
                      >
                        <option value="">Select medical history</option>
                        <option value="none">No medical history</option>
                        <option value="minor">Minor conditions</option>
                        <option value="major">Major conditions</option>
                        <option value="pre-existing">Pre-existing conditions</option>
                      </select>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                      <FaUsers className="h-6 w-6 text-[#53755d]" />
                      Family Member Details
                    </h3>
                    <button
                      onClick={addFamilyMember}
                      className="bg-[#53755d] text-white px-4 py-2 rounded-lg hover:bg-[#4a6b52] transition-colors flex items-center gap-2"
                    >
                      <FaPlus className="h-4 w-4" />
                      Add Member
                    </button>
                  </div>
                  
                  <div className="space-y-6">
                    {familyMembers.map((member, index) => (
                      <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="text-lg font-semibold text-gray-900">Family Member {index + 1}</h4>
                          {familyMembers.length > 1 && (
                            <button
                              onClick={() => removeFamilyMember(index)}
                              className="text-red-500 hover:text-red-700 p-2"
                            >
                              <FaMinus className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Name</label>
                            <input
                              type="text"
                              value={member.name}
                              onChange={(e) => handleFamilyMemberChange(index, 'name', e.target.value)}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#53755d] focus:border-transparent"
                              placeholder="Enter member name"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Age</label>
                            <input
                              type="number"
                              value={member.age}
                              onChange={(e) => handleFamilyMemberChange(index, 'age', e.target.value)}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#53755d] focus:border-transparent"
                              placeholder="Enter age"
                              min="0"
                              max="80"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Relationship</label>
                            <select
                              value={member.relationship}
                              onChange={(e) => handleFamilyMemberChange(index, 'relationship', e.target.value)}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#53755d] focus:border-transparent"
                            >
                              <option value="">Select relationship</option>
                              <option value="spouse">Spouse</option>
                              <option value="child">Child</option>
                              <option value="parent">Parent</option>
                              <option value="sibling">Sibling</option>
                              <option value="other">Other</option>
                            </select>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Mobile Number</label>
                            <input
                              type="tel"
                              value={member.mobile}
                              onChange={(e) => handleFamilyMemberChange(index, 'mobile', e.target.value)}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#53755d] focus:border-transparent"
                              placeholder="Enter mobile number"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="mt-8 flex justify-center">
                <button 
                  type="submit"
                  className="bg-[#53755d] text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-[#4a6b52] transition-colors shadow-lg"
                >
                  Get Personalized Quote
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search health insurance policies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#53755d] focus:border-transparent text-lg"
              />
            </div>
            
            <div className="flex gap-4">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-6 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#53755d] focus:border-transparent text-lg min-w-[150px]"
              >
                {policyTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              
              <select
                value={selectedCoverage}
                onChange={(e) => setSelectedCoverage(e.target.value)}
                className="px-6 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#53755d] focus:border-transparent text-lg min-w-[150px]"
              >
                {coverageRanges.map(range => (
                  <option key={range} value={range}>{range}</option>
                ))}
              </select>
              
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-6 py-4 bg-[#53755d] text-white rounded-xl hover:bg-[#4a6b52] transition-colors flex items-center gap-2 font-semibold"
              >
                <FaFilter className="h-4 w-4" />
                Filters
              </button>
            </div>
          </div>
          
          {(searchTerm || selectedType !== '' || selectedCoverage !== '') && (
            <div className="mt-6 flex justify-between items-center bg-gray-50 rounded-xl p-4">
              <p className="text-sm text-gray-600 font-medium">
                Showing {filteredPolicies.length} of {policies.length} policies
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedType('');
                  setSelectedCoverage('');
                }}
                className="text-[#53755d] hover:text-[#4a6b52] font-semibold px-4 py-2 rounded-lg hover:bg-[#f0f4f0] transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>

        {/* Policies Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#53755d]"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPolicies.map((policy) => (
              <div key={policy._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:border-[#53755d]/20 transition-all duration-300 group flex flex-col h-full">
                {/* Policy Header */}
                <div className="bg-gradient-to-br from-[#53755d] to-[#3d5a45] p-4 text-white relative">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -translate-y-12 translate-x-12"></div>
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 pr-3">
                        <div className="flex items-center gap-1.5 mb-1">
                          <FaShieldAlt className="h-4 w-4 text-white/80" />
                          <span className="text-[10px] font-medium text-white/80 uppercase tracking-wide">{policy.provider?.name || 'Insurance Provider'}</span>
                        </div>
                        <h3 className="text-lg font-bold leading-tight">{policy.policyName}</h3>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-2 border-t border-white/20">
                      <div>
                        <div className="text-2xl font-bold">₹{(policy.coverageAmount / 100000).toFixed(0)}L</div>
                        <div className="text-[10px] text-white/70 font-medium">Sum Insured</div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-0.5 mb-0.5">
                          {renderStars(policy.rating || 3)}
                        </div>
                        <div className="text-[10px] text-white/70">({policy.reviews?.length || 0})</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Policy Details */}
                <div className="p-4 flex flex-col flex-grow">
                  <div className="flex-grow space-y-3">
                    {/* Key Metrics */}
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-100 rounded-lg p-3">
                        <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-1">Premium</div>
                        <div className="text-lg font-bold text-gray-900">₹{policy.premium?.toLocaleString() || 'N/A'}</div>
                        <div className="text-[10px] text-gray-500">per year</div>
                      </div>
                      
                      <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-100 rounded-lg p-3">
                        <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-1">Duration</div>
                        <div className="text-lg font-bold text-gray-900">{policy.duration || 'N/A'}</div>
                        <div className="text-[10px] text-gray-500">years</div>
                      </div>
                    </div>
                    
                    {/* Additional Info */}
                    <div className="grid grid-cols-2 gap-2">
                      <div className="border-l-2 border-[#53755d] pl-2">
                        <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-0.5">Age Limit</div>
                        <div className="text-sm font-semibold text-gray-900">
                          {policy.ageLimit?.min || 'N/A'}-{policy.ageLimit?.max || 'N/A'} yrs
                        </div>
                      </div>
                      
                      <div className="border-l-2 border-[#53755d] pl-2">
                        <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-0.5">Hospitals</div>
                        <div className="text-sm font-semibold text-gray-900">{policy.networkHospitals?.toLocaleString() || 'N/A'}+</div>
                      </div>
                    </div>

                    {/* Policy Type Badge & Coverage Features */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-semibold bg-[#53755d]/10 text-[#53755d] border border-[#53755d]/20">
                          {policy.policyType}
                        </span>
                      </div>

                      {/* Coverage Features */}
                      {(policy.preExistingDiseaseCoverage || policy.maternityCoverage || policy.criticalIllnessCoverage || policy.accidentalCoverage) && (
                        <div className="flex flex-wrap gap-1.5">
                          {policy.preExistingDiseaseCoverage && (
                            <div className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-50 text-emerald-700 rounded-md text-[10px] font-medium border border-emerald-100">
                              <FaCheckCircle className="h-2.5 w-2.5" />
                              Pre-existing
                            </div>
                          )}
                          {policy.maternityCoverage && (
                            <div className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-50 text-emerald-700 rounded-md text-[10px] font-medium border border-emerald-100">
                              <FaCheckCircle className="h-2.5 w-2.5" />
                              Maternity
                            </div>
                          )}
                          {policy.criticalIllnessCoverage && (
                            <div className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-50 text-emerald-700 rounded-md text-[10px] font-medium border border-emerald-100">
                              <FaCheckCircle className="h-2.5 w-2.5" />
                              Critical
                            </div>
                          )}
                          {policy.accidentalCoverage && (
                            <div className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-50 text-emerald-700 rounded-md text-[10px] font-medium border border-emerald-100">
                              <FaCheckCircle className="h-2.5 w-2.5" />
                              Accidental
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-4 pt-3 border-t border-gray-100 space-y-2">
                    <button
                      onClick={() => handleInquiry(policy._id)}
                      className="w-full bg-gradient-to-r from-[#53755d] to-[#4a6b52] text-white py-2 px-4 rounded-lg hover:from-[#4a6b52] hover:to-[#3d5a45] transition-all duration-200 font-semibold text-sm shadow-md hover:shadow-lg"
                    >
                      Get Quote
                    </button>
                    <button 
                      onClick={() => handleViewDetails(policy)}
                      className="w-full border-2 border-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:border-[#53755d] hover:text-[#53755d] hover:bg-[#53755d]/5 transition-all duration-200 font-semibold text-sm"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Results */}
        {!loading && filteredPolicies.length === 0 && (
          <div className="text-center py-16">
            <div className="bg-white rounded-2xl shadow-xl p-12 max-w-md mx-auto">
              <FaSearch className="h-20 w-20 text-gray-300 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-gray-900 mb-3">No policies found</h3>
              <p className="text-gray-600 mb-8 text-lg">Try adjusting your search criteria or filters</p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedType('');
                  setSelectedCoverage('');
                }}
                className="bg-[#53755d] text-white px-8 py-4 rounded-xl hover:bg-[#4a6b52] transition-colors font-bold text-lg shadow-lg"
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Contact Section */}
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">Need Help Choosing?</h2>
            <p className="text-xl mb-12 opacity-90 leading-relaxed">
              Our health insurance experts are here to help you find the perfect policy for your needs
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button className="bg-[#53755d] text-white px-10 py-4 rounded-xl hover:bg-[#4a6b52] transition-colors font-bold text-lg flex items-center justify-center gap-3 shadow-xl hover:shadow-2xl">
                <FaPhone className="h-5 w-5" />
                Call Now
              </button>
              <button className="border-2 border-white text-white px-10 py-4 rounded-xl hover:bg-white hover:text-gray-900 transition-colors font-bold text-lg shadow-xl hover:shadow-2xl">
                Get Free Consultation
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Plan Details Modal */}
      <PlanDetailsModal
        isOpen={showPlanDetails}
        onClose={() => setShowPlanDetails(false)}
        plan={selectedPolicy}
        planType="health-insurance"
      />

      <Footer />
    </div>
  );
};

export default HealthInsuranceDetails;

