import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useProject } from '../../../context/ProjectContext';
import { useCart } from '../../../context/CartContext';
import { useMultiServiceComplete, useIsMultiService } from '../../../hooks/useMultiService';
import ChipGroup from '../../../components/common/ChipGroup';
import AssistedToggle from '../../../components/common/AssistedToggle';
import CartSummary from '../../../components/common/CartSummary';

const ContractStep4 = () => {
  const navigate = useNavigate();
  const { projectData, updateProjectData } = useProject();
  const { addItem, removeItem, items } = useCart();
  const handleMultiServiceComplete = useMultiServiceComplete('smart-contract');
  const isMultiService = useIsMultiService();
  
  // Theme color for Smart Contract - purple
  const themeColor = '#8B5CF6';
  
  // Form state
  const [testingLevel, setTestingLevel] = useState(projectData?.contract?.testingLevel || '');
  const [auditRequired, setAuditRequired] = useState(projectData?.contract?.auditRequired || '');
  const [deployment, setDeployment] = useState(projectData?.contract?.deployment || []);
  const [documentation, setDocumentation] = useState(projectData?.contract?.documentation || []);
  const [timeline, setTimeline] = useState(projectData?.contract?.timeline || '');
  const [additionalNotes, setAdditionalNotes] = useState(projectData?.contract?.additionalNotes || '');
  
  // Assisted toggles
  const [auditAssist, setAuditAssist] = useState(
    items.some(item => item.id === 'audit-coordination-assist')
  );
  const [deploymentAssist, setDeploymentAssist] = useState(
    items.some(item => item.id === 'deployment-support')
  );

  const testingLevelOptions = [
    { id: 'basic', label: 'Basic Unit Tests' },
    { id: 'comprehensive', label: 'Comprehensive Testing' },
    { id: 'fuzzing', label: 'Fuzz Testing' },
    { id: 'formal', label: 'Formal Verification' }
  ];

  const auditOptions = [
    { id: 'none', label: 'No Audit Needed' },
    { id: 'internal', label: 'Internal Review Only' },
    { id: 'external', label: 'External Audit' },
    { id: 'multiple', label: 'Multiple Audits' }
  ];

  const deploymentOptions = [
    { id: 'testnet', label: 'Testnet First' },
    { id: 'mainnet', label: 'Mainnet' },
    { id: 'verify', label: 'Etherscan Verification' },
    { id: 'multisig', label: 'Multi-sig Deployment' },
    { id: 'scripts', label: 'Deployment Scripts' },
    { id: 'ci', label: 'CI/CD Integration' }
  ];

  const documentationOptions = [
    { id: 'natspec', label: 'NatSpec Comments' },
    { id: 'readme', label: 'README Documentation' },
    { id: 'technical', label: 'Technical Docs' },
    { id: 'api', label: 'API Reference' },
    { id: 'user', label: 'User Guide' },
    { id: 'architecture', label: 'Architecture Diagrams' }
  ];

  const timelineOptions = [
    { id: 'urgent', label: '1-2 weeks' },
    { id: 'standard', label: '3-4 weeks' },
    { id: 'relaxed', label: '1-2 months' },
    { id: 'flexible', label: 'Flexible' }
  ];

  useEffect(() => {
    if (auditAssist) {
      addItem({
        id: 'audit-coordination-assist',
        name: 'Audit Coordination',
        description: 'Help coordinating with audit firms and addressing findings',
        price: 120,
        category: 'Smart Contract'
      });
    } else {
      removeItem('audit-coordination-assist');
    }
  }, [auditAssist]);

  useEffect(() => {
    if (deploymentAssist) {
      addItem({
        id: 'deployment-support',
        name: 'Deployment Support',
        description: 'Assistance with mainnet deployment and verification',
        price: 85,
        category: 'Smart Contract'
      });
    } else {
      removeItem('deployment-support');
    }
  }, [deploymentAssist]);

  const handleSubmit = async () => {
    try {
      const serviceData = { ...projectData?.contract, testingLevel, auditRequired, deployment, documentation, timeline, additionalNotes };
      await updateProjectData({ contract: serviceData });
      
      if (isMultiService) {
        await handleMultiServiceComplete(serviceData);
      } else {
        navigate('/quote');
      }
    } catch (error) {
      console.error('Submit error:', error);
    }
  };

  const isValid = testingLevel && timeline;

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
          onClick={() => navigate('/onboarding/contract/step3')}
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
          Step 4 of 4
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ height: '4px', backgroundColor: '#E5E7EB' }}>
        <motion.div 
          initial={{ width: '75%' }}
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
              Testing & Deployment
            </h1>
            <p style={{ color: '#666', marginBottom: '32px' }}>
              Final step - configure testing requirements, deployment preferences, and timeline
            </p>

            {/* Testing Level */}
            <div style={{ marginBottom: '32px' }}>
              <label style={{ display: 'block', fontSize: '16px', fontWeight: '500', color: '#333', marginBottom: '12px' }}>
                Testing Level *
              </label>
              <ChipGroup
                options={testingLevelOptions}
                selected={testingLevel}
                onChange={setTestingLevel}
                themeColor={themeColor}
              />
            </div>

            {/* Audit Requirements */}
            <div style={{ marginBottom: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <label style={{ fontSize: '16px', fontWeight: '500', color: '#333' }}>
                  Security Audit
                </label>
                <AssistedToggle
                  enabled={auditAssist}
                  onToggle={setAuditAssist}
                  price={120}
                  label="Audit coordination"
                />
              </div>
              <ChipGroup
                options={auditOptions}
                selected={auditRequired}
                onChange={setAuditRequired}
                themeColor={themeColor}
              />
            </div>

            {/* Deployment Options */}
            <div style={{ marginBottom: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <label style={{ fontSize: '16px', fontWeight: '500', color: '#333' }}>
                  Deployment Requirements
                </label>
                <AssistedToggle
                  enabled={deploymentAssist}
                  onToggle={setDeploymentAssist}
                  price={85}
                  label="Deployment help"
                />
              </div>
              <ChipGroup
                options={deploymentOptions}
                selected={deployment}
                onChange={setDeployment}
                multiple={true}
                themeColor={themeColor}
              />
            </div>

            {/* Documentation */}
            <div style={{ marginBottom: '32px' }}>
              <label style={{ display: 'block', fontSize: '16px', fontWeight: '500', color: '#333', marginBottom: '12px' }}>
                Documentation Needed
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
              <label style={{ display: 'block', fontSize: '16px', fontWeight: '500', color: '#333', marginBottom: '12px' }}>
                Timeline *
              </label>
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
                Additional Requirements or Notes
              </label>
              <textarea
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
                placeholder="Any specific requirements, links to similar contracts, or other details..."
                style={{
                  width: '100%',
                  padding: '16px',
                  border: '1px solid #E5E7EB',
                  borderRadius: '12px',
                  fontSize: '15px',
                  minHeight: '120px',
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
              Submit Project Request
            </motion.button>
          </motion.div>
        </div>

        {/* Cart Summary Sidebar */}
        <CartSummary />
      </div>
    </div>
  );
};

export default ContractStep4;
