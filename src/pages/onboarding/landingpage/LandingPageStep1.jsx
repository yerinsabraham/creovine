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

const LandingPageStep1 = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const { projectData, updatePhaseData } = useProject();
  const { hasItem } = useCart();
  const isMobile = useIsMobile();

  // Check for add-ons
  const addOns = projectData?.addOns || [];
  const hasUIDesign = addOns.some(a => a.id === 'ui-design');

  const [formData, setFormData] = useState({
    projectName: projectData?.landingPage?.projectName || '',
    purpose: projectData?.landingPage?.purpose || '',
    targetAudience: projectData?.landingPage?.targetAudience || '',
    callToAction: projectData?.landingPage?.callToAction || '',
    hasExistingBrand: projectData?.landingPage?.hasExistingBrand || false
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleContinue = async () => {
    await updatePhaseData('landingPage', formData);
    navigate('/onboarding/landingpage/step2');
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
  const isNameValid = formData.projectName.trim();
  const isPurposeValid = formData.purpose || hasItem('landing-purpose-assist');
  const isAudienceValid = formData.targetAudience.trim() || hasItem('landing-purpose-assist');
  
  const isFormValid = isNameValid && isPurposeValid && isAudienceValid;

  const purposeOptions = [
    { id: 'launch', label: 'Product Launch', desc: 'Announce a new product or service' },
    { id: 'waitlist', label: 'Waitlist / Coming Soon', desc: 'Build anticipation and collect emails' },
    { id: 'sales', label: 'Sales / Lead Gen', desc: 'Convert visitors into customers' },
    { id: 'portfolio', label: 'Portfolio / Showcase', desc: 'Display work or services' },
    { id: 'event', label: 'Event', desc: 'Promote an event or conference' },
    { id: 'app-download', label: 'App Download', desc: 'Drive app store downloads' },
    { id: 'other', label: 'Other', desc: 'Custom landing page' }
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
                backgroundColor: step === 1 ? '#F59E0B' : 'rgba(255, 255, 255, 0.1)',
                borderRadius: '4px'
              }}
            />
          ))}
        </div>
        <div style={{ fontSize: isMobile ? '12px' : '14px', color: 'rgba(255, 255, 255, 0.6)', textAlign: 'right' }}>
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
          <div style={{ marginBottom: isMobile ? '32px' : '48px' }}>
            <h1 style={{
              fontSize: isMobile ? '28px' : '40px',
              fontWeight: '800',
              color: '#FFFFFF',
              marginBottom: '12px'
            }}>
              Landing Page Purpose
            </h1>
            <p style={{
              fontSize: isMobile ? '15px' : '18px',
              color: 'rgba(255, 255, 255, 0.7)',
              lineHeight: '1.6'
            }}>
              Tell us about your landing page goals
            </p>

            {/* Add-ons indicator */}
            {addOns.length > 0 && (
              <div style={{
                marginTop: '16px',
                padding: '12px 16px',
                backgroundColor: 'rgba(245, 158, 11, 0.1)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                borderRadius: '12px',
                fontSize: '14px',
                color: 'rgba(255, 255, 255, 0.8)'
              }}>
                <strong>Selected add-ons:</strong> {addOns.map(a => a.name).join(', ')}
              </div>
            )}
          </div>

          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            borderRadius: '24px',
            padding: isMobile ? '24px' : '40px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            {/* Project Name */}
            <div style={{ marginBottom: '32px' }}>
              <label style={{
                display: 'block',
                fontSize: '16px',
                fontWeight: '700',
                color: '#FFFFFF',
                marginBottom: '12px'
              }}>
                Project/Product Name *
              </label>
              <input
                type="text"
                value={formData.projectName}
                onChange={(e) => handleInputChange('projectName', e.target.value)}
                placeholder="e.g., TaskFlow, FitnessPro, CryptoWallet"
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

            {/* Purpose Assist */}
            <AssistedToggle
              id="landing-purpose-assist"
              category="Landing Page"
              label="Need help defining your landing page strategy?"
              price={25}
              assistedLabel="Strategize for me"
              tooltipText="We'll analyze your product/service and recommend the best landing page approach and messaging."
            />

            {!hasItem('landing-purpose-assist') && (
              <>
                {/* Purpose Selection */}
                <div style={{ marginBottom: '32px', marginTop: '24px' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '16px',
                    fontWeight: '700',
                    color: '#FFFFFF',
                    marginBottom: '12px'
                  }}>
                    What's the main purpose? *
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '12px' }}>
                    {purposeOptions.map(option => (
                      <button
                        key={option.id}
                        onClick={() => handleInputChange('purpose', option.id)}
                        style={{
                          padding: '16px',
                          fontSize: '15px',
                          fontWeight: '600',
                          color: formData.purpose === option.id ? '#FFFFFF' : 'rgba(255, 255, 255, 0.7)',
                          backgroundColor: formData.purpose === option.id 
                            ? 'rgba(245, 158, 11, 0.2)' 
                            : 'rgba(255, 255, 255, 0.05)',
                          border: formData.purpose === option.id 
                            ? '2px solid #F59E0B' 
                            : '2px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: '12px',
                          cursor: 'pointer',
                          textAlign: 'left'
                        }}
                      >
                        <div style={{ marginBottom: '4px' }}>{option.label}</div>
                        <div style={{ fontSize: '13px', fontWeight: '400', color: 'rgba(255, 255, 255, 0.5)' }}>
                          {option.desc}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Target Audience */}
                <div style={{ marginBottom: '32px' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '16px',
                    fontWeight: '700',
                    color: '#FFFFFF',
                    marginBottom: '12px'
                  }}>
                    Who is your target audience? *
                  </label>
                  <textarea
                    value={formData.targetAudience}
                    onChange={(e) => handleInputChange('targetAudience', e.target.value)}
                    placeholder="e.g., Fitness enthusiasts aged 25-40, small business owners, tech startups..."
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
              </>
            )}

            {/* Call to Action */}
            <div style={{ marginBottom: '32px' }}>
              <label style={{
                display: 'block',
                fontSize: '16px',
                fontWeight: '700',
                color: '#FFFFFF',
                marginBottom: '12px'
              }}>
                Primary Call to Action (Optional)
              </label>
              <input
                type="text"
                value={formData.callToAction}
                onChange={(e) => handleInputChange('callToAction', e.target.value)}
                placeholder="e.g., Sign up, Download now, Get started, Join waitlist..."
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

            {/* Existing Brand */}
            <div style={{ marginBottom: '32px' }}>
              <label style={{
                display: 'block',
                fontSize: '16px',
                fontWeight: '700',
                color: '#FFFFFF',
                marginBottom: '12px'
              }}>
                Do you have existing branding (logo, colors, fonts)?
              </label>
              <div style={{ display: 'flex', gap: '12px' }}>
                {['Yes', 'No'].map(option => (
                  <button
                    key={option}
                    onClick={() => handleInputChange('hasExistingBrand', option === 'Yes')}
                    style={{
                      padding: '12px 24px',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: formData.hasExistingBrand === (option === 'Yes') ? '#FFFFFF' : 'rgba(255, 255, 255, 0.7)',
                      backgroundColor: formData.hasExistingBrand === (option === 'Yes') 
                        ? 'rgba(245, 158, 11, 0.2)' 
                        : 'rgba(255, 255, 255, 0.05)',
                      border: formData.hasExistingBrand === (option === 'Yes') 
                        ? '2px solid #F59E0B' 
                        : '2px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {/* UI Design Add-on */}
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
                      Custom design work will be included for your landing page
                    </div>
                  </div>
                </div>
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
                onClick={() => navigate('/get-started')}
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
                Continue to Step 2
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>

      <CartSummary />
    </div>
  );
};

export default LandingPageStep1;
