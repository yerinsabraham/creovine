import { 
  FaMobileAlt, 
  FaGlobe, 
  FaEthereum, 
  FaBug, 
  FaPlug, 
  FaCode,
  FaServer, 
  FaCube,
  FaPalette,
  FaQrcode,
  FaDatabase,
  FaLock,
  FaCreditCard,
  FaRocket,
  FaComments 
} from 'react-icons/fa';

/**
 * Service Categories Configuration
 * User-intent focused categories for better discoverability
 */
export const serviceCategories = [
  {
    id: 'full-app',
    name: 'Full-Stack App',
    icon: FaMobileAlt,
    color: '#29BD98',
    route: '/onboarding/phase1',
    basePrices: { simple: 800, complex: 8000 },
    popular: true
  },
  {
    id: 'frontend',
    name: 'Frontend Development',
    icon: FaCode,
    color: '#2497F9',
    route: '/onboarding/frontend/step1',
    basePrices: { simple: 300, complex: 2000 },
    popular: true
  },
  {
    id: 'backend',
    name: 'Backend Development',
    icon: FaServer,
    color: '#6366F1',
    route: '/onboarding/backend/step1',
    basePrices: { simple: 400, complex: 2500 },
    popular: true
  },
  {
    id: 'landing-page',
    name: 'Landing Page',
    icon: FaGlobe,
    color: '#F59E0B',
    route: '/onboarding/landingpage/step1',
    basePrices: { simple: 150, complex: 800 },
    popular: true
  },
  {
    id: 'ui-design',
    name: 'UI/UX Design',
    icon: FaPalette,
    color: '#EC4899',
    route: '/onboarding/design/step1',
    basePrices: { simple: 200, complex: 1500 },
    popular: true
  },
  {
    id: 'smart-contract',
    name: 'Smart Contract',
    icon: FaEthereum,
    color: '#8B5CF6',
    route: '/onboarding/contract/step1',
    basePrices: { simple: 300, complex: 5000 },
    popular: true
  },
  {
    id: 'bug-fix',
    name: 'Bug Fix',
    icon: FaBug,
    color: '#EF4444',
    route: '/onboarding/bugfix/step1',
    basePrices: { simple: 25, complex: 500 },
    popular: false
  },
  {
    id: 'api-integration',
    name: 'API Integration',
    icon: FaPlug,
    color: '#F59E0B',
    route: '/onboarding/api/step1',
    basePrices: { simple: 100, complex: 400 },
    popular: true
  },
  {
    id: 'qr-code',
    name: 'QR Code System',
    icon: FaQrcode,
    color: '#14B8A6',
    route: '/onboarding/qrcode/step1',
    basePrices: { simple: 100, complex: 600 },
    popular: false
  },
  {
    id: 'database',
    name: 'Database Setup',
    icon: FaDatabase,
    color: '#8B5CF6',
    route: '/onboarding/database/step1',
    basePrices: { simple: 200, complex: 1200 },
    popular: false
  },
  {
    id: 'authentication',
    name: 'Authentication',
    icon: FaLock,
    color: '#EF4444',
    route: '/onboarding/auth/step1',
    basePrices: { simple: 150, complex: 800 },
    popular: true
  },
  {
    id: 'payment',
    name: 'Payment Integration',
    icon: FaCreditCard,
    color: '#10B981',
    route: '/onboarding/payment/step1',
    basePrices: { simple: 150, complex: 600 },
    popular: true
  },
  {
    id: 'deployment',
    name: 'Deployment Help',
    icon: FaRocket,
    color: '#F59E0B',
    route: '/onboarding/deployment/step1',
    basePrices: { simple: 100, complex: 500 },
    popular: false
  },
  {
    id: 'code-refactor',
    name: 'Code Refactoring',
    icon: FaCode,
    color: '#6366F1',
    route: '/onboarding/refactor/step1',
    basePrices: { simple: 200, complex: 2000 },
    popular: false
  }
];

/**
 * Get category by ID
 */
export const getCategoryById = (id) => {
  return serviceCategories.find(cat => cat.id === id);
};

/**
 * Get all categories for display
 */
export const getAllCategories = () => serviceCategories;
