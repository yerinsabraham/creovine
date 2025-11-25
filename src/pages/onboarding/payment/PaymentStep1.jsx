import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useProject } from '../../../context/ProjectContext';
import { useCart } from '../../../context/CartContext';
import { useIsMobile } from '../../../hooks/useMediaQuery';
import ChipGroup from '../../../components/common/ChipGroup';
import AssistedToggle from '../../../components/common/AssistedToggle';
import CartSummary from '../../../components/common/CartSummary';

const PaymentStep1 = () => {
  const navigate = useNavigate();
  const { projectData, updateProjectData } = useProject();
  const { addItem, removeItem, items } = useCart();
  const isMobile = useIsMobile();
  
  const themeColor = '#8B5CF6';
  
  const [provider, setProvider] = useState(projectData?.payment?.provider || '');
  const [paymentType, setPaymentType] = useState(projectData?.payment?.paymentType || '');
  const [currencies, setCurrencies] = useState(projectData?.payment?.currencies || []);
  
  const [providerAssist, setProviderAssist] = useState(items.some(item => item.id === 'payment-provider-assist'));

  const providerOptions = [
    { id: 'stripe', label: 'Stripe' },
    { id: 'paypal', label: 'PayPal' },
    { id: 'square', label: 'Square' },
    { id: 'paystack', label: 'Paystack' },
    { id: 'flutterwave', label: 'Flutterwave' },
    { id: 'razorpay', label: 'Razorpay' },
    { id: 'crypto', label: 'Crypto Payments' },
    { id: 'multiple', label: 'Multiple Providers' },
    { id: 'unsure', label: 'Not Sure' }
  ];

  const paymentTypeOptions = [
    { id: 'onetime', label: 'One-time Payments' },
    { id: 'subscription', label: 'Subscriptions' },
    { id: 'both', label: 'Both' },
    { id: 'marketplace', label: 'Marketplace/Split' },
    { id: 'invoicing', label: 'Invoicing' },
    { id: 'pos', label: 'Point of Sale' }
  ];

  const currencyOptions = [
    { id: 'usd', label: 'USD' },
    { id: 'eur', label: 'EUR' },
    { id: 'gbp', label: 'GBP' },
    { id: 'ngn', label: 'NGN' },
    { id: 'inr', label: 'INR' },
    { id: 'crypto', label: 'Crypto' },
    { id: 'multi', label: 'Multi-Currency' }
  ];

  useEffect(() => {
    if (providerAssist) {
      addItem({ id: 'payment-provider-assist', name: 'Payment Provider Consultation', description: 'Expert help choosing the right payment provider', price: 35, category: 'Payment Integration' });
    } else { removeItem('payment-provider-assist'); }
  }, [providerAssist]);

  const handleContinue = () => {
    updateProjectData({ payment: { ...projectData?.payment, provider, paymentType, currencies } });
    navigate('/onboarding/payment/step2');
  };

  const isValid = provider && paymentType;

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
            <h1 style={{ fontSize: isMobile ? '24px' : '28px', fontWeight: '600', marginBottom: '8px', color: '#111' }}>Payment Provider</h1>
            <p style={{ color: '#666', marginBottom: isMobile ? '24px' : '32px', fontSize: isMobile ? '14px' : '16px' }}>Which payment system do you need to integrate?</p>
            <div style={{ marginBottom: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <label style={{ fontSize: '16px', fontWeight: '500', color: '#333' }}>Payment provider *</label>
                <AssistedToggle enabled={providerAssist} onToggle={setProviderAssist} price={35} label="Help me choose" />
              </div>
              <ChipGroup options={providerOptions} selected={provider} onChange={setProvider} themeColor={themeColor} />
            </div>
            <div style={{ marginBottom: '32px' }}>
              <label style={{ display: 'block', fontSize: '16px', fontWeight: '500', color: '#333', marginBottom: '12px' }}>Payment type *</label>
              <ChipGroup options={paymentTypeOptions} selected={paymentType} onChange={setPaymentType} themeColor={themeColor} />
            </div>
            <div style={{ marginBottom: '32px' }}>
              <label style={{ display: 'block', fontSize: '16px', fontWeight: '500', color: '#333', marginBottom: '12px' }}>Currencies</label>
              <ChipGroup options={currencyOptions} selected={currencies} onChange={setCurrencies} multiple={true} themeColor={themeColor} />
            </div>
            <motion.button whileHover={{ scale: isValid ? 1.02 : 1 }} whileTap={{ scale: isValid ? 0.98 : 1 }} onClick={handleContinue} disabled={!isValid} style={{ width: '100%', padding: '16px 32px', backgroundColor: isValid ? themeColor : '#E5E7EB', color: isValid ? 'white' : '#9CA3AF', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: '600', cursor: isValid ? 'pointer' : 'not-allowed', marginTop: '24px' }}>Continue</motion.button>
          </motion.div>
        </div>
        <CartSummary />
      </div>
    </div>
  );
};

export default PaymentStep1;
