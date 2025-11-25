import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useProject } from '../../context/ProjectContext';
import logo from '../../assets/logo.png';

const Phase5Page = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const { projectData, updateProjectData } = useProject();

  const [formData, setFormData] = useState({
    coreFeatures: projectData?.coreFeatures || [],
    additionalFeatures: projectData?.additionalFeatures || []
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const toggleSelection = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  const handleContinue = async () => {
    await updateProjectData(formData);
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

  const coreFeatures = [
    { id: 'user-profiles', name: 'User Profiles', icon: '👤', description: 'Customizable user accounts' },
    { id: 'dashboard', name: 'Dashboard', icon: '📊', description: 'Analytics & overview' },
    { id: 'notifications', name: 'Notifications', icon: '🔔', description: 'Real-time alerts' },
    { id: 'search', name: 'Search', icon: '🔍', description: 'Advanced search functionality' },
    { id: 'chat', name: 'Chat/Messaging', icon: '💬', description: 'User communication' },
    { id: 'payments', name: 'Payments', icon: '💳', description: 'Payment processing' },
    { id: 'file-upload', name: 'File Upload', icon: '📁', description: 'Document management' },
    { id: 'calendar', name: 'Calendar', icon: '📅', description: 'Event scheduling' },
    { id: 'forms', name: 'Dynamic Forms', icon: '📝', description: 'Customizable forms' },
    { id: 'reports', name: 'Reports', icon: '📈', description: 'Data visualization' },
    { id: 'settings', name: 'Settings', icon: '⚙️', description: 'User preferences' },
    { id: 'admin-panel', name: 'Admin Panel', icon: '👑', description: 'Admin dashboard' }
  ];

  const additionalFeatures = [
    { id: 'dark-mode', name: 'Dark Mode', icon: '🌙', description: 'Theme toggle' },
    { id: 'multi-language', name: 'Multi-language', icon: '🌍', description: 'Internationalization' },
    { id: 'export', name: 'Export Data', icon: '📤', description: 'CSV, PDF, Excel' },
    { id: 'api', name: 'Public API', icon: '🔌', description: 'Third-party integration' },
    { id: 'webhooks', name: 'Webhooks', icon: '🪝', description: 'Event notifications' },
    { id: 'analytics', name: 'Analytics', icon: '📊', description: 'User behavior tracking' },
    { id: 'email', name: 'Email Templates', icon: '📧', description: 'Automated emails' },
    { id: 'seo', name: 'SEO Optimization', icon: '🎯', description: 'Search engine friendly' },
    { id: 'accessibility', name: 'Accessibility', icon: '♿', description: 'WCAG compliance' },
    { id: 'backup', name: 'Auto Backup', icon: '💾', description: 'Data protection' },
    { id: 'audit-log', name: 'Audit Log', icon: '📋', description: 'Activity tracking' },
    { id: 'rate-limiting', name: 'Rate Limiting', icon: '⏱️', description: 'API protection' }
  ];

  const isFormValid = formData.coreFeatures.length > 0;

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
              Phase 5 of 6
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
            initial={{ width: '66.67%' }}
            animate={{ width: '83.33%' }}
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
          <span>5/6 Complete</span>
          <span>~3 minutes remaining</span>
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
              Features & Functionality
            </h1>
            <p style={{
              fontSize: '20px',
              color: 'rgba(255, 255, 255, 0.6)',
              lineHeight: '1.6',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              Select the features you want to include in your application
            </p>
          </div>

          {/* Core Features */}
          <div style={{ marginBottom: '56px' }}>
            <h3 style={{
              fontSize: '24px',
              fontWeight: '700',
              color: '#FFFFFF',
              marginBottom: '24px'
            }}>
              Core Features * (Select at least one)
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '20px'
            }}>
              {coreFeatures.map((feature) => (
                <motion.div
                  key={feature.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => toggleSelection('coreFeatures', feature.id)}
                  style={{
                    backgroundColor: formData.coreFeatures.includes(feature.id) ? '#214055' : '#1A3548',
                    border: formData.coreFeatures.includes(feature.id) ? '3px solid #29BD98' : '3px solid transparent',
                    borderRadius: '20px',
                    padding: '24px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: formData.coreFeatures.includes(feature.id) ? '0 8px 24px rgba(41, 189, 152, 0.2)' : 'none',
                    position: 'relative'
                  }}
                >
                  {formData.coreFeatures.includes(feature.id) && (
                    <div style={{
                      position: 'absolute',
                      top: '16px',
                      right: '16px',
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #29BD98 0%, #2497F9 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '14px',
                      fontWeight: '700',
                      color: '#FFFFFF'
                    }}>
                      ✓
                    </div>
                  )}
                  <div style={{ fontSize: '48px', marginBottom: '12px' }}>{feature.icon}</div>
                  <div style={{
                    fontSize: '18px',
                    fontWeight: '700',
                    color: '#FFFFFF',
                    marginBottom: '8px'
                  }}>
                    {feature.name}
                  </div>
                  <div style={{
                    fontSize: '14px',
                    color: 'rgba(255, 255, 255, 0.6)',
                    lineHeight: '1.5'
                  }}>
                    {feature.description}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Additional Features */}
          <div style={{ marginBottom: '56px' }}>
            <h3 style={{
              fontSize: '24px',
              fontWeight: '700',
              color: '#FFFFFF',
              marginBottom: '24px'
            }}>
              Additional Features (Optional)
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '20px'
            }}>
              {additionalFeatures.map((feature) => (
                <motion.div
                  key={feature.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => toggleSelection('additionalFeatures', feature.id)}
                  style={{
                    backgroundColor: formData.additionalFeatures.includes(feature.id) ? '#214055' : '#1A3548',
                    border: formData.additionalFeatures.includes(feature.id) ? '3px solid #29BD98' : '3px solid transparent',
                    borderRadius: '20px',
                    padding: '24px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: formData.additionalFeatures.includes(feature.id) ? '0 8px 24px rgba(41, 189, 152, 0.2)' : 'none',
                    position: 'relative'
                  }}
                >
                  {formData.additionalFeatures.includes(feature.id) && (
                    <div style={{
                      position: 'absolute',
                      top: '16px',
                      right: '16px',
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #29BD98 0%, #2497F9 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '14px',
                      fontWeight: '700',
                      color: '#FFFFFF'
                    }}>
                      ✓
                    </div>
                  )}
                  <div style={{ fontSize: '48px', marginBottom: '12px' }}>{feature.icon}</div>
                  <div style={{
                    fontSize: '18px',
                    fontWeight: '700',
                    color: '#FFFFFF',
                    marginBottom: '8px'
                  }}>
                    {feature.name}
                  </div>
                  <div style={{
                    fontSize: '14px',
                    color: 'rgba(255, 255, 255, 0.6)',
                    lineHeight: '1.5'
                  }}>
                    {feature.description}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Summary */}
          {formData.coreFeatures.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                backgroundColor: '#214055',
                borderRadius: '20px',
                padding: '32px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                marginBottom: '56px'
              }}
            >
              <h4 style={{
                fontSize: '20px',
                fontWeight: '700',
                color: '#FFFFFF',
                marginBottom: '16px'
              }}>
                Selected Features Summary
              </h4>
              <div style={{
                fontSize: '16px',
                color: 'rgba(255, 255, 255, 0.8)',
                lineHeight: '1.6'
              }}>
                <div style={{ marginBottom: '8px' }}>
                  <strong style={{ color: '#29BD98' }}>{formData.coreFeatures.length}</strong> core features selected
                </div>
                <div>
                  <strong style={{ color: '#2497F9' }}>{formData.additionalFeatures.length}</strong> additional features selected
                </div>
              </div>
            </motion.div>
          )}

          {/* Navigation Buttons */}
          <div style={{
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
              Final Step →
            </motion.button>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Phase5Page;
