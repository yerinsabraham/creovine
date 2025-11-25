import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useProject } from '../context/ProjectContext';
import { useCart } from '../context/CartContext';
import { useIsMobile } from '../hooks/useMediaQuery';
import { 
  FaCode, FaLaptopCode, FaPaintBrush, FaFileContract, FaBug, 
  FaPlug, FaQrcode, FaDatabase, FaLock, FaCreditCard, 
  FaRocket, FaTools, FaCheckCircle, FaEdit 
} from 'react-icons/fa';

const MultiServiceSummary = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { projectData, submitProject } = useProject();
  const { items, getTotalPrice } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const serviceIcons = {
    'full-stack': FaCode,
    'frontend': FaLaptopCode,
    'backend': FaCode,
    'landing-page': FaLaptopCode,
    'design': FaPaintBrush,
    'smart-contract': FaFileContract,
    'bug-fix': FaBug,
    'api': FaPlug,
    'qr-code': FaQrcode,
    'database': FaDatabase,
    'auth': FaLock,
    'payment': FaCreditCard,
    'deployment': FaRocket,
    'refactor': FaTools
  };

  const serviceColors = {
    'full-stack': '#8B5CF6',
    'frontend': '#3B82F6',
    'backend': '#10B981',
    'landing-page': '#F59E0B',
    'design': '#EC4899',
    'smart-contract': '#14B8A6',
    'bug-fix': '#EF4444',
    'api': '#06B6D4',
    'qr-code': '#8B5CF6',
    'database': '#10B981',
    'auth': '#F59E0B',
    'payment': '#EC4899',
    'deployment': '#06B6D4',
    'refactor': '#F59E0B'
  };

  useEffect(() => {
    // Redirect if no completed services
    if (!projectData.completedServices || projectData.completedServices.length === 0) {
      navigate('/get-started');
    }
  }, [projectData, navigate]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Navigate to quote page to show pricing estimate
      navigate('/quote');
    } catch (error) {
      console.error('Error navigating to quote:', error);
      alert('Failed to load quote. Please try again.');
      setIsSubmitting(false);
    }
  };

  const handleEditService = (service) => {
    // Navigate to the first step of that service
    const serviceRoute = projectData.primaryService?.id === service.id 
      ? projectData.primaryService.route 
      : projectData.addOns?.find(a => a.id === service.id)?.route;
    
    if (serviceRoute) {
      navigate(serviceRoute);
    }
  };

  const completedServices = projectData.completedServices || [];
  const totalPrice = getTotalPrice();

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FAFAFA' }}>
      {/* Header */}
      <div style={{ 
        padding: isMobile ? '12px 16px' : '16px 24px', 
        borderBottom: '1px solid #eee', 
        backgroundColor: 'white',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ fontSize: isMobile ? '18px' : '20px', fontWeight: '600', color: '#111', margin: 0 }}>
            Project Summary
          </h2>
          <div style={{ fontSize: '14px', color: '#666' }}>
            {completedServices.length} {completedServices.length === 1 ? 'Service' : 'Services'}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: isMobile ? '24px 16px' : '40px 24px' 
      }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Title */}
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h1 style={{ 
              fontSize: isMobile ? '28px' : '36px', 
              fontWeight: '600', 
              color: '#111', 
              marginBottom: '12px' 
            }}>
              Review Your Project
            </h1>
            <p style={{ fontSize: '16px', color: '#666' }}>
              Review the services you've configured before submitting
            </p>
          </div>

          {/* Completed Services */}
          <div style={{ marginBottom: '40px' }}>
            {completedServices.map((service, index) => {
              const Icon = serviceIcons[service.id] || FaCode;
              const color = serviceColors[service.id] || '#8B5CF6';
              const isPrimary = projectData.primaryService?.id === service.id;

              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  style={{
                    backgroundColor: 'white',
                    borderRadius: '16px',
                    padding: isMobile ? '20px' : '24px',
                    marginBottom: '16px',
                    border: isPrimary ? `2px solid ${color}` : '1px solid #E5E7EB',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  {/* Primary badge */}
                  {isPrimary && (
                    <div style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      backgroundColor: color,
                      color: 'white',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '11px',
                      fontWeight: '600'
                    }}>
                      PRIMARY
                    </div>
                  )}

                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                    {/* Icon */}
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '12px',
                      backgroundColor: `${color}15`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <Icon style={{ fontSize: '24px', color }} />
                    </div>

                    {/* Content */}
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111', margin: 0 }}>
                          {projectData.primaryService?.id === service.id 
                            ? projectData.primaryService.name 
                            : projectData.addOns?.find(a => a.id === service.id)?.name}
                        </h3>
                        <FaCheckCircle style={{ color: '#10B981', fontSize: '16px' }} />
                      </div>

                      {/* Service-specific summary */}
                      <div style={{ fontSize: '14px', color: '#666', marginBottom: '12px' }}>
                        {service.data && (
                          <div style={{ 
                            display: 'grid', 
                            gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', 
                            gap: '8px',
                            marginTop: '12px'
                          }}>
                            {Object.entries(service.data).slice(0, 4).map(([key, value]) => {
                              if (typeof value === 'object' && value !== null) return null;
                              if (key === 'files' || key === 'logoFile') return null;
                              
                              return (
                                <div key={key} style={{ 
                                  fontSize: '13px',
                                  padding: '8px 12px',
                                  backgroundColor: '#F9FAFB',
                                  borderRadius: '8px'
                                }}>
                                  <span style={{ color: '#9CA3AF', textTransform: 'capitalize' }}>
                                    {key.replace(/([A-Z])/g, ' $1').trim()}:
                                  </span>{' '}
                                  <span style={{ color: '#374151', fontWeight: '500' }}>
                                    {Array.isArray(value) ? value.join(', ') : String(value).substring(0, 50)}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      {/* Edit button */}
                      <button
                        onClick={() => handleEditService(service)}
                        style={{
                          backgroundColor: 'transparent',
                          border: `1px solid ${color}`,
                          color: color,
                          padding: '8px 16px',
                          borderRadius: '8px',
                          fontSize: '13px',
                          fontWeight: '500',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = `${color}10`;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                      >
                        <FaEdit /> Edit
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Cart Summary */}
          {items.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: completedServices.length * 0.1 + 0.2 }}
              style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                padding: isMobile ? '20px' : '24px',
                marginBottom: '32px',
                border: '1px solid #E5E7EB'
              }}
            >
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111', marginBottom: '16px' }}>
                Additional Services
              </h3>
              <div style={{ marginBottom: '16px' }}>
                {items.map((item, index) => (
                  <div 
                    key={index}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '12px 0',
                      borderBottom: index < items.length - 1 ? '1px solid #F3F4F6' : 'none'
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: '500', color: '#111' }}>
                        {item.name}
                      </div>
                      {item.description && (
                        <div style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '4px' }}>
                          {item.description}
                        </div>
                      )}
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: '#111' }}>
                      ${item.price}
                    </div>
                  </div>
                ))}
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingTop: '16px',
                borderTop: '2px solid #E5E7EB'
              }}>
                <span style={{ fontSize: '16px', fontWeight: '600', color: '#111' }}>Total</span>
                <span style={{ fontSize: '20px', fontWeight: '700', color: '#29BD98' }}>${totalPrice}</span>
              </div>
            </motion.div>
          )}

          {/* Submit Button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: completedServices.length * 0.1 + 0.4 }}
          >
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              style={{
                width: '100%',
                padding: '18px 32px',
                backgroundColor: isSubmitting ? '#9CA3AF' : '#29BD98',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              {isSubmitting ? (
                <>
                  <div style={{
                    width: '16px',
                    height: '16px',
                    border: '2px solid white',
                    borderTopColor: 'transparent',
                    borderRadius: '50%',
                    animation: 'spin 0.6s linear infinite'
                  }} />
                  Submitting...
                </>
              ) : (
                <>
                  <FaCheckCircle />
                  Submit Project
                </>
              )}
            </button>
          </motion.div>
        </motion.div>
      </div>

      <style>
        {`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default MultiServiceSummary;
