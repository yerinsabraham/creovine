import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useProject } from '../../../context/ProjectContext';
import { useCart } from '../../../context/CartContext';
import { useIsMobile } from '../../../hooks/useMediaQuery';
import { useMultiServiceComplete, useIsMultiService } from '../../../hooks/useMultiService';
import ChipGroup from '../../../components/common/ChipGroup';
import AssistedToggle from '../../../components/common/AssistedToggle';
import CartSummary from '../../../components/common/CartSummary';
import TimelineSelector from '../../../components/common/TimelineSelector';

const AuthStep3 = () => {
  const navigate = useNavigate();
  const { projectData, updateProjectData } = useProject();
  const { addItem, removeItem, items } = useCart();
  const isMobile = useIsMobile();
  const handleMultiServiceComplete = useMultiServiceComplete('auth');
  const isMultiService = useIsMultiService();
  
  const themeColor = '#10B981';
  const addOns = projectData?.addOns || [];
  const hasBackend = addOns.some(a => a.id === 'backend');
  const hasFrontend = addOns.some(a => a.id === 'frontend');
  
  const [integration, setIntegration] = useState(projectData?.auth?.integration || '');
  const [timeline, setTimeline] = useState(projectData?.auth?.timeline || { amount: 7, unit: 'days' });
  const [timelineMultiplier, setTimelineMultiplier] = useState(projectData?.auth?.timelineMultiplier || 1.0);
  const [notes, setNotes] = useState(projectData?.auth?.notes || '');
  
  const [supportAssist, setSupportAssist] = useState(items.some(item => item.id === 'auth-support'));

  const integrationOptions = [
    { id: 'new', label: 'New Application' },
    { id: 'existing', label: 'Existing Codebase' },
    { id: 'migration', label: 'Auth Migration' },
    { id: 'upgrade', label: 'Auth Upgrade' }
  ];

  const timelineOptions = [
    { id: 'urgent', label: '2-3 days' },
    { id: 'standard', label: '1 week' },
    { id: 'relaxed', label: '2 weeks' },
    { id: 'flexible', label: 'Flexible' }
  ];

  useEffect(() => {
    if (supportAssist) {
      addItem({ id: 'auth-support', name: 'Auth Support Package', description: 'Ongoing support for auth-related issues', price: 55, category: 'Authentication' });
    } else { removeItem('auth-support'); }
  }, [supportAssist]);

  const handleSubmit = async () => {
    try {
      const serviceData = { ...projectData?.auth, integration, timeline, timelineMultiplier, notes };
      await updateProjectData({ auth: serviceData });
      
      if (isMultiService) {
        await handleMultiServiceComplete(serviceData);
      } else {
        navigate('/project-submitted');
      }
    } catch (error) {
      console.error('Submit error:', error);
    }
  };

  const isValid = integration && timeline && timeline.amount > 0;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FAFAFA' }}>
      <div style={{ padding: isMobile ? '12px 16px' : '16px 24px', borderBottom: '1px solid #eee', backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button onClick={() => navigate('/onboarding/auth/step2')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', color: '#666', padding: '8px', margin: '-8px' }}>
          <svg width={isMobile ? 18 : 20} height={isMobile ? 18 : 20} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>{!isMobile && 'Back'}
        </button>
        <div style={{ fontSize: isMobile ? '12px' : '14px', color: '#666' }}>Step 3 of 3</div>
      </div>
      <div style={{ height: '4px', backgroundColor: '#E5E7EB' }}><motion.div initial={{ width: '66%' }} animate={{ width: '100%' }} style={{ height: '100%', backgroundColor: themeColor }} /></div>
      <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ flex: 1, padding: isMobile ? '24px 16px 120px' : '40px', maxWidth: isMobile ? '100%' : '900px' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 style={{ fontSize: isMobile ? '24px' : '28px', fontWeight: '600', marginBottom: '8px', color: '#111' }}>Integration & Delivery</h1>
            <p style={{ color: '#666', marginBottom: isMobile ? '24px' : '32px', fontSize: isMobile ? '14px' : '16px' }}>Final details for your authentication setup</p>
            {(hasBackend || hasFrontend) && (
              <div style={{ padding: '16px 20px', backgroundColor: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '12px', marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <svg width="18" height="18" fill={themeColor} viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                  <span style={{ fontWeight: '500', color: '#111' }}>Add-ons Connected</span>
                </div>
                <p style={{ fontSize: '14px', color: '#666', margin: 0 }}>
                  {hasBackend && hasFrontend ? 'Auth will integrate with both frontend and backend' : hasBackend ? 'Auth will integrate with your backend' : 'Auth will integrate with your frontend'}
                </p>
              </div>
            )}
            <div style={{ marginBottom: '32px' }}>
              <label style={{ display: 'block', fontSize: '16px', fontWeight: '500', color: '#333', marginBottom: '12px' }}>Integration type *</label>
              <ChipGroup options={integrationOptions} selected={integration} onChange={setIntegration} themeColor={themeColor} />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{ fontSize: '16px', fontWeight: '500', color: '#333' }}>Delivery Timeline *</div>
                <AssistedToggle enabled={supportAssist} onToggle={setSupportAssist} price={55} label="Ongoing support" />
              </div>
            </div>
            <TimelineSelector
              value={timeline}
              onChange={(timelineData) => {
                setTimeline(timelineData);
                setTimelineMultiplier(timelineData.priceMultiplier);
              }}
              serviceComplexity="medium"
              showPriceImpact={true}
              style={{ marginBottom: '32px' }}
            />
            <div style={{ marginBottom: '32px' }}>
              <label style={{ display: 'block', fontSize: '16px', fontWeight: '500', color: '#333', marginBottom: '12px' }}>Additional notes</label>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Any specific requirements, existing auth setup details, or constraints..." style={{ width: '100%', padding: '16px', border: '1px solid #E5E7EB', borderRadius: '12px', fontSize: '15px', minHeight: '100px', resize: 'vertical', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }} />
            </div>
            <motion.button whileHover={{ scale: isValid ? 1.02 : 1 }} whileTap={{ scale: isValid ? 0.98 : 1 }} onClick={handleSubmit} disabled={!isValid} style={{ width: '100%', padding: '16px 32px', backgroundColor: isValid ? themeColor : '#E5E7EB', color: isValid ? 'white' : '#9CA3AF', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: '600', cursor: isValid ? 'pointer' : 'not-allowed', marginTop: '24px' }}>Submit Authentication Request</motion.button>
          </motion.div>
        </div>
        <CartSummary />
      </div>
    </div>
  );
};

export default AuthStep3;
