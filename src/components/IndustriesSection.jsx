import React, { useState, useEffect } from 'react';
import { ChevronRight, Trophy, BarChart3, TrendingUp, DollarSign, CheckCircle, Phone } from 'lucide-react';

const IndustriesSection = () => {
  const [activeTab, setActiveTab] = useState('tab-1');
  const [isVisible, setIsVisible] = useState(false);

  const industries = {
    'tab-1': {
      title: 'Technology & Life Sciences',
      description: 'We specialize in technology and life sciences investments, offering exposure to innovative companies driving digital transformation and healthcare breakthroughs. Our expertise includes venture capital opportunities and convergence plays between traditional and emerging technologies.',
      items: ['Venture Capital Exposure', 'Convergence Opportunities', 'Biotech Innovation', 'Digital Transformation']
    },
    'tab-2': {
      title: 'Banking & Financial',
      description: 'Comprehensive financial services sector coverage including traditional banking, fintech, insurance, and alternative investments. We help clients navigate economic cycles and capitalize on financial inclusion opportunities.',
      items: ['Economic Cycle Positioning', 'Financial Inclusion', 'Regulatory Compliance', 'Digital Banking']
    },
    'tab-3': {
      title: 'Ethical Investment',
      description: 'ESG-focused investment strategies that align financial goals with personal values. We help clients invest in companies that prioritize environmental sustainability, social responsibility, and good governance.',
      items: ['ESG-Focused Funds', 'Sustainable Development', 'Impact Investing', 'Green Finance']
    },
    'tab-4': {
      title: 'Manufacturing',
      description: 'Diversified manufacturing sector coverage including traditional manufacturing, advanced manufacturing, and supply chain optimization. We focus on companies with strong competitive advantages and innovation capabilities.',
      items: ['Diversified Manufacturing Funds', 'Supply Chain Resilience', 'Industry 4.0', 'Global Competitiveness']
    }
  };

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

    const element = document.querySelector('.industries-section');
    if (element) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-16 md:py-20 bg-white relative overflow-hidden industries-section">
      {/* Background Vector Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Floating Coins */}
        <div className="absolute top-10 left-10 opacity-10">
          <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center">
            <DollarSign className="w-8 h-8 text-white" />
          </div>
        </div>
        <div className="absolute top-32 right-20 opacity-10">
          <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center">
            <DollarSign className="w-6 h-6 text-white" />
          </div>
        </div>
        <div className="absolute bottom-20 left-1/4 opacity-10">
          <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center">
            <DollarSign className="w-5 h-5 text-white" />
          </div>
        </div>
        
        {/* Chart Elements */}
        <div className="absolute top-1/2 right-10 opacity-5">
          <BarChart3 className="w-24 h-24 text-[#53755d]" />
        </div>
        <div className="absolute bottom-10 right-1/3 opacity-5">
          <TrendingUp className="w-20 h-20 text-[#53755d]" />
        </div>
        
        {/* Abstract Shapes */}
        <div className="absolute top-1/4 left-1/3 w-32 h-32 bg-gradient-to-br from-[#53755d]/10 to-transparent rounded-full"></div>
        <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-gradient-to-tl from-[#53755d]/10 to-transparent rounded-full"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12 md:mb-16">
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <span className="text-[#53755d] text-sm font-medium bg-[#53755d]/10 px-4 py-2 rounded-full">Our Expertise</span>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mt-4 mb-4">
              Industries We Serve
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-sm md:text-base">
              Discover our comprehensive expertise across diverse sectors, delivering tailored financial solutions for every industry
            </p>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="block lg:hidden">
          <div className="space-y-6">
            {Object.entries(industries).map(([key, industry], index) => (
              <div
                key={key}
                className={`bg-white border-2 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 ${
                  activeTab === key 
                    ? 'border-[#53755d] shadow-[#53755d]/20' 
                    : 'border-gray-200 hover:border-[#53755d]/50'
                }`}
                onClick={() => setActiveTab(key)}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      activeTab === key ? 'bg-[#53755d]' : 'bg-gray-100'
                    }`}>
                      <span className={`text-sm font-bold ${
                        activeTab === key ? 'text-white' : 'text-gray-600'
                      }`}>
                        {String(index + 1).padStart(2, '0')}
                      </span>
                    </div>
                    <h3 className="font-bold text-lg text-gray-900">{industry.title}</h3>
                  </div>
                  <ChevronRight className={`w-5 h-5 transition-colors ${
                    activeTab === key ? 'text-[#53755d]' : 'text-gray-400'
                  }`} />
                </div>
                
                {activeTab === key && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                      {industry.description}
                    </p>
                    <ul className="space-y-2 mb-4">
                      {industry.items.map((item, idx) => (
                        <li key={idx} className="flex items-start text-sm text-gray-600">
                          <CheckCircle className="w-4 h-4 text-[#53755d] mr-2 mt-0.5 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                    <a href="#" className="inline-block bg-[#53755d] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#3e5d49] transition-all duration-300 text-sm">
                      Learn More
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-8">
          {/* Tab Buttons */}
          <div className="lg:col-span-2 space-y-4">
            {Object.entries(industries).map(([key, industry], index) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`w-full text-left p-6 rounded-xl transition-all duration-300 hover:scale-[1.02] ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`} 
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className={`flex items-center justify-between p-4 rounded-lg transition-all duration-300 ${
                  activeTab === key 
                    ? 'bg-[#53755d] text-white shadow-lg shadow-[#53755d]/20' 
                    : 'bg-gray-50 text-gray-900 hover:bg-gray-100'
                }`}>
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      activeTab === key ? 'bg-white/20' : 'bg-[#53755d]'
                    }`}>
                      <span className={`text-lg font-bold ${
                        activeTab === key ? 'text-white' : 'text-white'
                      }`}>
                        {String(index + 1).padStart(2, '0')}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{industry.title}</h3>
                      <p className="text-sm opacity-80 mt-1">
                        {industry.items.length} services available
                      </p>
                    </div>
                  </div>
                  <ChevronRight className={`w-5 h-5 transition-colors ${
                    activeTab === key ? 'text-white' : 'text-[#53755d]'
                  }`} />
                </div>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className={`lg:col-span-1 transition-all duration-1000 delay-400 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <div className="bg-white border-2 border-[#53755d]/20 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 h-full">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-[#53755d] rounded-lg flex items-center justify-center mr-4">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{industries[activeTab].title}</h3>
                  <p className="text-sm text-gray-500">Expert Solutions</p>
                </div>
              </div>
              
              <p className="text-gray-600 mb-6 leading-relaxed">
                {industries[activeTab].description}
              </p>
              
              <div className="space-y-3 mb-6">
                <h4 className="font-semibold text-gray-900 text-sm">Key Services:</h4>
                <ul className="space-y-2">
                  {industries[activeTab].items.map((item, index) => (
                    <li key={index} className="flex items-start text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-[#53755d] mr-2 mt-0.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="flex space-x-3">
                <a href="#" className="flex-1 bg-[#53755d] text-white px-4 py-3 rounded-lg font-medium hover:bg-[#3e5d49] transition-all duration-300 text-center text-sm">
                  Explore Services
                </a>
                <button className="px-4 py-3 border border-[#53755d] text-[#53755d] rounded-lg hover:bg-[#53755d] hover:text-white transition-all duration-300">
                  <Phone className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IndustriesSection;