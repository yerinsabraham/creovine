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

const DesignStep2 = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const { projectData, updatePhaseData } = useProject();
  const { hasItem } = useCart();
  const isMobile = useIsMobile();

  const [formData, setFormData] = useState({
    designStyle: projectData?.design?.designStyle || '',
    colorPreference: projectData?.design?.colorPreference || '',
    brandColors: projectData?.design?.brandColors || '',
    screensNeeded: projectData?.design?.screensNeeded || [],
    customScreens: projectData?.design?.customScreens || '',
    referenceUrls: projectData?.design?.referenceUrls || '',
    moodKeywords: projectData?.design?.moodKeywords || []
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleContinue = async () => {
    await updatePhaseData('design', {
      ...projectData?.design,
      ...formData
    });
    navigate('/onboarding/design/step3');
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
  const isStyleValid = formData.designStyle || hasItem('design-style-assist');
  const isScreensValid = formData.screensNeeded.length > 0 || hasItem('design-style-assist');
  const isFormValid = isStyleValid && isScreensValid;

  const designStyles = [
    { id: 'minimal', label: 'Minimal', desc: 'Clean, lots of whitespace, simple' },
    { id: 'modern', label: 'Modern', desc: 'Trendy, bold, cutting-edge' },
    { id: 'playful', label: 'Playful', desc: 'Fun, colorful, animated' },
    { id: 'corporate', label: 'Corporate', desc: 'Professional, trustworthy' },
    { id: 'luxury', label: 'Luxury', desc: 'Premium, elegant, refined' },
    { id: 'tech', label: 'Tech/Futuristic', desc: 'Dark, neon accents, sci-fi' }
  ];

  const commonScreens = [
    'Home/Dashboard',
    'Login/Signup',
    'Profile',
    'Settings',
    'Product List',
    'Product Detail',
    'Cart/Checkout',
    'Search',
    'Notifications',
    'Chat/Messages',
    'Onboarding',
    'Empty States',
    'Error Pages',
    'Loading States'
  ];

  const moodOptions = [
    'Friendly',
    'Professional',
    'Bold',
    'Elegant',
    'Youthful',
    'Trustworthy',
    'Innovative',
    'Calm',
    'Energetic',
    'Sophisticated'
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
            style={{ height: isMobile ? '28px' : '32px', cursor: 'pointer' }}
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
              <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.7)' }}>
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          {[1, 2, 3].map(step => (
            <div
              key={step}
              style={{
                flex: 1,
                height: '8px',
                backgroundColor: step <= 2 ? '#EC4899' : 'rgba(255, 255, 255, 0.1)',
                borderRadius: '4px'
              }}
            />
          ))}
        </div>
        <div style={{ fontSize: isMobile ? '12px' : '14px', color: 'rgba(255, 255, 255, 0.6)', textAlign: 'right' }}>
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
          <div style={{ marginBottom: isMobile ? '32px' : '48px' }}>
            <h1 style={{
              fontSize: isMobile ? '28px' : '40px',
              fontWeight: '800',
              color: '#FFFFFF',
              marginBottom: '12px'
            }}>
              Design Details
            </h1>
            <p style={{
              fontSize: isMobile ? '15px' : '18px',
              color: 'rgba(255, 255, 255, 0.7)',
              lineHeight: '1.6'
            }}>
              Define your visual style and screens
            </p>
          </div>

          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            borderRadius: '24px',
            padding: isMobile ? '24px' : '40px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            {/* Design Style Assist */}
            <AssistedToggle
              id="design-style-assist"
              category="UI/UX Design"
              label="Need help choosing a design direction?"
              price={40}
              assistedLabel="Style guide for me"
              tooltipText="We'll create a custom style guide based on your brand and target audience."
            />

            {!hasItem('design-style-assist') && (
              <>
                {/* Design Style */}
                <div style={{ marginBottom: '32px', marginTop: '24px' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '16px',
                    fontWeight: '700',
                    color: '#FFFFFF',
                    marginBottom: '12px'
                  }}>
                    What design style do you prefer? *
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '12px' }}>
                    {designStyles.map(style => (
                      <button
                        key={style.id}
                        onClick={() => handleInputChange('designStyle', style.id)}
                        style={{
                          padding: '16px',
                          fontSize: '15px',
                          fontWeight: '600',
                          color: formData.designStyle === style.id ? '#FFFFFF' : 'rgba(255, 255, 255, 0.7)',
                          backgroundColor: formData.designStyle === style.id 
                            ? 'rgba(236, 72, 153, 0.2)' 
                            : 'rgba(255, 255, 255, 0.05)',
                          border: formData.designStyle === style.id 
                            ? '2px solid #EC4899' 
                            : '2px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: '12px',
                          cursor: 'pointer',
                          textAlign: 'left'
                        }}
                      >
                        <div style={{ marginBottom: '4px' }}>{style.label}</div>
                        <div style={{ fontSize: '13px', fontWeight: '400', color: 'rgba(255, 255, 255, 0.5)' }}>
                          {style.desc}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Screens Needed */}
                <div style={{ marginBottom: '32px' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '16px',
                    fontWeight: '700',
                    color: '#FFFFFF',
                    marginBottom: '12px'
                  }}>
                    What screens do you need designed? *
                  </label>
                  <ChipGroup
                    options={commonScreens}
                    selectedValues={formData.screensNeeded}
                    onChange={(values) => handleInputChange('screensNeeded', values)}
                    multiSelect={true}
                  />
                  
                  <div style={{ marginTop: '16px' }}>
                    <input
                      type="text"
                      value={formData.customScreens}
                      onChange={(e) => handleInputChange('customScreens', e.target.value)}
                      placeholder="Other screens (comma-separated)..."
                      style={{
                        width: '100%',
                        padding: '16px 20px',
                        fontSize: '16px',
                        color: '#FFFFFF',
                        backgroundColor: '#15293A',
                        border: '2px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '16px',
                        outline: 'none',
                        fontFamily: 'inherit'
                      }}
                    />
                  </div>
                </div>

                {/* Mood Keywords */}
                <div style={{ marginBottom: '32px' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '16px',
                    fontWeight: '700',
                    color: '#FFFFFF',
                    marginBottom: '12px'
                  }}>
                    Words that describe your desired mood (Optional)
                  </label>
                  <ChipGroup
                    options={moodOptions}
                    selectedValues={formData.moodKeywords}
                    onChange={(values) => handleInputChange('moodKeywords', values)}
                    multiSelect={true}
                  />
                </div>
              </>
            )}

            {/* Color Preference */}
            <div style={{ marginBottom: '32px' }}>
              <label style={{
                display: 'block',
                fontSize: '16px',
                fontWeight: '700',
                color: '#FFFFFF',
                marginBottom: '12px'
              }}>
                Color preference (Optional)
              </label>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '16px' }}>
                {['Light theme', 'Dark theme', 'Both', 'No preference'].map(option => (
                  <button
                    key={option}
                    onClick={() => handleInputChange('colorPreference', option)}
                    style={{
                      padding: '12px 20px',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: formData.colorPreference === option ? '#FFFFFF' : 'rgba(255, 255, 255, 0.7)',
                      backgroundColor: formData.colorPreference === option 
                        ? 'rgba(236, 72, 153, 0.2)' 
                        : 'rgba(255, 255, 255, 0.05)',
                      border: formData.colorPreference === option 
                        ? '2px solid #EC4899' 
                        : '2px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    {option}
                  </button>
                ))}
              </div>
              <input
                type="text"
                value={formData.brandColors}
                onChange={(e) => handleInputChange('brandColors', e.target.value)}
                placeholder="Brand colors if you have them (e.g., #FF5733, Blue, etc.)"
                style={{
                  width: '100%',
                  padding: '16px 20px',
                  fontSize: '16px',
                  color: '#FFFFFF',
                  backgroundColor: '#15293A',
                  border: '2px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '16px',
                  outline: 'none',
                  fontFamily: 'inherit'
                }}
              />
            </div>

            {/* Reference URLs */}
            <div style={{ marginBottom: '32px' }}>
              <label style={{
                display: 'block',
                fontSize: '16px',
                fontWeight: '700',
                color: '#FFFFFF',
                marginBottom: '12px'
              }}>
                Design references you like (Optional)
              </label>
              <textarea
                value={formData.referenceUrls}
                onChange={(e) => handleInputChange('referenceUrls', e.target.value)}
                placeholder="Paste URLs of apps/websites you admire, or Dribbble/Behance links..."
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
                onClick={() => navigate('/onboarding/design/step1')}
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
                    ? 'linear-gradient(135deg, #EC4899 0%, #DB2777 100%)'
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

export default DesignStep2;
