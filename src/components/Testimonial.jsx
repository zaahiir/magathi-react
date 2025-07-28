import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ResponsiveMFDSlider = () => {
  const [current, setCurrent] = useState(0);
  const [mobileCurrent, setMobileCurrent] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const trackRef = useRef(null);
  const wrapRef = useRef(null);

  const sliderData = [
    {
      id: 1,
      title: "Mutual Fund Distribution",
      description: "Expert distribution of mutual fund schemes with comprehensive support for all your investment needs.",
      bgImage: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1920&q=80",
      thumbImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=400&q=80"
    },
    {
      id: 2,
      title: "Scheme Selection & Risk Profiling", 
      description: "Incidental advice for scheme selection based on your risk profile and investment objectives.",
      bgImage: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1920&q=80",
      thumbImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80"
    },
    {
      id: 3,
      title: "Transaction Support",
      description: "Complete assistance with purchase, redemption, switch transactions and portfolio management.",
      bgImage: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=1920&q=80", 
      thumbImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80"
    },
    {
      id: 4,
      title: "After-Sales Service",
      description: "Ongoing support including KYC updates, bank detail changes, and account maintenance services.",
      bgImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1920&q=80",
      thumbImage: "https://images.unsplash.com/photo-1494790108755-2616b612b786?auto=format&fit=crop&w=400&q=80"
    },
    {
      id: 5,
      title: "MFD Scope & Compliance",
      description: "Clear service boundaries as MFD. No investment advice unless registered as RIA. Insurance offered separately.",
      bgImage: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=1920&q=80",
      thumbImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=80"
    }
  ];

  // Desktop Center Mode Functions
  const center = useCallback((index) => {
    if (!trackRef.current || !wrapRef.current) return;
    
    const cards = trackRef.current.children;
    const card = cards[index];
    if (!card) return;

    const start = card.offsetLeft;
    wrapRef.current.scrollTo({
      left: start - (wrapRef.current.clientWidth / 2 - card.clientWidth / 2),
      behavior: 'smooth'
    });
  }, []);

  const activate = useCallback((index, scroll = false) => {
    if (index === current) return;
    setCurrent(index);
    if (scroll) center(index);
  }, [current, center]);

  const go = useCallback((step) => {
    const newIndex = Math.min(Math.max(current + step, 0), sliderData.length - 1);
    activate(newIndex, true);
  }, [current, activate, sliderData.length]);

  // Mobile Slider Functions
  const nextMobileSlide = useCallback(() => {
    setMobileCurrent((prev) => (prev + 1) % sliderData.length);
  }, [sliderData.length]);

  const prevMobileSlide = useCallback(() => {
    setMobileCurrent((prev) => (prev - 1 + sliderData.length) % sliderData.length);
  }, [sliderData.length]);

  const goToMobileSlide = useCallback((index) => {
    setMobileCurrent(index);
  }, []);

  // Mobile Touch Handlers
  const handleMobileTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleMobileTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleMobileTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextMobileSlide();
    } else if (isRightSwipe) {
      prevMobileSlide();
    }
  };

  // Desktop handlers
  const handleCardClick = (index) => {
    activate(index, true);
  };

  const handleCardHover = (index) => {
    if (window.matchMedia('(hover: hover)').matches) {
      activate(index, true);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (window.innerWidth >= 1024) {
        // Desktop navigation
        if (['ArrowRight', 'ArrowDown'].includes(e.key)) go(1);
        if (['ArrowLeft', 'ArrowUp'].includes(e.key)) go(-1);
      } else {
        // Mobile navigation
        if (['ArrowRight', 'ArrowDown'].includes(e.key)) nextMobileSlide();
        if (['ArrowLeft', 'ArrowUp'].includes(e.key)) prevMobileSlide();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [go, nextMobileSlide, prevMobileSlide]);

  // Center on resize for desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        center(current);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [current, center]);

  // Initial centering for desktop
  useEffect(() => {
    if (window.innerWidth >= 1024) {
      const timer = setTimeout(() => center(0), 100);
      return () => clearTimeout(timer);
    }
  }, [center]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-300 font-sans">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-5 py-16 md:py-20 flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8">
        <h2 className="text-2xl md:text-4xl lg:text-5xl font-normal text-white leading-tight max-w-3xl">
          Services Offered by Your MFD Partner
        </h2>
        
        {/* Desktop Navigation */}
        <div className="hidden lg:flex gap-2">
          <button
            onClick={() => go(-1)}
            disabled={current === 0}
            className="w-10 h-10 rounded-full bg-white/10 text-white text-2xl flex items-center justify-center cursor-pointer transition-all duration-300 hover:bg-orange-500 disabled:opacity-30 disabled:cursor-default disabled:hover:bg-white/10"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={() => go(1)}
            disabled={current === sliderData.length - 1}
            className="w-10 h-10 rounded-full bg-white/10 text-white text-2xl flex items-center justify-center cursor-pointer transition-all duration-300 hover:bg-orange-500 disabled:opacity-30 disabled:cursor-default disabled:hover:bg-white/10"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Mobile Navigation */}
        <div className="flex lg:hidden gap-2">
          <button
            onClick={prevMobileSlide}
            className="w-10 h-10 rounded-full bg-white/10 text-white text-2xl flex items-center justify-center cursor-pointer transition-all duration-300 hover:bg-orange-500"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextMobileSlide}
            className="w-10 h-10 rounded-full bg-white/10 text-white text-2xl flex items-center justify-center cursor-pointer transition-all duration-300 hover:bg-orange-500"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Desktop Center Mode Slider */}
      <div className="hidden lg:block max-w-7xl mx-auto overflow-hidden">
        <div 
          ref={wrapRef}
          className="overflow-x-hidden"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <div 
            ref={trackRef}
            className="flex gap-5 items-start justify-center scroll-smooth pb-10"
          >
            {sliderData.map((item, index) => {
              const isActive = index === current;
              
              return (
                <article
                  key={item.id}
                  className={`relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 ease-out ${
                    isActive 
                      ? 'flex-none w-96 lg:w-[30rem] h-[26rem] transform -translate-y-2 shadow-2xl' 
                      : 'flex-none w-20 h-[26rem]'
                  }`}
                  onClick={() => handleCardClick(index)}
                  onMouseEnter={() => handleCardHover(index)}
                >
                  <img
                    src={item.bgImage}
                    alt={item.title}
                    className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 ${
                      isActive ? 'brightness-75 saturate-100 scale-100' : 'brightness-75 saturate-75 scale-105 hover:brightness-90 hover:saturate-100 hover:scale-100'
                    }`}
                  />

                  <div className={`absolute inset-0 flex ${
                    isActive 
                      ? 'flex-row items-center justify-start p-8 gap-6' 
                      : 'flex-col items-center justify-center p-0'
                  } bg-gradient-to-t from-black/85 via-transparent to-transparent z-10`}>
                    
                    {isActive ? (
                      <>
                        <img
                          src={item.thumbImage}
                          alt={item.title}
                          className="w-32 h-64 rounded-lg object-cover shadow-lg flex-shrink-0"
                        />
                        
                        <div className="flex-1">
                          <h3 className="text-4xl font-bold text-white mb-3">
                            {item.title}
                          </h3>
                          <p className="text-gray-200 text-lg mb-6 leading-relaxed max-w-64">
                            {item.description}
                          </p>
                          <button className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white text-base font-semibold rounded-full transition-colors duration-300">
                            Learn More
                          </button>
                        </div>
                      </>
                    ) : (
                      <h3 className="text-white font-bold text-xl transform rotate-180 writing-mode-vertical-rl">
                        {item.title}
                      </h3>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        {/* Desktop Dots */}
        <div className="flex gap-2 justify-center pb-5">
          {sliderData.map((_, index) => (
            <button
              key={index}
              onClick={() => activate(index, true)}
              className={`w-3 h-3 rounded-full cursor-pointer transition-all duration-300 ${
                index === current 
                  ? 'bg-orange-500 transform scale-125' 
                  : 'bg-white/35 hover:bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Mobile Single Card Slider */}
      <div className="lg:hidden px-5">
        <div className="relative overflow-hidden rounded-2xl">
          <div 
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${mobileCurrent * 100}%)` }}
            onTouchStart={handleMobileTouchStart}
            onTouchMove={handleMobileTouchMove}
            onTouchEnd={handleMobileTouchEnd}
          >
            {sliderData.map((item, index) => (
              <div
                key={item.id}
                className="relative w-full flex-shrink-0 h-96"
              >
                <img
                  src={item.bgImage}
                  alt={item.title}
                  className="absolute inset-0 w-full h-full object-cover brightness-75"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent z-10" />
                
                <div className="absolute inset-0 flex flex-col justify-end p-6 z-20">
                  <div className="flex gap-4 items-end">
                    <img
                      src={item.thumbImage}
                      alt={item.title}
                      className="w-20 h-28 rounded-lg object-cover shadow-lg flex-shrink-0"
                    />
                    
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-white mb-2">
                        {item.title}
                      </h3>
                      <p className="text-gray-200 text-sm mb-4 leading-relaxed">
                        {item.description}
                      </p>
                      <button className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-full transition-colors duration-300">
                        Learn More
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Dots */}
        <div className="flex gap-2 justify-center mt-6 pb-10">
          {sliderData.map((_, index) => (
            <button
              key={index}
              onClick={() => goToMobileSlide(index)}
              className={`w-3 h-3 rounded-full cursor-pointer transition-all duration-300 ${
                index === mobileCurrent 
                  ? 'bg-orange-500 transform scale-125' 
                  : 'bg-white/35'
              }`}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .writing-mode-vertical-rl {
          writing-mode: vertical-rl;
        }
      `}</style>
    </div>
  );
};

export default ResponsiveMFDSlider;