import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle, FaCode, FaMobile, FaPalette, FaServer, FaRocket, FaChartLine } from 'react-icons/fa';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { useAuth } from '../context/AuthContext';
import ExpertAuthModal from '../components/auth/ExpertAuthModal';
import logo from '../assets/logo.png';

const ExpertsPage = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [selectedExpert, setSelectedExpert] = useState(null);

  const handleExpertClick = (expert) => {
    if (!currentUser) {
      setSelectedExpert(expert);
      setShowLoginModal(true);
      return;
    }
    navigate(`/chat/${expert.id}`);
  };

  const handleAuthSuccess = () => {
    setShowLoginModal(false);
    if (selectedExpert) {
      navigate(`/chat/${selectedExpert.id}`);
    }
  };

  const experts = [
    {
      id: 'frontend-specialist',
      name: 'Sarah',
      specialty: 'Frontend Engineering',
      expertise: 'React, Vue, Next.js, UI/UX',
      icon: FaCode,
      color: '#29BD98',
      description: 'Expert in building responsive, performant frontend applications'
    },
    {
      id: 'backend-architect',
      name: 'Michael',
      specialty: 'Backend Architecture',
      expertise: 'Node.js, Python, APIs, Databases',
      icon: FaServer,
      color: '#2497F9',
      description: 'Specialized in scalable backend systems and API design'
    },
    {
      id: 'mobile-developer',
      name: 'Aisha',
      specialty: 'Mobile App Development',
      expertise: 'React Native, Flutter, iOS, Android',
      icon: FaMobile,
      color: '#8B5CF6',
      description: 'Cross-platform mobile app development expert'
    },
    {
      id: 'ui-ux-designer',
      name: 'James',
      specialty: 'UI/UX Design',
      expertise: 'Figma, Design Systems, User Research',
      icon: FaPalette,
      color: '#F59E0B',
      description: 'Creating beautiful, user-centered design experiences'
    },
    {
      id: 'product-strategist',
      name: 'Emily',
      specialty: 'Product Strategy',
      expertise: 'MVP Planning, Market Research, Growth',
      icon: FaRocket,
      color: '#EF4444',
      description: 'Helping turn ideas into successful products'
    },
    {
      id: 'marketing-specialist',
      name: 'David',
      specialty: 'Growth Marketing',
      expertise: 'SEO, Content, Analytics, Conversion',
      icon: FaChartLine,
      color: '#10B981',
      description: 'Driving user acquisition and product growth'
    }
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#15293A' }}>
      {/* Header */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backgroundColor: 'rgba(21, 41, 58, 0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        padding: isMobile ? '16px 20px' : '20px 40px'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <img 
            src={logo} 
            alt="Creovine" 
            style={{
              height: '32px',
              width: 'auto',
              cursor: 'pointer'
            }}
            onClick={() => navigate('/')}
          />
          <button
            onClick={() => navigate('/')}
            style={{
              background: 'transparent',
              border: '2px solid rgba(255, 255, 255, 0.2)',
              color: '#FFFFFF',
              padding: '10px 24px',
              fontSize: '14px',
              fontWeight: '700',
              borderRadius: '24px',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.borderColor = '#29BD98';
              e.target.style.backgroundColor = 'rgba(41, 189, 152, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
              e.target.style.backgroundColor = 'transparent';
            }}
          >
            ← Back to Home
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: isMobile ? '40px 20px' : '80px 40px'
      }}>
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            textAlign: 'center',
            marginBottom: '80px'
          }}
        >
          <h1 style={{
            fontSize: isMobile ? '36px' : '56px',
            fontWeight: '800',
            color: '#FFFFFF',
            marginBottom: '24px',
            lineHeight: '1.2'
          }}>
            Discuss with Our{' '}
            <span style={{
              background: 'linear-gradient(135deg, #29BD98 0%, #2497F9 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Expert Team
            </span>
          </h1>
          <p style={{
            fontSize: isMobile ? '16px' : '20px',
            color: 'rgba(255, 255, 255, 0.7)',
            maxWidth: '700px',
            margin: '0 auto',
            lineHeight: '1.6',
            padding: isMobile ? '0 10px' : '0'
          }}>
            Connect with real human experts across different specializations. Get personalized guidance for your project.
          </p>
          <div style={{
            marginTop: '32px',
            padding: '16px 24px',
            backgroundColor: 'rgba(41, 189, 152, 0.1)',
            border: '1px solid rgba(41, 189, 152, 0.3)',
            borderRadius: '12px',
            display: 'inline-block'
          }}>
            <p style={{
              fontSize: '14px',
              color: '#29BD98',
              fontWeight: '600',
              margin: 0
            }}>
              🤝 Real Human Experts • Not AI • Live Consultation
            </p>
          </div>
        </motion.div>

        {/* Experts Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: isMobile ? '20px' : '32px',
          marginBottom: isMobile ? '40px' : '60px'
        }}>
          {experts.map((expert, index) => {
            const IconComponent = expert.icon;
            return (
              <motion.div
                key={expert.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onClick={() => handleExpertClick(expert)}
                style={{
                  backgroundColor: '#214055',
                  borderRadius: '24px',
                  padding: isMobile ? '24px' : '40px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.3)';
                  e.currentTarget.style.borderColor = expert.color;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                }}
              >
                {/* Background Gradient */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: `linear-gradient(90deg, ${expert.color}, ${expert.color}80)`
                }} />

                {/* Avatar */}
                <div style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: `linear-gradient(135deg, ${expert.color}20, ${expert.color}10)`,
                  border: `3px solid ${expert.color}40`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '24px'
                }}>
                  <IconComponent style={{ fontSize: '36px', color: expert.color }} />
                </div>

                {/* Expert Info */}
                <h3 style={{
                  fontSize: '24px',
                  fontWeight: '700',
                  color: '#FFFFFF',
                  marginBottom: '8px'
                }}>
                  {expert.name}
                </h3>
                <p style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: expert.color,
                  marginBottom: '16px'
                }}>
                  {expert.specialty}
                </p>
                <p style={{
                  fontSize: '14px',
                  color: 'rgba(255, 255, 255, 0.6)',
                  marginBottom: '16px',
                  lineHeight: '1.6'
                }}>
                  {expert.description}
                </p>
                <div style={{
                  padding: '12px 16px',
                  backgroundColor: 'rgba(21, 41, 58, 0.8)',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.05)'
                }}>
                  <p style={{
                    fontSize: '12px',
                    color: 'rgba(255, 255, 255, 0.5)',
                    marginBottom: '4px',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Expertise
                  </p>
                  <p style={{
                    fontSize: '13px',
                    color: 'rgba(255, 255, 255, 0.8)',
                    margin: 0,
                    fontWeight: '500'
                  }}>
                    {expert.expertise}
                  </p>
                </div>

                {/* CTA */}
                <div style={{
                  marginTop: '24px',
                  padding: '12px',
                  background: `linear-gradient(135deg, ${expert.color}15, ${expert.color}05)`,
                  borderRadius: '12px',
                  textAlign: 'center',
                  border: `1px solid ${expert.color}30`
                }}>
                  <p style={{
                    fontSize: '14px',
                    fontWeight: '700',
                    color: expert.color,
                    margin: 0
                  }}>
                    Start Conversation →
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          style={{
            backgroundColor: '#214055',
            borderRadius: '20px',
            padding: isMobile ? '24px 20px' : '40px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            textAlign: 'center'
          }}
        >
          <h3 style={{
            fontSize: '24px',
            fontWeight: '700',
            color: '#FFFFFF',
            marginBottom: '16px'
          }}>
            How It Works
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '32px',
            marginTop: '32px'
          }}>
            <div>
              <div style={{
                fontSize: '40px',
                marginBottom: '12px'
              }}>
                🎯
              </div>
              <h4 style={{
                fontSize: '16px',
                fontWeight: '700',
                color: '#29BD98',
                marginBottom: '8px'
              }}>
                Choose Your Expert
              </h4>
              <p style={{
                fontSize: '14px',
                color: 'rgba(255, 255, 255, 0.6)',
                lineHeight: '1.5'
              }}>
                Select the specialist that matches your needs
              </p>
            </div>
            <div>
              <div style={{
                fontSize: '40px',
                marginBottom: '12px'
              }}>
                💬
              </div>
              <h4 style={{
                fontSize: '16px',
                fontWeight: '700',
                color: '#2497F9',
                marginBottom: '8px'
              }}>
                Start Chatting
              </h4>
              <p style={{
                fontSize: '14px',
                color: 'rgba(255, 255, 255, 0.6)',
                lineHeight: '1.5'
              }}>
                Share code, links, files, and discuss your project
              </p>
            </div>
            <div>
              <div style={{
                fontSize: '40px',
                marginBottom: '12px'
              }}>
                🚀
              </div>
              <h4 style={{
                fontSize: '16px',
                fontWeight: '700',
                color: '#8B5CF6',
                marginBottom: '8px'
              }}>
                Get Expert Guidance
              </h4>
              <p style={{
                fontSize: '14px',
                color: 'rgba(255, 255, 255, 0.6)',
                lineHeight: '1.5'
              }}>
                Receive personalized help from real professionals
              </p>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Expert Auth Modal */}
      <ExpertAuthModal
        isOpen={showLoginModal}
        onClose={() => {
          setShowLoginModal(false);
          setSelectedExpert(null);
        }}
        onSuccess={handleAuthSuccess}
        expertName={selectedExpert?.name || 'our expert'}
      />
    </div>
  );
};

export default ExpertsPage;
