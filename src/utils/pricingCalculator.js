/**
 * Pricing Calculator - Estimates project cost based on selections
 * 
 * Pricing Strategy:
 * - Base price per service type (USD base)
 * - Complexity multipliers based on features selected
 * - Multi-service bundle discounts
 * - Custom services get "Starting from" pricing
 * - Geo-based pricing (Nigeria gets discounted rounded prices in NGN)
 */

import { getLocalizedPrice } from './geolocation';

// Base prices for each service (in USD)
const BASE_PRICES = {
  frontend: 1500,
  backend: 2000,
  landingPage: 800,
  design: 1200,
  contract: 3500, // Complex, custom pricing
  bugfix: 500,
  api: 1000,
  qrcode: 600,
  database: 1200,
  auth: 800,
  payment: 1500,
  deployment: 400,
  refactor: 1000
};

// Services that require expert consultation (custom pricing)
const CUSTOM_PRICING_SERVICES = ['contract', 'bugfix', 'refactor'];

// Complexity multipliers (1.0 = base, 1.5 = medium, 2.0 = high, 2.5 = enterprise)
const calculateComplexity = (serviceId, phaseData) => {
  if (!phaseData) return 1.0;

  switch (serviceId) {
    case 'frontend':
      return calculateFrontendComplexity(phaseData);
    case 'backend':
      return calculateBackendComplexity(phaseData);
    case 'landingPage':
      return calculateLandingPageComplexity(phaseData);
    case 'design':
      return calculateDesignComplexity(phaseData);
    case 'api':
      return calculateApiComplexity(phaseData);
    case 'database':
      return calculateDatabaseComplexity(phaseData);
    case 'auth':
      return calculateAuthComplexity(phaseData);
    case 'payment':
      return calculatePaymentComplexity(phaseData);
    default:
      return 1.0;
  }
};

const calculateFrontendComplexity = (data) => {
  let multiplier = 1.0;
  
  // Complexity based on selections
  if (data.complexity === 'complex') multiplier += 0.5;
  if (data.complexity === 'very-complex') multiplier += 1.0;
  
  // Additional features
  if (data.animations === 'complex') multiplier += 0.3;
  if (data.stateManagement === 'redux' || data.stateManagement === 'mobx') multiplier += 0.2;
  if (data.realtime) multiplier += 0.3;
  
  // Number of pages/screens
  const screenCount = parseInt(data.numberOfScreens) || 5;
  if (screenCount > 10) multiplier += 0.3;
  if (screenCount > 20) multiplier += 0.5;
  
  return Math.min(multiplier, 2.5); // Cap at 2.5x
};

const calculateBackendComplexity = (data) => {
  let multiplier = 1.0;
  
  // Database complexity
  if (data.databaseType === 'mongodb' || data.databaseType === 'postgresql') multiplier += 0.2;
  if (data.databaseComplexity === 'complex') multiplier += 0.4;
  
  // API endpoints
  const endpointCount = parseInt(data.numberOfEndpoints) || 5;
  if (endpointCount > 20) multiplier += 0.4;
  if (endpointCount > 50) multiplier += 0.8;
  
  // Authentication & authorization
  if (data.authRequired) multiplier += 0.3;
  if (data.roleBasedAccess) multiplier += 0.2;
  
  // Real-time features
  if (data.realtimeFeatures) multiplier += 0.4;
  
  // Third-party integrations
  const integrationCount = (data.integrations || []).length;
  multiplier += integrationCount * 0.15;
  
  return Math.min(multiplier, 2.5);
};

const calculateLandingPageComplexity = (data) => {
  let multiplier = 1.0;
  
  // Number of sections
  const sectionCount = (data.sections || []).length;
  if (sectionCount > 5) multiplier += 0.2;
  if (sectionCount > 8) multiplier += 0.3;
  
  // Custom animations
  if (data.animations === 'advanced') multiplier += 0.3;
  
  // CMS integration
  if (data.cmsIntegration) multiplier += 0.4;
  
  return Math.min(multiplier, 2.0);
};

const calculateDesignComplexity = (data) => {
  let multiplier = 1.0;
  
  // Number of screens
  const screenCount = parseInt(data.numberOfScreens) || 5;
  if (screenCount > 15) multiplier += 0.4;
  if (screenCount > 30) multiplier += 0.8;
  
  // Custom illustrations
  if (data.customIllustrations) multiplier += 0.5;
  
  // Brand identity package
  if (data.brandIdentity) multiplier += 0.6;
  
  return Math.min(multiplier, 2.5);
};

const calculateApiComplexity = (data) => {
  let multiplier = 1.0;
  
  // Number of APIs to integrate
  const apiCount = (data.apis || []).length;
  multiplier += apiCount * 0.3;
  
  // Custom API development
  if (data.customApiDevelopment) multiplier += 0.8;
  
  return Math.min(multiplier, 2.5);
};

