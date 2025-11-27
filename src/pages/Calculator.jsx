import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaCalculator, 
  FaChartLine, 
  FaCoins, 
  FaPiggyBank, 
  FaGraduationCap,
  FaArrowRight,
  FaMoneyBillWave,
  FaChartPie,
  FaClock,
  FaRocket
} from 'react-icons/fa';
import HeaderNav from '../components/HeaderNav';
import Footer from '../components/Footer';
import coverImage from '../assets/cover.jpg';

const Calculator = () => {
  const navigate = useNavigate();

  const calculators = [
    {
      id: 'sip',
      title: 'SIP Calculator',
      description: 'Calculate your Systematic Investment Plan returns and plan your monthly investments',
      icon: FaChartLine,
      color: 'from-green-500 to-emerald-600',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
      path: '/calculator/sip'
    },
    {
      id: 'lumpsum',
      title: 'Lumpsum Calculator',
      description: 'Calculate returns on your one-time investment and plan your financial goals',
      icon: FaCoins,
      color: 'from-blue-500 to-indigo-600',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      path: '/calculator/lumpsum'
    },
    {
      id: 'retirement',
      title: 'Retirement Planning',
      description: 'Plan your retirement corpus and calculate how much you need to save',
      icon: FaPiggyBank,
      color: 'from-purple-500 to-pink-600',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
      path: '/calculator/retirement-planning'
    },
    {
      id: 'education',
      title: 'Children Education',
      description: 'Calculate the future cost of education and plan your savings accordingly',
      icon: FaGraduationCap,
      color: 'from-orange-500 to-red-600',
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600',
      path: '/calculator/children-education'
    }
  ];

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
              Calculator
            </h1>
            <p className="text-lg md:text-xl text-gray-200 mb-8 leading-relaxed">
              Calculate your financial goals and plan your investments accordingly
            </p>
            <nav className="flex flex-wrap justify-center items-center space-x-2 md:space-x-3 text-sm md:text-base bg-white/10 backdrop-blur-sm rounded-full px-4 md:px-6 py-2 md:py-3 inline-flex">
              <a href="/" className="hover:text-green-300 transition-colors">Home</a>
              <span className="text-gray-400">/</span>
              <a href="/services" className="hover:text-green-300 transition-colors">Services</a>
              <span className="text-gray-400">/</span>
              <span className="text-green-300 font-medium">Calculator</span>
            </nav>
          </div>
        </div>
      </section>  

      {/* Calculators Grid */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Choose Your Calculator
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Select from our range of financial calculators to plan your investments, retirement, and more
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {calculators.map((calculator) => {
              const IconComponent = calculator.icon;
              return (
                <div
                  key={calculator.id}
                  onClick={() => navigate(calculator.path)}
                  className={`${calculator.bgColor} rounded-2xl p-8 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl group`}
                >
                  <div className="flex items-start justify-between mb-6">
                    <div className={`${calculator.iconColor} bg-white rounded-xl p-4 group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="text-3xl" />
                    </div>
                    <FaArrowRight className={`${calculator.iconColor} text-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-[#53755d] transition-colors">
                    {calculator.title}
                  </h3>
                  
                  <p className="text-gray-600 leading-relaxed mb-6">
                    {calculator.description}
                  </p>

                  <div className={`bg-gradient-to-r ${calculator.color} text-white px-6 py-3 rounded-lg font-semibold text-center group-hover:shadow-lg transition-shadow duration-300`}>
                    Calculate Now
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Why Use Our Calculators?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-white rounded-xl p-6 shadow-lg text-center">
              <div className="bg-[#53755d] rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <FaMoneyBillWave className="text-white text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Accurate Calculations</h3>
              <p className="text-gray-600">
                Get precise financial projections based on industry-standard formulas
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg text-center">
              <div className="bg-[#53755d] rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <FaChartPie className="text-white text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Visual Insights</h3>
              <p className="text-gray-600">
                Understand your investments better with charts and detailed breakdowns
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg text-center">
              <div className="bg-[#53755d] rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <FaClock className="text-white text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Quick & Easy</h3>
              <p className="text-gray-600">
                Get instant results with our user-friendly and intuitive interface
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Calculator;
