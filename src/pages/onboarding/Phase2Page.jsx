import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useProject } from '../../context/ProjectContext';
import logo from '../../assets/logo.png';

const Phase2Page = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const { projectData, updateProjectData } = useProject();

  const [formData, setFormData] = useState({
    framework: projectData?.framework || '',
    styling: projectData?.styling || '',
    uiLibrary: projectData?.uiLibrary || '',
    responsive: projectData?.responsive !== false
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSelect = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleContinue = async () => {
    await updateProjectData(formData);
    navigate('/onboarding/phase3');
  };

  const handleBack = () => {
    navigate('/onboarding/phase1');
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const frameworks = [
    { id: 'react', name: 'React', icon: '⚛️', description: 'Component-based UI library' },
    { id: 'vue', name: 'Vue.js', icon: '💚', description: 'Progressive framework' },
    { id: 'angular', name: 'Angular', icon: '🅰️', description: 'Full-featured framework' },
    { id: 'svelte', name: 'Svelte', icon: '🔥', description: 'Compile-time framework' },
    { id: 'nextjs', name: 'Next.js', icon: '▲', description: 'React with SSR' },
    { id: 'nuxt', name: 'Nuxt', icon: '💚', description: 'Vue with SSR' }
  ];

  const stylingOptions = [
    { id: 'tailwind', name: 'Tailwind CSS', icon: '🎨', description: 'Utility-first CSS' },
    { id: 'css-modules', name: 'CSS Modules', icon: '📦', description: 'Scoped CSS' },
    { id: 'styled-components', name: 'Styled Components', icon: '💅', description: 'CSS-in-JS' },
    { id: 'sass', name: 'Sass/SCSS', icon: '🎀', description: 'CSS preprocessor' },
    { id: 'emotion', name: 'Emotion', icon: '👩‍🎤', description: 'CSS-in-JS library' },
    { id: 'vanilla', name: 'Vanilla CSS', icon: '🍦', description: 'Plain CSS' }
  ];

  const uiLibraries = [
    { id: 'mui', name: 'Material-UI', icon: '🎯', description: 'Google Material Design' },
    { id: 'chakra', name: 'Chakra UI', icon: '⚡', description: 'Accessible components' },
    { id: 'ant', name: 'Ant Design', icon: '🐜', description: 'Enterprise UI' },
    { id: 'shadcn', name: 'shadcn/ui', icon: '🌙', description: 'Customizable components' },
    { id: 'custom', name: 'Custom', icon: '🎨', description: 'Build from scratch' },
    { id: 'none', name: 'None', icon: '❌', description: 'No UI library' }
  ];

  const isFormValid = formData.framework && formData.styling;

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
        padding: '20px 40px'
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
              height: '32px',
              width: 'auto',
              objectFit: 'contain',
              maxWidth: '140px',
              cursor: 'pointer'
            }}
            onClick={() => navigate('/')}
          />
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <div style={{
              fontSize: '14px',
              color: 'rgba(255, 255, 255, 0.6)',
              fontWeight: '600'
            }}>
              Phase 2 of 6
            </div>
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '8px 16px',
              backgroundColor: '#214055',
              borderRadius: '24px',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              {currentUser?.photoURL ? (
                <img
                  src={currentUser.photoURL}
                  alt="Profile"
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    border: '2px solid #29BD98'
                  }}
                />
              ) : (
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #29BD98 0%, #2497F9 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  fontWeight: '700',
                  color: '#FFFFFF'
                }}>
                  {currentUser?.displayName?.[0] || currentUser?.email?.[0] || 'U'}
                </div>
              )}
              <span style={{
                fontSize: '14px',
                fontWeight: '600',
                color: '#FFFFFF'
              }}>
                {currentUser?.displayName || currentUser?.email?.split('@')[0] || 'User'}
              </span>
            </div>

            <button
              onClick={handleLogout}
              style={{
                background: 'transparent',
                border: '2px solid rgba(255, 255, 255, 0.2)',
                color: '#FFFFFF',
                padding: '10px 24px',
                fontSize: '14px',
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
        padding: '32px 40px 0'
      }}>
        <div style={{
          height: '8px',
          backgroundColor: '#214055',
          borderRadius: '24px',
          overflow: 'hidden'
        }}>
          <motion.div
            initial={{ width: '16.67%' }}
            animate={{ width: '33.33%' }}
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
          marginTop: '16px',
          fontSize: '12px',
          color: 'rgba(255, 255, 255, 0.5)',
          fontWeight: '600'
        }}>
          <span>2/6 Complete</span>
          <span>~12 minutes remaining</span>
        </div>
      </div>

      {/* Main Content */}
      <main style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '64px 40px 120px'
      }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Title Section */}
          <div style={{ marginBottom: '48px', textAlign: 'center' }}>
            <h1 style={{
              fontSize: '48px',
              fontWeight: '800',
              color: '#FFFFFF',
              marginBottom: '16px',
              lineHeight: '1.2'
            }}>
              Frontend Stack
            </h1>
            <p style={{
              fontSize: '20px',
              color: 'rgba(255, 255, 255, 0.6)',
              lineHeight: '1.6',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              Choose your frontend technologies and design approach
            </p>
          </div>

          {/* Framework Selection */}
          <div style={{ marginBottom: '56px' }}>
            <h3 style={{
              fontSize: '24px',
              fontWeight: '700',
              color: '#FFFFFF',
              marginBottom: '24px'
            }}>
              Framework / Library *
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '20px'
            }}>
              {frameworks.map((framework) => (
                <motion.div
                  key={framework.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSelect('framework', framework.id)}
                  style={{
                    backgroundColor: formData.framework === framework.id ? '#214055' : '#1A3548',
                    border: formData.framework === framework.id ? '3px solid #29BD98' : '3px solid transparent',
                    borderRadius: '20px',
                    padding: '24px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: formData.framework === framework.id ? '0 8px 24px rgba(41, 189, 152, 0.2)' : 'none'
                  }}
                >
                  <div style={{ fontSize: '48px', marginBottom: '12px' }}>{framework.icon}</div>
                  <div style={{
                    fontSize: '20px',
                    fontWeight: '700',
                    color: '#FFFFFF',
                    marginBottom: '8px'
                  }}>
                    {framework.name}
                  </div>
                  <div style={{
                    fontSize: '14px',
                    color: 'rgba(255, 255, 255, 0.6)',
                    lineHeight: '1.5'
                  }}>
                    {framework.description}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Styling Selection */}
          <div style={{ marginBottom: '56px' }}>
            <h3 style={{
              fontSize: '24px',
              fontWeight: '700',
              color: '#FFFFFF',
              marginBottom: '24px'
            }}>
              Styling Approach *
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '20px'
            }}>
              {stylingOptions.map((option) => (
                <motion.div
                  key={option.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSelect('styling', option.id)}
                  style={{
                    backgroundColor: formData.styling === option.id ? '#214055' : '#1A3548',
                    border: formData.styling === option.id ? '3px solid #29BD98' : '3px solid transparent',
                    borderRadius: '20px',
                    padding: '24px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: formData.styling === option.id ? '0 8px 24px rgba(41, 189, 152, 0.2)' : 'none'
                  }}
                >
                  <div style={{ fontSize: '48px', marginBottom: '12px' }}>{option.icon}</div>
                  <div style={{
                    fontSize: '20px',
                    fontWeight: '700',
                    color: '#FFFFFF',
                    marginBottom: '8px'
                  }}>
                    {option.name}
                  </div>
                  <div style={{
                    fontSize: '14px',
                    color: 'rgba(255, 255, 255, 0.6)',
                    lineHeight: '1.5'
                  }}>
                    {option.description}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* UI Library Selection */}
          <div style={{ marginBottom: '56px' }}>
            <h3 style={{
              fontSize: '24px',
              fontWeight: '700',
              color: '#FFFFFF',
              marginBottom: '24px'
            }}>
              UI Component Library
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '20px'
            }}>
              {uiLibraries.map((lib) => (
                <motion.div
                  key={lib.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSelect('uiLibrary', lib.id)}
                  style={{
                    backgroundColor: formData.uiLibrary === lib.id ? '#214055' : '#1A3548',
                    border: formData.uiLibrary === lib.id ? '3px solid #29BD98' : '3px solid transparent',
                    borderRadius: '20px',
                    padding: '24px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: formData.uiLibrary === lib.id ? '0 8px 24px rgba(41, 189, 152, 0.2)' : 'none'
                  }}
                >
                  <div style={{ fontSize: '48px', marginBottom: '12px' }}>{lib.icon}</div>
                  <div style={{
                    fontSize: '20px',
                    fontWeight: '700',
                    color: '#FFFFFF',
                    marginBottom: '8px'
                  }}>
                    {lib.name}
                  </div>
                  <div style={{
                    fontSize: '14px',
                    color: 'rgba(255, 255, 255, 0.6)',
                    lineHeight: '1.5'
                  }}>
                    {lib.description}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Responsive Toggle */}
          <div style={{
            backgroundColor: '#214055',
            borderRadius: '20px',
            padding: '32px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{
                fontSize: '20px',
                fontWeight: '700',
                color: '#FFFFFF',
                marginBottom: '8px'
              }}>
                Responsive Design
              </div>
              <div style={{
                fontSize: '14px',
                color: 'rgba(255, 255, 255, 0.6)'
              }}>
                Optimize for mobile, tablet, and desktop
              </div>
            </div>
            <button
              onClick={() => setFormData(prev => ({ ...prev, responsive: !prev.responsive }))}
              style={{
                width: '64px',
                height: '36px',
                borderRadius: '24px',
                border: 'none',
                backgroundColor: formData.responsive ? '#29BD98' : 'rgba(255, 255, 255, 0.2)',
                position: 'relative',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                backgroundColor: '#FFFFFF',
                position: 'absolute',
                top: '4px',
                left: formData.responsive ? '32px' : '4px',
                transition: 'all 0.2s ease',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
              }} />
            </button>
          </div>

          {/* Navigation Buttons */}
          <div style={{
            marginTop: '56px',
            display: 'flex',
            justifyContent: 'space-between',
            gap: '24px'
          }}>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleBack}
              style={{
                background: 'transparent',
                border: '2px solid rgba(255, 255, 255, 0.2)',
                color: '#FFFFFF',
                padding: '18px 48px',
                fontSize: '18px',
                fontWeight: '700',
                borderRadius: '24px',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
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
              Continue to Backend →
            </motion.button>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Phase2Page;
