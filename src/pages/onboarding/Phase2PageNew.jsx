import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useProject } from '../../context/ProjectContext';
import { useCart } from '../../context/CartContext';
import { useIsMobile } from '../../hooks/useMediaQuery';
import AssistedToggle from '../../components/common/AssistedToggle';
import CartSummary from '../../components/common/CartSummary';
import Chip from '../../components/common/Chip';
import logo from '../../assets/logo.png';

const Phase2Page = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const { projectData, updatePhaseData, goToPhase } = useProject();
  const { hasItem } = useCart();
  const isMobile = useIsMobile();

  const [formData, setFormData] = useState({
    targetAudience: projectData?.users?.targetAudience || '',
    userTypes: projectData?.users?.userTypes || [],
    userJourney: projectData?.users?.userJourney || ''
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    goToPhase(2);
  }, []);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleUserType = (type) => {
    setFormData(prev => ({
      ...prev,
      userTypes: prev.userTypes.includes(type)
        ? prev.userTypes.filter(t => t !== type)
        : [...prev.userTypes, type]
    }));
  };

  const handleContinue = async () => {
    try {
      console.log('Phase 2: Saving data and navigating...', formData);
      await updatePhaseData('users', formData);
      console.log('Phase 2: Data saved, navigating to Phase 3');
      navigate('/onboarding/phase3');
    } catch (error) {
      console.error('Phase 2: Error saving data:', error);
      // Navigate anyway to not block user
      navigate('/onboarding/phase3');
    }
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

  // Validation: field is valid if filled OR user has assisted option in cart
  const isAudienceValid = formData.targetAudience.trim() || hasItem('target-audience-assistance');
  const areRolesValid = formData.userTypes.length > 0 || hasItem('user-types-assistance');
  
  const isFormValid = isAudienceValid && areRolesValid;

  const userTypeOptions = [
    { id: 'customer', label: 'Customer', icon: '👤' },
    { id: 'vendor', label: 'Vendor/Seller', icon: '🏪' },
    { id: 'admin', label: 'Admin', icon: '⚙️' },
    { id: 'moderator', label: 'Moderator', icon: '🛡️' },
    { id: 'guest', label: 'Guest', icon: '👋' },
    { id: 'subscriber', label: 'Subscriber', icon: '⭐' },
    { id: 'freelancer', label: 'Freelancer', icon: '💼' },
    { id: 'business', label: 'Business', icon: '🏢' },
    { id: 'student', label: 'Student', icon: '🎓' },
    { id: 'teacher', label: 'Teacher/Instructor', icon: '👨‍🏫' },
    { id: 'creator', label: 'Content Creator', icon: '🎨' },
    { id: 'other', label: 'Other', icon: '✨' }
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
                cursor: 'pointer',
                transition: 'all 0.2s ease'
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
          {[1, 2, 3, 4, 5, 6].map(phase => (
            <div
              key={phase}
              style={{
                flex: 1,
                height: '8px',
                backgroundColor: phase <= 2
                  ? '#29BD98' 
                  : 'rgba(255, 255, 255, 0.1)',
                borderRadius: '4px',
                transition: 'all 0.3s ease'
              }}
            />
          ))}
        </div>
        <div style={{
          fontSize: isMobile ? '12px' : '14px',
          color: 'rgba(255, 255, 255, 0.6)',
          textAlign: 'right'
        }}>
          Phase 2 of 6
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
          {/* Phase Title */}
          <div style={{ marginBottom: isMobile ? '32px' : '48px' }}>
            <h1 style={{
              fontSize: isMobile ? '28px' : '40px',
              fontWeight: '800',
              color: '#FFFFFF',
              marginBottom: '12px'
            }}>
              Target Users
            </h1>
            <p style={{
              fontSize: isMobile ? '15px' : '18px',
              color: 'rgba(255, 255, 255, 0.7)',
              lineHeight: '1.6'
            }}>
              Who will use your app? Let's define your audience and user roles.
            </p>
          </div>

          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            borderRadius: '24px',
            padding: isMobile ? '24px' : '40px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            {/* Target Audience */}
            {/* Assisted Toggle for Target Audience */}
            <AssistedToggle
              id="target-audience-assistance"
              category="Strategy"
              label="Need help defining your target audience?"
              price={15}
              assistedLabel="Help me define"
              tooltipText="We'll help you identify and describe your ideal user demographics, behaviors, and needs."
            />

            {!hasItem('target-audience-assistance') && (
              <div style={{ marginBottom: '32px', marginTop: '24px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '16px',
                  fontWeight: '700',
                  color: '#FFFFFF',
                  marginBottom: '12px'
                }}>
                  Who is your target audience? *
                </label>
                <textarea
                  value={formData.targetAudience}
                  onChange={(e) => handleInputChange('targetAudience', e.target.value)}
                  placeholder="e.g., Small business owners aged 25-45, tech-savvy millennials, fitness enthusiasts..."
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
            )}

            {/* User Types/Roles */}
            {/* Assisted Toggle for User Types */}
            <AssistedToggle
              id="user-types-assistance"
              category="Strategy"
              label="Need help determining user roles?"
              price={20}
              assistedLabel="Suggest roles for me"
              tooltipText="We'll analyze your app concept and recommend the right user types and permission structures."
            />

            {!hasItem('user-types-assistance') && (
              <div style={{ marginBottom: '32px', marginTop: '24px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '16px',
                  fontWeight: '700',
                  color: '#FFFFFF',
                  marginBottom: '12px'
                }}>
                  What types of users will your app have? *
                </label>
                <p style={{
                  fontSize: '14px',
                  color: 'rgba(255, 255, 255, 0.6)',
                  marginBottom: '20px'
                }}>
                  Select all roles/user types in your app
                </p>
                
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '12px'
                }}>
                  {userTypeOptions.map(option => (
                    <motion.button
                      key={option.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => toggleUserType(option.id)}
                      style={{
                        padding: '12px 20px',
                        fontSize: '14px',
                        fontWeight: '600',
                        color: formData.userTypes.includes(option.id) ? '#FFFFFF' : 'rgba(255, 255, 255, 0.7)',
                        background: formData.userTypes.includes(option.id)
                          ? 'linear-gradient(135deg, #29BD98 0%, #2497F9 100%)'
                          : 'rgba(255, 255, 255, 0.05)',
                        border: formData.userTypes.includes(option.id) 
                          ? '2px solid transparent' 
                          : '2px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}
                    >
                      <span style={{ fontSize: '18px' }}>{option.icon}</span>
                      <span>{option.label}</span>
                      {formData.userTypes.includes(option.id) && (
                        <span style={{ marginLeft: '4px' }}>✓</span>
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* User Journey (Optional) */}
            {/* Assisted Toggle for User Journey */}
            <AssistedToggle
              id="user-journey-assistance"
              category="Strategy"
              label="Need help mapping the user journey?"
              price={25}
              assistedLabel="Map the journey for me"
              tooltipText="We'll create a detailed user flow showing how users navigate through your app from start to finish."
            />

            {!hasItem('user-journey-assistance') && (
              <div style={{ marginBottom: '32px', marginTop: '24px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '16px',
                  fontWeight: '700',
                  color: '#FFFFFF',
                  marginBottom: '12px'
                }}>
                  Describe the typical user journey (Optional)
                </label>
                <textarea
                  value={formData.userJourney}
                  onChange={(e) => handleInputChange('userJourney', e.target.value)}
                  placeholder="e.g., User signs up → Creates profile → Browses listings → Makes purchase → Leaves review..."
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
            )}

            {/* Navigation Buttons */}
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
                  opacity: isFormValid ? 1 : 0.5,
                  transition: 'all 0.2s ease'
                }}
              >
                Continue to Phase 3 →
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Cart Summary Widget */}
      <CartSummary />
    </div>
  );
};

export default Phase2Page;
