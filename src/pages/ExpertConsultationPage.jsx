import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useProject } from '../context/ProjectContext';
import { useIsMobile } from '../hooks/useMediaQuery';
import { formatCurrency } from '../utils/pricingCalculator';

const ExpertConsultationPage = () => {
  const { currentUser } = useAuth();
  const { projectData } = useProject();
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [consultationStarted, setConsultationStarted] = useState(false);
  
  const estimate = location.state?.estimate || projectData?.phases?.estimate;
  const primaryService = location.state?.primaryService || projectData?.phases?.primaryService;

  useEffect(() => {
    if (consultationStarted) {
      // Auto-reply from expert (simulated)
      setTimeout(() => {
        const expertMessage = {
          from: 'expert',
          text: `Hi! I've reviewed your ${primaryService?.name || 'project'} requirements. I'll get back to you within 2-4 hours with a detailed quote and timeline. In the meantime, feel free to ask any questions!`,
          timestamp: new Date().toISOString()
        };
        setMessages(prev => [...prev, expertMessage]);
      }, 2000);
    }
  }, [consultationStarted, primaryService]);

  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    const newMessage = {
      from: 'user',
      text: message,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, newMessage]);
    setMessage('');
    
    if (!consultationStarted) {
      setConsultationStarted(true);
    }
  };

  const handleStartConsultation = () => {
    const initialMessage = {
      from: 'user',
      text: `Hi, I'd like to discuss the project quote for my ${primaryService?.name || 'project'}. The estimated total is ${formatCurrency(estimate?.total || 0)}.`,
      timestamp: new Date().toISOString()
    };
    setMessages([initialMessage]);
    setConsultationStarted(true);
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0F1C2E',
      display: 'flex',
      flexDirection: 'column'
    }}>
      
      {/* Header */}
      <div style={{
        backgroundColor: '#15293A',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        padding: isMobile ? '16px 20px' : '20px 40px'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h1 style={{
              fontSize: isMobile ? '18px' : '24px',
              fontWeight: '700',
              color: '#FFFFFF',
              marginBottom: '4px'
            }}>
              Expert Consultation
            </h1>
            <p style={{
              fontSize: '14px',
              color: 'rgba(255, 255, 255, 0.6)'
            }}>
              {primaryService?.name || 'Your Project'}
            </p>
          </div>
          
          <button
            onClick={() => navigate('/dashboard')}
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '8px',
              padding: '8px 16px',
              color: '#FFFFFF',
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        flex: 1,
        maxWidth: '900px',
        width: '100%',
        margin: '0 auto',
        padding: isMobile ? '20px' : '40px',
        display: 'flex',
        flexDirection: 'column'
      }}>
        
        {!consultationStarted ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              backgroundColor: '#15293A',
              borderRadius: '16px',
              padding: isMobile ? '32px 24px' : '48px',
              textAlign: 'center',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            <div style={{
              fontSize: '48px',
              marginBottom: '24px'
            }}>
              💬
            </div>
            
            <h2 style={{
              fontSize: isMobile ? '24px' : '32px',
              fontWeight: '800',
              color: '#FFFFFF',
              marginBottom: '16px'
            }}>
              Talk to an Expert
            </h2>
            
            <p style={{
              fontSize: '16px',
              color: 'rgba(255, 255, 255, 0.7)',
              marginBottom: '32px',
              maxWidth: '500px',
              margin: '0 auto 32px auto'
            }}>
              Our expert will review your requirements and provide a personalized quote and timeline.
            </p>
            
            {estimate && (
              <div style={{
                backgroundColor: 'rgba(41, 189, 152, 0.1)',
                border: '1px solid rgba(41, 189, 152, 0.3)',
                borderRadius: '12px',
                padding: '24px',
                marginBottom: '32px'
              }}>
                <div style={{
                  fontSize: '14px',
                  color: 'rgba(255, 255, 255, 0.6)',
                  marginBottom: '8px'
                }}>
                  Current Estimate
                </div>
                <div style={{
                  fontSize: '36px',
                  fontWeight: '800',
                  color: '#29BD98'
                }}>
                  {formatCurrency(estimate.total)}
                </div>
              </div>
            )}
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleStartConsultation}
              style={{
                backgroundColor: '#29BD98',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '50px',
                padding: '16px 48px',
                fontSize: '17px',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: '0 4px 20px rgba(41, 189, 152, 0.3)'
              }}
            >
              Start Consultation
            </motion.button>
            
            <p style={{
              marginTop: '16px',
              fontSize: '13px',
              color: 'rgba(255, 255, 255, 0.5)'
            }}>
              Average response time: 2-4 hours
            </p>
          </motion.div>
        ) : (
          <>
            {/* Chat Messages */}
            <div style={{
              flex: 1,
              backgroundColor: '#15293A',
              borderRadius: '16px 16px 0 0',
              padding: '24px',
              overflowY: 'auto',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderBottom: 'none',
              minHeight: '400px'
            }}>
              {messages.map((msg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    marginBottom: '16px',
                    display: 'flex',
                    justifyContent: msg.from === 'user' ? 'flex-end' : 'flex-start'
                  }}
                >
                  <div style={{
                    maxWidth: '70%',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    backgroundColor: msg.from === 'user' ? '#29BD98' : 'rgba(255, 255, 255, 0.05)',
                    color: '#FFFFFF',
                    fontSize: '15px',
                    lineHeight: '1.5'
                  }}>
                    {msg.text}
                  </div>
                </motion.div>
              ))}
              
              {messages.length === 0 && (
                <div style={{
                  textAlign: 'center',
                  color: 'rgba(255, 255, 255, 0.5)',
                  fontSize: '14px',
                  marginTop: '100px'
                }}>
                  Start the conversation...
                </div>
              )}
            </div>

            {/* Message Input */}
            <div style={{
              backgroundColor: '#15293A',
              borderRadius: '0 0 16px 16px',
              padding: '20px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderTop: '1px solid rgba(255, 255, 255, 0.05)'
            }}>
              <div style={{
                display: 'flex',
                gap: '12px'
              }}>
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type your message..."
                  style={{
                    flex: 1,
                    backgroundColor: 'rgba(0, 0, 0, 0.2)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    padding: '12px 16px',
                    color: '#FFFFFF',
                    fontSize: '15px',
                    outline: 'none'
                  }}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!message.trim()}
                  style={{
                    backgroundColor: message.trim() ? '#29BD98' : 'rgba(255, 255, 255, 0.1)',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '12px 24px',
                    fontSize: '15px',
                    fontWeight: '600',
                    cursor: message.trim() ? 'pointer' : 'not-allowed',
                    opacity: message.trim() ? 1 : 0.5
                  }}
                >
                  Send
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ExpertConsultationPage;
