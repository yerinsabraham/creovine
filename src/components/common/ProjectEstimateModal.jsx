import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { formatCurrency } from '../../utils/pricingCalculator';
import confetti from 'canvas-confetti';

const ProjectEstimateModal = ({ isOpen, estimate, onClose, serviceName }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      // Trigger confetti celebration
      const duration = 2000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 10000 };

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
    }
  }, [isOpen]);

  if (!estimate) return null;

  const handleDashboard = () => {
    navigate('/dashboard');
    onClose();
  };

  const handleSupport = () => {
    navigate('/expert-consultation');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px',
            overflow: 'auto'
          }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: '#15293A',
              borderRadius: '32px',
              padding: '48px',
              maxWidth: '600px',
              width: '100%',
              maxHeight: '90vh',
              overflow: 'auto',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)'
            }}
          >
            {/* Success Icon */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                type: 'spring',
                stiffness: 200,
                damping: 15,
                delay: 0.2
              }}
              style={{
                width: '100px',
                height: '100px',
                margin: '0 auto 24px',
                background: 'linear-gradient(135deg, #29BD98 0%, #1E9F7F 100%)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '48px',
                boxShadow: '0 10px 40px rgba(41, 189, 152, 0.4)'
              }}
            >
              ✓
            </motion.div>

            {/* Title */}
            <h2
              style={{
                fontSize: '32px',
                fontWeight: '800',
                background: 'linear-gradient(135deg, #FFFFFF 0%, rgba(255, 255, 255, 0.7) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textAlign: 'center',
                marginBottom: '12px'
              }}
            >
              🎉 Project Submitted!
            </h2>

            <p
              style={{
                fontSize: '16px',
                color: 'rgba(255, 255, 255, 0.7)',
                textAlign: 'center',
                marginBottom: '32px',
                lineHeight: '1.6'
              }}
            >
              {serviceName ? `Your ${serviceName} request has been received!` : 'Your project has been received!'}
              {' '}Our expert team is reviewing your requirements.
            </p>

            {/* Estimate Badge */}
            <div
              style={{
                padding: '8px 20px',
                backgroundColor: 'rgba(41, 189, 152, 0.2)',
                borderRadius: '20px',
                fontSize: '14px',
                fontWeight: '600',
                color: '#29BD98',
                border: '1px solid rgba(41, 189, 152, 0.3)',
                textAlign: 'center',
                marginBottom: '20px',
                display: 'inline-block',
                width: '100%'
              }}
            >
              💰 Preliminary Estimate
            </div>

            {/* Price Display */}
            <div
              style={{
                fontSize: '56px',
                fontWeight: '800',
                background: 'linear-gradient(135deg, #29BD98 0%, #2497F9 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textAlign: 'center',
                marginBottom: '24px'
              }}
            >
              {formatCurrency(estimate.total, estimate.currency)}
            </div>

            {/* Breakdown */}
            {estimate.breakdown && estimate.breakdown.length > 0 && (
              <div
                style={{
                  backgroundColor: 'rgba(0, 0, 0, 0.2)',
                  borderRadius: '16px',
                  padding: '20px',
                  marginBottom: '24px'
                }}
              >
                <div style={{ fontSize: '14px', fontWeight: '600', color: 'rgba(255, 255, 255, 0.6)', marginBottom: '12px' }}>
                  Cost Breakdown
                </div>
                {estimate.breakdown.map((item, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '12px 0',
                      borderBottom: index < estimate.breakdown.length - 1 ? '1px solid rgba(255, 255, 255, 0.1)' : 'none'
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '15px', fontWeight: '600', color: '#FFFFFF', marginBottom: '2px' }}>
                        {item.serviceName}
                      </div>
                      {item.complexityLabel && (
                        <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.5)' }}>
                          {item.complexityLabel} complexity
                        </div>
                      )}
                    </div>
                    <div style={{ fontSize: '16px', fontWeight: '700', color: '#29BD98' }}>
                      {formatCurrency(item.localPrice || item.price, estimate.currency)}
                    </div>
                  </div>
                ))}

                {estimate.discount > 0 && (
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '12px 0',
                      marginTop: '12px',
                      borderTop: '1px solid rgba(255, 255, 255, 0.1)'
                    }}
                  >
                    <div style={{ fontSize: '15px', fontWeight: '600', color: '#FFA500' }}>
                      Bundle Discount
                    </div>
                    <div style={{ fontSize: '16px', fontWeight: '700', color: '#FFA500' }}>
                      -{formatCurrency(estimate.discount, estimate.currency)}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Timeline Multiplier Info */}
            {estimate.timelineMultiplier && estimate.timelineMultiplier !== 1.0 && (
              <div
                style={{
                  padding: '12px 16px',
                  backgroundColor: estimate.timelineMultiplier > 1 ? 'rgba(255, 107, 107, 0.1)' : 'rgba(107, 140, 255, 0.1)',
                  border: `1px solid ${estimate.timelineMultiplier > 1 ? 'rgba(255, 107, 107, 0.3)' : 'rgba(107, 140, 255, 0.3)'}`,
                  borderRadius: '12px',
                  fontSize: '13px',
                  color: 'rgba(255, 255, 255, 0.8)',
                  lineHeight: '1.5',
                  marginBottom: '24px',
                  textAlign: 'center'
                }}
              >
                {estimate.timelineMultiplier > 1 ? '⚡ Rush delivery fee applied' : '📅 Flexible timeline discount applied'}
              </div>
            )}

            {/* Note */}
            <div
              style={{
                padding: '16px',
                backgroundColor: 'rgba(255, 165, 0, 0.1)',
                border: '1px solid rgba(255, 165, 0, 0.3)',
                borderRadius: '12px',
                fontSize: '13px',
                color: 'rgba(255, 255, 255, 0.8)',
                lineHeight: '1.6',
                marginBottom: '32px'
              }}
            >
              <strong style={{ color: '#FFA500' }}>⚠️ Note:</strong> This is a preliminary estimate. Our team will review your requirements and provide a final quote within 24 hours.
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleDashboard}
                style={{
                  padding: '16px 32px',
                  fontSize: '16px',
                  fontWeight: '700',
                  color: '#FFFFFF',
                  background: 'linear-gradient(135deg, #29BD98 0%, #1E9F7F 100%)',
                  border: 'none',
                  borderRadius: '16px',
                  cursor: 'pointer',
                  boxShadow: '0 8px 24px rgba(41, 189, 152, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <span>View Dashboard</span>
                <span>→</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSupport}
                style={{
                  padding: '16px 32px',
                  fontSize: '16px',
                  fontWeight: '700',
                  color: '#FFFFFF',
                  background: 'transparent',
                  border: '2px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '16px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <span>💬</span>
                <span>Speak to Support</span>
              </motion.button>
            </div>

            {/* Response Time */}
            <div
              style={{
                marginTop: '24px',
                textAlign: 'center',
                fontSize: '13px',
                color: 'rgba(255, 255, 255, 0.5)'
              }}
            >
              ⏱️ Our team typically responds within 24 hours
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ProjectEstimateModal;
