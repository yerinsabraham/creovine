import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { FaStar } from 'react-icons/fa';

/**
 * Hook to show expert unlock notification
 * Call this after project submission to celebrate unlocked experts
 */
export const useExpertUnlock = () => {
  const [unlockNotification, setUnlockNotification] = useState(null);

  const showUnlockNotification = (expertNames = []) => {
    if (expertNames.length === 0) return;

    // Trigger confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#29BD98', '#2497F9', '#8B5CF6']
    });

    setUnlockNotification({
      experts: expertNames,
      timestamp: Date.now()
    });

    // Auto-hide after 8 seconds
    setTimeout(() => {
      setUnlockNotification(null);
    }, 8000);
  };

  const hideUnlockNotification = () => {
    setUnlockNotification(null);
  };

  return {
    unlockNotification,
    showUnlockNotification,
    hideUnlockNotification
  };
};

/**
 * Notification component to display unlocked experts
 */
export const ExpertUnlockNotification = ({ notification, onClose }) => {
  if (!notification) return null;

  const { experts } = notification;
  const isSingleExpert = experts.length === 1;

  return (
    <AnimatePresence>
      {notification && (
      <motion.div
        initial={{ opacity: 0, y: -100, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -100, scale: 0.8 }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        style={{
          position: 'fixed',
          top: '24px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 9999,
          maxWidth: '500px',
          width: '90%'
        }}
      >
        <div style={{
          background: 'linear-gradient(135deg, #29BD98 0%, #1E9F7F 100%)',
          borderRadius: '20px',
          padding: '24px 28px',
          boxShadow: '0 20px 60px rgba(41, 189, 152, 0.4)',
          border: '2px solid rgba(255, 255, 255, 0.2)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Animated background pattern */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.15) 0%, transparent 50%)',
            pointerEvents: 'none'
          }} />

          {/* Content */}
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '16px'
            }}>
              {/* Icon */}
              <motion.div
                animate={{ 
                  rotate: [0, -10, 10, -10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 0.6,
                  repeat: Infinity,
                  repeatDelay: 2
                }}
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  fontSize: '24px'
                }}
              >
                ✨
              </motion.div>

              {/* Text */}
              <div style={{ flex: 1 }}>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '800',
                  color: '#FFFFFF',
                  marginBottom: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  🎉 Expert{isSingleExpert ? '' : 's'} Unlocked!
                </h3>
                <p style={{
                  fontSize: '14px',
                  color: 'rgba(255, 255, 255, 0.95)',
                  lineHeight: '1.5',
                  margin: 0
                }}>
                  {isSingleExpert 
                    ? `You can now chat with ${experts[0]}!`
                    : `You can now chat with: ${experts.join(', ')}`
                  }
                </p>
                <div style={{
                  marginTop: '12px',
                  padding: '8px 12px',
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#FFFFFF',
                  display: 'inline-block'
                }}>
                  💬 Visit Experts page to start chatting
                </div>
              </div>

              {/* Close button */}
              <button
                onClick={onClose}
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#FFFFFF',
                  cursor: 'pointer',
                  fontSize: '18px',
                  padding: '8px 10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.25)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
                }}
              >
                ×
              </button>
            </div>
          </div>
        </div>
      </motion.div>
      )}
    </AnimatePresence>
  );
};

/**
 * Helper to determine which experts to unlock based on submitted service
 */
export const getUnlockedExpertsForService = (serviceName) => {
  const unlockMap = {
    'frontend': ['Frontend Expert'],
    'backend': ['Backend Expert'],
    'fullstack': ['Frontend Expert', 'Backend Expert'],
    'mobile': ['Mobile Expert'],
    'landingPage': ['Frontend Expert'],
    'design': ['UI/UX Designer'],
    'api': ['Backend Expert'],
    'database': ['Backend Expert'],
    'auth': ['Backend Expert'],
    'payment': ['Backend Expert']
  };

  return unlockMap[serviceName] || [];
};
