import React, { useState, useEffect, useRef } from "react";
import { ChevronDown, User, MessageCircle, ChevronRight, Home, Settings, LogOut, Edit, Trash2, Camera } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaWhatsapp, FaLinkedinIn, FaChartLine, FaUser, FaUserSecret } from "react-icons/fa";
import { MdEmail, MdPhone } from "react-icons/md";
import { useAuth } from "../contexts/AuthContext";
import logo from "../assets/mfspl.png";
import ProfileHeader from "./ProfileHeader";

const services = [
  { name: "All Services", href: "/services" },
  { name: "Mutual Funds", href: "/mutual-funds" },
  { name: "Health Insurance Policies", href: "/health-insurance" },
  { name: "General Insurance", href: "/general-insurance" },
  { name: "Deposits", href: "/deposits" },
];

export default function HeaderNav() {
  const [isMainMenuOpen, setIsMainMenuOpen] = useState(false);
  const [isTopMenuOpen, setIsTopMenuOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [hideNav, setHideNav] = useState(false);
  const lastScrollY = useRef(0);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout, isAdmin } = useAuth();

  // Generate breadcrumbs based on current location
  const getBreadcrumbs = () => {
    const path = location.pathname;
    if (path === '/about') {
      return ['Home', 'About Us'];
    } else if (path === '/our-history') {
      return ['Home', 'History'];
    } else if (path === '/') {
      return ['Home'];
    } else if (path === '/calculator') {
      return ['Home', 'Calculator'];
    } else if (path === '/signup') {
      return ['Home', 'Sign Up'];
    } else if (path === '/login') {
      return ['Home', 'Login'];
    } else if (path === '/otp-login') {
      return ['Home', 'OTP Login'];
    } else if (path === '/dashboard') {
      return ['Home', 'Dashboard'];
    } else if (path === '/mutual-fund') {
      return ['Home', 'Mutual Fund'];
    } else if (path === '/mutual-funds') {
      return ['Home', 'Mutual Funds'];
    } else if (path === '/health-insurance') {
      return ['Home', 'Health Insurance'];
    } else if (path === '/general-insurance') {
      return ['Home', 'General Insurance'];
    } else if (path === '/blog') {
      return ['Home', 'Blog'];
    } else if (path === '/contact') {
      return ['Home', 'Contact Us'];
    } else if (path === '/chatbot') {
      return ['Home', 'Chat Bot'];
    } else {
      return ['Home'];
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setHideNav(true);
      } else {
        setHideNav(false);
      }
      lastScrollY.current = currentScrollY;
      setIsScrolled(currentScrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close both menus when one opens
  const handleTopMenuToggle = () => {
    setIsTopMenuOpen(!isTopMenuOpen);
    setIsMainMenuOpen(false);
  };

  const handleMainMenuToggle = () => {
    setIsMainMenuOpen(!isMainMenuOpen);
    setIsTopMenuOpen(false);
  };

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMainMenuOpen || isTopMenuOpen || showProfileDropdown) {
        const isClickInsideMenu = event.target.closest('[data-menu]');
        const isClickInsideProfile = event.target.closest('[data-profile]');
        if (!isClickInsideMenu && !isClickInsideProfile) {
          setIsMainMenuOpen(false);
          setIsTopMenuOpen(false);
          setShowProfileDropdown(false);
        }
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMainMenuOpen, isTopMenuOpen, showProfileDropdown]);

  // Profile management functions
  const handleProfileUpdate = () => {
    setShowProfileDropdown(false);
    navigate("/profile/edit");
  };

  const handleProfileDelete = () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      // Here you would typically call an API to delete the user account
      logout();
      navigate("/");
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert("Please select a valid image file.");
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size should be less than 5MB.");
        return;
      }
      
      // Here you would typically upload the image to your server
      // For now, we'll create a preview and show success message
      const reader = new FileReader();
      reader.onload = (e) => {
        // Update user profile image in context
        const updatedUser = { ...user, profileImage: e.target.result };
        // You would typically call an API to update the user profile
        console.log("Profile image updated:", e.target.result);
        alert("Photo added successfully! ✅");
      };
      reader.readAsDataURL(file);
    }
  };

  // Get user avatar based on gender or custom image
  const getUserAvatar = () => {
    if (user?.profileImage) {
      return (
        <img 
          src={user.profileImage} 
          alt="Profile" 
          className="w-6 h-6 rounded-full object-cover border-2 border-white"
        />
      );
    }
    
    // Default to gender-based icons
    if (user?.gender === 'female') {
      return <FaUserSecret className="w-6 h-6 text-pink-500" />;
    }
    
    return <FaUser className="w-6 h-6 text-blue-500" />;
  };

  return (
    <div className="Montserrat relative w-full">
      <div className="relative">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-white/10 rounded-full animate-float"
            style={{
              width: `${8 + i * 4}px`,
              height: `${8 + i * 4}px`,
              left: `${15 + i * 14}%`,
              top: `${25 + i * 10}%`,
              animationDelay: `${i * 0.4}s`,
              animationDuration: `${5 + i * 0.8}s`,
            }}
          />
        ))}
        
        {/* Animated lines */}
        {[...Array(4)].map((_, i) => (
          <div
            key={`line-${i}`}
            className="absolute bg-white/5 animate-pulse"
            style={{
              width: `${60 + i * 20}px`,
              height: '2px',
              left: `${20 + i * 20}%`,
              top: `${40 + i * 15}%`,
              animationDelay: `${i * 0.6}s`,
              animationDuration: `${3 + i * 0.5}s`,
            }}
          />
        ))}
        
        {/* Corner accents */}
        <div className="absolute top-8 right-8 w-16 h-16 border-2 border-white/20 rounded-full animate-spin" style={{animationDuration: '20s'}}></div>
        <div className="absolute bottom-8 right-8 w-12 h-12 border-2 border-white/15 rounded-full animate-spin" style={{animationDuration: '15s', animationDirection: 'reverse'}}></div>
        
        {/* Gradient orbs */}
        <div className="absolute top-1/4 right-1/4 w-8 h-8 bg-gradient-to-br from-white/20 to-transparent rounded-full animate-pulse"></div>
        <div className="absolute bottom-1/3 left-1/3 w-6 h-6 bg-gradient-to-tr from-white/15 to-transparent rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>

        {/* Breadcrumbs - Improved alignment and positioning */}
        <div className="absolute bottom-6 left-6 z-10">
          <nav className="flex items-center bg-black/20 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
            {getBreadcrumbs().map((crumb, index) => (
              <div key={index} className="flex items-center">
                {index > 0 && (
                  <ChevronRight className="w-4 h-4 mx-2 text-white/60" />
                )}
                <div className="flex items-center space-x-1">
                  {index === 0 && (
                    <Home className="w-4 h-4 text-white/80 hover:text-white transition-colors duration-200" />
                  )}
                  <button 
                    onClick={() => {
                      if (index === 0) {
                        navigate('/');
                      }
                    }}
                    className="text-white/80 hover:text-white transition-colors duration-200 cursor-pointer font-medium text-sm"
                  >
                    {crumb}
                  </button>
                </div>
              </div>
            ))}
          </nav>
        </div>
      </div>

      {/* Top Nav - Social Links & Contact */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 border-b border-gray-100 transition-all duration-500
          ${isScrolled ? "bg-white/90 backdrop-blur-md shadow-lg animate-navFadeIn" : "bg-transparent"}
          ${hideNav ? "-translate-y-full opacity-0 pointer-events-none" : "translate-y-0 opacity-100"}
        `}
        style={{
          boxShadow: isScrolled ? "0 2px 16px rgba(0,0,0,0.08)" : "none",
          transition: "transform 0.5s cubic-bezier(0.4,0,0.2,1), opacity 0.5s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        <div className="flex flex-wrap justify-between items-center px-4 md:px-8 py-1 w-full">
          {/* Mobile Top Menu Toggler Button - Left Side */}
          <button
            className="md:hidden text-white focus:outline-none z-50 relative"
            onClick={handleTopMenuToggle}
            aria-label="Toggle top menu"
            data-menu="top-toggle"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              {isTopMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          {/* Desktop Social Icons */}
          <ul className={`hidden md:flex gap-4 items-center ${isScrolled ? "text-gray-600" : "text-white"}`}>
            <li className="hover:text-blue-600 transition-colors duration-200">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><FaFacebookF /></a>
            </li>
            <li className="hover:text-pink-600 transition-colors duration-200">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
            </li>
            <li className="hover:text-green-600 transition-colors duration-200">
              <a href="https://wa.me/your-number" target="_blank" rel="noopener noreferrer"><FaWhatsapp /></a>
            </li>
            <li className="hover:text-blue-800 transition-colors duration-200">
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"><FaLinkedinIn /></a>
            </li>
          </ul>

          {/* Desktop Email */}
          <div className={`font-normal text-sm hidden md:flex items-center gap-2 transition-colors duration-500 ${
            isScrolled ? "text-[#222]" : "text-white"
          }`}>
            <MdEmail className="text-sm" />
            mf@mfspl.com | kannanrsbi@gmail.com
          </div>

          {/* Desktop Phone */}
          <div className={`font-normal text-sm hidden md:flex items-center gap-2 transition-colors duration-500 ${
            isScrolled ? "text-[#222]" : "text-white"
          }`}>
            <MdPhone className="text-sm" />
            +91-989-474-9352 | +91 422 4960352
          </div>

          {/* Desktop Search + Ask */}
          <div className="flex items-center gap-4">
            <div className="relative max-w-sm hidden md:block">
              <input
                type="text"
                placeholder="Search"
                className={`w-50 pl-10 py-1 rounded-full border text-sm bg-transparent ${
                  isScrolled ? "border-gray-300 text-[#222] placeholder-gray-500" : "border-white text-white placeholder-white"
                } shadow-sm focus:outline-none focus:ring-1 focus:ring-[#53755d] transition`}
              />
              <div className={`absolute left-3 top-1/2 transform -translate-y-1/2`}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  style={{
                    stroke: "currentColor",
                    color: isScrolled ? "#222" : "#ffffff",
                  }}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z"
                  />
                </svg>
              </div>
            </div>
            <div
              className="hidden md:flex items-center gap-2 px-3 cursor-pointer hover:scale-105 transition-transform"
              onClick={() => setShowChatbot(true)}
              title="Ask our chatbot"
              style={{
                color: isScrolled ? "#333" : "#ffffff",
                borderRadius: "9999px",
                transition: "all 0.3s",
              }}
            >
              <MessageCircle className="h-5 w-5" />
              <span className="font-normal text-sm py-1">Ask Question</span>
            </div>
          </div>
        </div>

        {/* Mobile Top Menu Dropdown - Left Side with White Background */}
        <div
          className={`md:hidden fixed top-0 left-0 w-full z-40 transition-all duration-500 ${
            isTopMenuOpen
              ? "max-h-screen opacity-100 translate-y-0 pointer-events-auto"
              : "max-h-0 opacity-0 -translate-y-10 pointer-events-none"
          }`}
          data-menu="top-menu"
        >
          <div className="bg-white/50 backdrop-blur-md text-gray-800 rounded-b-3xl shadow-xl ring-1 ring-black/10 mx-0 pt-20 pb-8 px-6 flex flex-col items-center animate-slideDown">
            {/* Social Icons */}
            <div className="flex gap-6 mb-6">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 text-xl">
                <FaFacebookF />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:text-pink-800 text-xl">
                <FaInstagram />
              </a>
              <a href="https://wa.me/your-number" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:text-green-800 text-xl">
                <FaWhatsapp />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-blue-800 hover:text-blue-900 text-xl">
                <FaLinkedinIn />
              </a>
            </div>
            
            {/* Contact Info */}
            <div className="text-center space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <MdEmail />
                <span>mf@mfspl.com | kannanrsbi@gmail.com</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MdPhone />
                <span>+91-989-474-9352 | +91 422 4960352</span>
              </div>
            </div>

            {/* Mobile Search */}
            <div className="relative w-full max-w-sm mt-4">
              <input
                type="text"
                placeholder="Search"
                className="w-full pl-10 py-2 rounded-full border border-gray-300 bg-white/80 text-gray-800 placeholder-gray-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#53755d] transition"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
                </svg>
              </div>
            </div>

            {/* Ask Question Button */}
            <button
              onClick={() => {
                setShowChatbot(true);
                setIsTopMenuOpen(false);
              }}
              className="w-full mt-4 bg-[#53755d] text-white font-medium py-2 px-4 rounded-xl shadow hover:bg-[#3a4b3e] transition-all duration-200 flex items-center justify-center gap-2"
            >
              <MessageCircle className="h-4 w-4" />
              Ask Question
            </button>
          </div>
        </div>
      </nav>

      {/* Main Navigation */}
      <nav
        className={`fixed left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? "bg-gradient-to-r from-[#003706]/50 to-[#1f2b23ff]/50 [backdrop-filter:blur(3px)] shadow-lg rounded-bl-2xl rounded-br-2xl p-2"
            : "bg-transparent"
        }`}
        style={{
          top: hideNav ? "0" : "37px",
          transition: "top 0.5s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <div
                className={`text-2xl font-bold transition-colors duration-300 ${
                  isScrolled ? "text-white" : "text-white"
                }`}
              >
                <img src={logo} alt="Logo" className="h-12 w-20" />
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <a
                  href="#"
                  className={`px-3 py-2 text-sm font-medium transition-all duration-200 hover:scale-105 ${
                    isScrolled
                      ? "text-gray-300 hover:text-white"
                      : "text-white/90 hover:text-green-600"
                  }`}
                  onClick={(e) => { e.preventDefault(); navigate('/'); }}
                >
                  Home
                </a>

                <a
                  href="#"
                  className={`px-3 py-2 text-sm font-medium transition-all duration-200 hover:scale-105 ${
                    isScrolled
                      ? "text-gray-300 hover:text-white"
                      : "text-white/90 hover:text-green-600"
                  }`}
                  onClick={(e) => { e.preventDefault(); navigate('/about'); }}
                >
                  About
                </a>

                <div
                  className="relative"
                  onMouseLeave={() => setIsServicesOpen(false)}
                >
                  <button
                    onMouseEnter={() => setIsServicesOpen(true)}
                    className={`flex items-center px-3 py-2 text-sm font-medium transition-all duration-200 hover:scale-105 ${
                      isScrolled
                        ? "text-gray-300 hover:text-white"
                        : "text-white/90 hover:text-green-600"
                    }`}
                  >
                    Services
                    <ChevronDown
                      className={`ml-1 h-4 w-4 transition-transform duration-200 ${
                        isServicesOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  <div
                    className={`absolute left-0 mt-1 w-56 bg-white rounded-xl shadow-lg ring-1 ring-black ring-opacity-5 transition-all duration-200 ${
                      isServicesOpen
                        ? "opacity-100 visible translate-y-0"
                        : "opacity-0 invisible -translate-y-2"
                    }`}
                  >
                    <div className="py-2">
                      {services.map((service, index) => (
                        <a
                          key={index}
                          href={service.href}
                          onClick={(e) => {
                            e.preventDefault();
                            navigate(service.href);
                            setIsServicesOpen(false);
                          }}
                          className="block px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-green-50 hover:text-green-700 transition-all duration-200 cursor-pointer"
                        >
                          {service.name}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>

                <a
                  href="#"
                  className={`px-3 py-2 text-sm font-medium transition-all duration-200 hover:scale-105 ${
                    isScrolled
                      ? "text-gray-300 hover:text-white"
                      : "text-white/90 hover:text-green-600"
                  }`}
                  onClick={(e) => { e.preventDefault(); navigate('/blog'); }}
                >
                  Blog
                </a>
                <a
                  href="#"
                  className={`px-3 py-2 text-sm font-medium transition-all duration-200 hover:scale-105 ${
                    isScrolled
                      ? "text-gray-300 hover:text-white"
                      : "text-white/90 hover:text-green-600"
                  }`}
                  onClick={(e) => { e.preventDefault(); navigate('/contact'); }}
                >
                  Contact Us
                </a>
              </div>
            </div>

            {/* Desktop Client Login/User Menu */}
            <div className="hidden md:flex items-center space-x-3">
              {isAuthenticated ? (
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-white">
                    Welcome, {user?.name}
                  </span>
                  
                  {/* Profile Dropdown - Using consistent design */}
                  <ProfileHeader 
                    variant="desktop"
                    showActions={true}
                    onEditProfile={() => {
                      setShowProfileDropdown(false);
                      navigate("/profile");
                    }}
                    onLogout={() => {
                      setShowProfileDropdown(false);
                      logout();
                      navigate("/");
                    }}
                  />
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => navigate("/login")}
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-full transition-all duration-200 hover:scale-105 ${
                      isScrolled
                        ? "inline-flex items-center px-4 py-2 border border-white bg-transparent text-white cursor-pointer transition-colors duration-700 hover:bg-white hover:text-[#53755dff] font-semibold"
                        : "bg-white/20 backdrop-blur-sm text-white hover:bg-white/30"
                    }`}
                  >
                    <User className="h-4 w-4 mr-2" />
                    Client Login
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Main Menu Toggler - Right Side */}
            <div className="md:hidden">
              <button
                onClick={handleMainMenuToggle}
                className={`relative p-2 rounded-md transition-all duration-300 z-50 ${
                  isMainMenuOpen
                    ? "text-white"
                    : isScrolled
                    ? "text-gray-700"
                    : "text-white"
                }`}
                aria-label="Toggle main menu"
                data-menu="main-toggle"
              >
                <div className="relative w-6 h-6">
                  <span
                    className={`absolute h-0.5 w-6 bg-current transform transition-all duration-300 ${
                      isMainMenuOpen ? "rotate-45 top-3" : "top-1"
                    }`}
                  ></span>
                  <span
                    className={`absolute h-0.5 w-6 bg-current top-3 transition-all duration-300 ${
                      isMainMenuOpen ? "opacity-0" : "opacity-100"
                    }`}
                  ></span>
                  <span
                    className={`absolute h-0.5 w-6 bg-current transform transition-all duration-300 ${
                      isMainMenuOpen ? "-rotate-45 top-3" : "top-5"
                    }`}
                  ></span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Main Menu Dropdown */}
        <div
          className={`md:hidden fixed top-0 left-0 w-full z-30 transition-all duration-500 ${
            isMainMenuOpen
              ? "max-h-screen opacity-100 translate-y-0 pointer-events-auto"
              : "max-h-0 opacity-0 -translate-y-10 pointer-events-none"
          }`}
          data-menu="main-menu"
        >
          <div className="bg-white/50 backdrop-blur-md text-gray-800 rounded-b-3xl shadow-xl ring-1 ring-black/10 mx-0 pt-20 pb-8 px-6">
            <div className="space-y-4">
              <a
                href="#"
                className="block px-4 py-3 text-lg font-medium text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-green-50 hover:text-green-700 rounded-lg transition-all duration-200"
                onClick={(e) => { e.preventDefault(); navigate('/'); setIsMainMenuOpen(false); }}
              >
                Home
              </a>
              <a
                href="#"
                className="block px-4 py-3 text-lg font-medium text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-green-50 hover:text-green-700 rounded-lg transition-all duration-200"
                onClick={(e) => { e.preventDefault(); navigate('/about'); setIsMainMenuOpen(false); }}
              >
                About
              </a>
              <a
                href="#"
                className="block px-4 py-3 text-lg font-medium text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-green-50 hover:text-green-700 rounded-lg transition-all duration-200"
                onClick={(e) => { e.preventDefault(); navigate('/mutual-funds'); setIsMainMenuOpen(false); }}
              >
                Services
              </a>
              <a
                href="#"
                className="block px-4 py-3 text-lg font-medium text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-green-50 hover:text-green-700 rounded-lg transition-all duration-200"
                onClick={(e) => { e.preventDefault(); navigate('/blog'); setIsMainMenuOpen(false); }}
              >
                Blog
              </a>
              <a
                href="#"
                className="block px-4 py-3 text-lg font-medium text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-green-50 hover:text-green-700 rounded-lg transition-all duration-200"
                onClick={(e) => { e.preventDefault(); navigate('/contact'); setIsMainMenuOpen(false); }}
              >
                Contact Us
              </a>
              {/* Client Login/User Menu Button */}
              {isAuthenticated ? (
                <ProfileHeader 
                  variant="mobile"
                  showActions={true}
                  onEditProfile={() => {
                    setIsMainMenuOpen(false);
                    handleProfileUpdate();
                  }}
                  onLogout={() => {
                    setIsMainMenuOpen(false);
                    logout();
                    navigate("/");
                  }}
                />
              ) : (
                <div className="pt-4 space-y-3">
                  <button
                    onClick={() => { navigate("/login"); setIsMainMenuOpen(false); }}
                    className="w-full bg-[#53755d] text-white font-medium py-3 px-6 rounded-xl shadow hover:bg-[#3a4b3e] transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <User className="h-5 w-5" />
                    Login
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
            opacity: 0.3;
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
            opacity: 0.8;
          }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        @keyframes navFadeIn {
          0% {
            background: rgba(255,255,255,0);
            opacity: 0;
            transform: translateY(-20px);
          }
          100% {
            background: rgba(255, 255, 255, 0.9);
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-navFadeIn {
          animation: navFadeIn 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>
    </div>
  );
}
