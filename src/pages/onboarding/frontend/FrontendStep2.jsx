import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useProject } from '../../../context/ProjectContext';
import { useCart } from '../../../context/CartContext';
import { useIsMobile } from '../../../hooks/useMediaQuery';
import AssistedToggle from '../../../components/common/AssistedToggle';
import CartSummary from '../../../components/common/CartSummary';
import Chip from '../../../components/common/Chip';
import ChipGroup from '../../../components/common/ChipGroup';
import logo from '../../../assets/logo.png';

const FrontendStep2 = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const { projectData, updatePhaseData } = useProject();
  const { hasItem } = useCart();
  const isMobile = useIsMobile();

  // Check for add-ons
  const addOns = projectData?.addOns || [];
  const hasUIDesign = addOns.some(a => a.id === 'ui-design');
  const hasAuthentication = addOns.some(a => a.id === 'authentication');

  const [formData, setFormData] = useState({
    pages: projectData?.frontend?.pages || [],
    components: projectData?.frontend?.components || [],
    responsive: projectData?.frontend?.responsive || [],
    designReference: projectData?.frontend?.designReference || '',
    // Pre-fill from add-ons
    designStyle: hasUIDesign ? (projectData?.frontend?.designStyle || '') : '',
    authComponents: hasAuthentication ? ['Login', 'Signup', 'Password Reset'] : []
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

  const handleContinue = async () => {
    await updatePhaseData('frontend', { ...projectData.frontend, ...formData });
    navigate('/onboarding/frontend/step3');
  };

  const handleBack = () => {
    navigate('/onboarding/frontend/step1');
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
  const isPagesValid = formData.pages.length > 0 || hasItem('ui-structure-assist');
  const isComponentsValid = formData.components.length > 0 || hasItem('ui-structure-assist');
  
  const isFormValid = isPagesValid && isComponentsValid;

  const pageOptions = [
    'Home/Landing',
    'Dashboard',
    'Profile',
    'Settings',
    'Checkout',
    'Product Listing',
    'Product Detail',
    'Cart',
    'Search Results',
    'Admin Panel',
    'Analytics',
    'Chat/Messaging'
  ];

  const componentOptions = [
    'Navigation Bar',
    'Footer',
    'Sidebar',
    'Modal/Dialog',
    'Forms',
    'Tables',
    'Charts/Graphs',
    'Cards',
    'Buttons',
    'Dropdowns',
    'Tabs',
    'Accordions',
    'Carousel/Slider',
    'File Upload',
    'Date Picker',
    'Search Bar'
  ];

  const responsiveOptions = [
    { id: 'mobile', label: 'Mobile', icon: '📱' },
    { id: 'tablet', label: 'Tablet', icon: '📱' },
    { id: 'desktop', label: 'Desktop', icon: '💻' }
  ];

  const designStyles = hasUIDesign ? [
    'Modern',
    'Minimalist',
    'Playful',
    'Professional',
    'Creative',
    'Tech/Startup'
  ] : [];

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
                backgroundColor: step <= 2 
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
          Step 2 of 4
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
              UI Requirements
            </h1>
            <p style={{
              fontSize: isMobile ? '15px' : '18px',
              color: 'rgba(255, 255, 255, 0.7)',
              lineHeight: '1.6'
            }}>
              What pages, components, and features do you need?
            </p>
          </div>

          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            borderRadius: '24px',
            padding: isMobile ? '24px' : '40px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            {/* Pages/Screens */}
            <AssistedToggle
              id="ui-structure-assist"
              category="Frontend"
              label="Need help defining your UI structure?"
              price={30}
              assistedLabel="Plan for me"
              tooltipText="We'll help you identify the right pages, components, and layout structure for your project."
            />

            {!hasItem('ui-structure-assist') && (
              <>
                <div style={{ marginBottom: '32px', marginTop: '24px' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '16px',
                    fontWeight: '700',
                    color: '#FFFFFF',
                    marginBottom: '12px'
                  }}>
                    What pages/screens do you need? *
                  </label>
                  <ChipGroup
                    options={pageOptions}
                    selected={formData.pages}
                    onToggle={(item) => toggleItem('pages', item)}
                  />
                </div>

                <div style={{ marginBottom: '32px' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '16px',
                    fontWeight: '700',
                    color: '#FFFFFF',
                    marginBottom: '12px'
                  }}>
                    What components do you need? *
                  </label>
                  <ChipGroup
                    options={componentOptions}
                    selected={formData.components}
                    onToggle={(item) => toggleItem('components', item)}
                  />
                </div>
              </>
            )}

            {/* Responsive Requirements */}
            <div style={{ marginBottom: '32px' }}>
              <label style={{
                display: 'block',
                fontSize: '16px',
                fontWeight: '700',
                color: '#FFFFFF',
                marginBottom: '12px'
              }}>
                Which devices should it support? *
              </label>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                {responsiveOptions.map(option => (
                  <Chip
                    key={option.id}
                    label={`${option.icon} ${option.label}`}
                    selected={formData.responsive.includes(option.id)}
                    onClick={() => toggleItem('responsive', option.id)}
                  />
                ))}
              </div>
            </div>

            {/* Design Style (if UI/UX Design add-on selected) */}
            {hasUIDesign && (
              <div style={{ 
                marginBottom: '32px',
                padding: '20px',
                backgroundColor: 'rgba(41, 189, 152, 0.05)',
                border: '1px solid rgba(41, 189, 152, 0.2)',
                borderRadius: '16px'
              }}>
                <div style={{
                  fontSize: '14px',
                  color: '#29BD98',
                  marginBottom: '12px',
                  fontWeight: '600'
                }}>
                  ✓ UI/UX Design Add-on
                </div>
                <label style={{
                  display: 'block',
                  fontSize: '16px',
                  fontWeight: '700',
                  color: '#FFFFFF',
                  marginBottom: '12px'
                }}>
                  Preferred design style?
                </label>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  {designStyles.map(style => (
                    <button
                      key={style}
                      onClick={() => handleInputChange('designStyle', style)}
                      style={{
                        padding: '12px 20px',
                        fontSize: '15px',
                        fontWeight: '600',
                        color: formData.designStyle === style ? '#FFFFFF' : 'rgba(255, 255, 255, 0.7)',
                        backgroundColor: formData.designStyle === style 
                          ? 'rgba(41, 189, 152, 0.2)' 
                          : 'rgba(255, 255, 255, 0.05)',
                        border: formData.designStyle === style 
                          ? '2px solid #29BD98' 
                          : '2px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '12px',
                        cursor: 'pointer'
                      }}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Auth Components (if Authentication add-on selected) */}
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
                  marginBottom: '12px',
                  fontWeight: '600'
                }}>
                  ✓ Authentication Add-on
                </div>
                <p style={{
                  fontSize: '15px',
                  color: 'rgba(255, 255, 255, 0.7)',
                  marginBottom: '0'
                }}>
                  We'll include Login, Signup, and Password Reset pages in your UI
                </p>
              </div>
            )}

            {/* Design Reference */}
            <div style={{ marginBottom: '32px' }}>
              <label style={{
                display: 'block',
                fontSize: '16px',
                fontWeight: '700',
                color: '#FFFFFF',
                marginBottom: '12px'
              }}>
                Any design inspiration or references? (Optional)
              </label>
              <textarea
                value={formData.designReference}
                onChange={(e) => handleInputChange('designReference', e.target.value)}
                placeholder="Links to designs you like, competitor sites, Figma files, etc..."
                rows={3}
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

            {/* Navigation */}
            <div style={{
              display: 'flex',
              gap: '16px',
              marginTop: '48px',
              justifyContent: 'space-between'
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
                    ? 'linear-gradient(135deg, #2497F9 0%, #29BD98 100%)'
                    : 'rgba(255, 255, 255, 0.1)',
                  border: 'none',
                  borderRadius: '16px',
                  cursor: isFormValid ? 'pointer' : 'not-allowed',
                  opacity: isFormValid ? 1 : 0.5
                }}
              >
                Continue to Step 3
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>

      <CartSummary />
    </div>
  );
};

export default FrontendStep2;
