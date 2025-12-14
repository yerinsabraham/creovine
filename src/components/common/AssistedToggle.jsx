import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../context/CartContext';
import { useLocation } from '../../context/LocationContext';
import { useIsMobile } from '../../hooks/useMediaQuery';
import { getLocalizedPrice } from '../../utils/geolocation';

/**
 * AssistedToggle Component
 * 
 * A simple toggle to enable/disable assisted services with pricing display
 * Supports both light and dark themes
 * 
 * Props:
 * - enabled: boolean - current toggle state (new pattern)
 * - onToggle: function - callback when toggled (new pattern)
 * - price: number - cost for the service
 * - label: string - description of the service
 * 
 * Legacy props also supported:
 * - id, category, assistedLabel, tooltipText, defaultEnabled, onChange
 */
const AssistedToggle = ({
  // New simple pattern
  enabled,
  onToggle,
  price,
  label,
  // Legacy pattern
  id,
  category,
  assistedLabel,
  tooltipText,
  defaultEnabled = false,
  onChange,
  // Theme
  theme = 'light' // 'light' or 'dark'
}) => {
  const isMobile = useIsMobile();
  const { location } = useLocation();
  
  // Determine which pattern is being used
  const isNewPattern = typeof enabled !== 'undefined' && typeof onToggle === 'function';
  
  // Legacy state handling
  const [legacyIsAssisted, setLegacyIsAssisted] = useState(defaultEnabled);
  const [showTooltip, setShowTooltip] = useState(false);
  const { addItem, removeItem, hasItem } = useCart();
  const tooltipRef = useRef(null);

  const isAssisted = isNewPattern ? enabled : legacyIsAssisted;

  // Close tooltip when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showTooltip && tooltipRef.current && !tooltipRef.current.contains(event.target)) {
        setShowTooltip(false);
      }
    };

    if (showTooltip) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [showTooltip]);

  const handleToggle = () => {
    if (isNewPattern) {
      onToggle(!enabled);
    } else {
      // Legacy pattern
      const newState = !legacyIsAssisted;
      setLegacyIsAssisted(newState);

      if (newState) {
        addItem({
          id,
          category,
          label: label || assistedLabel,
          price,
          description: tooltipText
        });
      } else {
        removeItem(id);
      }

      if (onChange) {
        onChange(newState);
      }
    }
  };

  // Simple new pattern - just a toggle switch with price
  if (isNewPattern) {
    const isLight = theme === 'light';
    
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: isMobile ? '8px' : '12px',
        flexWrap: 'wrap'
      }}>
        <motion.button
          onClick={handleToggle}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: isMobile ? '8px 12px' : '8px 16px',
            fontSize: isMobile ? '12px' : '13px',
            fontWeight: '500',
            color: isAssisted 
              ? '#FFFFFF' 
              : (isLight ? '#666' : 'rgba(255, 255, 255, 0.6)'),
            backgroundColor: isAssisted 
              ? '#29BD98' 
              : (isLight ? '#F3F4F6' : 'rgba(255, 255, 255, 0.05)'),
            border: isAssisted 
              ? '2px solid #29BD98' 
              : (isLight ? '2px solid #E5E7EB' : '2px solid rgba(255, 255, 255, 0.1)'),
            borderRadius: '50px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            whiteSpace: 'nowrap'
          }}
        >
          <span style={{
            width: isMobile ? '14px' : '16px',
            height: isMobile ? '14px' : '16px',
            borderRadius: '50%',
            backgroundColor: isAssisted ? '#FFFFFF' : 'transparent',
            border: isAssisted ? 'none' : (isLight ? '2px solid #CCC' : '2px solid rgba(255, 255, 255, 0.3)'),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s ease'
          }}>
            {isAssisted && (
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#29BD98" strokeWidth="3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}
          </span>
          {label && <span>{label}</span>}
          <span style={{
            fontWeight: '700',
            color: isAssisted ? '#FFFFFF' : '#29BD98'
          }}>
            {(() => {
              const localPrice = getLocalizedPrice(price, location?.country || 'US');
              return `+${localPrice.symbol}${localPrice.amount.toLocaleString()}`;
            })()}
          </span>
        </motion.button>
      </div>
    );
  }

  // Legacy pattern - full two-button toggle
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      marginBottom: '20px'
    }}>
      {/* Label */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '8px'
      }}>
        <span style={{
          fontSize: isMobile ? '13px' : '14px',
          fontWeight: '600',
          color: 'rgba(255, 255, 255, 0.9)'
        }}>
          {label}
        </span>
        {isAssisted && (
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              fontSize: '13px',
              fontWeight: '700',
              color: '#29BD98',
              backgroundColor: 'rgba(41, 189, 152, 0.1)',
              padding: '4px 12px',
              borderRadius: '12px'
            }}
          >
            +${price}
          </motion.span>
        )}
      </div>

      {/* Toggle Buttons */}
      <div style={{
        display: 'flex',
        gap: isMobile ? '8px' : '12px',
        alignItems: 'stretch',
        flexDirection: 'row',
        flexWrap: 'wrap' // Always allow wrapping to show full text
      }}>
        {/* Self-Provide Button - Compact size */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => !isAssisted || handleToggle()}
          style={{
            flexGrow: 0, // Don't grow
            flexShrink: 0, // Don't shrink
            padding: isMobile ? '12px 16px' : '14px 20px', // More compact on mobile
            fontSize: isMobile ? '13px' : '14px',
            fontWeight: '600',
            color: !isAssisted ? '#FFFFFF' : 'rgba(255, 255, 255, 0.5)',
            backgroundColor: !isAssisted ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
            border: !isAssisted ? '2px solid #29BD98' : '2px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            outline: 'none',
            whiteSpace: 'nowrap'
          }}
        >
          I will provide
        </motion.button>

        {/* Assisted Button with Help Icon - Takes remaining space, shows full text */}
        <div style={{ 
          flex: 1, // Take remaining space
          position: 'relative',
          minWidth: isMobile ? '120px' : '140px', // Minimum width
          display: 'flex'
        }}>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => isAssisted || handleToggle()}
            style={{
              width: '100%',
              padding: isMobile ? '12px 34px 12px 16px' : '14px 44px 14px 20px',
              fontSize: isMobile ? '13px' : '14px',
              fontWeight: '600',
              color: isAssisted ? '#FFFFFF' : 'rgba(255, 255, 255, 0.5)',
              background: isAssisted 
                ? 'linear-gradient(135deg, #29BD98 0%, #2497F9 100%)'
                : 'transparent',
              border: isAssisted ? 'none' : '2px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              outline: 'none',
              textAlign: 'left',
              lineHeight: '1.4',
              wordWrap: 'break-word',
              overflow: 'visible', // Show full text
              display: 'flex',
              alignItems: 'center'
            }}
          >
            {assistedLabel}
          </motion.button>

          {/* Help Icon - Fixed to be perfectly circular */}
          {tooltipText && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowTooltip(!showTooltip);
              }}
              style={{
                position: 'absolute',
                right: isMobile ? '8px' : '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: isMobile ? '20px' : '24px',
                height: isMobile ? '20px' : '24px',
                minWidth: isMobile ? '20px' : '24px',
                minHeight: isMobile ? '20px' : '24px',
                borderRadius: '50%',
                backgroundColor: isAssisted ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                border: isAssisted ? '1px solid rgba(255, 255, 255, 0.3)' : '1px solid rgba(255, 255, 255, 0.1)',
                color: isAssisted ? '#FFFFFF' : 'rgba(255, 255, 255, 0.5)',
                fontSize: isMobile ? '11px' : '12px',
                fontWeight: '700',
                cursor: 'help',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                outline: 'none',
                transition: 'all 0.2s ease',
                padding: 0,
                lineHeight: 1,
                flexShrink: 0
              }}
            >
              ?
            </button>
          )}

          {/* Tooltip */}
          <AnimatePresence>
            {showTooltip && tooltipText && (
              <motion.div
                ref={tooltipRef}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 8px)',
                  right: 0,
                  zIndex: 100,
                  maxWidth: isMobile ? '240px' : '280px',
                  padding: '12px 16px',
                  backgroundColor: 'rgba(21, 41, 58, 0.98)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '12px',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
                  backdropFilter: 'blur(10px)'
                }}
              >
                <p style={{
                  fontSize: '13px',
                  color: 'rgba(255, 255, 255, 0.9)',
                  lineHeight: '1.5',
                  margin: 0
                }}>
                  {tooltipText}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AssistedToggle;
