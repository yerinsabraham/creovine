import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useProject } from '../../../context/ProjectContext';
import { useCart } from '../../../context/CartContext';
import { useIsMobile } from '../../../hooks/useMediaQuery';
import { useMultiServiceComplete, useIsMultiService } from '../../../hooks/useMultiService';
import AssistedToggle from '../../../components/common/AssistedToggle';
import CartSummary from '../../../components/common/CartSummary';
import TimelineSelector from '../../../components/common/TimelineSelector';
import logo from '../../../assets/logo.png';

const LandingPageStep3 = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const { projectData, updatePhaseData, submitProject } = useProject();
  const { hasItem } = useCart();
  const isMobile = useIsMobile();
  const handleMultiServiceComplete = useMultiServiceComplete('landing-page');
  const isMultiService = useIsMultiService();

  const [formData, setFormData] = useState({
    headline: projectData?.landingPage?.headline || '',
    subheadline: projectData?.landingPage?.subheadline || '',
    keyFeatures: projectData?.landingPage?.keyFeatures || '',
    socialProof: projectData?.landingPage?.socialProof || '',
    timeline: projectData?.landingPage?.timeline || { amount: 3, unit: 'days' },
    timelineMultiplier: projectData?.landingPage?.timelineMultiplier || 1.0,
    deliveryFormat: projectData?.landingPage?.deliveryFormat || '',
    hostingHelp: projectData?.landingPage?.hostingHelp || false,
    additionalNotes: projectData?.landingPage?.additionalNotes || ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const serviceData = { ...projectData?.landingPage, ...formData };
      await updatePhaseData('landingPage', serviceData);
      
      if (isMultiService) {
        await handleMultiServiceComplete(serviceData);
      } else {
        navigate('/project-submitted');
      }
    } catch (error) {
      console.error('Submit error:', error);
      setIsSubmitting(false);
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

  // Validation
  const isTimelineValid = formData.timeline && formData.timeline.amount > 0;
  const isFormValid = isTimelineValid;

  const timelineOptions = [
    '3-5 days',
    '1 week',
    '2 weeks',
    'Flexible'
  ];

  const deliveryOptions = [
    { id: 'code', label: 'Source Code', desc: 'HTML/CSS/JS files' },
    { id: 'react', label: 'React/Next.js', desc: 'Component-based code' },
    { id: 'deployed', label: 'Deployed', desc: 'Live on a URL' },
    { id: 'both', label: 'Code + Deployed', desc: 'Everything included' }
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
                backgroundColor: '#F59E0B',
                borderRadius: '4px'
              }}
            />
          ))}
        </div>
        <div style={{ fontSize: isMobile ? '12px' : '14px', color: 'rgba(255, 255, 255, 0.6)', textAlign: 'right' }}>
          Step 3 of 3
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
              Content & Delivery
            </h1>
            <p style={{
              fontSize: isMobile ? '15px' : '18px',
              color: 'rgba(255, 255, 255, 0.7)',
              lineHeight: '1.6'
            }}>
              Provide your content and delivery preferences
            </p>
          </div>

          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            borderRadius: '24px',
            padding: isMobile ? '24px' : '40px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            {/* Content Assist */}
            <AssistedToggle
              id="landing-content-assist"
              category="Landing Page"
              label="Need help writing compelling copy?"
              price={40}
              assistedLabel="Write for me"
              tooltipText="Our copywriters will create conversion-optimized headlines and content for your landing page."
            />

            {!hasItem('landing-content-assist') && (
              <>
                {/* Headline */}
                <div style={{ marginBottom: '32px', marginTop: '24px' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '16px',
                    fontWeight: '700',
                    color: '#FFFFFF',
                    marginBottom: '12px'
                  }}>
                    Main Headline (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.headline}
                    onChange={(e) => handleInputChange('headline', e.target.value)}
                    placeholder="e.g., 'Build Your Dream App in Minutes'"
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

                {/* Subheadline */}
                <div style={{ marginBottom: '32px' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '16px',
                    fontWeight: '700',
                    color: '#FFFFFF',
                    marginBottom: '12px'
                  }}>
                    Subheadline (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.subheadline}
                    onChange={(e) => handleInputChange('subheadline', e.target.value)}
                    placeholder="e.g., 'The all-in-one platform for entrepreneurs'"
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

                {/* Key Features */}
                <div style={{ marginBottom: '32px' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '16px',
                    fontWeight: '700',
                    color: '#FFFFFF',
                    marginBottom: '12px'
                  }}>
                    Key features/benefits to highlight (Optional)
                  </label>
                  <textarea
                    value={formData.keyFeatures}
                    onChange={(e) => handleInputChange('keyFeatures', e.target.value)}
                    placeholder="List 3-5 key features or benefits, one per line..."
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

                {/* Social Proof */}
                <div style={{ marginBottom: '32px' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '16px',
                    fontWeight: '700',
                    color: '#FFFFFF',
                    marginBottom: '12px'
                  }}>
                    Testimonials or social proof (Optional)
                  </label>
                  <textarea
                    value={formData.socialProof}
                    onChange={(e) => handleInputChange('socialProof', e.target.value)}
                    placeholder="Any customer quotes, stats, or logos to include..."
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

            {/* Timeline Selector */}
            <TimelineSelector
              value={formData.timeline}
              onChange={(timelineData) => {
                handleInputChange('timeline', timelineData);
                handleInputChange('timelineMultiplier', timelineData.priceMultiplier);
              }}
              serviceComplexity="simple"
              showPriceImpact={true}
              style={{ marginBottom: '32px' }}
            />

            {/* Delivery Format */}
            <div style={{ marginBottom: '32px' }}>
              <label style={{
                display: 'block',
                fontSize: '16px',
                fontWeight: '700',
                color: '#FFFFFF',
                marginBottom: '12px'
              }}>
                Delivery format (Optional)
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '12px' }}>
                {deliveryOptions.map(option => (
                  <button
                    key={option.id}
                    onClick={() => handleInputChange('deliveryFormat', option.id)}
                    style={{
                      padding: '16px',
                      fontSize: '15px',
                      fontWeight: '600',
                      color: formData.deliveryFormat === option.id ? '#FFFFFF' : 'rgba(255, 255, 255, 0.7)',
                      backgroundColor: formData.deliveryFormat === option.id 
                        ? 'rgba(245, 158, 11, 0.2)' 
                        : 'rgba(255, 255, 255, 0.05)',
                      border: formData.deliveryFormat === option.id 
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

            {/* Hosting Help */}
            <div style={{ marginBottom: '32px' }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                cursor: 'pointer'
              }}>
                <input
                  type="checkbox"
                  checked={formData.hostingHelp}
                  onChange={(e) => handleInputChange('hostingHelp', e.target.checked)}
                  style={{
                    width: '20px',
                    height: '20px',
                    cursor: 'pointer'
                  }}
                />
                <span style={{ fontSize: '16px', color: '#FFFFFF' }}>
                  I need help setting up hosting/domain
                </span>
              </label>
            </div>

            {/* Support */}
            <AssistedToggle
              id="landing-support"
              category="Landing Page"
              label="Need post-delivery support?"
              price={75}
              assistedLabel="Add support"
              tooltipText="Get 14 days of revisions, bug fixes, and deployment support after delivery."
            />

            {/* Additional Notes */}
            <div style={{ marginBottom: '32px', marginTop: '24px' }}>
              <label style={{
                display: 'block',
                fontSize: '16px',
                fontWeight: '700',
                color: '#FFFFFF',
                marginBottom: '12px'
              }}>
                Anything else we should know? (Optional)
              </label>
              <textarea
                value={formData.additionalNotes}
                onChange={(e) => handleInputChange('additionalNotes', e.target.value)}
                placeholder="Any other details, special requirements, or questions..."
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

            {/* Navigation */}
            <div style={{
              display: 'flex',
              gap: '16px',
              marginTop: '48px',
              justifyContent: 'space-between'
            }}>
              <button
                onClick={() => navigate('/onboarding/landingpage/step2')}
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
                whileHover={{ scale: isFormValid && !isSubmitting ? 1.02 : 1 }}
                whileTap={{ scale: isFormValid && !isSubmitting ? 0.98 : 1 }}
                onClick={handleSubmit}
                disabled={!isFormValid || isSubmitting}
                style={{
                  padding: isMobile ? '14px 32px' : '16px 48px',
                  fontSize: isMobile ? '15px' : '16px',
                  fontWeight: '700',
                  color: '#FFFFFF',
                  background: isFormValid && !isSubmitting
                    ? 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)'
                    : 'rgba(255, 255, 255, 0.1)',
                  border: 'none',
                  borderRadius: '16px',
                  cursor: isFormValid && !isSubmitting ? 'pointer' : 'not-allowed',
                  opacity: isFormValid && !isSubmitting ? 1 : 0.5,
                  minWidth: '180px'
                }}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Project'}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>

      <CartSummary />
    </div>
  );
};

export default LandingPageStep3;
