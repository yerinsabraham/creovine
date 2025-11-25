import { useNavigate } from 'react-router-dom';
import { useMediaQuery } from '../../hooks/useMediaQuery';

const PlaceholderOnboarding = ({ serviceName }) => {
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #15293A 0%, #0F1F2E 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px'
    }}>
      <div style={{
        maxWidth: '600px',
        textAlign: 'center',
        color: '#FFFFFF'
      }}>
        <h1 style={{
          fontSize: isMobile ? '28px' : '36px',
          fontWeight: '600',
          marginBottom: '20px',
          color: '#29BD98'
        }}>
          {serviceName} Flow
        </h1>
        
        <p style={{
          fontSize: isMobile ? '16px' : '18px',
          color: 'rgba(255, 255, 255, 0.7)',
          marginBottom: '30px',
          lineHeight: '1.6'
        }}>
          This onboarding flow is coming soon! For now, we'll redirect you to talk with an expert who can help you with your {serviceName.toLowerCase()} needs.
        </p>

        <div style={{
          display: 'flex',
          gap: '12px',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={() => navigate('/experts')}
            style={{
              padding: '14px 32px',
              backgroundColor: '#29BD98',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#1E9F7F';
              e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#29BD98';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            Talk to Expert
          </button>

          <button
            onClick={() => navigate('/get-started')}
            style={{
              padding: '14px 32px',
              backgroundColor: 'transparent',
              color: '#FFFFFF',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.5)';
              e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
            }}
            onMouseLeave={(e) => {
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
              e.target.style.backgroundColor = 'transparent';
            }}
          >
            Back to Services
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlaceholderOnboarding;
