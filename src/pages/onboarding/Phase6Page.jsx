import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useProject } from '../../context/ProjectContext';
import logo from '../../assets/logo.png';

const Phase6Page = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const { projectData, updateProjectData, submitProject } = useProject();

  const [formData, setFormData] = useState({
    timeline: projectData?.timeline || '3-5',
    budget: projectData?.budget || '',
    additionalNotes: projectData?.additionalNotes || '',
    preferredContact: projectData?.preferredContact || 'email'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await updateProjectData(formData);
      await submitProject();
      navigate('/success');
    } catch (error) {
      console.error('Submit error:', error);
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate('/onboarding/phase5');
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const timelineOptions = [
    { id: '1-2', name: '1-2 Days', icon: '⚡', description: 'Express delivery' },
    { id: '3-5', name: '3-5 Days', icon: '🚀', description: 'Standard timeline' },
    { id: '1-2weeks', name: '1-2 Weeks', icon: '📅', description: 'Balanced approach' },
    { id: '2-4weeks', name: '2-4 Weeks', icon: '🎯', description: 'Complex projects' },
    { id: 'flexible', name: 'Flexible', icon: '🔄', description: 'No rush' }
  ];

  const budgetRanges = [
    { id: 'basic', name: 'Basic', range: '$500 - $2,000', icon: '💚' },
    { id: 'standard', name: 'Standard', range: '$2,000 - $5,000', icon: '💙' },
    { id: 'premium', name: 'Premium', range: '$5,000 - $10,000', icon: '💜' },
    { id: 'enterprise', name: 'Enterprise', range: '$10,000+', icon: '👑' }
  ];

  const isFormValid = formData.timeline && formData.budget;

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
              Phase 6 of 6
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
            initial={{ width: '83.33%' }}
            animate={{ width: '100%' }}
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
          <span>6/6 Complete</span>
          <span>🎉 Ready to submit!</span>
        </div>
      </div>

      {/* Main Content */}
      <main style={{
        maxWidth: '1000px',
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
              Final Details
            </h1>
            <p style={{
              fontSize: '20px',
              color: 'rgba(255, 255, 255, 0.6)',
              lineHeight: '1.6',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              Let's finalize your project timeline, budget, and any additional requirements
            </p>
          </div>

          {/* Timeline Selection */}
          <div style={{ marginBottom: '48px' }}>
            <h3 style={{
              fontSize: '24px',
              fontWeight: '700',
              color: '#FFFFFF',
              marginBottom: '24px'
            }}>
              Project Timeline *
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '16px'
            }}>
              {timelineOptions.map((option) => (
                <motion.div
                  key={option.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleInputChange('timeline', option.id)}
                  style={{
                    backgroundColor: formData.timeline === option.id ? '#214055' : '#1A3548',
                    border: formData.timeline === option.id ? '3px solid #29BD98' : '3px solid transparent',
                    borderRadius: '16px',
                    padding: '20px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: formData.timeline === option.id ? '0 8px 24px rgba(41, 189, 152, 0.2)' : 'none'
                  }}
                >
                  <div style={{ fontSize: '36px', marginBottom: '8px' }}>{option.icon}</div>
                  <div style={{
                    fontSize: '18px',
                    fontWeight: '700',
                    color: '#FFFFFF',
                    marginBottom: '6px'
                  }}>
                    {option.name}
                  </div>
                  <div style={{
                    fontSize: '13px',
                    color: 'rgba(255, 255, 255, 0.6)'
                  }}>
                    {option.description}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Budget Selection */}
          <div style={{ marginBottom: '48px' }}>
            <h3 style={{
              fontSize: '24px',
              fontWeight: '700',
              color: '#FFFFFF',
              marginBottom: '24px'
            }}>
              Budget Range *
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '16px'
            }}>
              {budgetRanges.map((budget) => (
                <motion.div
                  key={budget.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleInputChange('budget', budget.id)}
                  style={{
                    backgroundColor: formData.budget === budget.id ? '#214055' : '#1A3548',
                    border: formData.budget === budget.id ? '3px solid #29BD98' : '3px solid transparent',
                    borderRadius: '16px',
                    padding: '20px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: formData.budget === budget.id ? '0 8px 24px rgba(41, 189, 152, 0.2)' : 'none'
                  }}
                >
                  <div style={{ fontSize: '36px', marginBottom: '8px' }}>{budget.icon}</div>
                  <div style={{
                    fontSize: '18px',
                    fontWeight: '700',
                    color: '#FFFFFF',
                    marginBottom: '6px'
                  }}>
                    {budget.name}
                  </div>
                  <div style={{
                    fontSize: '13px',
                    color: 'rgba(255, 255, 255, 0.6)'
                  }}>
                    {budget.range}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Preferred Contact Method */}
          <div style={{ marginBottom: '48px' }}>
            <h3 style={{
              fontSize: '24px',
              fontWeight: '700',
              color: '#FFFFFF',
              marginBottom: '24px'
            }}>
              Preferred Contact Method
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '16px'
            }}>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleInputChange('preferredContact', 'email')}
                style={{
                  background: formData.preferredContact === 'email' 
                    ? 'linear-gradient(135deg, #29BD98 0%, #2497F9 100%)'
                    : '#1A3548',
                  border: 'none',
                  color: '#FFFFFF',
                  padding: '20px',
                  fontSize: '18px',
                  fontWeight: '700',
                  borderRadius: '16px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px'
                }}
              >
                <span style={{ fontSize: '24px' }}>📧</span>
                Email
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleInputChange('preferredContact', 'phone')}
                style={{
                  background: formData.preferredContact === 'phone' 
                    ? 'linear-gradient(135deg, #29BD98 0%, #2497F9 100%)'
                    : '#1A3548',
                  border: 'none',
                  color: '#FFFFFF',
                  padding: '20px',
                  fontSize: '18px',
                  fontWeight: '700',
                  borderRadius: '16px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px'
                }}
              >
                <span style={{ fontSize: '24px' }}>📱</span>
                Phone
              </motion.button>
            </div>
          </div>

          {/* Additional Notes */}
          <div style={{ marginBottom: '56px' }}>
            <h3 style={{
              fontSize: '24px',
              fontWeight: '700',
              color: '#FFFFFF',
              marginBottom: '24px'
            }}>
              Additional Notes (Optional)
            </h3>
            <textarea
              value={formData.additionalNotes}
              onChange={(e) => handleInputChange('additionalNotes', e.target.value)}
              placeholder="Any specific requirements, preferences, or questions you'd like to share..."
              rows="8"
              style={{
                width: '100%',
                padding: '20px',
                fontSize: '16px',
                color: '#FFFFFF',
                backgroundColor: '#1A3548',
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

          {/* Confirmation Message */}
          {isFormValid && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                backgroundColor: '#214055',
                borderRadius: '20px',
                padding: '32px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                marginBottom: '48px',
                textAlign: 'center'
              }}
            >
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎉</div>
              <h4 style={{
                fontSize: '24px',
                fontWeight: '700',
                color: '#FFFFFF',
                marginBottom: '12px'
              }}>
                You're All Set!
              </h4>
              <p style={{
                fontSize: '16px',
                color: 'rgba(255, 255, 255, 0.7)',
                lineHeight: '1.6'
              }}>
                Click submit to send your project details. We'll review your requirements and get back to you within 24 hours.
              </p>
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
              disabled={isSubmitting}
              style={{
                background: 'transparent',
                border: '2px solid rgba(255, 255, 255, 0.2)',
                color: isSubmitting ? 'rgba(255, 255, 255, 0.3)' : '#FFFFFF',
                padding: '18px 48px',
                fontSize: '18px',
                fontWeight: '700',
                borderRadius: '24px',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              ← Back
            </motion.button>

            <motion.button
              whileHover={{ scale: isFormValid && !isSubmitting ? 1.02 : 1 }}
              whileTap={{ scale: isFormValid && !isSubmitting ? 0.98 : 1 }}
              onClick={handleSubmit}
              disabled={!isFormValid || isSubmitting}
              style={{
                background: isFormValid && !isSubmitting
                  ? 'linear-gradient(135deg, #29BD98 0%, #2497F9 100%)'
                  : 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                color: isFormValid && !isSubmitting ? '#FFFFFF' : 'rgba(255, 255, 255, 0.3)',
                padding: '18px 64px',
                fontSize: '18px',
                fontWeight: '700',
                borderRadius: '24px',
                cursor: isFormValid && !isSubmitting ? 'pointer' : 'not-allowed',
                boxShadow: isFormValid && !isSubmitting ? '0 8px 24px rgba(41, 189, 152, 0.3)' : 'none',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}
            >
              {isSubmitting ? (
                <>
                  <div style={{
                    width: '20px',
                    height: '20px',
                    border: '3px solid rgba(255, 255, 255, 0.3)',
                    borderTop: '3px solid #FFFFFF',
                    borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite'
                  }} />
                  Submitting...
                </>
              ) : (
                <>
                  Submit Project 🚀
                </>
              )}
            </motion.button>
          </div>
        </motion.div>
      </main>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Phase6Page;
