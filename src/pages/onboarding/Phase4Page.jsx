import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useProject } from '../../context/ProjectContext';
import logo from '../../assets/logo.png';

const Phase4Page = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const { projectData, updateProjectData } = useProject();

  const [formData, setFormData] = useState({
    authMethods: projectData?.authMethods || [],
    userRoles: projectData?.userRoles || [],
    socialAuth: projectData?.socialAuth || []
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
    navigate('/onboarding/phase5');
  };

  const handleBack = () => {
    navigate('/onboarding/phase3');
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const authOptions = [
    { id: 'email', name: 'Email & Password', icon: '📧', description: 'Traditional login' },
    { id: 'phone', name: 'Phone Number', icon: '📱', description: 'SMS verification' },
    { id: 'magic-link', name: 'Magic Link', icon: '🔗', description: 'Passwordless email' },
    { id: 'two-factor', name: 'Two-Factor Auth', icon: '🔐', description: 'Extra security layer' }
  ];

  const socialProviders = [
    { id: 'google', name: 'Google', icon: '🔵', description: 'Sign in with Google' },
    { id: 'facebook', name: 'Facebook', icon: '💙', description: 'Sign in with Facebook' },
    { id: 'apple', name: 'Apple', icon: '🍎', description: 'Sign in with Apple' },
    { id: 'github', name: 'GitHub', icon: '⚫', description: 'Sign in with GitHub' },
    { id: 'twitter', name: 'Twitter', icon: '🐦', description: 'Sign in with Twitter' },
    { id: 'linkedin', name: 'LinkedIn', icon: '💼', description: 'Sign in with LinkedIn' }
  ];

  const roleOptions = [
    { id: 'admin', name: 'Admin', icon: '👑', description: 'Full system access' },
    { id: 'manager', name: 'Manager', icon: '👨‍💼', description: 'Team management' },
    { id: 'user', name: 'Standard User', icon: '👤', description: 'Regular access' },
    { id: 'guest', name: 'Guest', icon: '🎫', description: 'Limited access' }
  ];

  const isFormValid = formData.authMethods.length > 0;

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
              Phase 4 of 6
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
            initial={{ width: '50%' }}
            animate={{ width: '66.67%' }}
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
          <span>4/6 Complete</span>
          <span>~6 minutes remaining</span>
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
              Accounts & Authentication
            </h1>
            <p style={{
              fontSize: '20px',
              color: 'rgba(255, 255, 255, 0.6)',
              lineHeight: '1.6',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              Configure how users will access and interact with your application
            </p>
          </div>

          {/* Auth Methods */}
          <div style={{ marginBottom: '56px' }}>
            <h3 style={{
              fontSize: '24px',
              fontWeight: '700',
              color: '#FFFFFF',
              marginBottom: '24px'
            }}>
              Authentication Methods * (Select all that apply)
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '20px'
            }}>
              {authOptions.map((option) => (
                <motion.div
                  key={option.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => toggleSelection('authMethods', option.id)}
                  style={{
                    backgroundColor: formData.authMethods.includes(option.id) ? '#214055' : '#1A3548',
                    border: formData.authMethods.includes(option.id) ? '3px solid #29BD98' : '3px solid transparent',
                    borderRadius: '20px',
                    padding: '24px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: formData.authMethods.includes(option.id) ? '0 8px 24px rgba(41, 189, 152, 0.2)' : 'none',
                    position: 'relative'
                  }}
                >
                  {formData.authMethods.includes(option.id) && (
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

          {/* Social Auth */}
          <div style={{ marginBottom: '56px' }}>
            <h3 style={{
              fontSize: '24px',
              fontWeight: '700',
              color: '#FFFFFF',
              marginBottom: '24px'
            }}>
              Social Authentication (Optional)
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '20px'
            }}>
              {socialProviders.map((provider) => (
                <motion.div
                  key={provider.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => toggleSelection('socialAuth', provider.id)}
                  style={{
                    backgroundColor: formData.socialAuth.includes(provider.id) ? '#214055' : '#1A3548',
                    border: formData.socialAuth.includes(provider.id) ? '3px solid #29BD98' : '3px solid transparent',
                    borderRadius: '20px',
                    padding: '24px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: formData.socialAuth.includes(provider.id) ? '0 8px 24px rgba(41, 189, 152, 0.2)' : 'none',
                    position: 'relative'
                  }}
                >
                  {formData.socialAuth.includes(provider.id) && (
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
                  <div style={{ fontSize: '48px', marginBottom: '12px' }}>{provider.icon}</div>
                  <div style={{
                    fontSize: '20px',
                    fontWeight: '700',
                    color: '#FFFFFF',
                    marginBottom: '8px'
                  }}>
                    {provider.name}
                  </div>
                  <div style={{
                    fontSize: '14px',
                    color: 'rgba(255, 255, 255, 0.6)',
                    lineHeight: '1.5'
                  }}>
                    {provider.description}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* User Roles */}
          <div style={{ marginBottom: '56px' }}>
            <h3 style={{
              fontSize: '24px',
              fontWeight: '700',
              color: '#FFFFFF',
              marginBottom: '24px'
            }}>
              User Roles (Optional)
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '20px'
            }}>
              {roleOptions.map((role) => (
                <motion.div
                  key={role.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => toggleSelection('userRoles', role.id)}
                  style={{
                    backgroundColor: formData.userRoles.includes(role.id) ? '#214055' : '#1A3548',
                    border: formData.userRoles.includes(role.id) ? '3px solid #29BD98' : '3px solid transparent',
                    borderRadius: '20px',
                    padding: '24px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: formData.userRoles.includes(role.id) ? '0 8px 24px rgba(41, 189, 152, 0.2)' : 'none',
                    position: 'relative'
                  }}
                >
                  {formData.userRoles.includes(role.id) && (
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
                  <div style={{ fontSize: '48px', marginBottom: '12px' }}>{role.icon}</div>
                  <div style={{
                    fontSize: '20px',
                    fontWeight: '700',
                    color: '#FFFFFF',
                    marginBottom: '8px'
                  }}>
                    {role.name}
                  </div>
                  <div style={{
                    fontSize: '14px',
                    color: 'rgba(255, 255, 255, 0.6)',
                    lineHeight: '1.5'
                  }}>
                    {role.description}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

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
              Continue to Features →
            </motion.button>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Phase4Page;
