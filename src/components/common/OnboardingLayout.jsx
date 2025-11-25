import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '../../hooks/useMediaQuery';
import CartSummary from './CartSummary';

const OnboardingLayout = ({ 
  children, 
  step, 
  totalSteps, 
  themeColor, 
  backPath,
  title,
  subtitle 
}) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const progressPercent = (step / totalSteps) * 100;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FAFAFA' }}>
      {/* Header */}
      <div style={{ 
        padding: isMobile ? '12px 16px' : '16px 24px', 
        borderBottom: '1px solid #eee', 
        backgroundColor: 'white', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between' 
      }}>
        <button 
          onClick={() => navigate(backPath)} 
          style={{ 
            background: 'none', 
            border: 'none', 
            cursor: 'pointer', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px', 
            color: '#666',
            padding: '8px',
            margin: '-8px',
            fontSize: isMobile ? '14px' : '16px'
          }}
        >
          <svg width={isMobile ? 18 : 20} height={isMobile ? 18 : 20} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {!isMobile && 'Back'}
        </button>
        <div style={{ fontSize: isMobile ? '12px' : '14px', color: '#666' }}>
          Step {step} of {totalSteps}
        </div>
      </div>

      {/* Progress Bar */}
      <div style={{ height: '4px', backgroundColor: '#E5E7EB' }}>
        <motion.div 
          initial={{ width: `${((step - 1) / totalSteps) * 100}%` }} 
          animate={{ width: `${progressPercent}%` }} 
          transition={{ duration: 0.3 }}
          style={{ height: '100%', backgroundColor: themeColor }} 
        />
      </div>

      {/* Main Content */}
      <div style={{ 
        display: 'flex', 
        maxWidth: '1400px', 
        margin: '0 auto',
        flexDirection: isMobile ? 'column' : 'row'
      }}>
        <div style={{ 
          flex: 1, 
          padding: isMobile ? '24px 16px 120px' : '40px', 
          maxWidth: isMobile ? '100%' : '900px' 
        }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 style={{ 
              fontSize: isMobile ? '24px' : '28px', 
              fontWeight: '600', 
              marginBottom: '8px', 
              color: '#111' 
            }}>
              {title}
            </h1>
            <p style={{ 
              color: '#666', 
              marginBottom: isMobile ? '24px' : '32px',
              fontSize: isMobile ? '14px' : '16px'
            }}>
              {subtitle}
            </p>
            {children}
          </motion.div>
        </div>
        <CartSummary />
      </div>
    </div>
  );
};

export default OnboardingLayout;
