import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useProject } from '../context/ProjectContext';
import { useIsMobile } from '../hooks/useMediaQuery';
import { formatCurrency } from '../utils/pricingCalculator';
import { useLocation } from '../context/LocationContext';

const CheckoutPage = () => {
  const { projectData, submitProject } = useProject();
  const { paymentProvider, currency, location: userLocation } = useLocation();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  const estimate = projectData?.phases?.estimate;
  
  // Payment method based on user location
  const [paymentMethod, setPaymentMethod] = useState(paymentProvider || 'stripe');

  const handleCheckout = async () => {
    setLoading(true);
    
    try {
      // Submit project first
      await submitProject();
      
      // Simulate payment processing
      // In production, integrate with Stripe/Paystack APIs
      setTimeout(() => {
        navigate('/success', {
          state: {
            paid: true,
            amount: estimate?.total,
            paymentMethod
          }
        });
      }, 2000);
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Payment failed. Please try again.');
      setLoading(false);
    }
  };

  if (!estimate) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#0F1C2E',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#FFFFFF'
      }}>
        <div>
          <div style={{ fontSize: '48px', marginBottom: '16px', textAlign: 'center' }}>⚠️</div>
          <p style={{ fontSize: '18px' }}>No estimate found. Please go back to the quote page.</p>
          <button
            onClick={() => navigate('/quote')}
            style={{
              marginTop: '24px',
              backgroundColor: '#29BD98',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 24px',
              cursor: 'pointer'
            }}
          >
            Go to Quote
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0F1C2E',
      padding: isMobile ? '40px 20px' : '60px 40px'
    }}>
      <div style={{ maxWidth: '700px', margin: '0 auto' }}>
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: 'center', marginBottom: '48px' }}
        >
          <h1 style={{
            fontSize: isMobile ? '32px' : '48px',
            fontWeight: '800',
            color: '#FFFFFF',
            marginBottom: '16px'
          }}>
            Checkout
          </h1>
          <p style={{
            fontSize: '16px',
            color: 'rgba(255, 255, 255, 0.7)'
          }}>
            Complete your payment to start your project
          </p>
        </motion.div>

        {/* Order Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{
            backgroundColor: '#15293A',
            borderRadius: '16px',
            padding: isMobile ? '24px 20px' : '32px',
            marginBottom: '24px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        >
          <h3 style={{
            fontSize: '18px',
            fontWeight: '700',
            color: '#FFFFFF',
            marginBottom: '20px'
          }}>
            Order Summary
          </h3>
          
          {estimate.breakdown.map((item, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '12px 0',
                borderBottom: index < estimate.breakdown.length - 1 ? '1px solid rgba(255, 255, 255, 0.1)' : 'none'
              }}
            >
              <span style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '15px' }}>
                {item.serviceName}
              </span>
              <span style={{ color: '#FFFFFF', fontSize: '15px', fontWeight: '600' }}>
                {formatCurrency(item.localPrice || item.price, estimate.currency)}
              </span>
            </div>
          ))}
          
          {estimate.discount > 0 && (
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '12px 0',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              marginTop: '12px'
            }}>
              <span style={{ color: '#29BD98', fontSize: '15px' }}>
                Discount
              </span>
              <span style={{ color: '#29BD98', fontSize: '15px', fontWeight: '600' }}>
                -{formatCurrency(estimate.discount, estimate.currency)}
              </span>
            </div>
          )}
          
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '20px 0 0 0',
            borderTop: '2px solid rgba(255, 255, 255, 0.2)',
            marginTop: '12px'
          }}>
            <span style={{ color: '#FFFFFF', fontSize: '18px', fontWeight: '700' }}>
              Total
            </span>
            <span style={{
              color: '#29BD98',
              fontSize: '28px',
              fontWeight: '800'
            }}>
              {formatCurrency(estimate.total, estimate.currency)}
            </span>
          </div>
        </motion.div>

        {/* Payment Method */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{
            backgroundColor: '#15293A',
            borderRadius: '16px',
            padding: isMobile ? '24px 20px' : '32px',
            marginBottom: '24px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        >
          <h3 style={{
            fontSize: '18px',
            fontWeight: '700',
            color: '#FFFFFF',
            marginBottom: '8px'
          }}>
            Payment Method
          </h3>
          
          {/* Location-based payment info */}
          {currency?.code === 'NGN' && (
            <div style={{
              marginBottom: '16px',
              padding: '12px',
              backgroundColor: 'rgba(41, 189, 152, 0.1)',
              borderRadius: '8px',
              border: '1px solid rgba(41, 189, 152, 0.3)'
            }}>
              <p style={{ fontSize: '14px', color: '#29BD98', margin: 0 }}>
                🇳🇬 You're getting special Nigeria pricing! Payment via Paystack (recommended)
              </p>
            </div>
          )}
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* Nigerian users - Show Paystack as primary */}
            {paymentProvider === 'paystack' ? (
              <>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '16px',
                  backgroundColor: paymentMethod === 'paystack' ? 'rgba(41, 189, 152, 0.1)' : 'rgba(255, 255, 255, 0.03)',
                  border: paymentMethod === 'paystack' ? '2px solid #29BD98' : '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  cursor: 'pointer'
                }}>
                  <input
                    type="radio"
                    name="payment"
                    value="paystack"
                    checked={paymentMethod === 'paystack'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    style={{ marginRight: '12px' }}
                  />
                  <div>
                    <div style={{ color: '#FFFFFF', fontSize: '15px', fontWeight: '600' }}>
                      🏦 Paystack (Recommended)
                    </div>
                    <div style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.6)', marginTop: '4px' }}>
                      Bank Transfer, Cards, USSD - All Nigeria payment methods
                    </div>
                  </div>
                </label>
                
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '16px',
                  backgroundColor: paymentMethod === 'stripe' ? 'rgba(41, 189, 152, 0.1)' : 'rgba(255, 255, 255, 0.03)',
                  border: paymentMethod === 'stripe' ? '2px solid #29BD98' : '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  cursor: 'pointer'
                }}>
                  <input
                    type="radio"
                    name="payment"
                    value="stripe"
                    checked={paymentMethod === 'stripe'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    style={{ marginRight: '12px' }}
                  />
                  <div>
                    <div style={{ color: '#FFFFFF', fontSize: '15px', fontWeight: '600' }}>
                      💳 International Card (Stripe)
                    </div>
                    <div style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.6)', marginTop: '4px' }}>
                      Visa, Mastercard, American Express
                    </div>
                  </div>
                </label>
              </>
            ) : (
              /* Non-Nigerian users - Show Stripe and Crypto */
              <>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '16px',
                  backgroundColor: paymentMethod === 'stripe' ? 'rgba(41, 189, 152, 0.1)' : 'rgba(255, 255, 255, 0.03)',
                  border: paymentMethod === 'stripe' ? '2px solid #29BD98' : '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  opacity: 0.5
                }}>
                  <input
                    type="radio"
                    name="payment"
                    value="stripe"
                    checked={paymentMethod === 'stripe'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    style={{ marginRight: '12px' }}
                    disabled
                  />
                  <div>
                    <div style={{ color: '#FFFFFF', fontSize: '15px', fontWeight: '600' }}>
                      💳 Credit Card
                    </div>
                    <div style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.6)', marginTop: '4px' }}>
                      International card payments coming soon
                    </div>
                  </div>
                </label>
                
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '16px',
                  backgroundColor: paymentMethod === 'crypto' ? 'rgba(41, 189, 152, 0.1)' : 'rgba(255, 255, 255, 0.03)',
                  border: paymentMethod === 'crypto' ? '2px solid #29BD98' : '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  cursor: 'pointer'
                }}>
                  <input
                    type="radio"
                    name="payment"
                    value="crypto"
                    checked={paymentMethod === 'crypto'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    style={{ marginRight: '12px' }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span style={{ color: '#FFFFFF', fontSize: '15px', fontWeight: '600' }}>
                        🪙 Crypto Payment
                      </span>
                      <span style={{
                        fontSize: '11px',
                        color: '#29BD98',
                        backgroundColor: 'rgba(41, 189, 152, 0.15)',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontWeight: '600'
                      }}>
                        EARLY ACCESS
                      </span>
                    </div>
                    <div style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.6)' }}>
                      Pay with USDT or USDC
                    </div>
                  </div>
                </label>
                
                {/* Hidden Paystack option for non-Nigerians */}
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '16px',
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  cursor: 'not-allowed',
                  opacity: 0.4
                }}>
                  <input
                    type="radio"
                    name="payment"
                    value="paystack"
                    checked={false}
                    onChange={() => {}}
                    style={{ marginRight: '12px' }}
                    disabled
                  />
                  <div>
                    <div style={{ color: '#FFFFFF', fontSize: '15px', fontWeight: '600' }}>
                      🏦 Paystack
                    </div>
                    <div style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.6)', marginTop: '4px' }}>
                      Available for Nigerian payments only
                    </div>
                  </div>
                </label>
              </>
            )}
          </div>
          
          {/* Crypto Payment Details (shown when crypto selected) */}
          {paymentMethod === 'crypto' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              style={{
                marginTop: '16px',
                padding: '20px',
                backgroundColor: 'rgba(41, 189, 152, 0.05)',
                borderRadius: '12px',
                border: '1px solid rgba(41, 189, 152, 0.2)'
              }}
            >
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#FFFFFF', marginBottom: '8px' }}>
                  Select Cryptocurrency
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <label style={{
                    flex: 1,
                    padding: '12px',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '2px solid #29BD98',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    textAlign: 'center'
                  }}>
                    <input type="radio" name="crypto" value="usdt" defaultChecked style={{ display: 'none' }} />
                    <div style={{ fontSize: '13px', fontWeight: '600', color: '#FFFFFF' }}>USDT</div>
                    <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.6)', marginTop: '2px' }}>Tether</div>
                  </label>
                  <label style={{
                    flex: 1,
                    padding: '12px',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    textAlign: 'center'
                  }}>
                    <input type="radio" name="crypto" value="usdc" style={{ display: 'none' }} />
                    <div style={{ fontSize: '13px', fontWeight: '600', color: '#FFFFFF' }}>USDC</div>
                    <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.6)', marginTop: '2px' }}>USD Coin</div>
                  </label>
                </div>
              </div>
              <div style={{
                fontSize: '13px',
                color: 'rgba(255, 255, 255, 0.7)',
                padding: '12px',
                backgroundColor: 'rgba(0, 0, 0, 0.2)',
                borderRadius: '8px'
              }}>
                <div style={{ marginBottom: '8px' }}>
                  💡 <strong>How crypto payment works:</strong>
                </div>
                <div style={{ paddingLeft: '20px', lineHeight: '1.6' }}>
                  1. You'll receive a wallet address<br />
                  2. Send exact USD amount in USDT/USDC<br />
                  3. We confirm payment within 10 minutes<br />
                  4. Your project starts immediately
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Checkout Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: loading ? 1 : 1.02 }}
          whileTap={{ scale: loading ? 1 : 0.98 }}
          onClick={handleCheckout}
          disabled={loading}
          style={{
            width: '100%',
            backgroundColor: loading ? 'rgba(41, 189, 152, 0.5)' : '#29BD98',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '50px',
            padding: '20px',
            fontSize: '18px',
            fontWeight: '700',
            cursor: loading ? 'not-allowed' : 'pointer',
            boxShadow: '0 4px 20px rgba(41, 189, 152, 0.3)',
            marginBottom: '16px'
          }}
        >
          {loading ? 'Processing...' : `Pay ${formatCurrency(estimate.total, estimate.currency)}`}
        </motion.button>

        <p style={{
          textAlign: 'center',
          fontSize: '13px',
          color: 'rgba(255, 255, 255, 0.5)'
        }}>
          🔒 Secure payment • Your information is encrypted and protected
        </p>
      </div>
    </div>
  );
};

export default CheckoutPage;
