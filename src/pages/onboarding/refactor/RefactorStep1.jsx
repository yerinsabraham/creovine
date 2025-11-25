import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useProject } from '../../../context/ProjectContext';
import { useCart } from '../../../context/CartContext';
import { useIsMobile } from '../../../hooks/useMediaQuery';
import ChipGroup from '../../../components/common/ChipGroup';
import AssistedToggle from '../../../components/common/AssistedToggle';
import CartSummary from '../../../components/common/CartSummary';

const RefactorStep1 = () => {
  const navigate = useNavigate();
  const { projectData, updateProjectData } = useProject();
  const { addItem, removeItem, items } = useCart();
  const isMobile = useIsMobile();
  
  const themeColor = '#F59E0B';
  
  const [codebaseType, setCodebaseType] = useState(projectData?.refactor?.codebaseType || '');
  const [primaryLanguage, setPrimaryLanguage] = useState(projectData?.refactor?.primaryLanguage || '');
  const [codebaseSize, setCodebaseSize] = useState(projectData?.refactor?.codebaseSize || '');
  const [repoUrl, setRepoUrl] = useState(projectData?.refactor?.repoUrl || '');
  
  const [assessmentAssist, setAssessmentAssist] = useState(items.some(item => item.id === 'refactor-assessment'));

  const codebaseTypeOptions = [
    { id: 'frontend', label: 'Frontend' },
    { id: 'backend', label: 'Backend' },
    { id: 'fullstack', label: 'Full-Stack' },
    { id: 'mobile', label: 'Mobile App' },
    { id: 'library', label: 'Library/Package' },
    { id: 'legacy', label: 'Legacy System' }
  ];

  const languageOptions = [
    { id: 'javascript', label: 'JavaScript' },
    { id: 'typescript', label: 'TypeScript' },
    { id: 'python', label: 'Python' },
    { id: 'java', label: 'Java' },
    { id: 'csharp', label: 'C#' },
    { id: 'php', label: 'PHP' },
    { id: 'ruby', label: 'Ruby' },
    { id: 'go', label: 'Go' },
    { id: 'rust', label: 'Rust' },
    { id: 'other', label: 'Other' }
  ];

  const sizeOptions = [
    { id: 'small', label: 'Small (<5K lines)' },
    { id: 'medium', label: 'Medium (5K-20K)' },
    { id: 'large', label: 'Large (20K-100K)' },
    { id: 'enterprise', label: 'Enterprise (100K+)' },
    { id: 'unsure', label: 'Not Sure' }
  ];

  useEffect(() => {
    if (assessmentAssist) {
      addItem({ id: 'refactor-assessment', name: 'Code Assessment', description: 'Comprehensive code quality assessment before refactoring', price: 45, category: 'Code Refactoring' });
    } else { removeItem('refactor-assessment'); }
  }, [assessmentAssist]);

  const handleContinue = () => {
    updateProjectData({ refactor: { ...projectData?.refactor, codebaseType, primaryLanguage, codebaseSize, repoUrl } });
    navigate('/onboarding/refactor/step2');
  };

  const isValid = codebaseType && primaryLanguage;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FAFAFA' }}>
      <div style={{ padding: isMobile ? '12px 16px' : '16px 24px', borderBottom: '1px solid #eee', backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button onClick={() => navigate('/get-started')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', color: '#666' }}>
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>{!isMobile && 'Back'}
        </button>
        <div style={{ fontSize: '14px', color: '#666' }}>Step 1 of 3</div>
      </div>
      <div style={{ height: '4px', backgroundColor: '#E5E7EB' }}><motion.div initial={{ width: 0 }} animate={{ width: '33%' }} style={{ height: '100%', backgroundColor: themeColor }} /></div>
      <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ flex: 1, padding: isMobile ? '24px 16px 120px' : '40px', maxWidth: isMobile ? '100%' : '900px' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 style={{ fontSize: isMobile ? '24px' : '28px', fontWeight: '600', marginBottom: '8px', color: '#111' }}>Your Codebase</h1>
            <p style={{ color: '#666', marginBottom: '32px' }}>Tell us about the code you want to refactor</p>
            <div style={{ marginBottom: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <label style={{ fontSize: '16px', fontWeight: '500', color: '#333' }}>Codebase type *</label>
                <AssistedToggle enabled={assessmentAssist} onToggle={setAssessmentAssist} price={45} label="Code assessment" />
              </div>
              <ChipGroup options={codebaseTypeOptions} selected={codebaseType} onChange={setCodebaseType} themeColor={themeColor} />
            </div>
            <div style={{ marginBottom: '32px' }}>
              <label style={{ display: 'block', fontSize: '16px', fontWeight: '500', color: '#333', marginBottom: '12px' }}>Primary language *</label>
              <ChipGroup options={languageOptions} selected={primaryLanguage} onChange={setPrimaryLanguage} themeColor={themeColor} />
            </div>
            <div style={{ marginBottom: '32px' }}>
              <label style={{ display: 'block', fontSize: '16px', fontWeight: '500', color: '#333', marginBottom: '12px' }}>Codebase size</label>
              <ChipGroup options={sizeOptions} selected={codebaseSize} onChange={setCodebaseSize} themeColor={themeColor} />
            </div>
            <div style={{ marginBottom: '32px' }}>
              <label style={{ display: 'block', fontSize: '16px', fontWeight: '500', color: '#333', marginBottom: '12px' }}>Repository URL (optional)</label>
              <input type="url" value={repoUrl} onChange={(e) => setRepoUrl(e.target.value)} placeholder="https://github.com/username/repo" style={{ width: '100%', padding: '12px 16px', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '15px', outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <motion.button whileHover={{ scale: isValid ? 1.02 : 1 }} whileTap={{ scale: isValid ? 0.98 : 1 }} onClick={handleContinue} disabled={!isValid} style={{ width: '100%', padding: '16px 32px', backgroundColor: isValid ? themeColor : '#E5E7EB', color: isValid ? 'white' : '#9CA3AF', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: '600', cursor: isValid ? 'pointer' : 'not-allowed', marginTop: '24px' }}>Continue</motion.button>
          </motion.div>
        </div>
        <CartSummary />
      </div>
    </div>
  );
};

export default RefactorStep1;
