import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheck } from 'react-icons/fa';
import { serviceCategories } from '../config/serviceCategories';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { useProject } from '../context/ProjectContext';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.png';

const SolutionHub = () => {
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const { currentUser } = useAuth();
  const { projectData, updatePhaseData } = useProject();
  
  // Multi-select state - Load from projectData or localStorage
  const [primaryService, setPrimaryService] = useState(() => {
    // First check localStorage for pending selections
    const pending = localStorage.getItem('pendingService');
    if (pending) {
      const { primaryService } = JSON.parse(pending);
      return primaryService;
    }
    return projectData?.primaryService || null;
  });
  
  const [addOns, setAddOns] = useState(() => {
    // First check localStorage for pending selections
    const pending = localStorage.getItem('pendingService');
    if (pending) {
      const { addOns } = JSON.parse(pending);
      return addOns || [];
    }
    return projectData?.addOns || [];
  });

  const handleServiceClick = async (category) => {
    const isCurrentlyPrimary = primaryService?.id === category.id;
    const isCurrentlyAddOn = addOns.some(a => a.id === category.id);

    let newPrimaryService = primaryService;
    let newAddOns = [...addOns];

    if (isCurrentlyPrimary) {
      // Clicking primary again: deselect it, promote first add-on to primary
      if (addOns.length > 0) {
        newPrimaryService = addOns[0];
        newAddOns = addOns.slice(1);
      } else {
        newPrimaryService = null;
      }
    } else if (isCurrentlyAddOn) {
      // Clicking an add-on: remove it from add-ons
      newAddOns = addOns.filter(a => a.id !== category.id);
    } else {
      // New selection
      if (!primaryService) {
        // No primary yet: this becomes primary
        newPrimaryService = category;
      } else {
        // Already have primary: this becomes add-on
        newAddOns = [...addOns, category];
      }
    }

    // Update state
    setPrimaryService(newPrimaryService);
    setAddOns(newAddOns);

    // Save to Firestore immediately
    await updatePhaseData('primaryService', newPrimaryService);
    await updatePhaseData('addOns', newAddOns);
    if (newPrimaryService) {
      await updatePhaseData('serviceCategory', newPrimaryService.id);
      await updatePhaseData('serviceName', newPrimaryService.name);
    }
  };

  const handleMakePrimary = async (category) => {
    // Move current primary to add-ons, make this the new primary
    const newAddOns = addOns.filter(a => a.id !== category.id);
    if (primaryService) {
      newAddOns.unshift(primaryService);
    }
    
    setPrimaryService(category);
    setAddOns(newAddOns);

    // Save to Firestore immediately
    await updatePhaseData('primaryService', category);
    await updatePhaseData('addOns', newAddOns);
    await updatePhaseData('serviceCategory', category.id);
    await updatePhaseData('serviceName', category.name);
  };

  const handleContinue = async () => {
    if (!primaryService) {
      alert('Please select a service to continue');
      return;
    }

    // Check if user is logged in
    if (!currentUser) {
      const shouldLogin = window.confirm('You need to sign in to continue. Would you like to go to the login page?');
      if (shouldLogin) {
        // Save selections to localStorage so we can restore them after login
        localStorage.setItem('pendingService', JSON.stringify({
          primaryService,
          addOns
        }));
        navigate('/');
      }
      return;
    }

    try {
      // Save selections to project context
      await updatePhaseData('serviceCategory', primaryService.id);
      await updatePhaseData('serviceName', primaryService.name);
      await updatePhaseData('primaryService', {
        id: primaryService.id,
        name: primaryService.name,
        route: primaryService.route
      });
      await updatePhaseData('addOns', addOns.map(a => ({ id: a.id, name: a.name, route: a.route })));

      // Clear pending service from localStorage
      localStorage.removeItem('pendingService');

      // Navigate to primary service onboarding
      navigate(primaryService.route);
    } catch (error) {
      console.error('Error saving selections:', error);
      alert('Error saving your selections. Please try again.');
    }
  };

  const getButtonStyle = (category) => {
    const isPrimary = primaryService?.id === category.id;
    const isAddOn = addOns.some(a => a.id === category.id);

    if (isPrimary) {
      return {
        background: 'rgba(41, 189, 152, 0.15)',
        border: '2px solid #29BD98',
        color: '#FFFFFF',
        fontWeight: '500'
      };
    } else if (isAddOn) {
      return {
        background: 'rgba(255, 255, 255, 0.05)',
        border: '2px dashed rgba(255, 255, 255, 0.4)',
        color: 'rgba(255, 255, 255, 0.9)',
        fontWeight: '400'
      };
    } else {
      return {
        background: 'transparent',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        color: '#FFFFFF',
        fontWeight: '400'
      };
    }
  };

  const hasSelections = primaryService !== null;
  const totalSelections = (primaryService ? 1 : 0) + addOns.length;

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #15293A 0%, #0F1F2E 100%)',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated Background Elements */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        opacity: 0.1,
        pointerEvents: 'none'
      }}>
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{
            position: 'absolute',
            top: '10%',
            right: '10%',
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, #29BD98 0%, transparent 70%)',
          }}
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{
            position: 'absolute',
            bottom: '10%',
            left: '10%',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, #2497F9 0%, transparent 70%)',
          }}
        />
      </div>

      {/* Header */}
      <header style={{
        padding: isMobile ? '20px' : '30px 60px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        zIndex: 10
      }}>
        <motion.img 
          src={logo} 
          alt="Creovine" 
          style={{ 
            height: isMobile ? '32px' : '40px',
            cursor: 'pointer'
          }}
          onClick={() => navigate('/')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        />
      </header>

      {/* Main Content */}
      <main style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: isMobile ? '40px 20px' : '60px 40px',
        position: 'relative',
        zIndex: 10
      }}>
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            textAlign: 'center',
            marginBottom: isMobile ? '30px' : '40px',
            maxWidth: '900px'
          }}
        >
          <h1 style={{
            fontSize: isMobile ? '28px' : '42px',
            fontWeight: '400',
            color: '#FFFFFF',
            marginBottom: '12px',
            lineHeight: '1.3'
          }}>
            What do you need?
          </h1>
          <p style={{
            fontSize: isMobile ? '14px' : '16px',
            color: 'rgba(255, 255, 255, 0.5)',
            margin: 0
          }}>
            Select one or more — first selection is your main focus
          </p>
        </motion.div>

        {/* Category Pills */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          style={{
            width: '100%',
            maxWidth: '900px',
            marginBottom: '40px'
          }}
        >
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '12px',
            justifyContent: 'center'
          }}>
            {serviceCategories.map((category, index) => {
              const isPrimary = primaryService?.id === category.id;
              const isAddOn = addOns.some(a => a.id === category.id);
              const buttonStyle = getButtonStyle(category);

              return (
                <motion.button
                  key={category.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + index * 0.02 }}
                  onClick={() => handleServiceClick(category)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    ...buttonStyle,
                    borderRadius: '50px',
                    padding: isMobile ? '12px 20px' : '14px 24px',
                    fontSize: isMobile ? '14px' : '15px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    position: 'relative'
                  }}
                >
                  {(isPrimary || isAddOn) && (
                    <FaCheck style={{ 
                      fontSize: '12px',
                      color: isPrimary ? '#29BD98' : 'rgba(255, 255, 255, 0.6)'
                    }} />
                  )}
                  {category.name}
                  {isPrimary && (
                    <span style={{
                      fontSize: '10px',
                      backgroundColor: '#29BD98',
                      color: '#0F1F2E',
                      padding: '2px 8px',
                      borderRadius: '20px',
                      marginLeft: '4px',
                      fontWeight: '600'
                    }}>
                      MAIN
                    </span>
                  )}
                </motion.button>
              );
            })}

            {/* Talk to Expert - always available */}
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + serviceCategories.length * 0.02 }}
              onClick={() => navigate('/experts')}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              style={{
                background: 'transparent',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '50px',
                padding: isMobile ? '12px 20px' : '14px 24px',
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: isMobile ? '14px' : '15px',
                fontWeight: '400',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              Talk to Expert
            </motion.button>
          </div>
        </motion.div>

        {/* Selected Services Summary & Continue */}
        <AnimatePresence>
          {hasSelections && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '16px'
              }}
            >
              {/* Change Primary hint (only if add-ons exist) */}
              {addOns.length > 0 && (
                <p style={{
                  fontSize: '13px',
                  color: 'rgba(255, 255, 255, 0.4)',
                  margin: 0,
                  textAlign: 'center'
                }}>
                  Tap an add-on to make it your main focus
                </p>
              )}

              {/* Add-on chips that can be promoted */}
              {addOns.length > 0 && (
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '8px',
                  justifyContent: 'center',
                  marginBottom: '8px'
                }}>
                  {addOns.map(addon => (
                    <motion.button
                      key={addon.id}
                      onClick={() => handleMakePrimary(addon)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px dashed rgba(255, 255, 255, 0.3)',
                        borderRadius: '20px',
                        padding: '8px 16px',
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontSize: '13px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      + {addon.name}
                    </motion.button>
                  ))}
                </div>
              )}

              {/* Continue Button */}
              <motion.button
                onClick={handleContinue}
                whileHover={{ scale: 1.02, backgroundColor: '#1E9F7F' }}
                whileTap={{ scale: 0.98 }}
                style={{
                  backgroundColor: '#29BD98',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '50px',
                  padding: isMobile ? '16px 48px' : '18px 64px',
                  fontSize: isMobile ? '16px' : '17px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 4px 20px rgba(41, 189, 152, 0.3)'
                }}
              >
                Continue with {primaryService?.name}
                {addOns.length > 0 && ` + ${addOns.length} more`}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Auth Modal */}
      <AnimatePresence>
        {showAuthModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowAuthModal(false)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              padding: '20px'
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                backgroundColor: '#15293A',
                borderRadius: '24px',
                padding: isMobile ? '32px 24px' : '48px',
                maxWidth: '450px',
                width: '100%',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)'
              }}
            >
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: '48px',
                  marginBottom: '24px'
                }}>
                  🔐
                </div>
                
                <h2 style={{
                  fontSize: isMobile ? '24px' : '28px',
                  fontWeight: '800',
                  color: '#FFFFFF',
                  marginBottom: '16px'
                }}>
                  Sign In to Continue
                </h2>
                
                <p style={{
                  fontSize: '15px',
                  color: 'rgba(255, 255, 255, 0.7)',
                  marginBottom: '32px',
                  lineHeight: '1.6'
                }}>
                  You've selected <strong style={{ color: '#29BD98' }}>{primaryService?.name}</strong>
                  {addOns.length > 0 && ` + ${addOns.length} more service${addOns.length > 1 ? 's' : ''}`}.
                  Sign in to start your onboarding.
                </p>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleGoogleSignIn}
                  disabled={authLoading}
                  style={{
                    width: '100%',
                    backgroundColor: '#FFFFFF',
                    color: '#15293A',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '16px 24px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: authLoading ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '12px',
                    marginBottom: '16px',
                    opacity: authLoading ? 0.7 : 1
                  }}
                >
                  <img src={googleIcon} alt="Google" style={{ width: '20px', height: '20px' }} />
                  {authLoading ? 'Signing in...' : 'Continue with Google'}
                </motion.button>

                <button
                  onClick={() => setShowAuthModal(false)}
                  style={{
                    backgroundColor: 'transparent',
                    color: 'rgba(255, 255, 255, 0.6)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '12px',
                    padding: '12px 24px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    width: '100%'
                  }}
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SolutionHub;
