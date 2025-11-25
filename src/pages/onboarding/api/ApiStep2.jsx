import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useProject } from '../../../context/ProjectContext';
import { useCart } from '../../../context/CartContext';
import ChipGroup from '../../../components/common/ChipGroup';
import AssistedToggle from '../../../components/common/AssistedToggle';
import CartSummary from '../../../components/common/CartSummary';

const ApiStep2 = () => {
  const navigate = useNavigate();
  const { projectData, updateProjectData } = useProject();
  const { addItem, removeItem, items } = useCart();
  
  // Theme color for API Integration - teal
  const themeColor = '#14B8A6';
  
  // Form state
  const [authMethod, setAuthMethod] = useState(projectData?.api?.authMethod || '');
  const [dataFormat, setDataFormat] = useState(projectData?.api?.dataFormat || '');
  const [endpoints, setEndpoints] = useState(projectData?.api?.endpoints || '');
  const [rateLimit, setRateLimit] = useState(projectData?.api?.rateLimit || '');
  
  // Assisted toggles
  const [authSetupAssist, setAuthSetupAssist] = useState(
    items.some(item => item.id === 'api-auth-assist')
  );

  const authMethodOptions = [
    { id: 'apikey', label: 'API Key' },
    { id: 'oauth2', label: 'OAuth 2.0' },
    { id: 'jwt', label: 'JWT Token' },
    { id: 'basic', label: 'Basic Auth' },
    { id: 'bearer', label: 'Bearer Token' },
    { id: 'none', label: 'No Auth (Public)' },
    { id: 'custom', label: 'Custom Auth' }
  ];

  const dataFormatOptions = [
    { id: 'json', label: 'JSON' },
    { id: 'xml', label: 'XML' },
    { id: 'graphql', label: 'GraphQL' },
    { id: 'protobuf', label: 'Protocol Buffers' },
    { id: 'csv', label: 'CSV/Flat File' },
    { id: 'form', label: 'Form Data' },
    { id: 'mixed', label: 'Mixed Formats' }
  ];

  const rateLimitOptions = [
    { id: 'none', label: 'No Limits' },
    { id: 'low', label: 'Low (~100/min)' },
    { id: 'medium', label: 'Medium (~1000/min)' },
    { id: 'high', label: 'High (10K+/min)' },
    { id: 'unknown', label: 'Not Sure' }
  ];

  useEffect(() => {
    if (authSetupAssist) {
      addItem({
        id: 'api-auth-assist',
        name: 'Authentication Setup Help',
        description: 'Expert assistance with API authentication configuration',
        price: 45,
        category: 'API Integration'
      });
    } else {
      removeItem('api-auth-assist');
    }
  }, [authSetupAssist]);

  const handleContinue = () => {
    updateProjectData({
      api: {
        ...projectData?.api,
        authMethod,
        dataFormat,
        endpoints,
        rateLimit
      }
    });
    navigate('/onboarding/api/step3');
  };

  const isValid = authMethod && dataFormat;

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
          onClick={() => navigate('/onboarding/api/step1')}
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
          Step 2 of 3
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ height: '4px', backgroundColor: '#E5E7EB' }}>
        <motion.div 
          initial={{ width: '33%' }}
          animate={{ width: '66%' }}
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
              API Details
            </h1>
            <p style={{ color: '#666', marginBottom: '32px' }}>
              Tell us about the authentication and data requirements
            </p>

            {/* Authentication Method */}
            <div style={{ marginBottom: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <label style={{ fontSize: '16px', fontWeight: '500', color: '#333' }}>
                  Authentication method *
                </label>
                <AssistedToggle
                  enabled={authSetupAssist}
                  onToggle={setAuthSetupAssist}
                  price={45}
                  label="Auth setup help"
                />
              </div>
              <ChipGroup
                options={authMethodOptions}
                selected={authMethod}
                onChange={setAuthMethod}
                themeColor={themeColor}
              />
            </div>

            {/* Data Format */}
            <div style={{ marginBottom: '32px' }}>
              <label style={{ display: 'block', fontSize: '16px', fontWeight: '500', color: '#333', marginBottom: '12px' }}>
                Data format *
              </label>
              <ChipGroup
                options={dataFormatOptions}
                selected={dataFormat}
                onChange={setDataFormat}
                themeColor={themeColor}
              />
            </div>

            {/* Endpoints Description */}
            <div style={{ marginBottom: '32px' }}>
              <label style={{ display: 'block', fontSize: '16px', fontWeight: '500', color: '#333', marginBottom: '12px' }}>
                Which endpoints do you need?
              </label>
              <textarea
                value={endpoints}
                onChange={(e) => setEndpoints(e.target.value)}
                placeholder="Describe the API endpoints you need to integrate. For example:&#10;- GET /users - fetch user data&#10;- POST /orders - create new orders&#10;- PUT /products - update product info"
                style={{
                  width: '100%',
                  padding: '16px',
                  border: '1px solid #E5E7EB',
                  borderRadius: '12px',
                  fontSize: '15px',
                  minHeight: '140px',
                  resize: 'vertical',
                  outline: 'none',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* Rate Limits */}
            <div style={{ marginBottom: '32px' }}>
              <label style={{ display: 'block', fontSize: '16px', fontWeight: '500', color: '#333', marginBottom: '12px' }}>
                Expected request volume
              </label>
              <ChipGroup
                options={rateLimitOptions}
                selected={rateLimit}
                onChange={setRateLimit}
                themeColor={themeColor}
              />
            </div>

            {/* Continue Button */}
            <motion.button
              whileHover={{ scale: isValid ? 1.02 : 1 }}
              whileTap={{ scale: isValid ? 0.98 : 1 }}
              onClick={handleContinue}
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
              Continue
            </motion.button>
          </motion.div>
        </div>

        {/* Cart Summary Sidebar */}
        <CartSummary />
      </div>
    </div>
  );
};

export default ApiStep2;
