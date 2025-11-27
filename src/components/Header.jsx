import React, { useState, useEffect, useRef } from "react";
import { ChevronDown, User, MessageCircle } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaWhatsapp, FaLinkedinIn } from "react-icons/fa";
import { MdEmail, MdPhone } from "react-icons/md";
import { useAuth } from "../contexts/AuthContext";
import logo from "../assets/mfspl.png";
import FuturisticBanner from "./FuturisticBanner";
import ProfileHeader from "./ProfileHeader";
import LogoutConfirmationModal from "./LogoutConfirmationModal";



const services = [
  { 
    name: "Mutual Funds", 
    href: "/mutual-funds",
    icon: "📊",
    description: "Investment planning and management"
  },
  { 
    name: "Health Insurance", 
    href: "/health-insurance",
    icon: "🏥",
    description: "Comprehensive health coverage"
  },
  { 
    name: "General Insurance", 
    href: "/general-insurance",
    icon: "🛡️",
    description: "Protection for your assets"
  },
  { 
    name: "Deposits", 
    href: "/deposits",
    icon: "💰",
    description: "Secure savings solutions"
  },
];

export default function EnhancedSliderWithNav() {
  const [isMainMenuOpen, setIsMainMenuOpen] = useState(false);
  const [isTopMenuOpen, setIsTopMenuOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState([
    {
      from: "bot",
      text: "Hi! Ask me anything about mutual funds risk.",
    },
  ]);
  const [hideNav, setHideNav] = useState(false);
  const lastScrollY = useRef(0);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout, isAdmin } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

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

  const handleChatSubmit = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const userMsg = { from: "user", text: chatInput };
    let botMsg = { from: "bot", text: "" };
    const input = chatInput.toLowerCase();

    if (input.includes("risk") && input.includes("mutual fund")) {
      botMsg.text =
        "Mutual funds carry risks such as market risk, credit risk, and interest rate risk. Diversification helps reduce some risks, but not all. Would you like to know about a specific type of risk?";
    } else if (input.includes("types of risk")) {
      botMsg.text =
        "Common risks in mutual funds include market risk, credit risk, interest rate risk, and liquidity risk.";
    } else if (input.includes("safe") || input.includes("guaranteed")) {
      botMsg.text =
        "No mutual fund is completely risk-free or guaranteed. However, debt funds are generally less risky than equity funds.";
    } else if (input.includes("reduce risk") || input.includes("minimize risk")) {
      botMsg.text =
        "You can reduce risk by diversifying your investments, choosing funds with lower volatility, and investing for the long term.";
    } else {
      botMsg.text =
        "I'm here to help with questions about mutual funds risk. Could you please clarify your question?";
    }

    setChatHistory((prev) => [...prev, userMsg, botMsg]);
    setChatInput("");
  };

  // Profile management functions
  const handleProfileUpdate = () => {
    setShowProfileDropdown(false);
    navigate("/profile");
  };

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleConfirmLogout = () => {
    setShowLogoutModal(false);
    logout();
    navigate("/");
  };

  const handleCancelLogout = () => {
    setShowLogoutModal(false);
  };

  return (
    <div className="Montserrat relative w-full h-screen overflow-hidden">
             {/* Top Nav - Social Links & Contact */}
       <nav
         className={`fixed top-0 left-0 right-0 z-50 border-b border-gray-200 transition-all duration-500
           ${isScrolled ? "bg-black/40 backdrop-blur-md shadow-lg animate-navFadeIn" : "bg-black/40 backdrop-blur-md"}
           ${hideNav ? "-translate-y-full opacity-0 pointer-events-none" : "translate-y-0 opacity-100"}
         `}
         style={{
           boxShadow: isScrolled ? "0 2px 16px rgba(0,0,0,0.08)" : "0 2px 16px rgba(0,0,0,0.05)",
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
           <ul className="hidden md:flex gap-4 items-center text-white">
             <li className="hover:text-blue-200 transition-colors duration-200">
               <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><FaFacebookF /></a>
             </li>
             <li className="hover:text-pink-200 transition-colors duration-200">
               <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
             </li>
             <li className="hover:text-green-200 transition-colors duration-200">
               <a href="https://wa.me/your-number" target="_blank" rel="noopener noreferrer"><FaWhatsapp /></a>
             </li>
             <li className="hover:text-blue-200 transition-colors duration-200">
               <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"><FaLinkedinIn /></a>
             </li>
           </ul>

           {/* Desktop Email */}
           <div className="font-normal text-sm hidden md:flex items-center gap-2 transition-colors duration-500 text-white">
             <MdEmail className="text-sm" />
             mf@mfspl.com | kannanrsbi@gmail.com
           </div>

           {/* Desktop Phone */}
           <div className="font-normal text-sm hidden md:flex items-center gap-2 transition-colors duration-500 text-white">
             <MdPhone className="text-sm" />
             +91-989-474-9352 | +91 422 4960352
           </div>

           {/* Desktop Search + Ask */}
           <div className="flex items-center gap-4">
             <div className="relative max-w-sm hidden md:block">
               <input
                 type="text"
                 placeholder="Search"
                 className="w-50 pl-10 py-1 rounded-full border text-sm bg-transparent border-white/30 text-white placeholder-white/70 shadow-sm focus:outline-none focus:ring-1 focus:ring-white/50 transition"
               />
               <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                 <svg
                   xmlns="http://www.w3.org/2000/svg"
                   className="h-5 w-5 text-white/70"
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
               className="hidden md:flex items-center gap-2 px-3 cursor-pointer hover:scale-105 transition-transform text-white"
               onClick={() => setShowChatbot(true)}
               title="Ask our chatbot"
               style={{
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
          <div className="bg-white/95 backdrop-blur-md text-gray-800 rounded-b-3xl shadow-xl ring-1 ring-black/10 mx-0 pt-20 pb-8 px-4 sm:px-6 flex flex-col items-center animate-slideDown">
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
              <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                <MdEmail className="text-sm" />
                <span className="break-all">mf@mfspl.com</span>
                <span className="hidden sm:inline">|</span>
                <span className="break-all">kannanrsbi@gmail.com</span>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                <MdPhone className="text-sm" />
                <span>+91-989-474-9352</span>
                <span className="hidden sm:inline">|</span>
                <span>+91 422 4960352</span>
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
             : "bg-black/40 backdrop-blur-md"
         }`}
         style={{
           top: hideNav ? "0" : "37px",
           transition: "top 0.5s cubic-bezier(0.4,0,0.2,1)",
         }}
       >
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
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
              <div className="ml-6 flex items-baseline space-x-6">
                <a
                  href="#"
                  className={`px-2 py-2 text-sm font-medium transition-all duration-200 hover:scale-105 ${
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
                  className={`px-2 py-2 text-sm font-medium transition-all duration-200 hover:scale-105 ${
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
                    onClick={() => setIsServicesOpen(!isServicesOpen)}
                    onMouseEnter={() => setIsServicesOpen(true)}
                    className={`flex items-center px-2 py-2 text-sm font-medium transition-all duration-200 hover:scale-105 ${
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
                    className={`absolute left-0 mt-2 w-64 bg-white rounded-lg shadow-lg transition-all duration-300 ${
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
                          className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors duration-200"
                        >
                          <span className="font-medium">{service.name}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>

                <a
                  href=""
                  onClick={(e) => { e.preventDefault(); navigate('/blog'); }}
                  className={`px-2 py-2 text-sm font-medium transition-all duration-200 hover:scale-105 ${
                    isScrolled
                      ? "text-gray-300 hover:text-white"
                      : "text-white/90 hover:text-green-600"
                  }`}
                >
                  Blog
                </a>
                <a
                  href="contact"
                  className={`px-2 py-2 text-sm font-medium transition-all duration-200 hover:scale-105 ${
                    isScrolled
                      ? "text-gray-300 hover:text-white"
                      : "text-white/90 hover:text-green-600"
                  }`}
                >
                  Contact Us
                </a>
              </div>
            </div>

            {/* Desktop Client Login/User Menu - Only show on home page */}
            <div className="hidden md:flex items-center space-x-3">
              {isAuthenticated ? (
                <div className="flex items-center space-x-3">
                  {/* Profile Dropdown - Using consistent design */}
                  <ProfileHeader 
                    variant="desktop"
                    showActions={true}
                    onEditProfile={() => {
                      setShowProfileDropdown(false);
                      handleProfileUpdate();
                    }}
                    onLogout={() => {
                      setShowProfileDropdown(false);
                      handleLogoutClick();
                    }}
                  />
                </div>
              ) : (
                // Only show login button on home page
                <button
                  onClick={() => navigate("/login")}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-full transition-all duration-200 hover:scale-105 ${
                    isScrolled
                      ? "inline-flex items-center px-5 py-3 border border-white bg-transparent text-white cursor-pointer transition-colors duration-700 hover:bg-white hover:text-[#53755dff] font-semibold"
                      : "bg-white/20 backdrop-blur-sm text-white hover:bg-white/30"
                  }`}
                >
                  <User className="h-4 w-4 mr-2" />
                  Client Login
                </button>
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

        {/* Mobile Main Menu Dropdown - Right Side with Green Background */}
        <div
          className={`md:hidden fixed top-0 right-0 w-full z-40 transition-all duration-500 ${
            isMainMenuOpen
              ? "max-h-screen opacity-100 translate-y-0 pointer-events-auto"
              : "max-h-0 opacity-0 -translate-y-10 pointer-events-none"
          }`}
          data-menu="main-menu"
        >
          <div className="bg-[#53755d]/95 backdrop-blur-md text-white rounded-b-3xl shadow-xl ring-1 ring-black/10 mx-0 pt-20 pb-8 px-4 sm:px-6 flex flex-col items-center animate-slideDown relative">
            {/* Navigation Links */}
            {["Home", "About", "Blog", "Contact Us"].map(
              (item, index) => (
                <a
                  key={item}
                  href="#"
                  className="block w-full text-center py-4 text-lg font-semibold hover:bg-white/20 rounded-xl transition-all duration-200 mb-2"
                  style={{
                    transitionDelay: isMainMenuOpen ? `${index * 60}ms` : "0ms",
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    setIsMainMenuOpen(false);
                    if (item === "Home") navigate('/');
                    else if (item === "About") navigate('/about');
                    else if (item === "Blog") navigate('/blog');
                    else if (item === "Contact Us") navigate('/contact');
                  }}
                >
                  {item}
                </a>
              )
            )}

            {/* Services Section */}
            <div className="w-full mt-4 mb-4">
              <h3 className="text-lg font-bold text-white mb-4 text-center">Our Services</h3>
              <div className="bg-white rounded-lg p-3 sm:p-4 space-y-2">
                {services.map((service, index) => (
                  <a
                    key={index}
                    href={service.href}
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(service.href);
                      setIsMainMenuOpen(false);
                    }}
                    className="flex items-center px-3 py-2 sm:py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors duration-200 rounded-lg"
                  >
                    <span className="font-medium">{service.name}</span>
                  </a>
                ))}
              </div>
            </div>
            
            {/* Client Login/User Menu Button - Only show on home page */}
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
                  handleLogoutClick();
                }}
              />
            ) : (
              <button
                onClick={() => {
                  setIsMainMenuOpen(false);
                  navigate("/login");
                }}
                className="w-full mt-4 bg-white text-[#53755d] font-bold py-3 px-4 rounded-xl shadow hover:bg-gray-100 transition-all duration-200 flex items-center justify-center"
              >
                <User className="inline h-5 w-5 mr-2" />
                Client Login
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Futuristic Banner Slider */}
      <FuturisticBanner />

      {/* Logout Confirmation Modal */}
      <LogoutConfirmationModal
        isOpen={showLogoutModal}
        onClose={handleCancelLogout}
        onConfirm={handleConfirmLogout}
      />

      {/* Chatbot Modal */}
      {showChatbot && (
        <div className="fixed inset-0 z-50 flex items-end justify-end p-6 bg-black/20">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-[#53755d]" />
                <span className="font-bold text-[#53755d]">Mutual Fund Chatbot</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  className="text-[#53755d] hover:text-[#3a4b3e] text-sm font-semibold px-2 py-1 rounded transition"
                  onClick={() =>
                    setChatHistory([
                      {
                        from: "bot",
                        text: "Hi! Ask me anything about mutual funds risk.",
                      },
                    ])
                  }
                  title="Clear Conversation"
                >
                  Clear
                </button>
                <button
                  className="text-gray-400 cursor-pointer hover:text-black text-xl font-bold"
                  onClick={() => setShowChatbot(false)}
                  aria-label="Close"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2" style={{ maxHeight: 300 }}>
              {chatHistory.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`px-3 py-2 rounded-lg text-sm ${
                      msg.from === "user"
                        ? "bg-[#e1eae7] text-[#53755d]"
                        : "bg-[#53755d] text-white"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleChatSubmit} className="flex items-center border-t border-gray-200 p-2 gap-2">
              <input
                type="text"
                className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#53755d]/50 focus:border-transparent"
                placeholder="Type your question..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                autoFocus
              />
              <button
                type="submit"
                className="bg-gradient-to-r from-[#53755d] to-[#53755d] text-white px-4 py-2 rounded cursor-pointer transition-colors duration-600 hover:from-white hover:to-white hover:text-[#53755d] border border-[#53755d] transition-all duration-500 ease-in-out"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideDown {
          0% {
            transform: translateY(-60px);
            opacity: 0;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slideDown {
          animation: slideDown 0.5s cubic-bezier(0.4, 0, 0.2, 1);
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
        @keyframes slideInRight {
          0% {    
            transform: translateX(100%);
            opacity: 0;
          }
          100% {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slideInRight {
          animation: slideInRight 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        @media (max-width: 768px) {
          .animate-slideInRight {
            width: 90vw !important;
            max-width: 320px;
            right: 10px;
            left: 10px;
            margin: 0 auto;
          }
        }
      `}</style>
    </div>
  );
}