import React, { Suspense } from 'react';
import { motion } from 'framer-motion';

const LazyWrapper = ({ children, fallback = null }) => {
  return (
    <Suspense fallback={fallback || <div className="flex justify-center items-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#53755d]"></div>
    </div>}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.div>
    </Suspense>
  );
};

export default LazyWrapper;




