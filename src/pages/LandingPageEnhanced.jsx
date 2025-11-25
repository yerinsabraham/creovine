import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useAdmin } from '../context/AdminContext';
import logo from '../assets/logo.png';
import googleIcon from '../assets/google.png';

const LandingPageEnhanced = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const { signup, login, signInWithGoogle } = useAuth();
  const { isAdmin } = useAdmin();
  const navigate = useNavigate();
  const howItWorksRef = useRef(null);
  const comparisonRef = useRef(null);
  const vibeCodeRef = useRef(null);
  const pricingRef = useRef(null);
  const isHowItWorksInView = useInView(howItWorksRef, { once: true, margin: "-100px" });
  const isComparisonInView = useInView(comparisonRef, { once: true, margin: "-100px" });
  const isVibeCodeInView = useInView(vibeCodeRef, { once: true, margin: "-100px" });
  const isPricingInView = useInView(pricingRef, { once: true, margin: "-100px" });

  const handleGetStarted = () => {
    setShowAuthModal(true);
    setAuthMode('signup');
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

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#15293A' }}>
      {/* Navigation */}
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
          padding: '20px 0'
        }}
      >
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <img 
            src={logo} 
            alt="Creovine" 
            style={{
              height: '32px',
              width: 'auto',
              objectFit: 'contain',
              maxWidth: '140px'
            }}
          />
          
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
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
                  fontWeight: '600',
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
                }}
              >
                Admin Dashboard
              </motion.button>
            )}
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setShowAuthModal(true);
                setAuthMode('login');
              }}
              style={{
                background: 'transparent',
                border: '2px solid #29BD98',
                color: '#FFFFFF',
                padding: '12px 32px',
                fontSize: '16px',
                fontWeight: '700',
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              Sign In
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleGetStarted}
              style={{
                background: 'linear-gradient(135deg, #29BD98 0%, #2497F9 100%)',
                border: 'none',
                color: '#FFFFFF',
                padding: '14px 40px',
                fontSize: '16px',
                fontWeight: '700',
                borderRadius: '12px',
                cursor: 'pointer',
                boxShadow: '0 10px 30px rgba(41, 189, 152, 0.3)'
              }}
            >
              Get Started
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section style={{
        paddingTop: '140px',
        paddingBottom: '80px',
        textAlign: 'center',
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '140px 24px 80px'
      }}>
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          style={{
            fontSize: '72px',
            fontWeight: '900',
            marginBottom: '24px',
            lineHeight: '1.1',
            color: '#FFFFFF'
          }}
        >
          Turn Your <span style={{
            background: 'linear-gradient(135deg, #29BD98 0%, #2497F9 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>Idea Into Reality</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
          style={{
            fontSize: '24px',
            color: '#FFFFFF',
            marginBottom: '48px',
            maxWidth: '700px',
            margin: '0 auto 48px',
            lineHeight: '1.6',
            fontWeight: '500'
          }}
        >
          Build your dream app in record time with our intelligent platform. No coding required.
        </motion.p>
        
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4, ease: 'easeOut' }}
          whileHover={{ scale: 1.05, y: -3 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleGetStarted}
          style={{
            background: 'linear-gradient(135deg, #29BD98 0%, #2497F9 100%)',
            border: 'none',
            color: '#FFFFFF',
            padding: '20px 60px',
            fontSize: '20px',
            fontWeight: '700',
            borderRadius: '16px',
            cursor: 'pointer',
            boxShadow: '0 20px 50px rgba(41, 189, 152, 0.4)',
            marginBottom: '80px'
          }}
        >
          Start Building Now →
        </motion.button>

        {/* Stats */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6, ease: 'easeOut' }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '48px',
            maxWidth: '900px',
            margin: '0 auto',
            paddingTop: '48px',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        >
          {[
            { number: '500+', label: 'Apps Built' },
            { number: '98%', label: 'Success Rate' },
            { number: '3-5 Days', label: 'Average Time' }
          ].map((stat, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
            >
              <div style={{
                fontSize: '48px',
                fontWeight: '900',
                background: 'linear-gradient(135deg, #29BD98 0%, #2497F9 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                marginBottom: '8px'
              }}>
                {stat.number}
              </div>
              <div style={{
                fontSize: '18px',
                color: '#FFFFFF',
                fontWeight: '600'
              }}>
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* How It Works */}
      <section ref={howItWorksRef} style={{
        padding: '80px 24px',
        backgroundColor: '#0B1F30',
        textAlign: 'center'
      }}>
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={isHowItWorksInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          style={{
            fontSize: '48px',
            fontWeight: '900',
            marginBottom: '64px',
            color: '#FFFFFF'
          }}
        >
          How It <span style={{
            background: 'linear-gradient(135deg, #29BD98 0%, #2497F9 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>Works</span>
        </motion.h2>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '32px',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          {[
            { step: '1', title: 'Share Your Vision', desc: 'Tell us about your app idea through our interactive interface' },
            { step: '2', title: 'Choose Features', desc: 'Select from hundreds of pre-built features' },
            { step: '3', title: 'We Build It', desc: 'Our expert team creates your app with clean code' },
            { step: '4', title: 'Launch & Grow', desc: 'Deploy your app and start growing' }
          ].map((item, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={isHowItWorksInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              style={{
                backgroundColor: '#214055',
                padding: '40px 32px',
                borderRadius: '16px',
                border: '2px solid rgba(41, 189, 152, 0.2)',
                transition: 'border-color 0.3s ease',
                cursor: 'pointer'
              }}
            >
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #29BD98 0%, #2497F9 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '28px',
                fontWeight: '900',
                color: '#FFFFFF',
                margin: '0 auto 24px'
              }}>
                {item.step}
              </div>
              <h3 style={{
                fontSize: '22px',
                fontWeight: '700',
                marginBottom: '12px',
                color: '#FFFFFF'
              }}>
                {item.title}
              </h3>
              <p style={{
                fontSize: '16px',
                color: 'rgba(255, 255, 255, 0.7)',
                lineHeight: '1.6'
              }}>
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        padding: '80px 24px',
        textAlign: 'center',
        backgroundColor: '#15293A'
      }}>
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{
            fontSize: '48px',
            fontWeight: '900',
            marginBottom: '24px',
            color: '#FFFFFF'
          }}
        >
          Ready to Build Your App?
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{
            fontSize: '20px',
            color: 'rgba(255, 255, 255, 0.8)',
            marginBottom: '40px'
          }}
        >
          Join hundreds of successful founders who brought their ideas to life
        </motion.p>
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          whileHover={{ scale: 1.05, y: -3 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          onClick={handleGetStarted}
          style={{
            background: 'linear-gradient(135deg, #29BD98 0%, #2497F9 100%)',
            border: 'none',
            color: '#FFFFFF',
            padding: '20px 60px',
            fontSize: '20px',
            fontWeight: '700',
            borderRadius: '16px',
            cursor: 'pointer',
            boxShadow: '0 20px 50px rgba(41, 189, 152, 0.4)'
          }}
        >
          Get Started Now →
        </motion.button>
      </section>

      {/* Auth Modal */}
      {showAuthModal && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000,
            padding: '24px'
          }}
          onClick={() => setShowAuthModal(false)}
        >
          <motion.div 
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            style={{
              backgroundColor: '#214055',
              borderRadius: '20px',
              padding: '48px',
              maxWidth: '480px',
              width: '100%',
              boxShadow: '0 25px 80px rgba(0, 0, 0, 0.5)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{
              fontSize: '32px',
              fontWeight: '900',
              marginBottom: '32px',
              color: '#FFFFFF',
              textAlign: 'center'
            }}>
              {authMode === 'signup' ? 'Create Account' : 'Welcome Back'}
            </h2>

            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              style={{
                width: '100%',
                background: '#FFFFFF',
                border: 'none',
                color: '#15293A',
                padding: '16px',
                fontSize: '16px',
                fontWeight: '700',
                borderRadius: '12px',
                cursor: 'pointer',
                marginBottom: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px'
              }}
            >
              <img src={googleIcon} alt="Google" style={{ width: '20px', height: '20px' }} />
              Continue with Google
            </button>

            <div style={{
              textAlign: 'center',
              color: 'rgba(255, 255, 255, 0.6)',
              margin: '24px 0',
              fontSize: '14px'
            }}>
              OR
            </div>

            <form onSubmit={handleEmailAuth}>
              {authMode === 'signup' && (
                <input
                  type="text"
                  placeholder="Full Name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '16px',
                    marginBottom: '16px',
                    backgroundColor: '#15293A',
                    border: '2px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    color: '#FFFFFF',
                    fontSize: '16px',
                    outline: 'none',
                    boxSizing: 'border-box'
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
                  width: '100%',
                  padding: '16px',
                  marginBottom: '16px',
                  backgroundColor: '#15293A',
                  border: '2px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  color: '#FFFFFF',
                  fontSize: '16px',
                  outline: 'none',
                  boxSizing: 'border-box'
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
                  width: '100%',
                  padding: '16px',
                  marginBottom: '24px',
                  backgroundColor: '#15293A',
                  border: '2px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  color: '#FFFFFF',
                  fontSize: '16px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />

              {error && (
                <div style={{
                  padding: '12px',
                  backgroundColor: 'rgba(244, 67, 54, 0.2)',
                  border: '1px solid #f44336',
                  borderRadius: '8px',
                  color: '#f44336',
                  marginBottom: '16px',
                  fontSize: '14px'
                }}>
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, #29BD98 0%, #2497F9 100%)',
                  border: 'none',
                  color: '#FFFFFF',
                  padding: '16px',
                  fontSize: '16px',
                  fontWeight: '700',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  marginBottom: '16px'
                }}
              >
                {loading ? 'Please wait...' : (authMode === 'signup' ? 'Create Account' : 'Sign In')}
              </button>
            </form>

            <div style={{
              textAlign: 'center',
              color: 'rgba(255, 255, 255, 0.7)',
              fontSize: '14px'
            }}>
              {authMode === 'signup' ? 'Already have an account? ' : "Don't have an account? "}
              <button
                onClick={() => setAuthMode(authMode === 'signup' ? 'login' : 'signup')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#29BD98',
                  fontWeight: '700',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                {authMode === 'signup' ? 'Sign In' : 'Sign Up'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default LandingPageEnhanced;
