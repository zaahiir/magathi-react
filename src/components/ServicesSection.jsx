import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaChartLine, FaHeartbeat, FaShieldAlt, FaPiggyBank } from 'react-icons/fa';

const ServicesSection = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  // Intersection Observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.querySelector('.services-section');
    if (element) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, []);

  const services = [
    {
      id: 1,
      title: 'MUTUAL FUND',
      description: 'Mutual Fund Mutual funds are a type of certified managed combined investment schemes that gathers money from many investors to buy securities.',
      route: '/mutual-fund-plan-details',
      icon: FaChartLine
    },
    {
      id: 2,
      title: 'HEALTH INSURANCE POLICY',
      description: 'This insurance that offers coverage for the medical and surgical expenses incurred by the policyholder when he/she is hospitalised during the policy period.',
      route: '/health-insurance',
      icon: FaHeartbeat
    },
    {
      id: 3,
      title: 'GENERAL INSURANCE',
      description: 'Comprehensive general insurance solutions to protect your assets, vehicles, and property from unforeseen risks and damages.',
      route: '/general-insurance',
      icon: FaShieldAlt
    },
    {
      id: 4,
      title: 'DEPOSIT',
      description: 'Secure deposit schemes offering competitive interest rates and flexible terms to help you grow your savings with guaranteed returns.',
      route: '/deposits',
      icon: FaPiggyBank
    }
  ];

  const handleCardClick = (route) => {
    navigate(route);
  };

  return (
    <section className="py-16 md:py-20 bg-white relative overflow-hidden services-section" style={{ background: 'linear-gradient(135deg, rgb(232, 245, 233) 0%, rgb(245, 245, 245) 100%)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12 md:mb-16">
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <span className="text-[#53755d] text-sm font-medium bg-[#53755d]/10 px-4 py-2 rounded-full">Our Expertise</span>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mt-4 mb-4">
            Trusted Financial Services
            </h2>
          </div>
        </div>
        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {services.map((service, index) => (
            <div
              key={service.id}
              onClick={() => handleCardClick(service.route)}
              className="bg-white rounded-xl p-6 md:p-8 hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-1 group flex flex-col"
            >
              {/* Icon */}
              <div className="mb-6">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-[#53755d] via-[#4a6b54] to-[#3e5d49] rounded-2xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-300">
                  <service.icon className="w-8 h-8 md:w-10 md:h-10 text-white group-hover:rotate-12 transition-transform duration-300" />
                </div>
              </div>

              {/* Title */}
              <h3 
                className="text-base md:text-lg font-bold text-gray-900 mb-4 uppercase tracking-tight"
                style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 700 }}
              >
                {service.title}
              </h3>

              {/* Description */}
              <p 
                className="text-sm md:text-base text-gray-600 mb-6 leading-relaxed flex-grow"
                style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 400 }}
              >
                {service.description}
              </p>

              {/* Read More Button */}
              <button 
                className="w-full py-2.5 md:py-3 px-4 border border-[#53755d] bg-white text-[#53755d] rounded-lg font-medium hover:bg-[#53755d] hover:text-white transition-all duration-300 text-sm md:text-base mt-auto"
                style={{ fontFamily: 'Roboto, sans-serif' }}
              >
                Read more
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;

