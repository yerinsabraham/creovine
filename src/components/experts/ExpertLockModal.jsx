import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaLock, FaTimes } from 'react-icons/fa';
import { useIsMobile } from '../../hooks/useMediaQuery';
import { getUnlockInstructions } from '../../utils/expertAccess';

const ExpertLockModal = ({ 
  isOpen, 
  onClose, 
  expertName, 
  expertColor,
  unlockPath,
  onAction 
}) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  if (!isOpen) return null;

  const instructions = getUnlockInstructions(unlockPath, expertName);

  const handlePrimaryAction = () => {
    onClose();
    
    switch (instructions.ctaAction) {
      case 'login':
        onAction?.('login');
        break;
      case 'chat-support':
        navigate('/chat/support-expert');
        break;
      case 'submit-project':
        navigate('/onboarding/phase1');
        break;
      case 'view-dashboard':
        navigate('/dashboard');
        break;
      default:
        break;
    }
  };

  const handleSecondaryAction = () => {
    onClose();
    
    if (instructions.secondaryAction === 'submit-project') {
      navigate('/onboarding/phase1');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.75)',
              backdropFilter: 'blur(8px)',
              zIndex: 1000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: isMobile ? '20px' : '40px'
            }}
          >
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                backgroundColor: '#15293A',
                borderRadius: '24px',
                maxWidth: '600px',
                width: '100%',
                maxHeight: '90vh',
                overflowY: 'auto',
                position: 'relative',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)'
              }}
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                style={{
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  background: 'transparent',
                  border: 'none',
                  color: 'rgba(255, 255, 255, 0.6)',
                  cursor: 'pointer',
                  fontSize: '24px',
                  padding: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '8px',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                  e.target.style.color = '#FFFFFF';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.color = 'rgba(255, 255, 255, 0.6)';
                }}
              >
                <FaTimes />
              </button>

              {/* Content */}
              <div style={{ padding: isMobile ? '32px 24px' : '48px 40px' }}>
                {/* Lock Icon */}
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ 
                    type: 'spring', 
                    damping: 15, 
                    stiffness: 200,
                    delay: 0.1 
                  }}
                  style={{
                    width: isMobile ? '80px' : '100px',
                    height: isMobile ? '80px' : '100px',
                    margin: '0 auto 24px',
                    background: `linear-gradient(135deg, ${expertColor}20, ${expertColor}10)`,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: `3px solid ${expertColor}40`,
                    boxShadow: `0 10px 30px ${expertColor}20`
                  }}
                >
                  <FaLock style={{ fontSize: isMobile ? '36px' : '48px', color: expertColor }} />
                </motion.div>

                {/* Title */}
                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  style={{
                    fontSize: isMobile ? '24px' : '32px',
                    fontWeight: '800',
                    color: '#FFFFFF',
                    textAlign: 'center',
                    marginBottom: '12px'
                  }}
                >
                  {instructions.title}
                </motion.h2>

                {/* Subtitle */}
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                  style={{
                    fontSize: isMobile ? '14px' : '16px',
                    color: 'rgba(255, 255, 255, 0.7)',
                    textAlign: 'center',
                    marginBottom: '32px',
                    lineHeight: '1.6'
                  }}
                >
                  Our{' '}
                  <span style={{ 
                    fontWeight: '700', 
                    color: expertColor 
                  }}>
                    {expertName}
                  </span>
                  {' '}is a specialized professional with limited availability.
                  <br />
                  Here's how to get access:
                </motion.p>

                {/* Steps */}
                <div style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  borderRadius: '16px',
                  padding: isMobile ? '24px 20px' : '32px 28px',
                  marginBottom: '32px',
                  border: '1px solid rgba(255, 255, 255, 0.05)'
                }}>
                  {instructions.steps.map((step, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + (index * 0.1) }}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '16px',
                        marginBottom: index < instructions.steps.length - 1 ? '20px' : 0
                      }}
                    >
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: `linear-gradient(135deg, ${expertColor}30, ${expertColor}15)`,
                        border: `2px solid ${expertColor}50`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        fontSize: '14px',
                        fontWeight: '700',
                        color: expertColor
                      }}>
                        {index + 1}
                      </div>
                      <p style={{
                        fontSize: isMobile ? '14px' : '15px',
                        color: 'rgba(255, 255, 255, 0.9)',
                        lineHeight: '1.6',
                        margin: 0,
                        paddingTop: '4px'
                      }}>
                        {step}
                      </p>
                    </motion.div>
                  ))}
                </div>

                {/* Note (if exists) */}
                {instructions.note && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    style={{
                      padding: '16px',
                      backgroundColor: 'rgba(41, 189, 152, 0.1)',
                      border: '1px solid rgba(41, 189, 152, 0.3)',
                      borderRadius: '12px',
                      marginBottom: '24px'
                    }}
                  >
                    <p style={{
                      fontSize: '14px',
                      color: '#29BD98',
                      margin: 0,
                      lineHeight: '1.5'
                    }}>
                      💡 <strong>Good News:</strong> {instructions.note}
                    </p>
                  </motion.div>
                )}

                {/* Primary CTA */}
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.75 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handlePrimaryAction}
                  style={{
                    width: '100%',
                    padding: '16px 32px',
                    fontSize: isMobile ? '15px' : '16px',
                    fontWeight: '700',
                    color: '#FFFFFF',
                    background: `linear-gradient(135deg, ${expertColor}, ${expertColor}CC)`,
                    border: 'none',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    boxShadow: `0 8px 24px ${expertColor}40`,
                    marginBottom: instructions.secondaryCta ? '12px' : 0
                  }}
                >
                  {instructions.cta}
                </motion.button>

                {/* Secondary CTA */}
                {instructions.secondaryCta && (
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSecondaryAction}
                    style={{
                      width: '100%',
                      padding: '16px 32px',
                      fontSize: isMobile ? '15px' : '16px',
                      fontWeight: '700',
                      color: expertColor,
                      background: 'transparent',
                      border: `2px solid ${expertColor}40`,
                      borderRadius: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    {instructions.secondaryCta}
                  </motion.button>
                )}

                {/* Bottom Info */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.85 }}
                  style={{
                    marginTop: '24px',
                    textAlign: 'center'
                  }}
                >
                  <p style={{
                    fontSize: '13px',
                    color: 'rgba(255, 255, 255, 0.5)',
                    lineHeight: '1.5',
                    margin: 0
                  }}>
                    🤝 These are real human professionals dedicated to your success.
                    <br />
                    We ensure quality by matching you at the right time.
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ExpertLockModal;
