import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useProject } from '../../../context/ProjectContext';
import { useCart } from '../../../context/CartContext';
import { useIsMobile } from '../../../hooks/useMediaQuery';
import ChipGroup from '../../../components/common/ChipGroup';
import AssistedToggle from '../../../components/common/AssistedToggle';
import CartSummary from '../../../components/common/CartSummary';

const QRCodeStep2 = () => {
  const navigate = useNavigate();
  const { projectData, updateProjectData } = useProject();
  const { addItem, removeItem, items } = useCart();
  const isMobile = useIsMobile();
  
  const themeColor = '#0EA5E9';
  
  const [design, setDesign] = useState(projectData?.qrcode?.design || '');
  const [colors, setColors] = useState(projectData?.qrcode?.colors || '');
  const [logo, setLogo] = useState(projectData?.qrcode?.logo || '');
  const [format, setFormat] = useState(projectData?.qrcode?.format || []);
  
  const [brandingAssist, setBrandingAssist] = useState(items.some(item => item.id === 'qr-branding-assist'));

  const designOptions = [
    { id: 'standard', label: 'Standard Square' },
    { id: 'rounded', label: 'Rounded Corners' },
    { id: 'dots', label: 'Dot Pattern' },
    { id: 'artistic', label: 'Artistic/Custom' },
    { id: 'minimal', label: 'Minimal/Clean' }
  ];

  const colorOptions = [
    { id: 'blackwhite', label: 'Black & White' },
    { id: 'branded', label: 'Brand Colors' },
    { id: 'gradient', label: 'Gradient' },
    { id: 'custom', label: 'Custom Colors' }
  ];

  const logoOptions = [
    { id: 'none', label: 'No Logo' },
    { id: 'center', label: 'Center Logo' },
    { id: 'corner', label: 'Corner Logo' },
    { id: 'background', label: 'Background Image' }
  ];

  const formatOptions = [
    { id: 'png', label: 'PNG' },
    { id: 'svg', label: 'SVG' },
    { id: 'pdf', label: 'PDF' },
    { id: 'eps', label: 'EPS/Vector' },
    { id: 'print', label: 'Print-Ready' }
  ];

  useEffect(() => {
    if (brandingAssist) {
      addItem({ id: 'qr-branding-assist', name: 'QR Branding Package', description: 'Custom branded QR code designs matching your brand', price: 40, category: 'QR Code System' });
    } else { removeItem('qr-branding-assist'); }
  }, [brandingAssist]);

  const handleContinue = () => {
    updateProjectData({ qrcode: { ...projectData?.qrcode, design, colors, logo, format } });
    navigate('/onboarding/qrcode/step3');
  };

  const isValid = design;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FAFAFA' }}>
      <div style={{ padding: isMobile ? '12px 16px' : '16px 24px', borderBottom: '1px solid #eee', backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button onClick={() => navigate('/onboarding/qrcode/step1')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', color: '#666', padding: '8px', margin: '-8px' }}>
          <svg width={isMobile ? 18 : 20} height={isMobile ? 18 : 20} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>{!isMobile && 'Back'}
        </button>
        <div style={{ fontSize: isMobile ? '12px' : '14px', color: '#666' }}>Step 2 of 3</div>
      </div>
      <div style={{ height: '4px', backgroundColor: '#E5E7EB' }}><motion.div initial={{ width: '33%' }} animate={{ width: '66%' }} style={{ height: '100%', backgroundColor: themeColor }} /></div>
      <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ flex: 1, padding: isMobile ? '24px 16px 120px' : '40px', maxWidth: isMobile ? '100%' : '900px' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 style={{ fontSize: isMobile ? '24px' : '28px', fontWeight: '600', marginBottom: '8px', color: '#111' }}>Design & Format</h1>
            <p style={{ color: '#666', marginBottom: isMobile ? '24px' : '32px', fontSize: isMobile ? '14px' : '16px' }}>How should your QR codes look?</p>
            <div style={{ marginBottom: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <label style={{ fontSize: '16px', fontWeight: '500', color: '#333' }}>Design style *</label>
                <AssistedToggle enabled={brandingAssist} onToggle={setBrandingAssist} price={40} label="Branding package" />
              </div>
              <ChipGroup options={designOptions} selected={design} onChange={setDesign} themeColor={themeColor} />
            </div>
            <div style={{ marginBottom: '32px' }}>
              <label style={{ display: 'block', fontSize: '16px', fontWeight: '500', color: '#333', marginBottom: '12px' }}>Colors</label>
              <ChipGroup options={colorOptions} selected={colors} onChange={setColors} themeColor={themeColor} />
            </div>
            <div style={{ marginBottom: '32px' }}>
              <label style={{ display: 'block', fontSize: '16px', fontWeight: '500', color: '#333', marginBottom: '12px' }}>Logo integration</label>
              <ChipGroup options={logoOptions} selected={logo} onChange={setLogo} themeColor={themeColor} />
            </div>
            <div style={{ marginBottom: '32px' }}>
              <label style={{ display: 'block', fontSize: '16px', fontWeight: '500', color: '#333', marginBottom: '12px' }}>Output formats needed</label>
              <ChipGroup options={formatOptions} selected={format} onChange={setFormat} multiple={true} themeColor={themeColor} />
            </div>
            <motion.button whileHover={{ scale: isValid ? 1.02 : 1 }} whileTap={{ scale: isValid ? 0.98 : 1 }} onClick={handleContinue} disabled={!isValid} style={{ width: '100%', padding: '16px 32px', backgroundColor: isValid ? themeColor : '#E5E7EB', color: isValid ? 'white' : '#9CA3AF', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: '600', cursor: isValid ? 'pointer' : 'not-allowed', marginTop: '24px' }}>Continue</motion.button>
          </motion.div>
        </div>
        <CartSummary />
      </div>
    </div>
  );
};

export default QRCodeStep2;
