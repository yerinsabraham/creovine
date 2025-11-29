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

const Phase1Page = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const { projectData, updatePhaseData } = useProject();
  const { hasItem } = useCart();
  const isMobile = useIsMobile();

  const [formData, setFormData] = useState({
    appType: projectData?.vision?.appType || '',
    customAppType: projectData?.vision?.customAppType || '',
    corePurpose: projectData?.vision?.corePurpose || '',
    keyFeatures: projectData?.vision?.keyFeatures || ['', '', ''],
    inspiration: projectData?.vision?.inspiration || ''
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFeatureChange = (index, value) => {
    const newFeatures = [...formData.keyFeatures];
    newFeatures[index] = value;
    setFormData(prev => ({ ...prev, keyFeatures: newFeatures }));
  };

  const addFeature = () => {
    setFormData(prev => ({
      ...prev,
      keyFeatures: [...prev.keyFeatures, '']
    }));
  };

  const removeFeature = (index) => {
    if (formData.keyFeatures.length > 3) {
      const newFeatures = formData.keyFeatures.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, keyFeatures: newFeatures }));
    }
  };

  const handleContinue = async () => {
    try {
      console.log('Phase 1: Saving data and navigating...', formData);
      await updatePhaseData('vision', formData);
      console.log('Phase 1: Data saved, navigating to Phase 2');
      navigate('/onboarding/phase2');
    } catch (error) {
      console.error('Phase 1: Error saving data:', error);
      // Navigate anyway to not block user
      navigate('/onboarding/phase2');
    }
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
  const isAppTypeValid = (formData.appType.trim() && (formData.appType !== 'Other' || formData.customAppType.trim())) || hasItem('app-type-assist');
  const isPurposeValid = formData.corePurpose.trim() || hasItem('purpose-assist');
  const areFeaturesValid = formData.keyFeatures.filter(f => f.trim()).length >= 3 || hasItem('features-assist');
  
  const isFormValid = isAppTypeValid && isPurposeValid && areFeaturesValid;

  const appTypeOptions = [
    'E-commerce',
    'Social Platform',
    'SaaS',
    'Marketplace',
    'Dating App',
    'Education',
    'Healthcare',
    'Finance',
    'Real Estate',
    'Food & Restaurant',
    'Booking/Scheduling',
    'Content Platform',
    'Other'
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
              width: 'auto',
              objectFit: 'contain',
              maxWidth: '140px',
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
                cursor: 'pointer',
                transition: 'all 0.2s ease'
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
          {[1, 2, 3, 4, 5, 6].map(phase => (
            <div
              key={phase}
              style={{
                flex: 1,
                height: '8px',
                backgroundColor: phase === 1 
                  ? '#29BD98' 
                  : 'rgba(255, 255, 255, 0.1)',
                borderRadius: '4px',
                transition: 'all 0.3s ease'
              }}
            />
          ))}
        </div>
        <div style={{
          fontSize: isMobile ? '12px' : '14px',
          color: 'rgba(255, 255, 255, 0.6)',
          textAlign: 'right'
        }}>
          Phase 1 of 6
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
          {/* Phase Title */}
          <div style={{ marginBottom: isMobile ? '32px' : '48px' }}>
            <h1 style={{
              fontSize: isMobile ? '28px' : '40px',
              fontWeight: '800',
              color: '#FFFFFF',
              marginBottom: '12px'
            }}>
              App Vision
            </h1>
            <p style={{
              fontSize: isMobile ? '15px' : '18px',
              color: 'rgba(255, 255, 255, 0.7)',
              lineHeight: '1.6'
            }}>
              Let's start with the big picture. What are you building and why?
            </p>
          </div>

          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            borderRadius: '24px',
            padding: isMobile ? '24px' : '40px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            {/* App Type */}
            <AssistedToggle
              id="app-type-assist"
              category="Planning"
              label="Need help choosing the right app type?"
              price={15}
              assistedLabel="Decide for me"
              tooltipText="We'll analyze your idea and help you determine the best app category and structure for your goals."
            />

            {!hasItem('app-type-assist') && (
              <div style={{ marginBottom: '32px', marginTop: '24px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '16px',
                  fontWeight: '700',
                  color: '#FFFFFF',
                  marginBottom: '12px'
                }}>
                  What type of app are you building? *
                </label>
                <select
                  value={formData.appType}
                  onChange={(e) => handleInputChange('appType', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '16px 20px',
                    fontSize: '16px',
                    color: formData.appType ? '#FFFFFF' : 'rgba(255, 255, 255, 0.5)',
                    backgroundColor: '#15293A',
                    border: '2px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '16px',
                    outline: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    fontFamily: 'inherit'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#29BD98';
                    e.target.style.boxShadow = '0 0 0 3px rgba(41, 189, 152, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  <option value="" disabled>Select app type...</option>
                  {appTypeOptions.map(option => (
                    <option key={option} value={option} style={{ color: '#000' }}>
                      {option}
                    </option>
                  ))}
                </select>

                {/* Custom App Type Input (shows when "Other" is selected) */}
                {formData.appType === 'Other' && (
                  <div style={{ marginTop: '16px' }}>
                    <input
                      type="text"
                      value={formData.customAppType}
                      onChange={(e) => handleInputChange('customAppType', e.target.value)}
                      placeholder="Please specify your app type..."
                      style={{
                        width: '100%',
                        padding: '16px 20px',
                        fontSize: '16px',
                        color: '#FFFFFF',
                        backgroundColor: '#15293A',
                        border: '2px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '16px',
                        outline: 'none',
                        transition: 'all 0.2s ease',
                        fontFamily: 'inherit'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#29BD98';
                        e.target.style.boxShadow = '0 0 0 3px rgba(41, 189, 152, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>
                )}
              </div>
            )}

            {/* Core Purpose */}
            {/* Assisted Toggle for Core Purpose */}
            <AssistedToggle
              id="purpose-assist"
              category="Planning"
              label="Need help defining your app's purpose?"
              price={20}
              assistedLabel="Brainstorm with me"
              tooltipText="We'll help you clarify what your app does and craft a clear, compelling description."
            />

            {!hasItem('purpose-assist') && (
              <div style={{ marginBottom: '32px', marginTop: '24px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '16px',
                  fontWeight: '700',
                  color: '#FFFFFF',
                  marginBottom: '12px'
                }}>
                  What is the core purpose of your app? *
                </label>
                <textarea
                  value={formData.corePurpose}
                  onChange={(e) => handleInputChange('corePurpose', e.target.value)}
                  placeholder="Describe what your app does and how it works..."
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
                    transition: 'all 0.2s ease',
                    fontFamily: 'inherit',
                    resize: 'vertical'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#29BD98';
                    e.target.style.boxShadow = '0 0 0 3px rgba(41, 189, 152, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
            )}

            {/* Key Features */}
            {/* Assisted Toggle for Features */}
            <AssistedToggle
              id="features-assist"
              category="Planning"
              label="Need help defining your key features?"
              price={25}
              assistedLabel="Brainstorm for me"
              tooltipText="We'll help you identify and prioritize the right features based on your app type and target audience."
            />

            {!hasItem('features-assist') && (
              <div style={{ marginBottom: '32px', marginTop: '24px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '16px',
                  fontWeight: '700',
                  color: '#FFFFFF',
                  marginBottom: '12px'
                }}>
                  What are the 3-5 key features? *
                </label>
                <p style={{
                  fontSize: '14px',
                  color: 'rgba(255, 255, 255, 0.6)',
                  marginBottom: '16px'
                }}>
                  List the must-have features that define your app
                </p>
                
                {formData.keyFeatures.map((feature, index) => (
                  <div key={index} style={{
                    display: 'flex',
                    gap: '12px',
                    marginBottom: '12px',
                    alignItems: 'center'
                  }}>
                    <input
                      type="text"
                      value={feature}
                      onChange={(e) => handleFeatureChange(index, e.target.value)}
                      placeholder={`Feature ${index + 1}...`}
                      style={{
                        flex: 1,
                        padding: '14px 18px',
                        fontSize: '15px',
                        color: '#FFFFFF',
                        backgroundColor: '#15293A',
                        border: '2px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '12px',
                        outline: 'none',
                        transition: 'all 0.2s ease',
                        fontFamily: 'inherit'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#29BD98';
                        e.target.style.boxShadow = '0 0 0 3px rgba(41, 189, 152, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                    {formData.keyFeatures.length > 3 && (
                      <button
                        onClick={() => removeFeature(index)}
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '8px',
                          border: '2px solid rgba(255, 107, 107, 0.3)',
                          backgroundColor: 'rgba(255, 107, 107, 0.1)',
                          color: '#FF6B6B',
                          cursor: 'pointer',
                          fontSize: '18px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
                
                {formData.keyFeatures.length < 8 && (
                  <button
                    onClick={addFeature}
                    style={{
                      marginTop: '12px',
                      padding: '12px 24px',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#29BD98',
                      backgroundColor: 'rgba(41, 189, 152, 0.1)',
                      border: '2px dashed rgba(41, 189, 152, 0.3)',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    + Add another feature
                  </button>
                )}
              </div>
            )}

            {/* Inspiration */}
            <div style={{ marginBottom: '32px', marginTop: '32px' }}>
              <label style={{
                display: 'block',
                fontSize: '16px',
                fontWeight: '700',
                color: '#FFFFFF',
                marginBottom: '12px'
              }}>
                Any apps you want to be like? (Optional)
              </label>
              <input
                type="text"
                value={formData.inspiration}
                onChange={(e) => handleInputChange('inspiration', e.target.value)}
                placeholder="e.g., Airbnb for parking spaces, Tinder for business networking..."
                style={{
                  width: '100%',
                  padding: '16px 20px',
                  fontSize: '16px',
                  color: '#FFFFFF',
                  backgroundColor: '#15293A',
                  border: '2px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '16px',
                  outline: 'none',
                  transition: 'all 0.2s ease',
                  fontFamily: 'inherit'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#29BD98';
                  e.target.style.boxShadow = '0 0 0 3px rgba(41, 189, 152, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            {/* Navigation Buttons */}
            <div style={{
              display: 'flex',
              gap: '16px',
              marginTop: '48px',
              justifyContent: 'flex-end'
            }}>
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
                  opacity: isFormValid ? 1 : 0.5,
                  transition: 'all 0.2s ease'
                }}
              >
                Continue to Phase 2
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Cart Summary Widget */}
      <CartSummary />
    </div>
  );
};

export default Phase1Page;
