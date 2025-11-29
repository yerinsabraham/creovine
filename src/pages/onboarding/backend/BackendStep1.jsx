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

const BackendStep1 = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const { projectData, updatePhaseData } = useProject();
  const { hasItem } = useCart();
  const isMobile = useIsMobile();

  // Check for add-ons
  const addOns = projectData?.addOns || [];
  const hasDatabase = addOns.some(a => a.id === 'database');
  const hasAuthentication = addOns.some(a => a.id === 'authentication');
  const hasPayment = addOns.some(a => a.id === 'payment');
  const hasAPIIntegration = addOns.some(a => a.id === 'api-integration');

  const [formData, setFormData] = useState({
    projectType: projectData?.backend?.projectType || '',
    techStack: projectData?.backend?.techStack || '',
    architecture: projectData?.backend?.architecture || '',
    currentState: projectData?.backend?.currentState || '',
    repositoryUrl: projectData?.backend?.repositoryUrl || '',
    description: projectData?.backend?.description || ''
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleContinue = async () => {
    await updatePhaseData('backend', formData);
    navigate('/onboarding/backend/step2');
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
  const isStackValid = formData.techStack.trim();
  const isDescriptionValid = formData.description.trim() || hasItem('backend-scope-assist');
  
  const isFormValid = isTypeValid && isStackValid && isDescriptionValid;

  const techStacks = [
    'Node.js (Express)',
    'Node.js (NestJS)',
    'Node.js (Fastify)',
    'Python (Django)',
    'Python (FastAPI)',
    'Python (Flask)',
    'Go',
    'Ruby on Rails',
    'Java (Spring Boot)',
    '.NET Core',
    'PHP (Laravel)',
    'Rust',
    'Other'
  ];

  const architectures = [
    'REST API',
    'GraphQL',
    'Microservices',
    'Serverless',
    'Monolithic',
    'Event-driven'
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
                backgroundColor: step === 1 ? '#6366F1' : 'rgba(255, 255, 255, 0.1)',
                borderRadius: '4px'
              }}
            />
          ))}
        </div>
        <div style={{ fontSize: isMobile ? '12px' : '14px', color: 'rgba(255, 255, 255, 0.6)', textAlign: 'right' }}>
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
          <div style={{ marginBottom: isMobile ? '32px' : '48px' }}>
            <h1 style={{
              fontSize: isMobile ? '28px' : '40px',
              fontWeight: '800',
              color: '#FFFFFF',
              marginBottom: '12px'
            }}>
              Backend Project Overview
            </h1>
            <p style={{
              fontSize: isMobile ? '15px' : '18px',
              color: 'rgba(255, 255, 255, 0.7)',
              lineHeight: '1.6'
            }}>
              Tell us about your backend development needs
            </p>

            {/* Add-ons indicator */}
            {addOns.length > 0 && (
              <div style={{
                marginTop: '16px',
                padding: '12px 16px',
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                border: '1px solid rgba(99, 102, 241, 0.3)',
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
                Is this a new or existing backend? *
              </label>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                {['New backend from scratch', 'Existing backend'].map(type => (
                  <button
                    key={type}
                    onClick={() => handleInputChange('projectType', type)}
                    style={{
                      padding: '14px 24px',
                      fontSize: '15px',
                      fontWeight: '600',
                      color: formData.projectType === type ? '#FFFFFF' : 'rgba(255, 255, 255, 0.7)',
                      backgroundColor: formData.projectType === type 
                        ? 'rgba(99, 102, 241, 0.2)' 
                        : 'rgba(255, 255, 255, 0.05)',
                      border: formData.projectType === type 
                        ? '2px solid #6366F1' 
                        : '2px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Tech Stack */}
            <div style={{ marginBottom: '32px' }}>
              <label style={{
                display: 'block',
                fontSize: '16px',
                fontWeight: '700',
                color: '#FFFFFF',
                marginBottom: '12px'
              }}>
                What tech stack do you prefer? *
              </label>
                <select
                  value={formData.techStack}
                  onChange={(e) => handleInputChange('techStack', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '16px 20px',
                    fontSize: '16px',
                    color: formData.techStack ? '#FFFFFF' : 'rgba(255, 255, 255, 0.5)',
                    backgroundColor: '#15293A',
                    border: '2px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '16px',
                    outline: 'none',
                    cursor: 'pointer',
                    fontFamily: 'inherit'
                  }}
                >
                  <option value="" disabled>Select tech stack...</option>
                  {techStacks.map(stack => (
                    <option key={stack} value={stack} style={{ color: '#000' }}>
                      {stack}
                    </option>
                  ))}
                </select>
            </div>

            {/* Architecture Style */}
            <div style={{ marginBottom: '32px' }}>
              <label style={{
                display: 'block',
                fontSize: '16px',
                fontWeight: '700',
                color: '#FFFFFF',
                marginBottom: '12px'
              }}>
                Architecture style preference (Optional)
              </label>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                {architectures.map(arch => (
                  <button
                    key={arch}
                    onClick={() => handleInputChange('architecture', arch)}
                    style={{
                      padding: '12px 20px',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: formData.architecture === arch ? '#FFFFFF' : 'rgba(255, 255, 255, 0.7)',
                      backgroundColor: formData.architecture === arch 
                        ? 'rgba(99, 102, 241, 0.2)' 
                        : 'rgba(255, 255, 255, 0.05)',
                      border: formData.architecture === arch 
                        ? '2px solid #6366F1' 
                        : '2px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    {arch}
                  </button>
                ))}
              </div>
            </div>

            {/* Current State (for existing projects) */}
            {formData.projectType === 'Existing backend' && (
              <>
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
              </>
            )}

            {/* Project Description */}
            <AssistedToggle
              id="backend-scope-assist"
              category="Backend"
              label="Need help defining the project scope?"
              price={30}
              assistedLabel="Brainstorm with me"
              tooltipText="We'll help you articulate what you're building and what APIs/services you need."
            />

            {!hasItem('backend-scope-assist') && (
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
                  placeholder="Describe what you need... e.g., 'API for user management and order processing' or 'Add payment webhooks to existing system'"
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
                    ? 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)'
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

export default BackendStep1;
