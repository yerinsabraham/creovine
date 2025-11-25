import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useProject } from '../../../context/ProjectContext';
import { useCart } from '../../../context/CartContext';
import { useIsMobile } from '../../../hooks/useMediaQuery';
import ChipGroup from '../../../components/common/ChipGroup';
import AssistedToggle from '../../../components/common/AssistedToggle';
import CartSummary from '../../../components/common/CartSummary';

const DeploymentStep1 = () => {
  const navigate = useNavigate();
  const { projectData, updateProjectData } = useProject();
  const { addItem, removeItem, items } = useCart();
  const isMobile = useIsMobile();
  
  const themeColor = '#06B6D4';
  
  const [platform, setPlatform] = useState(projectData?.deployment?.platform || '');
  const [projectType, setProjectType] = useState(projectData?.deployment?.projectType || '');
  const [currentState, setCurrentState] = useState(projectData?.deployment?.currentState || '');
  const [repoUrl, setRepoUrl] = useState(projectData?.deployment?.repoUrl || '');
  
  const [platformAssist, setPlatformAssist] = useState(items.some(item => item.id === 'deployment-platform-assist'));

  const platformOptions = [
    { id: 'vercel', label: 'Vercel' },
    { id: 'netlify', label: 'Netlify' },
    { id: 'aws', label: 'AWS' },
    { id: 'gcp', label: 'Google Cloud' },
    { id: 'azure', label: 'Azure' },
    { id: 'digitalocean', label: 'DigitalOcean' },
    { id: 'heroku', label: 'Heroku' },
    { id: 'railway', label: 'Railway' },
    { id: 'render', label: 'Render' },
    { id: 'vps', label: 'Custom VPS' },
    { id: 'unsure', label: 'Help Me Choose' }
  ];

  const projectTypeOptions = [
    { id: 'frontend', label: 'Frontend/Static' },
    { id: 'fullstack', label: 'Full-Stack App' },
    { id: 'backend', label: 'Backend/API' },
    { id: 'mobile', label: 'Mobile App' },
    { id: 'docker', label: 'Docker Container' },
    { id: 'microservices', label: 'Microservices' }
  ];

  const currentStateOptions = [
    { id: 'new', label: 'First Deployment' },
    { id: 'update', label: 'Update Existing' },
    { id: 'migrate', label: 'Migrate Platform' },
    { id: 'cicd', label: 'Setup CI/CD' },
    { id: 'fix', label: 'Fix Deployment Issues' }
  ];

  useEffect(() => {
    if (platformAssist) {
      addItem({ id: 'deployment-platform-assist', name: 'Platform Selection Consultation', description: 'Expert help choosing the right deployment platform', price: 30, category: 'Deployment Help' });
    } else { removeItem('deployment-platform-assist'); }
  }, [platformAssist]);

  const handleContinue = () => {
    updateProjectData({ deployment: { ...projectData?.deployment, platform, projectType, currentState, repoUrl } });
    navigate('/onboarding/deployment/step2');
  };

  const isValid = platform && projectType && currentState;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FAFAFA' }}>
      <div style={{ padding: isMobile ? '12px 16px' : '16px 24px', borderBottom: '1px solid #eee', backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button onClick={() => navigate('/get-started')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', color: '#666' }}>
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>{!isMobile && 'Back'}
        </button>
        <div style={{ fontSize: '14px', color: '#666' }}>Step 1 of 2</div>
      </div>
      <div style={{ height: '4px', backgroundColor: '#E5E7EB' }}><motion.div initial={{ width: 0 }} animate={{ width: '50%' }} style={{ height: '100%', backgroundColor: themeColor }} /></div>
      <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ flex: 1, padding: isMobile ? '24px 16px 120px' : '40px', maxWidth: isMobile ? '100%' : '900px' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 style={{ fontSize: isMobile ? '24px' : '28px', fontWeight: '600', marginBottom: '8px', color: '#111' }}>Deployment Platform</h1>
            <p style={{ color: '#666', marginBottom: '32px' }}>Where do you want to deploy your project?</p>
            <div style={{ marginBottom: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <label style={{ fontSize: '16px', fontWeight: '500', color: '#333' }}>Deployment platform *</label>
                <AssistedToggle enabled={platformAssist} onToggle={setPlatformAssist} price={30} label="Help me choose" />
              </div>
              <ChipGroup options={platformOptions} selected={platform} onChange={setPlatform} themeColor={themeColor} />
            </div>
            <div style={{ marginBottom: '32px' }}>
              <label style={{ display: 'block', fontSize: '16px', fontWeight: '500', color: '#333', marginBottom: '12px' }}>Project type *</label>
              <ChipGroup options={projectTypeOptions} selected={projectType} onChange={setProjectType} themeColor={themeColor} />
            </div>
            <div style={{ marginBottom: '32px' }}>
              <label style={{ display: 'block', fontSize: '16px', fontWeight: '500', color: '#333', marginBottom: '12px' }}>What do you need? *</label>
              <ChipGroup options={currentStateOptions} selected={currentState} onChange={setCurrentState} themeColor={themeColor} />
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

export default DeploymentStep1;
