import React, { useState, useEffect } from 'react';
import logo from '../assets/mfspl.png';

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-200 transition-opacity duration-300 ease-in-out opacity-100">
      <div className="flex flex-col items-center space-y-6">
        {/* Big Green Circle Loader */}
        <div className="relative">
          <div className="w-50 h-50 border-4 border-gray-100 rounded-full animate-spin border-t-green-700"></div>
        </div>

        <div className="flex items-center justify-center w-32 h-16 mt-4">
         <img src={logo} alt="" className="h-16 w-36" />
        </div>

        <p className="text-black text-lg font-medium">Loading...</p>
      </div>
    </div>
  );
};

export default Loader;