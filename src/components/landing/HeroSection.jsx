import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import Button from '../common/Button';
import { FaRocket } from 'react-icons/fa';

const HeroSection = ({ onGetStarted }) => {
  const [typedText, setTypedText] = useState('');
  const fullText = 'Turn your vision into reality with our intelligent platform';
  
  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index <= fullText.length) {
        setTypedText(fullText.slice(0, index));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 50);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-darkBg via-background to-background"></div>
      
      {/* Animated circles */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.15, 0.25, 0.15],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-20 left-10 w-96 h-96 bg-green rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.15, 0.25, 0.15],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
        className="absolute bottom-20 right-10 w-96 h-96 bg-blue rounded-full blur-3xl"
      />

      {/* Content */}
      <div className="relative z-10 text-center px-6 sm:px-8 max-w-6xl mx-auto w-full py-20">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold leading-tight mb-6">
            <span className="gradient-text block mb-2">Idea to App</span>
            <span className="text-white block">in Record Time</span>
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mb-10"
        >
          <p className="text-xl sm:text-2xl md:text-3xl text-white font-medium max-w-4xl mx-auto leading-relaxed">
            {typedText}
            <span className="animate-pulse">|</span>
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mb-16"
        >
          <Button
            onClick={onGetStarted}
            size="lg"
            icon={<FaRocket className="text-xl" />}
            className="text-xl px-12 py-5 shadow-2xl hover:shadow-green/50 transform hover:scale-105"
          >
            Start Building Now
          </Button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="grid grid-cols-3 gap-8 sm:gap-12 max-w-4xl mx-auto pt-8 border-t border-darkGray/50"
        >
          {[
            { number: '500+', label: 'Apps Built' },
            { number: '98%', label: 'Success Rate' },
            { number: '5-7', label: 'Days Average' }
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl sm:text-5xl md:text-6xl font-black gradient-text mb-3">
                {stat.number}
              </div>
              <div className="text-sm sm:text-base md:text-lg text-white font-semibold">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 hidden md:block"
      >
        <div className="w-6 h-10 border-2 border-white rounded-full flex items-start justify-center p-2 opacity-50">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1.5 h-1.5 bg-white rounded-full"
          />
        </div>
      </motion.div>
    </div>
  );
};

export default HeroSection;
