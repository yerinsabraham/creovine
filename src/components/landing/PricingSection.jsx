import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { FaCheck } from 'react-icons/fa';
import Button from '../common/Button';

const packages = [
  {
    name: 'Starter',
    price: '$2,499',
    description: 'Perfect for MVPs and simple apps',
    features: [
      'Up to 5 screens',
      'Basic authentication',
      'Firebase backend',
      '2 rounds of revisions',
      '30 days support',
      'Source code included'
    ],
    popular: false
  },
  {
    name: 'Professional',
    price: '$4,999',
    description: 'For feature-rich applications',
    features: [
      'Up to 15 screens',
      'Advanced authentication',
      'Custom backend options',
      '4 rounds of revisions',
      '90 days support',
      'API integrations',
      'Admin dashboard',
      'Source code included'
    ],
    popular: true
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'Complex systems and scaling',
    features: [
      'Unlimited screens',
      'Multi-platform support',
      'Scalable architecture',
      'Unlimited revisions',
      '1 year support',
      'DevOps setup',
      'Team training',
      'Dedicated project manager'
    ],
    popular: false
  }
];

const PricingSection = ({ onGetStarted }) => {
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
            Transparent <span className="gradient-text">Pricing</span>
          </h2>
          <p className="text-xl sm:text-2xl text-white font-medium max-w-3xl mx-auto leading-relaxed">
            Choose the package that fits your needs
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {packages.map((pkg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className={`
                relative bg-popup rounded-2xl p-6 sm:p-8 
                ${pkg.popular ? 'border-2 border-green md:scale-105 shadow-2xl' : 'border-2 border-transparent'}
                hover:border-green transition-all duration-300
              `}
            >
              {pkg.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-button-gradient px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-xl sm:text-2xl font-bold mb-2 text-white">{pkg.name}</h3>
                <p className="text-textSecondary text-sm mb-4">{pkg.description}</p>
                <div className="text-3xl sm:text-4xl font-bold gradient-text mb-2">{pkg.price}</div>
                {pkg.price !== 'Custom' && (
                  <p className="text-textSecondary text-sm">One-time payment</p>
                )}
              </div>

              <ul className="space-y-3 sm:space-y-4 mb-8">
                {pkg.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <FaCheck className="text-green mt-1 flex-shrink-0 text-sm" />
                    <span className="text-lightGray text-sm sm:text-base">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                onClick={onGetStarted}
                variant={pkg.popular ? 'primary' : 'outline'}
                className="w-full"
              >
                Get Started
              </Button>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="text-center text-textSecondary mt-12 text-sm sm:text-base px-4"
        >
          All packages include source code, deployment assistance, and satisfaction guarantee
        </motion.p>
      </div>
    </section>
  );
};

export default PricingSection;
