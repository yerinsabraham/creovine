import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getLocalizedPrice } from '../utils/geolocation';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [currency, setCurrency] = useState('USD');
  const [countryCode, setCountryCode] = useState('US');

  // Calculate total whenever cart items change
  useEffect(() => {
    const newTotal = cartItems.reduce((sum, item) => {
      // Use localized price if available, otherwise use base price
      return sum + (item.localPrice || item.price);
    }, 0);
    setTotal(newTotal);
  }, [cartItems, currency]);

  const addItem = useCallback((item) => {
    // item structure: { id, category, label, price, description }
    // Add localized pricing on the fly
    setCartItems(prev => {
      // Check if item already exists
      const exists = prev.find(i => i.id === item.id);
      if (exists) {
        return prev; // Don't add duplicates
      }
      
      // Add localized price based on current country
      const localizedPrice = getLocalizedPrice(item.price, countryCode);
      const itemWithLocalPrice = {
        ...item,
        localPrice: localizedPrice.amount,
        localCurrency: localizedPrice.currency
      };
      
      return [...prev, itemWithLocalPrice];
    });
  }, [countryCode]);

  const removeItem = useCallback((itemId) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId));
  }, []);

  const updateItem = useCallback((itemId, updates) => {
    setCartItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, ...updates } : item
    ));
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, [])updateCurrency = useCallback((newCountryCode) => {
    setCountryCode(newCountryCode);
    const localizedPrice = getLocalizedPrice(100, newCountryCode);
    setCurrency(localizedPrice.currency);
    
    // Update all cart items with new localized prices
    setCartItems(prev => prev.map(item => {
      const newLocalPrice = getLocalizedPrice(item.price, newCountryCode);
      return {
        ...item,
        localPrice: newLocalPrice.amount,
        localCurrency: newLocalPrice.currency
      };
    }));
  }, []);

  const getTotalFormatted = useCallback(() => {
    const localizedTotal = getLocalizedPrice(total, countryCode);
    return localizedTotal.formatted;
  }, [total, countryCode]);

  const value = {
    cartItems,
    total,
    currency,
    countryCode,
    addItem,
    removeItem,
    updateItem,
    clearCart,
    hasItem,
    getItemsByCategory,
    updateCurrency,
    getTotalFormatted

  const value = {
    cartItems,
    total,
    addItem,
    removeItem,
    updateItem,
    clearCart,
    hasItem,
    getItemsByCategory
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
