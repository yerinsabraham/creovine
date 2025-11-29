import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useProject } from '../../../context/ProjectContext';
import { useCart } from '../../../context/CartContext';
import { useIsMobile } from '../../../hooks/useMediaQuery';
import AssistedToggle from '../../../components/common/AssistedToggle';
import CartSummary from '../../../components/common/CartSummary';
import logo from '../../../assets/logo.png';

const WebsiteUpgradeStep2 = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const { projectData, updateProjectData } = useProject();
  const { } = useCart();
  const isMobile = useIsMobile();
  
  const themeColor = '#8B5CF6';
  
  const [formData, setFormData] = useState({
    features: projectData?.websiteUpgrade?.features || [],
    additionalDetails: projectData?.websiteUpgrade?.additionalDetails || ''
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleFeatureToggle = (feature) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }));
  };

  const handleTextareaChange = (value) => {
    setFormData(prev => ({ ...prev, additionalDetails: value }));
  };

  const handleContinue = async () => {
    await updateProjectData({ 
      websiteUpgrade: {
        ...projectData?.websiteUpgrade,
        ...formData
      }
    });
    navigate('/onboarding/website-upgrade/step3');
  };

  const handleBack = async () => {
    await updateProjectData({ 
      websiteUpgrade: {
        ...projectData?.websiteUpgrade,
        ...formData
      }
    });
    navigate('/onboarding/website-upgrade/step1');
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const isValid = formData.features.length > 0;

  const featureOptions = [
    'New Pages/Sections',
    'Performance Optimization',
    'Mobile Responsiveness',
    'SEO Improvements',
    'Security Updates',
    'Content Management System',
    'E-commerce Integration',
    'API Integrations',
    'Design Refresh',
    'Analytics Setup',
    'Blog/News Section',
    'Contact/Lead Forms',
    'Social Media Integration',
    'Site Search',
    'Multi-language Support',
    'Accessibility WCAG'
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
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
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
          {[1, 2, 3].map(step => (
            <div
              key={step}
              style={{
                flex: 1,
                height: '8px',
                backgroundColor: step <= 2 
                  ? themeColor
                  : 'rgba(255, 255, 255, 0.1)',
                borderRadius: '4px',
                transition: 'all 0.3s'
              }}
            />
          ))}
        </div>
        <div style={{
          fontSize: isMobile ? '12px' : '14px',
          color: 'rgba(255, 255, 255, 0.6)',
          textAlign: 'right'
        }}>
          Step 2 of 3
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
          {/* Header */}
          <div style={{ marginBottom: isMobile ? '32px' : '48px' }}>
            <h1 style={{
              fontSize: isMobile ? '28px' : '40px',
              fontWeight: '800',
              color: '#FFFFFF',
              marginBottom: '12px'
            }}>
              Features & Improvements
            </h1>
            <p style={{
              fontSize: isMobile ? '15px' : '18px',
              color: 'rgba(255, 255, 255, 0.7)',
              lineHeight: '1.6'
            }}>
              Select the features and improvements you need for your website
            </p>
          </div>

          {/* Form */}
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '24px',
            padding: isMobile ? '24px' : '40px',
            marginBottom: '32px'
          }}>
            {/* Features Selection */}
            <div style={{ marginBottom: '32px' }}>
              <label style={{
                display: 'block',
                fontSize: '16px',
                fontWeight: '700',
                color: '#FFFFFF',
                marginBottom: '12px'
              }}>
                Select Features You Need *
              </label>
              <p style={{
                fontSize: '13px',
                color: 'rgba(255, 255, 255, 0.5)',
                marginBottom: '16px'
              }}>
                Choose all that apply. Multiple selections help us understand your full scope.
              </p>
              <div style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
                gap: '12px'
              }}>
                {featureOptions.map((feature) => (
                  <button
                    key={feature}
                    onClick={() => handleFeatureToggle(feature)}
                    style={{
                      padding: '16px',
                      backgroundColor: formData.features.includes(feature)
                        ? `${themeColor}22` 
                        : 'rgba(255, 255, 255, 0.05)',
                      border: formData.features.includes(feature)
                        ? `2px solid ${themeColor}`
                        : '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      color: formData.features.includes(feature) ? themeColor : '#FFFFFF',
                      fontSize: '14px',
                      fontWeight: formData.features.includes(feature) ? '700' : '500',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      textAlign: 'left',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px'
                    }}
                  >
                    <div style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '6px',
                      border: formData.features.includes(feature)
                        ? `2px solid ${themeColor}`
                        : '2px solid rgba(255, 255, 255, 0.3)',
                      backgroundColor: formData.features.includes(feature)
                        ? themeColor
                        : 'transparent',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      {formData.features.includes(feature) && (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="3">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <span>{feature}</span>
                  </button>
                ))}
              </div>
              {formData.features.length > 0 && (
                <div style={{
                  marginTop: '12px',
                  fontSize: '13px',
                  color: themeColor,
                  fontWeight: '600'
                }}>
                  {formData.features.length} feature{formData.features.length !== 1 ? 's' : ''} selected
                </div>
              )}
            </div>

            {/* Additional Details */}
            <div style={{ marginBottom: '0' }}>
              <label style={{
                display: 'block',
                fontSize: '16px',
                fontWeight: '700',
                color: '#FFFFFF',
                marginBottom: '12px'
              }}>
                Additional Details (Optional)
              </label>
              <textarea
                id="additional-details"
                name="additionalDetails"
                value={formData.additionalDetails}
                onChange={(e) => handleTextareaChange(e.target.value)}
                placeholder="Tell us more about specific features or any custom requirements you have in mind..."
                rows={6}
                style={{
                  width: '100%',
                  padding: '16px',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  color: '#FFFFFF',
                  fontSize: '15px',
                  outline: 'none',
                  transition: 'all 0.2s',
                  boxSizing: 'border-box',
                  fontFamily: 'inherit',
                  resize: 'vertical'
                }}
                onFocus={(e) => e.target.style.borderColor = themeColor}
                onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
              />
              <p style={{
                fontSize: '13px',
                color: 'rgba(255, 255, 255, 0.5)',
                marginTop: '8px'
              }}>
                Share any specific requirements, integrations, or custom functionality you need
              </p>
            </div>
          </div>

          {/* Cart Summary */}
          <CartSummary />

          {/* Navigation */}
          <div style={{
            display: 'flex',
            gap: '16px',
            marginTop: '32px'
          }}>
            <button
              onClick={handleBack}
              style={{
                flex: 1,
                padding: '18px',
                backgroundColor: 'transparent',
                border: '2px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '12px',
                color: '#FFFFFF',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.05)'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
            >
              ← Back
            </button>
            <button
              onClick={handleContinue}
              disabled={!isValid}
              style={{
                flex: 2,
                padding: '18px',
                background: isValid 
                  ? `linear-gradient(135deg, ${themeColor}, ${themeColor}CC)` 
                  : 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                borderRadius: '12px',
                color: isValid ? '#FFFFFF' : 'rgba(255, 255, 255, 0.3)',
                fontSize: '16px',
                fontWeight: '700',
                cursor: isValid ? 'pointer' : 'not-allowed',
                transition: 'all 0.2s'
              }}
            >
              Continue →
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default WebsiteUpgradeStep2;
