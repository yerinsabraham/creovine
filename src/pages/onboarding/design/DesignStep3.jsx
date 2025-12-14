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

const DesignStep3 = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const { projectData, updatePhaseData, submitProject } = useProject();
  const { hasItem, cart } = useCart();
  const { location } = useLocation();
  const isMobile = useIsMobile();
  const handleMultiServiceComplete = useMultiServiceComplete('design');
  const isMultiService = useIsMultiService();

  // Check for add-ons
  const addOns = projectData?.addOns || [];
  const hasFrontend = addOns.some(a => a.id === 'frontend');

  const [formData, setFormData] = useState({
    deliverables: projectData?.design?.deliverables || [],
    designTool: projectData?.design?.designTool || '',
    includePrototype: projectData?.design?.includePrototype || false,
    includeDesignSystem: projectData?.design?.includeDesignSystem || false,
    timeline: projectData?.design?.timeline || { amount: 7, unit: 'days' },
    timelineMultiplier: projectData?.design?.timelineMultiplier || 1.0,
    iterations: projectData?.design?.iterations || '',
    additionalNotes: projectData?.design?.additionalNotes || ''
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

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const serviceData = { ...projectData?.design, ...formData };
      await updatePhaseData('design', serviceData);
      
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
  const isDeliverablesValid = formData.deliverables.length > 0;
  const isTimelineValid = formData.timeline && formData.timeline.amount > 0;
  const isFormValid = isDeliverablesValid && isTimelineValid;

  const deliverableOptions = [
    'High-fidelity mockups',
    'Wireframes',
    'User flow diagrams',
    'Style guide',
    'Icon set',
    'Illustrations',
    'Animations/Micro-interactions',
    'Responsive variations',
    'Component library'
  ];

  const designTools = [
    { id: 'figma', label: 'Figma' },
    { id: 'sketch', label: 'Sketch' },
    { id: 'xd', label: 'Adobe XD' },
    { id: 'any', label: 'Any tool' }
  ];

  const iterationOptions = [
    { id: '1', label: '1 round', desc: 'Quick turnaround' },
    { id: '2', label: '2 rounds', desc: 'Standard' },
    { id: '3', label: '3 rounds', desc: 'Comprehensive' },
    { id: 'unlimited', label: 'Unlimited', desc: 'Until satisfied' }
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
                backgroundColor: '#EC4899',
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
              Deliverables & Timeline
            </h1>
            <p style={{
              fontSize: isMobile ? '15px' : '18px',
              color: 'rgba(255, 255, 255, 0.7)',
              lineHeight: '1.6'
            }}>
              What do you need delivered and when?
            </p>
          </div>

          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            borderRadius: '24px',
            padding: isMobile ? '24px' : '40px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            {/* Deliverables */}
            <div style={{ marginBottom: '32px' }}>
              <label style={{
                display: 'block',
                fontSize: '16px',
                fontWeight: '700',
                color: '#FFFFFF',
                marginBottom: '12px'
              }}>
                What deliverables do you need? *
              </label>
              <ChipGroup
                options={deliverableOptions}
                selectedValues={formData.deliverables}
                onChange={(values) => handleInputChange('deliverables', values)}
                multiSelect={true}
              />
            </div>

            {/* Design Tool */}
            <div style={{ marginBottom: '32px' }}>
              <label style={{
                display: 'block',
                fontSize: '16px',
                fontWeight: '700',
                color: '#FFFFFF',
                marginBottom: '12px'
              }}>
                Preferred design tool (Optional)
              </label>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                {designTools.map(tool => (
                  <button
                    key={tool.id}
                    onClick={() => handleInputChange('designTool', tool.id)}
                    style={{
                      padding: '12px 24px',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: formData.designTool === tool.id ? '#FFFFFF' : 'rgba(255, 255, 255, 0.7)',
                      backgroundColor: formData.designTool === tool.id 
                        ? 'rgba(236, 72, 153, 0.2)' 
                        : 'rgba(255, 255, 255, 0.05)',
                      border: formData.designTool === tool.id 
                        ? '2px solid #EC4899' 
                        : '2px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    {tool.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Prototype & Design System */}
            <div style={{ marginBottom: '32px' }}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  cursor: 'pointer'
                }}>
                  <input
                    type="checkbox"
                    checked={formData.includePrototype}
                    onChange={(e) => handleInputChange('includePrototype', e.target.checked)}
                    style={{
                      width: '20px',
                      height: '20px',
                      cursor: 'pointer'
                    }}
                  />
                  <span style={{ fontSize: '16px', color: '#FFFFFF' }}>
                    Include interactive prototype (clickable demo)
                  </span>
                </label>
              </div>
              <div>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  cursor: 'pointer'
                }}>
                  <input
                    type="checkbox"
                    checked={formData.includeDesignSystem}
                    onChange={(e) => handleInputChange('includeDesignSystem', e.target.checked)}
                    style={{
                      width: '20px',
                      height: '20px',
                      cursor: 'pointer'
                    }}
                  />
                  <span style={{ fontSize: '16px', color: '#FFFFFF' }}>
                    Include design system (reusable components)
                  </span>
                </label>
              </div>
            </div>

            {/* Timeline */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                fontSize: '16px',
                fontWeight: '700',
                color: '#FFFFFF',
                marginBottom: '12px'
              }}>
                When do you need this? *
              </label>
            </div>
            <TimelineSelector
              value={formData.timeline}
              onChange={(timelineData) => {
                setFormData(prev => ({
                  ...prev,
                  timeline: timelineData,
                  timelineMultiplier: timelineData.priceMultiplier
                }));
              }}
              serviceComplexity="medium"
              showPriceImpact={true}
              style={{ marginBottom: '32px' }}
            />

            {/* Iterations */}
            <div style={{ marginBottom: '32px' }}>
              <label style={{
                display: 'block',
                fontSize: '16px',
                fontWeight: '700',
                color: '#FFFFFF',
                marginBottom: '12px'
              }}>
                Revision rounds (Optional)
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)', gap: '12px' }}>
                {iterationOptions.map(option => (
                  <button
                    key={option.id}
                    onClick={() => handleInputChange('iterations', option.id)}
                    style={{
                      padding: '14px',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: formData.iterations === option.id ? '#FFFFFF' : 'rgba(255, 255, 255, 0.7)',
                      backgroundColor: formData.iterations === option.id 
                        ? 'rgba(236, 72, 153, 0.2)' 
                        : 'rgba(255, 255, 255, 0.05)',
                      border: formData.iterations === option.id 
                        ? '2px solid #EC4899' 
                        : '2px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      textAlign: 'center'
                    }}
                  >
                    <div style={{ marginBottom: '2px' }}>{option.label}</div>
                    <div style={{ fontSize: '11px', fontWeight: '400', color: 'rgba(255, 255, 255, 0.5)' }}>
                      {option.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Frontend Add-on Indicator */}
            {hasFrontend && (
              <div style={{
                marginBottom: '32px',
                padding: '16px 20px',
                backgroundColor: 'rgba(236, 72, 153, 0.05)',
                border: '1px solid rgba(236, 72, 153, 0.2)',
                borderRadius: '16px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '20px' }}>✓</span>
                  <div>
                    <div style={{ fontWeight: '600', color: '#FFFFFF', marginBottom: '4px' }}>
                      Frontend Development Add-on Selected
                    </div>
                    <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.7)' }}>
                      Your designs will be converted to production-ready code
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Support */}
            <AssistedToggle
              id="design-support"
              category="UI/UX Design"
              label="Need ongoing design support?"
              price={100}
              assistedLabel="Add support"
              tooltipText="Get 30 days of design revisions, new screen additions, and design consultation."
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
                onClick={() => navigate('/onboarding/design/step2')}
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
                    ? 'linear-gradient(135deg, #EC4899 0%, #DB2777 100%)'
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

export default DesignStep3;
