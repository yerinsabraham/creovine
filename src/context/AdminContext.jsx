import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const AdminContext = createContext();

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within AdminProvider');
  }
  return context;
};

export const AdminProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const ADMIN_EMAIL = 'yerinssaibs@gmail.com';

  useEffect(() => {
    if (currentUser) {
      // Check if the logged-in user is the admin
      setIsAdmin(currentUser.email === ADMIN_EMAIL);
      setLoading(false);
    } else {
      setIsAdmin(false);
      setLoading(false);
    }
  }, [currentUser]);

  const value = {
    isAdmin,
    loading,
    ADMIN_EMAIL
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};
