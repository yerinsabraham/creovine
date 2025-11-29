import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useProject } from '../../../context/ProjectContext';
import { useAuth } from '../../../context/AuthContext';
import { useIsMobile } from '../../../hooks/useMediaQuery';
import OnboardingLayout from '../../../components/common/OnboardingLayout';
import ChipGroup from '../../../components/common/ChipGroup';
import AssistedToggle from '../../../components/common/AssistedToggle';
import { useCart } from '../../../context/CartContext';
import CartSummary from '../../../components/common/CartSummary';

const WebsiteUpgradeStep1 = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const { projectData, updateProjectData } = useProject();
  const { addItem, removeItem, items } = useCart();
  const isMobile = useIsMobile();
  
  const themeColor = '#8B5CF6';
  
  const [formData, setFormData] = useState({
    websiteName: projectData?.websiteUpgrade?.websiteName || '',
    currentUrl: projectData?.websiteUpgrade?.currentUrl || '',
    updateType: projectData?.websiteUpgrade?.updateType || '',
    hasAccess: projectData?.websiteUpgrade?.hasAccess || ''
  });

  const [needsHelp, setNeedsHelp] = useState(
    items.some(item => item.id === 'website-upgrade-consultation')
  );

  const updateTypeOptions = [
    { id: 'redesign', label: 'Complete Redesign' },
    { id: 'feature-add', label: 'Add New Features' },
    { id: 'modernize', label: 'Modernize/Refresh' },
    { id: 'performance', label: 'Performance Upgrade' },
    { id: 'fix-issues', label: 'Fix Issues & Bugs' },
    { id: 'seo', label: 'SEO Optimization' },
    { id: 'mobile', label: 'Mobile Responsiveness' },
    { id: 'security', label: 'Security Update' }
  ];

  const accessOptions = [
    { id: 'full', label: 'Yes, full access' },
    { id: 'partial', label: 'Partial access' },
    { id: 'none', label: 'No access yet' }
  ];

  // Toggle assistance
  React.useEffect(() => {
    const itemId = 'website-upgrade-consultation';
    const itemExists = items.some(item => item.id === itemId);

    if (needsHelp && !itemExists) {
      addItem({
        id: itemId,
        name: 'Website Upgrade Consultation',
        price: 150,
        description: 'Expert consultation for your website upgrade',
        category: 'assistance'
      });
    } else if (!needsHelp && itemExists) {
      removeItem(itemId);
    }
  }, [needsHelp, items, addItem, removeItem]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleContinue = async () => {
    await updateProjectData({ 
      websiteUpgrade: formData 
    });
    navigate('/onboarding/website-upgrade/step2');
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const isValid = formData.websiteName.trim() && 
                  formData.currentUrl.trim() && 
                  formData.updateType && 
                  formData.hasAccess;

  return (
    <OnboardingLayout
      currentUser={currentUser}
      onLogout={handleLogout}
      isMobile={isMobile}
    >
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: '32px', textAlign: 'center' }}
        >
          <h1 style={{
            fontSize: isMobile ? '28px' : '36px',
            fontWeight: '800',
            background: `linear-gradient(135deg, ${themeColor}, ${themeColor}CC)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '12px'
          }}>
            Website Update/Upgrade
          </h1>
          <p style={{
            fontSize: '16px',
            color: 'rgba(255, 255, 255, 0.7)',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            Tell us about your website and what improvements you need
          </p>
        </motion.div>

        {/* Form Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{
            backgroundColor: '#1A2332',
            borderRadius: '24px',
            padding: isMobile ? '24px' : '40px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            marginBottom: '24px'
          }}
        >
          {/* Website Name */}
          <div style={{ marginBottom: '32px' }}>
            <label style={{
              display: 'block',
              fontSize: '16px',
              fontWeight: '700',
              color: '#FFFFFF',
              marginBottom: '12px'
            }}>
              Website Name *
            </label>
            <input
              type="text"
              id="website-name"
              name="websiteName"
              value={formData.websiteName}
              onChange={(e) => handleInputChange('websiteName', e.target.value)}
              placeholder="e.g., My Business Website"
              style={{
                width: '100%',
                padding: '16px',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                color: '#FFFFFF',
                fontSize: '15px',
                outline: 'none',
                transition: 'all 0.2s',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.borderColor = themeColor}
              onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
            />
          </div>

          {/* Current URL */}
          <div style={{ marginBottom: '32px' }}>
            <label style={{
              display: 'block',
              fontSize: '16px',
              fontWeight: '700',
              color: '#FFFFFF',
              marginBottom: '12px'
            }}>
              Current Website URL *
            </label>
            <input
              type="url"
              id="website-url"
              name="currentUrl"
              value={formData.currentUrl}
              onChange={(e) => handleInputChange('currentUrl', e.target.value)}
              placeholder="https://yourwebsite.com"
              style={{
                width: '100%',
                padding: '16px',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                color: '#FFFFFF',
                fontSize: '15px',
                outline: 'none',
                transition: 'all 0.2s',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.borderColor = themeColor}
              onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
            />
            <p style={{
              fontSize: '13px',
              color: 'rgba(255, 255, 255, 0.5)',
              marginTop: '8px'
            }}>
              If your website is not live yet, enter your staging URL or write "Not live yet"
            </p>
          </div>

          {/* Update Type */}
          <div style={{ marginBottom: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <label style={{ fontSize: '16px', fontWeight: '700', color: '#FFFFFF' }}>
                What type of update do you need? *
              </label>
              <AssistedToggle
                enabled={needsHelp}
                onToggle={setNeedsHelp}
                price={150}
                label="Need help deciding?"
              />
            </div>
            <ChipGroup
              options={updateTypeOptions}
              selected={formData.updateType}
              onChange={(value) => handleInputChange('updateType', value)}
              themeColor={themeColor}
              multiSelect={false}
            />
          </div>

          {/* Access Level */}
          <div style={{ marginBottom: '32px' }}>
            <label style={{
              display: 'block',
              fontSize: '16px',
              fontWeight: '700',
              color: '#FFFFFF',
              marginBottom: '12px'
            }}>
              Do you have access to the website's code/hosting? *
            </label>
            <ChipGroup
              options={accessOptions}
              selected={formData.hasAccess}
              onChange={(value) => handleInputChange('hasAccess', value)}
              themeColor={themeColor}
              multiSelect={false}
            />
            <p style={{
              fontSize: '13px',
              color: 'rgba(255, 255, 255, 0.5)',
              marginTop: '8px'
            }}>
              This helps us understand how we'll implement the changes
            </p>
          </div>
        </motion.div>

        {/* Cart Summary */}
        <CartSummary isMobile={isMobile} />

        {/* Navigation Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          style={{
            display: 'flex',
            gap: '16px',
            marginTop: '32px'
          }}
        >
          <button
            onClick={() => navigate('/solution-hub')}
            style={{
              flex: 1,
              padding: '16px',
              backgroundColor: 'transparent',
              border: '2px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '12px',
              color: '#FFFFFF',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            Back
          </button>
          <button
            onClick={handleContinue}
            disabled={!isValid}
            style={{
              flex: 2,
              padding: '16px',
              background: isValid 
                ? `linear-gradient(135deg, ${themeColor}, ${themeColor}CC)` 
                : 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              borderRadius: '12px',
              color: isValid ? '#FFFFFF' : 'rgba(255, 255, 255, 0.3)',
              fontSize: '16px',
              fontWeight: '700',
              cursor: isValid ? 'pointer' : 'not-allowed',
              transition: 'all 0.2s'
            }}
          >
            Continue →
          </button>
        </motion.div>
      </div>
    </OnboardingLayout>
  );
};

export default WebsiteUpgradeStep1;
