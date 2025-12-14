import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useProject } from '../../../context/ProjectContext';
import { useCart } from '../../../context/CartContext';
import { useLocation } from '../../../context/LocationContext';
import { useIsMobile } from '../../../hooks/useMediaQuery';
import { useMultiServiceComplete, useIsMultiService } from '../../../hooks/useMultiService';
import AssistedToggle from '../../../components/common/AssistedToggle';
import CartSummary from '../../../components/common/CartSummary';
import ChipGroup from '../../../components/common/ChipGroup';
import TimelineSelector from '../../../components/common/TimelineSelector';
import ProjectEstimateModal from '../../../components/common/ProjectEstimateModal';
import { calculateProjectEstimate } from '../../../utils/pricingCalculator';
import logo from '../../../assets/logo.png';

const BackendStep4 = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const { projectData, updatePhaseData, submitProject } = useProject();
  const { hasItem, cart } = useCart();
  const { location } = useLocation();
  const isMobile = useIsMobile();
  const handleMultiServiceComplete = useMultiServiceComplete('backend');
  const isMultiService = useIsMultiService();

  const [formData, setFormData] = useState({
    hostingPreference: projectData?.backend?.hostingPreference || '',
    securityRequirements: projectData?.backend?.securityRequirements || [],
    scalingNeeds: projectData?.backend?.scalingNeeds || '',
    timeline: projectData?.backend?.timeline || { amount: 7, unit: 'days' },
    timelineMultiplier: projectData?.backend?.timelineMultiplier || 1.0,
    documentation: projectData?.backend?.documentation || false,
    testing: projectData?.backend?.testing || false,
    supportNeeds: projectData?.backend?.supportNeeds || ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showEstimateModal, setShowEstimateModal] = useState(false);
  const [estimate, setEstimate] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveAndExit = async () => {
    await updatePhaseData('backend', {
      ...projectData?.backend,
      ...formData,
      currentStep: 4
    });
    navigate('/dashboard');
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const serviceData = { ...projectData?.backend, ...formData };
      await updatePhaseData('backend', serviceData);
      
      if (isMultiService) {
        await handleMultiServiceComplete(serviceData);
      } else {
        // Calculate estimate for single-service mode
        const countryCode = location?.country || 'US';
        const timelineMultiplier = formData.timelineMultiplier || 1.0;
        const calculatedEstimate = calculateProjectEstimate(
          projectData,
          countryCode,
          timelineMultiplier,
          cart
        );
        setEstimate(calculatedEstimate);
        
        // Submit project
        await submitProject();
        
        // Block back button
        window.history.pushState(null, '', window.location.href);
        window.onpopstate = function() {
          window.history.pushState(null, '', window.location.href);
        };
        
        // Show estimate modal
        setShowEstimateModal(true);
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
  const isHostingValid = formData.hostingPreference;
  const isTimelineValid = formData.timeline && formData.timeline.amount > 0;
  const isFormValid = isHostingValid && isTimelineValid;

  const hostingOptions = [
    'AWS',
    'Google Cloud',
    'Azure',
    'DigitalOcean',
    'Heroku',
    'Vercel',
    'Railway',
    'Render',
    'Self-hosted',
    'Not sure'
  ];

  const securityOptions = [
    'Rate limiting',
    'Input validation',
    'SQL injection protection',
    'XSS protection',
    'CORS configuration',
    'JWT authentication',
    'API key management',
    'Data encryption',
    'Audit logging',
    'GDPR compliance'
  ];

  const scalingOptions = [
    'Small (< 1000 users)',
    'Medium (1K - 10K users)',
    'Large (10K - 100K users)',
    'Enterprise (100K+ users)',
    'Not sure yet'
  ];

  const timelineOptions = [
    '1-2 weeks',
    '2-4 weeks',
    '1-2 months',
    '2+ months',
    'Flexible'
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
          {[1, 2, 3, 4].map(step => (
            <div
              key={step}
              style={{
                flex: 1,
                height: '8px',
                backgroundColor: '#6366F1',
                borderRadius: '4px'
              }}
            />
          ))}
        </div>
        <div style={{ fontSize: isMobile ? '12px' : '14px', color: 'rgba(255, 255, 255, 0.6)', textAlign: 'right' }}>
          Step 4 of 4
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
              Deployment & Security
            </h1>
            <p style={{
              fontSize: isMobile ? '15px' : '18px',
              color: 'rgba(255, 255, 255, 0.7)',
              lineHeight: '1.6'
            }}>
              Final details for hosting, security, and timeline
            </p>
          </div>

          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            borderRadius: '24px',
            padding: isMobile ? '24px' : '40px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            {/* Hosting Preference */}
            <div style={{ marginBottom: '32px' }}>
              <label style={{
                display: 'block',
                fontSize: '16px',
                fontWeight: '700',
                color: '#FFFFFF',
                marginBottom: '12px'
              }}>
                Where do you want to host? *
              </label>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  {hostingOptions.map(option => (
                    <button
                      key={option}
                      onClick={() => handleInputChange('hostingPreference', option)}
                      style={{
                        padding: '12px 20px',
                        fontSize: '14px',
                        fontWeight: '600',
                        color: formData.hostingPreference === option ? '#FFFFFF' : 'rgba(255, 255, 255, 0.7)',
                        backgroundColor: formData.hostingPreference === option 
                          ? 'rgba(99, 102, 241, 0.2)' 
                          : 'rgba(255, 255, 255, 0.05)',
                        border: formData.hostingPreference === option 
                          ? '2px solid #6366F1' 
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

            {/* Security Requirements */}
            <div style={{ marginBottom: '32px' }}>
              <label style={{
                display: 'block',
                fontSize: '16px',
                fontWeight: '700',
                color: '#FFFFFF',
                marginBottom: '12px'
              }}>
                Security requirements (Optional)
              </label>
              <ChipGroup
                options={securityOptions}
                selectedValues={formData.securityRequirements}
                onChange={(values) => handleInputChange('securityRequirements', values)}
                multiSelect={true}
              />
            </div>

            {/* Scaling Needs */}
            <div style={{ marginBottom: '32px' }}>
              <label style={{
                display: 'block',
                fontSize: '16px',
                fontWeight: '700',
                color: '#FFFFFF',
                marginBottom: '12px'
              }}>
                Expected scale/traffic (Optional)
              </label>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                {scalingOptions.map(option => (
                  <button
                    key={option}
                    onClick={() => handleInputChange('scalingNeeds', option)}
                    style={{
                      padding: '12px 20px',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: formData.scalingNeeds === option ? '#FFFFFF' : 'rgba(255, 255, 255, 0.7)',
                      backgroundColor: formData.scalingNeeds === option 
                        ? 'rgba(99, 102, 241, 0.2)' 
                        : 'rgba(255, 255, 255, 0.05)',
                      border: formData.scalingNeeds === option 
                        ? '2px solid #6366F1' 
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

            {/* Timeline Selector */}
            <TimelineSelector
              value={formData.timeline}
              onChange={(timelineData) => {
                handleInputChange('timeline', timelineData);
                handleInputChange('timelineMultiplier', timelineData.priceMultiplier);
              }}
              serviceComplexity="medium"
              showPriceImpact={true}
              style={{ marginBottom: '32px' }}
            />

            {/* Documentation */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                cursor: 'pointer'
              }}>
                <input
                  type="checkbox"
                  checked={formData.documentation}
                  onChange={(e) => handleInputChange('documentation', e.target.checked)}
                  style={{
                    width: '20px',
                    height: '20px',
                    cursor: 'pointer'
                  }}
                />
                <span style={{ fontSize: '16px', color: '#FFFFFF' }}>
                  Include API documentation (Swagger/OpenAPI)
                </span>
              </label>
            </div>

            {/* Testing */}
            <div style={{ marginBottom: '32px' }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                cursor: 'pointer'
              }}>
                <input
                  type="checkbox"
                  checked={formData.testing}
                  onChange={(e) => handleInputChange('testing', e.target.checked)}
                  style={{
                    width: '20px',
                    height: '20px',
                    cursor: 'pointer'
                  }}
                />
                <span style={{ fontSize: '16px', color: '#FFFFFF' }}>
                  Include unit and integration tests
                </span>
              </label>
            </div>

            {/* Support Needs */}
            <AssistedToggle
              id="backend-support"
              category="Backend"
              label="Need ongoing support after delivery?"
              price={150}
              assistedLabel="Add support"
              tooltipText="Get 30 days of bug fixes, deployment support, and technical assistance after delivery."
            />

            <div style={{ marginBottom: '32px', marginTop: '24px' }}>
              <label style={{
                display: 'block',
                fontSize: '16px',
                fontWeight: '700',
                color: '#FFFFFF',
                marginBottom: '12px'
              }}>
                Any other requirements? (Optional)
              </label>
              <textarea
                value={formData.supportNeeds}
                onChange={(e) => handleInputChange('supportNeeds', e.target.value)}
                placeholder="Additional requirements, questions, or special considerations..."
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
              gap: '12px',
              marginTop: '48px',
              justifyContent: 'space-between',
              flexWrap: 'wrap'
            }}>
              <button
                onClick={() => navigate('/onboarding/backend/step3')}
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

              <div style={{ display: 'flex', gap: '12px', flex: 1, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSaveAndExit}
                  style={{
                    padding: isMobile ? '14px 24px' : '16px 32px',
                    fontSize: isMobile ? '15px' : '16px',
                    fontWeight: '600',
                    color: '#FFFFFF',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    border: '2px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: '16px',
                    cursor: 'pointer'
                  }}
                >
                  Save & Exit
                </motion.button>

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
                      ? 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)'
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
          </div>
        </motion.div>
      </div>

      <CartSummary />

      <ProjectEstimateModal
        isOpen={showEstimateModal}
        onClose={() => {
          setShowEstimateModal(false);
          navigate('/dashboard');
        }}
        estimate={estimate}
        projectData={projectData}
      />
    </div>
  );
};

export default BackendStep4;
