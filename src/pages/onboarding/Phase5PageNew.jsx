import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useProject } from '../../context/ProjectContext';
import { useCart } from '../../context/CartContext';
import { useIsMobile } from '../../hooks/useMediaQuery';
import AssistedToggle from '../../components/common/AssistedToggle';
import CartSummary from '../../components/common/CartSummary';
import logo from '../../assets/logo.png';

const Phase5Page = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const { projectData, updatePhaseData, goToPhase } = useProject();
  const { hasItem } = useCart();
  const isMobile = useIsMobile();

  const [formData, setFormData] = useState({
    projectName: projectData?.identity?.projectName || '',
    tagline: projectData?.identity?.tagline || '',
    description: projectData?.identity?.description || '',
    primaryColor: projectData?.identity?.primaryColor || '#29BD98',
    secondaryColor: projectData?.identity?.secondaryColor || '#2497F9',
    designStyle: projectData?.identity?.designStyle || '',
    logoFile: null
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    goToPhase(5);
  }, []);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, logoFile: file }));
    }
  };

  const selectDesignStyle = (style) => {
    setFormData(prev => ({ ...prev, designStyle: style }));
  };

  const handleContinue = async () => {
    await updatePhaseData('identity', formData);
    navigate('/onboarding/phase6');
  };

  const handleBack = () => {
    navigate('/onboarding/phase4');
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Validation: field is valid if filled OR user has assisted option in cart
  const isNameValid = formData.projectName.trim() || hasItem('project-name-assistance');
  const isTaglineValid = formData.tagline.trim() || hasItem('tagline-assistance');
  
  const isFormValid = isNameValid && isTaglineValid;

  const designStyles = [
    { id: 'modern', label: 'Modern', icon: '✨', desc: 'Clean, minimal, contemporary' },
    { id: 'minimalist', label: 'Minimalist', icon: '⚪', desc: 'Simple, focused, elegant' },
    { id: 'playful', label: 'Playful', icon: '🎨', desc: 'Fun, colorful, energetic' },
    { id: 'professional', label: 'Professional', icon: '💼', desc: 'Corporate, serious, polished' },
    { id: 'creative', label: 'Creative', icon: '🎭', desc: 'Artistic, unique, bold' },
    { id: 'tech', label: 'Tech/Startup', icon: '🚀', desc: 'Innovative, dynamic, forward' }
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
                backgroundColor: phase <= 5 ? '#29BD98' : 'rgba(255, 255, 255, 0.1)',
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
          Phase 5 of 6
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
              Identity & Design
            </h1>
            <p style={{
              fontSize: isMobile ? '15px' : '18px',
              color: 'rgba(255, 255, 255, 0.7)',
              lineHeight: '1.6'
            }}>
              Now let's define your brand identity and visual style.
            </p>
          </div>

          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            borderRadius: '24px',
            padding: isMobile ? '24px' : '40px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            {/* Project Name */}
            <AssistedToggle
              id="project-name-assistance"
              category="Naming"
              label="Need help naming your app?"
              price={5}
              assistedLabel="Decide for me"
              tooltipText="We'll brainstorm creative, memorable names based on your app concept and suggest available domains."
            />

            {!hasItem('project-name-assistance') && (
              <div style={{ marginBottom: '32px', marginTop: '24px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '16px',
                  fontWeight: '700',
                  color: '#FFFFFF',
                  marginBottom: '12px'
                }}>
                  What's your app name? *
                </label>
                <input
                  type="text"
                  value={formData.projectName}
                  onChange={(e) => handleInputChange('projectName', e.target.value)}
                  placeholder="e.g., TaskFlow, ShopEasy, ConnectMe..."
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
              </div>
            )}

            {/* Tagline */}
            <AssistedToggle
              id="tagline-assistance"
              category="Naming"
              label="Need help writing your tagline?"
              price={5}
              assistedLabel="Write tagline for me"
              tooltipText="We'll craft a compelling tagline that captures your app's value proposition in a memorable way."
            />

            {!hasItem('tagline-assistance') && (
              <div style={{ marginBottom: '32px', marginTop: '24px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '16px',
                  fontWeight: '700',
                  color: '#FFFFFF',
                  marginBottom: '12px'
                }}>
                  What's your tagline? *
                </label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => handleInputChange('tagline', e.target.value)}
                  placeholder="e.g., 'Task management made simple' or 'Shop smarter, save more'"
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
              </div>
            )}

            {/* Description */}
            <div style={{ marginBottom: '32px', marginTop: '32px' }}>
              <label style={{
                display: 'block',
                fontSize: '16px',
                fontWeight: '700',
                color: '#FFFFFF',
                marginBottom: '12px'
              }}>
                Brief description (Optional)
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="A one or two sentence description of your app..."
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

            {/* Brand Colors */}
            <AssistedToggle
              id="colors-assistance"
              category="Design"
              label="Need help choosing brand colors?"
              price={10}
              assistedLabel="Design colors for me"
              tooltipText="We'll create a professional color palette that fits your brand personality and ensures accessibility."
            />

            {!hasItem('colors-assistance') && (
              <div style={{ marginBottom: '32px', marginTop: '24px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '16px',
                  fontWeight: '700',
                  color: '#FFFFFF',
                  marginBottom: '16px'
                }}>
                  Brand Colors
                </label>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
                  gap: '24px'
                }}>
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: 'rgba(255, 255, 255, 0.7)',
                      marginBottom: '8px'
                    }}>
                      Primary Color
                    </label>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <input
                        type="color"
                        value={formData.primaryColor}
                        onChange={(e) => handleInputChange('primaryColor', e.target.value)}
                        style={{
                          width: '64px',
                          height: '64px',
                          border: '3px solid rgba(255, 255, 255, 0.2)',
                          borderRadius: '16px',
                          cursor: 'pointer',
                          backgroundColor: 'transparent'
                        }}
                      />
                      <input
                        type="text"
                        value={formData.primaryColor}
                        onChange={(e) => handleInputChange('primaryColor', e.target.value)}
                        style={{
                          flex: 1,
                          padding: '12px 16px',
                          fontSize: '14px',
                          color: '#FFFFFF',
                          backgroundColor: '#15293A',
                          border: '2px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: '12px',
                          outline: 'none',
                          fontFamily: 'monospace',
                          textTransform: 'uppercase'
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: 'rgba(255, 255, 255, 0.7)',
                      marginBottom: '8px'
                    }}>
                      Secondary Color
                    </label>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <input
                        type="color"
                        value={formData.secondaryColor}
                        onChange={(e) => handleInputChange('secondaryColor', e.target.value)}
                        style={{
                          width: '64px',
                          height: '64px',
                          border: '3px solid rgba(255, 255, 255, 0.2)',
                          borderRadius: '16px',
                          cursor: 'pointer',
                          backgroundColor: 'transparent'
                        }}
                      />
                      <input
                        type="text"
                        value={formData.secondaryColor}
                        onChange={(e) => handleInputChange('secondaryColor', e.target.value)}
                        style={{
                          flex: 1,
                          padding: '12px 16px',
                          fontSize: '14px',
                          color: '#FFFFFF',
                          backgroundColor: '#15293A',
                          border: '2px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: '12px',
                          outline: 'none',
                          fontFamily: 'monospace',
                          textTransform: 'uppercase'
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Design Style */}
            <AssistedToggle
              id="design-style-assistance"
              category="Design"
              label="Need help choosing a design style?"
              price={15}
              assistedLabel="Choose style for me"
              tooltipText="We'll analyze your app type and target audience to recommend the perfect design direction."
            />

            {!hasItem('design-style-assistance') && (
              <div style={{ marginBottom: '32px', marginTop: '24px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '16px',
                  fontWeight: '700',
                  color: '#FFFFFF',
                  marginBottom: '16px'
                }}>
                  Choose a design style (Optional)
                </label>
                
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
                  gap: '12px'
                }}>
                  {designStyles.map(style => (
                    <motion.button
                      key={style.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => selectDesignStyle(style.id)}
                      style={{
                        padding: '16px',
                        textAlign: 'left',
                        color: formData.designStyle === style.id ? '#FFFFFF' : 'rgba(255, 255, 255, 0.7)',
                        background: formData.designStyle === style.id
                          ? 'linear-gradient(135deg, #29BD98 0%, #2497F9 100%)'
                          : 'rgba(255, 255, 255, 0.05)',
                        border: formData.designStyle === style.id
                          ? '2px solid transparent'
                          : '2px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '12px',
                        cursor: 'pointer'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                        <span style={{ fontSize: '24px' }}>{style.icon}</span>
                        <span style={{ fontSize: '16px', fontWeight: '700' }}>{style.label}</span>
                        {formData.designStyle === style.id && <span style={{ marginLeft: 'auto' }}>✓</span>}
                      </div>
                      <p style={{ fontSize: '13px', opacity: 0.8, margin: 0 }}>
                        {style.desc}
                      </p>
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Logo Upload */}
            <AssistedToggle
              id="logo-assistance"
              category="Design"
              label="Need a professional logo designed?"
              price={50}
              assistedLabel="Create logo for me"
              tooltipText="We'll design a custom logo for your app with multiple concepts and revisions included."
            />

            {!hasItem('logo-assistance') && (
              <div style={{ marginTop: '24px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '16px',
                  fontWeight: '700',
                  color: '#FFFFFF',
                  marginBottom: '12px'
                }}>
                  Logo (Optional)
                </label>
                <div style={{
                  border: '2px dashed rgba(255, 255, 255, 0.2)',
                  borderRadius: '16px',
                  padding: '32px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    style={{ display: 'none' }}
                    id="logo-upload"
                  />
                  <label htmlFor="logo-upload" style={{ cursor: 'pointer' }}>
                    <div style={{ fontSize: '48px', marginBottom: '12px' }}>📁</div>
                    <p style={{
                      fontSize: '14px',
                      color: 'rgba(255, 255, 255, 0.7)',
                      margin: 0
                    }}>
                      {formData.logoFile ? formData.logoFile.name : 'Click to upload your logo'}
                    </p>
                    <p style={{
                      fontSize: '12px',
                      color: 'rgba(255, 255, 255, 0.5)',
                      marginTop: '8px'
                    }}>
                      PNG, JPG, or SVG (Max 5MB)
                    </p>
                  </label>
                </div>
              </div>
            )}

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
                style={{
                  padding: isMobile ? '14px 32px' : '16px 48px',
                  fontSize: isMobile ? '15px' : '16px',
                  fontWeight: '700',
                  color: 'rgba(255, 255, 255, 0.9)',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '2px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '16px',
                  cursor: 'pointer'
                }}
              >
                ← Back
              </motion.button>

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
                    ? 'linear-gradient(135deg, #29BD98 0%, #2497F9 100%)'
                    : 'rgba(255, 255, 255, 0.1)',
                  border: 'none',
                  borderRadius: '16px',
                  cursor: isFormValid ? 'pointer' : 'not-allowed',
                  opacity: isFormValid ? 1 : 0.5
                }}
              >
                Continue to Phase 6 →
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>

      <CartSummary />
    </div>
  );
};

export default Phase5Page;
