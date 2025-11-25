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

const LandingPageStep2 = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const { projectData, updatePhaseData } = useProject();
  const { hasItem } = useCart();
  const isMobile = useIsMobile();

  // Check for add-ons
  const addOns = projectData?.addOns || [];
  const hasUIDesign = addOns.some(a => a.id === 'ui-design');

  const [formData, setFormData] = useState({
    designStyle: projectData?.landingPage?.designStyle || '',
    colorScheme: projectData?.landingPage?.colorScheme || '',
    sections: projectData?.landingPage?.sections || [],
    animations: projectData?.landingPage?.animations || '',
    referenceUrls: projectData?.landingPage?.referenceUrls || '',
    brandAssets: projectData?.landingPage?.brandAssets || ''
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleContinue = async () => {
    await updatePhaseData('landingPage', {
      ...projectData?.landingPage,
      ...formData
    });
    navigate('/onboarding/landingpage/step3');
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
  const isStyleValid = formData.designStyle || hasItem('landing-design-assist');
  const isSectionsValid = formData.sections.length > 0 || hasItem('landing-design-assist');
  const isFormValid = isStyleValid && isSectionsValid;

  const designStyles = [
    { id: 'minimal', label: 'Minimal', desc: 'Clean, lots of whitespace' },
    { id: 'bold', label: 'Bold & Modern', desc: 'Strong colors, big typography' },
    { id: 'corporate', label: 'Corporate', desc: 'Professional, trustworthy' },
    { id: 'playful', label: 'Playful', desc: 'Fun, colorful, animated' },
    { id: 'dark', label: 'Dark Mode', desc: 'Dark background, modern feel' },
    { id: 'gradient', label: 'Gradient Heavy', desc: 'Colorful gradients throughout' }
  ];

  const sectionOptions = [
    'Hero with CTA',
    'Features/Benefits',
    'How it Works',
    'Testimonials',
    'Pricing',
    'FAQ',
    'About/Team',
    'Newsletter Signup',
    'Contact Form',
    'Footer',
    'Stats/Numbers',
    'Gallery/Screenshots',
    'Video Section',
    'Partners/Logos'
  ];

  const animationOptions = [
    { id: 'none', label: 'None', desc: 'Static page' },
    { id: 'subtle', label: 'Subtle', desc: 'Fade-ins on scroll' },
    { id: 'moderate', label: 'Moderate', desc: 'Slide-ins, hover effects' },
    { id: 'heavy', label: 'Heavy', desc: 'Complex animations throughout' }
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
                backgroundColor: step <= 2 ? '#F59E0B' : 'rgba(255, 255, 255, 0.1)',
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
              Design & Structure
            </h1>
            <p style={{
              fontSize: isMobile ? '15px' : '18px',
              color: 'rgba(255, 255, 255, 0.7)',
              lineHeight: '1.6'
            }}>
              Define the look and sections of your landing page
            </p>
          </div>

          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            borderRadius: '24px',
            padding: isMobile ? '24px' : '40px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            {/* UI Design Add-on Indicator */}
            {hasUIDesign && (
              <div style={{
                marginBottom: '32px',
                padding: '16px 20px',
                backgroundColor: 'rgba(245, 158, 11, 0.05)',
                border: '1px solid rgba(245, 158, 11, 0.2)',
                borderRadius: '16px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '20px' }}>✓</span>
                  <div>
                    <div style={{ fontWeight: '600', color: '#FFFFFF', marginBottom: '4px' }}>
                      UI/UX Design Add-on Selected
                    </div>
                    <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.7)' }}>
                      Our designers will create custom mockups based on your preferences
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Design Assist */}
            <AssistedToggle
              id="landing-design-assist"
              category="Landing Page"
              label="Need help with design decisions?"
              price={35}
              assistedLabel="Design for me"
              tooltipText="We'll create a design based on your brand and industry best practices."
            />

            {!hasItem('landing-design-assist') && (
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
                            ? 'rgba(245, 158, 11, 0.2)' 
                            : 'rgba(255, 255, 255, 0.05)',
                          border: formData.designStyle === style.id 
                            ? '2px solid #F59E0B' 
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

                {/* Sections */}
                <div style={{ marginBottom: '32px' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '16px',
                    fontWeight: '700',
                    color: '#FFFFFF',
                    marginBottom: '12px'
                  }}>
                    What sections do you need? *
                  </label>
                  <ChipGroup
                    options={sectionOptions}
                    selectedValues={formData.sections}
                    onChange={(values) => handleInputChange('sections', values)}
                    multiSelect={true}
                  />
                </div>
              </>
            )}

            {/* Color Scheme */}
            <div style={{ marginBottom: '32px' }}>
              <label style={{
                display: 'block',
                fontSize: '16px',
                fontWeight: '700',
                color: '#FFFFFF',
                marginBottom: '12px'
              }}>
                Color scheme preference (Optional)
              </label>
              <input
                type="text"
                value={formData.colorScheme}
                onChange={(e) => handleInputChange('colorScheme', e.target.value)}
                placeholder="e.g., Blue and white, Dark with accent orange, Pastel colors..."
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

            {/* Animations */}
            <div style={{ marginBottom: '32px' }}>
              <label style={{
                display: 'block',
                fontSize: '16px',
                fontWeight: '700',
                color: '#FFFFFF',
                marginBottom: '12px'
              }}>
                Animation level (Optional)
              </label>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                {animationOptions.map(option => (
                  <button
                    key={option.id}
                    onClick={() => handleInputChange('animations', option.id)}
                    style={{
                      padding: '12px 20px',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: formData.animations === option.id ? '#FFFFFF' : 'rgba(255, 255, 255, 0.7)',
                      backgroundColor: formData.animations === option.id 
                        ? 'rgba(245, 158, 11, 0.2)' 
                        : 'rgba(255, 255, 255, 0.05)',
                      border: formData.animations === option.id 
                        ? '2px solid #F59E0B' 
                        : '2px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
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
                Reference websites you like (Optional)
              </label>
              <textarea
                value={formData.referenceUrls}
                onChange={(e) => handleInputChange('referenceUrls', e.target.value)}
                placeholder="Paste URLs of landing pages you admire, one per line..."
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

            {/* Brand Assets (if they have existing brand) */}
            {projectData?.landingPage?.hasExistingBrand && (
              <div style={{ marginBottom: '32px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '16px',
                  fontWeight: '700',
                  color: '#FFFFFF',
                  marginBottom: '12px'
                }}>
                  Brand assets (link to files) (Optional)
                </label>
                <input
                  type="text"
                  value={formData.brandAssets}
                  onChange={(e) => handleInputChange('brandAssets', e.target.value)}
                  placeholder="e.g., Google Drive link, Dropbox link..."
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
            )}

            {/* Navigation */}
            <div style={{
              display: 'flex',
              gap: '16px',
              marginTop: '48px',
              justifyContent: 'space-between'
            }}>
              <button
                onClick={() => navigate('/onboarding/landingpage/step1')}
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
                    ? 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)'
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

export default LandingPageStep2;
