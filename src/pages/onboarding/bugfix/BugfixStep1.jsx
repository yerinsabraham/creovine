import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useProject } from '../../../context/ProjectContext';
import { useCart } from '../../../context/CartContext';
import ChipGroup from '../../../components/common/ChipGroup';
import AssistedToggle from '../../../components/common/AssistedToggle';
import CartSummary from '../../../components/common/CartSummary';

const BugfixStep1 = () => {
  const navigate = useNavigate();
  const { projectData, updateProjectData } = useProject();
  const { addItem, removeItem, items } = useCart();
  
  // Theme color for Bug Fix - red
  const themeColor = '#EF4444';
  
  // Form state
  const [bugType, setBugType] = useState(projectData?.bugfix?.bugType || '');
  const [platform, setPlatform] = useState(projectData?.bugfix?.platform || '');
  const [severity, setSeverity] = useState(projectData?.bugfix?.severity || '');
  const [hasReproSteps, setHasReproSteps] = useState(projectData?.bugfix?.hasReproSteps || '');
  const [bugDescription, setBugDescription] = useState(projectData?.bugfix?.bugDescription || '');
  const [repoUrl, setRepoUrl] = useState(projectData?.bugfix?.repoUrl || '');
  
  // Assisted toggles
  const [diagnosisAssist, setDiagnosisAssist] = useState(
    items.some(item => item.id === 'bug-diagnosis-assist')
  );

  const bugTypeOptions = [
    { id: 'crash', label: 'App Crash' },
    { id: 'ui', label: 'UI/Display Issue' },
    { id: 'data', label: 'Data Not Loading' },
    { id: 'auth', label: 'Login/Auth Problem' },
    { id: 'performance', label: 'Performance Issue' },
    { id: 'api', label: 'API Error' },
    { id: 'security', label: 'Security Issue' },
    { id: 'other', label: 'Other' }
  ];

  const platformOptions = [
    { id: 'web', label: 'Web App' },
    { id: 'mobile-ios', label: 'iOS App' },
    { id: 'mobile-android', label: 'Android App' },
    { id: 'desktop', label: 'Desktop App' },
    { id: 'backend', label: 'Backend/API' },
    { id: 'database', label: 'Database' },
    { id: 'multiple', label: 'Multiple Platforms' }
  ];

  const severityOptions = [
    { id: 'critical', label: '🔴 Critical - App Unusable' },
    { id: 'high', label: '🟠 High - Major Feature Broken' },
    { id: 'medium', label: '🟡 Medium - Feature Impaired' },
    { id: 'low', label: '🟢 Low - Minor Issue' }
  ];

  const reproStepsOptions = [
    { id: 'yes', label: 'Yes, I can reproduce it' },
    { id: 'sometimes', label: 'Sometimes/Intermittent' },
    { id: 'no', label: 'No, happens randomly' },
    { id: 'unsure', label: 'Not sure' }
  ];

  useEffect(() => {
    if (diagnosisAssist) {
      addItem({
        id: 'bug-diagnosis-assist',
        name: 'Bug Diagnosis Assistance',
        description: 'Expert help identifying the root cause of your bug',
        price: 40,
        category: 'Bug Fix'
      });
    } else {
      removeItem('bug-diagnosis-assist');
    }
  }, [diagnosisAssist]);

  const handleContinue = () => {
    updateProjectData({
      bugfix: {
        ...projectData?.bugfix,
        bugType,
        platform,
        severity,
        hasReproSteps,
        bugDescription,
        repoUrl
      }
    });
    navigate('/onboarding/bugfix/step2');
  };

  const isValid = bugType && platform && severity && bugDescription;

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
          Step 1 of 2
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ height: '4px', backgroundColor: '#E5E7EB' }}>
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: '50%' }}
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
              Describe the Bug
            </h1>
            <p style={{ color: '#666', marginBottom: '32px' }}>
              Help us understand what's going wrong so we can fix it quickly
            </p>

            {/* Bug Type */}
            <div style={{ marginBottom: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <label style={{ fontSize: '16px', fontWeight: '500', color: '#333' }}>
                  What type of bug? *
                </label>
                <AssistedToggle
                  enabled={diagnosisAssist}
                  onToggle={setDiagnosisAssist}
                  price={40}
                  label="Diagnosis help"
                />
              </div>
              <ChipGroup
                options={bugTypeOptions}
                selected={bugType}
                onChange={setBugType}
                themeColor={themeColor}
              />
            </div>

            {/* Platform */}
            <div style={{ marginBottom: '32px' }}>
              <label style={{ display: 'block', fontSize: '16px', fontWeight: '500', color: '#333', marginBottom: '12px' }}>
                Which platform? *
              </label>
              <ChipGroup
                options={platformOptions}
                selected={platform}
                onChange={setPlatform}
                themeColor={themeColor}
              />
            </div>

            {/* Severity */}
            <div style={{ marginBottom: '32px' }}>
              <label style={{ display: 'block', fontSize: '16px', fontWeight: '500', color: '#333', marginBottom: '12px' }}>
                How severe is this? *
              </label>
              <ChipGroup
                options={severityOptions}
                selected={severity}
                onChange={setSeverity}
                themeColor={themeColor}
              />
            </div>

            {/* Reproducibility */}
            <div style={{ marginBottom: '32px' }}>
              <label style={{ display: 'block', fontSize: '16px', fontWeight: '500', color: '#333', marginBottom: '12px' }}>
                Can you reproduce it?
              </label>
              <ChipGroup
                options={reproStepsOptions}
                selected={hasReproSteps}
                onChange={setHasReproSteps}
                themeColor={themeColor}
              />
            </div>

            {/* Bug Description */}
            <div style={{ marginBottom: '32px' }}>
              <label style={{ display: 'block', fontSize: '16px', fontWeight: '500', color: '#333', marginBottom: '12px' }}>
                Describe the bug *
              </label>
              <textarea
                value={bugDescription}
                onChange={(e) => setBugDescription(e.target.value)}
                placeholder="What happens? What should happen instead? Include any error messages you see..."
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

            {/* Repository URL */}
            <div style={{ marginBottom: '32px' }}>
              <label style={{ display: 'block', fontSize: '16px', fontWeight: '500', color: '#333', marginBottom: '12px' }}>
                Repository URL (optional)
              </label>
              <input
                type="url"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                placeholder="https://github.com/your-username/your-repo"
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
              <p style={{ fontSize: '13px', color: '#888', marginTop: '8px' }}>
                Sharing your code helps us fix the bug faster
              </p>
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

export default BugfixStep1;
