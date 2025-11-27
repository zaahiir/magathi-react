import React, { useState, useEffect, useRef } from 'react';
import { FaFacebookF, FaInstagram, FaWhatsapp, FaLinkedinIn } from 'react-icons/fa';
import { FaArrowTrendUp } from 'react-icons/fa6';
import { MdEmail, MdPhone } from 'react-icons/md';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import logo from "../assets/mfspl.png";
import banner1 from '../assets/banner-1.jpg';
import banner2 from '../assets/banner-2.jpg';
import banner3 from '../assets/banner-3.jpg';

const slides = [
  {
    title: "Smart Investment",
    titleLarge: "Solutions",
    subtitle: "Professional Management",
    body: "Build wealth systematically with our expertly curated mutual fund portfolios designed for long-term growth and financial security.",
    image: banner1,
  },
  {
    title: "Secure Your",
    titleMedium: "Future",
    subtitle: "Diversified Portfolio",
    body: "Diversify your investments with our comprehensive range of mutual funds and insurance products for complete financial protection.",
    image: banner2,
  },
  {
    title: "Financial",
    titleLarge: "Freedom",
    subtitle: "Start Your Journey",
    body: "Begin your investment journey today with SIP plans starting from just ₹500 and watch your wealth grow over time.",
    image: banner3,
  },
];

