/**
 * Geolocation and Currency Detection Utilities
 */

// Countries that use Paystack (primarily African countries)
export const PAYSTACK_COUNTRIES = [
  'NG', // Nigeria
  'GH', // Ghana
  'ZA', // South Africa
  'KE', // Kenya
  'EG', // Egypt
  'CI', // Côte d'Ivoire
];

// Currency configuration
export const CURRENCIES = {
  NGN: {
    code: 'NGN',
    symbol: '₦',
    name: 'Nigerian Naira',
    paymentProvider: 'paystack'
  },
  USD: {
    code: 'USD',
    symbol: '$',
    name: 'US Dollar',
    paymentProvider: 'stripe'
  }
};

/**
 * Detect user's country using IP geolocation
 * Falls back to USD if detection fails
 */
export const detectUserLocation = async () => {
  try {
    // Using ipapi.co free tier (1000 requests/day)
    const response = await fetch('https://ipapi.co/json/');
    
    if (!response.ok) {
      throw new Error('Geolocation API failed');
    }

    const data = await response.json();
    
    return {
      country: data.country_code || 'US',
      countryName: data.country_name || 'United States',
      currency: data.currency || 'USD',
      city: data.city || '',
      region: data.region || ''
    };
  } catch (error) {
    console.error('Error detecting location:', error);
    // Default to US/USD if detection fails
    return {
      country: 'US',
      countryName: 'United States',
      currency: 'USD',
      city: '',
      region: ''
    };
  }
};

/**
 * Determine if user should use Paystack or Stripe
 */
export const getPaymentProvider = (countryCode) => {
  return PAYSTACK_COUNTRIES.includes(countryCode) ? 'paystack' : 'stripe';
};

/**
 * Get currency configuration based on country
 */
export const getCurrencyConfig = (countryCode) => {
  const provider = getPaymentProvider(countryCode);
  return provider === 'paystack' ? CURRENCIES.NGN : CURRENCIES.USD;
};

/**
 * Convert USD price to NGN with discounted rounding
 * Nigeria gets approximately 15-20% discount with nice rounded numbers
 */
export const convertUSDtoNGN = (usdPrice) => {
  // Current approximate rate: 1 USD = 1500 NGN (as of 2025)
  // But we apply discount and round to nice numbers
  const baseRate = 1500;
  const discountRate = 0.80; // 20% discount
  
  const convertedPrice = usdPrice * baseRate * discountRate;
  
  // Round to nearest 1000 for clean pricing
  const roundedPrice = Math.round(convertedPrice / 1000) * 1000;
  
  return roundedPrice;
};

/**
 * Get localized price based on country and USD base price
 */
export const getLocalizedPrice = (usdPrice, countryCode) => {
  const currencyConfig = getCurrencyConfig(countryCode);
  
  if (currencyConfig.code === 'NGN') {
    return {
      amount: convertUSDtoNGN(usdPrice),
      currency: 'NGN',
      symbol: '₦',
      formatted: `₦${convertUSDtoNGN(usdPrice).toLocaleString()}`
    };
  }
  
  // Default USD pricing
  return {
    amount: usdPrice,
    currency: 'USD',
    symbol: '$',
    formatted: `$${usdPrice.toLocaleString()}`
  };
};

/**
 * Format price with currency symbol
 */
export const formatPrice = (amount, currencyCode) => {
  const currency = CURRENCIES[currencyCode] || CURRENCIES.USD;
  
  if (currencyCode === 'NGN') {
    return `${currency.symbol}${amount.toLocaleString()}`;
  }
  
  return `${currency.symbol}${amount.toLocaleString()}`;
};
