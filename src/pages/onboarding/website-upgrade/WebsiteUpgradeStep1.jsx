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

const WebsiteUpgradeStep1 = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const { projectData, updateProjectData } = useProject();
  const { hasItem } = useCart();
  const isMobile = useIsMobile();
  
  const themeColor = '#8B5CF6';
  
  const [formData, setFormData] = useState({
    websiteName: projectData?.websiteUpgrade?.websiteName || '',
    currentUrl: projectData?.websiteUpgrade?.currentUrl || '',
    updateType: projectData?.websiteUpgrade?.updateType || '',
    hasAccess: projectData?.websiteUpgrade?.hasAccess || ''
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleContinue = async () => {
    await updateProjectData({ 
      websiteUpgrade: formData 
    });
    navigate('/onboarding/website-upgrade/step2');
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const isTypeValid = formData.updateType.trim() || hasItem('website-upgrade-type-assist');
  
  const isValid = formData.websiteName.trim() && 
                  formData.currentUrl.trim() && 
                  isTypeValid && 
                  formData.hasAccess;

  const updateTypeOptions = [
    'Complete Redesign',
    'Add New Features',
    'Modernize/Refresh',
    'Performance Upgrade',
    'Fix Issues & Bugs',
    'SEO Optimization',
    'Mobile Responsiveness',
    'Security Update'
  ];

  const accessOptions = [
    'Yes, full access',
    'Partial access',
    'No access yet'
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
                backgroundColor: step === 1 
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
          Step 1 of 3
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
              Website Update/Upgrade
            </h1>
            <p style={{
              fontSize: isMobile ? '15px' : '18px',
              color: 'rgba(255, 255, 255, 0.7)',
              lineHeight: '1.6'
            }}>
              Tell us about your website and what improvements you need
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
            {/* Website Name */}
            <div style={{ marginBottom: '32px' }}>
              <label style={{
                display: 'block',
                fontSize: '16px',
                fontWeight: '700',
                color: '#FFFFFF',
                marginBottom: '12px'
              }}>
                Website Name *
              </label>
              <input
                type="text"
                id="website-name"
                name="websiteName"
                value={formData.websiteName}
                onChange={(e) => handleInputChange('websiteName', e.target.value)}
                placeholder="e.g., My Business Website"
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
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => e.target.style.borderColor = themeColor}
                onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
              />
            </div>

            {/* Current URL */}
            <div style={{ marginBottom: '32px' }}>
              <label style={{
                display: 'block',
                fontSize: '16px',
                fontWeight: '700',
                color: '#FFFFFF',
                marginBottom: '12px'
              }}>
                Current Website URL *
              </label>
              <input
                type="url"
                id="website-url"
                name="currentUrl"
                value={formData.currentUrl}
                onChange={(e) => handleInputChange('currentUrl', e.target.value)}
                placeholder="https://yourwebsite.com"
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
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => e.target.style.borderColor = themeColor}
                onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
              />
              <p style={{
                fontSize: '13px',
                color: 'rgba(255, 255, 255, 0.5)',
                marginTop: '8px'
              }}>
                If your website is not live yet, enter your staging URL or write "Not live yet"
              </p>
            </div>

            {/* Update Type */}
            <AssistedToggle
              id="website-upgrade-type-assist"
              category="Website Upgrade"
              label="What type of update do you need?"
              price={150}
              assistedLabel="Recommend for me"
              tooltipText="We'll analyze your website and recommend the best update approach for your needs."
            />

            {!hasItem('website-upgrade-type-assist') && (
              <div style={{ marginBottom: '32px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '16px',
                  fontWeight: '700',
                  color: '#FFFFFF',
                  marginBottom: '12px'
                }}>
                  What type of update do you need? *
                </label>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
                  gap: '12px'
                }}>
                  {updateTypeOptions.map((option) => (
                    <button
                      key={option}
                      onClick={() => handleInputChange('updateType', option)}
                      style={{
                        padding: '16px',
                        backgroundColor: formData.updateType === option 
                          ? `${themeColor}22` 
                          : 'rgba(255, 255, 255, 0.05)',
                        border: formData.updateType === option
                          ? `2px solid ${themeColor}`
                          : '2px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '12px',
                        color: formData.updateType === option ? themeColor : '#FFFFFF',
                        fontSize: '14px',
                        fontWeight: formData.updateType === option ? '700' : '500',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        textAlign: 'center'
                      }}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Access Level */}
            <div style={{ marginBottom: '0' }}>
              <label style={{
                display: 'block',
                fontSize: '16px',
                fontWeight: '700',
                color: '#FFFFFF',
                marginBottom: '12px'
              }}>
                Do you have access to the website's code/hosting? *
              </label>
              <div style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
                gap: '12px'
              }}>
                {accessOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleInputChange('hasAccess', option)}
                    style={{
                      padding: '16px',
                      backgroundColor: formData.hasAccess === option 
                        ? `${themeColor}22` 
                        : 'rgba(255, 255, 255, 0.05)',
                      border: formData.hasAccess === option
                        ? `2px solid ${themeColor}`
                        : '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      color: formData.hasAccess === option ? themeColor : '#FFFFFF',
                      fontSize: '14px',
                      fontWeight: formData.hasAccess === option ? '700' : '500',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      textAlign: 'center'
                    }}
                  >
                    {option}
                  </button>
                ))}
              </div>
              <p style={{
                fontSize: '13px',
                color: 'rgba(255, 255, 255, 0.5)',
                marginTop: '12px'
              }}>
                This helps us understand how we'll implement the changes
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
              onClick={() => navigate('/get-started')}
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
              Back
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

export default WebsiteUpgradeStep1;
