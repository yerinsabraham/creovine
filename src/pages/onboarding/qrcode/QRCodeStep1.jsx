import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useProject } from '../../../context/ProjectContext';
import { useCart } from '../../../context/CartContext';
import { useIsMobile } from '../../../hooks/useMediaQuery';
import ChipGroup from '../../../components/common/ChipGroup';
import AssistedToggle from '../../../components/common/AssistedToggle';
import CartSummary from '../../../components/common/CartSummary';

const QRCodeStep1 = () => {
  const navigate = useNavigate();
  const { projectData, updateProjectData } = useProject();
  const { addItem, removeItem, items } = useCart();
  const isMobile = useIsMobile();
  
  const themeColor = '#0EA5E9';
  
  const [qrType, setQrType] = useState(projectData?.qrcode?.qrType || '');
  const [purpose, setPurpose] = useState(projectData?.qrcode?.purpose || '');
  const [quantity, setQuantity] = useState(projectData?.qrcode?.quantity || '');
  const [dynamicData, setDynamicData] = useState(projectData?.qrcode?.dynamicData || '');
  
  const [designAssist, setDesignAssist] = useState(items.some(item => item.id === 'qr-design-assist'));

  const qrTypeOptions = [
    { id: 'url', label: 'URL/Website' },
    { id: 'vcard', label: 'Contact vCard' },
    { id: 'wifi', label: 'WiFi Credentials' },
    { id: 'payment', label: 'Payment/Crypto' },
    { id: 'ticket', label: 'Event Ticket' },
    { id: 'inventory', label: 'Inventory/Product' },
    { id: 'auth', label: 'Authentication' },
    { id: 'custom', label: 'Custom Data' }
  ];

  const purposeOptions = [
    { id: 'marketing', label: 'Marketing/Campaigns' },
    { id: 'business', label: 'Business Cards' },
    { id: 'product', label: 'Product Labels' },
    { id: 'event', label: 'Event Management' },
    { id: 'app', label: 'Mobile App Feature' },
    { id: 'inventory', label: 'Inventory Tracking' },
    { id: 'other', label: 'Other' }
  ];

  const quantityOptions = [
    { id: 'single', label: 'Single QR Code' },
    { id: 'few', label: 'A Few (2-10)' },
    { id: 'many', label: 'Many (10-100)' },
    { id: 'bulk', label: 'Bulk (100+)' },
    { id: 'dynamic', label: 'Dynamic Generation' }
  ];

  const dynamicOptions = [
    { id: 'static', label: 'Static (Fixed Data)' },
    { id: 'dynamic', label: 'Dynamic (Trackable)' },
    { id: 'realtime', label: 'Real-time Updates' },
    { id: 'unsure', label: 'Not Sure' }
  ];

  useEffect(() => {
    if (designAssist) {
      addItem({ id: 'qr-design-assist', name: 'QR Design Consultation', description: 'Expert help with QR code design and branding', price: 25, category: 'QR Code System' });
    } else { removeItem('qr-design-assist'); }
  }, [designAssist]);

  const handleContinue = () => {
    updateProjectData({ qrcode: { ...projectData?.qrcode, qrType, purpose, quantity, dynamicData } });
    navigate('/onboarding/qrcode/step2');
  };

  const isValid = qrType && purpose;

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
            <h1 style={{ fontSize: isMobile ? '24px' : '28px', fontWeight: '600', marginBottom: '8px', color: '#111' }}>QR Code Type</h1>
            <p style={{ color: '#666', marginBottom: isMobile ? '24px' : '32px', fontSize: isMobile ? '14px' : '16px' }}>What kind of QR code system do you need?</p>
            <div style={{ marginBottom: isMobile ? '24px' : '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                <label style={{ fontSize: isMobile ? '14px' : '16px', fontWeight: '500', color: '#333' }}>QR code type *</label>
                <AssistedToggle enabled={designAssist} onToggle={setDesignAssist} price={25} label="Design help" />
              </div>
              <ChipGroup options={qrTypeOptions} selected={qrType} onChange={setQrType} themeColor={themeColor} />
            </div>
            <div style={{ marginBottom: '32px' }}>
              <label style={{ display: 'block', fontSize: '16px', fontWeight: '500', color: '#333', marginBottom: '12px' }}>What's it for? *</label>
              <ChipGroup options={purposeOptions} selected={purpose} onChange={setPurpose} themeColor={themeColor} />
            </div>
            <div style={{ marginBottom: '32px' }}>
              <label style={{ display: 'block', fontSize: '16px', fontWeight: '500', color: '#333', marginBottom: '12px' }}>How many QR codes?</label>
              <ChipGroup options={quantityOptions} selected={quantity} onChange={setQuantity} themeColor={themeColor} />
            </div>
            <div style={{ marginBottom: '32px' }}>
              <label style={{ display: 'block', fontSize: '16px', fontWeight: '500', color: '#333', marginBottom: '12px' }}>Static or dynamic?</label>
              <ChipGroup options={dynamicOptions} selected={dynamicData} onChange={setDynamicData} themeColor={themeColor} />
            </div>
            <motion.button whileHover={{ scale: isValid ? 1.02 : 1 }} whileTap={{ scale: isValid ? 0.98 : 1 }} onClick={handleContinue} disabled={!isValid} style={{ width: '100%', padding: '16px 32px', backgroundColor: isValid ? themeColor : '#E5E7EB', color: isValid ? 'white' : '#9CA3AF', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: '600', cursor: isValid ? 'pointer' : 'not-allowed', marginTop: '24px' }}>Continue</motion.button>
          </motion.div>
        </div>
        <CartSummary />
      </div>
    </div>
  );
};

export default QRCodeStep1;
