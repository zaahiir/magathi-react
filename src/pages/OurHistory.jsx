import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaChartLine, FaUsers, FaTrophy, FaGlobe, FaLightbulb, FaRocket } from 'react-icons/fa';
import { MdTrendingUp, MdSecurity, MdHandshake, MdStar } from 'react-icons/md';
import HeaderNav from '../components/HeaderNav';

export default function OurHistory() {
  const navigate = useNavigate();
  const timelineRef = useRef(null);
  const statsRef = useRef(null);
  const milestonesRef = useRef(null);
  const teamRef = useRef(null);

  console.log('OurHistory component rendered');

  useEffect(() => {
    console.log('OurHistory useEffect running');
    // GSAP Animations
    const tl = gsap.timeline();
    
    // Hero section animation
    tl.from('.hero-title', { 
      duration: 1, 
      y: 100, 
      opacity: 0, 
      ease: "power3.out" 
    })
    .from('.hero-subtitle', { 
      duration: 0.8, 
      y: 50, 
      opacity: 0, 
      ease: "power2.out" 
    }, "-=0.5")
    .from('.hero-stats', { 
      duration: 0.8, 
      scale: 0.8, 
      opacity: 0, 
      ease: "back.out(1.7)" 
    }, "-=0.3");

    // Timeline animation
    gsap.from('.timeline-item', {
      scrollTrigger: {
        trigger: timelineRef.current,
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "play none none reverse"
      },
      duration: 0.8,
      x: -100,
      opacity: 0,
      stagger: 0.2,
      ease: "power2.out"
    });

    // Stats animation
    gsap.from('.stat-item', {
      scrollTrigger: {
        trigger: statsRef.current,
        start: "top 80%",
        toggleActions: "play none none reverse"
      },
      duration: 0.6,
      y: 50,
      opacity: 0,
      stagger: 0.1,
      ease: "power2.out"
    });

    // Milestones animation
    gsap.from('.milestone-card', {
      scrollTrigger: {
        trigger: milestonesRef.current,
        start: "top 80%",
        toggleActions: "play none none reverse"
      },
      duration: 0.8,
      scale: 0.8,
      opacity: 0,
      stagger: 0.15,
      ease: "back.out(1.7)"
    });

    // Team animation
    gsap.from('.team-member', {
      scrollTrigger: {
        trigger: teamRef.current,
        start: "top 80%",
        toggleActions: "play none none reverse"
      },
      duration: 0.6,
      y: 100,
      opacity: 0,
      stagger: 0.1,
      ease: "power2.out"
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  const timelineData = [
    {
      year: "2008",
      title: "Foundation",
      description: "Magathi Financial Services was established with a vision to democratize wealth creation through mutual funds.",
      icon: FaRocket
    },
    {
      year: "2012",
      title: "First 1000 Clients",
      description: "Reached our first milestone of 1000 satisfied clients, marking the beginning of our growth journey.",
      icon: FaUsers
    },
    {
      year: "2015",
      title: "₹100 Crore AUM",
      description: "Achieved ₹100 Crore in Assets Under Management, establishing ourselves as a trusted financial partner.",
      icon: FaChartLine
    },
    {
      year: "2018",
      title: "Digital Transformation",
      description: "Launched our digital platform, making mutual fund investments accessible to everyone, anywhere.",
      icon: FaGlobe
    },
    {
      year: "2021",
      title: "₹500 Crore AUM",
      description: "Crossed ₹500 Crore in AUM, serving over 10,000 families across India.",
      icon: FaTrophy
    },
    {
      year: "2024",
      title: "Future Forward",
      description: "Continuing our mission to empower every Indian family with smart investment solutions.",
      icon: FaLightbulb
    }
  ];

  const statsData = [
    { number: "16+", label: "Years of Excellence", icon: FaTrophy },
    { number: "15,000+", label: "Happy Families", icon: FaUsers },
    { number: "₹750+", label: "Crore AUM", icon: FaChartLine },
    { number: "98%", label: "Client Retention", icon: MdStar }
  ];

  const teamData = [
    {
      name: "Rajesh Kumar",
      position: "Founder & CEO",
      experience: "20+ Years",
      expertise: "Mutual Funds & Wealth Management"
    },
    {
      name: "Priya Sharma",
      position: "Head of Operations",
      experience: "15+ Years",
      expertise: "Client Relations & Service"
    },
    {
      name: "Amit Patel",
      position: "Investment Advisor",
      experience: "12+ Years",
      expertise: "Portfolio Management"
    },
    {
      name: "Sneha Reddy",
      position: "Technology Lead",
      experience: "10+ Years",
      expertise: "Digital Solutions"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Navigation */}
      <HeaderNav />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#53755d] via-[#4a6b54] to-[#3e5d49] text-white py-20 px-4 mt-20">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="hero-title text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
            Our Journey Through Time
          </h1>
          <p className="hero-subtitle text-xl md:text-2xl opacity-90 max-w-3xl mx-auto mb-12">
            From humble beginnings to becoming a trusted name in mutual fund investments, 
            discover the story of Magathi Financial Services.
          </p>
          
          {/* Hero Stats */}
          <div className="hero-stats grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {statsData.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold mb-2">{stat.number}</div>
                <div className="text-sm opacity-80">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section ref={timelineRef} className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Our Milestone Journey
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Every step of our journey has been marked by dedication, innovation, and unwavering commitment to our clients.
            </p>
          </div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-[#53755d] h-full hidden lg:block"></div>
            
            <div className="space-y-12">
              {timelineData.map((item, index) => {
                const IconComponent = item.icon;
                const isLeft = index % 2 === 0;
                
                return (
                  <div key={index} className={`timeline-item relative flex items-center ${
                    isLeft ? 'lg:flex-row' : 'lg:flex-row-reverse'
                  } flex-col lg:space-x-8 space-y-4`}>
                    
                    {/* Timeline Content */}
                    <div className={`lg:w-1/2 ${isLeft ? 'lg:text-right' : 'lg:text-left'} text-center lg:text-left`}>
                      <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                        <div className="text-2xl font-bold text-[#53755d] mb-2">{item.year}</div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-3">{item.title}</h3>
                        <p className="text-gray-600 leading-relaxed">{item.description}</p>
                      </div>
                    </div>

                    {/* Timeline Icon */}
                    <div className="relative z-10 flex-shrink-0">
                      <div className="w-16 h-16 bg-[#53755d] rounded-full flex items-center justify-center text-white shadow-lg transform hover:scale-110 transition-transform duration-300">
                        <IconComponent className="w-8 h-8" />
                      </div>
                    </div>

                    {/* Timeline Content (Right Side) */}
                    <div className={`lg:w-1/2 ${isLeft ? 'lg:text-left' : 'lg:text-right'} text-center lg:text-right`}>
                      <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                        <div className="text-2xl font-bold text-[#53755d] mb-2">{item.year}</div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-3">{item.title}</h3>
                        <p className="text-gray-600 leading-relaxed">{item.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section ref={statsRef} className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Numbers That Define Us
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our success is measured not just in numbers, but in the trust and satisfaction of our clients.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {statsData.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className="stat-item text-center group">
                  <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                    <div className="w-16 h-16 bg-[#53755d] rounded-full flex items-center justify-center text-white mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                      <IconComponent className="w-8 h-8" />
                    </div>
                    <div className="text-3xl md:text-4xl font-bold text-[#53755d] mb-2">{stat.number}</div>
                    <div className="text-gray-600 font-medium">{stat.label}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Our Core Values
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              The principles that guide every decision we make and every relationship we build.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: MdSecurity, title: "Trust & Security", description: "Your financial security is our top priority" },
              { icon: MdHandshake, title: "Client First", description: "Every decision is made with our clients in mind" },
              { icon: MdTrendingUp, title: "Growth Focus", description: "We're committed to your long-term financial growth" },
              { icon: MdStar, title: "Excellence", description: "Striving for excellence in everything we do" }
            ].map((value, index) => {
              const IconComponent = value.icon;
              return (
                <div key={index} className="text-center group">
                  <div className="bg-gray-50 p-8 rounded-2xl hover:bg-[#53755d] hover:text-white transition-all duration-500 transform hover:-translate-y-2">
                    <div className="w-16 h-16 bg-[#53755d] group-hover:bg-white group-hover:text-[#53755d] rounded-full flex items-center justify-center text-white mx-auto mb-4 transition-all duration-500">
                      <IconComponent className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3 group-hover:text-white">{value.title}</h3>
                    <p className="text-gray-600 group-hover:text-white/90">{value.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section ref={teamRef} className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Meet Our Leadership
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              The experienced professionals who drive our mission and vision forward.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamData.map((member, index) => (
              <div key={index} className="team-member group">
                <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                  <div className="w-20 h-20 bg-[#53755d] rounded-full flex items-center justify-center text-white mx-auto mb-4 text-2xl font-bold">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2 text-center">{member.name}</h3>
                  <p className="text-[#53755d] font-medium text-center mb-3">{member.position}</p>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div><span className="font-medium">Experience:</span> {member.experience}</div>
                    <div><span className="font-medium">Expertise:</span> {member.expertise}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-[#53755d]">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Start Your Investment Journey?
          </h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Join thousands of families who trust Magathi for their financial future.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/Signup')}
              className="inline-block bg-white text-[#53755d] px-8 py-3 font-medium transition-all duration-300 hover:scale-105 hover:bg-gray-100 shadow-none hover:shadow-lg [border-top-left-radius:20px] [border-top-right-radius:0px] [border-bottom-right-radius:20px] [border-bottom-left-radius:0px]"
            >
              Get Started Today
            </button>
            <button
              onClick={() => navigate('/Calculator')}
              className="inline-block border-2 border-white text-white px-8 py-3 font-medium transition-all duration-300 hover:scale-105 hover:bg-white hover:text-[#53755d] rounded-full"
            >
              Try Our Calculator
            </button>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="bg-gray-900 text-white">
        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="lg:col-span-2">
              <div className="flex items-center mb-4">
                <img src="/src/assets/mfspl.png" alt="Magathi Logo" className="h-12 w-20 mr-4" />
                <h3 className="text-2xl font-bold text-[#53755d]">Magathi</h3>
              </div>
              <p className="text-gray-300 mb-4 max-w-md">
                Your trusted partner for smart investment solutions and financial planning. 
                Building wealth systematically with expertly curated mutual fund portfolios.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-[#53755d] transition-colors duration-300">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-[#53755d] transition-colors duration-300">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-[#53755d] transition-colors duration-300">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4 text-[#53755d]">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors duration-300">Home</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors duration-300">About Us</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors duration-300">Services</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors duration-300">Contact</a></li>
              </ul>
            </div>

            {/* Services */}
            <div>
              <h4 className="text-lg font-semibold mb-4 text-[#53755d]">Services</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors duration-300">Mutual Funds</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors duration-300">Insurance</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors duration-300">Investment Planning</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors duration-300">Wealth Management</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-gray-400 text-sm mb-4 md:mb-0">
                © 2024 Magathi Financial Services. All rights reserved.
              </div>
              <div className="flex space-x-6 text-sm text-gray-400">
                <a href="#" className="hover:text-white transition-colors duration-300">Privacy Policy</a>
                <a href="#" className="hover:text-white transition-colors duration-300">Terms of Service</a>
                <a href="#" className="hover:text-white transition-colors duration-300">Cookie Policy</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