const calculateDatabaseComplexity = (data) => {
  let multiplier = 1.0;
  
  // Database type
  if (data.databaseType === 'postgresql' || data.databaseType === 'mongodb') multiplier += 0.2;
  
  // Number of tables/collections
  const tableCount = parseInt(data.numberOfTables) || 5;
  if (tableCount > 15) multiplier += 0.4;
  if (tableCount > 30) multiplier += 0.8;
  
  // Data migration
  if (data.dataMigration) multiplier += 0.5;
  
  return Math.min(multiplier, 2.5);
};

const calculateAuthComplexity = (data) => {
  let multiplier = 1.0;
  
  // OAuth providers
  const providerCount = (data.providers || []).length;
  multiplier += providerCount * 0.2;
  
  // Multi-factor authentication
  if (data.mfaRequired) multiplier += 0.4;
  
  // Role-based access control
  if (data.rbac) multiplier += 0.3;
  
  return Math.min(multiplier, 2.0);
};

const calculatePaymentComplexity = (data) => {
  let multiplier = 1.0;
  
  // Payment providers
  const providerCount = (data.providers || []).length;
  multiplier += providerCount * 0.3;
  
  // Subscription billing
  if (data.subscriptionBilling) multiplier += 0.5;
  
  // Multi-currency
  if (data.multiCurrency) multiplier += 0.3;
  
  return Math.min(multiplier, 2.5);
};

/**
 * Calculate Full-Stack App complexity from Phase 1-6 data
 */
const calculateFullStackComplexity = (projectData) => {
  let multiplier = 1.0;
  
  // Phase 1: Vision - Key features count
  const keyFeatures = projectData?.vision?.keyFeatures || [];
  if (keyFeatures.length > 5) multiplier += 0.2;
  if (keyFeatures.length > 10) multiplier += 0.3;
  
  // Phase 2: Target Users - Multiple user types increase complexity
  const userTypes = projectData?.users?.userTypes || [];
  if (userTypes.length > 1) multiplier += 0.15;
  if (userTypes.length > 3) multiplier += 0.25;
  
  // Phase 3: Features & Functionality
  const authentication = projectData?.functionality?.authentication || [];
  const coreFeatures = projectData?.functionality?.coreFeatures || [];
  const additionalFeatures = projectData?.functionality?.additionalFeatures || [];
  
  // Multiple auth methods = more complexity
  if (authentication.length > 1) multiplier += 0.2;
  if (authentication.length > 3) multiplier += 0.3;
  
  // Feature count
  const totalFeatures = coreFeatures.length + additionalFeatures.length;
  if (totalFeatures > 5) multiplier += 0.3;
  if (totalFeatures > 10) multiplier += 0.5;
  
  // Phase 4: Backend & Data
  const databaseNeeds = projectData?.backend?.databaseNeeds || [];
  const integrations = projectData?.backend?.integrations || [];
  const fileStorage = projectData?.backend?.fileStorage || [];
  const realtimeFeatures = projectData?.backend?.realtimeFeatures || [];
  
  // Database complexity
  if (databaseNeeds.length > 2) multiplier += 0.2;
  if (databaseNeeds.length > 4) multiplier += 0.3;
  
  // Each integration adds complexity
  multiplier += integrations.length * 0.15;
  
  // File storage
  if (fileStorage.length > 0) multiplier += 0.2;
  
  // Real-time features
  if (realtimeFeatures.length > 0) multiplier += 0.3;
  if (realtimeFeatures.length > 2) multiplier += 0.4;
  
  // Phase 5: Design - Custom design increases cost
  if (projectData?.identity?.logoFile || projectData?.identity?.logoURL) {
    multiplier += 0.15;
  }
  if (projectData?.identity?.designStyle) {
    multiplier += 0.1;
  }
  
  return Math.min(multiplier, 2.5); // Cap at 2.5x
};

/**
 * Calculate total project estimate
 * @param {Object} projectData - Full project data from Firestore
 * @param {string} countryCode - Country code for currency conversion
 * @param {number} timelineMultiplier - Price multiplier based on timeline urgency (default 1.0)
 * @param {Object} cart - Cart object with items and total (assisted services)
 * @returns {Object} - { total, breakdown, requiresConsultation, discount }
 */
