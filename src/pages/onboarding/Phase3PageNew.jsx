import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useProject } from '../../context/ProjectContext';
import { useCart } from '../../context/CartContext';
import { useIsMobile } from '../../hooks/useMediaQuery';
import AssistedToggle from '../../components/common/AssistedToggle';
import CartSummary from '../../components/common/CartSummary';
import logo from '../../assets/logo.png';

const Phase3Page = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const { projectData, updatePhaseData, goToPhase } = useProject();
  const { hasItem } = useCart();
  const isMobile = useIsMobile();

  const [formData, setFormData] = useState({
    authentication: projectData?.functionality?.authentication || [],
    userAccounts: projectData?.functionality?.userAccounts || [],
    coreFeatures: projectData?.functionality?.coreFeatures || [],
    additionalFeatures: projectData?.functionality?.additionalFeatures || []
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    goToPhase(3);
  }, []);

  const toggleItem = (category, item) => {
    setFormData(prev => ({
      ...prev,
      [category]: prev[category].includes(item)
        ? prev[category].filter(i => i !== item)
        : [...prev[category], item]
    }));
  };

  const handleContinue = async () => {
    await updatePhaseData('functionality', formData);
    navigate('/onboarding/phase4');
  };

  const handleBack = () => {
    navigate('/onboarding/phase2');
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Validation: field is valid if filled OR user has assisted option in cart
  const isAuthValid = formData.authentication.length > 0 || hasItem('authentication-assistance') || hasItem('feature-architecture-assistance');
  const areFeaturesValid = formData.coreFeatures.length > 0 || hasItem('feature-architecture-assistance');
  
  const isFormValid = isAuthValid && areFeaturesValid;

  const authOptions = [
    { id: 'email', label: 'Email/Password', icon: '📧' },
    { id: 'google', label: 'Google Sign-In', icon: '🔵' },
    { id: 'facebook', label: 'Facebook Login', icon: '📘' },
    { id: 'apple', label: 'Apple Sign-In', icon: '🍎' },
    { id: 'phone', label: 'Phone/SMS', icon: '📱' },
    { id: 'magic-link', label: 'Magic Link', icon: '✨' }
  ];

  const accountFeaturesOptions = [
    { id: 'profile', label: 'User Profiles', icon: '👤' },
    { id: 'settings', label: 'Account Settings', icon: '⚙️' },
    { id: 'preferences', label: 'User Preferences', icon: '🎨' },
    { id: 'notifications', label: 'Notification Settings', icon: '🔔' },
    { id: 'privacy', label: 'Privacy Controls', icon: '🔒' },
    { id: 'security', label: '2FA/Security', icon: '🛡️' },
    { id: 'billing', label: 'Billing/Payment Info', icon: '💳' },
    { id: 'subscription', label: 'Subscription Management', icon: '⭐' }
  ];

  const coreFeaturesOptions = [
    { id: 'messaging', label: 'Messaging/Chat', icon: '💬' },
    { id: 'payments', label: 'Payments/Checkout', icon: '💰' },
    { id: 'search', label: 'Search/Filter', icon: '🔍' },
    { id: 'booking', label: 'Booking/Scheduling', icon: '📅' },
    { id: 'reviews', label: 'Reviews/Ratings', icon: '⭐' },
    { id: 'analytics', label: 'Analytics Dashboard', icon: '📊' },
    { id: 'upload', label: 'File Upload', icon: '📁' },
    { id: 'maps', label: 'Maps/Location', icon: '🗺️' },
    { id: 'social', label: 'Social Sharing', icon: '🔗' },
    { id: 'feed', label: 'Activity Feed', icon: '📰' },
    { id: 'marketplace', label: 'Marketplace', icon: '🏪' },
    { id: 'cms', label: 'Content Management', icon: '📝' }
  ];

  const additionalFeaturesOptions = [
    { id: 'push', label: 'Push Notifications', icon: '📲' },
    { id: 'email-notif', label: 'Email Notifications', icon: '📬' },
    { id: 'admin-panel', label: 'Admin Panel', icon: '🎛️' },
    { id: 'reporting', label: 'Reports/Export', icon: '📈' },
    { id: 'ai', label: 'AI Features', icon: '🤖' },
    { id: 'multilang', label: 'Multi-language', icon: '🌐' },
    { id: 'dark-mode', label: 'Dark Mode', icon: '🌙' },
    { id: 'offline', label: 'Offline Mode', icon: '📶' }
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#15293A' }}>
      {/* Header */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backgroundColor: 'rgba(21, 41, 58, 0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        padding: isMobile ? '16px 20px' : '20px 40px'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <img 
            src={logo} 
            alt="Creovine" 
            style={{
              height: isMobile ? '28px' : '32px',
              cursor: 'pointer'
            }}
            onClick={() => navigate('/')}
          />
          
          <button
            onClick={handleLogout}
            style={{
              padding: isMobile ? '8px 16px' : '10px 20px',
              fontSize: isMobile ? '13px' : '14px',
              fontWeight: '600',
              color: '#FFFFFF',
              backgroundColor: 'transparent',
              border: '2px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '12px',
              cursor: 'pointer'
            }}
          >
            Logout
          </button>
        </div>
      </header>

      {/* Progress Bar */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: isMobile ? '24px 20px' : '32px 40px'
      }}>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
          {[1, 2, 3, 4, 5, 6].map(phase => (
            <div
              key={phase}
              style={{
                flex: 1,
                height: '8px',
                backgroundColor: phase <= 3 ? '#29BD98' : 'rgba(255, 255, 255, 0.1)',
                borderRadius: '4px'
              }}
            />
          ))}
        </div>
        <div style={{
          fontSize: isMobile ? '12px' : '14px',
          color: 'rgba(255, 255, 255, 0.6)',
          textAlign: 'right'
        }}>
          Phase 3 of 6
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        maxWidth: '900px',
        margin: '0 auto',
        padding: isMobile ? '0 20px 120px' : '0 40px 120px'
      }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div style={{ marginBottom: isMobile ? '32px' : '48px' }}>
            <h1 style={{
              fontSize: isMobile ? '28px' : '40px',
              fontWeight: '800',
              color: '#FFFFFF',
              marginBottom: '12px'
            }}>
              Features & Functionality
            </h1>
            <p style={{
              fontSize: isMobile ? '15px' : '18px',
              color: 'rgba(255, 255, 255, 0.7)',
              lineHeight: '1.6'
            }}>
              Select the features and capabilities your app needs.
            </p>
          </div>

          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            borderRadius: '24px',
            padding: isMobile ? '24px' : '40px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            {/* Authentication Methods */}
            <AssistedToggle
              id="authentication-assistance"
              category="Technical"
              label="Need help choosing authentication methods?"
              price={20}
              assistedLabel="Choose best auth for me"
              tooltipText="We'll recommend the right authentication setup based on your app type, security needs, and target audience."
            />

            {!hasItem('authentication-assistance') && (
              <div style={{ marginBottom: '32px', marginTop: '24px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '16px',
                  fontWeight: '700',
                  color: '#FFFFFF',
                  marginBottom: '16px'
                }}>
                  How will users sign in? * (Select all that apply)
                </label>
                
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                  {authOptions.map(option => (
                    <motion.button
                      key={option.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => toggleItem('authentication', option.id)}
                      style={{
                        padding: '12px 20px',
                        fontSize: '14px',
                        fontWeight: '600',
                        color: formData.authentication.includes(option.id) ? '#FFFFFF' : 'rgba(255, 255, 255, 0.7)',
                        background: formData.authentication.includes(option.id)
                          ? 'linear-gradient(135deg, #29BD98 0%, #2497F9 100%)'
                          : 'rgba(255, 255, 255, 0.05)',
                        border: formData.authentication.includes(option.id)
                          ? '2px solid transparent'
                          : '2px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}
                    >
                      <span style={{ fontSize: '18px' }}>{option.icon}</span>
                      <span>{option.label}</span>
                      {formData.authentication.includes(option.id) && <span>✓</span>}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* User Account Features */}
            <div style={{ marginBottom: '32px', marginTop: '32px' }}>
              <label style={{
                display: 'block',
                fontSize: '16px',
                fontWeight: '700',
                color: '#FFFFFF',
                marginBottom: '16px'
              }}>
                What account features do you need? (Select all that apply)
              </label>
              
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                {accountFeaturesOptions.map(option => (
                  <motion.button
                    key={option.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggleItem('userAccounts', option.id)}
                    style={{
                      padding: '12px 20px',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: formData.userAccounts.includes(option.id) ? '#FFFFFF' : 'rgba(255, 255, 255, 0.7)',
                      background: formData.userAccounts.includes(option.id)
                        ? 'linear-gradient(135deg, #29BD98 0%, #2497F9 100%)'
                        : 'rgba(255, 255, 255, 0.05)',
                      border: formData.userAccounts.includes(option.id)
                        ? '2px solid transparent'
                        : '2px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <span style={{ fontSize: '18px' }}>{option.icon}</span>
                    <span>{option.label}</span>
                    {formData.userAccounts.includes(option.id) && <span>✓</span>}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Core Features */}
            <AssistedToggle
              id="feature-architecture-assistance"
              category="Technical"
              label="Need help designing feature architecture?"
              price={30}
              assistedLabel="Design architecture for me"
              tooltipText="We'll create a detailed technical plan showing how your features will work together and be implemented."
            />

            {!hasItem('feature-architecture-assistance') && (
              <div style={{ marginBottom: '32px', marginTop: '24px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '16px',
                  fontWeight: '700',
                  color: '#FFFFFF',
                  marginBottom: '16px'
                }}>
                  Core Features * (Select your must-haves)
                </label>
                
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                  {coreFeaturesOptions.map(option => (
                    <motion.button
                      key={option.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => toggleItem('coreFeatures', option.id)}
                      style={{
                        padding: '12px 20px',
                        fontSize: '14px',
                        fontWeight: '600',
                        color: formData.coreFeatures.includes(option.id) ? '#FFFFFF' : 'rgba(255, 255, 255, 0.7)',
                        background: formData.coreFeatures.includes(option.id)
                          ? 'linear-gradient(135deg, #29BD98 0%, #2497F9 100%)'
                          : 'rgba(255, 255, 255, 0.05)',
                        border: formData.coreFeatures.includes(option.id)
                          ? '2px solid transparent'
                          : '2px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}
                    >
                      <span style={{ fontSize: '18px' }}>{option.icon}</span>
                      <span>{option.label}</span>
                      {formData.coreFeatures.includes(option.id) && <span>✓</span>}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Additional Features */}
            <div style={{ marginBottom: '32px', marginTop: '32px' }}>
              <label style={{
                display: 'block',
                fontSize: '16px',
                fontWeight: '700',
                color: '#FFFFFF',
                marginBottom: '16px'
              }}>
                Additional Features (Optional nice-to-haves)
              </label>
              
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                {additionalFeaturesOptions.map(option => (
                  <motion.button
                    key={option.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggleItem('additionalFeatures', option.id)}
                    style={{
                      padding: '12px 20px',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: formData.additionalFeatures.includes(option.id) ? '#FFFFFF' : 'rgba(255, 255, 255, 0.7)',
                      background: formData.additionalFeatures.includes(option.id)
                        ? 'linear-gradient(135deg, #29BD98 0%, #2497F9 100%)'
                        : 'rgba(255, 255, 255, 0.05)',
                      border: formData.additionalFeatures.includes(option.id)
                        ? '2px solid transparent'
                        : '2px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <span style={{ fontSize: '18px' }}>{option.icon}</span>
                    <span>{option.label}</span>
                    {formData.additionalFeatures.includes(option.id) && <span>✓</span>}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Navigation */}
            <div style={{
              display: 'flex',
              gap: '16px',
              marginTop: '48px',
              justifyContent: 'space-between',
              flexWrap: 'wrap'
            }}>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleBack}
                style={{
                  padding: isMobile ? '14px 32px' : '16px 48px',
                  fontSize: isMobile ? '15px' : '16px',
                  fontWeight: '700',
                  color: 'rgba(255, 255, 255, 0.9)',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '2px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '16px',
                  cursor: 'pointer'
                }}
              >
                ← Back
              </motion.button>

              <motion.button
                whileHover={{ scale: isFormValid ? 1.02 : 1 }}
                whileTap={{ scale: isFormValid ? 0.98 : 1 }}
                onClick={handleContinue}
                disabled={!isFormValid}
                style={{
                  padding: isMobile ? '14px 32px' : '16px 48px',
                  fontSize: isMobile ? '15px' : '16px',
                  fontWeight: '700',
                  color: '#FFFFFF',
                  background: isFormValid
                    ? 'linear-gradient(135deg, #29BD98 0%, #2497F9 100%)'
                    : 'rgba(255, 255, 255, 0.1)',
                  border: 'none',
                  borderRadius: '16px',
                  cursor: isFormValid ? 'pointer' : 'not-allowed',
                  opacity: isFormValid ? 1 : 0.5
                }}
              >
                Continue to Phase 4 →
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>

      <CartSummary />
    </div>
  );
};

export default Phase3Page;
