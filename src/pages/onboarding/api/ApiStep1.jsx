import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useProject } from '../../../context/ProjectContext';
import { useCart } from '../../../context/CartContext';
import ChipGroup from '../../../components/common/ChipGroup';
import AssistedToggle from '../../../components/common/AssistedToggle';
import CartSummary from '../../../components/common/CartSummary';

const ApiStep1 = () => {
  const navigate = useNavigate();
  const { projectData, updateProjectData } = useProject();
  const { addItem, removeItem, items } = useCart();
  
  // Theme color for API Integration - teal
  const themeColor = '#14B8A6';
  
  // Form state
  const [integrationType, setIntegrationType] = useState(projectData?.api?.integrationType || '');
  const [apiSource, setApiSource] = useState(projectData?.api?.apiSource || '');
  const [platform, setPlatform] = useState(projectData?.api?.platform || '');
  const [apiUrl, setApiUrl] = useState(projectData?.api?.apiUrl || '');
  
  // Assisted toggles
  const [apiSelectionAssist, setApiSelectionAssist] = useState(
    items.some(item => item.id === 'api-selection-assist')
  );

  const integrationTypeOptions = [
    { id: 'consume', label: 'Consume External API' },
    { id: 'build', label: 'Build New API' },
    { id: 'connect', label: 'Connect Two Systems' },
    { id: 'webhook', label: 'Webhook Integration' },
    { id: 'sdk', label: 'SDK/Library Integration' },
    { id: 'migration', label: 'API Migration' }
  ];

  const apiSourceOptions = [
    { id: 'payment', label: 'Payment (Stripe, PayPal)' },
    { id: 'social', label: 'Social Media APIs' },
    { id: 'maps', label: 'Maps & Location' },
    { id: 'email', label: 'Email Services' },
    { id: 'sms', label: 'SMS/Messaging' },
    { id: 'cloud', label: 'Cloud Services (AWS, GCP)' },
    { id: 'ai', label: 'AI/ML APIs (OpenAI, etc.)' },
    { id: 'crm', label: 'CRM (Salesforce, HubSpot)' },
    { id: 'custom', label: 'Custom/Proprietary API' },
    { id: 'other', label: 'Other' }
  ];

  const platformOptions = [
    { id: 'web', label: 'Web Application' },
    { id: 'mobile', label: 'Mobile App' },
    { id: 'backend', label: 'Backend Service' },
    { id: 'desktop', label: 'Desktop App' },
    { id: 'iot', label: 'IoT Device' },
    { id: 'multiple', label: 'Multiple Platforms' }
  ];

  useEffect(() => {
    if (apiSelectionAssist) {
      addItem({
        id: 'api-selection-assist',
        name: 'API Selection Consultation',
        description: 'Expert help choosing the right API for your needs',
        price: 30,
        category: 'API Integration'
      });
    } else {
      removeItem('api-selection-assist');
    }
  }, [apiSelectionAssist]);

  const handleContinue = () => {
    updateProjectData({
      api: {
        ...projectData?.api,
        integrationType,
        apiSource,
        platform,
        apiUrl
      }
    });
    navigate('/onboarding/api/step2');
  };

  const isValid = integrationType && apiSource && platform;

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
          onClick={() => navigate('/get-started')}
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
          Step 1 of 3
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ height: '4px', backgroundColor: '#E5E7EB' }}>
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: '33%' }}
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
              API Integration Type
            </h1>
            <p style={{ color: '#666', marginBottom: '32px' }}>
              What kind of API integration do you need?
            </p>

            {/* Integration Type */}
            <div style={{ marginBottom: '32px' }}>
              <label style={{ display: 'block', fontSize: '16px', fontWeight: '500', color: '#333', marginBottom: '12px' }}>
                What do you need? *
              </label>
              <ChipGroup
                options={integrationTypeOptions}
                selected={integrationType}
                onChange={setIntegrationType}
                themeColor={themeColor}
              />
            </div>

            {/* API Source */}
            <div style={{ marginBottom: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <label style={{ fontSize: '16px', fontWeight: '500', color: '#333' }}>
                  Which API or type? *
                </label>
                <AssistedToggle
                  enabled={apiSelectionAssist}
                  onToggle={setApiSelectionAssist}
                  price={30}
                  label="Help me choose"
                />
              </div>
              <ChipGroup
                options={apiSourceOptions}
                selected={apiSource}
                onChange={setApiSource}
                themeColor={themeColor}
              />
            </div>

            {/* Platform */}
            <div style={{ marginBottom: '32px' }}>
              <label style={{ display: 'block', fontSize: '16px', fontWeight: '500', color: '#333', marginBottom: '12px' }}>
                Where will this run? *
              </label>
              <ChipGroup
                options={platformOptions}
                selected={platform}
                onChange={setPlatform}
                themeColor={themeColor}
              />
            </div>

            {/* API URL/Documentation */}
            <div style={{ marginBottom: '32px' }}>
              <label style={{ display: 'block', fontSize: '16px', fontWeight: '500', color: '#333', marginBottom: '12px' }}>
                API Documentation URL (optional)
              </label>
              <input
                type="url"
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
                placeholder="https://api.example.com/docs"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  fontSize: '15px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
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

export default ApiStep1;
