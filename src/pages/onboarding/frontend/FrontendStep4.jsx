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

const FrontendStep4 = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const { projectData, updatePhaseData, submitProject } = useProject();
  const { hasItem } = useCart();
  const isMobile = useIsMobile();
  const handleMultiServiceComplete = useMultiServiceComplete('frontend');
  const isMultiService = useIsMultiService();

  const [formData, setFormData] = useState({
    timeline: projectData?.frontend?.timeline || { amount: 7, unit: 'days' },
    timelineMultiplier: projectData?.frontend?.timelineMultiplier || 1.0,
    deliverableFormat: projectData?.frontend?.deliverableFormat || '',
    documentation: projectData?.frontend?.documentation || false,
    supportNeeds: projectData?.frontend?.supportNeeds || ''
  });

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      const serviceData = { ...projectData.frontend, ...formData };
      await updatePhaseData('frontend', serviceData);
      
      if (isMultiService) {
        // Multi-service mode: mark complete and navigate to next service or summary
        await handleMultiServiceComplete(serviceData);
      } else {
        // Single service mode: go to exciting submitted page
        navigate('/project-submitted');
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert('Error submitting project. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate('/onboarding/frontend/step3');
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
  const isFormatValid = formData.deliverableFormat.trim();
  
  const isFormValid = isTimelineValid && isFormatValid;

  const timelineOptions = [
    '1-2 weeks',
    '3-4 weeks',
    '1-2 months',
    '2-3 months',
    'Flexible'
  ];

  const formatOptions = [
    'Full source code + deployment',
    'Source code only',
    'Deployed app (hosted by you)',
    'Component library',
    'Code review + handoff'
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
                backgroundColor: '#2497F9',
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
              Delivery & Timeline
            </h1>
            <p style={{
              fontSize: isMobile ? '15px' : '18px',
              color: 'rgba(255, 255, 255, 0.7)',
              lineHeight: '1.6'
            }}>
              Final details about how and when you need this delivered
            </p>
          </div>

          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            borderRadius: '24px',
            padding: isMobile ? '24px' : '40px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
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

            {/* Deliverable Format */}
            <div style={{ marginBottom: '32px' }}>
              <label style={{
                display: 'block',
                fontSize: '16px',
                fontWeight: '700',
                color: '#FFFFFF',
                marginBottom: '12px'
              }}>
                How should we deliver this? *
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {formatOptions.map(option => (
                  <button
                    key={option}
                    onClick={() => handleInputChange('deliverableFormat', option)}
                    style={{
                      padding: '16px 20px',
                      fontSize: '15px',
                      fontWeight: '600',
                      color: formData.deliverableFormat === option ? '#FFFFFF' : 'rgba(255, 255, 255, 0.7)',
                      backgroundColor: formData.deliverableFormat === option 
                        ? 'rgba(36, 151, 249, 0.2)' 
                        : 'rgba(255, 255, 255, 0.05)',
                      border: formData.deliverableFormat === option 
                        ? '2px solid #2497F9' 
                        : '2px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      textAlign: 'left'
                    }}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {/* Documentation */}
            <div style={{ marginBottom: '32px' }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                cursor: 'pointer',
                padding: '16px 20px',
                backgroundColor: formData.documentation 
                  ? 'rgba(41, 189, 152, 0.1)' 
                  : 'rgba(255, 255, 255, 0.05)',
                border: formData.documentation 
                  ? '2px solid #29BD98' 
                  : '2px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                transition: 'all 0.2s ease'
              }}
              onClick={() => handleInputChange('documentation', !formData.documentation)}
              >
                <input
                  type="checkbox"
                  checked={formData.documentation}
                  onChange={() => {}}
                  style={{
                    width: '20px',
                    height: '20px',
                    cursor: 'pointer'
                  }}
                />
                <div>
                  <div style={{
                    fontSize: '16px',
                    fontWeight: '700',
                    color: '#FFFFFF',
                    marginBottom: '4px'
                  }}>
                    Include detailed documentation
                  </div>
                  <div style={{
                    fontSize: '14px',
                    color: 'rgba(255, 255, 255, 0.6)'
                  }}>
                    Setup guide, component docs, and code comments
                  </div>
                </div>
              </label>
            </div>

            {/* Support Needs */}
            <AssistedToggle
              id="frontend-support"
              category="Support"
              label="Need ongoing support after delivery?"
              price={100}
              assistedLabel="Add support package"
              tooltipText="Monthly support for bug fixes, updates, and questions after project delivery."
            />

            <div style={{ marginBottom: '32px', marginTop: '24px' }}>
              <label style={{
                display: 'block',
                fontSize: '16px',
                fontWeight: '700',
                color: '#FFFFFF',
                marginBottom: '12px'
              }}>
                Any other requirements or notes? (Optional)
              </label>
              <textarea
                value={formData.supportNeeds}
                onChange={(e) => handleInputChange('supportNeeds', e.target.value)}
                placeholder="Anything else we should know..."
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
                onClick={handleSubmit}
                disabled={!isFormValid || submitting}
                style={{
                  padding: isMobile ? '14px 32px' : '16px 48px',
                  fontSize: isMobile ? '15px' : '16px',
                  fontWeight: '700',
                  color: '#FFFFFF',
                  background: isFormValid && !submitting
                    ? 'linear-gradient(135deg, #29BD98 0%, #2497F9 100%)'
                    : 'rgba(255, 255, 255, 0.1)',
                  border: 'none',
                  borderRadius: '16px',
                  cursor: isFormValid && !submitting ? 'pointer' : 'not-allowed',
                  opacity: isFormValid && !submitting ? 1 : 0.5
                }}
              >
                {submitting ? 'Submitting...' : 'Submit Project'}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>

      <CartSummary />
    </div>
  );
};

export default FrontendStep4;
