import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowRight, FaChartBar, FaHeartbeat, FaPiggyBank, FaStar } from 'react-icons/fa';
import HeaderNav from '../components/HeaderNav';
import Footer from '../components/Footer';
import general from '../assets/general.jpg';
import coverImage from '../assets/cover.jpg';

const GeneralInsurance = () => {
  const navigate = useNavigate();

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
              General Insurance Policy
            </h1>
            <p className="text-lg md:text-xl text-gray-200 mb-8 leading-relaxed">
              Get a personalized general insurance quote tailored to your needs
            </p>
            <nav className="flex flex-wrap justify-center items-center space-x-2 md:space-x-3 text-sm md:text-base bg-white/10 backdrop-blur-sm rounded-full px-4 md:px-6 py-2 md:py-3 inline-flex">
              <a href="/" className="hover:text-green-300 transition-colors">Home</a>
              <span className="text-gray-400">/</span>
              <a href="/services" className="hover:text-green-300 transition-colors">Services</a>
              <span className="text-gray-400">/</span>
              <span className="text-green-300 font-medium">General Insurance</span>
            </nav>
          </div>
        </div>
      </section>

      {/* About General Insurance Section */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Image Section */}
            <div className="order-2 md:order-1">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src={general}
                  alt="General Insurance Coverage" 
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
                    General Insurance
                  </h2>
                  <div className="w-20 h-1 bg-gradient-to-r from-[#53755d] to-[#6b8a6f] rounded-full mb-6"></div>
                </div>
                
                <div className="space-y-4 text-gray-700 leading-relaxed">
                  <p className="text-base md:text-lg">
                    General insurance plans <span className="font-semibold text-gray-900">provide comprehensive protection for your assets and liabilities</span>, including vehicles, property, travel, and other valuable possessions. These policies offer financial coverage against damages, losses, and third-party liabilities, ensuring peace of mind and financial security.
                  </p>
                  
                  <p className="text-base md:text-lg">
                    This is an <span className="font-semibold text-gray-900">agreement between the insurance company and the customer</span> where the insurer agrees to provide compensation for covered losses or damages to your assets. General insurance policies protect against various risks such as accidents, natural disasters, theft, and third-party claims, helping you <span className="font-semibold text-gray-900">safeguard your financial interests</span>.
                  </p>
                </div>
                
                {/* Get Plan Button */}
                <div className="pt-6">
                  <button
                    onClick={() => navigate('/general-insurance-details')}
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
            {/* Health Insurance Card */}
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
                  Health Insurance
                </h3>

                {/* Description */}
                <p className="text-gray-600 text-sm md:text-base mb-6 flex-grow leading-relaxed">
                  Comprehensive health coverage for you and your family. Get protection against medical expenses with cashless treatment at network hospitals.
                </p>

                {/* Features */}
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center text-sm text-gray-700">
                    <FaStar className="w-4 h-4 text-[#53755d] mr-2 flex-shrink-0" />
                    <span>Individual & family plans</span>
                  </li>
                  <li className="flex items-center text-sm text-gray-700">
                    <FaStar className="w-4 h-4 text-[#53755d] mr-2 flex-shrink-0" />
                    <span>Cashless hospitalization</span>
                  </li>
                  <li className="flex items-center text-sm text-gray-700">
                    <FaStar className="w-4 h-4 text-[#53755d] mr-2 flex-shrink-0" />
                    <span>Pre & post hospitalization</span>
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

export default GeneralInsurance;
