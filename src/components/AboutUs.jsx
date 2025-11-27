import React, { useState, useEffect } from 'react';
import { ChevronRight, Download, Trophy, TrendingUp, Users, Target, Award, DollarSign, BarChart3, Building, Star, CheckCircle, ArrowRight, Phone, Mail, MapPin, Clock, Shield, Heart, Zap } from 'lucide-react';
import aboutUsImg from '../assets/aboutus.png';
import skill1 from '../assets/skills-1.png';
import skill2 from '../assets/skills-2.png';

const AboutUs = () => {
  const [activeTab, setActiveTab] = useState('tab-1');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const chooseUsItems = [
    {
      id: '01',
      title: 'Extensive',
      highlight: 'Knowledge',
      description: 'Over 20 years of financial expertise with deep understanding of market dynamics, investment strategies, and wealth management principles.',
      icon: Users
    },
    {
      id: '02', 
      title: 'Risk',
      highlight: 'Management',
      description: 'Comprehensive risk assessment and mitigation strategies tailored to individual client profiles and market conditions.',
      icon: Shield
    },
    {
      id: '03',
      title: 'Team',
      highlight: 'Approach', 
      description: 'Collaborative team of certified financial professionals working together to provide holistic financial solutions.',
      icon: Heart
    },
    {
      id: '04',
      title: 'Advanced',
      highlight: 'Technology',
      description: 'State-of-the-art financial tools and platforms for real-time portfolio tracking and market analysis.',
      icon: Zap
    }
  ];

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

  const awards = [
    {
      icon: DollarSign,
      category: 'Business Excellence',
      title: 'Upper Crust Award for Outstanding Financial Services',
      year: '2015',
      description: 'Recognized for exceptional client service and innovative financial solutions'
    },
    {
      icon: BarChart3,
      category: 'Performance Excellence', 
      title: 'MFRT SAMMAN Award for Outstanding Performance',
      year: '2015',
      description: 'Awarded for consistently delivering superior investment returns'
    },
    {
      icon: Trophy,
      category: 'SIP Leadership',
      title: 'Highest Perceptual SIPs Winner Tamil Nadu Cluster',
      year: '2016',
      description: 'Leading SIP provider with highest client satisfaction ratings'
    },
    {
      icon: TrendingUp,
      category: 'Financial Advisory',
      title: 'CNBCTV18 Best Performing Individual Financial Advisor Award',
      year: '2016-17',
      description: 'National recognition for exceptional financial advisory services'
    }
  ];

  const teamMembers = [
    {
      name: 'Rajesh Kumar',
      position: 'Founder & CEO',
      experience: '25+ Years',
      expertise: 'Wealth Management, Investment Strategy',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
    },
    {
      name: 'Priya Sharma',
      position: 'Chief Investment Officer',
      experience: '20+ Years',
      expertise: 'Portfolio Management, Risk Analysis',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
    },
    {
      name: 'Amit Patel',
      position: 'Head of Operations',
      experience: '18+ Years',
      expertise: 'Client Relations, Process Optimization',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
    }
  ];

  const stats = [
    { number: '5000+', label: 'Happy Clients', icon: Users },
    { number: '₹500Cr+', label: 'Assets Under Management', icon: DollarSign },
    { number: '20+', label: 'Years Experience', icon: Award },
    { number: '98%', label: 'Client Satisfaction', icon: Star }
  ];

  // Auto-advance carousel for mobile
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 3) % chooseUsItems.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

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

    const element = document.querySelector('.about-section');
    if (element) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-white">

      {/* About Style Five Section - Enhanced with animations */}
      <section className="py-12 sm:py-16 md:py-20 about-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-6 sm:gap-8 items-center">
            {/* Content Column */}
            <div className="lg:col-span-4 order-2 lg:order-1">
              <div className="space-y-6">
                <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                  <span className="text-[#53755d] text-sm font-medium bg-[#53755d]/10 px-4 py-2 rounded-full">About Us</span>
                  <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mt-2 leading-tight">
                    Experts in Providing Investment Consulting Services
                  </h2>
                </div>
                <div className={`space-y-4 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">Service Since 2004</h3>
                  <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                    MFSPL is a team of Financial Professionals with enriching experience over 20 years. 
                    Our Endeavour is to uplift the financial health of our clients by providing professional 
                    Financial stability after doing a 360-degree analysis. We strive to help the clients 
                    achieve their goal by being transparent and providing a platform with ample products 
                    and impeccable services.
                  </p>
                  <div className="pt-4">
                    <a href="#" className="inline-block bg-[#53755d] text-white px-6 sm:px-8 py-2 sm:py-3 font-medium transition-all duration-300 hover:scale-105 hover:bg-[#3e5d49] shadow-none hover:shadow-lg text-sm sm:text-base [border-top-left-radius:20px] [border-top-right-radius:0px] [border-bottom-right-radius:20px] [border-bottom-left-radius:0px]">
                      Our History
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Image Column */}
            <div className={`lg:col-span-4 order-1 lg:order-2 transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="relative">
                <div>
                  <img src={aboutUsImg} alt="About us" className="w-full h-auto" />
                </div>
              </div>
            </div>

            {/* Vision & Mission Column - Enhanced */}
            <div className={`lg:col-span-4 order-3 space-y-4 sm:space-y-6 transition-all duration-1000 delay-600 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border hover:shadow-lg transition-all duration-300 [border-top-left-radius:50px] [border-top-right-radius:0px] [border-bottom-right-radius:50px] [border-bottom-left-radius:0px]">
                <div className="flex items-start space-x-4">
                  <div className="bg-[#53755d] p-2 rounded text-white">
                    <Target className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3">Our Vision</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      To establish MFSPL (Magathi Financial Services Pvt.Ltd) as one of the foremost 
                      financial companies by persistently committing to our service excellence for our 
                      customers which satisfies their dynamic needs
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border hover:shadow-lg transition-all duration-300 [border-top-left-radius:50px] [border-top-right-radius:0px] [border-bottom-right-radius:50px] [border-bottom-left-radius:0px]">
                <div className="flex items-start space-x-4">
                  <div className="bg-[#53755d] p-2 rounded text-white">
                    <Download className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 sm:mb-3">Our Mission</h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-4">
                      To create a positive financial environment for our clients through a lifetime 
                      commitment to our individual & corporate customers by guiding them with customized 
                      risk & wealth management solutions.
                    </p>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li className="flex items-center"><CheckCircle className="w-4 h-4 text-[#53755d] mr-2" />Client-centric approach</li>
                      <li className="flex items-center"><CheckCircle className="w-4 h-4 text-[#53755d] mr-2" />Responsible management</li>
                      <li className="flex items-center"><CheckCircle className="w-4 h-4 text-[#53755d] mr-2" />Broader positive impact</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='mx-20 mt-30 border-b border-[#53755dff]/70'></div>
      </section>

      {/* Skills Section - Enhanced */}
      <section className="pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Image Column - col-md-5 equivalent */}
          <div className={`lg:col-span-5 relative transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="grid grid-cols-2">
              {/* First Image */}
              <div className="flex items-start justify-center">  
                <img
                  src={skill1}
                  alt="Skill 1"
                  className="h-64 sm:h-80 md:h-96 w-full max-w-xs object-cover rounded-lg"
                />
              </div>

              {/* Second Image with reduced top margin */}
              <div className="flex items-start justify-center mt-8 sm:mt-12 md:mt-16 relative">
                <img
                  src={skill2}
                  alt="Skill 2"
                  className="h-56 sm:h-72 md:h-80 w-full max-w-xs object-cover rounded-tl-[30px] rounded-tr-[8px] rounded-br-none rounded-bl-none"
                />
                
                {/* Total Product Box - positioned on second image */}
                <div className="absolute -bottom-2 -right-2 sm:-bottom-4 sm:-right-4 bg-white rounded-lg p-3 sm:p-4 shadow-lg max-w-[140px] sm:max-w-xs hover:shadow-xl transition-all duration-300">
                  <h3 className="font-bold text-gray-900 text-xs sm:text-sm mb-1">Total Product</h3>
                  <h5 className="text-xs text-gray-500 mb-1 sm:mb-2 hidden sm:block">January-March 2023</h5>
                  <h2 className="text-lg sm:text-2xl font-bold text-[#53755dff] mb-1">3,456</h2>
                  <h4 className="text-xs text-gray-600 font-medium">+25% per week</h4>
                  <div className="mt-1 sm:mt-2">
                    <TrendingUp className="w-4 h-4 sm:w-8 sm:h-8 text-[#53755d]" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content Column - col-7 equivalent */}
          <div className={`lg:col-span-7 space-y-6 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div>
              <span className="text-[#53755d] text-sm font-medium bg-[#53755d]/10 px-4 py-2 rounded-full">Our Skills</span>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mt-2 leading-tight">
                We keep ourselves <br className="hidden md:block" />up to make your Dreams come true
              </h2>
            </div>
            
            <div className="space-y-4 text-gray-600">
              <p className="text-sm md:text-base leading-relaxed">
                We keep ourselves up" suggests dedication and constant vigilance. It implies the company 
                works tirelessly for its clients. Informal tone the capitalization of "Dreams" adds emphasis 
                and a slightly informal touch.
              </p>
              <p className="text-sm md:text-base leading-relaxed">
                Dreams come true" is highly motivational and speaks to achieving significant life goals.
              </p>
            </div>

            {/* Skills Grid - Mobile Responsive */}
            <div className="grid sm:grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4 lg:space-y-6">
                {/* Personal Consulting Service */}
                <div className="bg-[#53755d] bg-opacity-5 p-4 sm:p-6 rounded-lg hover:bg-opacity-10 transition-all duration-300">
                  <div className="bg-[#53755d] w-10 h-10 sm:w-12 sm:h-12 rounded flex items-center justify-center mb-3 sm:mb-4">
                    <Users className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <h3 className="font-normal text-white mb-2 leading-tight text-sm sm:text-base">
                    Personal <br />Consulting Service
                  </h3>
                  <h5 className="text-[#333333]/70 font-medium text-xs sm:text-sm">
                    <a href="#" className="hover:underline flex items-center">
                      Explore Projects <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1" />
                    </a>
                  </h5>
                </div>

                {/* Corporate Consulting Service */}
                <div className="bg-[#53755d] bg-opacity-5 p-4 sm:p-6 rounded-lg hover:bg-opacity-10 transition-all duration-300">
                  <div className="bg-[#53755d] w-10 h-10 sm:w-12 sm:h-12 rounded flex items-center justify-center mb-3 sm:mb-4">
                    <Building className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <h3 className="font-normal text-white mb-2 leading-tight text-sm sm:text-base">
                    Corporate <br />Consulting Service
                  </h3>
                  <h5 className="text-[#333333]/70 font-medium text-xs sm:text-sm">
                    <a href="#" className="hover:underline flex items-center">
                      Explore Projects <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1" />
                    </a>
                  </h5>
                </div>
              </div>

              {/* Progress Bars */}
              <div className="space-y-4 lg:space-y-6">
                <div className="space-y-3">
                  <p className="text-xs sm:text-sm text-gray-600">Complete account of the syste all expound the teachings.</p>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#53755dff] text-sm sm:text-base">38.5%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-[#53755d] h-2 rounded-full transition-all duration-1000" style={{width: '38.5%'}}></div>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-xs sm:text-sm text-gray-600">Right to find fault with a man who chooses to enjoy produces.</p>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#53755dff] text-sm sm:text-base">61.5%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-[#53755d] h-2 rounded-full transition-all duration-1000" style={{width: '61.5%'}}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    </div>
  );
};

export default AboutUs;