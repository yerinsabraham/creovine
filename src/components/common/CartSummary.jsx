import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../context/CartContext';
import { useLocation } from '../../context/LocationContext';
import { useIsMobile } from '../../hooks/useMediaQuery';

const CartSummary = () => {
  const { cartItems, total, currency } = useCart();
  const { formatPrice } = useLocation();
  const [isExpanded, setIsExpanded] = useState(false);
  const isMobile = useIsMobile();

  // Don't show if cart is empty
  if (cartItems.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        position: 'fixed',
        bottom: isMobile ? '20px' : '32px',
        right: isMobile ? '20px' : '40px',
        zIndex: 999,
        minWidth: isMobile ? '280px' : '320px',
        maxWidth: isMobile ? 'calc(100vw - 40px)' : '400px'
      }}
    >
      {/* Collapsed View - Total Bar */}
      <motion.div
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          background: 'linear-gradient(135deg, #29BD98 0%, #2497F9 100%)',
          borderRadius: '16px',
          padding: '16px 20px',
          cursor: 'pointer',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
            fontWeight: '700',
            color: '#FFFFFF'
          }}>
            {cartItems.length}
          </div>
          <div>
            <div style={{
              fontSize: '12px',
              color: 'rgba(255, 255, 255, 0.8)',
              fontWeight: '500'
            }}>
              Assisted Services
            </div>
            <div style={{
              fontSize: '20px',
              fontWeight: '800',
              color: '#FFFFFF'
            }}>
              {formatPrice(total)}
            </div>
          </div>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          style={{
            fontSize: '20px',
            color: '#FFFFFF'
          }}
        >
          ▼
        </motion.div>
      </motion.div>

      {/* Expanded View - Item List */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              backgroundColor: 'rgba(21, 41, 58, 0.98)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              overflow: 'hidden',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
            }}
          >
            <div style={{
              padding: '16px 20px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <h3 style={{
                margin: 0,
                fontSize: '16px',
                fontWeight: '700',
                color: '#FFFFFF'
              }}>
                Cart Summary
              </h3>
            </div>

            {/* Cart Items */}
            <div style={{
              maxHeight: '300px',
              overflowY: 'auto',
              padding: '12px 20px'
            }}>
              {cartItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  style={{
                    padding: '12px 0',
                    borderBottom: index < cartItems.length - 1 
                      ? '1px solid rgba(255, 255, 255, 0.05)'
                      : 'none',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    gap: '12px'
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#FFFFFF',
                      marginBottom: '4px'
                    }}>
                      {item.label}
                    </div>
                    <div style={{
                      fontSize: '11px',
                      color: 'rgba(255, 255, 255, 0.5)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      {item.category}
                    </div>
                  </div>
                  <div style={{
                    fontSize: '15px',
                    fontWeight: '700',
                    color: '#29BD98',
                    whiteSpace: 'nowrap'
                  }}>
                    {formatPrice(item.localPrice || item.price)}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Total */}
            <div style={{
              padding: '16px 20px',
              borderTop: '2px solid rgba(255, 255, 255, 0.1)',
              background: 'linear-gradient(135deg, rgba(41, 189, 152, 0.1) 0%, rgba(36, 151, 249, 0.1) 100%)'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{
                  fontSize: '16px',
                  fontWeight: '700',
                  color: '#FFFFFF'
                }}>
                  Total
                </span>
                <span style={{
                  fontSize: '24px',
                  fontWeight: '800',
                  color: '#29BD98'
                }}>
                  {formatPrice(total)}
                </span>
              </div>
              <div style={{
                fontSize: '11px',
                color: 'rgba(255, 255, 255, 0.6)',
                marginTop: '8px',
                textAlign: 'center'
              }}>
                This will be added to your base project cost
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CartSummary;
