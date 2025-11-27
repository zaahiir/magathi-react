import React, { useState, useEffect } from 'react';
import { 
  FaChartLine, 
  FaMoneyBillWave, 
  FaShieldAlt, 
  FaHeartbeat,
  FaCar,
  FaHome,
  FaPiggyBank,
  FaChevronRight,
  FaStar,
  FaCheckCircle,
  FaPhone,
  FaEnvelope,
  FaBuilding,
  FaDownload,
  FaInfoCircle,
  FaTimes,
  FaArrowRight,
  FaUsers,
  FaAward,
  FaClock
} from 'react-icons/fa';
import HeaderNav from '../components/HeaderNav';
import Footer from '../components/Footer';
import coverImage from '../assets/cover.jpg';

const Services = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [adminPlans, setAdminPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock data for admin plans - in real app, this would come from API
  useEffect(() => {
    // Simulate API call to fetch admin plans
    const fetchAdminPlans = async () => {
      setLoading(true);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock admin plans data
      const plans = [
        {
          id: 1,
          name: "Growth Equity Fund",
          category: "Mutual Funds",
          description: "High-growth equity mutual fund for long-term wealth creation",
          minInvestment: 5000,
          expectedReturn: "12-15%",
          riskLevel: "High",
          lockInPeriod: 0,
          expenseRatio: 1.5,
          rating: 4.5,
          features: ["Professional Management", "Diversified Portfolio", "SEBI Regulated"],
          icon: <FaChartLine className="text-blue-500" />,
          color: "from-blue-500 to-blue-600",
          adminAdded: true,
          addedDate: "2024-01-15"
        },
        {
          id: 2,
          name: "Health Shield Plus",
          category: "Health Insurance",
          description: "Comprehensive health insurance with cashless treatment",
          minInvestment: 12000,
          expectedReturn: "Coverage up to 10L",
          riskLevel: "Low",
          lockInPeriod: 365,
          expenseRatio: 0,
          rating: 4.8,
          features: ["Cashless Treatment", "Pre-existing Coverage", "Tax Benefits"],
          icon: <FaHeartbeat className="text-red-500" />,
          color: "from-red-500 to-red-600",
          adminAdded: true,
          addedDate: "2024-01-20"
        },
        {
          id: 3,
          name: "Auto Secure Policy",
          category: "General Insurance",
          description: "Complete vehicle insurance with zero depreciation",
          minInvestment: 8000,
          expectedReturn: "Full Coverage",
          riskLevel: "Low",
          lockInPeriod: 365,
          expenseRatio: 0,
          rating: 4.3,
          features: ["Zero Depreciation", "Roadside Assistance", "Quick Claims"],
          icon: <FaCar className="text-green-500" />,
          color: "from-green-500 to-green-600",
          adminAdded: true,
          addedDate: "2024-01-25"
        },
        {
          id: 4,
          name: "Fixed Deposit Plus",
          category: "Deposits",
          description: "High-yield fixed deposit with flexible tenure",
          minInvestment: 10000,
          expectedReturn: "7-8%",
          riskLevel: "Very Low",
          lockInPeriod: 365,
          expenseRatio: 0,
          rating: 4.7,
          features: ["Guaranteed Returns", "Flexible Tenure", "Tax Benefits"],
          icon: <FaPiggyBank className="text-yellow-500" />,
          color: "from-yellow-500 to-yellow-600",
          adminAdded: true,
          addedDate: "2024-01-30"
        }
      ];
      
      setAdminPlans(plans);
      setLoading(false);
    };

    fetchAdminPlans();
  }, []);

  const handlePlanClick = (plan) => {
    setSelectedPlan(plan);
    setShowPlanModal(true);
  };

  const closePlanModal = () => {
    setShowPlanModal(false);
    setSelectedPlan(null);
  };

  const services = [
    {
      name: "Mutual Funds",
      description: "Professional wealth management with diversified investment options",
      icon: <FaChartLine className="text-4xl text-blue-500" />,
      color: "from-blue-500 to-blue-600",
      plans: adminPlans.filter(plan => plan.category === "Mutual Funds")
    },
    {
      name: "Health Insurance",
      description: "Comprehensive health coverage for you and your family",
      icon: <FaHeartbeat className="text-4xl text-red-500" />,
      color: "from-red-500 to-red-600",
      plans: adminPlans.filter(plan => plan.category === "Health Insurance")
    },
    {
      name: "General Insurance",
      description: "Protect your assets with our range of general insurance products",
      icon: <FaShieldAlt className="text-4xl text-green-500" />,
      color: "from-green-500 to-green-600",
      plans: adminPlans.filter(plan => plan.category === "General Insurance")
    },
    {
      name: "Fixed Deposits",
      description: "Secure your savings with guaranteed returns",
      icon: <FaPiggyBank className="text-4xl text-yellow-500" />,
      color: "from-yellow-500 to-yellow-600",
      plans: adminPlans.filter(plan => plan.category === "Deposits")
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Header Navigation */}
      <HeaderNav />

      {/* Hero Section */}
      <section className="relative py-24 bg-cover bg-center overflow-hidden" style={{ backgroundImage: `url(${coverImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30"></div>
        <div className="relative z-10 container mx-auto px-4">
          <div className="text-center text-white max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-green-200 bg-clip-text text-transparent">
              Our Services
            </h1>
            <p className="text-lg md:text-xl text-gray-200 mb-8 leading-relaxed">
              Comprehensive financial solutions tailored to your needs with expert guidance
            </p>
            <nav className="flex flex-wrap justify-center items-center space-x-2 md:space-x-3 text-sm md:text-base bg-white/10 backdrop-blur-sm rounded-full px-4 md:px-6 py-2 md:py-3 inline-flex">
              <a href="/" className="hover:text-green-300 transition-colors">Home</a>
              <span className="text-gray-400">/</span>
              <span className="text-green-300 font-medium">Services</span>
            </nav>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8 md:gap-12">
            {/* Main Services Content */}
            <div className="lg:col-span-2">
              <div className="mb-12">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-1 bg-gradient-to-r from-[#53755d] to-green-400 rounded-full mr-4"></div>
                  <span className="text-[#53755d] font-semibold uppercase tracking-wider">Our Services</span>
                </div>
                <h2 className="text-3xl md:text-5xl font-bold text-[#53755d] mb-6 leading-tight">
                  Comprehensive Financial Solutions
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  We offer a wide range of financial products and services designed to help you achieve your financial goals. 
                  Our expert team provides personalized guidance and professional management for all your investment needs.
                </p>
              </div>

              {/* Services Grid */}
              <div className="grid md:grid-cols-2 gap-6 mb-12">
                {services.map((service, index) => (
                  <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group border border-gray-100">
                    <div className="flex items-center space-x-4 mb-6">
                      <div className={`w-16 h-16 bg-gradient-to-br ${service.color} rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300`}>
                        {service.icon}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">{service.name}</h3>
                        <p className="text-gray-600 text-sm">{service.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        {service.plans.length} Plan{service.plans.length !== 1 ? 's' : ''} Available
                      </span>
                      <FaChevronRight className="text-[#53755d] group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  </div>
                ))}
              </div>

              {/* Why Choose Us Section */}
              <div className="bg-gradient-to-r from-[#53755d] to-[#6b8a6f] rounded-2xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-6">Why Choose Our Services?</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {[
                    {
                      title: "Expert Guidance",
                      description: "Professional advisors with years of experience in financial planning",
                      icon: <FaUsers className="text-2xl" />
                    },
                    {
                      title: "SEBI Regulated",
                      description: "All our services are fully compliant with SEBI regulations",
                      icon: <FaAward className="text-2xl" />
                    },
                    {
                      title: "24/7 Support",
                      description: "Round-the-clock customer support for all your queries",
                      icon: <FaClock className="text-2xl" />
                    },
                    {
                      title: "Transparent Process",
                      description: "Complete transparency in all our processes and fees",
                      icon: <FaCheckCircle className="text-2xl" />
                    }
                  ].map((item, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-white">
                        {item.icon}
                      </div>
                      <div>
                        <h4 className="text-lg font-bold mb-2">{item.title}</h4>
                        <p className="text-white/80 text-sm">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Sidebar - Admin Plans */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                {/* Admin Plans Section */}
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 mb-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-10 h-10 bg-[#53755d] rounded-xl flex items-center justify-center text-white">
                      <FaChartLine />
                    </div>
                    <h4 className="text-xl font-bold text-gray-800">Featured Plans</h4>
                  </div>
                  
                  {loading ? (
                    <div className="space-y-4">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="animate-pulse">
                          <div className="bg-gray-200 rounded-xl h-24"></div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {adminPlans.slice(0, 4).map((plan) => (
                        <div 
                          key={plan.id}
                          onClick={() => handlePlanClick(plan)}
                          className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 hover:shadow-md transition-all duration-300 cursor-pointer group border border-gray-200 hover:border-[#53755d]"
                        >
                          <div className="flex items-center space-x-3 mb-3">
                            <div className={`w-10 h-10 bg-gradient-to-br ${plan.color} rounded-lg flex items-center justify-center text-white`}>
                              {plan.icon}
                            </div>
                            <div className="flex-1">
                              <h5 className="font-bold text-gray-800 text-sm group-hover:text-[#53755d] transition-colors">
                                {plan.name}
                              </h5>
                              <p className="text-xs text-gray-600">{plan.category}</p>
                            </div>
                            <div className="flex items-center space-x-1">
                              <FaStar className="text-yellow-400 text-xs" />
                              <span className="text-xs font-medium text-gray-600">{plan.rating}</span>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-gray-500">Min Investment:</span>
                              <span className="text-xs font-medium text-[#53755d]">₹{plan.minInvestment.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-gray-500">Expected Return:</span>
                              <span className="text-xs font-medium text-green-600">{plan.expectedReturn}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-gray-500">Risk Level:</span>
                              <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                                plan.riskLevel === 'High' ? 'bg-red-100 text-red-600' :
                                plan.riskLevel === 'Moderate' ? 'bg-yellow-100 text-yellow-600' :
                                'bg-green-100 text-green-600'
                              }`}>
                                {plan.riskLevel}
                              </span>
                            </div>
                          </div>
                          
                          <div className="mt-3 flex items-center justify-between">
                            <span className="text-xs text-gray-400">Added by Admin</span>
                            <FaArrowRight className="text-[#53755d] text-xs group-hover:translate-x-1 transition-transform duration-300" />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
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

      {/* Plan Details Modal */}
      {showPlanModal && selectedPlan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-[#53755d] to-[#6b8a6f] text-white p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`w-16 h-16 bg-gradient-to-br ${selectedPlan.color} rounded-xl flex items-center justify-center text-white text-2xl`}>
                    {selectedPlan.icon}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{selectedPlan.name}</h2>
                    <p className="text-white/80">{selectedPlan.category}</p>
                  </div>
                </div>
                <button 
                  onClick={closePlanModal}
                  className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center hover:bg-white/30 transition-colors"
                >
                  <FaTimes />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Plan Description */}
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">Plan Description</h3>
                <p className="text-gray-600">{selectedPlan.description}</p>
              </div>

              {/* Key Details */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="text-sm text-gray-500 mb-1">Minimum Investment</div>
                  <div className="text-xl font-bold text-[#53755d]">₹{selectedPlan.minInvestment.toLocaleString()}</div>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="text-sm text-gray-500 mb-1">Expected Return</div>
                  <div className="text-xl font-bold text-green-600">{selectedPlan.expectedReturn}</div>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="text-sm text-gray-500 mb-1">Risk Level</div>
                  <div className={`text-lg font-bold px-3 py-1 rounded-full inline-block ${
                    selectedPlan.riskLevel === 'High' ? 'bg-red-100 text-red-600' :
                    selectedPlan.riskLevel === 'Moderate' ? 'bg-yellow-100 text-yellow-600' :
                    'bg-green-100 text-green-600'
                  }`}>
                    {selectedPlan.riskLevel}
                  </div>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="text-sm text-gray-500 mb-1">Rating</div>
                  <div className="flex items-center space-x-1">
                    <FaStar className="text-yellow-400" />
                    <span className="text-lg font-bold text-gray-800">{selectedPlan.rating}</span>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-3">Key Features</h3>
                <div className="space-y-2">
                  {selectedPlan.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <FaCheckCircle className="text-green-500" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Admin Info */}
              <div className="bg-blue-50 rounded-xl p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <FaInfoCircle className="text-blue-500" />
                  <span className="font-semibold text-blue-800">Admin Added Plan</span>
                </div>
                <p className="text-sm text-blue-700">
                  This plan was added by our admin team on {new Date(selectedPlan.addedDate).toLocaleDateString()}. 
                  It's been carefully reviewed and approved for our clients.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4">
                <button className="flex-1 bg-[#53755d] text-white py-3 px-6 rounded-xl font-semibold hover:bg-green-700 transition-colors duration-300">
                  Invest Now
                </button>
                <button className="flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:bg-gray-300 transition-colors duration-300">
                  Download Brochure
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Services;
