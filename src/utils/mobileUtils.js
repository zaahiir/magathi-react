// Mobile optimization utilities
export const MOBILE_BREAKPOINTS = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px'
};

// Minimum touch target size (44px as per Apple HIG and Material Design)
export const MIN_TOUCH_TARGET = 'min-h-[44px] min-w-[44px]';

// Mobile-optimized button classes
export const MOBILE_BUTTON_CLASSES = `
  ${MIN_TOUCH_TARGET}
  px-4 py-3
  text-base
  font-medium
  rounded-lg
  transition-all
  duration-200
  active:scale-95
  focus:outline-none
  focus:ring-2
  focus:ring-offset-2
`;

// Mobile-optimized input classes
export const MOBILE_INPUT_CLASSES = `
  w-full
  px-4 py-3
  text-base
  border
  border-gray-300
  rounded-lg
  focus:ring-2
  focus:ring-[#53755d]
  focus:border-transparent
  transition-colors
`;

// Mobile-optimized card classes
export const MOBILE_CARD_CLASSES = `
  bg-white
  rounded-xl
  shadow-lg
  p-6
  mb-4
  transition-all
  duration-200
  hover:shadow-xl
  active:scale-[0.98]
`;

// Check if device is mobile
export const isMobile = () => {
  return window.innerWidth < 768;
};

// Check if device supports touch
export const isTouchDevice = () => {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};

// Get mobile-optimized spacing
export const getMobileSpacing = (base = '4') => {
  return isMobile() ? `p-${base}` : `p-${base} md:p-${parseInt(base) + 2}`;
};

// Mobile-optimized text sizes
export const getMobileTextSize = (base = 'base') => {
  return isMobile() ? `text-${base}` : `text-${base} md:text-lg`;
};




