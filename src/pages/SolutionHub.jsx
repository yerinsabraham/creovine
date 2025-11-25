import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheck } from 'react-icons/fa';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import { serviceCategories } from '../config/serviceCategories';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { useProject } from '../context/ProjectContext';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.png';
import googleIcon from '../assets/google.png';

const SolutionHub = () => {
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const { currentUser, signInWithGoogle, login, signup } = useAuth();
  const { projectData, updatePhaseData, updateProjectMetadata } = useProject();
  
  // Auth modal states
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [authMode, setAuthMode] = useState('signin'); // 'signin' or 'signup'
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authError, setAuthError] = useState('');
  const [showContinueModal, setShowContinueModal] = useState(false);
  const [existingProject, setExistingProject] = useState(null);
  
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

  // Helper function to serialize service object for Firestore (remove icon function)
  const serializeService = (service) => {
    if (!service) return null;
    return {
      id: service.id,
      name: service.name,
      route: service.route,
      color: service.color
    };
  };

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
        // No primary yet: this becomes primary (serialize to remove icon)
        newPrimaryService = serializeService(category);
      } else {
        // Already have primary: this becomes add-on (serialize to remove icon)
        newAddOns = [...addOns, serializeService(category)];
      }
    }

    // Update state
    setPrimaryService(newPrimaryService);
    setAddOns(newAddOns);

    // Save to Firestore immediately
    if (currentUser) {
      await updateProjectMetadata({
        primaryService: serializeService(newPrimaryService),
        addOns: newAddOns.map(serializeService),
        serviceCategory: newPrimaryService?.id || null,
        serviceName: newPrimaryService?.name || null
      });
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
    if (currentUser) {
      await updateProjectMetadata({
        primaryService: serializeService(category),
        addOns: newAddOns.map(serializeService),
        serviceCategory: category.id,
        serviceName: category.name
      });
    }
  };

  const handleContinue = async () => {
    if (!primaryService) {
      alert('Please select a service to continue');
      return;
    }

    // Check if user is logged in
    if (!currentUser) {
      setShowAuthModal(true);
      return;
    }

    // Check for existing incomplete project
    if (projectData?.primaryService && projectData.primaryService.id !== primaryService.id) {
      // User has an existing project with different service
      setExistingProject(projectData);
      setShowContinueModal(true);
      return;
    }

    // Proceed with new/same selection
    await proceedWithSelection();
  };

  const proceedWithSelection = async () => {
    try {
      // Save selections to project context
      await updateProjectMetadata({
        serviceCategory: primaryService.id,
        serviceName: primaryService.name,
        primaryService: serializeService(primaryService),
        addOns: addOns.map(serializeService)
      });

      // Clear pending service from localStorage
      localStorage.removeItem('pendingService');

      // Navigate to primary service onboarding
      navigate(primaryService.route);
    } catch (error) {
      console.error('Error saving selections:', error);
      alert('Error saving your selections. Please try again.');
    }
  };

  const handleContinueExisting = async () => {
    // Continue with existing project - navigate to where they left off
    setShowContinueModal(false);
    if (existingProject?.primaryService?.route) {
      navigate(existingProject.primaryService.route);
    }
  };

  const handleStartFresh = async () => {
    // Clear all existing project data and start fresh
    setShowContinueModal(false);
    
    try {
      // Clear project data in Firestore
      if (currentUser) {
        const projectRef = doc(db, 'projects', `${currentUser.uid}_draft`);
        await setDoc(projectRef, {
          userId: currentUser.uid,
          userEmail: currentUser.email,
          userName: currentUser.displayName || currentUser.email,
          phases: {},
          currentPhase: 1,
          status: 'draft',
          updatedAt: serverTimestamp()
        });
      }
      
      // Proceed with new selection
      await proceedWithSelection();
    } catch (error) {
      console.error('Error clearing project:', error);
      alert('Error starting fresh project. Please try again.');
    }
  };

  const handleGoogleSignIn = async () => {
    setAuthLoading(true);
    setAuthError('');
    try {
      await signInWithGoogle();
      
      // Save selections after successful login
      await updateProjectMetadata({
        serviceCategory: primaryService.id,
        serviceName: primaryService.name,
        primaryService: serializeService(primaryService),
        addOns: addOns.map(serializeService)
      });

      // Clear pending and close modal
      localStorage.removeItem('pendingService');
      setShowAuthModal(false);

      // Navigate to onboarding
      navigate(primaryService.route);
    } catch (error) {
      console.error('Error signing in:', error);
      setAuthError('Failed to sign in with Google. Please try again.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');

    try {
      if (authMode === 'signup') {
        if (!authName.trim()) {
          setAuthError('Please enter your name');
          setAuthLoading(false);
          return;
        }
        await signup(authEmail, authPassword, authName);
      } else {
        await login(authEmail, authPassword);
      }
      
      // Save selections after successful login
      await updateProjectMetadata({
        serviceCategory: primaryService.id,
        serviceName: primaryService.name,
        primaryService: serializeService(primaryService),
        addOns: addOns.map(serializeService)
      });

      // Clear pending and close modal
      localStorage.removeItem('pendingService');
      setShowAuthModal(false);

      // Navigate to onboarding
      navigate(primaryService.route);
    } catch (error) {
      console.error('Authentication error:', error);
      if (error.code === 'auth/email-already-in-use') {
        setAuthError('Email already in use. Try signing in instead.');
      } else if (error.code === 'auth/weak-password') {
        setAuthError('Password should be at least 6 characters.');
      } else if (error.code === 'auth/invalid-email') {
        setAuthError('Invalid email address.');
      } else if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        setAuthError('Invalid email or password.');
      } else {
        setAuthError('Authentication failed. Please try again.');
      }
    } finally {
      setAuthLoading(false);
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
                  {authMode === 'signin' ? 'Sign In' : 'Create Account'}
                </h2>
                
                <p style={{
                  fontSize: '15px',
                  color: 'rgba(255, 255, 255, 0.7)',
                  marginBottom: '24px',
                  lineHeight: '1.6'
                }}>
                  You've selected <strong style={{ color: '#29BD98' }}>{primaryService?.name}</strong>
                  {addOns.length > 0 && ` + ${addOns.length} more service${addOns.length > 1 ? 's' : ''}`}
                </p>

                {/* Tab Switcher */}
                <div style={{
                  display: 'flex',
                  gap: '8px',
                  marginBottom: '24px',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  padding: '4px',
                  borderRadius: '12px'
                }}>
                  <button
                    onClick={() => {
                      setAuthMode('signin');
                      setAuthError('');
                    }}
                    style={{
                      flex: 1,
                      padding: '12px',
                      backgroundColor: authMode === 'signin' ? '#29BD98' : 'transparent',
                      color: authMode === 'signin' ? '#FFFFFF' : 'rgba(255, 255, 255, 0.6)',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => {
                      setAuthMode('signup');
                      setAuthError('');
                    }}
                    style={{
                      flex: 1,
                      padding: '12px',
                      backgroundColor: authMode === 'signup' ? '#29BD98' : 'transparent',
                      color: authMode === 'signup' ? '#FFFFFF' : 'rgba(255, 255, 255, 0.6)',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    Sign Up
                  </button>
                </div>

                {/* Email/Password Form */}
                <form onSubmit={handleEmailAuth} style={{ marginBottom: '20px' }}>
                  {authMode === 'signup' && (
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={authName}
                      onChange={(e) => setAuthName(e.target.value)}
                      required
                      style={{
                        width: '100%',
                        padding: '14px 16px',
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '12px',
                        color: '#FFFFFF',
                        fontSize: '15px',
                        marginBottom: '12px',
                        outline: 'none',
                        transition: 'border-color 0.2s ease'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#29BD98'}
                      onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
                    />
                  )}
                  
                  <input
                    type="email"
                    placeholder="Email"
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      color: '#FFFFFF',
                      fontSize: '15px',
                      marginBottom: '12px',
                      outline: 'none',
                      transition: 'border-color 0.2s ease'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#29BD98'}
                    onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
                  />
                  
                  <input
                    type="password"
                    placeholder="Password"
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    required
                    minLength="6"
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      color: '#FFFFFF',
                      fontSize: '15px',
                      marginBottom: '16px',
                      outline: 'none',
                      transition: 'border-color 0.2s ease'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#29BD98'}
                    onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
                  />

                  {authError && (
                    <div style={{
                      padding: '12px',
                      backgroundColor: 'rgba(239, 68, 68, 0.1)',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      borderRadius: '8px',
                      color: '#FCA5A5',
                      fontSize: '14px',
                      marginBottom: '16px',
                      textAlign: 'left'
                    }}>
                      {authError}
                    </div>
                  )}

                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={authLoading}
                    style={{
                      width: '100%',
                      backgroundColor: '#29BD98',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '12px',
                      padding: '16px 24px',
                      fontSize: '16px',
                      fontWeight: '600',
                      cursor: authLoading ? 'not-allowed' : 'pointer',
                      marginBottom: '16px',
                      opacity: authLoading ? 0.7 : 1
                    }}
                  >
                    {authLoading ? (authMode === 'signin' ? 'Signing in...' : 'Creating account...') : (authMode === 'signin' ? 'Sign In' : 'Sign Up')}
                  </motion.button>
                </form>

                {/* Divider */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '16px'
                }}>
                  <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />
                  <span style={{ color: 'rgba(255, 255, 255, 0.4)', fontSize: '13px' }}>OR</span>
                  <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />
                </div>

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
                    padding: '14px 24px',
                    fontSize: '15px',
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
                  Continue with Google
                </motion.button>

                <button
                  onClick={() => {
                    setShowAuthModal(false);
                    setAuthError('');
                    setAuthEmail('');
                    setAuthPassword('');
                    setAuthName('');
                  }}
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

      {/* Project Continuation Modal */}
      <AnimatePresence>
        {showContinueModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowContinueModal(false)}
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
                maxWidth: '500px',
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
                  🤔
                </div>
                
                <h2 style={{
                  fontSize: isMobile ? '24px' : '28px',
                  fontWeight: '800',
                  color: '#FFFFFF',
                  marginBottom: '16px'
                }}>
                  Continue Existing Project?
                </h2>
                
                <p style={{
                  fontSize: '15px',
                  color: 'rgba(255, 255, 255, 0.7)',
                  marginBottom: '12px',
                  lineHeight: '1.6'
                }}>
                  You have an incomplete project: <strong style={{ color: '#29BD98' }}>{existingProject?.primaryService?.name}</strong>
                </p>

                <p style={{
                  fontSize: '14px',
                  color: 'rgba(255, 255, 255, 0.5)',
                  marginBottom: '32px',
                  lineHeight: '1.5'
                }}>
                  Would you like to continue where you left off, or start a fresh project with <strong style={{ color: '#29BD98' }}>{primaryService?.name}</strong>?
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleContinueExisting}
                    style={{
                      width: '100%',
                      backgroundColor: '#29BD98',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '12px',
                      padding: '16px 24px',
                      fontSize: '16px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    Continue Existing Project
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleStartFresh}
                    style={{
                      width: '100%',
                      backgroundColor: 'rgba(239, 68, 68, 0.15)',
                      color: '#FCA5A5',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      borderRadius: '12px',
                      padding: '16px 24px',
                      fontSize: '16px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    Start Fresh (Clear Existing)
                  </motion.button>

                  <button
                    onClick={() => setShowContinueModal(false)}
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
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SolutionHub;
