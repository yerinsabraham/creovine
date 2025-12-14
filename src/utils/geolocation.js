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
 * Get real-time USD to NGN exchange rate
 * Falls back to 1550 if API fails
 */
let cachedRate = null;
let lastRateFetch = null;

export const getExchangeRate = async () => {
  // Use cached rate if less than 1 hour old
  if (cachedRate && lastRateFetch && (Date.now() - lastRateFetch < 3600000)) {
    return cachedRate;
  }

  try {
    // Using exchangerate-api.com (free tier: 1500 requests/month)
    const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
    const data = await response.json();
    
    if (data.rates && data.rates.NGN) {
      cachedRate = data.rates.NGN;
      lastRateFetch = Date.now();
      return cachedRate;
    }
  } catch (error) {
    console.error('Exchange rate fetch failed:', error);
  }
  
  // Fallback to approximate rate
  return 1550; // Updated December 2025 approximate rate
};

/**
 * Convert USD price to NGN using real exchange rate
 * No discount - just straight conversion with smart rounding
 */
export const convertUSDtoNGN = async (usdPrice) => {
  const rate = await getExchangeRate();
  const convertedPrice = usdPrice * rate;
  
  // Smart rounding based on amount
  if (convertedPrice < 1000) {
    return Math.round(convertedPrice / 10) * 10; // Round to nearest 10
  } else if (convertedPrice < 10000) {
    return Math.round(convertedPrice / 100) * 100; // Round to nearest 100
  } else if (convertedPrice < 100000) {
    return Math.round(convertedPrice / 1000) * 1000; // Round to nearest 1000
  } else {
    return Math.round(convertedPrice / 5000) * 5000; // Round to nearest 5000
  }
};

/**
 * Synchronous version using cached rate for immediate display
 */
export const convertUSDtoNGNSync = (usdPrice) => {
  const rate = cachedRate || 1550;
  const convertedPrice = usdPrice * rate;
  
  if (convertedPrice < 1000) {
    return Math.round(convertedPrice / 10) * 10;
  } else if (convertedPrice < 10000) {
    return Math.round(convertedPrice / 100) * 100;
  } else if (convertedPrice < 100000) {
    return Math.round(convertedPrice / 1000) * 1000;
  } else {
    return Math.round(convertedPrice / 5000) * 5000;
  }
};

/**
 * Get localized price based on country and USD base price
 */
export const getLocalizedPrice = (usdPrice, countryCode) => {
  const currencyConfig = getCurrencyConfig(countryCode);
  
  if (currencyConfig.code === 'NGN') {
    const ngnAmount = convertUSDtoNGNSync(usdPrice);
    return {
      amount: ngnAmount,
      currency: 'NGN',
      symbol: '₦',
      formatted: `₦${ngnAmount.toLocaleString()}`
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
