import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useProject } from '../../../context/ProjectContext';
import { useCart } from '../../../context/CartContext';
import { useIsMobile } from '../../../hooks/useMediaQuery';
import ChipGroup from '../../../components/common/ChipGroup';
import AssistedToggle from '../../../components/common/AssistedToggle';
import CartSummary from '../../../components/common/CartSummary';

const AuthStep1 = () => {
  const navigate = useNavigate();
  const { projectData, updateProjectData } = useProject();
  const { addItem, removeItem, items } = useCart();
  const isMobile = useIsMobile();
  
  const themeColor = '#10B981';
  
  const [authType, setAuthType] = useState(projectData?.auth?.authType || '');
  const [platform, setPlatform] = useState(projectData?.auth?.platform || '');
  const [providers, setProviders] = useState(projectData?.auth?.providers || []);
  
  const [authPlanAssist, setAuthPlanAssist] = useState(items.some(item => item.id === 'auth-plan-assist'));

  const authTypeOptions = [
    { id: 'email', label: 'Email/Password' },
    { id: 'social', label: 'Social Login Only' },
    { id: 'both', label: 'Email + Social' },
    { id: 'sso', label: 'SSO/Enterprise' },
    { id: 'passwordless', label: 'Passwordless' },
    { id: 'mfa', label: 'Multi-Factor Auth' }
  ];

  const platformOptions = [
    { id: 'firebase', label: 'Firebase Auth' },
    { id: 'auth0', label: 'Auth0' },
    { id: 'supabase', label: 'Supabase Auth' },
    { id: 'cognito', label: 'AWS Cognito' },
    { id: 'clerk', label: 'Clerk' },
    { id: 'custom', label: 'Custom Solution' },
    { id: 'unsure', label: 'Not Sure' }
  ];

  const providerOptions = [
    { id: 'google', label: 'Google' },
    { id: 'apple', label: 'Apple' },
    { id: 'facebook', label: 'Facebook' },
    { id: 'twitter', label: 'Twitter/X' },
    { id: 'github', label: 'GitHub' },
    { id: 'linkedin', label: 'LinkedIn' },
    { id: 'microsoft', label: 'Microsoft' },
    { id: 'discord', label: 'Discord' }
  ];

  useEffect(() => {
    if (authPlanAssist) {
      addItem({ id: 'auth-plan-assist', name: 'Auth Strategy Consultation', description: 'Expert help planning your authentication strategy', price: 40, category: 'Authentication' });
    } else { removeItem('auth-plan-assist'); }
  }, [authPlanAssist]);

  const handleContinue = () => {
    updateProjectData({ auth: { ...projectData?.auth, authType, platform, providers } });
    navigate('/onboarding/auth/step2');
  };

  const isValid = authType && platform;

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
            <h1 style={{ fontSize: isMobile ? '24px' : '28px', fontWeight: '600', marginBottom: '8px', color: '#111' }}>Authentication Type</h1>
            <p style={{ color: '#666', marginBottom: isMobile ? '24px' : '32px', fontSize: isMobile ? '14px' : '16px' }}>How should users log into your application?</p>
            <div style={{ marginBottom: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <label style={{ fontSize: '16px', fontWeight: '500', color: '#333' }}>Authentication method *</label>
                <AssistedToggle enabled={authPlanAssist} onToggle={setAuthPlanAssist} price={40} label="Strategy help" />
              </div>
              <ChipGroup options={authTypeOptions} selected={authType} onChange={setAuthType} themeColor={themeColor} />
            </div>
            <div style={{ marginBottom: '32px' }}>
              <label style={{ display: 'block', fontSize: '16px', fontWeight: '500', color: '#333', marginBottom: '12px' }}>Auth platform *</label>
              <ChipGroup options={platformOptions} selected={platform} onChange={setPlatform} themeColor={themeColor} />
            </div>
            {(authType === 'social' || authType === 'both') && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} style={{ marginBottom: '32px' }}>
                <label style={{ display: 'block', fontSize: '16px', fontWeight: '500', color: '#333', marginBottom: '12px' }}>Social providers</label>
                <ChipGroup options={providerOptions} selected={providers} onChange={setProviders} multiple={true} themeColor={themeColor} />
              </motion.div>
            )}
            <motion.button whileHover={{ scale: isValid ? 1.02 : 1 }} whileTap={{ scale: isValid ? 0.98 : 1 }} onClick={handleContinue} disabled={!isValid} style={{ width: '100%', padding: '16px 32px', backgroundColor: isValid ? themeColor : '#E5E7EB', color: isValid ? 'white' : '#9CA3AF', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: '600', cursor: isValid ? 'pointer' : 'not-allowed', marginTop: '24px' }}>Continue</motion.button>
          </motion.div>
        </div>
        <CartSummary />
      </div>
    </div>
  );
};

export default AuthStep1;
