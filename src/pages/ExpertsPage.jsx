import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle, FaCode, FaMobile, FaPalette, FaServer, FaRocket, FaChartLine, FaLifeRing } from 'react-icons/fa';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { useAuth } from '../context/AuthContext';
import { useProject } from '../context/ProjectContext';
import ExpertAuthModal from '../components/auth/ExpertAuthModal';
import ExpertLockModal from '../components/experts/ExpertLockModal';
import ExpertCard from '../components/experts/ExpertCard';
import { 
  checkExpertAccess, 
  sortExpertsWithSupportFirst,
  EXPERT_CATEGORIES,
  ACCESS_LEVELS 
} from '../utils/expertAccess';
import logo from '../assets/logo.png';

const ExpertsPage = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { projectData } = useProject();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showLockModal, setShowLockModal] = useState(false);
  const [selectedExpert, setSelectedExpert] = useState(null);
  const [userProjects, setUserProjects] = useState(null);

  // Load user projects data (simulated - you'll connect to Firestore)
  useEffect(() => {
    if (currentUser && projectData) {
      // Build user projects object from context
      const hasSubmittedProject = projectData?.phases?.primaryService ? true : false;
      const services = [];
      
      if (projectData?.phases?.primaryService) {
        services.push(projectData.phases.primaryService);
      }
      if (projectData?.phases?.addOns) {
        services.push(...projectData.phases.addOns);
      }

      setUserProjects({
        hasSubmittedProject,
        projects: hasSubmittedProject ? [{
          services,
          isNew: true
        }] : [],
        hasApprovedProject: false,
        isPremium: false
      });
    } else {
      setUserProjects(null);
    }
  }, [currentUser, projectData]);

  const handleExpertClick = (expert) => {
    // Check access
    const accessCheck = checkExpertAccess(expert, currentUser, userProjects);
    
    if (!accessCheck.canAccess) {
      // Handle login requirement
      if (accessCheck.reason === 'login-required') {
        setSelectedExpert(expert);
        setShowLoginModal(true);
        return;
      }
      
      // Show lock modal for other restrictions
      setSelectedExpert(expert);
      setShowLockModal(true);
      return;
    }

    // Access granted - navigate to chat
    navigate(`/chat/${expert.id}`);
  };

  const handleLockModalAction = (action) => {
    if (action === 'login') {
      setShowLockModal(false);
      setShowLoginModal(true);
    }
  };

  const handleAuthSuccess = () => {
    setShowLoginModal(false);
    if (selectedExpert) {
      navigate(`/chat/${selectedExpert.id}`);
    }
  };

  const experts = [
    {
      id: 'support-expert',
      name: 'General Support',
      specialty: 'Platform Support & Guidance',
      expertise: 'FAQs, Pricing, Getting Started, Project Help',
      icon: FaLifeRing,
      color: '#29BD98',
      category: EXPERT_CATEGORIES.SUPPORT,
      accessLevel: ACCESS_LEVELS.PUBLIC,
      description: 'Start here! Get help with anything - pricing, platform questions, or project guidance.',
      isPriority: true
    },
    {
      id: 'frontend-specialist',
      name: 'Sarah',
      specialty: 'Frontend Engineering',
      expertise: 'React, Vue, Next.js, UI/UX',
      icon: FaCode,
      color: '#2497F9',
      category: EXPERT_CATEGORIES.FRONTEND,
      accessLevel: ACCESS_LEVELS.PROJECT_SUBMITTED,
      description: 'Expert in building responsive, performant frontend applications'
    },
    {
      id: 'backend-architect',
      name: 'Michael',
      specialty: 'Backend Architecture',
      expertise: 'Node.js, Python, APIs, Databases',
      icon: FaServer,
      color: '#8B5CF6',
      category: EXPERT_CATEGORIES.BACKEND,
      accessLevel: ACCESS_LEVELS.PROJECT_SUBMITTED,
      description: 'Specialized in scalable backend systems and API design'
    },
    {
      id: 'mobile-developer',
      name: 'Aisha',
      specialty: 'Mobile App Development',
      expertise: 'React Native, Flutter, iOS, Android',
      icon: FaMobile,
      color: '#F59E0B',
      category: EXPERT_CATEGORIES.MOBILE,
      accessLevel: ACCESS_LEVELS.PROJECT_SUBMITTED,
      description: 'Cross-platform mobile app development expert'
    },
    {
      id: 'ui-ux-designer',
      name: 'James',
      specialty: 'UI/UX Design',
      expertise: 'Figma, Design Systems, User Research',
      icon: FaPalette,
      color: '#EF4444',
      category: EXPERT_CATEGORIES.DESIGN,
      accessLevel: ACCESS_LEVELS.PROJECT_SUBMITTED,
      description: 'Creating beautiful, user-centered design experiences'
    },
    {
      id: 'product-strategist',
      name: 'Emily',
      specialty: 'Product Strategy',
      expertise: 'MVP Planning, Market Research, Growth',
      icon: FaRocket,
      color: '#10B981',
      category: EXPERT_CATEGORIES.PRODUCT,
      accessLevel: ACCESS_LEVELS.PROJECT_APPROVED,
      description: 'Helping turn ideas into successful products'
    },
    {
      id: 'marketing-specialist',
      name: 'David',
      specialty: 'Growth Marketing',
      expertise: 'SEO, Content, Analytics, Conversion',
      icon: FaChartLine,
      color: '#6366F1',
      category: EXPERT_CATEGORIES.MARKETING,
      accessLevel: ACCESS_LEVELS.PROJECT_APPROVED,
      description: 'Driving user acquisition and product growth'
    }
  ];

  // Sort experts with support first
  const sortedExperts = sortExpertsWithSupportFirst(experts);

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

        {/* Support Callout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{
            backgroundColor: 'rgba(41, 189, 152, 0.1)',
            border: '2px solid rgba(41, 189, 152, 0.3)',
            borderRadius: '16px',
            padding: isMobile ? '20px' : '24px',
            marginBottom: '32px',
            textAlign: 'center'
          }}
        >
          <p style={{
            fontSize: isMobile ? '14px' : '16px',
            color: '#29BD98',
            fontWeight: '600',
            margin: 0,
            lineHeight: '1.6'
          }}>
            ⭐ New here? <strong>Start with General Support!</strong> They'll guide you through the platform and help unlock specialized experts.
          </p>
        </motion.div>

        {/* Experts Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: isMobile ? '20px' : '32px',
          marginBottom: isMobile ? '40px' : '60px'
        }}>
          {sortedExperts.map((expert, index) => {
            const accessCheck = checkExpertAccess(expert, currentUser, userProjects);
            const isSupport = expert.category === EXPERT_CATEGORIES.SUPPORT;
            
            return (
              <motion.div
                key={expert.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                style={{
                  position: 'relative'
                }}
              >
                {/* Priority Badge for Support */}
                {isSupport && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', delay: 0.5 }}
                    style={{
                      position: 'absolute',
                      top: '-10px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      padding: '6px 16px',
                      background: 'linear-gradient(135deg, #29BD98, #1E9F7F)',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '700',
                      color: '#FFFFFF',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      boxShadow: '0 4px 12px rgba(41, 189, 152, 0.5)',
                      zIndex: 10,
                      border: '2px solid #15293A'
                    }}
                  >
                    ⭐ START HERE
                  </motion.div>
                )}

                <ExpertCard
                  expert={expert}
                  canAccess={accessCheck.canAccess}
                  isNewlyUnlocked={accessCheck.isNewlyUnlocked}
                  onClick={() => handleExpertClick(expert)}
                  isMobile={isMobile}
                />
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

      {/* Expert Lock Modal */}
      <ExpertLockModal
        isOpen={showLockModal}
        onClose={() => {
          setShowLockModal(false);
          setSelectedExpert(null);
        }}
        expertName={selectedExpert?.name || 'this expert'}
        expertColor={selectedExpert?.color || '#29BD98'}
        unlockPath={checkExpertAccess(selectedExpert, currentUser, userProjects).unlockPath}
        onAction={handleLockModalAction}
      />
    </div>
  );
};

export default ExpertsPage;
