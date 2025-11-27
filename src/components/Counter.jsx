import React, { useState, useEffect, useRef } from 'react';
import { Handshake, Smile, X } from 'lucide-react';

const VideoSection = () => {
  const [clientCount, setClientCount] = useState(0);
  const [customerCount, setCustomerCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const sectionRef = useRef(null);

  // Intersection Observer to trigger animation when section is visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [isVisible]);

  // Counter animation effect
  useEffect(() => {
    if (isVisible) {
      // Animate client count to 50
      const clientInterval = setInterval(() => {
        setClientCount(prev => {
          if (prev >= 50) {
            clearInterval(clientInterval);
            return 50;
          }
          return prev + 1;
        });
      }, 30);

      // Animate customer count to 1354
      const customerInterval = setInterval(() => {
        setCustomerCount(prev => {
          if (prev >= 1354) {
            clearInterval(customerInterval);
            return 1354;
          }
          return prev + 27; // Increment by 27 to reach 1354 smoothly
        });
      }, 30);

      return () => {
        clearInterval(clientInterval);
        clearInterval(customerInterval);
      };
    }
  }, [isVisible]);

  const handleVideoClick = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Close modal when clicking outside
  const handleModalClick = (e) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  return (
    <section ref={sectionRef} className="relative bg-gray-100 py-12 sm:py-16 md:py-20">
      {/* Pattern Layer */}
      <div className="absolute top-6 sm:top-8 md:top-12 right-4 sm:right-6 md:right-12 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 xl:w-32 xl:h-32 bg-no-repeat z-10 hidden lg:block">
        <img src="/src/assets/shape-5.png" alt="" className="w-full h-full object-contain" />
      </div>

      {/* Outer Container */}
      <div className="relative px-3 sm:px-4 md:px-6 lg:px-8 xl:px-16 2xl:px-32">
        <div className="max-w-7xl mx-auto">
          {/* Funfact Inner Section */}
          <div className="relative w-full bg-white -mb-12 sm:-mb-16 md:-mb-20 lg:-mb-24 z-10 rounded-t-xl sm:rounded-t-2xl md:rounded-t-3xl shadow-lg">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              {/* Client Count Block */}
              <div className="relative">
                <div className="relative block p-4 sm:p-6 md:p-8 lg:p-10 lg:pl-20 xl:pl-36 bg-[#53755d] rounded-tl-xl sm:rounded-tl-2xl md:rounded-tl-3xl">
                  {/* Icon Box */}
                  <div className="absolute left-4 sm:left-6 md:left-8 lg:left-12 top-4 sm:top-6 md:top-8 lg:top-10 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 xl:w-18 xl:h-18 bg-white text-center flex items-center justify-center rounded-full">
                    <Handshake className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 xl:w-8 xl:h-8 text-[#53755d]" />
                  </div>

                  {/* Count Display */}
                  <div className="relative pt-4 sm:pt-6 md:pt-8 lg:pt-9">
                    <div className="relative text-white font-bold text-xl sm:text-2xl md:text-3xl lg:text-5xl xl:text-7xl leading-tight sm:leading-8 md:leading-10 lg:leading-11 font-sans mb-2">
                      <span>{clientCount}</span>
                      <span className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl ml-1">+Clients</span>
                    </div>
                    <p className="text-green-100 text-xs sm:text-sm md:text-base lg:text-base mt-2">
                      Partnered with Leading Business Company
                    </p>
                  </div>
                </div>
              </div>

              {/* Customer Count Block */}
              <div className="relative">
                <div className="relative block p-4 sm:p-6 md:p-8 lg:p-10 lg:pl-20 xl:pl-36 bg-white">
                  {/* Icon Box */}
                  <div className="absolute left-4 sm:left-6 md:left-8 lg:left-12 top-4 sm:top-6 md:top-8 lg:top-10 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 xl:w-18 xl:h-18 bg-gray-100 text-center flex items-center justify-center rounded-full">
                    <Smile className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 xl:w-8 xl:h-8 text-[#53755d]" />
                  </div>

                  {/* Content */}
                  <div className="relative">
                    <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold text-gray-800 leading-tight sm:leading-8 md:leading-10 mb-2">
                      <a href="#testimonial-section" className="hover:text-[#53755d] transition-colors">
                        {customerCount}+ <span className="font-normal">Customer</span>
                      </a>
                    </h3>
                    <p className="text-gray-600 mb-3 sm:mb-4 text-xs sm:text-sm md:text-base lg:text-base">
                      Empowering Customers, Inspiring Loyalty
                    </p>
                    <div className="mt-3 sm:mt-4">
                      <a href="#testimonial-section" className="inline-flex items-center text-gray-800 font-semibold text-xs sm:text-sm md:text-base lg:text-lg hover:text-[#53755d] transition-colors group">
                        <span className="pr-3 sm:pr-4 md:pr-6 relative">
                          Client Review
                          <svg className="absolute right-0 top-0.5 sm:top-1 w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"/>
                          </svg>
                        </span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Video Section */}
        <div className="relative mx-1 sm:mx-2 md:mx-4 lg:mx-6 xl:mx-8">
          <div className="relative py-20 sm:py-24 md:py-32 lg:py-40 xl:py-48 2xl:py-72 px-3 sm:px-4 md:px-6 lg:px-8 overflow-hidden text-center">
            {/* Background Layer */}
            <div 
              className="absolute left-0 top-0 w-full h-full bg-cover bg-no-repeat bg-center rounded-2xl sm:rounded-3xl md:rounded-[30px] lg:rounded-[60px] xl:rounded-[90px]"
              style={{
                backgroundImage: "url('/src/assets/counter.jpg')"
              }}
            ></div>

            {/* Centered Video Play Button */}
            <div className="relative flex items-center justify-center h-full">
              <button 
                onClick={handleVideoClick}
                className="relative inline-block w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 xl:w-24 xl:h-24 bg-white text-center text-base sm:text-lg md:text-xl text-gray-800 rounded-full hover:scale-110 transition-transform duration-300 focus:outline-none focus:ring-4 focus:ring-white focus:ring-opacity-30 z-10 shadow-lg"
                style={{
                  boxShadow: '0 0 0 0 rgba(255, 255, 255, 0.5)',
                  animation: 'ripple 3s infinite'
                }}
              >
                <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4 lg:w-6 lg:h-6 xl:w-8 xl:h-8 ml-0.5 sm:ml-0.5 md:ml-1 lg:ml-1.5 inline-block" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8,5.14V19.14L19,12.14L8,5.14Z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Video Modal */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={handleModalClick}
        >
          <div className="relative w-full max-w-4xl mx-auto">
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors z-10"
            >
              <X className="w-6 h-6" />
            </button>
            
            {/* Video Container */}
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              <iframe
                className="absolute top-0 left-0 w-full h-full rounded-lg"
                src="https://www.youtube.com/watch?v=8A3s9WP_7l4"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}

      <style jsx="true">{`
        @keyframes ripple {
          70% {
            box-shadow: 0 0 0 30px rgba(255, 255, 255, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(255, 255, 255, 0);
          }
        }
        
        .animate-ripple {
          animation: ripple 3s infinite;
        }
        
        .animate-ripple::before,
        .animate-ripple::after {
          content: '';
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: transparent;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.5);
          animation: ripple 3s infinite;
          transition: all 0.4s ease;
        }
        
        .animate-ripple::after {
          animation-delay: 0.6s;
        }
        
        .animate-ripple::before {
          animation-delay: 0.9s;
        }
      `}</style>
    </section>
  );
};

export default VideoSection;