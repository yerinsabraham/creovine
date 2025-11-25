import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useProject } from '../../../context/ProjectContext';
import { useCart } from '../../../context/CartContext';
import { useIsMobile } from '../../../hooks/useMediaQuery';
import ChipGroup from '../../../components/common/ChipGroup';
import AssistedToggle from '../../../components/common/AssistedToggle';
import CartSummary from '../../../components/common/CartSummary';

const DatabaseStep2 = () => {
  const navigate = useNavigate();
  const { projectData, updateProjectData } = useProject();
  const { addItem, removeItem, items } = useCart();
  const isMobile = useIsMobile();
  
  const themeColor = '#F97316';
  
  const [entities, setEntities] = useState(projectData?.database?.entities || '');
  const [relationships, setRelationships] = useState(projectData?.database?.relationships || '');
  const [features, setFeatures] = useState(projectData?.database?.features || []);
  
  const [schemaAssist, setSchemaAssist] = useState(items.some(item => item.id === 'db-schema-assist'));

  const relationshipOptions = [
    { id: 'simple', label: 'Simple (few tables)' },
    { id: 'moderate', label: 'Moderate Relations' },
    { id: 'complex', label: 'Complex Relations' },
    { id: 'hierarchical', label: 'Hierarchical Data' },
    { id: 'graph', label: 'Graph-like Relations' }
  ];

  const featureOptions = [
    { id: 'indexes', label: 'Custom Indexes' },
    { id: 'fulltext', label: 'Full-Text Search' },
    { id: 'geospatial', label: 'Geospatial Data' },
    { id: 'json', label: 'JSON Fields' },
    { id: 'timeseries', label: 'Time-Series Data' },
    { id: 'encryption', label: 'Data Encryption' },
    { id: 'audit', label: 'Audit Logging' },
    { id: 'versioning', label: 'Data Versioning' }
  ];

  useEffect(() => {
    if (schemaAssist) {
      addItem({ id: 'db-schema-assist', name: 'Schema Design Assistance', description: 'Expert help designing your database schema', price: 55, category: 'Database Setup' });
    } else { removeItem('db-schema-assist'); }
  }, [schemaAssist]);

  const handleContinue = () => {
    updateProjectData({ database: { ...projectData?.database, entities, relationships, features } });
    navigate('/onboarding/database/step3');
  };

  const isValid = relationships;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FAFAFA' }}>
      <div style={{ padding: isMobile ? '12px 16px' : '16px 24px', borderBottom: '1px solid #eee', backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button onClick={() => navigate('/onboarding/database/step1')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', color: '#666', padding: '8px', margin: '-8px' }}>
          <svg width={isMobile ? 18 : 20} height={isMobile ? 18 : 20} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>{!isMobile && 'Back'}
        </button>
        <div style={{ fontSize: isMobile ? '12px' : '14px', color: '#666' }}>Step 2 of 3</div>
      </div>
      <div style={{ height: '4px', backgroundColor: '#E5E7EB' }}><motion.div initial={{ width: '33%' }} animate={{ width: '66%' }} style={{ height: '100%', backgroundColor: themeColor }} /></div>
      <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ flex: 1, padding: isMobile ? '24px 16px 120px' : '40px', maxWidth: isMobile ? '100%' : '900px' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 style={{ fontSize: isMobile ? '24px' : '28px', fontWeight: '600', marginBottom: '8px', color: '#111' }}>Schema & Structure</h1>
            <p style={{ color: '#666', marginBottom: isMobile ? '24px' : '32px', fontSize: isMobile ? '14px' : '16px' }}>Tell us about your data structure needs</p>
            <div style={{ marginBottom: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <label style={{ fontSize: '16px', fontWeight: '500', color: '#333' }}>Main entities/tables</label>
                <AssistedToggle enabled={schemaAssist} onToggle={setSchemaAssist} price={55} label="Schema design help" />
              </div>
              <textarea value={entities} onChange={(e) => setEntities(e.target.value)} placeholder="Describe your main data entities. For example:&#10;- Users (name, email, role)&#10;- Products (title, price, description)&#10;- Orders (user, products, total)" style={{ width: '100%', padding: '16px', border: '1px solid #E5E7EB', borderRadius: '12px', fontSize: '15px', minHeight: '140px', resize: 'vertical', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }} />
            </div>
            <div style={{ marginBottom: '32px' }}>
              <label style={{ display: 'block', fontSize: '16px', fontWeight: '500', color: '#333', marginBottom: '12px' }}>Data relationships *</label>
              <ChipGroup options={relationshipOptions} selected={relationships} onChange={setRelationships} themeColor={themeColor} />
            </div>
            <div style={{ marginBottom: '32px' }}>
              <label style={{ display: 'block', fontSize: '16px', fontWeight: '500', color: '#333', marginBottom: '12px' }}>Special features needed</label>
              <ChipGroup options={featureOptions} selected={features} onChange={setFeatures} multiple={true} themeColor={themeColor} />
            </div>
            <motion.button whileHover={{ scale: isValid ? 1.02 : 1 }} whileTap={{ scale: isValid ? 0.98 : 1 }} onClick={handleContinue} disabled={!isValid} style={{ width: '100%', padding: '16px 32px', backgroundColor: isValid ? themeColor : '#E5E7EB', color: isValid ? 'white' : '#9CA3AF', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: '600', cursor: isValid ? 'pointer' : 'not-allowed', marginTop: '24px' }}>Continue</motion.button>
          </motion.div>
        </div>
        <CartSummary />
      </div>
    </div>
  );
};

export default DatabaseStep2;