export const calculateProjectEstimate = (projectData, countryCode = 'US', timelineMultiplier = 1.0, cart = null) => {
  const phases = projectData?.phases || projectData;
  const primaryService = phases.primaryService;
  const addOns = phases.addOns || [];
  
  // Check if this is a Phase 1-6 full-stack app (has vision, users, etc.)
  const isFullStackApp = phases.vision || phases.users || phases.functionality;
  
  if (isFullStackApp) {
    // Calculate Full-Stack App pricing based on Phase 1-6 data
    const basePrice = 5000; // Base price for full-stack app
    const complexity = calculateFullStackComplexity(phases);
    const price = Math.round(basePrice * complexity);
    
    const breakdown = [{
      serviceId: 'fullstack',
      serviceName: 'Full-Stack Application',
      basePrice,
      complexity,
      complexityLabel: getComplexityLabel(complexity),
      price,
      requiresConsultation: false
    }];
    
    // Add cart items (assisted services) to breakdown
    let cartTotal = 0;
    if (cart && cart.cartItems && cart.cartItems.length > 0) {
      cart.cartItems.forEach(item => {
        breakdown.push({
          serviceId: item.id,
          serviceName: item.label,
          basePrice: item.price,
          complexity: 1.0,
          complexityLabel: 'Standard',
          price: item.price,
          requiresConsultation: false,
          isAssistedService: true
        });
        cartTotal += item.price;
      });
    }
    
    // Apply timeline multiplier
    const totalUSD = Math.round((price + cartTotal) * timelineMultiplier);
    
    // Convert to local currency
    const localizedTotal = getLocalizedPrice(totalUSD, countryCode);
    const localizedBreakdown = breakdown.map(item => ({
      ...item,
      localPrice: getLocalizedPrice(item.price, countryCode).amount,
      localBasePrice: getLocalizedPrice(item.basePrice, countryCode).amount,
    }));
    
    return {
      total: localizedTotal.amount,
      subtotal: getLocalizedPrice(price + cartTotal, countryCode).amount,
      breakdown: localizedBreakdown,
      requiresConsultation: false,
      discount: 0,
      serviceCount: 1 + (cart?.cartItems?.length || 0),
      currency: localizedTotal.currency,
      currencySymbol: localizedTotal.symbol,
      formatted: localizedTotal.formatted,
      timelineMultiplier: timelineMultiplier,
      baseTotal: localizedTotal.amount / timelineMultiplier,
      hasAssistedServices: cartTotal > 0
    };
  }
  
  // Original logic for multi-service selection
  if (!primaryService) {
    return {
      total: 0,
      breakdown: [],
      requiresConsultation: false,
      discount: 0,
      currency: 'USD',
      currencySymbol: '$',
      timelineMultiplier: 1.0
    };
  }

  const services = [primaryService, ...addOns];
  const breakdown = [];
  let subtotal = 0;
  let requiresConsultation = false;

  // Calculate each service (in USD first)
  services.forEach(service => {
    const serviceId = service.id;
    const basePrice = BASE_PRICES[serviceId] || 1000;
    const phaseData = phases[serviceId];
    const complexity = calculateComplexity(serviceId, phaseData);
    const price = Math.round(basePrice * complexity);

    // Check if requires consultation
    if (CUSTOM_PRICING_SERVICES.includes(serviceId)) {
      requiresConsultation = true;
    }

    breakdown.push({
      serviceId,
      serviceName: service.name,
      basePrice,
      complexity,
      complexityLabel: getComplexityLabel(complexity),
      price,
      requiresConsultation: CUSTOM_PRICING_SERVICES.includes(serviceId)
    });

    subtotal += price;
  });

  // Multi-service bundle discount
  let discount = 0;
  if (services.length >= 2) {
    discount = Math.round(subtotal * 0.1); // 10% discount for 2+ services
  }
  if (services.length >= 4) {
    discount = Math.round(subtotal * 0.15); // 15% discount for 4+ services
  }

  // Apply timeline multiplier AFTER bundle discount
  const totalAfterDiscount = subtotal - discount;
  const totalUSD = Math.round(totalAfterDiscount * timelineMultiplier);

  // Convert to local currency
  const localizedTotal = getLocalizedPrice(totalUSD, countryCode);
  const localizedSubtotal = getLocalizedPrice(subtotal, countryCode);
  const localizedDiscount = getLocalizedPrice(discount, countryCode);

  // Convert breakdown to local currency
  const localizedBreakdown = breakdown.map(item => ({
    ...item,
    localPrice: getLocalizedPrice(item.price, countryCode).amount,
    localBasePrice: getLocalizedPrice(item.basePrice, countryCode).amount,
  }));

  return {
    total: localizedTotal.amount,
    subtotal: localizedSubtotal.amount,
    breakdown: localizedBreakdown,
    requiresConsultation,
    discount: localizedDiscount.amount,
    serviceCount: services.length,
    currency: localizedTotal.currency,
    currencySymbol: localizedTotal.symbol,
    formatted: localizedTotal.formatted,
    timelineMultiplier: timelineMultiplier,
    baseTotal: localizedTotal.amount / timelineMultiplier // Original price before timeline adjustment
  };
};

const getComplexityLabel = (multiplier) => {
  if (multiplier <= 1.2) return 'Basic';
  if (multiplier <= 1.6) return 'Standard';
  if (multiplier <= 2.0) return 'Advanced';
  return 'Enterprise';
};

/**
 * Format currency based on currency code
 */
export const formatCurrency = (amount, currencyCode = 'USD') => {
  if (currencyCode === 'NGN') {
    return `₦${amount.toLocaleString()}`;
  }
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

/**
 * Get estimated timeline based on complexity
 */
export const getEstimatedTimeline = (estimate) => {
  const { total, serviceCount } = estimate;
  
  // Base: 3-5 days per service
  let minDays = serviceCount * 3;
  let maxDays = serviceCount * 5;
  
  // Adjust for total cost (complexity indicator)
  if (total > 5000) {
    minDays += 2;
    maxDays += 3;
  }
  if (total > 10000) {
    minDays += 3;
    maxDays += 5;
  }
  
  return {
    min: minDays,
    max: maxDays,
    display: `${minDays}-${maxDays} days`
  };
};
