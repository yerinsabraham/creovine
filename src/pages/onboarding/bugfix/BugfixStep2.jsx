import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useProject } from '../../../context/ProjectContext';
import { useCart } from '../../../context/CartContext';
import { useMultiServiceComplete, useIsMultiService } from '../../../hooks/useMultiService';
import ChipGroup from '../../../components/common/ChipGroup';
import AssistedToggle from '../../../components/common/AssistedToggle';
import TimelineSelector from '../../../components/common/TimelineSelector';
import CartSummary from '../../../components/common/CartSummary';

const BugfixStep2 = () => {
  const navigate = useNavigate();
  const { projectData, updateProjectData } = useProject();
  const { addItem, removeItem, items } = useCart();
  const handleMultiServiceComplete = useMultiServiceComplete('bug-fix');
  const isMultiService = useIsMultiService();
  
  // Theme color for Bug Fix - red
  const themeColor = '#EF4444';
  
  // Form state
  const [timeline, setTimeline] = useState(projectData?.bugfix?.timeline || { amount: 3, unit: 'days' });
  const [timelineMultiplier, setTimelineMultiplier] = useState(projectData?.bugfix?.timelineMultiplier || 1.0);
  const [techStack, setTechStack] = useState(projectData?.bugfix?.techStack || []);
  const [accessType, setAccessType] = useState(projectData?.bugfix?.accessType || '');
  const [additionalInfo, setAdditionalInfo] = useState(projectData?.bugfix?.additionalInfo || '');
  
  // Assisted toggles
  const [prioritySupport, setPrioritySupport] = useState(
    items.some(item => item.id === 'priority-support')
  );
  const [testingIncluded, setTestingIncluded] = useState(
    items.some(item => item.id === 'testing-included')
  );

  const timelineOptions = [
    { id: 'emergency', label: '🚨 Emergency (24h)' },
    { id: 'urgent', label: '⚡ Urgent (2-3 days)' },
    { id: 'standard', label: '📅 Standard (1 week)' },
    { id: 'flexible', label: '🕐 Flexible' }
  ];

  const techStackOptions = [
    { id: 'react', label: 'React' },
    { id: 'vue', label: 'Vue' },
    { id: 'angular', label: 'Angular' },
    { id: 'nextjs', label: 'Next.js' },
    { id: 'node', label: 'Node.js' },
    { id: 'python', label: 'Python' },
    { id: 'php', label: 'PHP' },
    { id: 'java', label: 'Java' },
    { id: 'dotnet', label: '.NET' },
    { id: 'flutter', label: 'Flutter' },
    { id: 'swift', label: 'Swift' },
    { id: 'kotlin', label: 'Kotlin' },
    { id: 'other', label: 'Other' }
  ];

  const accessTypeOptions = [
    { id: 'github', label: 'GitHub Access' },
    { id: 'gitlab', label: 'GitLab Access' },
    { id: 'bitbucket', label: 'Bitbucket Access' },
    { id: 'zip', label: 'Send Code as ZIP' },
    { id: 'screenshare', label: 'Screen Share Session' },
    { id: 'other', label: 'Other Method' }
  ];

  useEffect(() => {
    if (prioritySupport) {
      addItem({
        id: 'priority-support',
        name: 'Priority Support',
        description: 'Get your bug fix prioritized with faster response time',
        price: 50,
        category: 'Bug Fix'
      });
    } else {
      removeItem('priority-support');
    }
  }, [prioritySupport]);

  useEffect(() => {
    if (testingIncluded) {
      addItem({
        id: 'testing-included',
        name: 'Testing & Verification',
        description: 'Comprehensive testing to ensure the fix works correctly',
        price: 35,
        category: 'Bug Fix'
      });
    } else {
      removeItem('testing-included');
    }
  }, [testingIncluded]);

  const handleSubmit = async () => {
    try {
      const serviceData = { ...projectData?.bugfix, timeline, timelineMultiplier, techStack, accessType, additionalInfo };
      await updateProjectData({ bugfix: serviceData });
      
      if (isMultiService) {
        await handleMultiServiceComplete(serviceData);
      } else {
        navigate('/success');
      }
    } catch (error) {
      console.error('Submit error:', error);
    }
  };

  const isValid = timeline && timeline.amount > 0 && accessType;

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
          onClick={() => navigate('/onboarding/bugfix/step1')}
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
          Step 2 of 2
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ height: '4px', backgroundColor: '#E5E7EB' }}>
        <motion.div 
          initial={{ width: '50%' }}
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
              Priority & Access
            </h1>
            <p style={{ color: '#666', marginBottom: '32px' }}>
              When do you need this fixed and how should we access your code?
            </p>

            {/* Timeline */}
            <div style={{ marginBottom: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <label style={{ fontSize: '16px', fontWeight: '500', color: '#333' }}>
                  When do you need this fixed? *
                </label>
                <AssistedToggle
                  enabled={prioritySupport}
                  onToggle={setPrioritySupport}
                  price={50}
                  label="Priority support"
                />
              </div>
              <TimelineSelector
                value={timeline}
                onChange={(timelineData) => {
                  setTimeline(timelineData);
                  setTimelineMultiplier(timelineData.priceMultiplier);
                }}
                serviceComplexity="simple"
                showPriceImpact={true}
              />
            </div>

            {/* Tech Stack */}
            <div style={{ marginBottom: '32px' }}>
              <label style={{ display: 'block', fontSize: '16px', fontWeight: '500', color: '#333', marginBottom: '12px' }}>
                What's your tech stack?
              </label>
              <ChipGroup
                options={techStackOptions}
                selected={techStack}
                onChange={setTechStack}
                multiple={true}
                themeColor={themeColor}
              />
            </div>

            {/* Access Type */}
            <div style={{ marginBottom: '32px' }}>
              <label style={{ display: 'block', fontSize: '16px', fontWeight: '500', color: '#333', marginBottom: '12px' }}>
                How will you share your code? *
              </label>
              <ChipGroup
                options={accessTypeOptions}
                selected={accessType}
                onChange={setAccessType}
                themeColor={themeColor}
              />
            </div>

            {/* Testing Toggle */}
            <div style={{ 
              marginBottom: '32px',
              padding: '20px',
              backgroundColor: 'rgba(239, 68, 68, 0.05)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              borderRadius: '12px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: '500', color: '#111', marginBottom: '4px' }}>
                    Include Testing & Verification
                  </div>
                  <div style={{ fontSize: '14px', color: '#666' }}>
                    We'll thoroughly test the fix to ensure it doesn't break anything else
                  </div>
                </div>
                <AssistedToggle
                  enabled={testingIncluded}
                  onToggle={setTestingIncluded}
                  price={35}
                  label=""
                />
              </div>
            </div>

            {/* Additional Info */}
            <div style={{ marginBottom: '32px' }}>
              <label style={{ display: 'block', fontSize: '16px', fontWeight: '500', color: '#333', marginBottom: '12px' }}>
                Anything else we should know?
              </label>
              <textarea
                value={additionalInfo}
                onChange={(e) => setAdditionalInfo(e.target.value)}
                placeholder="Any additional context, recent changes that might have caused this, or things you've already tried..."
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
              Submit Bug Fix Request
            </motion.button>
          </motion.div>
        </div>

        {/* Cart Summary Sidebar */}
        <CartSummary />
      </div>
    </div>
  );
};

export default BugfixStep2;
