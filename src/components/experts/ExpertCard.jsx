import { motion } from 'framer-motion';
import { FaLock } from 'react-icons/fa';
import { getExpertCardState } from '../../utils/expertAccess';

const ExpertCard = ({ 
  expert, 
  canAccess, 
  isNewlyUnlocked,
  onClick,
  isMobile 
}) => {
  const IconComponent = expert.icon;
  const cardState = getExpertCardState(canAccess, isNewlyUnlocked);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onClick={onClick}
      style={{
        backgroundColor: '#214055',
        borderRadius: '24px',
        padding: isMobile ? '24px' : '40px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        cursor: cardState.cursor,
        transition: 'all 0.3s ease',
        position: 'relative',
        overflow: 'hidden',
        opacity: cardState.opacity,
        filter: cardState.filter
      }}
      whileHover={canAccess ? { 
        scale: 1.02,
        boxShadow: `0 20px 40px rgba(0, 0, 0, 0.3)`,
        borderColor: expert.color 
      } : {}}
    >
      {/* Lock Overlay */}
      {cardState.overlayVisible && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.2))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 5,
          backdropFilter: 'blur(2px)'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'rgba(239, 68, 68, 0.2)',
            border: '3px solid rgba(239, 68, 68, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 10px 30px rgba(239, 68, 68, 0.3)'
          }}>
            <FaLock style={{ fontSize: '32px', color: '#EF4444' }} />
          </div>
        </div>
      )}

      {/* Top Badge */}
      {cardState.showBadge && (
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', damping: 15 }}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            padding: '6px 12px',
            backgroundColor: cardState.badgeColor,
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: '700',
            color: '#FFFFFF',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            boxShadow: `0 4px 12px ${cardState.badgeColor}60`,
            zIndex: 10
          }}
        >
          {cardState.badgeText}
        </motion.div>
      )}

      {/* Background Gradient */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '4px',
        background: `linear-gradient(90deg, ${expert.color}, ${expert.color}80)`,
        opacity: canAccess ? 1 : 0.3
      }} />

      {/* Avatar */}
      <div style={{
        width: '80px',
        height: '80px',
        borderRadius: '50%',
        background: `linear-gradient(135deg, ${expert.color}20, ${expert.color}10)`,
        border: `3px solid ${expert.color}40`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '24px',
        opacity: canAccess ? 1 : 0.5
      }}>
        <IconComponent style={{ fontSize: '36px', color: expert.color }} />
      </div>

      {/* Expert Info */}
      <h3 style={{
        fontSize: '24px',
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: '8px'
      }}>
        {expert.name}
      </h3>
      <p style={{
        fontSize: '16px',
        fontWeight: '600',
        color: expert.color,
        marginBottom: '16px'
      }}>
        {expert.specialty}
      </p>
      <p style={{
        fontSize: '14px',
        color: 'rgba(255, 255, 255, 0.6)',
        marginBottom: '16px',
        lineHeight: '1.6'
      }}>
        {expert.description}
      </p>

      {/* Expertise Tags */}
      <div style={{
        padding: '12px 16px',
        backgroundColor: 'rgba(21, 41, 58, 0.8)',
        borderRadius: '12px',
        border: '1px solid rgba(255, 255, 255, 0.05)'
      }}>
        <p style={{
          fontSize: '12px',
          color: 'rgba(255, 255, 255, 0.5)',
          marginBottom: '4px',
          fontWeight: '600',
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}>
          Expertise
        </p>
        <p style={{
          fontSize: '13px',
          color: 'rgba(255, 255, 255, 0.8)',
          margin: 0,
          fontWeight: '500'
        }}>
          {expert.expertise}
        </p>
      </div>

      {/* CTA */}
      <div style={{
        marginTop: '24px',
        padding: '12px',
        background: canAccess 
          ? `linear-gradient(135deg, ${expert.color}15, ${expert.color}05)`
          : 'rgba(239, 68, 68, 0.1)',
        borderRadius: '12px',
        textAlign: 'center',
        border: canAccess 
          ? `1px solid ${expert.color}30`
          : '1px solid rgba(239, 68, 68, 0.3)'
      }}>
        <p style={{
          fontSize: '14px',
          fontWeight: '700',
          color: canAccess ? expert.color : '#EF4444',
          margin: 0
        }}>
          {canAccess ? 'Start Conversation →' : 'Tap to Unlock'}
        </p>
      </div>
    </motion.div>
  );
};

export default ExpertCard;
