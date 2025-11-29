import { useState, useEffect } from 'react';
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

const WebsiteUpgradeStep2 = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const { projectData, updateProjectData } = useProject();
  const { addItem, removeItem, items } = useCart();
  const isMobile = useIsMobile();
  
  const themeColor = '#8B5CF6';
  
  const [formData, setFormData] = useState({
    features: projectData?.websiteUpgrade?.features || [],
    additionalDetails: projectData?.websiteUpgrade?.additionalDetails || ''
  });

  const [needsHelp, setNeedsHelp] = useState(
    items.some(item => item.id === 'website-upgrade-planning')
  );

  const featureOptions = [
    { id: 'new-pages', label: 'New Pages/Sections' },
    { id: 'performance', label: 'Performance Optimization' },
    { id: 'mobile-responsive', label: 'Mobile Responsiveness' },
    { id: 'seo', label: 'SEO Improvements' },
    { id: 'security', label: 'Security Updates' },
    { id: 'cms', label: 'Content Management System' },
    { id: 'ecommerce', label: 'E-commerce Integration' },
    { id: 'api', label: 'API Integrations' },
    { id: 'design-refresh', label: 'Design Refresh' },
    { id: 'analytics', label: 'Analytics Setup' },
    { id: 'blog', label: 'Blog/News Section' },
    { id: 'contact-forms', label: 'Contact/Lead Forms' },
    { id: 'social-media', label: 'Social Media Integration' },
    { id: 'search', label: 'Site Search' },
    { id: 'multilingual', label: 'Multi-language Support' },
    { id: 'accessibility', label: 'Accessibility (WCAG)' }
  ];

  // Toggle assistance
  useEffect(() => {
    const itemId = 'website-upgrade-planning';
    const itemExists = items.some(item => item.id === itemId);

    if (needsHelp && !itemExists) {
      addItem({
        id: itemId,
        name: 'Feature Planning Assistance',
        price: 200,
        description: 'Expert guidance on feature selection and planning',
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
      websiteUpgrade: {
        ...projectData?.websiteUpgrade,
        ...formData
      }
    });
    navigate('/onboarding/website-upgrade/step3');
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const isValid = formData.features.length > 0;

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
            What Features Do You Need?
          </h1>
          <p style={{
            fontSize: '16px',
            color: 'rgba(255, 255, 255, 0.7)',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            Select all the features and improvements you'd like for your website
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
          {/* Features Selection */}
          <div style={{ marginBottom: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <label style={{ fontSize: '16px', fontWeight: '700', color: '#FFFFFF' }}>
                Select Features to Add/Improve *
              </label>
              <AssistedToggle
                enabled={needsHelp}
                onToggle={setNeedsHelp}
                price={200}
                label="Need planning help?"
              />
            </div>
            <p style={{
              fontSize: '13px',
              color: 'rgba(255, 255, 255, 0.5)',
              marginBottom: '16px'
            }}>
              Choose all that apply
            </p>
            <ChipGroup
              options={featureOptions}
              selected={formData.features}
              onChange={(value) => handleInputChange('features', value)}
              themeColor={themeColor}
              multiSelect={true}
            />
          </div>

          {/* Additional Details */}
          <div style={{ marginBottom: '32px' }}>
            <label style={{
              display: 'block',
              fontSize: '16px',
              fontWeight: '700',
              color: '#FFFFFF',
              marginBottom: '12px'
            }}>
              Additional Details (Optional)
            </label>
            <textarea
              id="additional-details"
              name="additionalDetails"
              value={formData.additionalDetails}
              onChange={(e) => handleInputChange('additionalDetails', e.target.value)}
              placeholder="Describe any specific features, integrations, or requirements you have in mind..."
              rows={6}
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
                resize: 'vertical',
                fontFamily: 'inherit',
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
              Share any specific tools, platforms, or design preferences you'd like us to consider
            </p>
          </div>

          {/* Selected Features Summary */}
          {formData.features.length > 0 && (
            <div style={{
              padding: '20px',
              backgroundColor: 'rgba(139, 92, 246, 0.1)',
              border: '1px solid rgba(139, 92, 246, 0.3)',
              borderRadius: '12px'
            }}>
              <h3 style={{ fontSize: '14px', fontWeight: '700', color: themeColor, marginBottom: '8px' }}>
                {formData.features.length} Feature{formData.features.length > 1 ? 's' : ''} Selected
              </h3>
              <p style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.6)' }}>
                You've selected {formData.features.length} feature{formData.features.length > 1 ? 's' : ''} for your website upgrade
              </p>
            </div>
          )}
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
            onClick={() => navigate('/onboarding/website-upgrade/step1')}
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

export default WebsiteUpgradeStep2;
