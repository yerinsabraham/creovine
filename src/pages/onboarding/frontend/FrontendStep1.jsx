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

const FrontendStep1 = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const { projectData, updatePhaseData } = useProject();
  const { hasItem, addItem, removeItem, items } = useCart();
  const isMobile = useIsMobile();

  // Check for add-ons
  const addOns = projectData?.addOns || [];
  const hasUIDesign = addOns.some(a => a.id === 'ui-design');
  const hasAPIIntegration = addOns.some(a => a.id === 'api-integration');
  const hasAuthentication = addOns.some(a => a.id === 'authentication');

  const [formData, setFormData] = useState({
    projectType: projectData?.frontend?.projectType || '', // new or existing
    framework: projectData?.frontend?.framework || '',
    currentState: projectData?.frontend?.currentState || '',
    repositoryUrl: projectData?.frontend?.repositoryUrl || '',
    description: projectData?.frontend?.description || ''
  });

  const [frameworkConsultation, setFrameworkConsultation] = useState(
    items?.some(item => item.id === 'framework-consultation') || false
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (frameworkConsultation) {
      addItem({
        id: 'framework-consultation',
        name: 'Framework Consultation',
        description: 'Expert recommendation on the best framework for your project',
        price: 15,
        category: 'Frontend Development'
      });
    } else {
      removeItem('framework-consultation');
    }
  }, [frameworkConsultation, addItem, removeItem]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveAndExit = async () => {
    // Save current progress as draft with current step
    await updatePhaseData('frontend', { ...formData, currentStep: 1 });
    // Navigate to dashboard
    navigate('/dashboard');
  };

  const handleContinue = async () => {
    await updatePhaseData('frontend', formData);
    navigate('/onboarding/frontend/step2');
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
  const isTypeValid = formData.projectType.trim();
  const isFrameworkValid = formData.framework.trim() || frameworkConsultation;
  const isDescriptionValid = formData.description.trim() || hasItem('project-scope-assist');
  
  const isFormValid = isTypeValid && isFrameworkValid && isDescriptionValid;

  const frameworks = [
    'React',
    'Vue.js',
    'Angular',
    'Next.js',
    'Nuxt.js',
    'Svelte',
    'Vanilla JavaScript',
    'TypeScript',
    'Other'
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
                backgroundColor: step === 1 
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
          Step 1 of 4
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
              Frontend Project Overview
            </h1>
            <p style={{
              fontSize: isMobile ? '15px' : '18px',
              color: 'rgba(255, 255, 255, 0.7)',
              lineHeight: '1.6'
            }}>
              Tell us about your frontend development needs
            </p>

            {/* Add-ons indicator */}
            {addOns.length > 0 && (
              <div style={{
                marginTop: '16px',
                padding: '12px 16px',
                backgroundColor: 'rgba(41, 189, 152, 0.1)',
                border: '1px solid rgba(41, 189, 152, 0.3)',
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
            {/* Project Type */}
            <div style={{ marginBottom: '32px' }}>
              <label style={{
                display: 'block',
                fontSize: '16px',
                fontWeight: '700',
                color: '#FFFFFF',
                marginBottom: '12px'
              }}>
                Is this a new or existing project? *
              </label>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                {['New project from scratch', 'Existing project'].map(type => (
                  <button
                    key={type}
                    onClick={() => handleInputChange('projectType', type)}
                    style={{
                      padding: '14px 24px',
                      fontSize: '15px',
                      fontWeight: '600',
                      color: formData.projectType === type ? '#FFFFFF' : 'rgba(255, 255, 255, 0.7)',
                      backgroundColor: formData.projectType === type 
                        ? 'rgba(36, 151, 249, 0.2)' 
                        : 'rgba(255, 255, 255, 0.05)',
                      border: formData.projectType === type 
                        ? '2px solid #2497F9' 
                        : '2px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Framework Selection */}
            <div style={{ marginBottom: '32px' }}>
              <label style={{
                display: 'block',
                fontSize: '16px',
                fontWeight: '700',
                color: '#FFFFFF',
                marginBottom: '12px'
              }}>
                What framework/library do you prefer? *
              </label>

              {/* Use AssistedToggle with legacy pattern */}
              <AssistedToggle
                id="framework-consultation"
                category="Frontend Development"
                label="What framework/library do you prefer?"
                assistedLabel="Help me choose the best framework"
                tooltipText="Not sure which framework to use? Our experts will analyze your project requirements and recommend the most suitable framework for your needs."
                price={15}
                defaultEnabled={frameworkConsultation}
                onChange={(isAssisted) => setFrameworkConsultation(isAssisted)}
                theme="dark"
              />

              {/* Only show framework selection if they chose 'I will provide' */}
              {!frameworkConsultation && (
                <select
                  value={formData.framework}
                  onChange={(e) => handleInputChange('framework', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '16px 20px',
                    fontSize: '16px',
                    color: formData.framework ? '#FFFFFF' : 'rgba(255, 255, 255, 0.5)',
                    backgroundColor: '#15293A',
                    border: '2px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '16px',
                    outline: 'none',
                    cursor: 'pointer',
                    fontFamily: 'inherit'
                  }}
                >
                  <option value="" disabled>Select framework...</option>
                  {frameworks.map(fw => (
                    <option key={fw} value={fw} style={{ color: '#000' }}>
                      {fw}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Current State (for existing projects) */}
            {formData.projectType === 'Existing project' && (
              <div style={{ marginBottom: '32px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '16px',
                  fontWeight: '700',
                  color: '#FFFFFF',
                  marginBottom: '12px'
                }}>
                  Describe the current state (Optional)
                </label>
                <textarea
                  value={formData.currentState}
                  onChange={(e) => handleInputChange('currentState', e.target.value)}
                  placeholder="What's already built? What needs work?"
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
            )}

            {/* Repository URL (for existing projects) */}
            {formData.projectType === 'Existing project' && (
              <div style={{ marginBottom: '32px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '16px',
                  fontWeight: '700',
                  color: '#FFFFFF',
                  marginBottom: '12px'
                }}>
                  Repository URL (Optional)
                </label>
                <input
                  type="text"
                  value={formData.repositoryUrl}
                  onChange={(e) => handleInputChange('repositoryUrl', e.target.value)}
                  placeholder="https://github.com/username/repo"
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

            {/* Project Description */}
            <AssistedToggle
              id="project-scope-assist"
              category="Frontend"
              label="Need help defining the project scope?"
              price={25}
              assistedLabel="Brainstorm with me"
              tooltipText="We'll help you articulate what you're building and what features you need."
            />

            {!hasItem('project-scope-assist') && (
              <div style={{ marginBottom: '32px', marginTop: '24px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '16px',
                  fontWeight: '700',
                  color: '#FFFFFF',
                  marginBottom: '12px'
                }}>
                  What do you want built? *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe what you need... e.g., 'A dashboard with charts and tables' or 'Add a new checkout flow to existing app'"
                  rows={5}
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
            )}

            {/* Navigation */}
            <div style={{
              display: 'flex',
              gap: isMobile ? '12px' : '16px',
              marginTop: '48px',
              justifyContent: 'space-between',
              flexWrap: isMobile ? 'wrap' : 'nowrap'
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

              <div style={{ 
                display: 'flex', 
                gap: isMobile ? '8px' : '12px',
                flex: 1,
                justifyContent: 'flex-end',
                flexWrap: isMobile ? 'wrap' : 'nowrap'
              }}>
                {/* Save & Continue Later */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSaveAndExit}
                  style={{
                    padding: isMobile ? '14px 20px' : '16px 32px',
                    fontSize: isMobile ? '14px' : '16px',
                    fontWeight: '600',
                    color: '#FFFFFF',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    border: '2px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: '16px',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  Save & Exit
                </motion.button>

                {/* Continue Button */}
                <motion.button
                  whileHover={{ scale: isFormValid ? 1.02 : 1 }}
                  whileTap={{ scale: isFormValid ? 0.98 : 1 }}
                  onClick={handleContinue}
                  disabled={!isFormValid}
                  style={{
                    padding: isMobile ? '14px 24px' : '16px 48px',
                    fontSize: isMobile ? '15px' : '16px',
                    fontWeight: '700',
                    color: '#FFFFFF',
                    background: isFormValid
                      ? 'linear-gradient(135deg, #2497F9 0%, #29BD98 100%)'
                      : 'rgba(255, 255, 255, 0.1)',
                    border: 'none',
                    borderRadius: '16px',
                    cursor: isFormValid ? 'pointer' : 'not-allowed',
                    opacity: isFormValid ? 1 : 0.5,
                    whiteSpace: 'nowrap'
                  }}
                >
                  Continue to Step 2
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <CartSummary />
    </div>
  );
};

export default FrontendStep1;
