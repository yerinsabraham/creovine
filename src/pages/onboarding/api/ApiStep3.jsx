import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useProject } from '../../../context/ProjectContext';
import { useCart } from '../../../context/CartContext';
import { useMultiServiceComplete, useIsMultiService } from '../../../hooks/useMultiService';
import ChipGroup from '../../../components/common/ChipGroup';
import AssistedToggle from '../../../components/common/AssistedToggle';
import CartSummary from '../../../components/common/CartSummary';

const ApiStep3 = () => {
  const navigate = useNavigate();
  const { projectData, updateProjectData } = useProject();
  const { addItem, removeItem, items } = useCart();
  const handleMultiServiceComplete = useMultiServiceComplete('api');
  const isMultiService = useIsMultiService();
  
  // Theme color for API Integration - teal
  const themeColor = '#14B8A6';
  
  // Check for add-ons
  const addOns = projectData?.addOns || [];
  const hasBackend = addOns.some(a => a.id === 'backend');
  const hasFrontend = addOns.some(a => a.id === 'frontend');
  
  // Form state
  const [errorHandling, setErrorHandling] = useState(projectData?.api?.errorHandling || []);
  const [caching, setCaching] = useState(projectData?.api?.caching || '');
  const [documentation, setDocumentation] = useState(projectData?.api?.documentation || []);
  const [timeline, setTimeline] = useState(projectData?.api?.timeline || '');
  const [additionalNotes, setAdditionalNotes] = useState(projectData?.api?.additionalNotes || '');
  
  // Assisted toggles
  const [integrationSupport, setIntegrationSupport] = useState(
    items.some(item => item.id === 'api-integration-support')
  );

  const errorHandlingOptions = [
    { id: 'retry', label: 'Auto Retry' },
    { id: 'fallback', label: 'Fallback Values' },
    { id: 'circuit', label: 'Circuit Breaker' },
    { id: 'logging', label: 'Error Logging' },
    { id: 'alerts', label: 'Error Alerts' },
    { id: 'graceful', label: 'Graceful Degradation' }
  ];

  const cachingOptions = [
    { id: 'none', label: 'No Caching' },
    { id: 'memory', label: 'In-Memory Cache' },
    { id: 'redis', label: 'Redis Cache' },
    { id: 'cdn', label: 'CDN Cache' },
    { id: 'browser', label: 'Browser Cache' },
    { id: 'custom', label: 'Custom Strategy' }
  ];

  const documentationOptions = [
    { id: 'swagger', label: 'Swagger/OpenAPI' },
    { id: 'postman', label: 'Postman Collection' },
    { id: 'readme', label: 'README Guide' },
    { id: 'code', label: 'Code Examples' },
    { id: 'sdk', label: 'SDK Documentation' },
    { id: 'none', label: 'None Needed' }
  ];

  const timelineOptions = [
    { id: 'urgent', label: '1-2 days' },
    { id: 'standard', label: '1 week' },
    { id: 'relaxed', label: '2-3 weeks' },
    { id: 'flexible', label: 'Flexible' }
  ];

  useEffect(() => {
    if (integrationSupport) {
      addItem({
        id: 'api-integration-support',
        name: 'Integration Support',
        description: 'Ongoing support during and after API integration',
        price: 60,
        category: 'API Integration'
      });
    } else {
      removeItem('api-integration-support');
    }
  }, [integrationSupport]);

  const handleSubmit = async () => {
    try {
      const serviceData = { ...projectData?.api, errorHandling, caching, documentation, timeline, additionalNotes };
      await updateProjectData({ api: serviceData });
      
      if (isMultiService) {
        await handleMultiServiceComplete(serviceData);
      } else {
        navigate('/success');
      }
    } catch (error) {
      console.error('Submit error:', error);
    }
  };

  const isValid = timeline;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FAFAFA' }}>
      {/* Header */}
      <div style={{ 
        padding: '16px 24px', 
        borderBottom: '1px solid #eee',
        backgroundColor: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <button 
          onClick={() => navigate('/onboarding/api/step2')}
          style={{ 
            background: 'none', 
            border: 'none', 
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#666'
          }}
        >
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        <div style={{ fontSize: '14px', color: '#666' }}>
          Step 3 of 3
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ height: '4px', backgroundColor: '#E5E7EB' }}>
        <motion.div 
          initial={{ width: '66%' }}
          animate={{ width: '100%' }}
          style={{ height: '100%', backgroundColor: themeColor }}
        />
      </div>

      <div style={{ display: 'flex', maxWidth: '1400px', margin: '0 auto' }}>
        {/* Main Content */}
        <div style={{ flex: 1, padding: '40px', maxWidth: '900px' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 style={{ fontSize: '28px', fontWeight: '600', marginBottom: '8px', color: '#111' }}>
              Reliability & Delivery
            </h1>
            <p style={{ color: '#666', marginBottom: '32px' }}>
              Configure error handling, caching, and delivery timeline
            </p>

            {/* Add-on notices */}
            {(hasBackend || hasFrontend) && (
              <div style={{ 
                padding: '16px 20px',
                backgroundColor: 'rgba(20, 184, 166, 0.05)',
                border: '1px solid rgba(20, 184, 166, 0.2)',
                borderRadius: '12px',
                marginBottom: '24px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <svg width="18" height="18" fill={themeColor} viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                  <span style={{ fontWeight: '500', color: '#111' }}>Add-ons Connected</span>
                </div>
                <p style={{ fontSize: '14px', color: '#666', margin: 0 }}>
                  {hasBackend && hasFrontend 
                    ? 'Your API will integrate with both frontend and backend components'
                    : hasBackend 
                      ? 'Your API will integrate with your backend service'
                      : 'Your API will connect to your frontend application'
                  }
                </p>
              </div>
            )}

            {/* Error Handling */}
            <div style={{ marginBottom: '32px' }}>
              <label style={{ display: 'block', fontSize: '16px', fontWeight: '500', color: '#333', marginBottom: '12px' }}>
                Error handling requirements
              </label>
              <ChipGroup
                options={errorHandlingOptions}
                selected={errorHandling}
                onChange={setErrorHandling}
                multiple={true}
                themeColor={themeColor}
              />
            </div>

            {/* Caching */}
            <div style={{ marginBottom: '32px' }}>
              <label style={{ display: 'block', fontSize: '16px', fontWeight: '500', color: '#333', marginBottom: '12px' }}>
                Caching strategy
              </label>
              <ChipGroup
                options={cachingOptions}
                selected={caching}
                onChange={setCaching}
                themeColor={themeColor}
              />
            </div>

            {/* Documentation */}
            <div style={{ marginBottom: '32px' }}>
              <label style={{ display: 'block', fontSize: '16px', fontWeight: '500', color: '#333', marginBottom: '12px' }}>
                Documentation needed
              </label>
              <ChipGroup
                options={documentationOptions}
                selected={documentation}
                onChange={setDocumentation}
                multiple={true}
                themeColor={themeColor}
              />
            </div>

            {/* Timeline */}
            <div style={{ marginBottom: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <label style={{ fontSize: '16px', fontWeight: '500', color: '#333' }}>
                  Timeline *
                </label>
                <AssistedToggle
                  enabled={integrationSupport}
                  onToggle={setIntegrationSupport}
                  price={60}
                  label="Ongoing support"
                />
              </div>
              <ChipGroup
                options={timelineOptions}
                selected={timeline}
                onChange={setTimeline}
                themeColor={themeColor}
              />
            </div>

            {/* Additional Notes */}
            <div style={{ marginBottom: '32px' }}>
              <label style={{ display: 'block', fontSize: '16px', fontWeight: '500', color: '#333', marginBottom: '12px' }}>
                Additional requirements
              </label>
              <textarea
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
                placeholder="Any specific requirements, security considerations, or other details..."
                style={{
                  width: '100%',
                  padding: '16px',
                  border: '1px solid #E5E7EB',
                  borderRadius: '12px',
                  fontSize: '15px',
                  minHeight: '100px',
                  resize: 'vertical',
                  outline: 'none',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: isValid ? 1.02 : 1 }}
              whileTap={{ scale: isValid ? 0.98 : 1 }}
              onClick={handleSubmit}
              disabled={!isValid}
              style={{
                width: '100%',
                padding: '16px 32px',
                backgroundColor: isValid ? themeColor : '#E5E7EB',
                color: isValid ? 'white' : '#9CA3AF',
                border: 'none',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: isValid ? 'pointer' : 'not-allowed',
                marginTop: '24px'
              }}
            >
              Submit API Integration Request
            </motion.button>
          </motion.div>
        </div>

        {/* Cart Summary Sidebar */}
        <CartSummary />
      </div>
    </div>
  );
};

export default ApiStep3;
