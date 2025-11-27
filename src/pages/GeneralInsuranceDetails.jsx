import React, { useState } from 'react';
import { 
  FaShieldAlt, 
  FaCheckCircle, 
  FaArrowRight, 
  FaPlus, 
  FaTimes,
  FaUser,
  FaUsers,
  FaEye,
  FaArrowLeft,
  FaArrowRight as FaArrowForward,
  FaRupeeSign
} from 'react-icons/fa';
import HeaderNav from '../components/HeaderNav';
import Footer from '../components/Footer';
import PlanDetailsModal from '../components/PlanDetailsModal';
import coverImage from '../assets/cover.jpg';

const GeneralInsuranceDetails = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [policyType, setPolicyType] = useState('individual');
  const [showPlanDetails, setShowPlanDetails] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const [premiumType, setPremiumType] = useState('annual'); // 'monthly' or 'annual'
  const [formData, setFormData] = useState({
    fullName: '',
    age: '',
    gender: '',
    mobile: '',
    email: '',
    insuranceAmount: '',
    policyDuration: '',
    addOns: []
  });
  const [familyMembers, setFamilyMembers] = useState([
    { name: '', age: '', relationship: '' }
  ]);
  const [formErrors, setFormErrors] = useState({});

  const steps = [
    { id: 1, title: 'Select Type', description: 'Choose Individual or Family' },
    { id: 2, title: 'Choose Plan', description: 'Select insurance plan' },
    { id: 3, title: 'Enter Details', description: 'Fill in your information' },
    { id: 4, title: 'Review & Pay', description: 'Review and purchase' }
  ];

  const insurancePlans = [
    {
      id: 'basic',
      name: 'Basic Plan',
      coverage: 500000,
      monthlyPremium: 2500,
      annualPremium: 25000,
      duration: '1 Year',
      benefits: [
        'Third-party liability coverage',
        'Basic medical expenses',
        'Personal accident cover',
        '24/7 customer support'
      ],
      description: 'Essential coverage for basic protection needs',
      features: [
        'Third-party liability up to ₹5,00,000',
        'Medical expenses up to ₹50,000',
        'Personal accident cover ₹2,00,000',
        '24/7 emergency assistance',
        'Quick claim settlement'
      ],
      terms: [
        'Minimum age: 18 years',
        'Maximum age: 65 years',
        'No pre-existing conditions',
        '30-day waiting period'
      ],
      addOns: ['roadside', 'rental']
    },
    {
      id: 'comprehensive',
      name: 'Comprehensive Plan',
      coverage: 1000000,
      monthlyPremium: 4500,
      annualPremium: 45000,
      duration: '1 Year',
      benefits: [
        'Comprehensive coverage',
        'Higher medical expenses',
        'Property damage protection',
        'Travel assistance'
      ],
      description: 'Complete protection with enhanced benefits',
      features: [
        'Third-party liability up to ₹10,00,000',
        'Medical expenses up to ₹1,00,000',
        'Property damage up to ₹2,00,000',
        'Travel assistance worldwide',
        'Zero depreciation cover',
        'Emergency accommodation'
      ],
      terms: [
        'Minimum age: 18 years',
        'Maximum age: 70 years',
        'Pre-existing conditions covered after 2 years',
        '15-day waiting period'
      ],
      addOns: ['roadside', 'rental', 'engine']
    },
    {
      id: 'premium',
      name: 'Premium Plan',
      coverage: 2500000,
      monthlyPremium: 8500,
      annualPremium: 85000,
      duration: '1 Year',
      benefits: [
        'Maximum coverage',
        'Premium medical benefits',
        'Global coverage',
        'Concierge services'
      ],
      description: 'Ultimate protection with premium services',
      features: [
        'Third-party liability up to ₹25,00,000',
        'Medical expenses up to ₹5,00,000',
        'Global coverage',
        'Concierge services',
        'Cashless treatment',
        'Annual health checkup',
        'Priority claim settlement'
      ],
      terms: [
        'Minimum age: 18 years',
        'Maximum age: 75 years',
        'All pre-existing conditions covered',
        'No waiting period'
      ],
      addOns: ['roadside', 'rental', 'engine', 'zero']
    }
  ];

  const addOns = [
    { id: 'roadside', name: 'Roadside Assistance', price: 500 },
    { id: 'rental', name: 'Rental Car Coverage', price: 800 },
    { id: 'engine', name: 'Engine Protection', price: 1200 },
    { id: 'zero', name: 'Zero Depreciation', price: 1500 }
  ];

  // Premium calculation function
  const calculatePremium = () => {
    if (!selectedPlanId) return 0;
    
    const plan = insurancePlans.find(p => p.id === selectedPlanId);
    if (!plan) return 0;

    let basePremium = premiumType === 'monthly' ? plan.monthlyPremium : plan.annualPremium;
    
    // Apply family multiplier
    if (policyType === 'family') {
      const memberCount = familyMembers.filter(m => m.name && m.age).length;
      basePremium = basePremium * memberCount;
    }
    
    // Add selected add-ons
    const addOnCost = formData.addOns.reduce((total, addOnId) => {
      const addOn = addOns.find(a => a.id === addOnId);
      return total + (addOn ? addOn.price : 0);
    }, 0);
    
    return basePremium + addOnCost;
  };

  // Form validation (without setting errors)
  const validateFormData = () => {
    const errors = {};
    
    if (policyType === 'individual') {
      if (!formData.fullName) errors.fullName = 'Full name is required';
      if (!formData.age) errors.age = 'Age is required';
      else if (formData.age < 18 || formData.age > 75) errors.age = 'Age must be between 18 and 75';
      if (!formData.gender) errors.gender = 'Gender is required';
    } else {
      const validMembers = familyMembers.filter(m => m.name && m.age && m.relationship);
      if (validMembers.length === 0) errors.familyMembers = 'At least one family member is required';
      
      familyMembers.forEach((member, index) => {
        if (member.name && member.age && (member.age < 0 || member.age > 100)) {
          errors[`member_${index}_age`] = 'Age must be between 0 and 100';
        }
      });
    }
    
    if (!formData.mobile) errors.mobile = 'Mobile number is required';
    else if (!/^[6-9]\d{9}$/.test(formData.mobile)) errors.mobile = 'Invalid mobile number';
    
    if (!formData.email) errors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.email = 'Invalid email address';
    
    if (!formData.insuranceAmount) errors.insuranceAmount = 'Insurance amount is required';
    if (!formData.policyDuration) errors.policyDuration = 'Policy duration is required';
    
    return errors;
  };

  // Form validation (with setting errors)
  const validateForm = () => {
    const errors = validateFormData();
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddOnChange = (addOnId, checked) => {
    setFormData(prev => ({
      ...prev,
      addOns: checked 
        ? [...prev.addOns, addOnId]
        : prev.addOns.filter(id => id !== addOnId)
    }));
  };

  const addFamilyMember = () => {
    setFamilyMembers([...familyMembers, { name: '', age: '', relationship: '' }]);
  };

  const removeFamilyMember = (index) => {
    if (familyMembers.length > 1) {
      setFamilyMembers(familyMembers.filter((_, i) => i !== index));
    }
  };

  const updateFamilyMember = (index, field, value) => {
    const updated = [...familyMembers];
    updated[index][field] = value;
    setFamilyMembers(updated);
  };

  const handleViewDetails = (plan) => {
    setSelectedPlan(plan);
    setShowPlanDetails(true);
  };

  const handleSelectPlan = (planId) => {
    setSelectedPlanId(planId);
    const plan = insurancePlans.find(p => p.id === planId);
    setSelectedPlan(plan);
  };

  const nextStep = () => {
    console.log('Next step clicked, current step:', currentStep);
    
    if (currentStep === 2 && !selectedPlanId) {
      alert('Please select a plan to continue');
      return;
    }
    
    if (currentStep === 3) {
      // Validate form before proceeding to step 4
      const errors = validateFormData();
      console.log('Form validation errors:', errors);
      if (Object.keys(errors).length > 0) {
        setFormErrors(errors);
        alert('Please fill in all required fields correctly');
        return;
      }
    }
    
    if (currentStep < 4) {
      console.log('Moving to step:', currentStep + 1);
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isStepValid = () => {
    const isValid = (() => {
      switch (currentStep) {
        case 1:
          return policyType !== '';
        case 2:
          return selectedPlanId !== null;
        case 3:
          // Allow navigation if we have a plan selected
          return selectedPlanId !== null;
        case 4:
          return true;
        default:
          return false;
      }
    })();
    
    console.log('isStepValid check - currentStep:', currentStep, 'isValid:', isValid, 'selectedPlanId:', selectedPlanId);
    return isValid;
  };

  const handleBuyNow = () => {
    // Redirect to payment page or integrate payment gateway
    alert('Redirecting to payment gateway...');
    // window.location.href = '/payment';
  };

  const handleContinueToApplication = () => {
    // Continue to final review
    setCurrentStep(4);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <HeaderNav />
        {/* Hero Section */}
        <section className="relative py-24 overflow-hidden" style={{ backgroundImage: `url(${coverImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30"></div>
        <div className="relative z-10 container mx-auto px-4">
            <div className="text-center text-white max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-green-200 bg-clip-text text-transparent">
                General Insurance Details
            </h1>
            <p className="text-lg md:text-xl text-gray-200 mb-8 leading-relaxed">
                Get a personalized general insurance quote tailored to your needs
            </p>
            <nav className="flex flex-wrap justify-center items-center space-x-2 md:space-x-3 text-sm md:text-base bg-white/10 backdrop-blur-sm rounded-full px-4 md:px-6 py-2 md:py-3 inline-flex">
                <a href="/" className="hover:text-green-300 transition-colors">Home</a>
                <span className="text-gray-400">/</span>
                <a href="/services" className="hover:text-green-300 transition-colors">Services</a>
                <span className="text-gray-400">/</span>
                <a href="/general-insurance" className="hover:text-green-300 transition-colors">General Insurance</a>
                <span className="text-gray-400">/</span>
                <span className="text-green-300 font-medium">Get Quote</span>
            </nav>
            </div>
        </div>
        </section>

      {/* Progress Indicator */}
      <section className="py-8 bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex justify-center">
            <div className="flex items-center space-x-4">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                    currentStep >= step.id 
                      ? 'bg-[#53755d] text-white' 
                      : 'bg-gray-200 text-gray-500'
                  }`}>
                    {step.id}
                  </div>
                  <div className="ml-3 hidden sm:block">
                    <p className={`text-sm font-medium ${
                      currentStep >= step.id ? 'text-[#53755d]' : 'text-gray-500'
                    }`}>
                      {step.title}
                    </p>
                    <p className="text-xs text-gray-400">{step.description}</p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-8 h-0.5 mx-4 ${
                      currentStep > step.id ? 'bg-[#53755d]' : 'bg-gray-200'
                    }`}></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            
            {/* Step 1: Policy Type Selection */}
            {currentStep === 1 && (
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-3xl font-bold text-center mb-8">Choose Your Policy Type</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div 
                    className={`p-8 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                      policyType === 'individual' 
                        ? 'border-[#53755d] bg-green-50' 
                        : 'border-gray-200 hover:border-[#53755d]'
                    }`}
                    onClick={() => setPolicyType('individual')}
                  >
                    <div className="text-center">
                      <FaUser className="text-6xl text-[#53755d] mx-auto mb-4" />
                      <h3 className="text-2xl font-semibold mb-3">Individual</h3>
                      <p className="text-gray-600 mb-4">
                        Perfect for single person coverage with personalized benefits
                      </p>
                      <div className="flex items-center justify-center">
                        <input
                          type="radio"
                          name="policyType"
                          value="individual"
                          checked={policyType === 'individual'}
                          onChange={() => setPolicyType('individual')}
                          className="w-5 h-5 text-[#53755d]"
                        />
                        <span className="ml-2 font-medium">Select Individual</span>
                      </div>
                    </div>
                  </div>

                  <div 
                    className={`p-8 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                      policyType === 'family' 
                        ? 'border-[#53755d] bg-green-50' 
                        : 'border-gray-200 hover:border-[#53755d]'
                    }`}
                    onClick={() => setPolicyType('family')}
                  >
                    <div className="text-center">
                      <FaUsers className="text-6xl text-[#53755d] mx-auto mb-4" />
                      <h3 className="text-2xl font-semibold mb-3">Family/Group</h3>
                      <p className="text-gray-600 mb-4">
                        Comprehensive coverage for your entire family with group benefits
                      </p>
                      <div className="flex items-center justify-center">
                        <input
                          type="radio"
                          name="policyType"
                          value="family"
                          checked={policyType === 'family'}
                          onChange={() => setPolicyType('family')}
                          className="w-5 h-5 text-[#53755d]"
                        />
                        <span className="ml-2 font-medium">Select Family</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Plan Selection */}
            {currentStep === 2 && (
              <div className="space-y-8">
                <div className="text-center">
                  <h2 className="text-3xl font-bold mb-4">Choose Your Insurance Plan</h2>
                  <p className="text-gray-600">Select the plan that best fits your needs and budget</p>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  {insurancePlans.map((plan) => (
                    <div 
                      key={plan.id} 
                      className={`bg-white rounded-xl shadow-lg p-6 transition-all duration-300 cursor-pointer ${
                        selectedPlanId === plan.id 
                          ? 'ring-2 ring-[#53755d] bg-green-50' 
                          : 'hover:shadow-xl'
                      }`}
                      onClick={() => handleSelectPlan(plan.id)}
                    >
                      <div className="text-center mb-6">
                        <div className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center ${
                          plan.id === 'basic' ? 'bg-blue-100' :
                          plan.id === 'comprehensive' ? 'bg-green-100' : 'bg-purple-100'
                        }`}>
                          <FaShieldAlt className={`text-2xl ${
                            plan.id === 'basic' ? 'text-blue-600' :
                            plan.id === 'comprehensive' ? 'text-green-600' : 'text-purple-600'
                          }`} />
                        </div>
                        <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                        <p className="text-gray-600 text-sm">{plan.description}</p>
                      </div>

                      <div className="text-center mb-6">
                        <div className="text-3xl font-bold text-[#53755d] mb-2">
                          ₹{plan.coverage.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-600">Coverage Amount</div>
                      </div>

                      <div className="space-y-3 mb-6">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Monthly Premium:</span>
                          <span className="font-semibold">₹{plan.monthlyPremium.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Annual Premium:</span>
                          <span className="font-semibold">₹{plan.annualPremium.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Duration:</span>
                          <span className="font-semibold">{plan.duration}</span>
                        </div>
                      </div>

                      <div className="mb-6">
                        <h4 className="font-semibold mb-3">Key Benefits:</h4>
                        <ul className="space-y-2">
                          {plan.benefits.map((benefit, index) => (
                            <li key={index} className="flex items-start">
                              <FaCheckCircle className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                              <span className="text-sm">{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="space-y-2">
                        <button
                          onClick={() => handleViewDetails(plan)}
                          className="w-full border border-[#53755d] text-[#53755d] py-2 rounded-lg font-semibold hover:bg-[#53755d] hover:text-white transition duration-300 flex items-center justify-center"
                        >
                          <FaEye className="mr-2" />
                          View Details
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectPlan(plan.id);
                          }}
                          className={`w-full py-3 rounded-lg font-semibold transition duration-300 ${
                            selectedPlanId === plan.id
                              ? 'bg-[#53755d] text-white'
                              : 'bg-gray-200 text-gray-700 hover:bg-[#53755d] hover:text-white'
                          }`}
                        >
                          {selectedPlanId === plan.id ? 'Selected' : 'Select Plan'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Form Details */}
            {currentStep === 3 && (
              <div className="bg-white rounded-xl shadow-lg p-8">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold mb-4">
                    {policyType === 'individual' ? 'Personal Information' : 'Family Information'}
                  </h2>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-2xl mx-auto">
                    <h3 className="font-semibold text-blue-800 mb-2">Selected Plan: {selectedPlan?.name}</h3>
                    <p className="text-blue-700 text-sm">Coverage: ₹{selectedPlan?.coverage.toLocaleString()}</p>
                  </div>
                </div>

                {/* Premium Type Selection */}
                <div className="mb-8">
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Premium Payment Type
                  </label>
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="premiumType"
                        value="monthly"
                        checked={premiumType === 'monthly'}
                        onChange={(e) => setPremiumType(e.target.value)}
                        className="w-4 h-4 text-[#53755d]"
                      />
                      <span className="ml-2">Monthly (₹{selectedPlan?.monthlyPremium.toLocaleString()}/month)</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="premiumType"
                        value="annual"
                        checked={premiumType === 'annual'}
                        onChange={(e) => setPremiumType(e.target.value)}
                        className="w-4 h-4 text-[#53755d]"
                      />
                      <span className="ml-2">Annual (₹{selectedPlan?.annualPremium.toLocaleString()}/year)</span>
                    </label>
                  </div>
                </div>

                {policyType === 'individual' ? (
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          value={formData.fullName}
                          onChange={(e) => handleInputChange('fullName', e.target.value)}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#53755d] focus:border-transparent ${
                            formErrors.fullName ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="Enter your full name"
                        />
                        {formErrors.fullName && (
                          <p className="text-red-500 text-sm mt-1">{formErrors.fullName}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Age *
                        </label>
                        <input
                          type="number"
                          value={formData.age}
                          onChange={(e) => handleInputChange('age', e.target.value)}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#53755d] focus:border-transparent ${
                            formErrors.age ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="Enter your age"
                          min="18"
                          max="75"
                        />
                        {formErrors.age && (
                          <p className="text-red-500 text-sm mt-1">{formErrors.age}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Gender *
                        </label>
                        <select
                          value={formData.gender}
                          onChange={(e) => handleInputChange('gender', e.target.value)}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#53755d] focus:border-transparent ${
                            formErrors.gender ? 'border-red-500' : 'border-gray-300'
                          }`}
                        >
                          <option value="">Select Gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                        {formErrors.gender && (
                          <p className="text-red-500 text-sm mt-1">{formErrors.gender}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Mobile Number *
                        </label>
                        <input
                          type="tel"
                          value={formData.mobile}
                          onChange={(e) => handleInputChange('mobile', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#53755d] focus:border-transparent"
                          placeholder="Enter mobile number"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email ID *
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#53755d] focus:border-transparent"
                        placeholder="Enter email address"
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Insurance Amount *
                        </label>
                        <select
                          value={formData.insuranceAmount}
                          onChange={(e) => handleInputChange('insuranceAmount', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#53755d] focus:border-transparent"
                        >
                          <option value="">Select Amount</option>
                          <option value="500000">₹5,00,000</option>
                          <option value="1000000">₹10,00,000</option>
                          <option value="2500000">₹25,00,000</option>
                          <option value="5000000">₹50,00,000</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Policy Duration *
                        </label>
                        <select
                          value={formData.policyDuration}
                          onChange={(e) => handleInputChange('policyDuration', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#53755d] focus:border-transparent"
                        >
                          <option value="">Select Duration</option>
                          <option value="1">1 Year</option>
                          <option value="2">2 Years</option>
                          <option value="3">3 Years</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-4">
                        Optional Add-ons
                      </label>
                      <div className="grid md:grid-cols-2 gap-4">
                        {addOns.map((addOn) => (
                          <label key={addOn.id} className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={formData.addOns.includes(addOn.id)}
                              onChange={(e) => handleAddOnChange(addOn.id, e.target.checked)}
                              className="w-4 h-4 text-[#53755d] rounded focus:ring-[#53755d]"
                            />
                            <div className="ml-3">
                              <span className="font-medium">{addOn.name}</span>
                              <p className="text-sm text-gray-600">₹{addOn.price}</p>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Mobile Number *
                        </label>
                        <input
                          type="tel"
                          value={formData.mobile}
                          onChange={(e) => handleInputChange('mobile', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#53755d] focus:border-transparent"
                          placeholder="Enter mobile number"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email ID *
                        </label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#53755d] focus:border-transparent"
                          placeholder="Enter email address"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Insurance Amount *
                        </label>
                        <select
                          value={formData.insuranceAmount}
                          onChange={(e) => handleInputChange('insuranceAmount', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#53755d] focus:border-transparent"
                        >
                          <option value="">Select Amount</option>
                          <option value="500000">₹5,00,000</option>
                          <option value="1000000">₹10,00,000</option>
                          <option value="2500000">₹25,00,000</option>
                          <option value="5000000">₹50,00,000</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Policy Duration *
                        </label>
                        <select
                          value={formData.policyDuration}
                          onChange={(e) => handleInputChange('policyDuration', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#53755d] focus:border-transparent"
                        >
                          <option value="">Select Duration</option>
                          <option value="1">1 Year</option>
                          <option value="2">2 Years</option>
                          <option value="3">3 Years</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <label className="block text-sm font-medium text-gray-700">
                          Family Members *
                        </label>
                        <button
                          type="button"
                          onClick={addFamilyMember}
                          className="flex items-center px-4 py-2 bg-[#53755d] text-white rounded-lg hover:bg-[#3e5d49] transition duration-300"
                        >
                          <FaPlus className="mr-2" />
                          Add Member
                        </button>
                      </div>
                      <div className="space-y-4">
                        {familyMembers.map((member, index) => (
                          <div key={index} className="p-4 border border-gray-200 rounded-lg">
                            <div className="flex items-center justify-between mb-4">
                              <h4 className="font-medium">Member {index + 1}</h4>
                              {familyMembers.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => removeFamilyMember(index)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <FaTimes />
                                </button>
                              )}
                            </div>
                            <div className="grid md:grid-cols-3 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Name *
                                </label>
                                <input
                                  type="text"
                                  value={member.name}
                                  onChange={(e) => updateFamilyMember(index, 'name', e.target.value)}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#53755d] focus:border-transparent"
                                  placeholder="Enter name"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Age *
                                </label>
                                <input
                                  type="number"
                                  value={member.age}
                                  onChange={(e) => updateFamilyMember(index, 'age', e.target.value)}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#53755d] focus:border-transparent"
                                  placeholder="Enter age"
                                  min="0"
                                  max="100"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Relationship *
                                </label>
                                <select
                                  value={member.relationship}
                                  onChange={(e) => updateFamilyMember(index, 'relationship', e.target.value)}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#53755d] focus:border-transparent"
                                >
                                  <option value="">Select</option>
                                  <option value="spouse">Spouse</option>
                                  <option value="child">Child</option>
                                  <option value="parent">Parent</option>
                                  <option value="sibling">Sibling</option>
                                  <option value="other">Other</option>
                                </select>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}


            {/* Step 4: Review & Payment */}
            {currentStep === 4 && (
              <div className="space-y-8">
                <div className="text-center">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaCheckCircle className="text-4xl text-green-600" />
                  </div>
                  <h2 className="text-3xl font-bold mb-4">Review Your Application</h2>
                  <p className="text-gray-600">Please review your information and premium calculation before proceeding</p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  {/* Application Summary */}
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-xl font-semibold mb-6 text-[#53755d]">Application Summary</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Policy Type:</span>
                        <span className="font-semibold capitalize">{policyType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Selected Plan:</span>
                        <span className="font-semibold">{selectedPlan?.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Coverage Amount:</span>
                        <span className="font-semibold">₹{selectedPlan?.coverage.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Policy Duration:</span>
                        <span className="font-semibold">{formData.policyDuration} Year(s)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Payment Type:</span>
                        <span className="font-semibold capitalize">{premiumType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Contact:</span>
                        <span className="font-semibold">{formData.mobile}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Email:</span>
                        <span className="font-semibold">{formData.email}</span>
                      </div>
                    </div>
                  </div>

                  {/* Premium Calculation */}
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-xl font-semibold mb-6 text-[#53755d]">Premium Calculation</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Base Premium ({premiumType}):</span>
                        <span className="font-semibold">
                          ₹{premiumType === 'monthly' ? selectedPlan?.monthlyPremium.toLocaleString() : selectedPlan?.annualPremium.toLocaleString()}
                        </span>
                      </div>
                      
                      {policyType === 'family' && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Family Members:</span>
                          <span className="font-semibold">
                            {familyMembers.filter(m => m.name && m.age).length} × Base Premium
                          </span>
                        </div>
                      )}
                      
                      {formData.addOns.length > 0 && (
                        <div className="border-t pt-4">
                          <h4 className="font-medium text-gray-700 mb-2">Add-ons:</h4>
                          {formData.addOns.map((addOnId) => {
                            const addOn = addOns.find(a => a.id === addOnId);
                            return addOn ? (
                              <div key={addOnId} className="flex justify-between text-sm">
                                <span className="text-gray-600">{addOn.name}:</span>
                                <span>₹{addOn.price.toLocaleString()}</span>
                              </div>
                            ) : null;
                          })}
                        </div>
                      )}
                      
                      <div className="border-t pt-4">
                        <div className="flex justify-between text-lg font-bold text-[#53755d]">
                          <span>Total Premium:</span>
                          <span>₹{calculatePremium().toLocaleString()}</span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          {premiumType === 'monthly' ? 'Per month' : 'Per year'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Member Details (if family) */}
                {policyType === 'family' && (
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-xl font-semibold mb-6 text-[#53755d]">Family Members</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {familyMembers.filter(m => m.name && m.age).map((member, index) => (
                        <div key={index} className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="font-medium">Member {index + 1}</h4>
                          <p className="text-sm text-gray-600">Name: {member.name}</p>
                          <p className="text-sm text-gray-600">Age: {member.age}</p>
                          <p className="text-sm text-gray-600">Relationship: {member.relationship}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button 
                    onClick={handleBuyNow}
                    className="bg-[#53755d] text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-[#3e5d49] transition duration-300 flex items-center justify-center"
                  >
                    <FaRupeeSign className="mr-2" />
                    Buy Now - ₹{calculatePremium().toLocaleString()}
                  </button>
                  <button 
                    onClick={handleContinueToApplication}
                    className="border-2 border-[#53755d] text-[#53755d] px-8 py-4 rounded-lg font-semibold text-lg hover:bg-[#53755d] hover:text-white transition duration-300 flex items-center justify-center"
                  >
                    <FaCheckCircle className="mr-2" />
                    Continue to Application
                  </button>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <button
                onClick={prevStep}
                disabled={currentStep === 1}
                className={`flex items-center px-6 py-3 rounded-lg font-semibold transition duration-300 ${
                  currentStep === 1
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-[#53755d] border-2 border-[#53755d] hover:bg-[#53755d] hover:text-white'
                }`}
              >
                <FaArrowLeft className="mr-2" />
                Previous
              </button>

              <button
                onClick={nextStep}
                disabled={!isStepValid() || currentStep === 4}
                className={`flex items-center px-6 py-3 rounded-lg font-semibold transition duration-300 ${
                  !isStepValid() || currentStep === 4
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-[#53755d] text-white hover:bg-[#3e5d49]'
                }`}
              >
                {currentStep === 4 ? 'Complete' : 'Next'}
                {currentStep !== 4 && <FaArrowForward className="ml-2" />}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Plan Details Modal */}
      <PlanDetailsModal
        isOpen={showPlanDetails}
        onClose={() => setShowPlanDetails(false)}
        plan={selectedPlan}
        planType="general-insurance"
      />

      <Footer />
    </div>
  );
};

export default GeneralInsuranceDetails;

