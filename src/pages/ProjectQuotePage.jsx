import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useProject } from '../context/ProjectContext';
import { useIsMobile } from '../hooks/useMediaQuery';
import { calculateProjectEstimate, formatCurrency, getEstimatedTimeline } from '../utils/pricingCalculator';

const ProjectQuotePage = () => {
  const { projectData, updatePhaseData } = useProject();
  const [estimate, setEstimate] = useState(null);
  const [timeline, setTimeline] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  useEffect(() => {
    if (projectData) {
      const calculatedEstimate = calculateProjectEstimate(projectData);
      const calculatedTimeline = getEstimatedTimeline(calculatedEstimate);
      setEstimate(calculatedEstimate);
      setTimeline(calculatedTimeline);
      
      // Save estimate to project
      updatePhaseData('estimate', {
        ...calculatedEstimate,
        timeline: calculatedTimeline,
        createdAt: new Date().toISOString()
      });
      
      setLoading(false);
    }
  }, [projectData]);

  const handleProceedToPayment = () => {
    // Navigate to payment page (implement Stripe/Paystack checkout)
    navigate('/checkout');
  };

  const handleDiscussWithExpert = () => {
    // Find appropriate expert based on primary service
    const primaryService = projectData?.phases?.primaryService;
    if (!primaryService) return;

    // Navigate to expert chat with quote context
    navigate(`/expert-consultation`, {
      state: {
        estimate,
        primaryService,
        quoteId: projectData.id
      }
    });
  };

  if (loading || !estimate) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#0F1C2E',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ color: '#FFFFFF', fontSize: '18px' }}>Calculating your quote...</div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0F1C2E',
      padding: isMobile ? '40px 20px' : '60px 40px'
    }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: 'center', marginBottom: '48px' }}
        >
          <div style={{
            display: 'inline-block',
            backgroundColor: 'rgba(41, 189, 152, 0.1)',
            padding: '12px 24px',
            borderRadius: '50px',
            border: '1px solid rgba(41, 189, 152, 0.3)',
            marginBottom: '24px'
          }}>
            <span style={{ color: '#29BD98', fontSize: '14px', fontWeight: '600' }}>
              ✓ Onboarding Complete
            </span>
          </div>
          
          <h1 style={{
            fontSize: isMobile ? '32px' : '48px',
            fontWeight: '800',
            color: '#FFFFFF',
            marginBottom: '16px',
            lineHeight: '1.2'
          }}>
            Your Project Estimate
          </h1>
          
          <p style={{
            fontSize: isMobile ? '16px' : '18px',
            color: 'rgba(255, 255, 255, 0.7)',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            Based on your requirements, here's what we recommend
          </p>
        </motion.div>

        {/* Price Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{
            backgroundColor: '#15293A',
            borderRadius: '24px',
            padding: isMobile ? '32px 24px' : '48px',
            marginBottom: '32px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
          }}
        >
          
          {/* Total Price */}
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            {estimate.requiresConsultation && (
              <div style={{
                backgroundColor: 'rgba(255, 165, 0, 0.1)',
                padding: '8px 16px',
                borderRadius: '8px',
                marginBottom: '16px',
                display: 'inline-block'
              }}>
                <span style={{ color: '#FFA500', fontSize: '14px', fontWeight: '600' }}>
                  💬 Custom Pricing - Expert Consultation Required
                </span>
              </div>
            )}
            
            <div style={{
              fontSize: isMobile ? '16px' : '18px',
              color: 'rgba(255, 255, 255, 0.6)',
              marginBottom: '12px',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              {estimate.requiresConsultation ? 'Starting From' : 'Total Investment'}
            </div>
            
            <div style={{
              fontSize: isMobile ? '56px' : '72px',
              fontWeight: '800',
              background: 'linear-gradient(135deg, #29BD98 0%, #2497F9 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              lineHeight: '1'
            }}>
              {formatCurrency(estimate.total)}
            </div>
            
            {estimate.discount > 0 && (
              <div style={{ marginTop: '16px' }}>
                <span style={{
                  fontSize: '16px',
                  color: 'rgba(255, 255, 255, 0.5)',
                  textDecoration: 'line-through',
                  marginRight: '12px'
                }}>
                  {formatCurrency(estimate.subtotal)}
                </span>
                <span style={{
                  fontSize: '16px',
                  color: '#29BD98',
                  fontWeight: '600',
                  backgroundColor: 'rgba(41, 189, 152, 0.1)',
                  padding: '4px 12px',
                  borderRadius: '8px'
                }}>
                  Save {formatCurrency(estimate.discount)}
                </span>
              </div>
            )}
            
            <div style={{
              marginTop: '16px',
              fontSize: '14px',
              color: 'rgba(255, 255, 255, 0.6)'
            }}>
              Estimated delivery: <strong style={{ color: '#FFFFFF' }}>{timeline.display}</strong>
            </div>
          </div>

          {/* Service Breakdown */}
          <div style={{
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
            borderRadius: '16px',
            padding: isMobile ? '24px 20px' : '32px',
            marginBottom: '32px'
          }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '700',
              color: '#FFFFFF',
              marginBottom: '24px'
            }}>
              Service Breakdown
            </h3>
            
            {estimate.breakdown.map((item, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '16px 0',
                  borderBottom: index < estimate.breakdown.length - 1 ? '1px solid rgba(255, 255, 255, 0.1)' : 'none'
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#FFFFFF',
                    marginBottom: '4px'
                  }}>
                    {item.serviceName}
                    {item.requiresConsultation && (
                      <span style={{
                        marginLeft: '8px',
                        fontSize: '12px',
                        color: '#FFA500',
                        fontWeight: '500'
                      }}>
                        (Custom)
                      </span>
                    )}
                  </div>
                  <div style={{
                    fontSize: '13px',
                    color: 'rgba(255, 255, 255, 0.5)'
                  }}>
                    {item.complexityLabel} complexity
                  </div>
                </div>
                <div style={{
                  fontSize: '18px',
                  fontWeight: '700',
                  color: '#29BD98'
                }}>
                  {formatCurrency(item.price)}
                </div>
              </div>
            ))}
            
            {estimate.discount > 0 && (
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '16px 0',
                borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                marginTop: '16px'
              }}>
                <div style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#29BD98'
                }}>
                  Multi-Service Discount ({estimate.serviceCount} services)
                </div>
                <div style={{
                  fontSize: '18px',
                  fontWeight: '700',
                  color: '#29BD98'
                }}>
                  -{formatCurrency(estimate.discount)}
                </div>
              </div>
            )}
          </div>

          {/* What's Included */}
          <div style={{
            backgroundColor: 'rgba(41, 189, 152, 0.05)',
            borderRadius: '16px',
            padding: isMobile ? '24px 20px' : '32px',
            border: '1px solid rgba(41, 189, 152, 0.2)'
          }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '700',
              color: '#FFFFFF',
              marginBottom: '20px'
            }}>
              What's Included
            </h3>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
              gap: '12px'
            }}>
              {[
                '✓ Full source code ownership',
                '✓ GitHub repository access',
                '✓ Complete documentation',
                '✓ 2 weeks free support',
                '✓ Deployment assistance',
                '✓ Unlimited future edits'
              ].map((item, index) => (
                <div
                  key={index}
                  style={{
                    fontSize: '14px',
                    color: 'rgba(255, 255, 255, 0.9)',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            gap: '16px',
            marginBottom: '32px'
          }}
        >
          {!estimate.requiresConsultation && (
            <motion.button
              whileHover={{ scale: 1.02, backgroundColor: '#1E9F7F' }}
              whileTap={{ scale: 0.98 }}
              onClick={handleProceedToPayment}
              style={{
                flex: 1,
                backgroundColor: '#29BD98',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '50px',
                padding: '18px 32px',
                fontSize: '17px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 4px 20px rgba(41, 189, 152, 0.3)'
              }}
            >
              Proceed to Payment →
            </motion.button>
          )}
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleDiscussWithExpert}
            style={{
              flex: 1,
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              color: '#FFFFFF',
              border: '2px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '50px',
              padding: '18px 32px',
              fontSize: '17px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            💬 Discuss with Expert
          </motion.button>
        </motion.div>

        {/* Trust Indicators */}
        <div style={{
          textAlign: 'center',
          fontSize: '13px',
          color: 'rgba(255, 255, 255, 0.5)'
        }}>
          <div style={{ marginBottom: '8px' }}>
            🔒 Secure payment • 💯 Money-back guarantee • ⚡ Fast delivery
          </div>
          <div>
            No credit card required to discuss with an expert
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectQuotePage;
