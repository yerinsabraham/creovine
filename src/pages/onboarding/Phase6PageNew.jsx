import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useProject } from '../../context/ProjectContext';
import { useCart } from '../../context/CartContext';
import { useIsMobile } from '../../hooks/useMediaQuery';
import { useLocation } from '../../context/LocationContext';
import AssistedToggle from '../../components/common/AssistedToggle';
import CartSummary from '../../components/common/CartSummary';
import TimelineSelector from '../../components/common/TimelineSelector';
import ProjectEstimateModal from '../../components/common/ProjectEstimateModal';
import { calculateProjectEstimate } from '../../utils/pricingCalculator';
import logo from '../../assets/logo.png';

const Phase6Page = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const { projectData, updatePhaseData, submitProject, goToPhase } = useProject();
  const { hasItem } = useCart();
  const { location } = useLocation();
  const isMobile = useIsMobile();

  const [formData, setFormData] = useState({
    deploymentPlatform: projectData?.deployment?.deploymentPlatform || '',
    customDomain: projectData?.deployment?.customDomain || '',
    domainOwnership: projectData?.deployment?.domainOwnership || false,
    launchTimeline: projectData?.deployment?.launchTimeline || { amount: 7, unit: 'days' },
    timelineMultiplier: projectData?.deployment?.timelineMultiplier || 1.0,
    supportNeeds: projectData?.deployment?.supportNeeds || ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [showEstimateModal, setShowEstimateModal] = useState(false);
  const [estimate, setEstimate] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    goToPhase(6);
  }, []);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const selectPlatform = (platform) => {
    setFormData(prev => ({ ...prev, deploymentPlatform: platform }));
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      
      // Save the final phase data
      await updatePhaseData('deployment', formData);
      
      // Calculate estimate
      const countryCode = location?.country || 'US';
      const timelineMultiplier = formData.timelineMultiplier || 1.0;
      const calculatedEstimate = calculateProjectEstimate(projectData, countryCode, timelineMultiplier);
      setEstimate(calculatedEstimate);
      
      // Submit project to Firestore
      await submitProject();
      
      // Show the estimate modal
      setShowEstimateModal(true);
    } catch (error) {
      console.error('Submission error:', error);
      alert('Error submitting project. Please try again. Error: ' + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate('/onboarding/phase5');
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Validation: deployment platform and timeline must be selected
  const isPlatformValid = formData.deploymentPlatform.trim();
  const isTimelineValid = formData.launchTimeline && formData.launchTimeline.amount > 0;
  
  const isFormValid = isPlatformValid && isTimelineValid;

  const platformOptions = [
    { 
      id: 'firebase', 
      label: 'Firebase Hosting', 
      icon: '🔥',
      desc: 'Fast, secure hosting with CDN' 
    },
    { 
      id: 'vercel', 
      label: 'Vercel', 
      icon: '▲',
      desc: 'Best for Next.js, instant deployments' 
    },
    { 
      id: 'netlify', 
      label: 'Netlify', 
      icon: '🌐',
      desc: 'Simple, powerful, continuous deployment' 
    },
    { 
      id: 'aws', 
      label: 'AWS', 
      icon: '☁️',
      desc: 'Scalable cloud infrastructure' 
    },
    { 
      id: 'heroku', 
      label: 'Heroku', 
      icon: '💜',
      desc: 'Easy deployment, app-focused' 
    },
    { 
      id: 'custom', 
      label: 'Custom/VPS', 
      icon: '🖥️',
      desc: 'Full control, self-hosted' 
    }
  ];

  const timelineOptions = [
    'As soon as possible',
    'Within 1 week',
    'Within 2 weeks',
    'Within 1 month',
    'Flexible timeline'
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
          justifyContent: 'space-between'
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
      </header>

      {/* Progress Bar */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: isMobile ? '24px 20px' : '32px 40px'
      }}>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
          {[1, 2, 3, 4, 5, 6].map(phase => (
            <div
              key={phase}
              style={{
                flex: 1,
                height: '8px',
                backgroundColor: '#29BD98',
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
          Phase 6 of 6 - Final Step!
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
        >
          <div style={{ marginBottom: isMobile ? '32px' : '48px' }}>
            <h1 style={{
              fontSize: isMobile ? '28px' : '40px',
              fontWeight: '800',
              color: '#FFFFFF',
              marginBottom: '12px'
            }}>
              Deployment & Support
            </h1>
            <p style={{
              fontSize: isMobile ? '15px' : '18px',
              color: 'rgba(255, 255, 255, 0.7)',
              lineHeight: '1.6'
            }}>
              Almost done! Let's finalize deployment details and timeline.
            </p>
          </div>

          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            borderRadius: '24px',
            padding: isMobile ? '24px' : '40px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            {/* Deployment Platform */}
            <div style={{ marginBottom: '32px' }}>
              <label style={{
                display: 'block',
                fontSize: '16px',
                fontWeight: '700',
                color: '#FFFFFF',
                marginBottom: '16px'
              }}>
                Where would you like to deploy? *
              </label>
                
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
                  gap: '12px'
                }}>
                  {platformOptions.map(platform => (
                    <motion.button
                      key={platform.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => selectPlatform(platform.id)}
                      style={{
                        padding: '16px',
                        textAlign: 'left',
                        color: formData.deploymentPlatform === platform.id ? '#FFFFFF' : 'rgba(255, 255, 255, 0.7)',
                        background: formData.deploymentPlatform === platform.id
                          ? 'linear-gradient(135deg, #29BD98 0%, #2497F9 100%)'
                          : 'rgba(255, 255, 255, 0.05)',
                        border: formData.deploymentPlatform === platform.id
                          ? '2px solid transparent'
                          : '2px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '12px',
                        cursor: 'pointer'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                        <span style={{ fontSize: '24px' }}>{platform.icon}</span>
                        <span style={{ fontSize: '16px', fontWeight: '700' }}>{platform.label}</span>
                        {formData.deploymentPlatform === platform.id && <span style={{ marginLeft: 'auto' }}>✓</span>}
                      </div>
                      <p style={{ fontSize: '13px', opacity: 0.8, margin: 0 }}>
                        {platform.desc}
                      </p>
                    </motion.button>
                  ))}
                </div>
            </div>

            {/* Custom Domain */}
            <div style={{ marginBottom: '32px', marginTop: '32px' }}>
              <label style={{
                display: 'block',
                fontSize: '16px',
                fontWeight: '700',
                color: '#FFFFFF',
                marginBottom: '12px'
              }}>
                Do you have a custom domain? (Optional)
              </label>
              <input
                type="text"
                value={formData.customDomain}
                onChange={(e) => handleInputChange('customDomain', e.target.value)}
                placeholder="e.g., myapp.com"
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
              
              <div style={{ marginTop: '16px' }}>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  cursor: 'pointer',
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: '14px'
                }}>
                  <input
                    type="checkbox"
                    checked={formData.domainOwnership}
                    onChange={(e) => handleInputChange('domainOwnership', e.target.checked)}
                    style={{
                      width: '20px',
                      height: '20px',
                      cursor: 'pointer'
                    }}
                  />
                  I already own this domain
                </label>
              </div>
            </div>

            {/* Launch Timeline */}
            <div style={{ marginBottom: '32px' }}>
              <label style={{
                display: 'block',
                fontSize: '16px',
                fontWeight: '700',
                color: '#FFFFFF',
                marginBottom: '16px'
              }}>
                When do you need your app launched? *
              </label>
              <TimelineSelector
                value={formData.launchTimeline}
                onChange={(timelineData) => {
                  handleInputChange('launchTimeline', timelineData);
                  handleInputChange('timelineMultiplier', timelineData.priceMultiplier);
                }}
                serviceComplexity="complex"
                showPriceImpact={true}
              />
            </div>

            {/* Support Needs */}
            <div style={{ marginBottom: '32px' }}>
              <label style={{
                display: 'block',
                fontSize: '16px',
                fontWeight: '700',
                color: '#FFFFFF',
                marginBottom: '12px'
              }}>
                Any special requirements or questions? (Optional)
              </label>
              <textarea
                value={formData.supportNeeds}
                onChange={(e) => handleInputChange('supportNeeds', e.target.value)}
                placeholder="Let us know if you have any specific needs, questions, or concerns..."
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

            {/* Completion Message */}
            <div style={{
              padding: '24px',
              backgroundColor: 'rgba(41, 189, 152, 0.1)',
              borderRadius: '16px',
              border: '1px solid rgba(41, 189, 152, 0.3)',
              marginBottom: '32px'
            }}>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '700',
                color: '#29BD98',
                marginBottom: '12px'
              }}>
                🎉 You're all set!
              </h3>
              <p style={{
                fontSize: '14px',
                color: 'rgba(255, 255, 255, 0.8)',
                lineHeight: '1.6',
                margin: 0
              }}>
                Once you submit, our team will review your requirements and get back to you within 24 hours with a detailed proposal and timeline.
              </p>
            </div>

            {/* Navigation */}
            <div style={{
              display: 'flex',
              gap: '16px',
              marginTop: '48px',
              justifyContent: 'space-between',
              flexWrap: 'wrap'
            }}>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleBack}
                disabled={submitting}
                style={{
                  padding: isMobile ? '14px 32px' : '16px 48px',
                  fontSize: isMobile ? '15px' : '16px',
                  fontWeight: '700',
                  color: 'rgba(255, 255, 255, 0.9)',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '2px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '16px',
                  cursor: submitting ? 'not-allowed' : 'pointer',
                  opacity: submitting ? 0.5 : 1
                }}
              >
                ← Back
              </motion.button>

              <motion.button
                whileHover={{ scale: isFormValid && !submitting ? 1.02 : 1 }}
                whileTap={{ scale: isFormValid && !submitting ? 0.98 : 1 }}
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
                  opacity: isFormValid && !submitting ? 1 : 0.5,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                {submitting ? (
                  <>
                    <span>Submitting...</span>
                    <span style={{ animation: 'spin 1s linear infinite' }}>⏳</span>
                  </>
                ) : (
                  <>Submit Project 🚀</>
                )}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>

      <CartSummary />

      {/* Estimate Modal */}
      <ProjectEstimateModal
        isOpen={showEstimateModal}
        estimate={estimate}
        onClose={() => setShowEstimateModal(false)}
        serviceName="Full-Stack App"
      />
    </div>
  );
};

export default Phase6Page;
