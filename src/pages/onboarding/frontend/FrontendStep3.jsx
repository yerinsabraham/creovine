import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useProject } from '../../../context/ProjectContext';
import { useCart } from '../../../context/CartContext';
import { useIsMobile } from '../../../hooks/useMediaQuery';
import AssistedToggle from '../../../components/common/AssistedToggle';
import CartSummary from '../../../components/common/CartSummary';
import ChipGroup from '../../../components/common/ChipGroup';
import logo from '../../../assets/logo.png';

const FrontendStep3 = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const { projectData, updatePhaseData } = useProject();
  const { hasItem } = useCart();
  const isMobile = useIsMobile();

  // Check for add-ons
  const addOns = projectData?.addOns || [];
  const hasAPIIntegration = addOns.some(a => a.id === 'api-integration');
  const hasAuthentication = addOns.some(a => a.id === 'authentication');

  const [formData, setFormData] = useState({
    apiEndpoints: projectData?.frontend?.apiEndpoints || '',
    stateManagement: projectData?.frontend?.stateManagement || '',
    libraries: projectData?.frontend?.libraries || [],
    // Pre-fill from add-ons
    authAPI: hasAuthentication ? 'Required' : '',
    externalAPIs: hasAPIIntegration ? (projectData?.frontend?.externalAPIs || '') : ''
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleItem = (field, item) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(item)
        ? prev[field].filter(i => i !== item)
        : [...prev[field], item]
    }));
  };

  const handleSaveAndExit = async () => {
    await updatePhaseData('frontend', { ...projectData.frontend, ...formData, currentStep: 3 });
    navigate('/dashboard');
  };

  const handleContinue = async () => {
    await updatePhaseData('frontend', { ...projectData.frontend, ...formData });
    navigate('/onboarding/frontend/step4');
  };

  const handleBack = () => {
    navigate('/onboarding/frontend/step2');
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Validation
  const isFormValid = true; // All optional or assisted

  const stateOptions = [
    'Redux/Redux Toolkit',
    'Context API',
    'Zustand',
    'MobX',
    'Recoil',
    'Jotai',
    'None (local state only)'
  ];

  const libraryOptions = [
    'React Router',
    'React Query/TanStack Query',
    'Axios',
    'Formik/React Hook Form',
    'Material-UI',
    'Tailwind CSS',
    'Styled Components',
    'Framer Motion',
    'Chart.js/Recharts',
    'Socket.io Client',
    'Firebase SDK',
    'Stripe Elements'
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
          justifyContent: 'space-between',
          flexWrap: isMobile ? 'wrap' : 'nowrap',
          gap: isMobile ? '12px' : '0'
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
          
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: isMobile ? '12px' : '24px',
            flexWrap: 'wrap',
            justifyContent: 'flex-end',
            flex: 1
          }}>
            {!isMobile && currentUser && (
              <div style={{
                fontSize: '14px',
                color: 'rgba(255, 255, 255, 0.7)'
              }}>
                {currentUser.email}
              </div>
            )}
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
        </div>
      </header>

      {/* Progress Bar */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: isMobile ? '24px 20px' : '32px 40px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '8px'
        }}>
          {[1, 2, 3, 4].map(step => (
            <div
              key={step}
              style={{
                flex: 1,
                height: '8px',
                backgroundColor: step <= 3 
                  ? '#2497F9' 
                  : 'rgba(255, 255, 255, 0.1)',
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
          Step 3 of 4
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
          transition={{ duration: 0.5 }}
        >
          <div style={{ marginBottom: isMobile ? '32px' : '48px' }}>
            <h1 style={{
              fontSize: isMobile ? '28px' : '40px',
              fontWeight: '800',
              color: '#FFFFFF',
              marginBottom: '12px'
            }}>
              Integration & Technical Needs
            </h1>
            <p style={{
              fontSize: isMobile ? '15px' : '18px',
              color: 'rgba(255, 255, 255, 0.7)',
              lineHeight: '1.6'
            }}>
              How should your frontend connect and interact?
            </p>
          </div>

          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            borderRadius: '24px',
            padding: isMobile ? '24px' : '40px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            {/* Auth API (if Authentication add-on) */}
            {hasAuthentication && (
              <div style={{ 
                marginBottom: '32px',
                padding: '20px',
                backgroundColor: 'rgba(239, 68, 68, 0.05)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                borderRadius: '16px'
              }}>
                <div style={{
                  fontSize: '14px',
                  color: '#EF4444',
                  marginBottom: '8px',
                  fontWeight: '600'
                }}>
                  ✓ Authentication Add-on
                </div>
                <p style={{
                  fontSize: '15px',
                  color: 'rgba(255, 255, 255, 0.7)',
                  marginBottom: '0'
                }}>
                  We'll integrate authentication API endpoints in your frontend
                </p>
              </div>
            )}

            {/* External APIs (if API Integration add-on) */}
            {hasAPIIntegration && (
              <div style={{ 
                marginBottom: '32px',
                padding: '20px',
                backgroundColor: 'rgba(245, 158, 11, 0.05)',
                border: '1px solid rgba(245, 158, 11, 0.2)',
                borderRadius: '16px'
              }}>
                <div style={{
                  fontSize: '14px',
                  color: '#F59E0B',
                  marginBottom: '12px',
                  fontWeight: '600'
                }}>
                  ✓ API Integration Add-on
                </div>
                <label style={{
                  display: 'block',
                  fontSize: '16px',
                  fontWeight: '700',
                  color: '#FFFFFF',
                  marginBottom: '12px'
                }}>
                  Which APIs/services to integrate?
                </label>
                <textarea
                  value={formData.externalAPIs}
                  onChange={(e) => handleInputChange('externalAPIs', e.target.value)}
                  placeholder="e.g., Stripe, Google Maps, Twilio, Custom API..."
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '16px 20px',
                    fontSize: '16px',
                    color: '#FFFFFF',
                    backgroundColor: '#15293A',
                    border: '2px solid rgba(245, 158, 11, 0.3)',
                    borderRadius: '16px',
                    outline: 'none',
                    fontFamily: 'inherit',
                    resize: 'vertical'
                  }}
                />
              </div>
            )}

            {/* API Endpoints */}
            <AssistedToggle
              id="api-setup-assist"
              category="Frontend"
              label="Need help setting up API connections?"
              price={35}
              assistedLabel="Set up for me"
              tooltipText="We'll configure API calls, error handling, and data fetching for your frontend."
            />

            {!hasItem('api-setup-assist') && (
              <div style={{ marginBottom: '32px', marginTop: '24px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '16px',
                  fontWeight: '700',
                  color: '#FFFFFF',
                  marginBottom: '12px'
                }}>
                  What API endpoints do you need to connect? (Optional)
                </label>
                <textarea
                  value={formData.apiEndpoints}
                  onChange={(e) => handleInputChange('apiEndpoints', e.target.value)}
                  placeholder="List the backend endpoints or describe what data you need to fetch/send..."
                  rows={4}
                  style={{
                    width: '100%',
                    padding: '16px 20px',
                    fontSize: '16px',
                    color: '#FFFFFF',
                    backgroundColor: '#15293A',
                    border: '2px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '16px',
                    outline: 'none',
                    fontFamily: 'inherit',
                    resize: 'vertical'
                  }}
                />
              </div>
            )}

            {/* State Management */}
            <div style={{ marginBottom: '32px' }}>
              <label style={{
                display: 'block',
                fontSize: '16px',
                fontWeight: '700',
                color: '#FFFFFF',
                marginBottom: '12px'
              }}>
                State management preference? (Optional)
              </label>
              <select
                value={formData.stateManagement}
                onChange={(e) => handleInputChange('stateManagement', e.target.value)}
                style={{
                  width: '100%',
                  padding: '16px 20px',
                  fontSize: '16px',
                  color: formData.stateManagement ? '#FFFFFF' : 'rgba(255, 255, 255, 0.5)',
                  backgroundColor: '#15293A',
                  border: '2px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '16px',
                  outline: 'none',
                  cursor: 'pointer',
                  fontFamily: 'inherit'
                }}
              >
                <option value="">We'll choose for you</option>
                {stateOptions.map(option => (
                  <option key={option} value={option} style={{ color: '#000' }}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            {/* Libraries */}
            <div style={{ marginBottom: '32px' }}>
              <label style={{
                display: 'block',
                fontSize: '16px',
                fontWeight: '700',
                color: '#FFFFFF',
                marginBottom: '12px'
              }}>
                Any specific libraries you want? (Optional)
              </label>
              <ChipGroup
                options={libraryOptions}
                selected={formData.libraries}
                onChange={(newLibraries) => handleInputChange('libraries', newLibraries)}
                multiple
              />
            </div>

            {/* Navigation */}
            <div style={{
              display: 'flex',
              gap: isMobile ? '12px' : '16px',
              marginTop: '48px',
              justifyContent: 'space-between',
              flexWrap: isMobile ? 'wrap' : 'nowrap'
            }}>
              <button
                onClick={handleBack}
                style={{
                  padding: isMobile ? '14px 24px' : '16px 32px',
                  fontSize: isMobile ? '15px' : '16px',
                  fontWeight: '600',
                  color: 'rgba(255, 255, 255, 0.7)',
                  backgroundColor: 'transparent',
                  border: '2px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '16px',
                  cursor: 'pointer'
                }}
              >
                Back
              </button>

              <div style={{ 
                display: 'flex', 
                gap: isMobile ? '8px' : '12px',
                flex: 1,
                justifyContent: 'flex-end',
                flexWrap: isMobile ? 'wrap' : 'nowrap'
              }}>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSaveAndExit}
                  style={{
                    padding: isMobile ? '14px 20px' : '16px 32px',
                    fontSize: isMobile ? '14px' : '16px',
                    fontWeight: '600',
                    color: '#FFFFFF',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    border: '2px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: '16px',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  Save & Exit
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleContinue}
                  style={{
                    padding: isMobile ? '14px 24px' : '16px 48px',
                    fontSize: isMobile ? '15px' : '16px',
                    fontWeight: '700',
                    color: '#FFFFFF',
                    background: 'linear-gradient(135deg, #2497F9 0%, #29BD98 100%)',
                    border: 'none',
                    borderRadius: '16px',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  Continue to Step 4
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <CartSummary />
    </div>
  );
};

export default FrontendStep3;
