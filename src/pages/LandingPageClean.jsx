import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useAdmin } from '../context/AdminContext';
import { useIsMobile } from '../hooks/useMediaQuery';
import logo from '../assets/logo.png';
import googleIcon from '../assets/google.png';
import { 
  FloatingCode, 
  TerminalDemo, 
  ComparisonTable, 
  FeatureCard, 
  TestimonialCard 
} from '../components/landing/LandingComponents';

const LandingPageClean = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const { signup, login, signInWithGoogle, currentUser, logout } = useAuth();
  const { isAdmin } = useAdmin();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  const howItWorksRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const isHowItWorksInView = useInView(howItWorksRef, { once: true, margin: "-100px" });

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobileMenuOpen && mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  const handleGetStarted = async () => {
    // If logged in, check if they have completed onboarding
    if (currentUser) {
      // Check Firestore for submitted projects
      try {
        const { collection, query, where, getDocs } = await import('firebase/firestore');
        const { db } = await import('../config/firebase');
        
        const q = query(
          collection(db, 'projects'),
          where('userId', '==', currentUser.uid),
          where('status', '!=', 'draft')
        );
        const querySnapshot = await getDocs(q);
        
        // If they have submitted projects, go to dashboard
        // Otherwise continue with onboarding (Solution Hub)
        if (!querySnapshot.empty) {
          navigate('/dashboard');
        } else {
          navigate('/get-started');
        }
      } catch (error) {
        console.error('Error checking projects:', error);
        // Default to Solution Hub on error
        navigate('/get-started');
      }
    } else {
      navigate('/get-started');
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError('');
      await signInWithGoogle();
      setShowAuthModal(false);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      
      if (authMode === 'signup') {
        await signup(email, password, displayName);
      } else {
        await login(email, password);
      }
      
      setShowAuthModal(false);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const scrollToSection = (ref) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
    setIsMobileMenuOpen(false);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#15293A', position: 'relative', overflow: 'hidden' }}>
      
      {/* NAVIGATION */}
      <motion.nav 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          backgroundColor: 'rgba(21, 41, 58, 0.95)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          zIndex: 1000,
          padding: isMobile ? '16px 20px' : '20px 40px'
        }}
      >
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          {/* Logo */}
          <img 
            src={logo} 
            alt="Creovine" 
            onClick={() => navigate('/')}
            style={{
              height: isMobile ? '28px' : '36px',
              width: 'auto',
              cursor: 'pointer'
            }}
          />

          {/* Desktop Navigation */}
          <div style={{ 
            display: isMobile ? 'none' : 'flex', 
            gap: '32px', 
            alignItems: 'center' 
          }}>
            <button onClick={() => scrollToSection(howItWorksRef)} style={{
              background: 'none',
              border: 'none',
              color: 'rgba(255, 255, 255, 0.8)',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'color 0.3s'
            }}>
              How It Works
            </button>
            <button onClick={() => navigate('/faq')} style={{
              background: 'none',
              border: 'none',
              color: 'rgba(255, 255, 255, 0.8)',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'color 0.3s'
            }}>
              FAQ
            </button>
          </div>

          {/* Desktop Auth Buttons */}
          <div style={{ 
            display: isMobile ? 'none' : 'flex', 
            gap: '12px', 
            alignItems: 'center' 
          }}>
            {!currentUser && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAuthModal(true)}
                style={{
                  backgroundColor: 'transparent',
                  color: 'white',
                  padding: '10px 20px',
                  borderRadius: '24px',
                  border: '2px solid rgba(255, 255, 255, 0.2)',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  transition: 'all 0.2s'
                }}
              >
                Login / Sign Up
              </motion.button>
            )}
            {currentUser && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/dashboard')}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  padding: '10px 20px',
                  borderRadius: '24px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600'
                }}
              >
                Dashboard
              </motion.button>
            )}
            {isAdmin && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/admin')}
                style={{
                  backgroundColor: '#10B981',
                  color: 'white',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600'
                }}
              >
                Admin
              </motion.button>
            )}
            {currentUser ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={async () => {
                  await logout();
                  navigate('/');
                }}
                style={{
                  background: 'transparent',
                  color: 'white',
                  padding: '12px 28px',
                  borderRadius: '24px',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '700'
                }}
              >
                Logout
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleGetStarted}
                style={{
                  background: 'linear-gradient(135deg, #29BD98 0%, #2497F9 100%)',
                  color: 'white',
                  padding: '12px 28px',
                  borderRadius: '24px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '700',
                  boxShadow: '0 4px 20px rgba(41, 189, 152, 0.3)'
                }}
              >
                Get Started
              </motion.button>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            style={{
              display: isMobile ? 'block' : 'none',
              background: 'none',
              border: 'none',
              color: '#FFFFFF',
              fontSize: '24px',
              cursor: 'pointer',
              padding: '8px'
            }}
          >
            {isMobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              ref={mobileMenuRef}
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '100%' }}
              transition={{ type: 'tween' }}
              style={{
                position: 'fixed',
                top: isMobile ? '60px' : '76px',
                right: 0,
                bottom: 0,
                width: '280px',
                backgroundColor: '#15293A',
                borderLeft: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '32px 24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '0',
                zIndex: 999
              }}
            >
              <button onClick={() => { scrollToSection(howItWorksRef); setIsMobileMenuOpen(false); }} style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                color: '#FFFFFF',
                fontSize: '16px',
                fontWeight: '500',
                textAlign: 'left',
                cursor: 'pointer',
                padding: '16px 20px',
                marginBottom: '12px',
                width: '100%'
              }}>
                How It Works
              </button>
              <button onClick={() => { navigate('/faq'); setIsMobileMenuOpen(false); }} style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                color: '#FFFFFF',
                fontSize: '16px',
                fontWeight: '500',
                textAlign: 'left',
                cursor: 'pointer',
                padding: '16px 20px',
                marginBottom: '12px',
                width: '100%'
              }}>
                FAQ
              </button>
              {!currentUser && (
                <button
                  onClick={() => {
                    setShowAuthModal(true);
                    setIsMobileMenuOpen(false);
                  }}
                  style={{
                    backgroundColor: 'transparent',
                    color: 'white',
                    padding: '16px 20px',
                    borderRadius: '12px',
                    border: '2px solid rgba(255, 255, 255, 0.2)',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: '600',
                    marginBottom: '12px',
                    width: '100%'
                  }}
                >
                  Login / Sign Up
                </button>
              )}
              {currentUser && (
                <button
                  onClick={() => {
                    navigate('/dashboard');
                    setIsMobileMenuOpen(false);
                  }}
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    padding: '16px 20px',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: '600',
                    marginBottom: '12px',
                    width: '100%'
                  }}
                >
                  Dashboard
                </button>
              )}
              {isAdmin && (
                <button
                  onClick={() => {
                    navigate('/admin');
                    setIsMobileMenuOpen(false);
                  }}
                  style={{
                    backgroundColor: '#10B981',
                    color: 'white',
                    padding: '16px 20px',
                    borderRadius: '12px',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: '600',
                    marginBottom: '12px',
                    width: '100%'
                  }}
                >
                  Admin Dashboard
                </button>
              )}
              {currentUser ? (
                <button
                  onClick={async () => {
                    await logout();
                    setIsMobileMenuOpen(false);
                    navigate('/');
                  }}
                  style={{
                    background: 'transparent',
                    color: 'white',
                    padding: '16px 20px',
                    borderRadius: '24px',
                    border: '2px solid rgba(255, 255, 255, 0.3)',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: '700',
                    marginTop: 'auto',
                    width: '100%'
                  }}
                >
                  Logout
                </button>
              ) : (
                <button
                  onClick={() => {
                    handleGetStarted();
                    setIsMobileMenuOpen(false);
                  }}
                  style={{
                    background: 'linear-gradient(135deg, #29BD98 0%, #2497F9 100%)',
                    color: 'white',
                    padding: '16px 20px',
                    borderRadius: '24px',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: '700',
                    marginTop: 'auto',
                    width: '100%'
                  }}
                >
                  Get Started
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* HERO SECTION */}
      <section style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: isMobile ? '100px 20px 60px' : '120px 40px 80px',
        position: 'relative'
      }}>
        {/* Background Animation */}
        <FloatingCode />
        
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto', 
          textAlign: 'center',
          position: 'relative',
          zIndex: 1
        }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Main Headline */}
            <h1 style={{
              fontSize: isMobile ? '36px' : '72px',
              fontWeight: '900',
              color: '#FFFFFF',
              marginBottom: '24px',
              lineHeight: '1.1',
              background: 'linear-gradient(135deg, #FFFFFF 0%, #29BD98 50%, #2497F9 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Real Code. Vibe Speed.
            </h1>
            
            {/* Subheadline */}
            <p style={{
              fontSize: isMobile ? '18px' : '24px',
              color: 'rgba(255, 255, 255, 0.9)',
              lineHeight: '1.6',
              marginBottom: '16px',
              fontWeight: '600'
            }}>
              We Build Apps and Provide Code Solutions at Insane Speed Using Expert-Led Vibe Coding, plus Real Human Consultation
            </p>
            
            <p style={{
              fontSize: isMobile ? '16px' : '20px',
              color: 'rgba(255, 255, 255, 0.7)',
              lineHeight: '1.6',
              marginBottom: '16px',
              maxWidth: '900px',
              margin: '0 auto 16px'
            }}>
              You Get Full Source Code, GitHub Access, and Complete Ownership. Forever.
            </p>
            
            <p style={{
              fontSize: isMobile ? '14px' : '18px',
              color: 'rgba(255, 255, 255, 0.6)',
              lineHeight: '1.6',
              marginBottom: '48px',
              fontStyle: 'italic'
            }}>
              No templates. No no-code. No vendor lock-in. Just your app, built fast.
            </p>
            
            {/* CTA Buttons */}
            <div style={{
              display: 'flex',
              gap: '16px',
              justifyContent: 'center',
              flexWrap: 'wrap',
              marginBottom: '48px'
            }}>
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => currentUser ? navigate('/dashboard') : handleGetStarted()}
                style={{
                  background: 'linear-gradient(135deg, #29BD98 0%, #2497F9 100%)',
                  color: 'white',
                  padding: isMobile ? '16px 32px' : '20px 48px',
                  borderRadius: '50px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: isMobile ? '16px' : '18px',
                  fontWeight: '700',
                  boxShadow: '0 8px 32px rgba(41, 189, 152, 0.4)',
                  minHeight: '56px'
                }}
              >
                {currentUser ? 'Dashboard' : 'Get Started Now'}
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/experts')}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  padding: isMobile ? '16px 32px' : '20px 48px',
                  borderRadius: '50px',
                  border: '2px solid rgba(255, 255, 255, 0.2)',
                  cursor: 'pointer',
                  fontSize: isMobile ? '16px' : '18px',
                  fontWeight: '700',
                  backdropFilter: 'blur(10px)',
                  minHeight: '56px'
                }}
              >
                Discuss with an Expert
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* PROBLEM SECTION - Comparison Tables */}
      <section style={{
        padding: isMobile ? '60px 20px' : '100px 20px',
        backgroundColor: 'rgba(0, 0, 0, 0.2)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{
              fontSize: isMobile ? '32px' : '48px',
              fontWeight: '800',
              textAlign: 'center',
              color: '#FFFFFF',
              marginBottom: '64px'
            }}
          >
            What Makes Us Different
          </motion.h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
            gap: '32px'
          }}>
            <ComparisonTable
              title="No-Code Platforms"
              subtitle="vs Creovine"
              items={[
                { left: 'Drag & drop only', right: 'Real code you own' },
                { left: 'Monthly fees', right: 'One-time payment' },
                { left: 'Platform lock-in', right: 'Full GitHub access' },
                { left: 'Limited features', right: 'Unlimited scaling' },
                { left: 'Slow support', right: 'Lightning fast' },
                { left: 'Export issues', right: 'Deploy anywhere' }
              ]}
            />
            
            <ComparisonTable
              title="Traditional Devs"
              subtitle="vs Creovine"
              items={[
                { left: 'Months of waiting', right: 'Rapid delivery' },
                { left: '$30k-$100k+', right: '$2k-$6k' },
                { left: 'Endless meetings', right: 'Smart questionnaire' },
                { left: 'Hit or miss', right: 'Proven process' }
              ]}
            />
          </div>

          {/* Co-Pilot Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{
              marginTop: '64px',
              padding: isMobile ? '32px 24px' : '40px 48px',
              backgroundColor: 'rgba(41, 189, 152, 0.1)',
              borderRadius: '24px',
              border: '2px solid rgba(41, 189, 152, 0.3)',
              textAlign: 'center'
            }}
          >
            <p style={{
              fontSize: isMobile ? '18px' : '24px',
              color: '#FFFFFF',
              lineHeight: '1.7',
              margin: 0,
              fontWeight: '600'
            }}>
              <span style={{ color: '#29BD98' }}>Think of us as your co-pilot.</span> We're not just building your app, we're solving every challenge along the way, from naming to deployment. You stay in control. We handle the heavy lifting.
            </p>
          </motion.div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section ref={howItWorksRef} style={{
        padding: isMobile ? '60px 20px' : '100px 20px'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isHowItWorksInView ? { opacity: 1, y: 0 } : {}}
            style={{
              fontSize: isMobile ? '32px' : '48px',
              fontWeight: '800',
              textAlign: 'center',
              color: '#FFFFFF',
              marginBottom: '64px'
            }}
          >
            How It Works
          </motion.h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(4, 1fr)',
            gap: '24px'
          }}>
            {[
              { 
                step: '01', 
                title: 'Define Together', 
                desc: 'Answer questions about your app. Choose what to handle yourself or let us help—naming, features, design, anything'
              },
              { 
                step: '02', 
                title: 'We Build Fast', 
                desc: 'Our expert team codes your production-ready app at lightning speed with clean architecture and best practices'
              },
              { 
                step: '03', 
                title: 'Review & Refine', 
                desc: 'Test your app, request changes, and approve the final version. We iterate until it\'s perfect'
              },
              { 
                step: '04', 
                title: 'Launch & Own', 
                desc: 'Get full GitHub repo, complete source code, documentation, and lifetime ownership. Deploy anywhere'
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={isHowItWorksInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: index * 0.15 }}
                style={{
                  padding: isMobile ? '32px 24px' : '40px 32px',
                  backgroundColor: '#214055',
                  borderRadius: '24px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  textAlign: 'center'
                }}
              >
                <div style={{
                  fontSize: isMobile ? '40px' : '48px',
                  fontWeight: '900',
                  background: 'linear-gradient(135deg, #29BD98 0%, #2497F9 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  marginBottom: '16px'
                }}>
                  {item.step}
                </div>
                <h3 style={{
                  fontSize: isMobile ? '20px' : '24px',
                  fontWeight: '700',
                  color: '#FFFFFF',
                  marginBottom: '12px'
                }}>
                  {item.title}
                </h3>
                <p style={{
                  fontSize: isMobile ? '14px' : '16px',
                  color: 'rgba(255, 255, 255, 0.7)',
                  lineHeight: '1.6'
                }}>
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT YOU GET SECTION */}
      <section style={{
        padding: isMobile ? '60px 20px' : '100px 20px',
        backgroundColor: 'rgba(0, 0, 0, 0.2)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{
              fontSize: isMobile ? '32px' : '48px',
              fontWeight: '800',
              textAlign: 'center',
              color: '#FFFFFF',
              marginBottom: '64px'
            }}
          >
            What You Get
          </motion.h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
            gap: '24px'
          }}>
            {[
              { title: 'Full Source Code', desc: 'Clean, documented, production-ready' },
              { title: 'GitHub Repository', desc: 'Private repo with full access' },
              { title: 'Documentation', desc: 'Complete setup and API docs' },
              { title: 'Deployment', desc: 'CI/CD pipeline included' },
              { title: '2 Weeks Support', desc: 'Bug fixes and adjustments' },
              { title: 'Custom Design', desc: 'Tailored to your brand' },
              { title: 'Security', desc: 'Best practices built-in' },
              { title: 'Unlimited Edits', desc: 'Modify forever, no limits' }
            ].map((feature, index) => (
              <FeatureCard
                key={index}
                icon=""
                title={feature.title}
                description={feature.desc}
              />
            ))}
          </div>
        </div>
      </section>

      {/* VIBE CODING EXPLAINED SECTION */}
      <section style={{
        padding: isMobile ? '60px 20px' : '100px 20px',
        backgroundColor: 'rgba(0, 0, 0, 0.2)'
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{
              padding: isMobile ? '40px 24px' : '60px 48px',
              background: 'linear-gradient(135deg, rgba(41, 189, 152, 0.1) 0%, rgba(36, 151, 249, 0.1) 100%)',
              borderRadius: '24px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              textAlign: 'center'
            }}
          >
            <h2 style={{
              fontSize: isMobile ? '28px' : '40px',
              fontWeight: '800',
              color: '#FFFFFF',
              marginBottom: '24px'
            }}>
              What is Vibe Coding?
            </h2>
            
            <p style={{
              fontSize: isMobile ? '16px' : '20px',
              color: 'rgba(255, 255, 255, 0.9)',
              lineHeight: '1.8',
              marginBottom: '24px'
            }}>
              Vibe Coding isn't lazy coding. It's the future of development.
            </p>
            
            <div style={{
              textAlign: 'left',
              maxWidth: '700px',
              margin: '0 auto',
              padding: isMobile ? '24px' : '32px',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '16px',
              marginBottom: '24px'
            }}>
              <p style={{
                fontSize: isMobile ? '14px' : '16px',
                color: 'rgba(255, 255, 255, 0.8)',
                lineHeight: '1.8',
                marginBottom: '16px'
              }}>
                <strong style={{ color: '#29BD98' }}>Traditional coding:</strong> 1 developer writes every line manually.
              </p>
              <p style={{
                fontSize: isMobile ? '14px' : '16px',
                color: 'rgba(255, 255, 255, 0.8)',
                lineHeight: '1.8'
              }}>
                <strong style={{ color: '#2497F9' }}>Vibe coding:</strong> 1 expert orchestrates AI tools to build 10x faster while maintaining quality and ownership.
              </p>
            </div>
            
            <p style={{
              fontSize: isMobile ? '16px' : '18px',
              color: 'rgba(255, 255, 255, 0.8)',
              lineHeight: '1.8',
              fontStyle: 'italic'
            }}>
              The result? Production-ready apps at lightning speed. Think of it as having a development team of 10 that never sleeps.
            </p>
          </motion.div>
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section style={{
        padding: isMobile ? '60px 20px' : '100px 20px',
        backgroundColor: 'rgba(0, 0, 0, 0.2)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{
              fontSize: isMobile ? '32px' : '48px',
              fontWeight: '800',
              textAlign: 'center',
              color: '#FFFFFF',
              marginBottom: '64px'
            }}
          >
            What Our Clients Say
          </motion.h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
            gap: '32px'
          }}>
            <TestimonialCard
              quote="I thought there was no way they could build my marketplace app in 4 days. I was wrong. The code is clean, documented, and mine."
              name="Sarah K."
              role="Founder of LocalMarket"
              rating={5}
            />
            <TestimonialCard
              quote="After getting quoted $50k and 6 months by an agency, Creovine delivered in 5 days for $3,500. Game changer."
              name="Marcus T."
              role="SaaS Founder"
              rating={5}
            />
            <TestimonialCard
              quote="The GitHub repo they provided is incredibly well-structured. Our team was able to add features immediately without any issues."
              name="Jessica L."
              role="CTO, FinTech Startup"
              rating={5}
            />
          </div>
        </div>
      </section>

      {/* FINAL CTA SECTION */}
      <section style={{
        padding: isMobile ? '80px 20px' : '120px 20px',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        textAlign: 'center'
      }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ maxWidth: '800px', margin: '0 auto' }}
        >
          <h2 style={{
            fontSize: isMobile ? '36px' : '56px',
            fontWeight: '900',
            color: '#FFFFFF',
            marginBottom: '24px',
            lineHeight: '1.2'
          }}>
            Ready to Own Your Code?
          </h2>
          
          <p style={{
            fontSize: isMobile ? '18px' : '24px',
            color: 'rgba(255, 255, 255, 0.8)',
            marginBottom: '48px',
            fontWeight: '500'
          }}>
            Stop paying monthly. Start building fast.
          </p>
          
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleGetStarted}
            style={{
              background: 'linear-gradient(135deg, #29BD98 0%, #2497F9 100%)',
              color: 'white',
              padding: isMobile ? '20px 48px' : '24px 64px',
              borderRadius: '50px',
              border: 'none',
              cursor: 'pointer',
              fontSize: isMobile ? '18px' : '22px',
              fontWeight: '700',
              boxShadow: '0 12px 48px rgba(41, 189, 152, 0.5)',
              minHeight: '64px'
            }}
          >
            Start Your Project Now
          </motion.button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer style={{
        padding: isMobile ? '40px 20px' : '60px 40px',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          textAlign: 'center'
        }}>
          <p style={{
            fontSize: '14px',
            color: 'rgba(255, 255, 255, 0.5)',
            marginBottom: '8px'
          }}>
            © 2025 Creovine. All rights reserved.
          </p>
          <p style={{
            fontSize: '12px',
            color: 'rgba(255, 255, 255, 0.4)'
          }}>
            Real Code. Real Speed. Real Ownership.
          </p>
        </div>
      </footer>

      {/* AUTH MODAL */}
      <AnimatePresence>
        {showAuthModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowAuthModal(false)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              backdropFilter: 'blur(4px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 2000,
              padding: '20px'
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                backgroundColor: '#214055',
                borderRadius: '24px',
                padding: isMobile ? '32px 24px' : '48px',
                maxWidth: '480px',
                width: '100%',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)'
              }}
            >
              <h2 style={{
                fontSize: isMobile ? '24px' : '28px',
                fontWeight: '800',
                color: '#FFFFFF',
                marginBottom: '8px',
                textAlign: 'center'
              }}>
                {authMode === 'signup' ? 'Create Your Account' : 'Welcome Back'}
              </h2>
              <p style={{
                fontSize: '14px',
                color: 'rgba(255, 255, 255, 0.6)',
                marginBottom: '32px',
                textAlign: 'center'
              }}>
                {authMode === 'signup' ? 'Start building your app today' : 'Continue your project'}
              </p>

              {error && (
                <div style={{
                  padding: '12px 16px',
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: '12px',
                  marginBottom: '24px'
                }}>
                  <p style={{ fontSize: '14px', color: '#EF4444' }}>{error}</p>
                </div>
              )}

              <button
                onClick={handleGoogleSignIn}
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '16px',
                  backgroundColor: '#FFFFFF',
                  color: '#15293A',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  marginBottom: '24px',
                  opacity: loading ? 0.6 : 1
                }}
              >
                <img src={googleIcon} alt="Google" style={{ width: '20px', height: '20px' }} />
                Continue with Google
              </button>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                marginBottom: '24px'
              }}>
                <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.2)' }} />
                <span style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.5)' }}>or</span>
                <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.2)' }} />
              </div>

              <form onSubmit={handleEmailAuth} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {authMode === 'signup' && (
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    required
                    style={{
                      padding: '14px 16px',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '12px',
                      color: '#FFFFFF',
                      fontSize: '16px'
                    }}
                  />
                )}
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{
                    padding: '14px 16px',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '12px',
                    color: '#FFFFFF',
                    fontSize: '16px'
                  }}
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{
                    padding: '14px 16px',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '12px',
                    color: '#FFFFFF',
                    fontSize: '16px'
                  }}
                />
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    padding: '16px',
                    background: 'linear-gradient(135deg, #29BD98 0%, #2497F9 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    fontSize: '16px',
                    fontWeight: '700',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    marginTop: '8px',
                    opacity: loading ? 0.6 : 1
                  }}
                >
                  {loading ? 'Processing...' : (authMode === 'signup' ? 'Create Account' : 'Sign In')}
                </button>
              </form>

              <p style={{
                marginTop: '24px',
                textAlign: 'center',
                fontSize: '14px',
                color: 'rgba(255, 255, 255, 0.6)'
              }}>
                {authMode === 'signup' ? 'Already have an account?' : "Don't have an account?"}
                {' '}
                <button
                  onClick={() => {
                    setAuthMode(authMode === 'signup' ? 'login' : 'signup');
                    setError('');
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#29BD98',
                    cursor: 'pointer',
                    textDecoration: 'underline',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}
                >
                  {authMode === 'signup' ? 'Sign In' : 'Create Account'}
                </button>
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LandingPageClean;
