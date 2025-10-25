import React from 'react';
import { motion } from 'framer-motion';

const PromotionalBanner = ({ 
  message = "Seekon Apparel — Live bold. Dress sharper. Walk your story. • UPTO 30% ON SELECTED ITEMS. DISCOUNT APPLIED AUTOMATICALLY AT CHECKOUT.",
  backgroundColor = "bg-seekon-midnight",
  textColor = "text-seekon-softWhite",
  showIcons = true,
  animated = true,
  className = "",
  scrollSpeed = "slow" // slow, medium, fast
}) => {
  // Speed configurations
  const speedConfig = {
    slow: { duration: 30, delay: 15 },
    medium: { duration: 20, delay: 10 },
    fast: { duration: 15, delay: 7.5 }
  };

  const config = speedConfig[scrollSpeed] || speedConfig.medium;

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`${backgroundColor} ${textColor} py-2 relative overflow-hidden ${className}`}
    >
      {/* Scrolling text container */}
      <div className="relative h-6">
        {/* First scrolling text */}
        <motion.div
          animate={{
            x: ['100vw', '-100vw']
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: config.duration,
              ease: "linear"
            }
          }}
          className="absolute top-0 left-0 flex items-center space-x-3 whitespace-nowrap"
        >
          {showIcons && (
            <>
              {/* Price Tag Icon */}
              <div className="relative flex-shrink-0">
                <div className="w-4 h-4 border border-current transform rotate-45"></div>
                <div className="absolute top-0 left-0 w-1 h-1 bg-current rounded-full"></div>
              </div>
            </>
          )}
          
          <span className="text-xs font-medium uppercase tracking-wide flex-shrink-0">
            {message}
          </span>
          
          {showIcons && (
            <>
              {/* Price Tag Icon */}
              <div className="relative flex-shrink-0">
                <div className="w-4 h-4 border border-current transform rotate-45"></div>
                <div className="absolute top-0 left-0 w-1 h-1 bg-current rounded-full"></div>
              </div>
            </>
          )}
        </motion.div>

        {/* Second scrolling text for seamless loop */}
        <motion.div
          animate={{
            x: ['100vw', '-100vw']
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: config.duration,
              ease: "linear",
              delay: config.delay
            }
          }}
          className="absolute top-0 left-0 flex items-center space-x-3 whitespace-nowrap"
        >
          {showIcons && (
            <>
              {/* Price Tag Icon */}
              <div className="relative flex-shrink-0">
                <div className="w-4 h-4 border border-current transform rotate-45"></div>
                <div className="absolute top-0 left-0 w-1 h-1 bg-current rounded-full"></div>
              </div>
            </>
          )}
          
          <span className="text-xs font-medium uppercase tracking-wide flex-shrink-0">
            {message}
          </span>
          
          {showIcons && (
            <>
              {/* Price Tag Icon */}
              <div className="relative flex-shrink-0">
                <div className="w-4 h-4 border border-current transform rotate-45"></div>
                <div className="absolute top-0 left-0 w-1 h-1 bg-current rounded-full"></div>
              </div>
            </>
          )}
        </motion.div>
      </div>
      
      {/* Animated background effect */}
      {animated && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse"></div>
      )}
    </motion.div>
  );
};

export default PromotionalBanner;