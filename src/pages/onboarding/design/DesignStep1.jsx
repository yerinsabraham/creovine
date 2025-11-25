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

const DesignStep1 = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const { projectData, updatePhaseData } = useProject();
  const { hasItem } = useCart();
  const isMobile = useIsMobile();

  // Check for add-ons
  const addOns = projectData?.addOns || [];
  const hasFrontend = addOns.some(a => a.id === 'frontend');

  const [formData, setFormData] = useState({
    projectType: projectData?.design?.projectType || '',
    projectName: projectData?.design?.projectName || '',
    projectDescription: projectData?.design?.projectDescription || '',
    targetPlatform: projectData?.design?.targetPlatform || [],
    hasExistingDesign: projectData?.design?.hasExistingDesign || false,
    existingDesignLink: projectData?.design?.existingDesignLink || ''
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const togglePlatform = (platform) => {
    setFormData(prev => ({
      ...prev,
      targetPlatform: prev.targetPlatform.includes(platform)
        ? prev.targetPlatform.filter(p => p !== platform)
        : [...prev.targetPlatform, platform]
    }));
  };

  const handleContinue = async () => {
    await updatePhaseData('design', formData);
    navigate('/onboarding/design/step2');
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
  const isTypeValid = formData.projectType;
  const isNameValid = formData.projectName.trim();
  const isPlatformValid = formData.targetPlatform.length > 0;
  
  const isFormValid = isTypeValid && isNameValid && isPlatformValid;

  const projectTypes = [
    { id: 'app', label: 'Mobile App', desc: 'iOS/Android app design' },
    { id: 'web', label: 'Web Application', desc: 'Dashboard, SaaS, platform' },
    { id: 'landing', label: 'Landing Page', desc: 'Marketing or product page' },
    { id: 'website', label: 'Website', desc: 'Multi-page website' },
    { id: 'redesign', label: 'Redesign', desc: 'Improve existing design' },
    { id: 'design-system', label: 'Design System', desc: 'Components & guidelines' }
  ];

  const platforms = [
    'Mobile (iOS)',
    'Mobile (Android)',
    'Desktop Web',
    'Tablet',
    'Responsive (All)'
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
                backgroundColor: step === 1 ? '#EC4899' : 'rgba(255, 255, 255, 0.1)',
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
              Design Project Scope
            </h1>
            <p style={{
              fontSize: isMobile ? '15px' : '18px',
              color: 'rgba(255, 255, 255, 0.7)',
              lineHeight: '1.6'
            }}>
              Tell us about your UI/UX design needs
            </p>

            {/* Add-ons indicator */}
            {addOns.length > 0 && (
              <div style={{
                marginTop: '16px',
                padding: '12px 16px',
                backgroundColor: 'rgba(236, 72, 153, 0.1)',
                border: '1px solid rgba(236, 72, 153, 0.3)',
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
                What type of design do you need? *
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '12px' }}>
                {projectTypes.map(type => (
                  <button
                    key={type.id}
                    onClick={() => handleInputChange('projectType', type.id)}
                    style={{
                      padding: '16px',
                      fontSize: '15px',
                      fontWeight: '600',
                      color: formData.projectType === type.id ? '#FFFFFF' : 'rgba(255, 255, 255, 0.7)',
                      backgroundColor: formData.projectType === type.id 
                        ? 'rgba(236, 72, 153, 0.2)' 
                        : 'rgba(255, 255, 255, 0.05)',
                      border: formData.projectType === type.id 
                        ? '2px solid #EC4899' 
                        : '2px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    <div style={{ marginBottom: '4px' }}>{type.label}</div>
                    <div style={{ fontSize: '13px', fontWeight: '400', color: 'rgba(255, 255, 255, 0.5)' }}>
                      {type.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>

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
                placeholder="e.g., TaskFlow, FitnessPro, MyBrand"
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

            {/* Project Description */}
            <AssistedToggle
              id="design-scope-assist"
              category="UI/UX Design"
              label="Need help defining your design requirements?"
              price={30}
              assistedLabel="Scope with me"
              tooltipText="We'll analyze your product and recommend the best design approach and deliverables."
            />

            {!hasItem('design-scope-assist') && (
              <div style={{ marginBottom: '32px', marginTop: '24px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '16px',
                  fontWeight: '700',
                  color: '#FFFFFF',
                  marginBottom: '12px'
                }}>
                  Describe your project (Optional)
                </label>
                <textarea
                  value={formData.projectDescription}
                  onChange={(e) => handleInputChange('projectDescription', e.target.value)}
                  placeholder="What is your product about? What problem does it solve? Who uses it?"
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
            )}

            {/* Target Platform */}
            <div style={{ marginBottom: '32px' }}>
              <label style={{
                display: 'block',
                fontSize: '16px',
                fontWeight: '700',
                color: '#FFFFFF',
                marginBottom: '12px'
              }}>
                Target platform(s) *
              </label>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                {platforms.map(platform => (
                  <button
                    key={platform}
                    onClick={() => togglePlatform(platform)}
                    style={{
                      padding: '12px 20px',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: formData.targetPlatform.includes(platform) ? '#FFFFFF' : 'rgba(255, 255, 255, 0.7)',
                      backgroundColor: formData.targetPlatform.includes(platform) 
                        ? 'rgba(236, 72, 153, 0.2)' 
                        : 'rgba(255, 255, 255, 0.05)',
                      border: formData.targetPlatform.includes(platform) 
                        ? '2px solid #EC4899' 
                        : '2px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    {platform}
                  </button>
                ))}
              </div>
            </div>

            {/* Existing Design */}
            <div style={{ marginBottom: '32px' }}>
              <label style={{
                display: 'block',
                fontSize: '16px',
                fontWeight: '700',
                color: '#FFFFFF',
                marginBottom: '12px'
              }}>
                Do you have existing designs to build upon?
              </label>
              <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                {['Yes', 'No'].map(option => (
                  <button
                    key={option}
                    onClick={() => handleInputChange('hasExistingDesign', option === 'Yes')}
                    style={{
                      padding: '12px 24px',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: formData.hasExistingDesign === (option === 'Yes') ? '#FFFFFF' : 'rgba(255, 255, 255, 0.7)',
                      backgroundColor: formData.hasExistingDesign === (option === 'Yes') 
                        ? 'rgba(236, 72, 153, 0.2)' 
                        : 'rgba(255, 255, 255, 0.05)',
                      border: formData.hasExistingDesign === (option === 'Yes') 
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

              {formData.hasExistingDesign && (
                <input
                  type="text"
                  value={formData.existingDesignLink}
                  onChange={(e) => handleInputChange('existingDesignLink', e.target.value)}
                  placeholder="Link to existing design files (Figma, Sketch, etc.)"
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
              )}
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
                      Your designs will be implemented into working code
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
                    ? 'linear-gradient(135deg, #EC4899 0%, #DB2777 100%)'
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

export default DesignStep1;
