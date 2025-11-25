import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useProject } from '../../../context/ProjectContext';
import { useCart } from '../../../context/CartContext';
import { useIsMobile } from '../../../hooks/useMediaQuery';
import ChipGroup from '../../../components/common/ChipGroup';
import AssistedToggle from '../../../components/common/AssistedToggle';
import CartSummary from '../../../components/common/CartSummary';

const RefactorStep2 = () => {
  const navigate = useNavigate();
  const { projectData, updateProjectData } = useProject();
  const { addItem, removeItem, items } = useCart();
  const isMobile = useIsMobile();
  
  const themeColor = '#F59E0B';
  
  const [goals, setGoals] = useState(projectData?.refactor?.goals || []);
  const [areas, setAreas] = useState(projectData?.refactor?.areas || '');
  const [issues, setIssues] = useState(projectData?.refactor?.issues || '');
  
  const [architectureAssist, setArchitectureAssist] = useState(items.some(item => item.id === 'refactor-architecture'));

  const goalOptions = [
    { id: 'performance', label: 'Improve Performance' },
    { id: 'readability', label: 'Better Readability' },
    { id: 'maintainability', label: 'Maintainability' },
    { id: 'testing', label: 'Add Testing' },
    { id: 'modernize', label: 'Modernize Tech Stack' },
    { id: 'security', label: 'Security Improvements' },
    { id: 'scalability', label: 'Scalability' },
    { id: 'patterns', label: 'Better Patterns' }
  ];

  const areasOptions = [
    { id: 'all', label: 'Entire Codebase' },
    { id: 'specific', label: 'Specific Modules' },
    { id: 'critical', label: 'Critical Paths Only' },
    { id: 'hotspots', label: 'Problem Hotspots' },
    { id: 'database', label: 'Database Layer' },
    { id: 'api', label: 'API Layer' }
  ];

  useEffect(() => {
    if (architectureAssist) {
      addItem({ id: 'refactor-architecture', name: 'Architecture Review', description: 'Expert review and recommendations for code architecture', price: 75, category: 'Code Refactoring' });
    } else { removeItem('refactor-architecture'); }
  }, [architectureAssist]);

  const handleContinue = () => {
    updateProjectData({ refactor: { ...projectData?.refactor, goals, areas, issues } });
    navigate('/onboarding/refactor/step3');
  };

  const isValid = goals.length > 0 && areas;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FAFAFA' }}>
      <div style={{ padding: isMobile ? '12px 16px' : '16px 24px', borderBottom: '1px solid #eee', backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button onClick={() => navigate('/onboarding/refactor/step1')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', color: '#666' }}>
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>{!isMobile && 'Back'}
        </button>
        <div style={{ fontSize: '14px', color: '#666' }}>Step 2 of 3</div>
      </div>
      <div style={{ height: '4px', backgroundColor: '#E5E7EB' }}><motion.div initial={{ width: '33%' }} animate={{ width: '66%' }} style={{ height: '100%', backgroundColor: themeColor }} /></div>
      <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ flex: 1, padding: isMobile ? '24px 16px 120px' : '40px', maxWidth: isMobile ? '100%' : '900px' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 style={{ fontSize: isMobile ? '24px' : '28px', fontWeight: '600', marginBottom: '8px', color: '#111' }}>Refactoring Goals</h1>
            <p style={{ color: '#666', marginBottom: '32px' }}>What do you want to improve?</p>
            <div style={{ marginBottom: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <label style={{ fontSize: '16px', fontWeight: '500', color: '#333' }}>Refactoring goals *</label>
                <AssistedToggle enabled={architectureAssist} onToggle={setArchitectureAssist} price={75} label="Architecture review" />
              </div>
              <ChipGroup options={goalOptions} selected={goals} onChange={setGoals} multiple={true} themeColor={themeColor} />
            </div>
            <div style={{ marginBottom: '32px' }}>
              <label style={{ display: 'block', fontSize: '16px', fontWeight: '500', color: '#333', marginBottom: '12px' }}>Areas to focus on *</label>
              <ChipGroup options={areasOptions} selected={areas} onChange={setAreas} themeColor={themeColor} />
            </div>
            <div style={{ marginBottom: '32px' }}>
              <label style={{ display: 'block', fontSize: '16px', fontWeight: '500', color: '#333', marginBottom: '12px' }}>Known issues or pain points</label>
              <textarea value={issues} onChange={(e) => setIssues(e.target.value)} placeholder="Describe specific problems you're facing with the code. For example:&#10;- Slow database queries&#10;- Duplicate code everywhere&#10;- Hard to add new features" style={{ width: '100%', padding: '16px', border: '1px solid #E5E7EB', borderRadius: '12px', fontSize: '15px', minHeight: '140px', resize: 'vertical', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }} />
            </div>
            <motion.button whileHover={{ scale: isValid ? 1.02 : 1 }} whileTap={{ scale: isValid ? 0.98 : 1 }} onClick={handleContinue} disabled={!isValid} style={{ width: '100%', padding: '16px 32px', backgroundColor: isValid ? themeColor : '#E5E7EB', color: isValid ? 'white' : '#9CA3AF', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: '600', cursor: isValid ? 'pointer' : 'not-allowed', marginTop: '24px' }}>Continue</motion.button>
          </motion.div>
        </div>
        <CartSummary />
      </div>
    </div>
  );
};

export default RefactorStep2;
