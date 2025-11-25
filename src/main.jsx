import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext'
import { ProjectProvider } from './context/ProjectContext'
import { AdminProvider } from './context/AdminContext'
import { CartProvider } from './context/CartContext'

// Component to handle loading screen removal
const AppWrapper = () => {
  useEffect(() => {
    // Hide loading screen once React app is mounted
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
      // Add fade-out class
      loadingScreen.classList.add('fade-out');
      
      // Remove from DOM after animation
      setTimeout(() => {
        loadingScreen.remove();
      }, 500);
    }
  }, []);

  return (
    <StrictMode>
      <AuthProvider>
        <AdminProvider>
          <ProjectProvider>
            <CartProvider>
              <App />
            </CartProvider>
          </ProjectProvider>
        </AdminProvider>
      </AuthProvider>
    </StrictMode>
  );
};

createRoot(document.getElementById('root')).render(<AppWrapper />);
