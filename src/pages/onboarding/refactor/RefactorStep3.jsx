import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useProject } from '../../../context/ProjectContext';
import { useCart } from '../../../context/CartContext';
import { useIsMobile } from '../../../hooks/useMediaQuery';
import { useMultiServiceComplete, useIsMultiService } from '../../../hooks/useMultiService';
import ChipGroup from '../../../components/common/ChipGroup';
import AssistedToggle from '../../../components/common/AssistedToggle';
import TimelineSelector from '../../../components/common/TimelineSelector';
import CartSummary from '../../../components/common/CartSummary';

const RefactorStep3 = () => {
  const navigate = useNavigate();
  const { projectData, updateProjectData, submitProject } = useProject();
  const { addItem, removeItem, items } = useCart();
  const isMobile = useIsMobile();
  const handleMultiServiceComplete = useMultiServiceComplete('refactor');
  const isMultiService = useIsMultiService();
  
  const themeColor = '#F59E0B';
  
  const [timeline, setTimeline] = useState(projectData?.refactor?.timeline || { amount: 7, unit: 'days' });
  const [timelineMultiplier, setTimelineMultiplier] = useState(projectData?.refactor?.timelineMultiplier || 1.0);
  const [documentation, setDocumentation] = useState(projectData?.refactor?.documentation || '');
  const [testing, setTesting] = useState(projectData?.refactor?.testing || '');
  const [additionalNotes, setAdditionalNotes] = useState(projectData?.refactor?.additionalNotes || '');
  
  const [codeReviewAssist, setCodeReviewAssist] = useState(items.some(item => item.id === 'refactor-review'));

  const timelineOptions = [
    { id: 'urgent', label: '< 1 week' },
    { id: 'standard', label: '1-2 weeks' },
    { id: 'relaxed', label: '2-4 weeks' },
    { id: 'flexible', label: 'Flexible' }
  ];

  const documentationOptions = [
    { id: 'yes', label: 'Include Documentation' },
    { id: 'no', label: 'Code Only' },
    { id: 'existing', label: 'Update Existing Docs' }
  ];

  const testingOptions = [
    { id: 'none', label: 'No Testing Needed' },
    { id: 'unit', label: 'Add Unit Tests' },
    { id: 'integration', label: 'Integration Tests' },
    { id: 'both', label: 'Full Test Coverage' }
  ];

  useEffect(() => {
    if (codeReviewAssist) {
      addItem({ id: 'refactor-review', name: 'Code Review Sessions', description: 'Live code review sessions with expert feedback', price: 60, category: 'Code Refactoring' });
    } else { removeItem('refactor-review'); }
  }, [codeReviewAssist]);

  const handleSubmit = async () => {
    try {
      const serviceData = { ...projectData?.refactor, timeline, timelineMultiplier, documentation, testing, additionalNotes };
      await updateProjectData({ refactor: serviceData });
      
      if (isMultiService) {
        await handleMultiServiceComplete(serviceData);
      } else {
        navigate('/quote');
      }
    } catch (error) {
      console.error('Submit error:', error);
    }
  };

  const isValid = timeline && timeline.amount > 0 && documentation && testing;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FAFAFA' }}>
      <div style={{ padding: isMobile ? '12px 16px' : '16px 24px', borderBottom: '1px solid #eee', backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button onClick={() => navigate('/onboarding/refactor/step2')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', color: '#666' }}>
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>{!isMobile && 'Back'}
        </button>
        <div style={{ fontSize: '14px', color: '#666' }}>Step 3 of 3</div>
      </div>
      <div style={{ height: '4px', backgroundColor: '#E5E7EB' }}><motion.div initial={{ width: '66%' }} animate={{ width: '100%' }} style={{ height: '100%', backgroundColor: themeColor }} /></div>
      <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ flex: 1, padding: isMobile ? '24px 16px 120px' : '40px', maxWidth: isMobile ? '100%' : '900px' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 style={{ fontSize: isMobile ? '24px' : '28px', fontWeight: '600', marginBottom: '8px', color: '#111' }}>Timeline & Deliverables</h1>
            <p style={{ color: '#666', marginBottom: '32px' }}>Final details for your refactoring project</p>
            <div style={{ marginBottom: '32px' }}>
              <label style={{ display: 'block', fontSize: '16px', fontWeight: '500', color: '#333', marginBottom: '12px' }}>Timeline *</label>
              <TimelineSelector
                value={timeline}
                onChange={(timelineData) => {
                  setTimeline(timelineData);
                  setTimelineMultiplier(timelineData.priceMultiplier);
                }}
                serviceComplexity="medium"
                showPriceImpact={true}
              />
            </div>
            <div style={{ marginBottom: '32px' }}>
              <label style={{ display: 'block', fontSize: '16px', fontWeight: '500', color: '#333', marginBottom: '12px' }}>Documentation *</label>
              <ChipGroup options={documentationOptions} selected={documentation} onChange={setDocumentation} themeColor={themeColor} />
            </div>
            <div style={{ marginBottom: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <label style={{ fontSize: '16px', fontWeight: '500', color: '#333' }}>Testing requirements *</label>
                <AssistedToggle enabled={codeReviewAssist} onToggle={setCodeReviewAssist} price={60} label="Code review sessions" />
              </div>
              <ChipGroup options={testingOptions} selected={testing} onChange={setTesting} themeColor={themeColor} />
            </div>
            <div style={{ marginBottom: '32px' }}>
              <label style={{ display: 'block', fontSize: '16px', fontWeight: '500', color: '#333', marginBottom: '12px' }}>Additional notes</label>
              <textarea value={additionalNotes} onChange={(e) => setAdditionalNotes(e.target.value)} placeholder="Any other requirements or context for the refactoring project..." style={{ width: '100%', padding: '16px', border: '1px solid #E5E7EB', borderRadius: '12px', fontSize: '15px', minHeight: '120px', resize: 'vertical', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }} />
            </div>
            <motion.button whileHover={{ scale: isValid ? 1.02 : 1 }} whileTap={{ scale: isValid ? 0.98 : 1 }} onClick={handleSubmit} disabled={!isValid} style={{ width: '100%', padding: '16px 32px', backgroundColor: isValid ? themeColor : '#E5E7EB', color: isValid ? 'white' : '#9CA3AF', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: '600', cursor: isValid ? 'pointer' : 'not-allowed', marginTop: '24px' }}>Submit Project</motion.button>
          </motion.div>
        </div>
        <CartSummary />
      </div>
    </div>
  );
};

export default RefactorStep3;
