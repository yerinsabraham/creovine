import { createContext, useContext, useState, useEffect } from 'react';
import { 
  detectUserLocation, 
  getCurrencyConfig, 
  getPaymentProvider,
  getLocalizedPrice 
} from '../utils/geolocation';

const LocationContext = createContext();

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within LocationProvider');
  }
  return context;
};

export const LocationProvider = ({ children }) => {
  const [location, setLocation] = useState(null);
  const [currency, setCurrency] = useState(null);
  const [paymentProvider, setPaymentProvider] = useState('stripe');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initLocation = async () => {
      try {
        const userLocation = await detectUserLocation();
        const currencyConfig = getCurrencyConfig(userLocation.country);
        const provider = getPaymentProvider(userLocation.country);

        setLocation(userLocation);
        setCurrency(currencyConfig);
        setPaymentProvider(provider);

        // Store in localStorage for faster subsequent loads
        localStorage.setItem('userLocation', JSON.stringify({
          location: userLocation,
          currency: currencyConfig,
          provider,
          timestamp: Date.now()
        }));
      } catch (error) {
        console.error('Error initializing location:', error);
        // Set defaults
        setCurrency({ code: 'USD', symbol: '$', name: 'US Dollar', paymentProvider: 'stripe' });
        setPaymentProvider('stripe');
      } finally {
        setLoading(false);
      }
    };

    // Check if we have cached location data (less than 24 hours old)
    const cached = localStorage.getItem('userLocation');
    if (cached) {
      try {
        const { location: cachedLoc, currency: cachedCur, provider, timestamp } = JSON.parse(cached);
        const age = Date.now() - timestamp;
        const oneDay = 24 * 60 * 60 * 1000;

        if (age < oneDay) {
          // Use cached data
          setLocation(cachedLoc);
          setCurrency(cachedCur);
          setPaymentProvider(provider);
          setLoading(false);
          return;
        }
      } catch (error) {
        console.error('Error parsing cached location:', error);
      }
    }

    // Fetch fresh location data
    initLocation();
  }, []);

  /**
   * Get price in user's local currency
   */
  const getPrice = (usdPrice) => {
    if (!location) return { amount: usdPrice, currency: 'USD', symbol: '$', formatted: `$${usdPrice}` };
    return getLocalizedPrice(usdPrice, location.country);
  };

  /**
   * Format price with currency
   */
  const formatPrice = (amount) => {
    if (!currency) return `$${amount}`;
    return `${currency.symbol}${amount.toLocaleString()}`;
  };

  const value = {
    location,
    currency,
    paymentProvider,
    loading,
    getPrice,
    formatPrice,
    isNigeria: location?.country === 'NG',
    isAfrica: location?.country && ['NG', 'GH', 'ZA', 'KE', 'EG', 'CI'].includes(location.country)
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
};
