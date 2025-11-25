import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useProject } from '../../../context/ProjectContext';
import { useCart } from '../../../context/CartContext';
import { useIsMobile } from '../../../hooks/useMediaQuery';
import ChipGroup from '../../../components/common/ChipGroup';
import AssistedToggle from '../../../components/common/AssistedToggle';
import CartSummary from '../../../components/common/CartSummary';

const AuthStep2 = () => {
  const navigate = useNavigate();
  const { projectData, updateProjectData } = useProject();
  const { addItem, removeItem, items } = useCart();
  const isMobile = useIsMobile();
  
  const themeColor = '#10B981';
  
  const [features, setFeatures] = useState(projectData?.auth?.features || []);
  const [roles, setRoles] = useState(projectData?.auth?.roles || '');
  const [security, setSecurity] = useState(projectData?.auth?.security || []);
  
  const [securityAssist, setSecurityAssist] = useState(items.some(item => item.id === 'auth-security-assist'));

  const featureOptions = [
    { id: 'registration', label: 'User Registration' },
    { id: 'reset', label: 'Password Reset' },
    { id: 'verify', label: 'Email Verification' },
    { id: 'profile', label: 'Profile Management' },
    { id: 'sessions', label: 'Session Management' },
    { id: 'remember', label: 'Remember Me' },
    { id: 'logout', label: 'Logout All Devices' }
  ];

  const rolesOptions = [
    { id: 'none', label: 'No Roles (All Equal)' },
    { id: 'simple', label: 'Simple (Admin/User)' },
    { id: 'moderate', label: 'Multiple Roles' },
    { id: 'complex', label: 'Complex Permissions' },
    { id: 'custom', label: 'Custom RBAC' }
  ];

  const securityOptions = [
    { id: 'mfa', label: '2FA/MFA' },
    { id: 'captcha', label: 'CAPTCHA' },
    { id: 'ratelimit', label: 'Rate Limiting' },
    { id: 'lockout', label: 'Account Lockout' },
    { id: 'audit', label: 'Login Audit Log' },
    { id: 'alerts', label: 'Security Alerts' },
    { id: 'devices', label: 'Device Tracking' }
  ];

  useEffect(() => {
    if (securityAssist) {
      addItem({ id: 'auth-security-assist', name: 'Security Implementation Review', description: 'Expert security audit of your auth implementation', price: 65, category: 'Authentication' });
    } else { removeItem('auth-security-assist'); }
  }, [securityAssist]);

  const handleContinue = () => {
    updateProjectData({ auth: { ...projectData?.auth, features, roles, security } });
    navigate('/onboarding/auth/step3');
  };

  const isValid = features.length > 0 && roles;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FAFAFA' }}>
      <div style={{ padding: isMobile ? '12px 16px' : '16px 24px', borderBottom: '1px solid #eee', backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button onClick={() => navigate('/onboarding/auth/step1')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', color: '#666', padding: '8px', margin: '-8px' }}>
          <svg width={isMobile ? 18 : 20} height={isMobile ? 18 : 20} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>{!isMobile && 'Back'}
        </button>
        <div style={{ fontSize: isMobile ? '12px' : '14px', color: '#666' }}>Step 2 of 3</div>
      </div>
      <div style={{ height: '4px', backgroundColor: '#E5E7EB' }}><motion.div initial={{ width: '33%' }} animate={{ width: '66%' }} style={{ height: '100%', backgroundColor: themeColor }} /></div>
      <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ flex: 1, padding: isMobile ? '24px 16px 120px' : '40px', maxWidth: isMobile ? '100%' : '900px' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 style={{ fontSize: isMobile ? '24px' : '28px', fontWeight: '600', marginBottom: '8px', color: '#111' }}>Features & Security</h1>
            <p style={{ color: '#666', marginBottom: isMobile ? '24px' : '32px', fontSize: isMobile ? '14px' : '16px' }}>What features and security measures do you need?</p>
            <div style={{ marginBottom: '32px' }}>
              <label style={{ display: 'block', fontSize: '16px', fontWeight: '500', color: '#333', marginBottom: '12px' }}>Auth features needed *</label>
              <ChipGroup options={featureOptions} selected={features} onChange={setFeatures} multiple={true} themeColor={themeColor} />
            </div>
            <div style={{ marginBottom: '32px' }}>
              <label style={{ display: 'block', fontSize: '16px', fontWeight: '500', color: '#333', marginBottom: '12px' }}>User roles & permissions *</label>
              <ChipGroup options={rolesOptions} selected={roles} onChange={setRoles} themeColor={themeColor} />
            </div>
            <div style={{ marginBottom: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <label style={{ fontSize: '16px', fontWeight: '500', color: '#333' }}>Security features</label>
                <AssistedToggle enabled={securityAssist} onToggle={setSecurityAssist} price={65} label="Security review" />
              </div>
              <ChipGroup options={securityOptions} selected={security} onChange={setSecurity} multiple={true} themeColor={themeColor} />
            </div>
            <motion.button whileHover={{ scale: isValid ? 1.02 : 1 }} whileTap={{ scale: isValid ? 0.98 : 1 }} onClick={handleContinue} disabled={!isValid} style={{ width: '100%', padding: '16px 32px', backgroundColor: isValid ? themeColor : '#E5E7EB', color: isValid ? 'white' : '#9CA3AF', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: '600', cursor: isValid ? 'pointer' : 'not-allowed', marginTop: '24px' }}>Continue</motion.button>
          </motion.div>
        </div>
        <CartSummary />
      </div>
    </div>
  );
};

export default AuthStep2;
