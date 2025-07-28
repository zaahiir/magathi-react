import React, { useState, useEffect, useRef } from "react";
import { ChevronDown, User, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaWhatsapp, FaLinkedinIn } from "react-icons/fa";
import { MdEmail, MdPhone } from "react-icons/md";
import logo from "../assets/mfspl.png"; 

const slides = [
  {
    title: "Smart Investment Solutions",
    subtitle:
      "Build wealth systematically with our expertly curated mutual fund portfolios.",
    image:
      "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1920&q=80",
  },
  {
    title: "Secure Your Future",
    subtitle:
      "Diversify your investments with our comprehensive range of mutual funds and insurance.",
    image:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1920&q=80",
  },
  {
    title: "Financial Freedom",
    subtitle:
      "Start your investment journey today with SIP plans starting from just ₹500.",
    image:
      "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1920&q=80",
  },
];

const services = [
  { name: "Mutual Funds", href: "#" },
  { name: "Health Insurance Policies", href: "#" },
  { name: "General Insurance", href: "#" },
  { name: "Deposits", href: "#" },
];

export default function EnhancedSliderWithNav() {
  const [current, setCurrent] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState([
    {
      from: "bot",
      text: "Hi! Ask me anything about mutual funds risk.",
    },
  ]);
  const intervalRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const nextSlide = () => {
    setCurrent((prev) => {
      const next = prev + 1;
      return next >= slides.length ? 0 : next;
    });
    resetInterval();
  };

  const prevSlide = () => {
    setCurrent((prev) => {
      const prevIndex = prev - 1;
      return prevIndex < 0 ? slides.length - 1 : prevIndex;
    });
    resetInterval();
  };

  const resetInterval = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        setCurrent((prev) => (prev + 1) % slides.length);
      }, 5000);
    }
  };

  const goToSlide = (index) => {
    setCurrent(index);
    resetInterval();
  };

  // Simple bot logic for mutual fund risk questions
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

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Top Nav */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 border-b border-gray-100 py-2 transition-all duration-500 ${
          isScrolled
            ? "bg-white/90 backdrop-blur-md shadow-lg animate-navFadeIn"
            : "bg-transparent"
        }`}
        style={{
          boxShadow: isScrolled ? "0 2px 16px rgba(0,0,0,0.08)" : "none",
        }}
      >
        <div className="flex justify-between items-center px-4 md:px-8">
          {/* Toggler Button */}
          <button
            className="md:hidden text-white focus:outline-none"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          {/* Desktop Icons */}
          <ul className={`hidden md:flex gap-4 items-center ${isScrolled ? "text-gray-600" : "text-white"}`}>
            <li className="hover:text-blue-600 transition-colors duration-200">
              <a href="https://facebook.com" target="_blank"><FaFacebookF /></a>
            </li>
            <li className="hover:text-pink-600 transition-colors duration-200">
              <a href="https://instagram.com" target="_blank"><FaInstagram /></a>
            </li>
            <li className="hover:text-green-600 transition-colors duration-200">
              <a href="https://wa.me/your-number" target="_blank"><FaWhatsapp /></a>
            </li>
            <li className="hover:text-blue-800 transition-colors duration-200">
              <a href="https://linkedin.com" target="_blank"><FaLinkedinIn /></a>
            </li>
          </ul>

          {/* mail/num */}
          <div className={`font-semibold text-sm hidden md:flex items-center gap-2 transition-colors duration-500 ${
            isScrolled ? "text-green-700" : "text-white"
          }`}>
            <MdEmail className="text-lg" />
            mf@mfspl.com | kannanrsbi@gmail.com
          </div>

          <div className={`font-semibold text-sm hidden md:flex items-center gap-2 transition-colors duration-500 ${
            isScrolled ? "text-green-700" : "text-white"
          }`}>
            <MdPhone className="text-lg" />
            +91-989-474-9352 | +91 422 4960352
          </div>

          {/* Search + Ask */}
          <div className="flex items-center gap-4">
            <div className="relative max-w-sm hidden md:block">
              <input
                type="text"
                placeholder="Search"
                className={`w-50 pl-10 pr-4 py-1 rounded-full border ${
                  isScrolled ? "border-green-700 text-gray-700 placeholder-green-700" : "border-white text-gray-700 placeholder-white"
                } shadow-sm focus:outline-none focus:ring-1 focus:ring-green-500 transition`}
              />
              <div className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                isScrolled ? "text-green-700" : "text-gray-400"
              }`}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
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
              className="hidden md:flex items-center gap-2 px-4 py-1 cursor-pointer"
              onClick={() => setShowChatbot(true)}
              title="Ask our chatbot"
              style={{
                color: isScrolled ? "#166534" : "#fff",
                background: isScrolled ? "rgba(255,255,255,0.8)" : "transparent",
                borderRadius: "9999px",
                transition: "all 0.3s",
              }}
            >
              <MessageCircle className={`h-5 w-5 ${isScrolled ? "text-green-700" : "text-white"}`} />
              <span className="font-semibold">Ask Question</span>
            </div>
          </div>
        </div>
        {/* Slide Menu for Mobile */}
        <div
          className={`fixed top-0 left-0 w-64 h-full bg-gray-900 text-white transform ${
            menuOpen ? "translate-x-0" : "-translate-x-full"
          } transition-transform duration-300 ease-in-out z-40 md:hidden`}
        >
          <div className="p-4">
            {/* Add Close Button */}
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-2xl font-bold"
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
            >
              ×
            </button>
            <ul className="space-y-4 text-lg mt-8">
              <li><a href="https://facebook.com" className="block hover:text-blue-600"><FaFacebookF className="inline mr-2" />Facebook</a></li>
              <li><a href="https://instagram.com" className="block hover:text-pink-600"><FaInstagram className="inline mr-2" />Instagram</a></li>
              <li><a href="https://wa.me/your-number" className="block hover:text-green-600"><FaWhatsapp className="inline mr-2" />WhatsApp</a></li>
              <li><a href="https://linkedin.com" className="block hover:text-blue-800"><FaLinkedinIn className="inline mr-2" />LinkedIn</a></li>
              <li>
                <div
                  className="flex items-center gap-2 text-green-400 cursor-pointer"
                  onClick={() => setShowChatbot(true)}
                >
                  <MessageCircle className="h-5 w-5" />
                  <span>Ask Question</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <nav
        className={`fixed top-12 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? "bg-gradient-to-r from-green-900 via-green-600 to-green-900 shadow-lg rounded-bl-4xl rounded-br-2xl p-7"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0">
              <div
                className={`text-2xl font-bold transition-colors duration-300 ${
                  isScrolled ? "text-white" : "text-white"
                }`}
              >
                <img src={logo} alt="" className="h-12 w-20" />
              </div>
            </div>

            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <a
                  href="#"
                  className={`px-3 py-2 text-sm font-medium transition-all duration-200 hover:scale-105 ${
                    isScrolled
                      ? "text-gray-300 hover:text-white"
                      : "text-white/90 hover:text-green-600"
                  }`}
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
                          className="block px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-green-50 hover:text-green-700 transition-all duration-200"
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
                >
                  Contact Us
                </a>
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-4">
              <button
                onClick={() => navigate("/Signup")}
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 hover:scale-105 ${
                  isScrolled
                    ? "bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white font-bold py-2 px-6 rounded transition duration-300"
                    : "bg-white/20 backdrop-blur-sm text-white hover:bg-white/30"
                }`}
              >
                <User className="h-4 w-4 mr-2" />
                Client Login
              </button>
            </div>

            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`relative p-2 rounded-md transition-all duration-300 ${
                  isMenuOpen
                    ? "text-green-700"
                    : isScrolled
                    ? "text-gray-700"
                    : "text-white"
                }`}
                aria-label="Toggle menu"
              >
                <div className="relative w-6 h-6">
                  <span
                    className={`absolute h-0.5 w-6 bg-current transform transition-all duration-300 ${
                      isMenuOpen ? "rotate-45 top-3" : "top-1"
                    }`}
                  ></span>
                  <span
                    className={`absolute h-0.5 w-6 bg-current top-3 transition-all duration-300 ${
                      isMenuOpen ? "opacity-0" : "opacity-100"
                    }`}
                  ></span>
                  <span
                    className={`absolute h-0.5 w-6 bg-current transform transition-all duration-300 ${
                      isMenuOpen ? "-rotate-45 top-3" : "top-5"
                    }`}
                  ></span>
                </div>
              </button>
            </div>
          </div>
        </div>

        <div
          className={`md:hidden fixed top-0 left-0 w-full z-40 transition-all duration-500 ${
            isMenuOpen
              ? "max-h-screen opacity-100 translate-y-0"
              : "max-h-0 opacity-0 -translate-y-10 pointer-events-none"
          }`}
        >
          <div className="bg-green-700 text-white rounded-b-3xl shadow-xl ring-1 ring-black/10 mx-0 pt-20 pb-8 px-6 flex flex-col items-center animate-slideDown relative">
            {/* Add Close Button for right-side menu */}
            <button
              className="absolute top-4 right-4 text-gray-300 hover:text-red-500 text-2xl font-bold"
              onClick={() => setIsMenuOpen(false)}
              aria-label="Close menu"
            >
              ×
            </button>
            {["Home", "About", "Services", "Blog", "Contact Us"].map(
              (item, index) => (
                <a
                  key={item}
                  href="#"
                  className="block w-full text-center py-4 text-lg font-semibold hover:bg-green-800 rounded-xl transition-all duration-200 mb-2"
                  style={{
                    transitionDelay: isMenuOpen ? `${index * 60}ms` : "0ms",
                  }}
                >
                  {item}
                </a>
              )
            )}
            <button
              onClick={() => {
                setIsMenuOpen(false);
                navigate("/login");
              }}
              className="w-full mt-4 bg-white text-green-700 font-bold py-3 px-4 rounded-xl shadow hover:bg-green-100 transition-all duration-200 flex items-center justify-center"
            >
              <User className="inline h-5 w-5 mr-2" />
              Client Login
            </button>
          </div>
        </div>
      </nav>

      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute w-full h-full transition-all duration-1000 ease-in-out ${
            index === current
              ? "opacity-100 scale-100 pointer-events-auto"
              : "opacity-0 scale-105 pointer-events-none"
          }`}
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.3)), url(${slide.image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            transition: "opacity 1s cubic-bezier(0.4,0,0.2,1), transform 1s cubic-bezier(0.4,0,0.2,1)",
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center mt-20 px-4 md:px-8">
            <div
              className={`text-left text-white px-6 md:px-10 max-w-4xl transition-all duration-1000 delay-300 ${
                index === current
                  ? "translate-y-0 opacity-100"
                  : "translate-y-8 opacity-0"
              }`}
            >
              <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
                <span className="bg-gradient-to-r from-white to-yellow-400 bg-clip-text text-transparent">
                  {slide.title}
                </span>
              </h1>
              <p className="text-lg md:text-4xl mb-6 font-light leading-relaxed">
                {slide.subtitle}
              </p>
              <button onClick={() => navigate("/Signup")} className="bg-gradient-to-r from-green-700 to-green-900 hover:from-green-900 hover:to-green-700 text-white cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl font-bold py-2 px-8 rounded-full text-md font-medium">
                Start Investing
              </button>
              <button onClick={() => navigate("/Calculator")} className="ms-5 border-2 border-white bg-transparent text-white cursor-pointer transition-all duration-300 hover:bg-white hover:text-green-700 hover:scale-105 hover:shadow-xl font-bold py-2 px-8 rounded-full text-md font-medium">
                Calculator
              </button>
            </div>
          </div>
        </div>
      ))}

      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-3 z-30">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goToSlide(i)}
            className={`relative overflow-hidden transition-all duration-300 rounded-full ${
              i === current
                ? "w-12 h-3 bg-white"
                : "w-3 h-3 bg-white/50 hover:bg-white/70"
            }`}
          >
            {i === current && (
              <div
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-green-300 to-green-900 rounded-full"
                style={{
                  width: "100%",
                  animation: "progress 5s linear infinite",
                }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Chatbot Modal */}
      {showChatbot && (
        <div className="fixed inset-0 z-50 flex items-end justify-end p-6 bg-black/20">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <div className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-green-600" />
                <span className="font-bold text-green-700">Mutual Fund Chatbot</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  className="text-green-500 hover:text-green-700 text-sm font-semibold px-2 py-1 rounded transition"
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
                  className="text-gray-400 hover:text-red-500 text-xl font-bold"
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
                        ? "bg-green-100 text-green-900"
                        : "bg-green-600 text-white"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>
            <form onSubmit={handleChatSubmit} className="flex items-center border-t p-2 gap-2">
              <input
                type="text"
                className="flex-1 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
                placeholder="Type your question..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                autoFocus
              />
              <button
                type="submit"
                className="bg-gradient-to-r from-green-500 to-green-700 text-white px-4 py-2 rounded hover:from-green-600 hover:to-green-800 transition"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes progress {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }
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
      `}</style>
    </div>
  );
}
