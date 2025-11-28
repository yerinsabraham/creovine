import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useProject } from '../context/ProjectContext';
import { useLocation } from '../context/LocationContext';
import { useIsMobile } from '../hooks/useMediaQuery';
import { calculateProjectEstimate, formatCurrency } from '../utils/pricingCalculator';
import { useExpertUnlock, ExpertUnlockNotification, getUnlockedExpertsForService } from '../hooks/useExpertUnlock.jsx';
import confetti from 'canvas-confetti';

const ProjectSubmittedPage = () => {
  const { projectData } = useProject();
  const { location, currency } = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [estimate, setEstimate] = useState(null);
  const { unlockNotification, showUnlockNotification, hideUnlockNotification } = useExpertUnlock();

  useEffect(() => {
    // Trigger confetti celebration
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti(Object.assign({}, defaults, {
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      }));
      confetti(Object.assign({}, defaults, {
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      }));
    }, 250);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (projectData) {
      // Calculate preliminary estimate
      const countryCode = location?.country || 'US';
      const timelineMultiplier = projectData?.phases?.timeline?.timelineMultiplier || 1.0;
      const calculatedEstimate = calculateProjectEstimate(projectData, countryCode, timelineMultiplier);
      setEstimate(calculatedEstimate);

      // Show expert unlock notification
      const primaryService = projectData?.phases?.primaryService;
      if (primaryService) {
        const unlockedExperts = getUnlockedExpertsForService(primaryService);
        if (unlockedExperts.length > 0) {
          // Delay notification to show after confetti
          setTimeout(() => {
            showUnlockNotification(unlockedExperts);
          }, 2000);
        }
      }
    }
  }, [projectData, location, showUnlockNotification]);

  if (!projectData || !estimate) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#0F1C2E',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center', color: '#FFFFFF' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
          <div>Loading...</div>
        </div>
      </div>
    );
  }

  const primaryService = projectData?.phases?.primaryService;
  const addOns = projectData?.phases?.addOns || [];
  const totalServices = [primaryService, ...addOns].length;

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0F1C2E',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Expert Unlock Notification */}
      <ExpertUnlockNotification 
        notification={unlockNotification}
        onClose={hideUnlockNotification}
      />

      {/* Gradient Background */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(circle at 50% 0%, rgba(41, 189, 152, 0.15) 0%, transparent 50%)',
        pointerEvents: 'none'
      }} />

      <div style={{
        maxWidth: '900px',
        margin: '0 auto',
        padding: isMobile ? '40px 20px' : '80px 40px',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Success Icon Animation */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            type: 'spring',
            stiffness: 200,
            damping: 15,
            duration: 0.8
          }}
          style={{
            width: isMobile ? '100px' : '120px',
            height: isMobile ? '100px' : '120px',
            margin: '0 auto 32px',
            background: 'linear-gradient(135deg, #29BD98 0%, #1E9F7F 100%)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: isMobile ? '48px' : '60px',
            boxShadow: '0 20px 60px rgba(41, 189, 152, 0.4)'
          }}
        >
          ✓
        </motion.div>

        {/* Main Success Message */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{ textAlign: 'center', marginBottom: '48px' }}
        >
          <h1 style={{
            fontSize: isMobile ? '32px' : '48px',
            fontWeight: '800',
            background: 'linear-gradient(135deg, #FFFFFF 0%, rgba(255, 255, 255, 0.7) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '16px'
          }}>
            🎉 Project Submitted Successfully!
          </h1>
          
          <p style={{
            fontSize: isMobile ? '16px' : '20px',
            color: 'rgba(255, 255, 255, 0.7)',
            lineHeight: '1.6',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            Your project details have been received. Our expert team is already reviewing your requirements!
          </p>
        </motion.div>

        {/* Preliminary Estimate Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '24px',
            padding: isMobile ? '32px 24px' : '48px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            marginBottom: '32px',
            backdropFilter: 'blur(10px)'
          }}
        >
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '24px'
          }}>
            <div style={{
              padding: '8px 16px',
              backgroundColor: 'rgba(41, 189, 152, 0.2)',
              borderRadius: '20px',
              fontSize: '14px',
              fontWeight: '600',
              color: '#29BD98',
              border: '1px solid rgba(41, 189, 152, 0.3)'
            }}>
              💰 Preliminary Estimate
            </div>
            <div style={{
              fontSize: '13px',
              color: 'rgba(255, 255, 255, 0.5)'
            }}>
              Subject to final review
            </div>
          </div>

          <div style={{
            fontSize: isMobile ? '48px' : '64px',
            fontWeight: '800',
            background: 'linear-gradient(135deg, #29BD98 0%, #2497F9 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '24px'
          }}>
            {formatCurrency(estimate.total, estimate.currency)}
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
            gap: '16px',
            marginBottom: '24px'
          }}>
            <div style={{
              padding: '16px',
              backgroundColor: 'rgba(0, 0, 0, 0.2)',
              borderRadius: '12px'
            }}>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>📦</div>
              <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.5)', marginBottom: '4px' }}>Services</div>
              <div style={{ fontSize: '20px', fontWeight: '700', color: '#FFFFFF' }}>{totalServices}</div>
            </div>

            <div style={{
              padding: '16px',
              backgroundColor: 'rgba(0, 0, 0, 0.2)',
              borderRadius: '12px'
            }}>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>💳</div>
              <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.5)', marginBottom: '4px' }}>Currency</div>
              <div style={{ fontSize: '20px', fontWeight: '700', color: '#FFFFFF' }}>{currency?.code || 'USD'}</div>
            </div>

            <div style={{
              padding: '16px',
              backgroundColor: 'rgba(0, 0, 0, 0.2)',
              borderRadius: '12px'
            }}>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>⚡</div>
              <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.5)', marginBottom: '4px' }}>Response Time</div>
              <div style={{ fontSize: '20px', fontWeight: '700', color: '#29BD98' }}>{'< 24hrs'}</div>
            </div>
          </div>

          <div style={{
            padding: '16px',
            backgroundColor: 'rgba(255, 165, 0, 0.1)',
            border: '1px solid rgba(255, 165, 0, 0.3)',
            borderRadius: '12px',
            fontSize: '14px',
            color: 'rgba(255, 255, 255, 0.8)',
            lineHeight: '1.6'
          }}>
            <strong style={{ color: '#FFA500' }}>⚠️ Note:</strong> This is a preliminary estimate based on your selections. Our team will review your specific requirements and provide a final quote within 24 hours.
          </div>
        </motion.div>

        {/* What Happens Next Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '24px',
            padding: isMobile ? '32px 24px' : '40px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            marginBottom: '32px'
          }}
        >
          <h2 style={{
            fontSize: isMobile ? '24px' : '28px',
            fontWeight: '700',
            color: '#FFFFFF',
            marginBottom: '32px'
          }}>
            What Happens Next? 🚀
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {[
              {
                time: 'Within 1 hour',
                icon: '📧',
                title: 'Confirmation Email',
                desc: 'You\'ll receive a confirmation email with your project details and reference number'
              },
              {
                time: 'Within 12 hours',
                icon: '👨‍💻',
                title: 'Expert Review',
                desc: 'Our technical team reviews your requirements and prepares a detailed proposal'
              },
              {
                time: 'Within 24 hours',
                icon: '💼',
                title: 'Final Quote & Timeline',
                desc: 'You\'ll receive your customized quote, project timeline, and next steps'
              },
              {
                time: 'After Approval',
                icon: '⚡',
                title: 'Development Begins',
                desc: 'Once you approve, we kick off development with daily progress updates'
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + (index * 0.1) }}
                style={{
                  display: 'flex',
                  gap: '16px',
                  alignItems: 'flex-start'
                }}
              >
                <div style={{
                  width: '48px',
                  height: '48px',
                  backgroundColor: 'rgba(41, 189, 152, 0.1)',
                  border: '2px solid rgba(41, 189, 152, 0.3)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                  flexShrink: 0
                }}>
                  {step.icon}
                </div>
                
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#29BD98',
                    marginBottom: '4px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    {step.time}
                  </div>
                  <div style={{
                    fontSize: '16px',
                    fontWeight: '700',
                    color: '#FFFFFF',
                    marginBottom: '4px'
                  }}>
                    {step.title}
                  </div>
                  <div style={{
                    fontSize: '14px',
                    color: 'rgba(255, 255, 255, 0.6)',
                    lineHeight: '1.5'
                  }}>
                    {step.desc}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            gap: '16px'
          }}
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/dashboard')}
            style={{
              flex: 1,
              padding: '18px 32px',
              fontSize: '16px',
              fontWeight: '700',
              color: '#FFFFFF',
              background: 'linear-gradient(135deg, #29BD98 0%, #1E9F7F 100%)',
              border: 'none',
              borderRadius: '16px',
              cursor: 'pointer',
              boxShadow: '0 8px 24px rgba(41, 189, 152, 0.3)'
            }}
          >
            Go to Dashboard →
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/expert-consultation')}
            style={{
              flex: 1,
              padding: '18px 32px',
              fontSize: '16px',
              fontWeight: '700',
              color: '#FFFFFF',
              background: 'transparent',
              border: '2px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '16px',
              cursor: 'pointer'
            }}
          >
            💬 Chat with Expert
          </motion.button>
        </motion.div>

        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
          style={{
            marginTop: '48px',
            textAlign: 'center',
            padding: '24px',
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        >
          <div style={{
            fontSize: '14px',
            color: 'rgba(255, 255, 255, 0.6)',
            marginBottom: '12px'
          }}>
            Have questions? We're here to help!
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '24px',
            flexWrap: 'wrap'
          }}>
            <a
              href="mailto:support@creovine.com"
              style={{
                color: '#29BD98',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: '600'
              }}
            >
              📧 support@creovine.com
            </a>
            <a
              href="https://wa.me/your-number"
              style={{
                color: '#29BD98',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: '600'
              }}
            >
              💬 WhatsApp Support
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProjectSubmittedPage;
