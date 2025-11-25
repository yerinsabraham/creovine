import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useProject } from '../../../context/ProjectContext';
import { useCart } from '../../../context/CartContext';
import ChipGroup from '../../../components/common/ChipGroup';
import AssistedToggle from '../../../components/common/AssistedToggle';
import CartSummary from '../../../components/common/CartSummary';

const ContractStep3 = () => {
  const navigate = useNavigate();
  const { projectData, updateProjectData } = useProject();
  const { addItem, removeItem, items } = useCart();
  
  // Theme color for Smart Contract - purple
  const themeColor = '#8B5CF6';
  
  // Check for add-ons
  const addOns = projectData?.addOns || [];
  const hasBackend = addOns.some(a => a.id === 'backend');
  const hasFrontend = addOns.some(a => a.id === 'frontend');
  
  // Form state
  const [securityFeatures, setSecurityFeatures] = useState(projectData?.contract?.securityFeatures || []);
  const [accessControl, setAccessControl] = useState(projectData?.contract?.accessControl || '');
  const [upgradeability, setUpgradeability] = useState(projectData?.contract?.upgradeability || '');
  const [gasOptimization, setGasOptimization] = useState(projectData?.contract?.gasOptimization || '');
  
  // Assisted toggles
  const [securityAssist, setSecurityAssist] = useState(
    items.some(item => item.id === 'security-review-assist')
  );

  const securityFeatureOptions = [
    { id: 'reentrancy', label: 'Reentrancy Guard' },
    { id: 'overflow', label: 'Overflow Protection' },
    { id: 'pausable', label: 'Emergency Pause' },
    { id: 'ratelimit', label: 'Rate Limiting' },
    { id: 'multisig', label: 'Multi-sig Required' },
    { id: 'timelock', label: 'Timelock Delays' },
    { id: 'snapshot', label: 'State Snapshots' },
    { id: 'events', label: 'Comprehensive Events' }
  ];

  const accessControlOptions = [
    { id: 'ownable', label: 'Single Owner' },
    { id: 'roles', label: 'Role-Based (AccessControl)' },
    { id: 'multisig', label: 'Multi-Signature' },
    { id: 'dao', label: 'DAO Governance' },
    { id: 'none', label: 'No Access Control' }
  ];

  const upgradeabilityOptions = [
    { id: 'none', label: 'Non-Upgradeable' },
    { id: 'transparent', label: 'Transparent Proxy' },
    { id: 'uups', label: 'UUPS Proxy' },
    { id: 'beacon', label: 'Beacon Proxy' },
    { id: 'diamond', label: 'Diamond (EIP-2535)' }
  ];

  const gasOptimizationOptions = [
    { id: 'standard', label: 'Standard' },
    { id: 'optimized', label: 'Optimized' },
    { id: 'minimal', label: 'Gas Minimal' },
    { id: 'assembly', label: 'Assembly Where Possible' }
  ];

  useEffect(() => {
    if (securityAssist) {
      addItem({
        id: 'security-review-assist',
        name: 'Security Architecture Review',
        description: 'Expert review of your contract security design',
        price: 95,
        category: 'Smart Contract'
      });
    } else {
      removeItem('security-review-assist');
    }
  }, [securityAssist]);

  const handleContinue = () => {
    updateProjectData({
      contract: {
        ...projectData?.contract,
        securityFeatures,
        accessControl,
        upgradeability,
        gasOptimization
      }
    });
    navigate('/onboarding/contract/step4');
  };

  const isValid = accessControl && upgradeability;

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
          onClick={() => navigate('/onboarding/contract/step2')}
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
          Step 3 of 4
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ height: '4px', backgroundColor: '#E5E7EB' }}>
        <motion.div 
          initial={{ width: '50%' }}
          animate={{ width: '75%' }}
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
              Security & Architecture
            </h1>
            <p style={{ color: '#666', marginBottom: '32px' }}>
              Configure security features, access control, and upgradeability for your contract
            </p>

            {/* Add-on notices */}
            {(hasBackend || hasFrontend) && (
              <div style={{ 
                padding: '16px 20px',
                backgroundColor: 'rgba(139, 92, 246, 0.05)',
                border: '1px solid rgba(139, 92, 246, 0.2)',
                borderRadius: '12px',
                marginBottom: '24px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <svg width="18" height="18" fill={themeColor} viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                  <span style={{ fontWeight: '500', color: '#111' }}>Integration Ready</span>
                </div>
                <p style={{ fontSize: '14px', color: '#666', margin: 0 }}>
                  {hasBackend && hasFrontend 
                    ? 'Your contract will integrate with both backend and frontend systems'
                    : hasBackend 
                      ? 'Your contract will integrate with your backend APIs'
                      : 'Your contract will integrate with your frontend dApp'
                  }
                </p>
              </div>
            )}

            {/* Security Features */}
            <div style={{ marginBottom: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <label style={{ fontSize: '16px', fontWeight: '500', color: '#333' }}>
                  Security Features
                </label>
                <AssistedToggle
                  enabled={securityAssist}
                  onToggle={setSecurityAssist}
                  price={95}
                  label="Security review"
                />
              </div>
              <ChipGroup
                options={securityFeatureOptions}
                selected={securityFeatures}
                onChange={setSecurityFeatures}
                multiple={true}
                themeColor={themeColor}
              />
            </div>

            {/* Access Control */}
            <div style={{ marginBottom: '32px' }}>
              <label style={{ display: 'block', fontSize: '16px', fontWeight: '500', color: '#333', marginBottom: '12px' }}>
                Access Control Model *
              </label>
              <ChipGroup
                options={accessControlOptions}
                selected={accessControl}
                onChange={setAccessControl}
                themeColor={themeColor}
              />
            </div>

            {/* Upgradeability */}
            <div style={{ marginBottom: '32px' }}>
              <label style={{ display: 'block', fontSize: '16px', fontWeight: '500', color: '#333', marginBottom: '12px' }}>
                Upgradeability *
              </label>
              <ChipGroup
                options={upgradeabilityOptions}
                selected={upgradeability}
                onChange={setUpgradeability}
                themeColor={themeColor}
              />
              <p style={{ fontSize: '13px', color: '#888', marginTop: '8px' }}>
                Upgradeable contracts allow bug fixes but add complexity and trust requirements
              </p>
            </div>

            {/* Gas Optimization */}
            <div style={{ marginBottom: '32px' }}>
              <label style={{ display: 'block', fontSize: '16px', fontWeight: '500', color: '#333', marginBottom: '12px' }}>
                Gas Optimization Level
              </label>
              <ChipGroup
                options={gasOptimizationOptions}
                selected={gasOptimization}
                onChange={setGasOptimization}
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

export default ContractStep3;
