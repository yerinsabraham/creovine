import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useProject } from '../../../context/ProjectContext';
import { useCart } from '../../../context/CartContext';
import { useIsMobile } from '../../../hooks/useMediaQuery';
import ChipGroup from '../../../components/common/ChipGroup';
import AssistedToggle from '../../../components/common/AssistedToggle';
import CartSummary from '../../../components/common/CartSummary';

const DatabaseStep1 = () => {
  const navigate = useNavigate();
  const { projectData, updateProjectData } = useProject();
  const { addItem, removeItem, items } = useCart();
  const isMobile = useIsMobile();
  
  const themeColor = '#F97316';
  
  const [dbType, setDbType] = useState(projectData?.database?.dbType || '');
  const [purpose, setPurpose] = useState(projectData?.database?.purpose || '');
  const [scale, setScale] = useState(projectData?.database?.scale || '');
  const [existing, setExisting] = useState(projectData?.database?.existing || '');
  
  const [dbSelectionAssist, setDbSelectionAssist] = useState(items.some(item => item.id === 'db-selection-assist'));

  const dbTypeOptions = [
    { id: 'postgresql', label: 'PostgreSQL' },
    { id: 'mysql', label: 'MySQL' },
    { id: 'mongodb', label: 'MongoDB' },
    { id: 'firebase', label: 'Firebase/Firestore' },
    { id: 'supabase', label: 'Supabase' },
    { id: 'redis', label: 'Redis' },
    { id: 'sqlite', label: 'SQLite' },
    { id: 'dynamodb', label: 'DynamoDB' },
    { id: 'unsure', label: 'Not Sure' }
  ];

  const purposeOptions = [
    { id: 'new', label: 'New Project Database' },
    { id: 'migration', label: 'Database Migration' },
    { id: 'optimization', label: 'Performance Optimization' },
    { id: 'scaling', label: 'Scale Existing DB' },
    { id: 'backup', label: 'Backup/Recovery Setup' },
    { id: 'integration', label: 'Connect to Existing' }
  ];

  const scaleOptions = [
    { id: 'small', label: 'Small (<10K records)' },
    { id: 'medium', label: 'Medium (10K-100K)' },
    { id: 'large', label: 'Large (100K-1M)' },
    { id: 'enterprise', label: 'Enterprise (1M+)' },
    { id: 'unsure', label: 'Not Sure Yet' }
  ];

  const existingOptions = [
    { id: 'none', label: 'Starting Fresh' },
    { id: 'hasdata', label: 'Have Existing Data' },
    { id: 'hasschema', label: 'Have Schema Design' },
    { id: 'migrate', label: 'Migrating From Another DB' }
  ];

  useEffect(() => {
    if (dbSelectionAssist) {
      addItem({ id: 'db-selection-assist', name: 'Database Selection Consultation', description: 'Expert help choosing the right database for your needs', price: 35, category: 'Database Setup' });
    } else { removeItem('db-selection-assist'); }
  }, [dbSelectionAssist]);

  const handleContinue = () => {
    updateProjectData({ database: { ...projectData?.database, dbType, purpose, scale, existing } });
    navigate('/onboarding/database/step2');
  };

  const isValid = dbType && purpose;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FAFAFA' }}>
      <div style={{ padding: isMobile ? '12px 16px' : '16px 24px', borderBottom: '1px solid #eee', backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button onClick={() => navigate('/get-started')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', color: '#666', padding: '8px', margin: '-8px' }}>
          <svg width={isMobile ? 18 : 20} height={isMobile ? 18 : 20} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>{!isMobile && 'Back'}
        </button>
        <div style={{ fontSize: isMobile ? '12px' : '14px', color: '#666' }}>Step 1 of 3</div>
      </div>
      <div style={{ height: '4px', backgroundColor: '#E5E7EB' }}><motion.div initial={{ width: 0 }} animate={{ width: '33%' }} style={{ height: '100%', backgroundColor: themeColor }} /></div>
      <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ flex: 1, padding: isMobile ? '24px 16px 120px' : '40px', maxWidth: isMobile ? '100%' : '900px' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 style={{ fontSize: isMobile ? '24px' : '28px', fontWeight: '600', marginBottom: '8px', color: '#111' }}>Database Type</h1>
            <p style={{ color: '#666', marginBottom: isMobile ? '24px' : '32px', fontSize: isMobile ? '14px' : '16px' }}>What kind of database do you need?</p>
            <div style={{ marginBottom: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <label style={{ fontSize: '16px', fontWeight: '500', color: '#333' }}>Database type *</label>
                <AssistedToggle enabled={dbSelectionAssist} onToggle={setDbSelectionAssist} price={35} label="Help me choose" />
              </div>
              <ChipGroup options={dbTypeOptions} selected={dbType} onChange={setDbType} themeColor={themeColor} />
            </div>
            <div style={{ marginBottom: '32px' }}>
              <label style={{ display: 'block', fontSize: '16px', fontWeight: '500', color: '#333', marginBottom: '12px' }}>What do you need? *</label>
              <ChipGroup options={purposeOptions} selected={purpose} onChange={setPurpose} themeColor={themeColor} />
            </div>
            <div style={{ marginBottom: '32px' }}>
              <label style={{ display: 'block', fontSize: '16px', fontWeight: '500', color: '#333', marginBottom: '12px' }}>Expected data size</label>
              <ChipGroup options={scaleOptions} selected={scale} onChange={setScale} themeColor={themeColor} />
            </div>
            <div style={{ marginBottom: '32px' }}>
              <label style={{ display: 'block', fontSize: '16px', fontWeight: '500', color: '#333', marginBottom: '12px' }}>Starting point</label>
              <ChipGroup options={existingOptions} selected={existing} onChange={setExisting} themeColor={themeColor} />
            </div>
            <motion.button whileHover={{ scale: isValid ? 1.02 : 1 }} whileTap={{ scale: isValid ? 0.98 : 1 }} onClick={handleContinue} disabled={!isValid} style={{ width: '100%', padding: '16px 32px', backgroundColor: isValid ? themeColor : '#E5E7EB', color: isValid ? 'white' : '#9CA3AF', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: '600', cursor: isValid ? 'pointer' : 'not-allowed', marginTop: '24px' }}>Continue</motion.button>
          </motion.div>
        </div>
        <CartSummary />
      </div>
    </div>
  );
};

export default DatabaseStep1;
