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

const DeploymentStep2 = () => {
  const navigate = useNavigate();
  const { projectData, updateProjectData } = useProject();
  const { addItem, removeItem, items } = useCart();
  const isMobile = useIsMobile();
  const handleMultiServiceComplete = useMultiServiceComplete('deployment');
  const isMultiService = useIsMultiService();
  
  const themeColor = '#06B6D4';
  
  const [requirements, setRequirements] = useState(projectData?.deployment?.requirements || []);
  const [timeline, setTimeline] = useState(projectData?.deployment?.timeline || { amount: 7, unit: 'days' });
  const [timelineMultiplier, setTimelineMultiplier] = useState(projectData?.deployment?.timelineMultiplier || 1.0);
  const [notes, setNotes] = useState(projectData?.deployment?.notes || '');
  
  const [supportAssist, setSupportAssist] = useState(items.some(item => item.id === 'deployment-support'));
  const [monitoringAssist, setMonitoringAssist] = useState(items.some(item => item.id === 'deployment-monitoring'));

  const requirementOptions = [
    { id: 'domain', label: 'Custom Domain' },
    { id: 'ssl', label: 'SSL Certificate' },
    { id: 'cicd', label: 'CI/CD Pipeline' },
    { id: 'env', label: 'Environment Variables' },
    { id: 'database', label: 'Database Setup' },
    { id: 'storage', label: 'File Storage' },
    { id: 'cdn', label: 'CDN Setup' },
    { id: 'monitoring', label: 'Monitoring/Logging' },
    { id: 'backup', label: 'Backup Strategy' },
    { id: 'scaling', label: 'Auto-Scaling' }
  ];

  useEffect(() => {
    if (supportAssist) {
      addItem({ id: 'deployment-support', name: 'Deployment Support', description: 'Ongoing support for deployment issues', price: 45, category: 'Deployment Help' });
    } else { removeItem('deployment-support'); }
  }, [supportAssist]);

  useEffect(() => {
    if (monitoringAssist) {
      addItem({ id: 'deployment-monitoring', name: 'Monitoring Setup', description: 'Set up monitoring and alerting for your deployment', price: 60, category: 'Deployment Help' });
    } else { removeItem('deployment-monitoring'); }
  }, [monitoringAssist]);

  const handleSubmit = async () => {
    try {
      const serviceData = { ...projectData?.deployment, requirements, timeline, timelineMultiplier, notes };
      await updateProjectData({ deployment: serviceData });
      
      // Calculate estimate
      const countryCode = location?.country || 'US';
      const calculatedEstimate = calculateProjectEstimate(projectData, countryCode, timelineMultiplier);
      setEstimate(calculatedEstimate);
      
      if (isMultiService) {
        await handleMultiServiceComplete(serviceData);
      } else {
        // Show modal instead of navigating
        setShowEstimateModal(true);
      }
    } catch (error) {
      console.error('Submit error:', error);
      alert('Error submitting. Please try again.');
    }
  };

  const isValid = timeline && timeline.amount > 0;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FAFAFA' }}>
      <div style={{ padding: isMobile ? '12px 16px' : '16px 24px', borderBottom: '1px solid #eee', backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button onClick={() => navigate('/onboarding/deployment/step1')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', color: '#666' }}>
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>{!isMobile && 'Back'}
        </button>
        <div style={{ fontSize: '14px', color: '#666' }}>Step 2 of 2</div>
      </div>
      <div style={{ height: '4px', backgroundColor: '#E5E7EB' }}><motion.div initial={{ width: '50%' }} animate={{ width: '100%' }} style={{ height: '100%', backgroundColor: themeColor }} /></div>
      <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ flex: 1, padding: isMobile ? '24px 16px 120px' : '40px', maxWidth: isMobile ? '100%' : '900px' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 style={{ fontSize: isMobile ? '24px' : '28px', fontWeight: '600', marginBottom: '8px', color: '#111' }}>Requirements & Timeline</h1>
            <p style={{ color: '#666', marginBottom: '32px' }}>What else do you need for your deployment?</p>
            <div style={{ marginBottom: '32px' }}>
              <label style={{ display: 'block', fontSize: '16px', fontWeight: '500', color: '#333', marginBottom: '12px' }}>Deployment requirements</label>
              <ChipGroup options={requirementOptions} selected={requirements} onChange={setRequirements} multiple={true} themeColor={themeColor} />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <label style={{ fontSize: '16px', fontWeight: '500', color: '#333' }}>Timeline *</label>
                <AssistedToggle enabled={supportAssist} onToggle={setSupportAssist} price={45} label="Ongoing support" />
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
            <div style={{ padding: '20px', backgroundColor: 'rgba(6, 182, 212, 0.05)', border: '1px solid rgba(6, 182, 212, 0.2)', borderRadius: '12px', marginBottom: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: '500', color: '#111', marginBottom: '4px' }}>Add Monitoring & Alerting</div>
                  <div style={{ fontSize: '14px', color: '#666' }}>Get notified of issues and track performance metrics</div>
                </div>
                <AssistedToggle enabled={monitoringAssist} onToggle={setMonitoringAssist} price={60} label="" />
              </div>
            </div>
            <div style={{ marginBottom: '32px' }}>
              <label style={{ display: 'block', fontSize: '16px', fontWeight: '500', color: '#333', marginBottom: '12px' }}>Additional notes</label>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Any specific deployment requirements, existing infrastructure, or issues you're facing..." style={{ width: '100%', padding: '16px', border: '1px solid #E5E7EB', borderRadius: '12px', fontSize: '15px', minHeight: '100px', resize: 'vertical', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }} />
            </div>
            <motion.button whileHover={{ scale: isValid ? 1.02 : 1 }} whileTap={{ scale: isValid ? 0.98 : 1 }} onClick={handleSubmit} disabled={!isValid} style={{ width: '100%', padding: '16px 32px', backgroundColor: isValid ? themeColor : '#E5E7EB', color: isValid ? 'white' : '#9CA3AF', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: '600', cursor: isValid ? 'pointer' : 'not-allowed', marginTop: '24px' }}>Submit Deployment Request</motion.button>
          </motion.div>
        </div>
        <CartSummary />
      </div>
    </div>
  );
};

export default DeploymentStep2;
