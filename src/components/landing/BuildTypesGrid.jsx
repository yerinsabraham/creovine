import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { 
  FaMobile, 
  FaGlobe, 
  FaShoppingCart, 
  FaUsers,
  FaChartLine,
  FaGamepad,
  FaBitcoin,
  FaUtensils
} from 'react-icons/fa';

const buildTypes = [
  { icon: <FaMobile />, title: 'Mobile Apps', description: 'iOS & Android applications', color: 'from-blue to-green' },
  { icon: <FaGlobe />, title: 'Web Apps', description: 'Responsive web applications', color: 'from-green to-blue' },
  { icon: <FaShoppingCart />, title: 'E-Commerce', description: 'Online stores & marketplaces', color: 'from-blue to-green' },
  { icon: <FaUsers />, title: 'Social Platforms', description: 'Community & networking apps', color: 'from-green to-blue' },
  { icon: <FaChartLine />, title: 'SaaS Dashboard', description: 'Business management tools', color: 'from-blue to-green' },
  { icon: <FaGamepad />, title: 'Gaming Apps', description: 'Interactive gaming experiences', color: 'from-green to-blue' },
  { icon: <FaBitcoin />, title: 'Blockchain', description: 'Web3 & crypto applications', color: 'from-blue to-green' },
  { icon: <FaUtensils />, title: 'Food Delivery', description: 'Restaurant & delivery apps', color: 'from-green to-blue' }
];

const BuildTypesGrid = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-32 px-6 sm:px-8 bg-background overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6">
            What Can We <span className="gradient-text">Build?</span>
          </h2>
          <p className="text-xl sm:text-2xl text-white font-medium max-w-3xl mx-auto leading-relaxed">
            From simple MVPs to complex enterprise solutions
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {buildTypes.map((type, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-popup rounded-2xl p-8 cursor-pointer group hover:shadow-2xl transition-all duration-300 border-2 border-darkGray hover:border-green"
            >
              <div className={`text-5xl mb-6 bg-gradient-to-r ${type.color} bg-clip-text text-transparent`}>
                {type.icon}
              </div>
              <h3 className="text-xl font-bold mb-3 text-white group-hover:text-green transition-colors">
                {type.title}
              </h3>
              <p className="text-white text-base leading-relaxed">
                {type.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BuildTypesGrid;
