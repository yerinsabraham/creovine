import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaEnvelope, FaLock, FaUser, FaGoogle } from 'react-icons/fa';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../../config/firebase';

const ExpertAuthModal = ({ isOpen, onClose, onSuccess, expertName }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        // Update display name for new users
        if (name && userCredential.user) {
          await userCredential.user.updateProfile({ displayName: name });
        }
      }
      onSuccess();
    } catch (err) {
      setError(err.message.replace('Firebase: ', '').replace(/\(auth\/[^)]+\)\.?/, ''));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    setError('');

    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      onSuccess();
    } catch (err) {
      setError(err.message.replace('Firebase: ', '').replace(/\(auth\/[^)]+\)\.?/, ''));
    } finally {
      setLoading(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && !loading) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleBackdropClick}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(8px)',
          padding: '20px'
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          style={{
            backgroundColor: '#214055',
            borderRadius: '24px',
            padding: '40px',
            maxWidth: '480px',
            width: '100%',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
            position: 'relative'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            disabled={loading}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              background: 'transparent',
              border: 'none',
              color: 'rgba(255, 255, 255, 0.6)',
              fontSize: '20px',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'color 0.2s ease',
              padding: '8px'
            }}
            onMouseEnter={(e) => !loading && (e.target.style.color = '#FFFFFF')}
            onMouseLeave={(e) => (e.target.style.color = 'rgba(255, 255, 255, 0.6)')}
          >
            <FaTimes />
          </button>

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h2 style={{
              fontSize: '32px',
              fontWeight: '800',
              color: '#FFFFFF',
              marginBottom: '12px'
            }}>
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p style={{
              fontSize: '16px',
              color: 'rgba(255, 255, 255, 0.7)',
              lineHeight: '1.5'
            }}>
              {isLogin 
                ? `Sign in to chat with ${expertName}` 
                : `Create an account to start chatting with ${expertName}`
              }
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '12px',
                padding: '12px 16px',
                marginBottom: '24px',
                color: '#EF4444',
                fontSize: '14px',
                textAlign: 'center'
              }}
            >
              {error}
            </motion.div>
          )}

          {/* Google Sign In */}
          <button
            onClick={handleGoogleAuth}
            disabled={loading}
            style={{
              width: '100%',
              backgroundColor: '#FFFFFF',
              border: 'none',
              borderRadius: '12px',
              padding: '16px',
              color: '#15293A',
              fontSize: '16px',
              fontWeight: '700',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              marginBottom: '24px',
              opacity: loading ? 0.6 : 1
            }}
            onMouseEnter={(e) => !loading && (e.target.style.transform = 'scale(1.02)')}
            onMouseLeave={(e) => (e.target.style.transform = 'scale(1)')}
          >
            <FaGoogle style={{ fontSize: '20px' }} />
            {isLogin ? 'Sign in with Google' : 'Sign up with Google'}
          </button>

          {/* Divider */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '24px'
          }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />
            <span style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '14px' }}>or</span>
            <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleEmailAuth}>
            {!isLogin && (
              <div style={{ marginBottom: '16px' }}>
                <label style={{
                  display: 'block',
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: '14px',
                  fontWeight: '600',
                  marginBottom: '8px'
                }}>
                  Full Name
                </label>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: '#15293A',
                  border: '2px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  padding: '14px 16px',
                  transition: 'border-color 0.2s ease'
                }}>
                  <FaUser style={{ color: 'rgba(255, 255, 255, 0.4)', marginRight: '12px' }} />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required={!isLogin}
                    disabled={loading}
                    placeholder="John Doe"
                    style={{
                      flex: 1,
                      background: 'transparent',
                      border: 'none',
                      outline: 'none',
                      color: '#FFFFFF',
                      fontSize: '15px',
                      fontFamily: 'inherit'
                    }}
                  />
                </div>
              </div>
            )}

            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: '14px',
                fontWeight: '600',
                marginBottom: '8px'
              }}>
                Email
              </label>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#15293A',
                border: '2px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                padding: '14px 16px',
                transition: 'border-color 0.2s ease'
              }}>
                <FaEnvelope style={{ color: 'rgba(255, 255, 255, 0.4)', marginRight: '12px' }} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  placeholder="you@example.com"
                  style={{
                    flex: 1,
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    color: '#FFFFFF',
                    fontSize: '15px',
                    fontFamily: 'inherit'
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: '14px',
                fontWeight: '600',
                marginBottom: '8px'
              }}>
                Password
              </label>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#15293A',
                border: '2px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                padding: '14px 16px',
                transition: 'border-color 0.2s ease'
              }}>
                <FaLock style={{ color: 'rgba(255, 255, 255, 0.4)', marginRight: '12px' }} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  placeholder="••••••••"
                  minLength={6}
                  style={{
                    flex: 1,
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    color: '#FFFFFF',
                    fontSize: '15px',
                    fontFamily: 'inherit'
                  }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                background: loading ? 'rgba(41, 189, 152, 0.5)' : 'linear-gradient(135deg, #29BD98, #2497F9)',
                border: 'none',
                borderRadius: '12px',
                padding: '16px',
                color: '#FFFFFF',
                fontSize: '16px',
                fontWeight: '700',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
                marginBottom: '20px'
              }}
              onMouseEnter={(e) => !loading && (e.target.style.transform = 'scale(1.02)')}
              onMouseLeave={(e) => (e.target.style.transform = 'scale(1)')}
            >
              {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
            </button>
          </form>

          {/* Toggle Login/Signup */}
          <p style={{
            textAlign: 'center',
            color: 'rgba(255, 255, 255, 0.6)',
            fontSize: '14px'
          }}>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
              disabled={loading}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#29BD98',
                fontWeight: '700',
                cursor: loading ? 'not-allowed' : 'pointer',
                textDecoration: 'underline',
                fontSize: '14px'
              }}
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ExpertAuthModal;
