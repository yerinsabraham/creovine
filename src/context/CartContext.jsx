import { createContext, useContext, useState, useEffect } from 'react';

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

  // Calculate total whenever cart items change
  useEffect(() => {
    const newTotal = cartItems.reduce((sum, item) => sum + item.price, 0);
    setTotal(newTotal);
  }, [cartItems]);

  const addItem = (item) => {
    // item structure: { id, category, label, price, description }
    setCartItems(prev => {
      // Check if item already exists
      const exists = prev.find(i => i.id === item.id);
      if (exists) {
        return prev; // Don't add duplicates
      }
      return [...prev, item];
    });
  };

  const removeItem = (itemId) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId));
  };

  const updateItem = (itemId, updates) => {
    setCartItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, ...updates } : item
    ));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const hasItem = (itemId) => {
    return cartItems.some(item => item.id === itemId);
  };

  const getItemsByCategory = (category) => {
    return cartItems.filter(item => item.category === category);
  };

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
