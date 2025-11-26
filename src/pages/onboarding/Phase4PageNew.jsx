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

const Phase4Page = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const { projectData, updatePhaseData, goToPhase } = useProject();
  const { hasItem } = useCart();
  const isMobile = useIsMobile();

  const [formData, setFormData] = useState({
    databaseNeeds: projectData?.backend?.databaseNeeds || [],
    integrations: projectData?.backend?.integrations || [],
    fileStorage: projectData?.backend?.fileStorage || [],
    realtimeFeatures: projectData?.backend?.realtimeFeatures || []
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    goToPhase(4);
  }, []);

  const toggleItem = (category, item) => {
    setFormData(prev => ({
      ...prev,
      [category]: prev[category].includes(item)
        ? prev[category].filter(i => i !== item)
        : [...prev[category], item]
    }));
  };

  const handleContinue = async () => {
    await updatePhaseData('backend', formData);
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

  // Validation: field is valid if filled OR user has assisted option in cart
  const isDatabaseValid = formData.databaseNeeds.length > 0 || hasItem('database-schema-assistance');
  
  const isFormValid = isDatabaseValid;

  const databaseOptions = [
    { id: 'users', label: 'User Data', icon: '👥' },
    { id: 'products', label: 'Products/Items', icon: '📦' },
    { id: 'orders', label: 'Orders/Transactions', icon: '🛒' },
    { id: 'content', label: 'Content/Posts', icon: '📝' },
    { id: 'messages', label: 'Messages/Chat', icon: '💬' },
    { id: 'reviews', label: 'Reviews/Ratings', icon: '⭐' },
    { id: 'analytics', label: 'Analytics Data', icon: '📊' },
    { id: 'bookings', label: 'Bookings/Reservations', icon: '📅' },
    { id: 'media', label: 'Media/Files', icon: '🖼️' },
    { id: 'locations', label: 'Location Data', icon: '📍' }
  ];

  const integrationOptions = [
    { id: 'stripe', label: 'Stripe', icon: '💳' },
    { id: 'paypal', label: 'PayPal', icon: '💰' },
    { id: 'twilio', label: 'Twilio SMS', icon: '📱' },
    { id: 'sendgrid', label: 'SendGrid Email', icon: '📧' },
    { id: 'google-maps', label: 'Google Maps', icon: '🗺️' },
    { id: 'aws-s3', label: 'AWS S3 Storage', icon: '☁️' },
    { id: 'cloudinary', label: 'Cloudinary', icon: '🖼️' },
    { id: 'analytics', label: 'Google Analytics', icon: '📈' },
    { id: 'mailchimp', label: 'Mailchimp', icon: '📬' },
    { id: 'social', label: 'Social Media APIs', icon: '🔗' },
    { id: 'calendar', label: 'Calendar Integration', icon: '📆' },
    { id: 'zoom', label: 'Zoom/Video', icon: '🎥' }
  ];

  const storageOptions = [
    { id: 'images', label: 'Images', icon: '🖼️' },
    { id: 'videos', label: 'Videos', icon: '🎬' },
    { id: 'documents', label: 'Documents (PDF, etc)', icon: '📄' },
    { id: 'audio', label: 'Audio Files', icon: '🎵' },
    { id: 'user-uploads', label: 'User Uploads', icon: '📤' }
  ];

  const realtimeOptions = [
    { id: 'chat', label: 'Real-time Chat', icon: '💬' },
    { id: 'notifications', label: 'Live Notifications', icon: '🔔' },
    { id: 'updates', label: 'Live Updates', icon: '🔄' },
    { id: 'tracking', label: 'Live Tracking', icon: '📍' },
    { id: 'collaboration', label: 'Collaborative Editing', icon: '👥' },
    { id: 'presence', label: 'User Presence', icon: '🟢' }
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
                backgroundColor: phase <= 4 ? '#29BD98' : 'rgba(255, 255, 255, 0.1)',
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
          Phase 4 of 6
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
              Backend & Data
            </h1>
            <p style={{
              fontSize: isMobile ? '15px' : '18px',
              color: 'rgba(255, 255, 255, 0.7)',
              lineHeight: '1.6'
            }}>
              What data will your app store and what services will it integrate with?
            </p>
          </div>

          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            borderRadius: '24px',
            padding: isMobile ? '24px' : '40px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            {/* Database Needs */}
            <AssistedToggle
              id="database-schema-assistance"
              category="Technical"
              label="Need help designing your database structure?"
              price={35}
              assistedLabel="Design database schema"
              tooltipText="We'll create a complete database schema showing all tables, relationships, and data structures optimized for your app."
            />

            {!hasItem('database-schema-assistance') && (
              <div style={{ marginBottom: '32px', marginTop: '24px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '16px',
                  fontWeight: '700',
                  color: '#FFFFFF',
                  marginBottom: '16px'
                }}>
                  What data does your app need to store? * (Select all that apply)
                </label>
                
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                  {databaseOptions.map(option => (
                    <motion.button
                      key={option.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => toggleItem('databaseNeeds', option.id)}
                      style={{
                        padding: '12px 20px',
                        fontSize: '14px',
                        fontWeight: '600',
                        color: formData.databaseNeeds.includes(option.id) ? '#FFFFFF' : 'rgba(255, 255, 255, 0.7)',
                        background: formData.databaseNeeds.includes(option.id)
                          ? 'linear-gradient(135deg, #29BD98 0%, #2497F9 100%)'
                          : 'rgba(255, 255, 255, 0.05)',
                        border: formData.databaseNeeds.includes(option.id)
                          ? '2px solid transparent'
                          : '2px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}
                    >
                      <span style={{ fontSize: '18px' }}>{option.icon}</span>
                      <span>{option.label}</span>
                      {formData.databaseNeeds.includes(option.id) && <span>✓</span>}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Integrations */}
            <AssistedToggle
              id="integrations-assistance"
              category="Technical"
              label="Need help choosing the right integrations?"
              price={25}
              assistedLabel="Choose integrations for me"
              tooltipText="We'll recommend the best third-party services for your needs and handle the integration setup."
            />

            {!hasItem('integrations-assistance') && (
              <div style={{ marginBottom: '32px', marginTop: '24px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '16px',
                  fontWeight: '700',
                  color: '#FFFFFF',
                  marginBottom: '16px'
                }}>
                  What third-party services do you need? (Optional)
                </label>
                
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                  {integrationOptions.map(option => (
                    <motion.button
                      key={option.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => toggleItem('integrations', option.id)}
                      style={{
                        padding: '12px 20px',
                        fontSize: '14px',
                        fontWeight: '600',
                        color: formData.integrations.includes(option.id) ? '#FFFFFF' : 'rgba(255, 255, 255, 0.7)',
                        background: formData.integrations.includes(option.id)
                          ? 'linear-gradient(135deg, #29BD98 0%, #2497F9 100%)'
                          : 'rgba(255, 255, 255, 0.05)',
                        border: formData.integrations.includes(option.id)
                          ? '2px solid transparent'
                          : '2px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}
                    >
                      <span style={{ fontSize: '18px' }}>{option.icon}</span>
                      <span>{option.label}</span>
                      {formData.integrations.includes(option.id) && <span>✓</span>}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* File Storage */}
            <div style={{ marginBottom: '32px', marginTop: '32px' }}>
              <label style={{
                display: 'block',
                fontSize: '16px',
                fontWeight: '700',
                color: '#FFFFFF',
                marginBottom: '16px'
              }}>
                What types of files will users upload? (Optional)
              </label>
              
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                {storageOptions.map(option => (
                  <motion.button
                    key={option.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggleItem('fileStorage', option.id)}
                    style={{
                      padding: '12px 20px',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: formData.fileStorage.includes(option.id) ? '#FFFFFF' : 'rgba(255, 255, 255, 0.7)',
                      background: formData.fileStorage.includes(option.id)
                        ? 'linear-gradient(135deg, #29BD98 0%, #2497F9 100%)'
                        : 'rgba(255, 255, 255, 0.05)',
                      border: formData.fileStorage.includes(option.id)
                        ? '2px solid transparent'
                        : '2px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <span style={{ fontSize: '18px' }}>{option.icon}</span>
                    <span>{option.label}</span>
                    {formData.fileStorage.includes(option.id) && <span>✓</span>}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Real-time Features */}
            <AssistedToggle
              id="realtime-architecture-assistance"
              category="Technical"
              label="Need help planning real-time architecture?"
              price={30}
              assistedLabel="Plan real-time for me"
              tooltipText="We'll design the technical architecture for your real-time features including WebSockets, scaling, and performance optimization."
            />

            {!hasItem('realtime-architecture-assistance') && (
              <div style={{ marginBottom: '32px', marginTop: '24px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '16px',
                  fontWeight: '700',
                  color: '#FFFFFF',
                  marginBottom: '16px'
                }}>
                  Need any real-time features? (Optional)
                </label>
                
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                  {realtimeOptions.map(option => (
                    <motion.button
                      key={option.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => toggleItem('realtimeFeatures', option.id)}
                      style={{
                        padding: '12px 20px',
                        fontSize: '14px',
                        fontWeight: '600',
                        color: formData.realtimeFeatures.includes(option.id) ? '#FFFFFF' : 'rgba(255, 255, 255, 0.7)',
                        background: formData.realtimeFeatures.includes(option.id)
                          ? 'linear-gradient(135deg, #29BD98 0%, #2497F9 100%)'
                          : 'rgba(255, 255, 255, 0.05)',
                        border: formData.realtimeFeatures.includes(option.id)
                          ? '2px solid transparent'
                          : '2px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}
                    >
                      <span style={{ fontSize: '18px' }}>{option.icon}</span>
                      <span>{option.label}</span>
                      {formData.realtimeFeatures.includes(option.id) && <span>✓</span>}
                    </motion.button>
                  ))}
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
                Continue to Phase 5 →
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>

      <CartSummary />
    </div>
  );
};

export default Phase4Page;
