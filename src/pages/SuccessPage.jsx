import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useProject } from '../context/ProjectContext';
import Button from '../components/common/Button';
import { FaCheckCircle, FaHome, FaCode, FaLaptopCode, FaPaintBrush, FaFileContract, FaBug, FaPlug, FaQrcode, FaDatabase, FaLock, FaCreditCard, FaRocket, FaTools } from 'react-icons/fa';

const SuccessPage = () => {
  const navigate = useNavigate();
  const { projectData } = useProject();

  const serviceIcons = {
    'full-stack': FaCode,
    'frontend': FaLaptopCode,
    'backend': FaCode,
    'landing-page': FaLaptopCode,
    'design': FaPaintBrush,
    'smart-contract': FaFileContract,
    'bug-fix': FaBug,
    'api': FaPlug,
    'qr-code': FaQrcode,
    'database': FaDatabase,
    'auth': FaLock,
    'payment': FaCreditCard,
    'deployment': FaRocket,
    'refactor': FaTools
  };

  const completedServices = projectData.completedServices || [];
  const hasMultipleServices = completedServices.length > 1;

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-b from-darkBg via-background to-darkBg">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="inline-block mb-8"
        >
          <FaCheckCircle className="text-9xl text-green" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-5xl font-bold mb-4"
        >
          <span className="gradient-text">Success!</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-xl text-textSecondary mb-8"
        >
          Your {hasMultipleServices ? 'projects have' : 'project has'} been submitted successfully!
        </motion.p>

        {/* Show completed services if multiple */}
        {hasMultipleServices && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-popup rounded-2xl p-6 mb-8"
          >
            <h3 className="text-lg font-semibold text-white mb-4">Services Submitted:</h3>
            <div className="flex flex-wrap gap-3 justify-center">
              {completedServices.map((service, index) => {
                const Icon = serviceIcons[service.id] || FaCode;
                const serviceName = projectData.primaryService?.id === service.id 
                  ? projectData.primaryService.name 
                  : projectData.addOns?.find(a => a.id === service.id)?.name;
                
                return (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    className="flex items-center gap-2 bg-background/50 rounded-full px-4 py-2 border border-green/30"
                  >
                    <Icon className="text-green" />
                    <span className="text-sm text-white">{serviceName}</span>
                    <FaCheckCircle className="text-green text-xs" />
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-popup rounded-2xl p-8 mb-8"
        >
          <h3 className="text-2xl font-semibold text-white mb-6">What's Next?</h3>
          <div className="space-y-4 text-left">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-green rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white font-bold">1</span>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-1">Review & Confirmation</h4>
                <p className="text-textSecondary">Our team will review your requirements within 24 hours</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-green rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white font-bold">2</span>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-1">Project Kickoff</h4>
                <p className="text-textSecondary">We'll schedule a kickoff call to discuss timeline and milestones</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-green rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white font-bold">3</span>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-1">Development Begins</h4>
                <p className="text-textSecondary">Track progress in real-time through your project dashboard</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="space-y-4"
        >
          <p className="text-textSecondary mb-4">
            We've sent a confirmation email with next steps to your inbox
          </p>
          <Button
            onClick={() => navigate('/')}
            icon={<FaHome />}
            size="lg"
          >
            Return to Homepage
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default SuccessPage;
