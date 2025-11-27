import React, { useState, useEffect, useRef } from 'react';
import { TrendingUp, Shield, Users, Award, ArrowRight, DollarSign, BarChart3, CheckCircle, Eye, Building, Globe, Monitor, Folder, Settings, Handshake, Facebook, Twitter, Mail, Phone, Target, Compass, Star } from 'lucide-react';
import { BsArrowBarRight } from "react-icons/bs";
import { FaUsers, FaTrophy, FaCalculator, FaFacebookF, FaTwitter, FaGoogle, FaBriefcase, FaChartLine, FaFileInvoice, FaDollarSign } from 'react-icons/fa';
import skill1 from '../assets/skills-1.png';
import skill2 from '../assets/skills-2.png';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import HeaderNav from '../components/HeaderNav';
import Footer from '../components/Footer';
import kannan from '../assets/kannan.jpg';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

  // --- ClientLogoSlider Component ---
  const clientLogos = [
    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjUwIiB2aWV3Qm94PSIwIDAgMjAwIDUwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iNTAiIGZpbGw9IiNmZmZmZmYiLz48dGV4dCB4PSIxMDAiIHk9IjMwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjY2NjY2NjIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTIiPkNsaWVudCBMb2dvPC90ZXh0Pjwvc3ZnPg==",
    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjUwIiB2aWV3Qm94PSIwIDAgMjAwIDUwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iNTAiIGZpbGw9IiNmZmZmZmYiLz48dGV4dCB4PSIxMDAiIHk9IjMwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjY2NjY2NjIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTIiPkNsaWVudCBMb2dvPC90ZXh0Pjwvc3ZnPg==",
    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjUwIiB2aWV3Qm94PSIwIDAgMjAwIDUwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iNTAiIGZpbGw9IiNmZmZmZmYiLz48dGV4dCB4PSIxMDAiIHk9IjMwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjY2NjY2NjIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTIiPkNsaWVudCBMb2dvPC90ZXh0Pjwvc3ZnPg==",
    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjUwIiB2aWV3Qm94PSIwIDAgMjAwIDUwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iNTAiIGZpbGw9IiNmZmZmZmYiLz48dGV4dCB4PSIxMDAiIHk9IjMwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjY2NjY2NjIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTIiPkNsaWVudCBMb2dvPC90ZXh0Pjwvc3ZnPg==",
    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjUwIiB2aWV3Qm94PSIwIDAgMjAwIDUwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iNTAiIGZpbGw9IiNmZmZmZmYiLz48dGV4dCB4PSIxMDAiIHk9IjMwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjY2NjY2NjIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTIiPkNsaWVudCBMb2dvPC90ZXh0Pjwvc3ZnPg==",
    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjUwIiB2aWV3Qm94PSIwIDAgMjAwIDUwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iNTAiIGZpbGw9IiNmZmZmZmYiLz48dGV4dCB4PSIxMDAiIHk9IjMwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjY2NjY2NjIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTIiPkNsaWVudCBMb2dvPC90ZXh0Pjwvc3ZnPg==",
    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjUwIiB2aWV3Qm94PSIwIDAgMjAwIDUwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iNTAiIGZpbGw9IiNmZmZmZmYiLz48dGV4dCB4PSIxMDAiIHk9IjMwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjY2NjY2NjIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTIiPkNsaWVudCBMb2dvPC90ZXh0Pjwvc3ZnPg=="
  ];

  const ClientLogoSlider = () => {
    const sliderRef = useRef(null);

    useEffect(() => {
      const ctx = gsap.context(() => {
        gsap.to(sliderRef.current, {
          xPercent: -100,
          repeat: -1,
          duration: 20,
          ease: "linear"
        });
      }, sliderRef);
      return () => ctx.revert();
    }, []);

    return (
      <div className="overflow-hidden w-full">
        <div
          ref={sliderRef}
          className="flex gap-8 items-center w-max"
          style={{ minWidth: "100%" }}
        >
          {clientLogos.concat(clientLogos).map((logo, idx) => (
            <div key={idx} className="flex-shrink-0 w-[170px] h-[70px] bg-white flex items-center justify-center shadow-md">
              <img src={logo} alt="Client Logo" className="w-16 h-16 object-contain" />
            </div>
          ))}
        </div>
      </div>
    );
  };

  const BenefitCard = ({ icon, title, desc }) => {
    const cardRef = useRef(null);

    useEffect(() => {
      gsap.from(cardRef.current, {
        opacity: 0,
        y: 40,
        scrollTrigger: {
          trigger: cardRef.current,
          start: "top 90%",
          toggleActions: "play none none reverse"
        },
        duration: 0.5,
        ease: "power2.out"
      });
    }, []);

    return (
      <div ref={cardRef} className="bg-[#53755d] rounded-xl p-8 text-center shadow-lg text-white">
        <div className="text-4xl mb-4">{icon}</div>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-white/80 text-sm">{desc}</p>
      </div>
    );
  };

  const ProcessStep = ({ step, title, desc }) => {
    const stepRef = useRef(null);

    useEffect(() => {
      gsap.from(stepRef.current, {
        opacity: 0,
        y: 40,
        scrollTrigger: {
          trigger: stepRef.current,
          start: "top 90%",
          toggleActions: "play none none reverse"
        },
        duration: 0.5,
        ease: "power2.out"
      });
    }, []);

    return (
      <div ref={stepRef} className="bg-white rounded-xl p-8 text-center shadow-lg text-[#53755d]">
        <div className="text-3xl font-bold mb-2">{step}</div>
        <h3 className="text-lg font-bold mb-2">{title}</h3>
        <p className="text-[#53755d] text-sm">{desc}</p>
      </div>
    );
  };

  const MilestoneItem = ({ milestone, index }) => {
    const milestoneRef = useRef(null);
    const cardRef = useRef(null);
    
    useEffect(() => {
      if (milestoneRef.current && cardRef.current) {
        const ctx = gsap.context(() => {
          gsap.from(milestoneRef.current, {
            opacity: 0,
            scale: 0,
            scrollTrigger: {
              trigger: milestoneRef.current,
              start: "top 80%",
              toggleActions: "play none none reverse"
            },
            duration: 0.8,
            delay: index * 0.15,
            ease: "elastic.out(1, 0.5)"
          });
          
          gsap.from(cardRef.current, {
            opacity: 0,
            y: 50,
            scrollTrigger: {
              trigger: cardRef.current,
              start: "top 85%",
              toggleActions: "play none none reverse"
            },
            duration: 0.6,
            delay: index * 0.15 + 0.2,
            ease: "power3.out"
          });
        }, milestoneRef);
        return () => ctx.revert();
      }
    }, [index]);

    return (
      <div className="relative flex flex-col items-center group h-full">
        {/* Timeline Node */}
        <div 
          ref={milestoneRef}
          className="relative z-20 mb-6 lg:mb-8 flex-shrink-0"
        >
          <div className="relative">
            {/* Outer Glow Rings - Desktop Only */}
            <div className="hidden lg:block absolute inset-0 w-20 h-20 bg-[#53755d] rounded-full blur-2xl opacity-30 group-hover:opacity-50 transition-opacity duration-300 animate-pulse -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2"></div>
            <div className="hidden lg:block absolute inset-0 w-16 h-16 bg-white rounded-full blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-300 -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2"></div>
            
            {/* Main Hexagonal Node */}
            <div className="relative w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-[#53755d] to-[#3e5d49] transform rotate-45 group-hover:rotate-90 transition-all duration-500 shadow-2xl border-2 border-white mx-auto group-hover:scale-110">
              <div className="absolute inset-0 flex items-center justify-center transform -rotate-45 group-hover:-rotate-90 transition-transform duration-500 text-white">
                {milestone.icon}
              </div>
              {/* Inner Glow Pulse */}
              <div className="absolute inset-0 border-2 border-white/40 animate-ping"></div>
              {/* Shine Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent rounded-lg"></div>
              {/* Corner Accents */}
              <div className="absolute -top-1 -left-1 w-3 h-3 bg-white rounded-full shadow-lg"></div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full shadow-lg"></div>
              <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-white rounded-full shadow-lg"></div>
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-white rounded-full shadow-lg"></div>
            </div>
          </div>
        </div>
        
        {/* Content Card - Equal Height */}
        <div 
          ref={cardRef}
          className="w-full relative group flex-1 flex flex-col"
        >
          <div className="relative bg-gradient-to-br from-white via-gray-50 to-white rounded-2xl lg:rounded-3xl p-6 lg:p-8 shadow-xl lg:shadow-2xl border-2 border-gray-200/50 hover:border-[#53755d]/50 transition-all duration-500 group-hover:shadow-[#53755d]/30 group-hover:shadow-2xl transform group-hover:scale-[1.03] group-hover:-translate-y-2 overflow-hidden flex flex-col h-full">
            {/* Top Accent Line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#53755d] via-white to-[#53755d] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center"></div>
            
            {/* Animated Background Gradient */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-0" style={{
              background: 'linear-gradient(135deg, rgb(232, 245, 233) 0%, rgb(245, 245, 245) 100%)'
            }}></div>
            
            {/* Hexagonal Pattern Overlay */}
            <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-500" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2353755d' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}></div>
            
            {/* Decorative Corner Elements */}
            <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-[#53755d]/20 rounded-tr-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-[#53755d]/20 rounded-bl-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            {/* Content */}
            <div className="relative z-10 text-center flex flex-col flex-1">
              {/* Year Badge */}
              <div className="mb-5 flex items-center justify-center">
                <span className="inline-block px-5 py-2.5 bg-gradient-to-r from-[#53755d] to-[#3e5d49] text-white text-base lg:text-lg font-bold rounded-xl shadow-lg transform group-hover:scale-110 group-hover:shadow-xl transition-all duration-300">
                  {milestone.year}
                </span>
              </div>
              
              {/* Category */}
              <div className="mb-4 flex-shrink-0">
                <h3 className="text-xl lg:text-2xl font-bold text-gray-900 group-hover:text-[#53755d] transition-colors duration-300 leading-tight">
                  {milestone.category}
                </h3>
              </div>
              
              {/* Achievement */}
              <p className="text-sm lg:text-base text-gray-600 leading-relaxed group-hover:text-gray-800 transition-colors duration-300 flex-1">
                {milestone.achievement}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const MutualFundsSection = () => {
    // Mutual Funds state/refs
    const [isVisible, setIsVisible] = useState(false);
    const [counts, setCounts] = useState({});
    const [hasStartedCounting, setHasStartedCounting] = useState(false);
    const sectionRef = useRef(null);

    // Trust Indicators state/refs
    const [trustCounts, setTrustCounts] = useState({});
    const [hasStartedTrustCounting, setHasStartedTrustCounting] = useState(false);
    const trustSectionRef = useRef(null);

    // Financial Planning state/refs
    const [activeTab, setActiveTab] = useState('overview');
    const fpSectionRef = useRef(null);
    const leftContentRef = useRef(null);
    const rightSidebarRef = useRef(null);
    const yellowBoxRef = useRef(null);
    const grayBoxRef = useRef(null);

    useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        },
        { threshold: 0.1 }
      );
      if (sectionRef.current) observer.observe(sectionRef.current);
      return () => observer.disconnect();
    }, []);

    useEffect(() => {
      if (isVisible && !hasStartedCounting) {
        setHasStartedCounting(true);
        setTimeout(() => {
          startCounting();
        }, 100);
      }
    }, [isVisible, hasStartedCounting]);

    // Trust Indicators IntersectionObserver
    useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !hasStartedTrustCounting) {
            setHasStartedTrustCounting(true);
            setTimeout(() => {
              startTrustCounting();
            }, 100);
          }
        },
        { threshold: 0.1 }
      );
      if (trustSectionRef.current) observer.observe(trustSectionRef.current);
      return () => observer.disconnect();
    }, [hasStartedTrustCounting]);

    useEffect(() => {
      // Only run GSAP animations if refs are available
      if (!fpSectionRef.current || !leftContentRef.current || !rightSidebarRef.current || !yellowBoxRef.current || !grayBoxRef.current) {
        return;
      }

      const ctx = gsap.context(() => {
        const refs = [leftContentRef.current, rightSidebarRef.current, yellowBoxRef.current, grayBoxRef.current].filter(Boolean);
        
        if (refs.length > 0) {
          gsap.set(refs, {
            opacity: 0,
            y: 50
          });
        }

        if (fpSectionRef.current) {
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: fpSectionRef.current,
              start: "top 80%",
              end: "bottom 20%",
              toggleActions: "play none none reverse"
            }
          });
          
          if (leftContentRef.current) {
            tl.to(leftContentRef.current, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" });
          }
          if (rightSidebarRef.current) {
            tl.to(rightSidebarRef.current, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }, 0.05);
          }
          if (yellowBoxRef.current) {
            tl.to(yellowBoxRef.current, { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }, 0.1);
          }
          if (grayBoxRef.current) {
            tl.to(grayBoxRef.current, { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }, 0.15);
          }
        }
      }, fpSectionRef);
      
      return () => ctx.revert();
    }, []);

    const features = [
      { icon: <Shield className="w-8 h-8" />, title: "SEBI Regulated", description: "All our mutual funds are regulated by Securities and Exchange Board of India" },
      { icon: <TrendingUp className="w-8 h-8" />, title: "High Returns", description: "Professionally managed portfolios with consistent growth potential" },
      { icon: <Users className="w-8 h-8" />, title: "Expert Management", description: "Managed by certified financial experts with years of experience" },
      { icon: <Award className="w-8 h-8" />, title: "Award Winning", description: "Recognized by leading financial institutions for excellence" }
    ];

    const stats = [
      { number: "₹50,000Cr+", label: "Assets Under Management" },
      { number: "5L+", label: "Happy Investors" },
      { number: "15+", label: "Years of Excellence" },
      { number: "25+", label: "Fund Options" }
    ];

  const whyChooseUsFeatures = [
    { icon: <Shield className="w-8 h-8" />, title: "Dedicated Specialists", description: "Duis eget diam quis elit dictum alidvolutpat terdunt thanissim non intwesollis eu mauris.", buttonText: "Meet the team" },
    { icon: <TrendingUp className="w-8 h-8" />, title: "Success Stories Rating", description: "Integer facilisis fringilla dolor ut luctus lvinar felis miat velitliquam at lorem fermentum orci.", buttonText: "View Client Review" },
    { icon: <Award className="w-8 h-8" />, title: "No front Appraisal Fees!", description: "Integer falsis fringilla dolor ut luctus nisl enenar felis viverra dignissim fermentum orci.", buttonText: "Why choose us" }
  ];

    const tabs = [
      { id: 'overview', label: 'Overview' },
      { id: 'mission', label: 'Mission & Vision' },
      { id: 'board', label: 'Board of Directors' },
      { id: 'management', label: 'Management Team' },
      { id: 'testimonials', label: 'Testimonials' },
      { id: 'faq', label: 'Frequently Ask Questions' }
    ];

    const content = {
      overview: {
        intro: "Our financial planning expertise covers eiusmod tempor dunt ut labore et dolore magna eiusmod tempor incididunt ut labore et dolore magna aliqua. Adipiscing elit sed do eiusmod tempor incididunt lorem eter dolore magna aliqua quis nostrud exercitiat ulam uconse.",
        capabilities: { title: "CAPABILITIES", text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod tempor incididunt bore eter dolore magna aliqua quis nostrud exercitation ullamco uconsequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit sed tempor." },
        specialised: { title: "SPECIALISED", text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." },
        strategic: { title: "Our Strategic Planning", text: "Lorem ipsum dolor sit amet, consectetur iscing elit sed do eiusmod tempor incididunt bore eter dolore magna aliqua quis nostrud exercita." },
        vision: { title: "Our Vision", text: "Consectetur adipiscing elit sed do eiusmod tempor incididunt quis nostrud exercitation ullanco labore nisl uton alique eron eiusmod tempor commodo consequat." },
        mission: { title: "Our Mission", text: "To strive towards adding value to the consectet tempor incididunt quis nostrud aliquip eron eiusmod tempor commodo conquat exercitation ullanco laboris nisl uton." },
        strategy: { title: "Our Strategy", text: "To identify potential areas of improvement within the ipsum dolor sit amet consectetur adipiscing elit. These eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exetipation" },
        values: { title: "Our Values", items: ["Innovation", "Excellence", "Respect", "Integrity"] }
      },
      mission: {
        intro: "Our mission and vision guide everything we do, from strategic planning to daily operations.",
        capabilities: { title: "VISION STATEMENT", text: "To be the leading financial planning firm that transforms businesses through innovative solutions and strategic expertise." },
        specialised: { title: "MISSION FOCUS", text: "We specialize in delivering comprehensive financial strategies that drive sustainable growth for our clients." },
        strategic: { title: "Strategic Vision", text: "Our strategic vision encompasses long-term growth, client satisfaction, and market leadership through continuous innovation." },
        vision: { title: "Core Vision", text: "To create lasting value for our clients by providing exceptional financial planning services and strategic guidance." },
        mission: { title: "Mission Statement", text: "Empowering businesses with strategic financial solutions that drive growth, efficiency, and long-term success." },
        strategy: { title: "Implementation Strategy", text: "We implement our mission through dedicated client service, continuous learning, and innovative approaches to financial challenges." },
        values: { title: "Mission Values", items: ["Client-Centric", "Innovation", "Excellence", "Integrity"] }
      },
      board: {
        intro: "Our board of directors brings decades of combined experience in financial planning and strategic business development.",
        capabilities: { title: "BOARD EXPERTISE", text: "Our directors have extensive backgrounds in finance, accounting, and business strategy, ensuring comprehensive oversight." },
        specialised: { title: "LEADERSHIP FOCUS", text: "Specialized leadership in corporate governance, risk management, and strategic planning initiatives." },
        strategic: { title: "Board Strategic Role", text: "The board provides strategic direction and oversight to ensure we meet our commitments to clients and stakeholders." },
        vision: { title: "Leadership Vision", text: "Our board envisions a future where financial planning drives sustainable business growth across all sectors." },
        mission: { title: "Board Mission", text: "To provide governance and strategic oversight that ensures exceptional service delivery and sustainable growth." },
        strategy: { title: "Governance Strategy", text: "Implementing robust governance frameworks that support innovation while maintaining the highest standards of accountability." },
        values: { title: "Board Values", items: ["Governance", "Accountability", "Strategic Thinking", "Ethical Leadership"] }
      },
      management: {
        intro: "Our management team combines strategic vision with operational excellence to deliver outstanding results for our clients.",
        capabilities: { title: "MANAGEMENT SKILLS", text: "Our team possesses diverse skills in financial analysis, project management, and client relationship building." },
        specialised: { title: "TEAM EXPERTISE", text: "Specialized expertise in financial modeling, risk assessment, and strategic business development." },
        strategic: { title: "Management Strategy", text: "Our management approach focuses on collaborative leadership and data-driven decision making." },
        vision: { title: "Team Vision", text: "To build and lead high-performing teams that consistently exceed client expectations and drive innovation." },
        mission: { title: "Management Mission", text: "Creating an environment of excellence where talent thrives and clients receive unparalleled service." },
        strategy: { title: "Team Strategy", text: "Developing and retaining top talent while fostering a culture of continuous improvement and client focus." },
        values: { title: "Team Values", items: ["Collaboration", "Excellence", "Innovation", "Client Focus"] }
      },
      testimonials: {
        intro: "Our clients' success stories speak to the quality and effectiveness of our financial planning services.",
        capabilities: { title: "CLIENT SUCCESS", text: "We have helped hundreds of clients achieve their financial goals through strategic planning and expert guidance." },
        specialised: { title: "PROVEN RESULTS", text: "Specialized in delivering measurable results that exceed client expectations and drive business growth." },
        strategic: { title: "Success Stories", text: "Our strategic approach has led to significant improvements in client financial performance and business outcomes." },
        vision: { title: "Client Vision", text: "We envision long-term partnerships where our clients achieve sustainable growth and financial stability." },
        mission: { title: "Service Mission", text: "To consistently deliver exceptional results that transform our clients' financial landscape and business prospects." },
        strategy: { title: "Client Strategy", text: "Building lasting relationships through transparent communication, reliable service, and consistent value delivery." },
        values: { title: "Service Values", items: ["Client Success", "Reliability", "Transparency", "Results-Driven"] }
      },
      faq: {
        intro: "Find answers to the most commonly asked questions about our financial planning services and processes.",
        capabilities: { title: "SERVICE INQUIRIES", text: "Common questions about our capabilities, service offerings, and how we can help your business grow." },
        specialised: { title: "EXPERT ANSWERS", text: "Specialized responses to technical questions about financial planning, strategy, and implementation." },
        strategic: { title: "Planning Questions", text: "Frequently asked questions about our strategic planning process and how we tailor solutions to each client." },
        vision: { title: "Process Questions", text: "Understanding our approach, methodology, and what clients can expect throughout their journey with us." },
        mission: { title: "Service Questions", text: "Common inquiries about our service delivery, timelines, and how we ensure client satisfaction." },
        strategy: { title: "Implementation Questions", text: "Questions about how we implement strategies, measure success, and provide ongoing support to our clients." },
        values: { title: "Common Questions", items: ["How do you start?", "What are the costs?", "Timeline expectations?", "Success metrics?"] }
      }
    };

    const extractNumericValue = (numberString) => {
      if (numberString.includes('Cr')) {
        return parseInt(numberString.replace(/[^\d]/g, '')) * 10000;
      } else if (numberString.includes('L')) {
        return parseInt(numberString.replace(/[^\d]/g, '')) * 100000;
      }
      return parseInt(numberString.replace(/[^\d]/g, ''));
    };

    const formatNumber = (value, originalString) => {
      if (originalString.includes('Cr+')) {
        return `₹${Math.floor(value / 10000)}Cr+`;
      } else if (originalString.includes('L+')) {
        return `${Math.floor(value / 100000)}L+`;
      } else if (originalString.includes('+')) {
        return `${value}+`;
      }
      return value.toString();
    };

    const startCounting = () => {
      stats.forEach((stat, index) => {
        const targetValue = extractNumericValue(stat.number);
        const duration = 2000;
        const steps = 60;
        const increment = targetValue / steps;
        let currentValue = 0;
        const timer = setInterval(() => {
          currentValue += increment;
          if (currentValue >= targetValue) {
            currentValue = targetValue;
            clearInterval(timer);
          }
          setCounts(prev => ({
            ...prev,
            [index]: Math.floor(currentValue)
          }));
        }, duration / steps);
      });
    };

    const startTrustCounting = () => {
      const trustStats = [
        { value: "100%" },
        { value: "99.9%" },
        { value: "100%" },
        { value: "20+" }
      ];

      trustStats.forEach((stat, index) => {
        let targetValue;
        let isPercentage = false;
        let hasPlus = false;

        if (stat.value.includes('%')) {
          isPercentage = true;
          targetValue = parseFloat(stat.value.replace('%', ''));
        } else if (stat.value.includes('+')) {
          hasPlus = true;
          targetValue = parseInt(stat.value.replace('+', ''));
        } else {
          targetValue = parseFloat(stat.value);
        }

        const duration = 2000;
        const steps = 60;
        const increment = targetValue / steps;
        let currentValue = 0;
        const timer = setInterval(() => {
          currentValue += increment;
          if (currentValue >= targetValue) {
            currentValue = targetValue;
            clearInterval(timer);
          }
          setTrustCounts(prev => ({
            ...prev,
            [index]: isPercentage ? currentValue : currentValue
          }));
        }, duration / steps);
      });
    };

    const handleTabChange = (tabId) => {
      if (!leftContentRef.current) {
        setActiveTab(tabId);
        return;
      }

      gsap.to(leftContentRef.current, {
        opacity: 0,
        y: 20,
        duration: 0.3,
        ease: "power2.inOut",
        onComplete: () => {
          setActiveTab(tabId);
          if (leftContentRef.current) {
            gsap.to(leftContentRef.current, {
              opacity: 1,
              y: 0,
              duration: 0.3,
              ease: "power2.out"
            });
          }
        }
      });
    };

    const currentContent = content[activeTab];

    return (
      <section>
        <HeaderNav />
        {/* Page Title Section */}
        <section className="relative py-24 bg-cover bg-center overflow-hidden" style={{ backgroundImage: "url('/src/assets/banner-1.jpg')" }}>
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30"></div>
            <div className="relative z-10 container mx-auto px-4">
            <div className="text-center text-white max-w-4xl mx-auto">
                <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-green-200 bg-clip-text text-transparent">
                About Us
                </h1>
                <p className="text-lg md:text-xl text-gray-200 mb-8 leading-relaxed">
                 Professional wealth management with government-regulated transparency and compliance
                </p>
                <nav className="flex flex-wrap justify-center items-center space-x-2 md:space-x-3 text-sm md:text-base bg-white/10 backdrop-blur-sm rounded-full px-4 md:px-6 py-2 md:py-3 inline-flex">
                <a href="/" className="hover:text-green-300 transition-colors">Home</a>
                <span className="text-gray-400">/</span>
                <span className="text-green-300 font-medium">About Us</span>
                </nav>
            </div>
            </div>
        </section>
        {/* Mutual Funds Main Content Grid */}
        <div ref={sectionRef} className="overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-16">
              <div className={`transform transition-all duration-500 delay-50 ${
                isVisible ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'
              }`}>
                <div className="relative">
                  <div className="p-20">
                    <div className="aspect-video flex items-center justify-center mb-6">
                      <div className="grid grid-cols-2">
                        <div className="flex items-start justify-center">  
                          <img src={skill1} alt="Skill 1" className="h-64 sm:h-80 md:h-96 w-full max-w-xs object-cover rounded-lg" />
                        </div>
                        <div className="flex items-start justify-center mt-8 sm:mt-12 md:mt-16 relative">
                          <img src={skill2} alt="Skill 2" className="h-56 sm:h-72 md:h-80 w-full max-w-xs object-cover rounded-tl-[30px] rounded-tr-[8px] rounded-br-none rounded-bl-none" />
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 bg-white overflow-hidden">
                      {stats.map((stat, index) => {
                        const isRightColumn = index % 2 === 1;
                        const isBottomRow = index >= 2;
                        let borderClasses = '';
                        if (!isRightColumn) borderClasses += 'border-r ';
                        if (!isBottomRow) borderClasses += 'border-b ';
                        const currentCount = counts[index] || 0;
                        const displayValue = formatNumber(currentCount, stat.number);
                        return (
                          <div 
                            key={index}
                            className={`text-center p-4 bg-white transform transition-all duration-300 delay-${50 + index * 50} cursor-pointer hover:scale-105 hover:shadow-lg hover:shadow-gray-200 hover:-translate-y-1 ${borderClasses}border-gray-300 ${
                              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
                            }`}
                          >
                            <div className="text-4xl font-normal text-[#53755d] mb-1">
                              {displayValue}
                            </div>
                            <div className="text-sm text-gray-600">{stat.label}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
              <div className={`transform transition-all duration-500 delay-100 ${
                isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'
              }`}>
                <div className="p-8">
                  <div className="lg:col-span-4 order-2 lg:order-1">
                    <div className="space-y-6">
                      {/* Header Section */}
                      <div className="text-center mb-12 md:mb-16">
                        <div>
                          <span className="text-[#53755d] text-sm font-medium bg-[#53755d]/10 px-4 py-2 rounded-full inline-block mb-4">
                            OUR STORY
                          </span>
                        </div>
                        <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                          Service Since 2004
                        </h3>
                      </div>
                      <div className={`space-y-6 transition-all duration-500 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                        <p className="text-gray-600 leading-relaxed text-base md:text-lg">
                          Magathi Financial Services Pvt Ltd. is a team of Financial Professionals with enriching experience over 20 years. Our Endeavour is to uplift the financial health of our clients by providing professional Financial stability after doing a 360-degree analysis. We strive to help the clients achieve their goal by being transparent and providing a platform with ample products and impeccable services. We comprehend all your dreams, desire, goals and create the most efficient financial stability. Long term commitment with our customers is one key principle we follow which makes us stand out in the market.
                        </p>
                        <div className="pt-4">
                          <a href="#" className="inline-block bg-gradient-to-r from-[#53755d] to-[#3e5d49] text-white px-8 py-3 font-medium transition-all duration-300 hover:scale-105 hover:shadow-xl shadow-lg [border-top-left-radius:20px] [border-top-right-radius:0px] [border-bottom-right-radius:20px] [border-bottom-left-radius:0px]">
                            Our History
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Trust Indicators - Professional Corporate Design */}
            <div className={`transform transition-all duration-500 delay-150 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}>
              <div className="relative bg-white py-20 md:py-24 overflow-hidden">
                {/* Subtle Background Pattern */}
                <div className="absolute inset-0 opacity-[0.02]">
                  <div className="absolute inset-0" style={{
                    backgroundImage: `linear-gradient(90deg, #53755d 1px, transparent 1px),
                                    linear-gradient(#53755d 1px, transparent 1px)`,
                    backgroundSize: '50px 50px'
                  }}></div>
                </div>
                
                {/* Accent Lines */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#53755d]/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#53755d]/20 to-transparent"></div>
                
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                  {/* Header Section */}
                  <div className="text-center mb-16 md:mb-20">
                    <div className="inline-flex items-center gap-3 mb-6">
                      {/* <div className="h-px w-12 bg-[#53755d]"></div> */}
                      <span className="text-[#53755d] text-sm font-medium bg-[#53755d]/10 px-4 py-2 rounded-full">
                        TRUST & COMPLIANCE
                      </span>
                      {/* <div className="h-px w-12 bg-[#53755d]"></div> */}
                    </div>
                    
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mt-4 mb-4">
                      Trusted by Government & Financial Institutions
                    </h2>
                    
                    <div className="max-w-2xl mx-auto">
                      <p className="text-gray-600 text-lg md:text-xl leading-relaxed">
                        We maintain the highest standards of regulatory compliance and transparency, ensuring your investments are protected and managed with integrity.
                      </p>
                    </div>
                  </div>
                  
                  {/* Professional Cards Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
                    {[
                      { 
                        title: "RBI Guidelines", 
                        description: "Compliant with Reserve Bank of India regulations",
                        subtitle: "Reserve Bank of India",
                        icon: <Shield className="w-6 h-6" />,
                        number: "01"
                      },
                      { 
                        title: "SEBI Registered", 
                        description: "Securities and Exchange Board certified",
                        subtitle: "Securities Exchange Board",
                        icon: <Award className="w-6 h-6" />,
                        number: "02"
                      },
                      { 
                        title: "AMFI Member", 
                        description: "Association of Mutual Funds in India member",
                        subtitle: "Association of Mutual Funds",
                        icon: <CheckCircle className="w-6 h-6" />,
                        number: "03"
                      }
                    ].map((item, index) => (
                      <div 
                        key={index}
                        className="group relative"
                      >
                        {/* Card Container */}
                        <div className="relative h-full bg-white border-2 border-gray-200 hover:border-[#53755d] transition-all duration-300 hover:shadow-xl overflow-hidden">
                          {/* Top Accent Bar */}
                          <div className="absolute top-0 left-0 right-0 h-1 bg-[#53755d] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                          
                          {/* Number Badge */}
                          <div className="absolute top-6 right-6 w-12 h-12 flex items-center justify-center bg-[#53755d]/5 group-hover:bg-[#53755d] transition-colors duration-300">
                            <span className="text-[#53755d] group-hover:text-white font-bold text-lg transition-colors duration-300">
                              {item.number}
                            </span>
                          </div>
                          
                          {/* Content */}
                          <div className="p-8 md:p-10">
                            {/* Icon Section */}
                            <div className="mb-6">
                              <div className="inline-flex items-center justify-center w-16 h-16 bg-[#53755d]/10 group-hover:bg-[#53755d] transition-all duration-300 mb-4">
                                <div className="text-[#53755d] group-hover:text-white transition-colors duration-300">
                                  {item.icon}
                                </div>
                              </div>
                              
                              {/* Subtitle */}
                              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                                {item.subtitle}
                              </p>
                            </div>
                            
                            {/* Title */}
                            <h4 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-[#53755d] transition-colors duration-300">
                              {item.title}
                            </h4>
                            
                            {/* Description */}
                            <p className="text-gray-600 text-base leading-relaxed mb-8">
                              {item.description}
                            </p>
                            
                            {/* CTA Link */}
                            <div className="flex items-center">
                              <a 
                                href="#" 
                                className="group/link inline-flex items-center gap-2 text-[#53755d] font-semibold text-sm hover:gap-3 transition-all duration-300"
                              >
                                <span>Learn More</span>
                                <BsArrowBarRight className="w-4 h-4 transform group-hover/link:translate-x-1 transition-transform duration-300" />
                              </a>
                            </div>
                          </div>
                          
                          {/* Bottom Border Accent */}
                          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#53755d] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Bottom Trust Indicators */}
                  <div ref={trustSectionRef} className="mt-16 pt-12 border-t border-gray-200">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                      {[
                        { label: "Regulatory Compliance", value: "100%" },
                        { label: "Client Trust", value: "99.9%" },
                        { label: "Transparency", value: "100%" },
                        { label: "Years of Service", value: "20+" }
                      ].map((stat, idx) => {
                        const currentCount = trustCounts[idx] !== undefined ? trustCounts[idx] : 0;
                        let displayValue = stat.value;
                        
                        if (stat.value.includes('%')) {
                          displayValue = `${currentCount.toFixed(stat.value === "99.9%" ? 1 : 0)}%`;
                        } else if (stat.value.includes('+')) {
                          displayValue = `${Math.floor(currentCount)}+`;
                        }
                        
                        return (
                          <div key={idx} className="group">
                            <div 
                              className="text-5xl md:text-6xl lg:text-7xl font-bold text-transparent mb-2 group-hover:scale-110 transition-transform duration-300"
                              style={{
                                WebkitTextStroke: '2px #53755d',
                                textStroke: '2px #53755d'
                              }}
                            >
                              {displayValue}
                            </div>
                            <div className="text-sm text-gray-600 font-medium">
                              {stat.label}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Vision Mission Values Section - Unique Asymmetric Design */}
        <div className="py-20 px-4 bg-gradient-to-br from-gray-50 via-white to-gray-50 relative overflow-hidden">
          {/* Animated Background Pattern */}
          <div className="absolute inset-0 opacity-[0.03]">
            <div className="absolute top-0 left-0 w-full h-full" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50 50m-40 0a40 40 0 1 1 80 0a40 40 0 1 1 -80 0' fill='%2353755d'/%3E%3C/svg%3E")`,
              backgroundSize: '60px 60px'
            }}></div>
          </div>
          
          {/* Floating Orbs */}
          <div className="absolute top-20 right-20 w-96 h-96 bg-[#53755d]/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 left-20 w-80 h-80 bg-[#53755d]/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          
          <div className="max-w-7xl mx-auto relative z-10">
            {/* Section Header */}
            <div className="text-center mb-16 md:mb-20">
              <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                <span className="text-[#53755d] text-sm font-semibold bg-[#53755d]/10 px-6 py-2.5 rounded-full inline-block mb-5 tracking-wider uppercase">
                  Our Foundation
                </span>
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mt-4 mb-4">
                  Our Vision Mission
                    {/* <span className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#53755d] to-transparent"></span> */}
                </h2>
              </div>
            </div>
            
            {/* Unique Asymmetric Layout */}
            <div className="relative">
              {/* Connecting Line - Desktop Only */}
              <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#53755d]/30 to-transparent transform -translate-y-1/2 z-0"></div>
              
              <div className="space-y-12 md:space-y-16">
                {/* Vision Card - Left Aligned with Large Icon */}
                <div className={`transform transition-all duration-700 delay-100 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
                  <div className="relative">
                    <div className="flex flex-col lg:flex-row items-start gap-8 lg:gap-12">
                      {/* Large Icon Side */}
                      <div className="lg:w-1/3 flex-shrink-0">
                        <div className="relative">
                          <div className="w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 bg-gradient-to-br from-[#53755d] to-[#3e5d49] rounded-3xl flex items-center justify-center shadow-2xl transform rotate-[-5deg] hover:rotate-0 transition-all duration-500 group">
                            <Target className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 text-white group-hover:scale-110 transition-transform duration-300" />
                          </div>
                          {/* Decorative Elements */}
                          <div className="absolute -top-4 -right-4 w-16 h-16 bg-[#53755d]/20 rounded-full blur-xl"></div>
                          <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-[#53755d]/20 rounded-full blur-xl"></div>
                        </div>
                      </div>
                      
                      {/* Content Side */}
                      <div className="lg:w-2/3 lg:pt-8">
                        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10 lg:p-12 border-l-4 border-[#53755d] relative overflow-hidden group hover:shadow-[#53755d]/20 hover:shadow-2xl transition-all duration-300">
                          {/* Corner Accent */}
                          <div className="absolute top-0 right-0 w-32 h-32 bg-[#53755d]/5 rounded-bl-full"></div>
                          
                          <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-4">
                              <span className="text-[#53755d] text-xs font-bold uppercase tracking-widest">01</span>
                              <div className="h-px flex-1 bg-gradient-to-r from-[#53755d] to-transparent"></div>
                            </div>
                            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 group-hover:text-[#53755d] transition-colors duration-300">
                              Our Vision
                            </h3>
                            <p className="text-gray-600 leading-relaxed text-base md:text-lg lg:text-xl">
                              To establish MFSPL (Magathi Financial Services Pvt.Ltd) as one of the foremost financial companies by persistently committing to our service excellence for our customers which satisfies their dynamic needs.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Mission Card - Right Aligned with Center Focus */}
                <div className={`transform transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
                  <div className="relative">
                    <div className="flex flex-col lg:flex-row-reverse items-start gap-8 lg:gap-12">
                      {/* Large Icon Side */}
                      <div className="lg:w-1/3 flex-shrink-0">
                        <div className="relative">
                          <div className="w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 bg-gradient-to-br from-[#53755d] to-[#3e5d49] rounded-3xl flex items-center justify-center shadow-2xl transform rotate-[5deg] hover:rotate-0 transition-all duration-500 group">
                            <Compass className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 text-white group-hover:scale-110 transition-transform duration-300" />
                          </div>
                          {/* Decorative Elements */}
                          <div className="absolute -top-4 -left-4 w-16 h-16 bg-[#53755d]/20 rounded-full blur-xl"></div>
                          <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-[#53755d]/20 rounded-full blur-xl"></div>
                        </div>
                      </div>
                      
                      {/* Content Side */}
                      <div className="lg:w-2/3 lg:pt-8">
                        <div className="bg-gradient-to-br from-[#53755d] to-[#3e5d49] rounded-3xl shadow-2xl p-8 md:p-10 lg:p-12 border-r-4 border-white/30 relative overflow-hidden group hover:shadow-2xl transition-all duration-300">
                          <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-4">
                              <span className="text-white/80 text-xs font-bold uppercase tracking-widest">02</span>
                              <div className="h-px flex-1 bg-gradient-to-r from-white/30 to-transparent"></div>
                            </div>
                            <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
                              Our Mission
                            </h3>
                            <p className="text-white/95 leading-relaxed text-base md:text-lg lg:text-xl">
                              To create a positive financial environment for our clients through a lifetime commitment to our individual & corporate customers by guiding them with customized risk & wealth management solutions.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Values Card - Left Aligned with Large Icon (Same as Vision) */}
                <div className={`transform transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
                  <div className="relative">
                    <div className="flex flex-col lg:flex-row items-start gap-8 lg:gap-12">
                      {/* Large Icon Side */}
                      <div className="lg:w-1/3 flex-shrink-0">
                        <div className="relative">
                          <div className="w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 bg-gradient-to-br from-[#53755d] to-[#3e5d49] rounded-3xl flex items-center justify-center shadow-2xl transform rotate-[-5deg] hover:rotate-0 transition-all duration-500 group">
                            <Star className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 text-white group-hover:scale-110 transition-transform duration-300" />
                          </div>
                          {/* Decorative Elements */}
                          <div className="absolute -top-4 -right-4 w-16 h-16 bg-[#53755d]/20 rounded-full blur-xl"></div>
                          <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-[#53755d]/20 rounded-full blur-xl"></div>
                        </div>
                      </div>
                      
                      {/* Content Side */}
                      <div className="lg:w-2/3 lg:pt-8">
                        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10 lg:p-12 border-l-4 border-[#53755d] relative overflow-hidden group hover:shadow-[#53755d]/20 hover:shadow-2xl transition-all duration-300">
                          {/* Corner Accent */}
                          <div className="absolute top-0 right-0 w-32 h-32 bg-[#53755d]/5 rounded-bl-full"></div>
                          
                          <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-4">
                              <span className="text-[#53755d] text-xs font-bold uppercase tracking-widest">03</span>
                              <div className="h-px flex-1 bg-gradient-to-r from-[#53755d] to-transparent"></div>
                            </div>
                            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 group-hover:text-[#53755d] transition-colors duration-300">
                              Our Value
                            </h3>
                            <p className="text-gray-600 leading-relaxed text-base md:text-lg lg:text-xl">
                              Comprehensive financial products and services through our experts in order to attain Integrated excellence in Customers Satisfaction.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Financial Planning Section */}
         
   
        {/* Company Milestones Timeline - Vertical Alternating Design */}
        <div className="py-20 px-4 bg-white relative overflow-hidden">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-20 left-10 w-96 h-96 bg-[#53755d] rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-yellow-400 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>
            <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-blue-500 rounded-full blur-3xl animate-pulse transform -translate-x-1/2 -translate-y-1/2" style={{ animationDelay: '0.75s' }}></div>
          </div>
          
          {/* Grid Pattern Overlay */}
          <div className="absolute inset-0 opacity-3" style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}></div>
          
          <div className="max-w-6xl mx-auto relative z-10">
            {/* Header Section */}
            <div className="text-center mb-12 md:mb-16">
              <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                <span className="text-[#53755d] text-sm font-medium bg-[#53755d]/10 px-4 py-2 rounded-full">History Timeline</span>
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mt-4 mb-4">
                   Company Milestones
                </h2>
                <p className="text-gray-600 mt-6 text-lg max-w-2xl mx-auto">Our journey of excellence and achievements through the years</p>
              </div>
            </div>
            
            {/* Horizontal Timeline */}
            <div className="relative">
              {/* Enhanced Horizontal Timeline Line - Desktop Only */}
              <div className="hidden lg:block absolute top-24 left-0 right-0 h-2 transform -translate-y-1/2 z-10">
                {/* Background Line */}
                <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-full"></div>
                {/* Animated Progress Line */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#53755d] via-white to-[#53755d] rounded-full shadow-lg">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer"></div>
                </div>
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-[#53755d] rounded-full blur-md opacity-30"></div>
              </div>
              
              {/* Timeline Items - Horizontal Grid with Equal Heights */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 relative items-stretch">
                {[
                  { year: '2015', category: 'BUSINESS', achievement: 'Upper Crust Award 2015', icon: <FaBriefcase className="w-6 h-6 lg:w-7 lg:h-7" />, color: 'from-blue-500 to-cyan-500' },
                  { year: '2015', category: 'PERFORMANCES', achievement: 'MFRT SAMMAN 2015 Award for Outstanding Performance', icon: <FaTrophy className="w-6 h-6 lg:w-7 lg:h-7" />, color: 'from-purple-500 to-pink-500' },
                  { year: '2016', category: 'SIP', achievement: 'Highest Perceptual SIPs Winner Tamil Nadu Cluster', icon: <FaChartLine className="w-6 h-6 lg:w-7 lg:h-7" />, color: 'from-orange-500 to-red-500' },
                  { year: '2017', category: 'FINANCE', achievement: 'CNBCTV18 Best Performing Individual Financial Advisor Award 2016-17', icon: <FaDollarSign className="w-6 h-6 lg:w-7 lg:h-7" />, color: 'from-green-500 to-emerald-500' }
                ].map((milestone, index) => (
                  <MilestoneItem 
                    key={index} 
                    milestone={milestone} 
                    index={index}
                  />
                ))}
              </div>
            </div>
            
            {/* Add shimmer animation */}
            <style>{`
              @keyframes shimmer {
                0% { transform: translateX(-100%); }
                100% { transform: translateX(100%); }
              }
              .animate-shimmer {
                animation: shimmer 3s infinite;
              }
            `}</style>
          </div>
        </div>

        {/* Why Choose Us Section - 6 Features */}
        <div className="py-20 px-4 bg-gradient-to-br from-gray-800 to-gray-900 relative overflow-hidden">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full"></div>
            <div className="absolute top-40 right-20 w-24 h-24 bg-white rounded-full"></div>
            <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-white rounded-full"></div>
            <div className="absolute bottom-40 right-1/3 w-20 h-20 bg-white rounded-full"></div>
          </div>
          
          <div className="max-w-7xl mx-auto relative z-10">
            {/* Header Section */}
            <div className="text-center mb-12 md:mb-16">
              <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                <span className="text-[#53755d] text-sm font-medium bg-[#53755d]/10 px-4 py-2 rounded-full">Why People chose us</span>
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mt-4 mb-4">
                  Why chose us
                </h2>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: <TrendingUp className="w-8 h-8" />, title: 'LIFE TIME FINANCIAL', desc: 'MFSPL is a single point of contact for customers to manage a lifetime of financial needs such as investment planning, home mortgages, new car purchases, retirement savings, and overall wealth management.' },
                { icon: <Globe className="w-8 h-8" />, title: 'SIP HOLDER', desc: 'Magathi is one of the highest numbers of SIP holder in Tamil Nadu which proves that our practitioners represent the pinnacle of professionalism for their knowledge, skills, and integrity.' },
                { icon: <Monitor className="w-8 h-8" />, title: 'OUR FINANCIAL EXCELLENCE', desc: 'MFSPL has attracted a huge NRI client base across the globe through its financial excellence & dedicated customer service' },
                { icon: <Folder className="w-8 h-8" />, title: 'SMART TRANSACTIONS', desc: 'Customized Reports and Paperless Smart transactions' },
                { icon: <Settings className="w-8 h-8" />, title: 'PLAN AND REVIEW', desc: 'Periodic Review and Revision of the Plan' },
                { icon: <Handshake className="w-8 h-8" />, title: 'OUR ASSISTANTS', desc: 'Creating the financial plans for individuals according to their perception & risk tolerance' }
              ].map((feature, index) => (
                <div key={index} className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10 hover:bg-white/10 transition-all duration-300">
                  <div className="text-[#53755d] mb-4">{feature.icon}</div>
                  <h3 className="text-white font-bold text-lg mb-3">{feature.title}</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Team Section - Kannan R */}
        <div className="py-20 px-4 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="text-center mb-12 md:mb-16">
              <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                <span className="text-[#53755d] text-sm font-medium bg-[#53755d]/10 px-4 py-2 rounded-full">Our Team</span>
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mt-4 mb-4">
                    Head
                </h2>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-xl p-0 max-w-6xl mx-auto border border-gray-200 overflow-hidden relative">
              {/* Top Accent Bar */}
              <div className=""></div>
              
              <div className="p-8 md:p-12">
                <div className="grid md:grid-cols-12 gap-8 items-start">
                  {/* Left Column - Image & Social */}
                  <div className="md:col-span-4 flex flex-col items-center md:items-start">
                    <div className="relative w-full mb-6">
                      <div className="relative border-4 border-[#53755d] rounded-none shadow-lg">
                        <img src={kannan} alt="Kannan R" className="w-full rounded-none object-cover aspect-[3/4]" />
                      </div>
                      {/* Professional Badge */}
                      <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-[#53755d] text-white px-4 py-2 text-xs font-semibold tracking-wider uppercase shadow-lg">
                        Head of Finance
                      </div>
                    </div>
                    
                    {/* Social Media Links */}
                    <div className="flex flex-row justify-center md:justify-start gap-3 w-full mt-8 pt-6 border-t border-gray-200">
                      <a href="https://www.facebook.com/magathifinancialservicesprivatelimited/" target="_blank" rel="noopener noreferrer" className="w-11 h-11 rounded-md bg-[#53755d]/10 hover:bg-[#53755d] text-[#53755d] hover:text-white flex items-center justify-center transition-all duration-300 hover:shadow-md">
                        <FaFacebookF className="w-5 h-5" />
                      </a>
                      <a href="https://x.com/MFSPL1" target="_blank" rel="noopener noreferrer" className="w-11 h-11 rounded-md bg-[#53755d]/10 hover:bg-[#53755d] text-[#53755d] hover:text-white flex items-center justify-center transition-all duration-300 hover:shadow-md">
                        <FaTwitter className="w-5 h-5" />
                      </a>
                      <a href="mailto:rkannan@mfspl.com" className="w-11 h-11 rounded-md bg-[#53755d]/10 hover:bg-[#53755d] text-[#53755d] hover:text-white flex items-center justify-center transition-all duration-300 hover:shadow-md">
                        <Mail className="w-5 h-5" />
                      </a>
                    </div>
                  </div>
                  
                  {/* Right Column - Details */}
                  <div className="md:col-span-8 space-y-6">
                    {/* Name & Title Section */}
                    <div className="space-y-3 pb-6 border-b border-gray-200">
                      <div>
                        <h3 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
                          KANNAN <span className="text-[#53755d]">R</span>
                        </h3>
                        <p className="text-lg text-gray-600 font-medium">Financial Management Professional</p>
                      </div>
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="inline-flex items-center px-4 py-1.5 bg-[#53755d]/10 text-[#53755d] text-sm font-semibold rounded-md">
                          <Award className="w-4 h-4 mr-2" />
                          20+ Years Experience
                        </span>
                        <span className="inline-flex items-center px-4 py-1.5 bg-gray-100 text-gray-700 text-sm font-semibold rounded-md">
                          <Building className="w-4 h-4 mr-2" />
                          MFSPL
                        </span>
                      </div>
                    </div>
                    
                    {/* Contact Information */}
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Contact Information</h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
                          <div className="flex-shrink-0 w-10 h-10 bg-[#53755d]/10 rounded-lg flex items-center justify-center">
                            <Building className="w-5 h-5 text-[#53755d]" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Department</p>
                            <p className="text-[#53755d] font-bold text-base">Financial Management</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
                          <div className="flex-shrink-0 w-10 h-10 bg-[#53755d]/10 rounded-lg flex items-center justify-center">
                            <Award className="w-5 h-5 text-[#53755d]" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Experience</p>
                            <p className="text-gray-900 font-semibold text-base">20 Years</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
                          <div className="flex-shrink-0 w-10 h-10 bg-[#53755d]/10 rounded-lg flex items-center justify-center">
                            <Mail className="w-5 h-5 text-[#53755d]" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Email</p>
                            <a href="mailto:rkannan@mfspl.com" className="text-gray-900 font-semibold text-base hover:text-[#53755d] transition-colors">
                              rkannan@mfspl.com
                            </a>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
                          <div className="flex-shrink-0 w-10 h-10 bg-[#53755d]/10 rounded-lg flex items-center justify-center">
                            <Phone className="w-5 h-5 text-[#53755d]" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Phone</p>
                            <a href="tel:+919894749352" className="text-gray-900 font-semibold text-base hover:text-[#53755d] transition-colors">
                              +91-989-474-9352
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-16 max-w-5xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
                <span className="text-gray-600">TEAM</span> <span className="font-extrabold">INFORMATION</span>
              </h2>
              <p className="text-gray-600 leading-relaxed text-base md:text-lg">
                The financial products distribution team consists of experts with proven credentials in Finance, headed by Mr. R. Kannan, who has over 20 years of experience. The team emphasizes excellence, adherence to stringent standards of education, experience, and ethics, and their passion for financial stability. They also respect MFSPL (Magathi Financial Services Pvt.Ltd) values to foster excellent customer relationships.
              </p>
            </div>
          </div>
        </div>


        {/* About Section with Client Logos Slider */}
        <section className="py-20 px-4 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, rgb(232, 245, 233) 0%, rgb(245, 245, 245) 100%)' }}>
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-200 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-white rounded-full blur-3xl"></div>
          </div>
          
          <div className="max-w-6xl mx-auto relative z-10">
            {/* Header Section */}
            <div className="text-center mb-12 md:mb-16">
              <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                <span className="text-[#53755d] text-sm font-medium bg-[#53755d]/10 px-4 py-2 rounded-full">Our Partners</span>
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mt-4 mb-4">
                  About Our Company
                </h2>
                <p className="text-gray-600 text-lg md:text-xl leading-relaxed"></p>
              </div>
            </div>
            <ClientLogoSlider />
          </div>
        </section>
        <Footer />
      </section>
    );
  };

  export default MutualFundsSection;