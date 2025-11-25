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

const DatabaseStep3 = () => {
  const navigate = useNavigate();
  const { projectData, updateProjectData } = useProject();
  const { addItem, removeItem, items } = useCart();
  const isMobile = useIsMobile();
  const handleMultiServiceComplete = useMultiServiceComplete('database');
  const isMultiService = useIsMultiService();
  
  const themeColor = '#F97316';
  const addOns = projectData?.addOns || [];
  const hasBackend = addOns.some(a => a.id === 'backend');
  
  const [hosting, setHosting] = useState(projectData?.database?.hosting || '');
  const [backup, setBackup] = useState(projectData?.database?.backup || '');
  const [timeline, setTimeline] = useState(projectData?.database?.timeline || '');
  const [notes, setNotes] = useState(projectData?.database?.notes || '');
  
  const [managedAssist, setManagedAssist] = useState(items.some(item => item.id === 'db-managed'));

  const hostingOptions = [
    { id: 'managed', label: 'Managed Service' },
    { id: 'self', label: 'Self-Hosted' },
    { id: 'serverless', label: 'Serverless' },
    { id: 'local', label: 'Local/Dev Only' },
    { id: 'unsure', label: 'Help Me Decide' }
  ];

  const backupOptions = [
    { id: 'daily', label: 'Daily Backups' },
    { id: 'realtime', label: 'Real-time Replication' },
    { id: 'manual', label: 'Manual Backups' },
    { id: 'none', label: 'Not Needed' }
  ];

  const timelineOptions = [
    { id: 'urgent', label: '2-3 days' },
    { id: 'standard', label: '1 week' },
    { id: 'relaxed', label: '2-3 weeks' },
    { id: 'flexible', label: 'Flexible' }
  ];

  useEffect(() => {
    if (managedAssist) {
      addItem({ id: 'db-managed', name: 'Managed Database Support', description: 'Ongoing database management and monitoring', price: 80, category: 'Database Setup' });
    } else { removeItem('db-managed'); }
  }, [managedAssist]);

  const handleSubmit = async () => {
    try {
      const serviceData = { ...projectData?.database, hosting, backup, timeline, notes };
      await updateProjectData({ database: serviceData });
      
      if (isMultiService) {
        await handleMultiServiceComplete(serviceData);
      } else {
        navigate('/success');
      }
    } catch (error) {
      console.error('Submit error:', error);
    }
  };

  const isValid = hosting && timeline;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FAFAFA' }}>
      <div style={{ padding: isMobile ? '12px 16px' : '16px 24px', borderBottom: '1px solid #eee', backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button onClick={() => navigate('/onboarding/database/step2')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', color: '#666', padding: '8px', margin: '-8px' }}>
          <svg width={isMobile ? 18 : 20} height={isMobile ? 18 : 20} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>{!isMobile && 'Back'}
        </button>
        <div style={{ fontSize: isMobile ? '12px' : '14px', color: '#666' }}>Step 3 of 3</div>
      </div>
      <div style={{ height: '4px', backgroundColor: '#E5E7EB' }}><motion.div initial={{ width: '66%' }} animate={{ width: '100%' }} style={{ height: '100%', backgroundColor: themeColor }} /></div>
      <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ flex: 1, padding: isMobile ? '24px 16px 120px' : '40px', maxWidth: isMobile ? '100%' : '900px' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 style={{ fontSize: isMobile ? '24px' : '28px', fontWeight: '600', marginBottom: '8px', color: '#111' }}>Hosting & Delivery</h1>
            <p style={{ color: '#666', marginBottom: isMobile ? '24px' : '32px', fontSize: isMobile ? '14px' : '16px' }}>Where should your database live?</p>
            {hasBackend && (
              <div style={{ padding: '16px 20px', backgroundColor: 'rgba(249, 115, 22, 0.05)', border: '1px solid rgba(249, 115, 22, 0.2)', borderRadius: '12px', marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <svg width="18" height="18" fill={themeColor} viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                  <span style={{ fontWeight: '500', color: '#111' }}>Backend Add-on Connected</span>
                </div>
                <p style={{ fontSize: '14px', color: '#666', margin: 0 }}>Your database will integrate with your backend service</p>
              </div>
            )}
            <div style={{ marginBottom: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <label style={{ fontSize: '16px', fontWeight: '500', color: '#333' }}>Hosting preference *</label>
                <AssistedToggle enabled={managedAssist} onToggle={setManagedAssist} price={80} label="Managed support" />
              </div>
              <ChipGroup options={hostingOptions} selected={hosting} onChange={setHosting} themeColor={themeColor} />
            </div>
            <div style={{ marginBottom: '32px' }}>
              <label style={{ display: 'block', fontSize: '16px', fontWeight: '500', color: '#333', marginBottom: '12px' }}>Backup strategy</label>
              <ChipGroup options={backupOptions} selected={backup} onChange={setBackup} themeColor={themeColor} />
            </div>
            <div style={{ marginBottom: '32px' }}>
              <label style={{ display: 'block', fontSize: '16px', fontWeight: '500', color: '#333', marginBottom: '12px' }}>Timeline *</label>
              <ChipGroup options={timelineOptions} selected={timeline} onChange={setTimeline} themeColor={themeColor} />
            </div>
            <div style={{ marginBottom: '32px' }}>
              <label style={{ display: 'block', fontSize: '16px', fontWeight: '500', color: '#333', marginBottom: '12px' }}>Additional notes</label>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Any specific requirements, constraints, or existing infrastructure details..." style={{ width: '100%', padding: '16px', border: '1px solid #E5E7EB', borderRadius: '12px', fontSize: '15px', minHeight: '100px', resize: 'vertical', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }} />
            </div>
            <motion.button whileHover={{ scale: isValid ? 1.02 : 1 }} whileTap={{ scale: isValid ? 0.98 : 1 }} onClick={handleSubmit} disabled={!isValid} style={{ width: '100%', padding: '16px 32px', backgroundColor: isValid ? themeColor : '#E5E7EB', color: isValid ? 'white' : '#9CA3AF', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: '600', cursor: isValid ? 'pointer' : 'not-allowed', marginTop: '24px' }}>Submit Database Request</motion.button>
          </motion.div>
        </div>
        <CartSummary />
      </div>
    </div>
  );
};

export default DatabaseStep3;
