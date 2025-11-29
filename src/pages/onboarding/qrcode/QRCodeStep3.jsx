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

const QRCodeStep3 = () => {
  const navigate = useNavigate();
  const { projectData, updateProjectData } = useProject();
  const { addItem, removeItem, items } = useCart();
  const isMobile = useIsMobile();
  const handleMultiServiceComplete = useMultiServiceComplete('qr-code');
  const isMultiService = useIsMultiService();
  
  const themeColor = '#0EA5E9';
  
  const [tracking, setTracking] = useState(projectData?.qrcode?.tracking || []);
  const [integration, setIntegration] = useState(projectData?.qrcode?.integration || '');
  const [timeline, setTimeline] = useState(projectData?.qrcode?.timeline || { amount: 7, unit: 'days' });
  const [timelineMultiplier, setTimelineMultiplier] = useState(projectData?.qrcode?.timelineMultiplier || 1.0);
  const [notes, setNotes] = useState(projectData?.qrcode?.notes || '');
  
  const [analyticsAssist, setAnalyticsAssist] = useState(items.some(item => item.id === 'qr-analytics'));

  const trackingOptions = [
    { id: 'scans', label: 'Scan Count' },
    { id: 'location', label: 'Scan Location' },
    { id: 'device', label: 'Device Type' },
    { id: 'time', label: 'Time Analytics' },
    { id: 'conversion', label: 'Conversion Tracking' },
    { id: 'none', label: 'No Tracking' }
  ];

  const integrationOptions = [
    { id: 'standalone', label: 'Standalone/Download' },
    { id: 'api', label: 'API Integration' },
    { id: 'webapp', label: 'Web App Feature' },
    { id: 'mobile', label: 'Mobile App Feature' },
    { id: 'print', label: 'Print Materials' }
  ];

  useEffect(() => {
    if (analyticsAssist) {
      addItem({ id: 'qr-analytics', name: 'QR Analytics Dashboard', description: 'Custom analytics dashboard for QR code tracking', price: 55, category: 'QR Code System' });
    } else { removeItem('qr-analytics'); }
  }, [analyticsAssist]);

  const handleSubmit = async () => {
    try {
      const serviceData = { ...projectData?.qrcode, tracking, integration, timeline, timelineMultiplier, notes };
      await updateProjectData({ qrcode: serviceData });
      
      if (isMultiService) {
        await handleMultiServiceComplete(serviceData);
      } else {
        navigate('/success');
      }
    } catch (error) {
      console.error('Submit error:', error);
    }
  };

  const isValid = timeline && timeline.amount > 0;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FAFAFA' }}>
      <div style={{ padding: isMobile ? '12px 16px' : '16px 24px', borderBottom: '1px solid #eee', backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button onClick={() => navigate('/onboarding/qrcode/step2')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', color: '#666', padding: '8px', margin: '-8px' }}>
          <svg width={isMobile ? 18 : 20} height={isMobile ? 18 : 20} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>{!isMobile && 'Back'}
        </button>
        <div style={{ fontSize: isMobile ? '12px' : '14px', color: '#666' }}>Step 3 of 3</div>
      </div>
      <div style={{ height: '4px', backgroundColor: '#E5E7EB' }}><motion.div initial={{ width: '66%' }} animate={{ width: '100%' }} style={{ height: '100%', backgroundColor: themeColor }} /></div>
      <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ flex: 1, padding: isMobile ? '24px 16px 120px' : '40px', maxWidth: isMobile ? '100%' : '900px' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 style={{ fontSize: isMobile ? '24px' : '28px', fontWeight: '600', marginBottom: '8px', color: '#111' }}>Tracking & Delivery</h1>
            <p style={{ color: '#666', marginBottom: isMobile ? '24px' : '32px', fontSize: isMobile ? '14px' : '16px' }}>Configure analytics and delivery preferences</p>
            <div style={{ marginBottom: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <label style={{ fontSize: '16px', fontWeight: '500', color: '#333' }}>Tracking features</label>
                <AssistedToggle enabled={analyticsAssist} onToggle={setAnalyticsAssist} price={55} label="Analytics dashboard" />
              </div>
              <ChipGroup options={trackingOptions} selected={tracking} onChange={setTracking} multiple={true} themeColor={themeColor} />
            </div>
            <div style={{ marginBottom: '32px' }}>
              <label style={{ display: 'block', fontSize: '16px', fontWeight: '500', color: '#333', marginBottom: '12px' }}>How will you use these?</label>
              <ChipGroup options={integrationOptions} selected={integration} onChange={setIntegration} themeColor={themeColor} />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '16px', fontWeight: '500', color: '#333', marginBottom: '12px' }}>Timeline *</label>
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
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Any specific data to encode, use cases, or requirements..." style={{ width: '100%', padding: '16px', border: '1px solid #E5E7EB', borderRadius: '12px', fontSize: '15px', minHeight: '100px', resize: 'vertical', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }} />
            </div>
            <motion.button whileHover={{ scale: isValid ? 1.02 : 1 }} whileTap={{ scale: isValid ? 0.98 : 1 }} onClick={handleSubmit} disabled={!isValid} style={{ width: '100%', padding: '16px 32px', backgroundColor: isValid ? themeColor : '#E5E7EB', color: isValid ? 'white' : '#9CA3AF', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: '600', cursor: isValid ? 'pointer' : 'not-allowed', marginTop: '24px' }}>Submit QR Code Request</motion.button>
          </motion.div>
        </div>
        <CartSummary />
      </div>
    </div>
  );
};

export default QRCodeStep3;
