import { useState, useRef } from 'react';
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

const LandingPageNew = () => {
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
  
  // Refs for scroll navigation
  const heroRef = useRef(null);
  const howItWorksRef = useRef(null);
  
  // Animation triggers
  const isHowItWorksInView = useInView(howItWorksRef, { once: true, margin: "-100px" });

  const handleGetStarted = () => {
    if (currentUser) {
      navigate('/onboarding');
    } else {
      setShowAuthModal(true);
      setAuthMode('signup');
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError('');
      await signInWithGoogle();
      navigate('/onboarding');
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
      
      navigate('/onboarding');
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
          padding: '16px 0'
        }}
      >
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <img 
            src={logo} 
            alt="Creovine" 
            style={{
              height: '28px',
              width: 'auto',
              objectFit: 'contain',
              cursor: 'pointer'
            }}
            onClick={() => scrollToSection(heroRef)}
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
                Admin Dashboard
              </motion.button>
            )}
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
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              style={{
                position: 'fixed',
                top: '60px',
                right: 0,
                bottom: 0,
                width: '70%',
                maxWidth: '300px',
                backgroundColor: 'rgba(21, 41, 58, 0.98)',
                backdropFilter: 'blur(10px)',
                borderLeft: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '32px 24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '24px',
                zIndex: 999
              }}
            >
              <button onClick={() => scrollToSection(howItWorksRef)} style={{
                background: 'none',
                border: 'none',
                color: '#FFFFFF',
                fontSize: '16px',
                fontWeight: '500',
                textAlign: 'left',
                cursor: 'pointer',
                padding: '12px 0'
              }}>
                How It Works
              </button>
              <button onClick={() => { navigate('/faq'); setIsMobileMenuOpen(false); }} style={{
                background: 'none',
                border: 'none',
                color: '#FFFFFF',
                fontSize: '16px',
                fontWeight: '500',
                textAlign: 'left',
                cursor: 'pointer',
                padding: '12px 0'
              }}>
                FAQ
              </button>
              {isAdmin && (
                <button
                  onClick={() => {
                    navigate('/admin');
                    setIsMobileMenuOpen(false);
                  }}
                  style={{
                    backgroundColor: '#10B981',
                    color: 'white',
                    padding: '12px 20px',
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600',
                    marginTop: '16px'
                  }}
                >
                  Admin Dashboard
                </button>
              )}
              <button
                onClick={() => {
                  handleGetStarted();
                  setIsMobileMenuOpen(false);
                }}
                style={{
                  background: 'linear-gradient(135deg, #29BD98 0%, #2497F9 100%)',
                  color: 'white',
                  padding: '14px 24px',
                  borderRadius: '24px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: '700',
                  marginTop: 'auto'
                }}
              >
                Get Started
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* HERO SECTION */}
      <section ref={heroRef} style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        padding: '100px 20px 60px 20px',
        overflow: 'hidden'
      }}>
        <FloatingCode />
        
        <div style={{ 
          maxWidth: '1000px', 
          textAlign: 'center', 
          position: 'relative', 
          zIndex: 1 
        }}>
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 style={{
              fontSize: isMobile ? '36px' : '72px',
              fontWeight: '900',
              background: 'linear-gradient(135deg, #29BD98 0%, #2497F9 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '24px',
              lineHeight: '1.1'
            }}>
              Real Code. Vibe Speed.
            </h1>
            
            <p style={{
              fontSize: isMobile ? '18px' : '24px',
              color: 'rgba(255, 255, 255, 0.9)',
              lineHeight: '1.6',
              marginBottom: '16px',
              fontWeight: '500'
            }}>
              We Build Apps in 3-5 Days Using AI-Enhanced Development.
            </p>
            
            <p style={{
              fontSize: isMobile ? '16px' : '20px',
              color: 'rgba(255, 255, 255, 0.7)',
              lineHeight: '1.6',
              marginBottom: '32px'
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
                onClick={handleGetStarted}
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
                Build Your App in 5 Days â†’
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => scrollToSection(howItWorksRef)}
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
                See How We Do It â†“
              </motion.button>
            </div>
            
            {/* Feature Bullets */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
              gap: '16px',
              maxWidth: '800px',
              margin: '0 auto',
              fontSize: isMobile ? '13px' : '14px',
              color: 'rgba(255, 255, 255, 0.8)'
            }}>
              {[
                'âœ“ Starting at $1,999',
                'âœ“ GitHub included',
                'âœ“ Deploy anywhere',
                'âœ“ Full source code',
                'âœ“ No vendor lock-in',
                'âœ“ Own everything forever'
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '12px',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}
                >
                  {feature}
                </motion.div>
              ))}
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
              marginBottom: '16px'
            }}
          >
            Why Creovine?
          </motion.h2>
          
          <p style={{
            fontSize: isMobile ? '16px' : '18px',
            textAlign: 'center',
            color: 'rgba(255, 255, 255, 0.7)',
            marginBottom: '64px',
            maxWidth: '600px',
            margin: '0 auto 64px auto'
          }}>
            No-code is limiting. Traditional agencies are slow and expensive. We're different.
          </p>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
            gap: '32px',
            marginBottom: '32px'
          }}>
            <ComparisonTable
              title="No-Code Platforms vs Creovine"
              leftColumn="No-Code Platforms"
              rightColumn="Creovine"
              data={[
                { left: 'âŒ Drag & drop only', right: 'âœ… Real code you own' },
                { left: 'âŒ Monthly fees forever', right: 'âœ… One-time payment' },
                { left: 'âŒ Platform lock-in', right: 'âœ… Full GitHub access' },
                { left: 'âŒ Limited features', right: 'âœ… Unlimited scaling' },
                { left: 'âŒ Slow support', right: 'âœ… Built in days' },
                { left: 'âŒ Export issues', right: 'âœ… Deploy anywhere' }
              ]}
            />
            
            <ComparisonTable
              title="Traditional Devs vs Creovine"
              leftColumn="Traditional Devs"
              rightColumn="Creovine"
              data={[
                { left: 'â° 3-6 months', right: 'âš¡ 3-5 days' },
                { left: 'ðŸ’° $30k-$100k+', right: 'ðŸ’° $2k-$6k' },
                { left: 'ðŸ“ Endless meetings', right: 'ðŸ“ Smart questionnaire' },
                { left: 'ðŸ¤· Hit or miss', right: 'âœ… Proven process' }
              ]}
            />
          </div>
        </div>
      </section>

      {/* TERMINAL DEMO SECTION */}
      <section style={{
        padding: isMobile ? '60px 20px' : '100px 20px'
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{
              fontSize: isMobile ? '32px' : '48px',
              fontWeight: '800',
              textAlign: 'center',
              color: '#FFFFFF',
              marginBottom: '16px'
            }}
          >
            Watch It Being Built
          </motion.h2>
          
          <p style={{
            fontSize: isMobile ? '16px' : '18px',
            textAlign: 'center',
            color: 'rgba(255, 255, 255, 0.7)',
            marginBottom: '48px'
          }}>
            See how we build production-ready apps in real-time
          </p>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <TerminalDemo />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            style={{
              marginTop: '32px',
              display: 'flex',
              gap: '16px',
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}
          >
            <button style={{
              background: 'rgba(88, 166, 255, 0.1)',
              border: '1px solid rgba(88, 166, 255, 0.3)',
              borderRadius: '8px',
              padding: '12px 24px',
              color: '#58A6FF',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer'
            }}>
              View GitHub Repo â†’
            </button>
            <button style={{
              background: 'rgba(41, 189, 152, 0.1)',
              border: '1px solid rgba(41, 189, 152, 0.3)',
              borderRadius: '8px',
              padding: '12px 24px',
              color: '#29BD98',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer'
            }}>
              Launch Demo â†’
            </button>
          </motion.div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section ref={howItWorksRef} style={{
        padding: isMobile ? '60px 20px' : '100px 20px',
        backgroundColor: 'rgba(0, 0, 0, 0.2)'
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
              marginBottom: '16px'
            }}
          >
            How It Works
          </motion.h2>
          
          <p style={{
            fontSize: isMobile ? '16px' : '18px',
            textAlign: 'center',
            color: 'rgba(255, 255, 255, 0.7)',
            marginBottom: '64px',
            maxWidth: '600px',
            margin: '0 auto 64px auto'
          }}>
            Four simple steps from idea to deployed app
          </p>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(4, 1fr)',
            gap: '32px'
          }}>
            {[
              { 
                step: '01', 
                title: 'You Describe', 
                desc: 'Fill our smart questionnaire with your app idea, features, and preferences',
                icon: ''
              },
              { 
                step: '02', 
                title: 'We Build', 
                desc: 'AI + expert developers code your production-ready app at 10x speed',
                icon: ''
              },
              { 
                step: '03', 
                title: 'You Review', 
                desc: 'Test your app, request changes, and approve the final version',
                icon: ''
              },
              { 
                step: '04', 
                title: 'You Own', 
                desc: 'Get full GitHub repo, documentation, and complete ownership forever',
                icon: ''
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={isHowItWorksInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: index * 0.2 }}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  borderRadius: '20px',
                  padding: '32px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  position: 'relative',
                  textAlign: 'center'
                }}
              >
                <div style={{
                  fontSize: '48px',
                  marginBottom: '16px'
                }}>
                  {item.icon}
                </div>
                <div style={{
                  fontSize: '14px',
                  fontWeight: '700',
                  color: '#29BD98',
                  marginBottom: '12px',
                  letterSpacing: '2px'
                }}>
                  STEP {item.step}
                </div>
                <h3 style={{
                  fontSize: '20px',
                  fontWeight: '700',
                  color: '#FFFFFF',
                  marginBottom: '12px'
                }}>
                  {item.title}
                </h3>
                <p style={{
                  fontSize: '14px',
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
        padding: isMobile ? '60px 20px' : '100px 20px'
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
              marginBottom: '16px'
            }}
          >
            What You Get
          </motion.h2>
          
          <p style={{
            fontSize: isMobile ? '16px' : '18px',
            textAlign: 'center',
            color: 'rgba(255, 255, 255, 0.7)',
            marginBottom: '64px',
            maxWidth: '600px',
            margin: '0 auto 64px auto'
          }}>
            Everything you need to own, deploy, and scale your app
          </p>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
            gap: '24px'
          }}>
            {[
              { icon: '', title: 'Full Source Code', desc: 'Clean, documented, production-ready' },
              { icon: '', title: 'GitHub Repository', desc: 'Private repo with full access' },
              { icon: '', title: 'Documentation', desc: 'Complete setup and API docs' },
              { icon: '', title: 'Deployment', desc: 'CI/CD pipeline included' },
              { icon: '', title: '2 Weeks Support', desc: 'Bug fixes and adjustments' },
              { icon: '', title: 'Custom Design', desc: 'Tailored to your brand' },
              { icon: '', title: 'Security', desc: 'Best practices built-in' },
              { icon: '', title: 'Unlimited Edits', desc: 'Modify forever, no limits' }
            ].map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
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
            style={{ textAlign: 'center' }}
          >
            <h2 style={{
              fontSize: isMobile ? '28px' : '42px',
              fontWeight: '800',
              color: '#FFFFFF',
              marginBottom: '24px',
              lineHeight: '1.2'
            }}>
              Vibe Coding Isn't Lazy Coding.<br />
              It's the Future of Development.
            </h2>
            
            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              borderRadius: '20px',
              padding: isMobile ? '32px 24px' : '48px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              marginBottom: '48px'
            }}>
              <div style={{ 
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
                gap: '32px',
                marginBottom: '32px'
              }}>
                <div style={{ textAlign: 'left' }}>
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: '700',
                    color: '#FF6B6B',
                    marginBottom: '12px'
                  }}>
                    Traditional Coding
                  </h3>
                  <p style={{
                    fontSize: '15px',
                    color: 'rgba(255, 255, 255, 0.7)',
                    lineHeight: '1.6'
                  }}>
                    1 developer writes every single line manually. Slow, expensive, and limited by human speed.
                  </p>
                </div>
                
                <div style={{ textAlign: 'left' }}>
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: '700',
                    color: '#29BD98',
                    marginBottom: '12px'
                  }}>
                    Vibe Coding
                  </h3>
                  <p style={{
                    fontSize: '15px',
                    color: 'rgba(255, 255, 255, 0.9)',
                    lineHeight: '1.6'
                  }}>
                    1 expert orchestrates AI tools to build 10x faster while maintaining quality and ownership.
                  </p>
                </div>
              </div>
              
              <div style={{
                backgroundColor: 'rgba(41, 189, 152, 0.1)',
                borderRadius: '12px',
                padding: '24px',
                border: '1px solid rgba(41, 189, 152, 0.2)'
              }}>
                <p style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#29BD98',
                  marginBottom: '12px'
                }}>
                  The Result?
                </p>
                <p style={{
                  fontSize: '15px',
                  color: 'rgba(255, 255, 255, 0.9)',
                  lineHeight: '1.6'
                }}>
                  Production-ready apps in days instead of months. Think of it as having a development team of 10 that never sleeps.
                </p>
              </div>
            </div>
            
            {/* Timeline Comparison */}
            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              borderRadius: '16px',
              padding: isMobile ? '24px' : '32px',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <h4 style={{
                fontSize: '18px',
                fontWeight: '700',
                color: '#FFFFFF',
                marginBottom: '24px'
              }}>
                Speed Comparison
              </h4>
              
              <div style={{ marginBottom: '24px' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '8px',
                  fontSize: '14px',
                  color: 'rgba(255, 255, 255, 0.7)'
                }}>
                  <span>Traditional Dev</span>
                  <span>120 days</span>
                </div>
                <div style={{
                  width: '100%',
                  height: '24px',
                  backgroundColor: 'rgba(255, 107, 107, 0.2)',
                  borderRadius: '12px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(90deg, #FF6B6B 0%, #FF8E8E 100%)'
                  }} />
                </div>
              </div>
              
              <div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '8px',
                  fontSize: '14px',
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontWeight: '600'
                }}>
                  <span>Creovine</span>
                  <span>5 days</span>
                </div>
                <div style={{
                  width: '100%',
                  height: '24px',
                  backgroundColor: 'rgba(41, 189, 152, 0.2)',
                  borderRadius: '12px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: '4.17%',
                    height: '100%',
                    background: 'linear-gradient(90deg, #29BD98 0%, #2497F9 100%)'
                  }} />
                </div>
              </div>
            </div>
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
            Build Your App in 5 Days â†’
          </motion.button>
          
          <p style={{
            marginTop: '24px',
            fontSize: '14px',
            color: 'rgba(255, 255, 255, 0.6)'
          }}>
            No credit card required to start
          </p>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer style={{
        padding: isMobile ? '40px 20px' : '60px 20px',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
          gap: '32px',
          textAlign: isMobile ? 'center' : 'left'
        }}>
          <div>
            <img 
              src={logo} 
              alt="Creovine" 
              style={{
                height: '32px',
                width: 'auto',
                objectFit: 'contain',
                marginBottom: '16px'
              }}
            />
            <p style={{
              fontSize: '14px',
              color: 'rgba(255, 255, 255, 0.6)',
              lineHeight: '1.6'
            }}>
              Real code. Vibe speed. Full ownership.
            </p>
          </div>
          
          <div>
            <h4 style={{
              fontSize: '16px',
              fontWeight: '700',
              color: '#FFFFFF',
              marginBottom: '16px'
            }}>
              Quick Links
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button onClick={() => scrollToSection(howItWorksRef)} style={{
                background: 'none',
                border: 'none',
                color: 'rgba(255, 255, 255, 0.6)',
                fontSize: '14px',
                cursor: 'pointer',
                textAlign: isMobile ? 'center' : 'left'
              }}>
                How It Works
              </button>
              <button onClick={() => scrollToSection(pricingRef)} style={{
                background: 'none',
                border: 'none',
                color: 'rgba(255, 255, 255, 0.6)',
                fontSize: '14px',
                cursor: 'pointer',
                textAlign: isMobile ? 'center' : 'left'
              }}>
                Pricing
              </button>
              <button onClick={() => scrollToSection(faqRef)} style={{
                background: 'none',
                border: 'none',
                color: 'rgba(255, 255, 255, 0.6)',
                fontSize: '14px',
                cursor: 'pointer',
                textAlign: isMobile ? 'center' : 'left'
              }}>
                FAQ
              </button>
            </div>
          </div>
          
          <div>
            <h4 style={{
              fontSize: '16px',
              fontWeight: '700',
              color: '#FFFFFF',
              marginBottom: '16px'
            }}>
              Legal
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <a href="#" style={{
                color: 'rgba(255, 255, 255, 0.6)',
                fontSize: '14px',
                textDecoration: 'none'
              }}>
                Terms of Service
              </a>
              <a href="#" style={{
                color: 'rgba(255, 255, 255, 0.6)',
                fontSize: '14px',
                textDecoration: 'none'
              }}>
                Privacy Policy
              </a>
              <a href="#" style={{
                color: 'rgba(255, 255, 255, 0.6)',
                fontSize: '14px',
                textDecoration: 'none'
              }}>
                Contact Us
              </a>
            </div>
          </div>
        </div>
        
        <div style={{
          marginTop: '48px',
          paddingTop: '32px',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          textAlign: 'center',
          fontSize: '14px',
          color: 'rgba(255, 255, 255, 0.5)'
        }}>
          Â© 2025 Creovine. All rights reserved.
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
              backdropFilter: 'blur(10px)',
              zIndex: 2000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px'
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                backgroundColor: '#1a2a3a',
                borderRadius: '24px',
                padding: isMobile ? '32px 24px' : '48px 40px',
                maxWidth: '450px',
                width: '100%',
                maxHeight: '90vh',
                overflowY: 'auto',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                position: 'relative'
              }}
            >
              <button
                onClick={() => setShowAuthModal(false)}
                style={{
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  background: 'none',
                  border: 'none',
                  color: 'rgba(255, 255, 255, 0.6)',
                  fontSize: '24px',
                  cursor: 'pointer',
                  padding: '8px'
                }}
              >
                âœ•
              </button>
              
              <h3 style={{
                fontSize: '28px',
                fontWeight: '700',
                color: '#FFFFFF',
                marginBottom: '8px',
                textAlign: 'center'
              }}>
                {authMode === 'signup' ? 'Get Started' : 'Welcome Back'}
              </h3>
              
              <p style={{
                fontSize: '14px',
                color: 'rgba(255, 255, 255, 0.6)',
                marginBottom: '32px',
                textAlign: 'center'
              }}>
                {authMode === 'signup' 
                  ? 'Create your account to start building' 
                  : 'Sign in to continue your project'}
              </p>
              
              {error && (
                <div style={{
                  backgroundColor: 'rgba(255, 107, 107, 0.1)',
                  border: '1px solid rgba(255, 107, 107, 0.3)',
                  borderRadius: '12px',
                  padding: '12px 16px',
                  marginBottom: '24px',
                  fontSize: '14px',
                  color: '#FF6B6B'
                }}>
                  {error}
                </div>
              )}
              
              <button
                onClick={handleGoogleSignIn}
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '16px',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#15293A',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  marginBottom: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  opacity: loading ? 0.5 : 1
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
                <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />
                <span style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.5)' }}>or</span>
                <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />
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
                      padding: '16px',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      fontSize: '16px',
                      color: '#FFFFFF',
                      outline: 'none'
                    }}
                  />
                )}
                
                <input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{
                    padding: '16px',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    fontSize: '16px',
                    color: '#FFFFFF',
                    outline: 'none'
                  }}
                />
                
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  style={{
                    padding: '16px',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    fontSize: '16px',
                    color: '#FFFFFF',
                    outline: 'none'
                  }}
                />
                
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    padding: '16px',
                    background: 'linear-gradient(135deg, #29BD98 0%, #2497F9 100%)',
                    border: 'none',
                    borderRadius: '12px',
                    fontSize: '16px',
                    fontWeight: '700',
                    color: '#FFFFFF',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    marginTop: '8px',
                    opacity: loading ? 0.5 : 1
                  }}
                >
                  {loading ? 'Please wait...' : (authMode === 'signup' ? 'Create Account' : 'Sign In')}
                </button>
              </form>
              
              <div style={{
                marginTop: '24px',
                textAlign: 'center',
                fontSize: '14px',
                color: 'rgba(255, 255, 255, 0.6)'
              }}>
                {authMode === 'signup' ? 'Already have an account?' : "Don't have an account?"}
                <button
                  onClick={() => {
                    setAuthMode(authMode === 'signup' ? 'login' : 'signup');
                    setError('');
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#29BD98',
                    fontWeight: '600',
                    cursor: 'pointer',
                    marginLeft: '8px'
                  }}
                >
                  {authMode === 'signup' ? 'Sign In' : 'Sign Up'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default LandingPageNew;

