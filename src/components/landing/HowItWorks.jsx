import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { FaLightbulb, FaRocket, FaCode, FaCheckCircle } from 'react-icons/fa';

const steps = [
  {
    icon: <FaLightbulb />,
    title: 'Share Your Vision',
    description: 'Tell us about your app idea through our interactive chip-based interface'
  },
  {
    icon: <FaRocket />,
    title: 'Customize Features',
    description: 'Select from hundreds of pre-built features or describe custom ones'
  },
  {
    icon: <FaCode />,
    title: 'We Build It',
    description: 'Our expert team brings your vision to life with clean, scalable code'
  },
  {
    icon: <FaCheckCircle />,
    title: 'Launch & Grow',
    description: 'Get your app deployed and start growing with ongoing support'
  }
];

const HowItWorks = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-32 px-6 sm:px-8 bg-darkBg overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6">
            How It <span className="gradient-text">Works</span>
          </h2>
          <p className="text-xl sm:text-2xl text-white font-medium max-w-3xl mx-auto leading-relaxed">
            From concept to deployment in four simple steps
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="relative"
            >
              {/* Connector Line (hidden on last item) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-green to-transparent -z-10" />
              )}

              <div className="bg-popup rounded-2xl p-8 hover:bg-opacity-80 transition-all duration-300 h-full border-2 border-darkGray hover:border-green shadow-xl\">
                <div className="text-5xl text-green mb-6">
                  {step.icon}
                </div>
                <div className="text-2xl font-bold mb-4 text-white">
                  {step.title}
                </div>
                <p className="text-base text-white leading-relaxed">
                  {step.description}
                </p>
              </div>

              {/* Step Number */}
              <div className="absolute -top-4 -right-4 w-12 h-12 bg-button-gradient rounded-full flex items-center justify-center font-black text-xl shadow-2xl">
                {index + 1}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
