import React, { useState, useEffect } from 'react';

const Loader = ({ duration = 3000, onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onComplete) {
        onComplete();
      }
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onComplete]);

  if (!isVisible) {
    return null;
  }

  const letters = ['M', 'A', 'G', 'A', 'T', 'H', 'I'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#53755d]">
      <div className="flex flex-col items-center justify-center space-y-4 sm:space-y-6">

        {/* Vertical Letters */}
        <div className="flex flex-col items-center justify-center space-y-1 sm:space-y-2">
          {letters.map((letter, index) => (
            <span
              key={index}
              className="text-white text-3xl sm:text-4xl md:text-5xl font-bold animate-pulse"
              style={{
                animationDelay: `${index * 0.2}s`,
                animationDuration: '1.5s'
              }}
            >
              {letter}
            </span>
          ))}
        </div>
      </div>
      
      <style>{`
        @keyframes fadeInUp {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Loader;