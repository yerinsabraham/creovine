import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useProject } from '../../context/ProjectContext';
import { useIsMobile } from '../../hooks/useMediaQuery';
import logo from '../../assets/logo.png';

const Phase1Page = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const { projectData, updateProjectData } = useProject();
  const isMobile = useIsMobile();

  const [formData, setFormData] = useState({
    projectName: projectData?.projectName || '',
    tagline: projectData?.tagline || '',
    description: projectData?.description || '',
    targetAudience: projectData?.targetAudience || '',
    primaryColor: projectData?.primaryColor || '#29BD98',
    secondaryColor: projectData?.secondaryColor || '#2497F9',
    logoFile: null
  });

  useEffect(() => {
    window.scrollTo(0, 0);
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

  const handleContinue = async () => {
    // Save data
    await updateProjectData(formData);
    // Navigate to next phase
    navigate('/onboarding/phase2');
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const isFormValid = formData.projectName.trim() && formData.tagline.trim() && formData.description.trim();

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
              width: 'auto',
              objectFit: 'contain',
              maxWidth: '140px',
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
            <div style={{
              fontSize: isMobile ? '12px' : '14px',
              color: 'rgba(255, 255, 255, 0.6)',
              fontWeight: '600'
            }}>
              Phase 1 of 6
            </div>
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: isMobile ? '6px 12px' : '8px 16px',
              backgroundColor: '#214055',
              borderRadius: '24px',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              {currentUser?.photoURL ? (
                <img
                  src={currentUser.photoURL}
                  alt="Profile"
                  style={{
                    width: isMobile ? '24px' : '32px',
                    height: isMobile ? '24px' : '32px',
                    borderRadius: '50%',
                    border: '2px solid #29BD98'
                  }}
                />
              ) : (
                <div style={{
                  width: isMobile ? '24px' : '32px',
                  height: isMobile ? '24px' : '32px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #29BD98 0%, #2497F9 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: isMobile ? '12px' : '14px',
                  fontWeight: '700',
                  color: '#FFFFFF'
                }}>
                  {currentUser?.displayName?.[0] || currentUser?.email?.[0] || 'U'}
                </div>
              )}
              {!isMobile && (
                <span style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#FFFFFF'
                }}>
                  {currentUser?.displayName || currentUser?.email?.split('@')[0] || 'User'}
                </span>
              )}
            </div>

            <button
              onClick={handleLogout}
              style={{
                background: 'transparent',
                border: '2px solid rgba(255, 255, 255, 0.2)',
                color: '#FFFFFF',
                padding: isMobile ? '8px 16px' : '10px 24px',
                fontSize: isMobile ? '12px' : '14px',
                fontWeight: '700',
                borderRadius: '24px',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.borderColor = '#29BD98';
                e.target.style.backgroundColor = 'rgba(41, 189, 152, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                e.target.style.backgroundColor = 'transparent';
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
        padding: isMobile ? '24px 20px 0' : '32px 40px 0'
      }}>
        <div style={{
          height: isMobile ? '6px' : '8px',
          backgroundColor: '#214055',
          borderRadius: '24px',
          overflow: 'hidden'
        }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '16.67%' }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            style={{
              height: '100%',
              background: 'linear-gradient(90deg, #29BD98 0%, #2497F9 100%)',
              borderRadius: '24px'
            }}
          />
        </div>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: isMobile ? '12px' : '16px',
          fontSize: isMobile ? '11px' : '12px',
          color: 'rgba(255, 255, 255, 0.5)',
          fontWeight: '600',
          flexWrap: 'wrap',
          gap: '8px'
        }}>
          <span>1/6 Complete</span>
          <span>~15 minutes remaining</span>
        </div>
      </div>

      {/* Main Content */}
      <main style={{
        maxWidth: '900px',
        margin: '0 auto',
        padding: isMobile ? '40px 20px 80px' : '64px 40px 120px'
      }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Title Section */}
          <div style={{ marginBottom: isMobile ? '32px' : '48px', textAlign: 'center' }}>
            <h1 style={{
              fontSize: isMobile ? '32px' : '48px',
              fontWeight: '800',
              color: '#FFFFFF',
              marginBottom: '16px',
              lineHeight: '1.2'
            }}>
              Identity & Design
            </h1>
            <p style={{
              fontSize: isMobile ? '16px' : '20px',
              color: 'rgba(255, 255, 255, 0.6)',
              lineHeight: '1.6',
              maxWidth: '600px',
              margin: '0 auto',
              padding: isMobile ? '0 16px' : '0'
            }}>
              Let's start by defining your project's identity and visual style
            </p>
          </div>

          {/* Form */}
          <div style={{
            backgroundColor: '#214055',
            borderRadius: isMobile ? '16px' : '24px',
            padding: isMobile ? '24px' : '48px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
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
                Project Name *
              </label>
              <input
                type="text"
                value={formData.projectName}
                onChange={(e) => handleInputChange('projectName', e.target.value)}
                placeholder="e.g., TaskMaster Pro"
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

            {/* Tagline */}
            <div style={{ marginBottom: '32px' }}>
              <label style={{
                display: 'block',
                fontSize: '16px',
                fontWeight: '700',
                color: '#FFFFFF',
                marginBottom: '12px'
              }}>
                Tagline *
              </label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => handleInputChange('tagline', e.target.value)}
                placeholder="e.g., Organize your work, amplify your productivity"
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

            {/* Description */}
            <div style={{ marginBottom: '32px' }}>
              <label style={{
                display: 'block',
                fontSize: '16px',
                fontWeight: '700',
                color: '#FFFFFF',
                marginBottom: '12px'
              }}>
                Project Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe your project, its purpose, and key features..."
                rows="6"
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

            {/* Target Audience */}
            <div style={{ marginBottom: '32px' }}>
              <label style={{
                display: 'block',
                fontSize: '16px',
                fontWeight: '700',
                color: '#FFFFFF',
                marginBottom: '12px'
              }}>
                Target Audience
              </label>
              <input
                type="text"
                value={formData.targetAudience}
                onChange={(e) => handleInputChange('targetAudience', e.target.value)}
                placeholder="e.g., Small businesses, freelancers, students"
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

            {/* Color Scheme */}
            <div style={{ marginBottom: '32px' }}>
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

            {/* Logo Upload */}
            <div>
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
                backgroundColor: '#15293A',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                position: 'relative'
              }}
              onDragOver={(e) => {
                e.preventDefault();
                e.currentTarget.style.borderColor = '#29BD98';
                e.currentTarget.style.backgroundColor = 'rgba(41, 189, 152, 0.05)';
              }}
              onDragLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                e.currentTarget.style.backgroundColor = '#15293A';
              }}
              onDrop={(e) => {
                e.preventDefault();
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                e.currentTarget.style.backgroundColor = '#15293A';
                if (e.dataTransfer.files[0]) {
                  setFormData(prev => ({ ...prev, logoFile: e.dataTransfer.files[0] }));
                }
              }}
              onClick={() => document.getElementById('logo-upload').click()}
              >
                <input
                  id="logo-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                />
                <div style={{
                  fontSize: '48px',
                  marginBottom: '16px',
                  opacity: 0.5
                }}>
                  📁
                </div>
                <div style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#FFFFFF',
                  marginBottom: '8px'
                }}>
                  {formData.logoFile ? formData.logoFile.name : 'Drop your logo here or click to browse'}
                </div>
                <div style={{
                  fontSize: '14px',
                  color: 'rgba(255, 255, 255, 0.5)'
                }}>
                  PNG, JPG, or SVG (Max 5MB)
                </div>
              </div>
            </div>
          </div>

          {/* Continue Button */}
          <div style={{
            marginTop: '48px',
            display: 'flex',
            justifyContent: 'center'
          }}>
            <motion.button
              whileHover={{ scale: isFormValid ? 1.02 : 1 }}
              whileTap={{ scale: isFormValid ? 0.98 : 1 }}
              onClick={handleContinue}
              disabled={!isFormValid}
              style={{
                background: isFormValid 
                  ? 'linear-gradient(135deg, #29BD98 0%, #2497F9 100%)'
                  : 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                color: isFormValid ? '#FFFFFF' : 'rgba(255, 255, 255, 0.3)',
                padding: '18px 64px',
                fontSize: '18px',
                fontWeight: '700',
                borderRadius: '24px',
                cursor: isFormValid ? 'pointer' : 'not-allowed',
                boxShadow: isFormValid ? '0 8px 24px rgba(41, 189, 152, 0.3)' : 'none',
                transition: 'all 0.2s ease'
              }}
            >
              Continue to Frontend →
            </motion.button>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Phase1Page;