const FuturisticBanner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const sliderRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    // Auto-play functionality - changed to 4 seconds
    intervalRef.current = setInterval(() => {
      nextSlide();
    }, 4000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [currentSlide]);

  const nextSlide = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    
    setTimeout(() => {
      setIsAnimating(false);
    }, 1200);
  };

  const prevSlide = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    
    setTimeout(() => {
      setIsAnimating(false);
    }, 1200);
  };

  const goToSlide = (index) => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setCurrentSlide(index);
    
    setTimeout(() => {
      setIsAnimating(false);
    }, 1200);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">

      {/* Social Links */}
      <div className="c-socials absolute left-0 top-1/2 transform -translate-y-1/2 bg-[#53755d] p-3 sm:p-4 md:p-6 rounded-r-lg z-20 hidden sm:block">
        <ul className="c-socials__list space-y-3 sm:space-y-4">
          <li className="c-socials__list-item">
            <a href="#" className="block">
              <FaFacebookF className="w-4 h-4 sm:w-5 sm:h-5 text-white hover:text-blue-200 transition-colors" />
            </a>
          </li>
          <li className="c-socials__list-item">
            <a href="#" className="block">
              <FaInstagram className="w-4 h-4 sm:w-5 sm:h-5 text-white hover:text-pink-200 transition-colors" />
            </a>
          </li>
          <li className="c-socials__list-item">
            <a href="#" className="block">
              <FaWhatsapp className="w-4 h-4 sm:w-5 sm:h-5 text-white hover:text-green-200 transition-colors" />
            </a>
          </li>
        </ul>
      </div>

      {/* Navigation Arrows - Responsive positioning */}
      <div className="absolute right-4 sm:right-6 md:right-8 top-3/4 transform -translate-y-1/2 z-30 flex flex-col space-y-4 sm:space-y-6 md:space-y-[30px]">
        {/* Previous Slide Button */}
        <button
          onClick={prevSlide}
          className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300 group"
          disabled={isAnimating}
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-white group-hover:scale-110 transition-transform" />
        </button>
        
        {/* Next Slide Button */}
        <button
          onClick={nextSlide}
          className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300 group"
          disabled={isAnimating}
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-white group-hover:scale-110 transition-transform" />
        </button>
      </div>

      {/* Right Side Slide Indicators - Vertical */}
      <div className="absolute right-4 sm:right-6 md:right-8 top-1/2 transform -translate-y-1/2 z-30 flex flex-col items-center space-y-3 sm:space-y-4">
        {/* Current Slide Number */}
        <div className="text-white text-lg sm:text-xl md:text-2xl font-light tracking-wider">
          {String(currentSlide + 1).padStart(2, '0')}
        </div>
        
        {/* Progress Bar */}
        <div className="w-0.5 sm:w-1 h-16 sm:h-20 md:h-24 bg-white/30 rounded-full relative">
          <div 
            className="absolute bottom-0 w-0.5 sm:w-1 bg-white rounded-full transition-all duration-1000 ease-out"
            style={{ 
              height: `${((currentSlide + 1) / slides.length) * 100}%` 
            }}
          />
        </div>
        
        {/* Total Slides */}
        <div className="text-white text-lg sm:text-xl md:text-2xl font-light tracking-wider">
          {String(slides.length).padStart(2, '0')}
        </div>
      </div>

      {/* Slider */}
      <section className="c-slider relative w-full h-full">
        <div className="c-slider-init relative w-full h-full">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`c-slide absolute inset-0 flex items-center justify-center transition-all duration-1000 ease-in-out ${
                index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-110'
              }`}
              style={{
                backgroundImage: `url(${slide.image})`,
                backgroundPosition: 'center',
                backgroundSize: 'cover',
                willChange: 'background-size',
                transitionDelay: isAnimating ? '0.4s' : '0s',
              }}
            >
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/60"></div>
              
              {/* Slide Content */}
              <div className="c-slide-content relative z-10 px-4 sm:px-6 md:px-8 mx-auto w-full max-w-6xl">
                <div className="c-wrap c-wrap--line pb-4 sm:pb-6 md:pb-8 overflow-hidden">
                  <h2 className={`c-slide__title text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-light uppercase tracking-[8px] sm:tracking-[12px] md:tracking-[16px] lg:tracking-[20px] transform transition-all duration-800 ease-in-out ${
                    index === currentSlide && !isAnimating ? 'translate-y-0 opacity-100' : 'translate-y-36 opacity-0'
                  }`}>
                    {slide.title}
                    {slide.titleLarge && (
                      <span className={`c-slide__title--large block text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl leading-[60px] sm:leading-[80px] md:leading-[90px] lg:leading-[100px] xl:leading-[110px] transform transition-all duration-1000 ease-in-out transition-delay-400 ${
                        index === currentSlide && !isAnimating ? 'translate-y-0' : 'translate-y-36'
                      }`}>
                        {slide.titleLarge}
                      </span>
                    )}
                    {slide.titleMedium && (
                      <span className={`c-slide__title--medium block text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl leading-[50px] sm:leading-[70px] md:leading-[80px] lg:leading-[90px] xl:leading-[100px] transform transition-all duration-1000 ease-in-out transition-delay-400 ${
                        index === currentSlide && !isAnimating ? 'translate-y-0' : 'translate-y-36'
                      }`}>
                        {slide.titleMedium}
                      </span>
                    )}
                  </h2>
                </div>
                
                <div className="c-wrap c-wrap--small max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl overflow-hidden">
                  <div className={`c-slide__info transform transition-all duration-800 ease-in-out ${
                    index === currentSlide && !isAnimating ? 'translate-y-0' : '-translate-y-36'
                  }`}>
                    <h3 className="c-slide__subtitle text-white text-sm sm:text-base md:text-lg lg:text-xl uppercase tracking-[2px] sm:tracking-[3px] font-medium mb-2 sm:mb-3">
                      {slide.subtitle}
                    </h3>
                    <p className={`c-slide__body text-white mt-2 sm:mt-3 leading-5 sm:leading-6 md:leading-7 text-sm sm:text-base md:text-lg opacity-0 transition-opacity duration-800 ease-in-out transition-delay-400 ${
                      index === currentSlide && !isAnimating ? 'opacity-100' : 'opacity-0'
                    }`}>
                      {slide.body}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Custom CSS for animations */}
      <style jsx="true">{`
        .c-wrap--line:after {
          content: "";
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 1px;
          background-color: white;
          bottom: 0;
          transition: 0.9s ease;
          transition-delay: 0.4s;
        }
        
        .c-wrap--line.animate:after {
          left: 0;
          transform: translateX(0);
          width: 100%;
        }
        
        @media (max-width: 1300px) {
          .c-slide__title {
            font-size: 3em;
          }
          .c-slide__title--large {
            font-size: 2em;
          }
          .c-wrap--small {
            max-width: 50%;
          }
        }
        
        @media (max-width: 800px) {
          .c-slide__title--medium {
            font-size: 1.3em;
          }
          .c-slide__title {
            font-size: 2.5em;
          }
          .c-slide__title--large {
            font-size: 1.5em;
          }
          .c-wrap--small {
            max-width: 80%;
          }
        }
      `}</style>
    </div>
  );
};

export default FuturisticBanner;
