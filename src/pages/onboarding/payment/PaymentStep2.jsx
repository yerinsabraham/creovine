import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useProject } from '../../../context/ProjectContext';
import { useCart } from '../../../context/CartContext';
import { useIsMobile } from '../../../hooks/useMediaQuery';
import ChipGroup from '../../../components/common/ChipGroup';
import AssistedToggle from '../../../components/common/AssistedToggle';
import CartSummary from '../../../components/common/CartSummary';

const PaymentStep2 = () => {
  const navigate = useNavigate();
  const { projectData, updateProjectData } = useProject();
  const { addItem, removeItem, items } = useCart();
  const isMobile = useIsMobile();
  
  const themeColor = '#8B5CF6';
  const paymentType = projectData?.payment?.paymentType || '';
  
  const [features, setFeatures] = useState(projectData?.payment?.features || []);
  const [webhooks, setWebhooks] = useState(projectData?.payment?.webhooks || '');
  const [subFeatures, setSubFeatures] = useState(projectData?.payment?.subFeatures || []);
  
  const [checkoutAssist, setCheckoutAssist] = useState(items.some(item => item.id === 'payment-checkout-assist'));

  const featureOptions = [
    { id: 'checkout', label: 'Checkout Page' },
    { id: 'embedded', label: 'Embedded Form' },
    { id: 'mobile', label: 'Mobile Payments' },
    { id: 'refunds', label: 'Refund Handling' },
    { id: 'coupons', label: 'Coupons/Discounts' },
    { id: 'receipts', label: 'Email Receipts' },
    { id: 'tax', label: 'Tax Calculation' },
    { id: 'fraud', label: 'Fraud Prevention' }
  ];

  const subFeatureOptions = [
    { id: 'plans', label: 'Multiple Plans' },
    { id: 'trials', label: 'Free Trials' },
    { id: 'metered', label: 'Metered Billing' },
    { id: 'upgrade', label: 'Plan Upgrades' },
    { id: 'pause', label: 'Pause/Resume' },
    { id: 'prorate', label: 'Proration' },
    { id: 'dunning', label: 'Failed Payment Handling' }
  ];

  const webhookOptions = [
    { id: 'basic', label: 'Basic (Success/Fail)' },
    { id: 'full', label: 'Full Event Handling' },
    { id: 'custom', label: 'Custom Events' },
    { id: 'none', label: 'Not Needed' }
  ];

  useEffect(() => {
    if (checkoutAssist) {
      addItem({ id: 'payment-checkout-assist', name: 'Custom Checkout Design', description: 'Professionally designed payment checkout flow', price: 50, category: 'Payment Integration' });
    } else { removeItem('payment-checkout-assist'); }
  }, [checkoutAssist]);

  const handleContinue = () => {
    updateProjectData({ payment: { ...projectData?.payment, features, webhooks, subFeatures } });
    navigate('/onboarding/payment/step3');
  };

  const isValid = features.length > 0;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FAFAFA' }}>
      <div style={{ padding: isMobile ? '12px 16px' : '16px 24px', borderBottom: '1px solid #eee', backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button onClick={() => navigate('/onboarding/payment/step1')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', color: '#666', padding: '8px', margin: '-8px' }}>
          <svg width={isMobile ? 18 : 20} height={isMobile ? 18 : 20} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>{!isMobile && 'Back'}
        </button>
        <div style={{ fontSize: isMobile ? '12px' : '14px', color: '#666' }}>Step 2 of 3</div>
      </div>
      <div style={{ height: '4px', backgroundColor: '#E5E7EB' }}><motion.div initial={{ width: '33%' }} animate={{ width: '66%' }} style={{ height: '100%', backgroundColor: themeColor }} /></div>
      <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ flex: 1, padding: isMobile ? '24px 16px 120px' : '40px', maxWidth: isMobile ? '100%' : '900px' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 style={{ fontSize: isMobile ? '24px' : '28px', fontWeight: '600', marginBottom: '8px', color: '#111' }}>Payment Features</h1>
            <p style={{ color: '#666', marginBottom: isMobile ? '24px' : '32px', fontSize: isMobile ? '14px' : '16px' }}>What payment features do you need?</p>
            <div style={{ marginBottom: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <label style={{ fontSize: '16px', fontWeight: '500', color: '#333' }}>Payment features *</label>
                <AssistedToggle enabled={checkoutAssist} onToggle={setCheckoutAssist} price={50} label="Custom checkout" />
              </div>
              <ChipGroup options={featureOptions} selected={features} onChange={setFeatures} multiple={true} themeColor={themeColor} />
            </div>
            {(paymentType === 'subscription' || paymentType === 'both') && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} style={{ marginBottom: '32px' }}>
                <label style={{ display: 'block', fontSize: '16px', fontWeight: '500', color: '#333', marginBottom: '12px' }}>Subscription features</label>
                <ChipGroup options={subFeatureOptions} selected={subFeatures} onChange={setSubFeatures} multiple={true} themeColor={themeColor} />
              </motion.div>
            )}
            <div style={{ marginBottom: '32px' }}>
              <label style={{ display: 'block', fontSize: '16px', fontWeight: '500', color: '#333', marginBottom: '12px' }}>Webhook handling</label>
              <ChipGroup options={webhookOptions} selected={webhooks} onChange={setWebhooks} themeColor={themeColor} />
            </div>
            <motion.button whileHover={{ scale: isValid ? 1.02 : 1 }} whileTap={{ scale: isValid ? 0.98 : 1 }} onClick={handleContinue} disabled={!isValid} style={{ width: '100%', padding: '16px 32px', backgroundColor: isValid ? themeColor : '#E5E7EB', color: isValid ? 'white' : '#9CA3AF', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: '600', cursor: isValid ? 'pointer' : 'not-allowed', marginTop: '24px' }}>Continue</motion.button>
          </motion.div>
        </div>
        <CartSummary />
      </div>
    </div>
  );
};

export default PaymentStep2;
